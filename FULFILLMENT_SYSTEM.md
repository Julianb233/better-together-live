# Better Together - Subscription Box Fulfillment System

## Overview

This document outlines the comprehensive fulfillment system for Better Together's physical subscription boxes. The system integrates with existing Stripe subscriptions, manages inventory, coordinates shipping, and orchestrates the entire order-to-delivery workflow.

## Architecture Diagram

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Stripe Webhook │─────>│  Order Creation  │─────>│   Inventory     │
│    (Billing)    │      │     Engine       │      │   Management    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                  │                          │
                                  v                          v
                         ┌─────────────────┐       ┌─────────────────┐
                         │  Fulfillment    │<──────│  Box Assembly   │
                         │   Workflow      │       │   & QC Engine   │
                         └─────────────────┘       └─────────────────┘
                                  │
                                  v
                         ┌─────────────────┐       ┌─────────────────┐
                         │    Shipping     │<──────│  ShipStation    │
                         │   Integration   │       │   API Client    │
                         └─────────────────┘       └─────────────────┘
                                  │
                                  v
                         ┌─────────────────┐       ┌─────────────────┐
                         │  Customer       │<──────│  Email/Push     │
                         │  Notifications  │       │  Notifications  │
                         └─────────────────┘       └─────────────────┘
```

---

## 1. Product Inventory System

### Database Schema

**Migration: `0004_fulfillment_inventory_schema.sql`**

```sql
-- Product Catalog - Master product list for subscription boxes
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK(category IN (
    'candle', 'chocolate', 'jewelry', 'game', 'book',
    'wine_accessory', 'bath_product', 'journal', 'tea',
    'aromatherapy', 'craft_kit', 'decor', 'custom'
  )),
  unit_cost_cents INTEGER NOT NULL,
  supplier_id TEXT,
  supplier_name TEXT,
  reorder_threshold INTEGER DEFAULT 50,
  reorder_quantity INTEGER DEFAULT 100,
  lead_time_days INTEGER DEFAULT 14,
  weight_lbs REAL NOT NULL,
  dimensions_inches TEXT, -- JSON: {"length": 5, "width": 3, "height": 2}
  is_customizable BOOLEAN DEFAULT FALSE,
  customization_options TEXT, -- JSON array
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Tracking - Real-time stock levels
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  warehouse_location TEXT DEFAULT 'primary',
  quantity_available INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0, -- Reserved for pending orders
  quantity_damaged INTEGER DEFAULT 0,
  last_restocked_at DATETIME,
  last_counted_at DATETIME,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Inventory Transactions - Audit trail for stock movements
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK(transaction_type IN (
    'purchase', 'sale', 'adjustment', 'damage', 'return', 'restock'
  )),
  quantity_change INTEGER NOT NULL, -- Positive = addition, Negative = reduction
  quantity_after INTEGER NOT NULL,
  reference_id TEXT, -- Link to order, purchase order, etc.
  notes TEXT,
  performed_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Low Stock Alerts - Automated reorder notifications
CREATE TABLE IF NOT EXISTS low_stock_alerts (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  alert_threshold INTEGER NOT NULL,
  current_stock INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'acknowledged', 'ordered', 'resolved')),
  alerted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  acknowledged_at DATETIME,
  acknowledged_by TEXT,
  resolved_at DATETIME,
  notes TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Box Type Definitions - Templates for subscription boxes
CREATE TABLE IF NOT EXISTS box_types (
  id TEXT PRIMARY KEY,
  box_name TEXT NOT NULL,
  box_category TEXT NOT NULL CHECK(box_category IN (
    'romance', 'adventure', 'anniversary', 'self_care', 'personalized'
  )),
  retail_price_cents INTEGER NOT NULL,
  target_cogs_cents INTEGER NOT NULL, -- Target cost of goods sold
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Box Contents - Which products go in which box types
CREATE TABLE IF NOT EXISTS box_contents (
  id TEXT PRIMARY KEY,
  box_type_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  is_required BOOLEAN DEFAULT TRUE, -- Required vs. optional item
  sort_order INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (box_type_id) REFERENCES box_types(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(box_type_id, product_id)
);

-- Product Variants - Handle customization (colors, sizes, engravings)
CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  variant_type TEXT NOT NULL, -- 'color', 'size', 'scent', 'engraving'
  variant_value TEXT NOT NULL,
  sku_suffix TEXT,
  additional_cost_cents INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Suppliers - Vendor management
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  supplier_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  payment_terms TEXT, -- "Net 30", "COD", etc.
  average_lead_time_days INTEGER,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(warehouse_location);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created ON inventory_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_product ON low_stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_low_stock_alerts_status ON low_stock_alerts(status);

CREATE INDEX IF NOT EXISTS idx_box_contents_box_type ON box_contents(box_type_id);
CREATE INDEX IF NOT EXISTS idx_box_contents_product ON box_contents(product_id);
```

### Inventory Management Logic

**Automatic Stock Reservation:**
- When order is created → reserve inventory
- When order ships → deduct from available
- When order cancels → release reservation

**Low Stock Alert System:**
- Daily cron job checks inventory levels
- Alert triggered when `quantity_available < reorder_threshold`
- Email notification to procurement team
- Auto-generate purchase order suggestions

**Batch Management:**
- Group products by supplier for bulk ordering
- Optimize reorder quantities based on subscription forecasts
- Track supplier performance (lead time accuracy, quality)

---

## 2. Shipping Integration

### ShipStation API Integration

**Why ShipStation:**
- Multi-carrier rate shopping (USPS, UPS, FedEx)
- Batch label printing
- Real-time tracking updates
- Webhook support for status changes
- Branded tracking pages

**Configuration:**
```typescript
// Environment variables
SHIPSTATION_API_KEY=<api_key>
SHIPSTATION_API_SECRET=<api_secret>
SHIPSTATION_STORE_ID=<store_id>
```

### Shipping Tables

```sql
-- Shipping Carriers - Configured carriers
CREATE TABLE IF NOT EXISTS shipping_carriers (
  id TEXT PRIMARY KEY,
  carrier_code TEXT UNIQUE NOT NULL, -- 'usps', 'ups', 'fedex'
  carrier_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  api_config TEXT, -- JSON with API credentials
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Shipping Rates - Pre-calculated or cached rates
CREATE TABLE IF NOT EXISTS shipping_rates (
  id TEXT PRIMARY KEY,
  carrier_id TEXT NOT NULL,
  service_code TEXT NOT NULL, -- 'usps_priority', 'ups_ground'
  origin_zip TEXT NOT NULL,
  dest_zip TEXT NOT NULL,
  weight_lbs REAL NOT NULL,
  rate_cents INTEGER NOT NULL,
  estimated_days INTEGER,
  cached_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME, -- Cache for 24 hours
  FOREIGN KEY (carrier_id) REFERENCES shipping_carriers(id)
);

-- Shipments - Track all shipments
CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  fulfillment_order_id TEXT NOT NULL,
  carrier_id TEXT NOT NULL,
  service_code TEXT NOT NULL,
  tracking_number TEXT UNIQUE,
  label_url TEXT,
  rate_cents INTEGER NOT NULL,
  weight_lbs REAL NOT NULL,
  dimensions_inches TEXT, -- JSON
  ship_date DATE NOT NULL,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  status TEXT DEFAULT 'pending' CHECK(status IN (
    'pending', 'label_created', 'in_transit', 'out_for_delivery',
    'delivered', 'exception', 'returned'
  )),
  status_updated_at DATETIME,
  shipstation_shipment_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (carrier_id) REFERENCES shipping_carriers(id)
);

-- Shipping Events - Tracking history
CREATE TABLE IF NOT EXISTS shipping_events (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_description TEXT,
  event_location TEXT,
  event_timestamp DATETIME NOT NULL,
  carrier_status_code TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shipments_fulfillment_order ON shipments(fulfillment_order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipping_events_shipment ON shipping_events(shipment_id);
```

### Rate Shopping Workflow

```typescript
interface ShippingRateRequest {
  originZip: string;
  destZip: string;
  weightLbs: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}

async function getRates(request: ShippingRateRequest): Promise<ShippingRate[]> {
  // 1. Check cache first (24 hour TTL)
  const cachedRates = await getCachedRates(request);
  if (cachedRates.length > 0) return cachedRates;

  // 2. Call ShipStation API for real-time rates
  const rates = await shipstation.getRates({
    carrierCode: 'all',
    fromPostalCode: request.originZip,
    toPostalCode: request.destZip,
    weight: {
      value: request.weightLbs,
      units: 'pounds'
    },
    dimensions: request.dimensions
  });

  // 3. Cache rates for future requests
  await cacheRates(request, rates);

  // 4. Return sorted by price (cheapest first)
  return rates.sort((a, b) => a.shipmentCost - b.shipmentCost);
}
```

### Label Generation

```typescript
async function generateShippingLabel(
  fulfillmentOrderId: string,
  selectedServiceCode: string
): Promise<Shipment> {
  const order = await getFulfillmentOrder(fulfillmentOrderId);

  // Create shipment in ShipStation
  const shipment = await shipstation.createLabel({
    orderId: order.id,
    carrierCode: getCarrierFromService(selectedServiceCode),
    serviceCode: selectedServiceCode,
    shipFrom: WAREHOUSE_ADDRESS,
    shipTo: order.shipping_address,
    weight: calculateBoxWeight(order.box_type_id),
    dimensions: BOX_DIMENSIONS[order.box_type_id],
    confirmation: 'delivery', // Signature confirmation
    packageCode: 'package'
  });

  // Store shipment record
  await db.prepare(`
    INSERT INTO shipments (
      id, fulfillment_order_id, carrier_id, service_code,
      tracking_number, label_url, rate_cents, weight_lbs,
      ship_date, status, shipstation_shipment_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    generateId(),
    fulfillmentOrderId,
    getCarrierId(selectedServiceCode),
    selectedServiceCode,
    shipment.trackingNumber,
    shipment.labelData,
    shipment.shipmentCost * 100,
    shipment.weight.value,
    new Date().toISOString().split('T')[0],
    'label_created',
    shipment.shipmentId
  ).run();

  // Update fulfillment order status
  await updateFulfillmentOrderStatus(fulfillmentOrderId, 'label_created');

  return shipment;
}
```

### Tracking Webhook Handler

```typescript
// Webhook endpoint: POST /api/webhooks/shipstation/tracking
async function handleShipStationWebhook(event: ShipStationEvent) {
  const { tracking_number, status, location, timestamp } = event;

  // Find shipment
  const shipment = await db.prepare(
    'SELECT * FROM shipments WHERE tracking_number = ?'
  ).bind(tracking_number).first();

  if (!shipment) return;

  // Record tracking event
  await db.prepare(`
    INSERT INTO shipping_events (
      id, shipment_id, event_type, event_description,
      event_location, event_timestamp
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    generateId(),
    shipment.id,
    status,
    event.description,
    location,
    timestamp
  ).run();

  // Update shipment status
  await db.prepare(
    'UPDATE shipments SET status = ?, status_updated_at = ? WHERE id = ?'
  ).bind(mapShipStationStatus(status), timestamp, shipment.id).run();

  // Send customer notification based on status
  if (status === 'shipped') {
    await sendTrackingNotification(shipment.fulfillment_order_id, tracking_number);
  } else if (status === 'delivered') {
    await sendDeliveryConfirmation(shipment.fulfillment_order_id);
  }
}
```

---

## 3. Order Fulfillment Workflow

### Fulfillment Tables

```sql
-- Fulfillment Orders - Master fulfillment records
CREATE TABLE IF NOT EXISTS fulfillment_orders (
  id TEXT PRIMARY KEY,
  subscription_id TEXT NOT NULL,
  relationship_id TEXT NOT NULL,
  box_type_id TEXT NOT NULL,
  order_number TEXT UNIQUE NOT NULL, -- Human-readable: BT-2024-001234

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK(status IN (
    'pending', 'processing', 'picking', 'packing',
    'quality_check', 'label_created', 'shipped',
    'delivered', 'exception', 'returned', 'canceled'
  )),

  -- Dates
  order_date DATETIME NOT NULL,
  scheduled_ship_date DATE NOT NULL, -- When this should ship
  actual_ship_date DATE,
  estimated_delivery_date DATE,
  delivered_date DATE,

  -- Shipping details
  shipping_address TEXT NOT NULL, -- JSON
  billing_address TEXT NOT NULL, -- JSON

  -- Customization
  customization_preferences TEXT, -- JSON: partner preferences, messages
  gift_message TEXT, -- Hidden from recipient until delivered
  is_gift BOOLEAN DEFAULT FALSE,
  gift_recipient_user_id TEXT,

  -- Fulfillment details
  picker_id TEXT, -- Staff member who picked items
  packer_id TEXT, -- Staff member who packed
  qc_by TEXT, -- Quality control inspector
  picked_at DATETIME,
  packed_at DATETIME,
  qc_at DATETIME,

  -- Notes and special instructions
  notes TEXT,
  internal_notes TEXT, -- Not visible to customer

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (box_type_id) REFERENCES box_types(id),
  FOREIGN KEY (gift_recipient_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Fulfillment Order Items - Individual items in each order
CREATE TABLE IF NOT EXISTS fulfillment_order_items (
  id TEXT PRIMARY KEY,
  fulfillment_order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  variant_id TEXT, -- If customized
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_cost_cents INTEGER NOT NULL,
  customization_details TEXT, -- JSON: engraving text, color choice, etc.
  picked BOOLEAN DEFAULT FALSE,
  picked_at DATETIME,
  picked_by TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
);

-- Fulfillment Status History - Audit trail
CREATE TABLE IF NOT EXISTS fulfillment_status_history (
  id TEXT PRIMARY KEY,
  fulfillment_order_id TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  changed_by TEXT,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment_orders(id) ON DELETE CASCADE
);

-- Returns and Exchanges
CREATE TABLE IF NOT EXISTS returns (
  id TEXT PRIMARY KEY,
  fulfillment_order_id TEXT NOT NULL,
  return_reason TEXT NOT NULL CHECK(return_reason IN (
    'damaged', 'wrong_item', 'not_as_described',
    'customer_preference', 'quality_issue', 'other'
  )),
  return_status TEXT DEFAULT 'requested' CHECK(return_status IN (
    'requested', 'approved', 'rejected', 'in_transit',
    'received', 'inspected', 'refunded', 'exchanged'
  )),
  customer_notes TEXT,
  internal_notes TEXT,
  requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME,
  received_at DATETIME,
  resolved_at DATETIME,
  refund_amount_cents INTEGER,
  restocking_fee_cents INTEGER DEFAULT 0,
  FOREIGN KEY (fulfillment_order_id) REFERENCES fulfillment_orders(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_fulfillment_orders_subscription ON fulfillment_orders(subscription_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_orders_relationship ON fulfillment_orders(relationship_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_orders_status ON fulfillment_orders(status);
CREATE INDEX IF NOT EXISTS idx_fulfillment_orders_ship_date ON fulfillment_orders(scheduled_ship_date);
CREATE INDEX IF NOT EXISTS idx_fulfillment_order_items_order ON fulfillment_order_items(fulfillment_order_id);
CREATE INDEX IF NOT EXISTS idx_fulfillment_order_items_product ON fulfillment_order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_returns_fulfillment_order ON returns(fulfillment_order_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(return_status);
```

### State Machine

```typescript
type FulfillmentStatus =
  | 'pending'         // Order created, awaiting processing
  | 'processing'      // Being prepared for picking
  | 'picking'         // Items being picked from inventory
  | 'packing'         // Items being packed
  | 'quality_check'   // QC inspection
  | 'label_created'   // Shipping label generated
  | 'shipped'         // Package handed to carrier
  | 'delivered'       // Successfully delivered
  | 'exception'       // Delivery issue
  | 'returned'        // Returned to sender
  | 'canceled';       // Order canceled

const ALLOWED_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  pending: ['processing', 'canceled'],
  processing: ['picking', 'canceled'],
  picking: ['packing', 'pending'],
  packing: ['quality_check', 'picking'],
  quality_check: ['label_created', 'packing'],
  label_created: ['shipped', 'canceled'],
  shipped: ['delivered', 'exception', 'returned'],
  delivered: [],
  exception: ['shipped', 'returned'],
  returned: [],
  canceled: []
};

async function updateFulfillmentOrderStatus(
  orderId: string,
  newStatus: FulfillmentStatus,
  changedBy?: string,
  reason?: string
) {
  const order = await getFulfillmentOrder(orderId);

  // Validate transition
  if (!ALLOWED_TRANSITIONS[order.status].includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${order.status} → ${newStatus}`
    );
  }

  // Record status change
  await db.prepare(`
    INSERT INTO fulfillment_status_history
    (id, fulfillment_order_id, from_status, to_status, changed_by, reason)
    VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    generateId(),
    orderId,
    order.status,
    newStatus,
    changedBy,
    reason
  ).run();

  // Update order
  await db.prepare(
    'UPDATE fulfillment_orders SET status = ?, updated_at = ? WHERE id = ?'
  ).bind(newStatus, new Date().toISOString(), orderId).run();

  // Trigger webhooks/notifications
  await triggerStatusWebhook(orderId, newStatus);
}
```

### Picking Workflow

```typescript
async function startPickingProcess(orderId: string, pickerId: string) {
  // Update order status
  await updateFulfillmentOrderStatus(orderId, 'picking', pickerId);

  // Get pick list
  const items = await db.prepare(`
    SELECT
      foi.id,
      foi.product_id,
      foi.quantity,
      foi.customization_details,
      p.product_name,
      p.sku,
      i.warehouse_location,
      i.quantity_available
    FROM fulfillment_order_items foi
    JOIN products p ON foi.product_id = p.id
    JOIN inventory i ON p.id = i.product_id
    WHERE foi.fulfillment_order_id = ?
    ORDER BY i.warehouse_location, p.product_name
  `).bind(orderId).all();

  // Check inventory availability
  for (const item of items.results) {
    if (item.quantity_available < item.quantity) {
      throw new Error(
        `Insufficient inventory for ${item.product_name} (SKU: ${item.sku})`
      );
    }
  }

  // Reserve inventory
  for (const item of items.results) {
    await db.prepare(`
      UPDATE inventory
      SET quantity_reserved = quantity_reserved + ?
      WHERE product_id = ?
    `).bind(item.quantity, item.product_id).run();
  }

  return items.results;
}

async function markItemPicked(itemId: string, pickerId: string) {
  await db.prepare(`
    UPDATE fulfillment_order_items
    SET picked = TRUE, picked_at = ?, picked_by = ?
    WHERE id = ?
  `).bind(new Date().toISOString(), pickerId, itemId).run();

  // Check if all items picked
  const order = await db.prepare(`
    SELECT fo.id, fo.status
    FROM fulfillment_orders fo
    JOIN fulfillment_order_items foi ON fo.id = foi.fulfillment_order_id
    WHERE foi.id = ?
  `).bind(itemId).first();

  const allPicked = await db.prepare(`
    SELECT COUNT(*) as total, SUM(CASE WHEN picked = TRUE THEN 1 ELSE 0 END) as picked
    FROM fulfillment_order_items
    WHERE fulfillment_order_id = ?
  `).bind(order.id).first();

  if (allPicked.total === allPicked.picked) {
    await updateFulfillmentOrderStatus(order.id, 'packing', pickerId);
  }
}
```

### Packing & QC Workflow

```typescript
async function completePackingQC(
  orderId: string,
  packerId: string,
  qcInspector: string
) {
  // Update packing completion
  await db.prepare(`
    UPDATE fulfillment_orders
    SET packer_id = ?, packed_at = ?, status = 'quality_check'
    WHERE id = ?
  `).bind(packerId, new Date().toISOString(), orderId).run();

  // Run QC checks
  const qcChecks = [
    'all_items_present',
    'correct_quantities',
    'no_damage',
    'customization_accurate',
    'gift_message_included',
    'branded_packaging'
  ];

  // In real implementation, this would be an interactive checklist
  const qcPassed = true; // Assume all checks pass

  if (qcPassed) {
    await db.prepare(`
      UPDATE fulfillment_orders
      SET qc_by = ?, qc_at = ?, status = 'label_created'
      WHERE id = ?
    `).bind(qcInspector, new Date().toISOString(), orderId).run();

    // Automatically generate shipping label
    await generateShippingLabel(orderId, 'usps_priority');
  } else {
    // Send back to packing
    await updateFulfillmentOrderStatus(orderId, 'packing', qcInspector, 'QC failed');
  }
}
```

---

## 4. Subscription Box Scheduling

### Monthly Box Preparation Schedule

```typescript
interface BoxSchedule {
  cutoffDate: Date;        // Last day to customize
  preparationDate: Date;   // When fulfillment starts
  shipDate: Date;          // Target ship date
  deliveryWindow: {
    start: Date;
    end: Date;
  };
}

function calculateMonthlySchedule(month: number, year: number): BoxSchedule {
  // Ship boxes to arrive between 1st-5th of each month
  const deliveryStart = new Date(year, month, 1);
  const deliveryEnd = new Date(year, month, 5);

  // Work backwards from delivery window
  // Assume 3-5 days shipping time
  const shipDate = new Date(year, month - 1, 26); // Ship on 26th of previous month

  // Start preparation 3 days before ship date
  const preparationDate = new Date(shipDate);
  preparationDate.setDate(shipDate.getDate() - 3);

  // Cutoff for customization 5 days before ship
  const cutoffDate = new Date(shipDate);
  cutoffDate.setDate(shipDate.getDate() - 5);

  return {
    cutoffDate,
    preparationDate,
    shipDate,
    deliveryWindow: { start: deliveryStart, end: deliveryEnd }
  };
}
```

### Automated Order Creation from Subscriptions

```sql
-- Scheduled job runs daily to create upcoming fulfillment orders
-- Cron: 0 2 * * * (2 AM daily)

CREATE TABLE IF NOT EXISTS fulfillment_batch_jobs (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL CHECK(job_type IN ('monthly_boxes', 'gift_boxes', 'restock')),
  scheduled_for DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'completed', 'failed')),
  orders_created INTEGER DEFAULT 0,
  errors TEXT, -- JSON array of errors
  started_at DATETIME,
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

```typescript
async function createMonthlyFulfillmentOrders(targetMonth: number, targetYear: number) {
  const schedule = calculateMonthlySchedule(targetMonth, targetYear);

  // Get all active subscriptions that include boxes
  const subscriptions = await db.prepare(`
    SELECT
      s.id as subscription_id,
      s.relationship_id,
      s.user_id,
      sa.addon_type,
      r.user_1_id,
      r.user_2_id
    FROM subscriptions s
    LEFT JOIN user_addons ua ON s.relationship_id = ua.relationship_id
    LEFT JOIN subscription_addons sa ON ua.addon_id = sa.id
    JOIN relationships r ON s.relationship_id = r.id
    WHERE s.status = 'active'
      AND (
        s.plan_id IN (SELECT id FROM subscription_plans WHERE plan_type = 'premium_plus')
        OR (sa.addon_type = 'surprise_box' AND ua.status = 'active')
      )
  `).all();

  for (const sub of subscriptions.results) {
    // Get couple preferences
    const preferences = await getRelationshipPreferences(sub.relationship_id);

    // Determine box type based on preferences and history
    const boxTypeId = await selectBoxType(sub.relationship_id, preferences);

    // Get shipping address
    const shippingAddress = await getShippingAddress(sub.relationship_id);

    // Create fulfillment order
    const orderId = generateId();
    const orderNumber = `BT-${targetYear}-${String(orderId).slice(-6)}`;

    await db.prepare(`
      INSERT INTO fulfillment_orders (
        id, subscription_id, relationship_id, box_type_id,
        order_number, order_date, scheduled_ship_date,
        shipping_address, billing_address, status,
        customization_preferences
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      orderId,
      sub.subscription_id,
      sub.relationship_id,
      boxTypeId,
      orderNumber,
      new Date().toISOString(),
      schedule.shipDate.toISOString().split('T')[0],
      JSON.stringify(shippingAddress),
      JSON.stringify(shippingAddress),
      'pending',
      JSON.stringify(preferences)
    ).run();

    // Create order items based on box contents
    await createFulfillmentOrderItems(orderId, boxTypeId, preferences);
  }
}

async function selectBoxType(
  relationshipId: string,
  preferences: any
): Promise<string> {
  // AI-driven box selection based on:
  // 1. Past satisfaction ratings
  // 2. Love languages
  // 3. Activity history
  // 4. Seasonal factors
  // 5. Variety (don't send same box twice in a row)

  const history = await db.prepare(`
    SELECT box_type_id, COUNT(*) as count
    FROM fulfillment_orders
    WHERE relationship_id = ?
      AND status IN ('shipped', 'delivered')
    GROUP BY box_type_id
    ORDER BY MAX(order_date) DESC
  `).bind(relationshipId).all();

  // Get love languages
  const couple = await db.prepare(`
    SELECT
      u1.love_language_primary as user1_love,
      u2.love_language_primary as user2_love
    FROM relationships r
    JOIN users u1 ON r.user_1_id = u1.id
    JOIN users u2 ON r.user_2_id = u2.id
    WHERE r.id = ?
  `).bind(relationshipId).first();

  // Mapping: love language → preferred box types
  const loveLanguageMapping = {
    receiving_gifts: ['romance', 'personalized'],
    quality_time: ['adventure', 'self_care'],
    physical_touch: ['romance'],
    words_of_affirmation: ['personalized'],
    acts_of_service: ['self_care']
  };

  // Select box that matches love languages and hasn't been sent recently
  // Implementation would use more sophisticated logic
  return 'box_type_romance_001'; // Placeholder
}
```

### Partner Preference Incorporation

```typescript
async function applyCustomization(
  orderId: string,
  preferences: RelationshipPreferences
) {
  const order = await getFulfillmentOrder(orderId);
  const items = await getFulfillmentOrderItems(orderId);

  for (const item of items) {
    const product = await getProduct(item.product_id);

    // Apply customization based on product and preferences
    if (product.is_customizable) {
      const customization: any = {};

      // Engraving (jewelry, keepsakes)
      if (product.category === 'jewelry') {
        customization.engraving = preferences.couple_names ||
                                   `${preferences.user1_name} & ${preferences.user2_name}`;
      }

      // Scent selection (candles, bath products)
      if (product.category === 'candle' || product.category === 'bath_product') {
        customization.scent = preferences.favorite_scents?.[0] || 'vanilla';
      }

      // Color preferences
      if (product.customization_options?.includes('color')) {
        customization.color = preferences.favorite_colors?.[0] || 'rose_gold';
      }

      await db.prepare(`
        UPDATE fulfillment_order_items
        SET customization_details = ?
        WHERE id = ?
      `).bind(JSON.stringify(customization), item.id).run();
    }
  }
}
```

### Gift Message Handling

```typescript
async function addGiftMessage(
  orderId: string,
  message: string,
  recipientUserId: string
) {
  // Mark order as gift
  await db.prepare(`
    UPDATE fulfillment_orders
    SET is_gift = TRUE,
        gift_message = ?,
        gift_recipient_user_id = ?
    WHERE id = ?
  `).bind(message, recipientUserId, orderId).run();

  // Important: Gift message is NOT revealed until package is delivered
  // This creates the "surprise" element

  // Schedule reveal notification
  await scheduleGiftReveal(orderId, recipientUserId);
}

async function scheduleGiftReveal(orderId: string, recipientId: string) {
  // When shipment status changes to 'delivered', trigger notification
  // to recipient with the gift message

  // This is handled in the webhook handler
}
```

---

## 5. API Endpoints Design

### Fulfillment API Routes

```typescript
// src/api/fulfillment.ts

import { Hono } from 'hono';
import type { Env } from '../types';

const fulfillmentRoutes = new Hono<{ Bindings: Env }>();

/**
 * POST /api/fulfillment/create-order
 * Create fulfillment order from subscription
 */
fulfillmentRoutes.post('/create-order', async (c) => {
  const {
    subscription_id,
    relationship_id,
    box_type_id,
    shipping_address
  } = await c.req.json();

  // Validate subscription is active
  const subscription = await c.env.DB.prepare(
    'SELECT * FROM subscriptions WHERE id = ? AND status = ?'
  ).bind(subscription_id, 'active').first();

  if (!subscription) {
    return c.json({ error: 'Invalid or inactive subscription' }, 400);
  }

  // Create fulfillment order
  const orderId = generateId();
  const orderNumber = `BT-${new Date().getFullYear()}-${orderId.slice(-6)}`;

  await c.env.DB.prepare(`
    INSERT INTO fulfillment_orders (
      id, subscription_id, relationship_id, box_type_id,
      order_number, order_date, scheduled_ship_date,
      shipping_address, billing_address, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    orderId,
    subscription_id,
    relationship_id,
    box_type_id,
    orderNumber,
    new Date().toISOString(),
    getNextShipDate().toISOString().split('T')[0],
    JSON.stringify(shipping_address),
    JSON.stringify(shipping_address),
    'pending'
  ).run();

  // Create order items
  await createFulfillmentOrderItems(c.env.DB, orderId, box_type_id);

  return c.json({
    success: true,
    order_id: orderId,
    order_number: orderNumber,
    status: 'pending'
  });
});

/**
 * GET /api/fulfillment/orders/:status
 * List orders by status
 */
fulfillmentRoutes.get('/orders/:status', async (c) => {
  const status = c.req.param('status');
  const limit = c.req.query('limit') || '50';
  const offset = c.req.query('offset') || '0';

  const orders = await c.env.DB.prepare(`
    SELECT
      fo.*,
      bt.box_name,
      bt.box_category,
      COUNT(foi.id) as item_count
    FROM fulfillment_orders fo
    JOIN box_types bt ON fo.box_type_id = bt.id
    LEFT JOIN fulfillment_order_items foi ON fo.id = foi.fulfillment_order_id
    WHERE fo.status = ?
    GROUP BY fo.id
    ORDER BY fo.scheduled_ship_date DESC
    LIMIT ? OFFSET ?
  `).bind(status, limit, offset).all();

  return c.json({
    success: true,
    orders: orders.results,
    count: orders.results.length
  });
});

/**
 * PUT /api/fulfillment/orders/:id/status
 * Update order status
 */
fulfillmentRoutes.put('/orders/:id/status', async (c) => {
  const orderId = c.req.param('id');
  const { status, changed_by, reason } = await c.req.json();

  try {
    await updateFulfillmentOrderStatus(
      c.env.DB,
      orderId,
      status,
      changed_by,
      reason
    );

    return c.json({ success: true, status });
  } catch (error) {
    return c.json({
      error: error.message
    }, 400);
  }
});

/**
 * POST /api/fulfillment/generate-label
 * Generate shipping label
 */
fulfillmentRoutes.post('/generate-label', async (c) => {
  const { order_id, service_code } = await c.req.json();

  try {
    const shipment = await generateShippingLabel(
      c.env.DB,
      order_id,
      service_code
    );

    return c.json({
      success: true,
      tracking_number: shipment.trackingNumber,
      label_url: shipment.labelData,
      rate_cents: shipment.shipmentCost * 100
    });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /api/fulfillment/tracking/:order_id
 * Get tracking info for an order
 */
fulfillmentRoutes.get('/tracking/:order_id', async (c) => {
  const orderId = c.req.param('order_id');

  const shipment = await c.env.DB.prepare(`
    SELECT
      s.*,
      sc.carrier_name,
      fo.order_number
    FROM shipments s
    JOIN shipping_carriers sc ON s.carrier_id = sc.id
    JOIN fulfillment_orders fo ON s.fulfillment_order_id = fo.id
    WHERE s.fulfillment_order_id = ?
  `).bind(orderId).first();

  if (!shipment) {
    return c.json({ error: 'No shipment found' }, 404);
  }

  // Get tracking events
  const events = await c.env.DB.prepare(`
    SELECT * FROM shipping_events
    WHERE shipment_id = ?
    ORDER BY event_timestamp DESC
  `).bind(shipment.id).all();

  return c.json({
    success: true,
    tracking_number: shipment.tracking_number,
    carrier: shipment.carrier_name,
    status: shipment.status,
    estimated_delivery: shipment.estimated_delivery_date,
    events: events.results
  });
});

export default fulfillmentRoutes;
```

### Inventory API Routes

```typescript
// src/api/inventory.ts

const inventoryRoutes = new Hono<{ Bindings: Env }>();

/**
 * GET /api/inventory/products
 * List products with inventory levels
 */
inventoryRoutes.get('/products', async (c) => {
  const category = c.req.query('category');
  const lowStock = c.req.query('low_stock') === 'true';

  let query = `
    SELECT
      p.*,
      i.quantity_available,
      i.quantity_reserved,
      i.warehouse_location,
      i.last_restocked_at,
      s.supplier_name
    FROM products p
    LEFT JOIN inventory i ON p.id = i.product_id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE p.is_active = TRUE
  `;

  const bindings: any[] = [];

  if (category) {
    query += ' AND p.category = ?';
    bindings.push(category);
  }

  if (lowStock) {
    query += ' AND i.quantity_available < p.reorder_threshold';
  }

  query += ' ORDER BY p.product_name';

  const products = await c.env.DB.prepare(query).bind(...bindings).all();

  return c.json({
    success: true,
    products: products.results
  });
});

/**
 * PUT /api/inventory/products/:id/stock
 * Update stock levels
 */
inventoryRoutes.put('/products/:id/stock', async (c) => {
  const productId = c.req.param('id');
  const {
    quantity_change,
    transaction_type,
    notes,
    performed_by
  } = await c.req.json();

  // Get current inventory
  const inventory = await c.env.DB.prepare(
    'SELECT * FROM inventory WHERE product_id = ?'
  ).bind(productId).first();

  if (!inventory) {
    return c.json({ error: 'Product not found in inventory' }, 404);
  }

  const newQuantity = inventory.quantity_available + quantity_change;

  if (newQuantity < 0) {
    return c.json({ error: 'Insufficient inventory' }, 400);
  }

  // Update inventory
  await c.env.DB.prepare(`
    UPDATE inventory
    SET quantity_available = ?, updated_at = ?
    WHERE product_id = ?
  `).bind(newQuantity, new Date().toISOString(), productId).run();

  // Record transaction
  await c.env.DB.prepare(`
    INSERT INTO inventory_transactions (
      id, product_id, transaction_type, quantity_change,
      quantity_after, notes, performed_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    generateId(),
    productId,
    transaction_type,
    quantity_change,
    newQuantity,
    notes,
    performed_by
  ).run();

  // Check for low stock
  const product = await c.env.DB.prepare(
    'SELECT reorder_threshold FROM products WHERE id = ?'
  ).bind(productId).first();

  if (newQuantity < product.reorder_threshold) {
    await createLowStockAlert(c.env.DB, productId, newQuantity);
  }

  return c.json({
    success: true,
    new_quantity: newQuantity
  });
});

/**
 * POST /api/inventory/low-stock-alerts
 * Configure low stock alerts
 */
inventoryRoutes.post('/low-stock-alerts', async (c) => {
  const { product_id, alert_threshold } = await c.req.json();

  await c.env.DB.prepare(`
    UPDATE products
    SET reorder_threshold = ?
    WHERE id = ?
  `).bind(alert_threshold, product_id).run();

  return c.json({ success: true });
});

/**
 * GET /api/inventory/low-stock-alerts
 * Get all active low stock alerts
 */
inventoryRoutes.get('/low-stock-alerts', async (c) => {
  const alerts = await c.env.DB.prepare(`
    SELECT
      lsa.*,
      p.product_name,
      p.sku,
      p.reorder_quantity,
      s.supplier_name
    FROM low_stock_alerts lsa
    JOIN products p ON lsa.product_id = p.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    WHERE lsa.status IN ('pending', 'acknowledged')
    ORDER BY lsa.alerted_at DESC
  `).all();

  return c.json({
    success: true,
    alerts: alerts.results
  });
});

export default inventoryRoutes;
```

---

## 6. Webhook Integration (from Stripe)

### Stripe Subscription Event Handling

```typescript
// src/api/webhooks/stripe.ts

async function handleStripeWebhook(event: Stripe.Event, db: D1Database) {
  // Log webhook
  await db.prepare(`
    INSERT INTO stripe_webhooks (
      id, event_id, event_type, event_data, processed
    ) VALUES (?, ?, ?, ?, ?)
  `).bind(
    generateId(),
    event.id,
    event.type,
    JSON.stringify(event),
    false
  ).run();

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object, db);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object, db);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object, db);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object, db);
        break;
    }

    // Mark as processed
    await db.prepare(
      'UPDATE stripe_webhooks SET processed = TRUE, processed_at = ? WHERE event_id = ?'
    ).bind(new Date().toISOString(), event.id).run();

  } catch (error) {
    // Log error
    await db.prepare(
      'UPDATE stripe_webhooks SET error_message = ? WHERE event_id = ?'
    ).bind(error.message, event.id).run();
    throw error;
  }
}

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  db: D1Database
) {
  const subscriptionId = invoice.subscription as string;

  // Get subscription from database
  const subscription = await db.prepare(
    'SELECT * FROM subscriptions WHERE stripe_subscription_id = ?'
  ).bind(subscriptionId).first();

  if (!subscription) return;

  // Check if subscription includes boxes
  const includesBoxes = await shouldCreateFulfillmentOrder(db, subscription.id);

  if (includesBoxes) {
    // Calculate next box ship date
    const nextShipDate = calculateNextShipDate();

    // Create fulfillment order
    await createMonthlyFulfillmentOrder(
      db,
      subscription.id,
      subscription.relationship_id,
      nextShipDate
    );
  }
}

async function shouldCreateFulfillmentOrder(
  db: D1Database,
  subscriptionId: string
): Promise<boolean> {
  // Check if plan includes boxes (Premium Plus)
  const subscription = await db.prepare(`
    SELECT sp.plan_type
    FROM subscriptions s
    JOIN subscription_plans sp ON s.plan_id = sp.id
    WHERE s.id = ?
  `).bind(subscriptionId).first();

  if (subscription?.plan_type === 'premium_plus') {
    return true;
  }

  // Check if user has surprise box add-on
  const hasBoxAddon = await db.prepare(`
    SELECT COUNT(*) as count
    FROM user_addons ua
    JOIN subscription_addons sa ON ua.addon_id = sa.id
    JOIN subscriptions s ON ua.relationship_id = s.relationship_id
    WHERE s.id = ?
      AND sa.addon_type = 'surprise_box'
      AND ua.status = 'active'
  `).bind(subscriptionId).first();

  return hasBoxAddon.count > 0;
}

async function handleSubscriptionCanceled(
  subscription: Stripe.Subscription,
  db: D1Database
) {
  const stripeSubId = subscription.id;

  // Cancel any pending fulfillment orders
  await db.prepare(`
    UPDATE fulfillment_orders
    SET status = 'canceled', updated_at = ?
    WHERE subscription_id = (
      SELECT id FROM subscriptions WHERE stripe_subscription_id = ?
    ) AND status IN ('pending', 'processing')
  `).bind(new Date().toISOString(), stripeSubId).run();

  // Release reserved inventory
  await releaseInventoryForCanceledOrders(db, stripeSubId);
}
```

---

## 7. Database Migrations

### Migration File: `0004_fulfillment_inventory_schema.sql`

```sql
-- Better Together: Fulfillment & Inventory Management Schema
-- Comprehensive system for subscription box fulfillment

-- Products table (see section 1)
CREATE TABLE IF NOT EXISTS products (...);

-- Inventory table (see section 1)
CREATE TABLE IF NOT EXISTS inventory (...);

-- ... (All tables from sections 1-3)

-- Seed initial data
INSERT INTO shipping_carriers (id, carrier_code, carrier_name, is_active) VALUES
  ('carrier_usps', 'usps', 'USPS', TRUE),
  ('carrier_ups', 'ups', 'UPS', TRUE),
  ('carrier_fedex', 'fedex', 'FedEx', TRUE);

INSERT INTO box_types (id, box_name, box_category, retail_price_cents, target_cogs_cents, is_active) VALUES
  ('box_type_romance_001', 'Romance Box', 'romance', 6000, 2425, TRUE),
  ('box_type_adventure_001', 'Adventure Date Box', 'adventure', 8500, 3250, TRUE),
  ('box_type_anniversary_001', 'Anniversary Box', 'anniversary', 12000, 4500, TRUE),
  ('box_type_selfcare_001', 'Self-Care Box', 'self_care', 5000, 2125, TRUE),
  ('box_type_personalized_001', 'Personalized Box', 'personalized', 10000, 3775, TRUE);
```

### Migration Execution

```bash
# Local development
npx wrangler d1 migrations apply better-together-db --local

# Production
npx wrangler d1 migrations apply better-together-db
```

---

## 8. Notification Triggers

### Email Notifications

```typescript
interface EmailTemplate {
  template: string;
  subject: string;
  data: Record<string, any>;
}

async function sendOrderConfirmation(orderId: string) {
  const order = await getFulfillmentOrderWithDetails(orderId);

  const template: EmailTemplate = {
    template: 'order_confirmed',
    subject: `Your ${order.box_name} is confirmed!`,
    data: {
      order_number: order.order_number,
      box_name: order.box_name,
      estimated_delivery: order.estimated_delivery_date,
      items: order.items,
      shipping_address: order.shipping_address
    }
  };

  await sendEmail(order.customer_email, template);
}

async function sendShippingNotification(orderId: string, trackingNumber: string) {
  const order = await getFulfillmentOrderWithDetails(orderId);

  const template: EmailTemplate = {
    template: 'order_shipped',
    subject: `Your ${order.box_name} is on the way!`,
    data: {
      order_number: order.order_number,
      box_name: order.box_name,
      tracking_number: trackingNumber,
      tracking_url: getTrackingUrl(trackingNumber),
      estimated_delivery: order.estimated_delivery_date
    }
  };

  await sendEmail(order.customer_email, template);

  // If it's a gift, DON'T reveal to recipient yet
  if (order.is_gift) {
    await scheduleGiftRevealEmail(orderId, order.gift_recipient_user_id);
  }
}

async function sendDeliveryConfirmation(orderId: string) {
  const order = await getFulfillmentOrderWithDetails(orderId);

  const template: EmailTemplate = {
    template: 'order_delivered',
    subject: `Your ${order.box_name} has arrived!`,
    data: {
      order_number: order.order_number,
      box_name: order.box_name,
      feedback_url: `https://bettertogether.live/feedback/${orderId}`
    }
  };

  await sendEmail(order.customer_email, template);

  // If gift, NOW reveal the message to recipient
  if (order.is_gift) {
    await sendGiftRevealEmail(orderId);
  }
}

async function sendGiftRevealEmail(orderId: string) {
  const order = await getFulfillmentOrderWithDetails(orderId);

  const template: EmailTemplate = {
    template: 'gift_reveal',
    subject: `You received a surprise gift box!`,
    data: {
      box_name: order.box_name,
      gift_message: order.gift_message,
      sender_name: order.gift_sender_name
    }
  };

  await sendEmail(order.gift_recipient_email, template);
}
```

### Push Notification Integration Points

```typescript
// Integration with Task T5 (Push Notifications)

interface PushNotificationEvent {
  event: string;
  user_id: string;
  title: string;
  body: string;
  data: Record<string, any>;
}

async function triggerPushNotification(event: PushNotificationEvent) {
  // This will integrate with T5 push notification system
  // For now, just log the events that should trigger push notifications

  const pushEvents = [
    {
      event: 'order_confirmed',
      title: 'Box Order Confirmed',
      body: 'Your monthly box is being prepared!'
    },
    {
      event: 'order_shipped',
      title: 'Your Box Has Shipped',
      body: 'Track your package and get ready for a surprise!'
    },
    {
      event: 'out_for_delivery',
      title: 'Delivery Today',
      body: 'Your box will arrive today!'
    },
    {
      event: 'delivered',
      title: 'Box Delivered',
      body: 'Your surprise has arrived! Open it together.'
    }
  ];

  // Queue push notification for processing by T5 system
  await queuePushNotification(event);
}
```

### Notification Preferences

```sql
-- Add to user preferences
ALTER TABLE users ADD COLUMN notification_preferences TEXT; -- JSON

-- Example preferences:
{
  "email": {
    "order_confirmation": true,
    "shipping_updates": true,
    "delivery_confirmation": true
  },
  "push": {
    "order_shipped": true,
    "out_for_delivery": true,
    "delivered": true
  },
  "sms": {
    "delivery_today": true
  }
}
```

---

## 9. Error Handling & Retry Logic

### Retry Configuration

```typescript
interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  retryableErrors: string[];
}

const FULFILLMENT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 5,
  initialDelayMs: 1000,
  maxDelayMs: 60000,
  backoffMultiplier: 2,
  retryableErrors: [
    'ETIMEDOUT',
    'ECONNRESET',
    'RATE_LIMITED',
    'INVENTORY_UNAVAILABLE',
    'SHIPSTATION_API_ERROR'
  ]
};

async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = FULFILLMENT_RETRY_CONFIG
): Promise<T> {
  let lastError: Error;
  let delay = config.initialDelayMs;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      const isRetryable = config.retryableErrors.some(
        errCode => error.message.includes(errCode)
      );

      if (!isRetryable || attempt === config.maxAttempts) {
        throw error;
      }

      // Wait with exponential backoff
      await sleep(delay);
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs);
    }
  }

  throw lastError;
}
```

### Error Scenarios & Handling

| Error Type | Handling Strategy | Retry? |
|------------|-------------------|--------|
| Insufficient inventory | Hold order, alert procurement, notify customer | No |
| Shipping API timeout | Retry with exponential backoff | Yes (5x) |
| Invalid address | Flag for manual review, contact customer | No |
| Payment failed | Webhook handles via Stripe retry logic | Managed by Stripe |
| Customization error | Fallback to default, log for review | No |
| Carrier pickup failed | Reschedule pickup, update ship date | Yes (3x) |
| Damaged during QC | Remove from order, replace, restart QC | No |

### Dead Letter Queue

```sql
CREATE TABLE IF NOT EXISTS failed_operations (
  id TEXT PRIMARY KEY,
  operation_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  error_message TEXT NOT NULL,
  error_stack TEXT,
  retry_count INTEGER DEFAULT 0,
  last_retry_at DATETIME,
  data TEXT, -- JSON snapshot
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'retrying', 'manual_review', 'resolved')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 10. Returns & Exchanges

### Return Workflow

```typescript
async function initiateReturn(
  orderId: string,
  reason: string,
  customerNotes: string
) {
  const returnId = generateId();

  await db.prepare(`
    INSERT INTO returns (
      id, fulfillment_order_id, return_reason,
      customer_notes, return_status
    ) VALUES (?, ?, ?, ?, ?)
  `).bind(
    returnId,
    orderId,
    reason,
    customerNotes,
    'requested'
  ).run();

  // Send return label
  const returnLabel = await generateReturnLabel(orderId);

  // Email customer with instructions
  await sendReturnInstructions(orderId, returnLabel);

  return { return_id: returnId, return_label: returnLabel };
}

async function processReturnReceived(returnId: string) {
  // Mark return as received
  await db.prepare(`
    UPDATE returns
    SET return_status = 'received', received_at = ?
    WHERE id = ?
  `).bind(new Date().toISOString(), returnId).run();

  // Inspect returned items
  await scheduleReturnInspection(returnId);
}

async function processReturnRefund(
  returnId: string,
  refundAmountCents: number,
  restockingFeeCents: number = 0
) {
  const returnRecord = await db.prepare(
    'SELECT * FROM returns WHERE id = ?'
  ).bind(returnId).first();

  // Create Stripe refund
  const refund = await stripe.refunds.create({
    payment_intent: returnRecord.payment_intent_id,
    amount: refundAmountCents - restockingFeeCents
  });

  // Update return record
  await db.prepare(`
    UPDATE returns
    SET return_status = 'refunded',
        refund_amount_cents = ?,
        restocking_fee_cents = ?,
        resolved_at = ?
    WHERE id = ?
  `).bind(
    refundAmountCents,
    restockingFeeCents,
    new Date().toISOString(),
    returnId
  ).run();

  // Restock items if in good condition
  await restockReturnedItems(returnRecord.fulfillment_order_id);
}
```

---

## Performance & Scalability

### Expected Load

| Metric | Month 1 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Monthly boxes | 100 | 500 | 1,000 |
| Daily orders (peak) | 10 | 50 | 100 |
| Products in catalog | 50 | 100 | 200 |
| Inventory transactions/day | 50 | 250 | 500 |
| Shipping API calls/day | 20 | 100 | 200 |

### Database Optimization

- Indexes on all foreign keys and frequently queried columns
- Scheduled vacuum operations for SQLite maintenance
- Archive old fulfillment orders (>1 year) to separate table
- Cache shipping rates for 24 hours

### API Rate Limits

**ShipStation API:**
- 40 requests per minute
- Implement rate limiting with queue
- Batch operations where possible

---

## Monitoring & Alerts

### Key Metrics to Track

1. **Fulfillment Speed**
   - Time from order creation to ship
   - Target: < 3 days for 95% of orders

2. **Inventory Accuracy**
   - Physical count vs. system count
   - Target: 99% accuracy

3. **Shipping Accuracy**
   - On-time delivery rate
   - Target: 95% within delivery window

4. **Customer Satisfaction**
   - Box satisfaction rating
   - Target: > 4.5/5 average

### Alert Thresholds

```typescript
const ALERT_THRESHOLDS = {
  low_stock: 'quantity < reorder_threshold',
  delayed_orders: 'scheduled_ship_date < CURRENT_DATE AND status = "pending"',
  failed_shipments: 'status = "exception" for > 24 hours',
  high_return_rate: 'returns > 5% of delivered orders'
};
```

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Database migration 0004
- [ ] Product and inventory tables
- [ ] Basic inventory management API
- [ ] Seed initial product catalog

### Phase 2: Fulfillment Core (Weeks 3-4)
- [ ] Fulfillment order creation
- [ ] Box type configuration
- [ ] Order status workflow
- [ ] Picking and packing system

### Phase 3: Shipping Integration (Weeks 5-6)
- [ ] ShipStation API client
- [ ] Rate shopping
- [ ] Label generation
- [ ] Tracking webhooks

### Phase 4: Automation (Weeks 7-8)
- [ ] Stripe webhook integration
- [ ] Monthly batch order creation
- [ ] Automated notifications
- [ ] Low stock alerts

### Phase 5: Returns & Polish (Weeks 9-10)
- [ ] Returns workflow
- [ ] Admin dashboard for fulfillment
- [ ] Performance optimization
- [ ] Documentation and testing

---

## Testing Strategy

### Unit Tests
- Inventory calculations
- Status transitions
- Rate shopping logic
- Customization application

### Integration Tests
- Stripe webhook → order creation
- Order creation → inventory reservation
- Label generation → tracking updates
- Returns → refunds

### End-to-End Tests
1. New subscription → box creation → fulfillment → delivery
2. Gift subscription → surprise reveal workflow
3. Low inventory → alert → restock → order fulfillment
4. Return → inspection → refund → restock

---

## Security Considerations

- [ ] Validate all shipping addresses (USPS API)
- [ ] Secure storage of ShipStation API credentials
- [ ] Rate limiting on public APIs
- [ ] Audit trail for all inventory changes
- [ ] PII protection in shipping addresses
- [ ] Webhook signature verification (Stripe, ShipStation)

---

## Future Enhancements

1. **Multi-warehouse support** - Distribute inventory across regions
2. **International shipping** - Customs, duties, international carriers
3. **Subscription box swapping** - Allow customers to change box type
4. **Vendor drop-shipping** - Partner vendors ship directly
5. **Predictive inventory** - ML-based demand forecasting
6. **Mobile app for warehouse** - Barcode scanning for picking/packing
7. **Customer box customization portal** - Choose specific items

---

## Conclusion

This fulfillment system provides a complete end-to-end solution for Better Together's subscription box operations. It integrates seamlessly with existing Stripe payments, handles inventory management, coordinates shipping, and delivers a delightful customer experience through automated notifications and personalized touches.

The system is designed to scale from hundreds to thousands of monthly boxes while maintaining high margins (60-70%) and operational efficiency.

**Next Steps:**
1. Review and approve this specification
2. Begin Phase 1 implementation (database migrations)
3. Set up ShipStation account and API credentials
4. Create initial product catalog and supplier relationships
5. Build admin dashboard for fulfillment operations

---

**Document Version:** 1.0
**Last Updated:** 2025-12-17
**Author:** bt-ecommerce-specialist
**Status:** Ready for Implementation
