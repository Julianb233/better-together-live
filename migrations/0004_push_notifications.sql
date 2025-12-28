-- Better Together: Push Notifications Schema
-- Manages device tokens for FCM (Firebase Cloud Messaging) and APNs (Apple Push Notification service)

-- Device Tokens table - Store registered device tokens for push notifications
CREATE TABLE IF NOT EXISTS device_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_token TEXT UNIQUE NOT NULL, -- FCM token (Android) or APNs token (iOS)
  platform TEXT NOT NULL CHECK(platform IN ('ios', 'android')),
  device_info TEXT, -- JSON with device details (model, OS version, app version, etc.)
  is_active BOOLEAN DEFAULT TRUE, -- Can be disabled without deletion
  last_used_at TIMESTAMPTZ, -- Track when token was last successfully used
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Push Notification Log table - Track sent notifications for analytics and debugging
CREATE TABLE IF NOT EXISTS push_notification_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_token_id TEXT, -- Can be NULL if broadcast or token was deleted
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  payload TEXT, -- JSON payload sent with notification
  platform TEXT CHECK(platform IN ('ios', 'android', 'broadcast')),
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'failed', 'delivered')),
  error_message TEXT, -- Error details if failed
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ, -- If delivery confirmation is available
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (device_token_id) REFERENCES device_tokens(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_device_tokens_user ON device_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_device_tokens_platform ON device_tokens(platform);
CREATE INDEX IF NOT EXISTS idx_device_tokens_active ON device_tokens(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_push_log_user ON push_notification_log(user_id);
CREATE INDEX IF NOT EXISTS idx_push_log_status ON push_notification_log(status);
CREATE INDEX IF NOT EXISTS idx_push_log_created ON push_notification_log(created_at);
CREATE INDEX IF NOT EXISTS idx_push_log_type ON push_notification_log(notification_type);
