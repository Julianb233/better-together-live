// Sponsor Partnership Dashboard - Self-serve venue management portal
import { navigationHtml } from '../components/navigation.js'

export const sponsorDashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sponsor Dashboard | Better Together Partner Portal</title>
    <meta name="description" content="Manage your venue, offers, campaigns, and analytics on Better Together's partner platform.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: { 50: '#fdf2f8', 100: '#fce7f3', 500: '#ec4899', 600: '#db2777', 700: '#be185d' },
                        accent: { 500: '#8b5cf6', 600: '#7c3aed' }
                    },
                    fontFamily: { 'inter': ['Inter', 'sans-serif'] }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .tab-active { border-bottom: 3px solid #ec4899; color: #ec4899; font-weight: 600; }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    ${navigationHtml}

    <!-- Top Bar -->
    <div class="bg-white border-b sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <i class="fas fa-store text-white text-lg"></i>
                </div>
                <div>
                    <h1 class="text-lg font-bold text-gray-900" id="venueName">Partner Dashboard</h1>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <span id="venueTier" class="px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">Standard</span>
                        <span id="venueVerified" class="hidden"><i class="fas fa-check-circle text-blue-500"></i> Verified</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="showTab('settings')" class="text-gray-500 hover:text-gray-700"><i class="fas fa-cog"></i></button>
                <button onclick="window.location.href='/become-sponsor.html'" class="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition">Upgrade Plan</button>
            </div>
        </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto">
            <button onclick="showTab('overview')" class="tab-btn tab-active py-3 text-sm whitespace-nowrap" data-tab="overview">
                <i class="fas fa-chart-line mr-1"></i> Overview
            </button>
            <button onclick="showTab('offers')" class="tab-btn py-3 text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap" data-tab="offers">
                <i class="fas fa-tags mr-1"></i> Offers
            </button>
            <button onclick="showTab('bookings')" class="tab-btn py-3 text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap" data-tab="bookings">
                <i class="fas fa-calendar-check mr-1"></i> Bookings
            </button>
            <button onclick="showTab('campaigns')" class="tab-btn py-3 text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap" data-tab="campaigns">
                <i class="fas fa-bullhorn mr-1"></i> Campaigns
            </button>
            <button onclick="showTab('analytics')" class="tab-btn py-3 text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap" data-tab="analytics">
                <i class="fas fa-chart-bar mr-1"></i> Analytics
            </button>
            <button onclick="showTab('commissions')" class="tab-btn py-3 text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap" data-tab="commissions">
                <i class="fas fa-dollar-sign mr-1"></i> Commissions
            </button>
        </div>
    </div>

    <!-- Content Area -->
    <div class="max-w-7xl mx-auto px-4 py-6">

        <!-- OVERVIEW TAB -->
        <div id="tab-overview" class="tab-content fade-in">
            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="stat-card bg-white rounded-xl p-4 border">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-500 text-sm">Views (30d)</span>
                        <i class="fas fa-eye text-blue-400"></i>
                    </div>
                    <p class="text-2xl font-bold text-gray-900" id="stat-views">0</p>
                    <p class="text-xs text-green-600 mt-1"><i class="fas fa-arrow-up"></i> <span id="stat-views-change">0%</span></p>
                </div>
                <div class="stat-card bg-white rounded-xl p-4 border">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-500 text-sm">Bookings (30d)</span>
                        <i class="fas fa-calendar-check text-green-400"></i>
                    </div>
                    <p class="text-2xl font-bold text-gray-900" id="stat-bookings">0</p>
                    <p class="text-xs text-green-600 mt-1"><i class="fas fa-arrow-up"></i> <span id="stat-bookings-change">0%</span></p>
                </div>
                <div class="stat-card bg-white rounded-xl p-4 border">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-500 text-sm">Revenue (30d)</span>
                        <i class="fas fa-dollar-sign text-yellow-400"></i>
                    </div>
                    <p class="text-2xl font-bold text-gray-900" id="stat-revenue">$0</p>
                    <p class="text-xs text-green-600 mt-1"><i class="fas fa-arrow-up"></i> <span id="stat-revenue-change">0%</span></p>
                </div>
                <div class="stat-card bg-white rounded-xl p-4 border">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-500 text-sm">Couples Reached</span>
                        <i class="fas fa-heart text-pink-400"></i>
                    </div>
                    <p class="text-2xl font-bold text-gray-900" id="stat-couples">0</p>
                    <p class="text-xs text-green-600 mt-1"><i class="fas fa-arrow-up"></i> <span id="stat-couples-change">0%</span></p>
                </div>
            </div>

            <!-- Chart + Recent Activity -->
            <div class="grid md:grid-cols-3 gap-6">
                <div class="md:col-span-2 bg-white rounded-xl p-6 border">
                    <h3 class="font-semibold text-gray-900 mb-4">Performance Overview</h3>
                    <canvas id="overviewChart" height="200"></canvas>
                </div>
                <div class="bg-white rounded-xl p-6 border">
                    <h3 class="font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                    <div id="recent-bookings" class="space-y-3">
                        <p class="text-gray-400 text-sm text-center py-4">No bookings yet</p>
                    </div>
                </div>
            </div>

            <!-- Commission Balance Card -->
            <div class="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-pink-100 text-sm">Commission Balance</p>
                        <p class="text-3xl font-bold mt-1" id="commission-balance">$0.00</p>
                        <p class="text-pink-200 text-sm mt-1">15% commission on all bookings</p>
                    </div>
                    <div class="text-right">
                        <p class="text-pink-100 text-sm">Active Offers</p>
                        <p class="text-3xl font-bold mt-1" id="active-offers-count">0</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- OFFERS TAB -->
        <div id="tab-offers" class="tab-content hidden fade-in">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900">Your Offers</h2>
                <button onclick="showCreateOfferModal()" class="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition">
                    <i class="fas fa-plus mr-1"></i> Create Offer
                </button>
            </div>
            <div id="offers-list" class="space-y-4">
                <div class="bg-white rounded-xl p-8 border text-center">
                    <i class="fas fa-tags text-gray-300 text-4xl mb-3"></i>
                    <p class="text-gray-500">No offers yet. Create your first offer to start attracting couples.</p>
                </div>
            </div>
        </div>

        <!-- BOOKINGS TAB -->
        <div id="tab-bookings" class="tab-content hidden fade-in">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Bookings</h2>
            <div id="bookings-list" class="space-y-4">
                <div class="bg-white rounded-xl p-8 border text-center">
                    <i class="fas fa-calendar text-gray-300 text-4xl mb-3"></i>
                    <p class="text-gray-500">No bookings yet. Bookings will appear here once couples start redeeming your offers.</p>
                </div>
            </div>
        </div>

        <!-- CAMPAIGNS TAB -->
        <div id="tab-campaigns" class="tab-content hidden fade-in">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900">Campaigns</h2>
                <button onclick="showCreateCampaignModal()" class="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition">
                    <i class="fas fa-plus mr-1"></i> New Campaign
                </button>
            </div>

            <!-- Campaign Types -->
            <div class="grid md:grid-cols-3 gap-4 mb-6">
                <div class="bg-white rounded-xl p-5 border hover:border-pink-300 cursor-pointer transition" onclick="showCreateCampaignModal('seasonal')">
                    <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                        <i class="fas fa-snowflake text-red-500"></i>
                    </div>
                    <h4 class="font-semibold text-gray-900">Seasonal Campaign</h4>
                    <p class="text-sm text-gray-500 mt-1">Valentine's, Summer, Holiday themed promotions</p>
                </div>
                <div class="bg-white rounded-xl p-5 border hover:border-pink-300 cursor-pointer transition" onclick="showCreateCampaignModal('sponsored_package')">
                    <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                        <i class="fas fa-box-open text-purple-500"></i>
                    </div>
                    <h4 class="font-semibold text-gray-900">Sponsored Package</h4>
                    <p class="text-sm text-gray-500 mt-1">Branded date night packages for couples</p>
                </div>
                <div class="bg-white rounded-xl p-5 border hover:border-pink-300 cursor-pointer transition" onclick="showCreateCampaignModal('discover_featured')">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                        <i class="fas fa-star text-blue-500"></i>
                    </div>
                    <h4 class="font-semibold text-gray-900">Featured Placement</h4>
                    <p class="text-sm text-gray-500 mt-1">Top placement in Discover feed</p>
                </div>
            </div>

            <div id="campaigns-list" class="space-y-4">
                <div class="bg-white rounded-xl p-8 border text-center">
                    <i class="fas fa-bullhorn text-gray-300 text-4xl mb-3"></i>
                    <p class="text-gray-500">No active campaigns. Launch a campaign to boost your visibility.</p>
                </div>
            </div>
        </div>

        <!-- ANALYTICS TAB -->
        <div id="tab-analytics" class="tab-content hidden fade-in">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Analytics & Demographics</h2>

            <!-- Date Range -->
            <div class="flex gap-3 mb-6">
                <button class="px-3 py-1.5 bg-pink-500 text-white rounded-lg text-sm" onclick="setDateRange(7)">7d</button>
                <button class="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm" onclick="setDateRange(30)">30d</button>
                <button class="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm" onclick="setDateRange(90)">90d</button>
            </div>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
                <!-- Funnel -->
                <div class="bg-white rounded-xl p-6 border">
                    <h3 class="font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">Impressions</span>
                                <span class="font-medium" id="funnel-impressions">0</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-blue-500 h-2 rounded-full" style="width: 100%"></div></div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">Profile Views</span>
                                <span class="font-medium" id="funnel-views">0</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-purple-500 h-2 rounded-full" id="funnel-views-bar" style="width: 0%"></div></div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">Offer Clicks</span>
                                <span class="font-medium" id="funnel-clicks">0</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-pink-500 h-2 rounded-full" id="funnel-clicks-bar" style="width: 0%"></div></div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-600">Bookings</span>
                                <span class="font-medium" id="funnel-bookings">0</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2"><div class="bg-green-500 h-2 rounded-full" id="funnel-bookings-bar" style="width: 0%"></div></div>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                        <div class="text-center">
                            <p class="text-2xl font-bold text-pink-500" id="ctr-rate">0%</p>
                            <p class="text-xs text-gray-500">Click-through Rate</p>
                        </div>
                        <div class="text-center">
                            <p class="text-2xl font-bold text-green-500" id="conversion-rate">0%</p>
                            <p class="text-xs text-gray-500">Booking Conversion</p>
                        </div>
                    </div>
                </div>

                <!-- Demographics -->
                <div class="bg-white rounded-xl p-6 border">
                    <h3 class="font-semibold text-gray-900 mb-4">Couple Demographics</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-sm font-medium text-gray-600 mb-3">Age Distribution</h4>
                            <canvas id="ageChart" height="150"></canvas>
                        </div>
                        <div>
                            <h4 class="text-sm font-medium text-gray-600 mb-3">Relationship Status</h4>
                            <canvas id="relationshipChart" height="150"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Revenue Chart -->
            <div class="bg-white rounded-xl p-6 border">
                <h3 class="font-semibold text-gray-900 mb-4">Revenue & Bookings Over Time</h3>
                <canvas id="revenueChart" height="200"></canvas>
            </div>
        </div>

        <!-- COMMISSIONS TAB -->
        <div id="tab-commissions" class="tab-content hidden fade-in">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-900">Commission Ledger</h2>
                <div class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg">
                    <span class="text-sm">Balance:</span> <span class="font-bold" id="ledger-balance">$0.00</span>
                </div>
            </div>

            <!-- Commission Structure -->
            <div class="bg-white rounded-xl p-6 border mb-6">
                <h3 class="font-semibold text-gray-900 mb-3">Commission Structure</h3>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="text-center p-4 bg-gray-50 rounded-lg">
                        <p class="text-3xl font-bold text-gray-900">15%</p>
                        <p class="text-sm text-gray-500">Standard Tier</p>
                    </div>
                    <div class="text-center p-4 bg-purple-50 rounded-lg">
                        <p class="text-3xl font-bold text-purple-600">12%</p>
                        <p class="text-sm text-gray-500">Premium Tier</p>
                    </div>
                    <div class="text-center p-4 bg-pink-50 rounded-lg">
                        <p class="text-3xl font-bold text-pink-600">10%</p>
                        <p class="text-sm text-gray-500">Elite Tier</p>
                    </div>
                </div>
            </div>

            <div id="commission-ledger" class="space-y-3">
                <div class="bg-white rounded-xl p-8 border text-center">
                    <i class="fas fa-receipt text-gray-300 text-4xl mb-3"></i>
                    <p class="text-gray-500">No commission transactions yet.</p>
                </div>
            </div>
        </div>

    </div>

    <!-- Create Offer Modal -->
    <div id="create-offer-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b flex items-center justify-between">
                <h3 class="text-lg font-bold">Create New Offer</h3>
                <button onclick="closeModal('create-offer-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <form id="create-offer-form" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" name="title" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Romantic Dinner for Two">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Describe your offer..."></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select name="offerType" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500">
                            <option value="discount">Discount</option>
                            <option value="package">Package</option>
                            <option value="experience">Experience</option>
                            <option value="exclusive">Exclusive</option>
                            <option value="seasonal">Seasonal</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select name="category" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500">
                            <option value="dining">Dining</option>
                            <option value="travel">Travel</option>
                            <option value="wellness">Wellness</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="gifts">Gifts</option>
                            <option value="activities">Activities</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                        <input type="number" name="originalPrice" step="0.01" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500" placeholder="99.99">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Offer Price ($)</label>
                        <input type="number" name="offerPrice" step="0.01" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500" placeholder="79.99">
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                        <input type="date" name="validFrom" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                        <input type="date" name="validUntil" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500">
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <input type="checkbox" name="coupleExclusive" id="coupleExclusive" checked class="rounded border-gray-300 text-pink-500 focus:ring-pink-500">
                    <label for="coupleExclusive" class="text-sm text-gray-700">Couples only (Stitch Verified)</label>
                </div>
                <button type="submit" class="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition">Create Offer</button>
            </form>
        </div>
    </div>

    <!-- Create Campaign Modal -->
    <div id="create-campaign-modal" class="fixed inset-0 bg-black/50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b flex items-center justify-between">
                <h3 class="text-lg font-bold">Launch Campaign</h3>
                <button onclick="closeModal('create-campaign-modal')" class="text-gray-400 hover:text-gray-600"><i class="fas fa-times"></i></button>
            </div>
            <form id="create-campaign-form" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                    <input type="text" name="campaignName" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500" placeholder="Valentine's Date Night Special">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select name="campaignType" id="campaignType" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500">
                        <option value="seasonal">Seasonal Campaign</option>
                        <option value="sponsored_package">Sponsored Package</option>
                        <option value="discover_featured">Featured Placement</option>
                        <option value="push_notification">Push Notification</option>
                        <option value="homepage_takeover">Homepage Takeover (Elite only)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Sponsor Branding</label>
                    <input type="text" name="sponsorBranding" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500" placeholder="Valentine's with [Your Brand]">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows="3" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500" placeholder="Campaign details..."></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="date" name="startDate" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="date" name="endDate" required class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
                    <input type="number" name="budget" step="0.01" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500" placeholder="500.00">
                </div>
                <button type="submit" class="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition">Submit for Review</button>
            </form>
        </div>
    </div>

    <script>
        // State
        let currentVenueId = null;
        const API_BASE = '/api/venues';

        // Tab switching
        function showTab(tabName) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.tab-btn').forEach(el => {
                el.classList.remove('tab-active');
                el.classList.add('text-gray-500');
            });
            const tab = document.getElementById('tab-' + tabName);
            if (tab) {
                tab.classList.remove('hidden');
                tab.classList.add('fade-in');
            }
            const btn = document.querySelector('[data-tab="' + tabName + '"]');
            if (btn) {
                btn.classList.add('tab-active');
                btn.classList.remove('text-gray-500');
            }
        }

        // Modals
        function showCreateOfferModal() {
            document.getElementById('create-offer-modal').classList.remove('hidden');
        }
        function showCreateCampaignModal(type) {
            document.getElementById('create-campaign-modal').classList.remove('hidden');
            if (type) document.getElementById('campaignType').value = type;
        }
        function closeModal(id) {
            document.getElementById(id).classList.add('hidden');
        }

        // Format currency
        function formatCents(cents) {
            return '$' + (cents / 100).toFixed(2);
        }
        function formatNumber(n) {
            if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
            if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
            return n.toString();
        }

        // Load dashboard data
        async function loadDashboard() {
            if (!currentVenueId) return;
            try {
                const res = await fetch(API_BASE + '/manage/' + currentVenueId + '/dashboard');
                const data = await res.json();
                if (!res.ok) return;

                // Update header
                document.getElementById('venueName').textContent = data.venue.name || 'Partner Dashboard';
                const tierEl = document.getElementById('venueTier');
                tierEl.textContent = (data.venue.tier || 'standard').charAt(0).toUpperCase() + (data.venue.tier || 'standard').slice(1);
                if (data.venue.is_verified) document.getElementById('venueVerified').classList.remove('hidden');

                // Update stats
                const a = data.analytics30Day;
                document.getElementById('stat-views').textContent = formatNumber(a.totalProfileViews);
                document.getElementById('stat-bookings').textContent = formatNumber(a.totalBookings);
                document.getElementById('stat-revenue').textContent = formatCents(a.totalRevenueCents);
                document.getElementById('stat-couples').textContent = formatNumber(a.totalUniqueCouples);
                document.getElementById('commission-balance').textContent = formatCents(data.commissionBalance);
                document.getElementById('active-offers-count').textContent = data.activeOffers;

                // Render recent bookings
                if (data.recentBookings && data.recentBookings.length > 0) {
                    const container = document.getElementById('recent-bookings');
                    container.innerHTML = data.recentBookings.map(b => {
                        const statusColors = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
                        const color = statusColors[b.status] || 'bg-gray-100 text-gray-700';
                        return '<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">' +
                            '<div><p class="text-sm font-medium">' + formatCents(b.amount_cents) + '</p>' +
                            '<p class="text-xs text-gray-500">' + new Date(b.created_at).toLocaleDateString() + '</p></div>' +
                            '<span class="text-xs px-2 py-1 rounded-full ' + color + '">' + b.status + '</span></div>';
                    }).join('');
                }
            } catch (err) {
                console.error('Dashboard load error:', err);
            }
        }

        // Load analytics
        async function loadAnalytics(days) {
            if (!currentVenueId) return;
            const startDate = new Date(Date.now() - days * 86400000).toISOString().split('T')[0];
            try {
                const res = await fetch(API_BASE + '/manage/' + currentVenueId + '/analytics?startDate=' + startDate);
                const data = await res.json();
                if (!res.ok) return;

                // Update funnel
                document.getElementById('funnel-impressions').textContent = formatNumber(data.totals.impressions);
                document.getElementById('funnel-views').textContent = formatNumber(data.totals.profileViews);
                document.getElementById('funnel-clicks').textContent = formatNumber(data.totals.offerClicks);
                document.getElementById('funnel-bookings').textContent = formatNumber(data.totals.bookings);
                document.getElementById('ctr-rate').textContent = data.rates.clickThroughRate;
                document.getElementById('conversion-rate').textContent = data.rates.bookingConversionRate;

                // Update funnel bars
                if (data.totals.impressions > 0) {
                    document.getElementById('funnel-views-bar').style.width = (data.totals.profileViews / data.totals.impressions * 100) + '%';
                    document.getElementById('funnel-clicks-bar').style.width = (data.totals.offerClicks / data.totals.impressions * 100) + '%';
                    document.getElementById('funnel-bookings-bar').style.width = (data.totals.bookings / data.totals.impressions * 100) + '%';
                }

                // Demographics charts
                renderDemographicsCharts(data.demographics);

            } catch (err) {
                console.error('Analytics load error:', err);
            }
        }

        function renderDemographicsCharts(demographics) {
            // Age chart
            const ageCtx = document.getElementById('ageChart');
            if (ageCtx._chart) ageCtx._chart.destroy();
            ageCtx._chart = new Chart(ageCtx, {
                type: 'doughnut',
                data: {
                    labels: ['18-24', '25-34', '35-44', '45+'],
                    datasets: [{ data: [demographics.age18_24, demographics.age25_34, demographics.age35_44, demographics.age45Plus], backgroundColor: ['#f472b6', '#a78bfa', '#60a5fa', '#34d399'] }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }
            });

            // Relationship chart
            const relCtx = document.getElementById('relationshipChart');
            if (relCtx._chart) relCtx._chart.destroy();
            relCtx._chart = new Chart(relCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Dating', 'Engaged', 'Married'],
                    datasets: [{ data: [demographics.relationshipDating, demographics.relationshipEngaged, demographics.relationshipMarried], backgroundColor: ['#f472b6', '#c084fc', '#818cf8'] }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } } }
            });
        }

        function setDateRange(days) {
            loadAnalytics(days);
        }

        // Form handlers
        document.getElementById('create-offer-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentVenueId) return alert('No venue selected');
            const form = e.target;
            const body = {
                title: form.title.value,
                description: form.description.value,
                offerType: form.offerType.value,
                category: form.category.value,
                originalPriceCents: form.originalPrice.value ? Math.round(parseFloat(form.originalPrice.value) * 100) : undefined,
                offerPriceCents: form.offerPrice.value ? Math.round(parseFloat(form.offerPrice.value) * 100) : undefined,
                coupleExclusive: form.coupleExclusive.checked,
                validFrom: form.validFrom.value || undefined,
                validUntil: form.validUntil.value || undefined,
            };
            try {
                const res = await fetch(API_BASE + '/manage/' + currentVenueId + '/offers', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
                });
                const data = await res.json();
                if (res.ok) { closeModal('create-offer-modal'); form.reset(); loadDashboard(); alert('Offer created!'); }
                else alert(data.error || 'Failed to create offer');
            } catch (err) { alert('Error creating offer'); }
        });

        document.getElementById('create-campaign-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentVenueId) return alert('No venue selected');
            const form = e.target;
            const body = {
                campaignName: form.campaignName.value,
                campaignType: form.campaignType.value,
                sponsorBranding: form.sponsorBranding.value || undefined,
                description: form.description.value || undefined,
                startDate: form.startDate.value,
                endDate: form.endDate.value,
                budgetCents: form.budget.value ? Math.round(parseFloat(form.budget.value) * 100) : undefined,
            };
            try {
                const res = await fetch(API_BASE + '/manage/' + currentVenueId + '/campaigns', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
                });
                const data = await res.json();
                if (res.ok) { closeModal('create-campaign-modal'); form.reset(); alert('Campaign submitted for review!'); }
                else alert(data.error || 'Failed to create campaign');
            } catch (err) { alert('Error creating campaign'); }
        });

        // Initialize
        const params = new URLSearchParams(window.location.search);
        currentVenueId = params.get('venue');
        if (currentVenueId) {
            loadDashboard();
            loadAnalytics(30);
        }
    </script>
</body>
</html>`
