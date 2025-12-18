// In-App Purchases - Comprehensive Monetization System
import { navigationHtml } from '../components/navigation.js';

export const inAppPurchasesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Features & In-App Purchases | Better Together</title>
    <meta name="description" content="Unlock premium relationship features, AI credits, gift purchases, and exclusive content. Strategic monetization with 8 revenue streams and freemium conversion.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        pink: { 50: '#fdf2f8', 100: '#fce7f3', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d' },
                        purple: { 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
                        emerald: { 500: '#10b981', 600: '#059669' }
                    },
                    fontFamily: { 'inter': ['Inter', 'sans-serif'] }
                }
            }
        }
    </script>
    <style>
        .gradient-bg { background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fce7f3 100%); }
        .profit-badge { background: linear-gradient(45deg, #10b981, #059669); color: white; padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
        .popular-badge { background: linear-gradient(45deg, #f59e0b, #d97706); color: white; padding: 6px 16px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700; position: absolute; top: -10px; right: 20px; }
        .hover-lift:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .price-slash { position: relative; color: #9ca3af; }
        .price-slash::after { content: ''; position: absolute; left: 0; top: 50%; width: 100%; height: 2px; background: #ef4444; transform: rotate(-15deg); }
    </style>
</head>
<body class="bg-gray-50 font-inter">
    ${navigationHtml}

    <!-- Hero Section -->
    <section class="gradient-bg py-16 sm:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <div class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
                    <i class="fas fa-crown mr-2"></i>
                    Premium Relationship Features
                </div>
                
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Unlock Your Relationship's
                    <span class="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        Full Potential
                    </span>
                </h1>
                
                <p class="text-xl sm:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                    8 revenue streams designed to enhance your relationship while providing exceptional value through strategic monetization.
                </p>
                
                <!-- Revenue Overview -->
                <div class="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-10">
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-pink-600 mb-2">8</div>
                        <div class="text-sm text-gray-600">Revenue Streams</div>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-purple-600 mb-2">$35+</div>
                        <div class="text-sm text-gray-600">ARPU Target</div>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-blue-600 mb-2">12%</div>
                        <div class="text-sm text-gray-600">Conversion Rate</div>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-green-600 mb-2">$420+</div>
                        <div class="text-sm text-gray-600">LTV Target</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Subscription Tiers -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Relationship Journey</h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">Strategic subscription tiers designed for maximum conversion and user value</p>
            </div>

            <div class="grid lg:grid-cols-4 gap-8 mb-16">
                <!-- Free Tier -->
                <div class="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
                    <div class="text-center mb-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Getting Started</h3>
                        <div class="text-4xl font-bold text-gray-900 mb-2">Free</div>
                        <p class="text-gray-600">Perfect for trying out</p>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">3 daily check-ins per week</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Basic calendar reminders</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">AI responses (50 words max)</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">1 relationship goal</span></li>
                        <li class="flex items-center text-gray-400"><i class="fas fa-times mr-3"></i><span class="text-sm">No AI-executed actions</span></li>
                        <li class="flex items-center text-gray-400"><i class="fas fa-times mr-3"></i><span class="text-sm">No subscription boxes</span></li>
                    </ul>
                    <button class="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                        Current Plan
                    </button>
                </div>

                <!-- Couple Tier (Popular) -->
                <div class="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-200 relative hover-lift transition-all duration-300">
                    <div class="popular-badge">Most Popular</div>
                    <div class="text-center mb-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Growing Together</h3>
                        <div class="text-4xl font-bold text-gray-900 mb-2">
                            $19<span class="text-lg">.99</span>
                            <span class="text-lg font-normal text-gray-600">/month</span>
                        </div>
                        <p class="text-gray-600">
                            <span class="price-slash">$239.88</span> 
                            <span class="text-green-600 font-semibold">$199/year</span>
                        </p>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Unlimited daily check-ins</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Advanced AI coach (500 words)</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Smart calendar & reminders</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">5 relationship goals</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">2 AI actions per month</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Romance box (50% off)</span></li>
                    </ul>
                    <button class="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                        Upgrade Now
                    </button>
                    <div class="text-center mt-4">
                        <span class="text-sm text-gray-600">Target ARPU: <span class="font-semibold text-pink-600">$28.49</span></span>
                    </div>
                </div>

                <!-- Premium Tier -->
                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border-2 border-purple-200 hover-lift transition-all duration-300">
                    <div class="text-center mb-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Thriving Partnership</h3>
                        <div class="text-4xl font-bold text-gray-900 mb-2">
                            $39<span class="text-lg">.99</span>
                            <span class="text-lg font-normal text-gray-600">/month</span>
                        </div>
                        <p class="text-gray-600">
                            <span class="price-slash">$479.88</span> 
                            <span class="text-green-600 font-semibold">$399/year</span>
                        </p>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Everything in Couple tier</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Unlimited AI actions</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Advanced analytics</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Personalized coaching</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">All boxes (25% off)</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Dedicated consultant</span></li>
                    </ul>
                    <button class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        Go Premium
                    </button>
                    <div class="text-center mt-4">
                        <span class="text-sm text-gray-600">Target ARPU: <span class="font-semibold text-purple-600">$58.74</span></span>
                    </div>
                </div>

                <!-- VIP Tier -->
                <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-300 hover-lift transition-all duration-300">
                    <div class="text-center mb-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Relationship Concierge</h3>
                        <div class="text-4xl font-bold text-gray-900 mb-2">
                            $99<span class="text-lg">.99</span>
                            <span class="text-lg font-normal text-gray-600">/month</span>
                        </div>
                        <p class="text-gray-600">
                            <span class="price-slash">$1,199.88</span> 
                            <span class="text-green-600 font-semibold">$999/year</span>
                        </p>
                    </div>
                    <ul class="space-y-4 mb-8">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Everything in Premium</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Personal concierge</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Custom AI training</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Unlimited premium gifts</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">White-glove service</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-3"></i><span class="text-sm">Annual getaway planning</span></li>
                    </ul>
                    <button class="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors">
                        VIP Access
                    </button>
                    <div class="text-center mt-4">
                        <span class="text-sm text-gray-600">Target ARPU: <span class="font-semibold text-yellow-600">$145.19</span></span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- AI Credits & Consumables -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI Credits & Actions</h2>
                <p class="text-xl text-gray-600">High-frequency purchases that execute actions on behalf of your partner</p>
            </div>

            <div class="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">AI Action Credits</h3>
                    <p class="text-gray-600 mb-8">Let our AI execute romantic actions on your behalf - from ordering flowers to booking dinner reservations. Credits represent 35% of total add-on revenue.</p>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-100">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900 mb-2">10 Credits</div>
                                <div class="text-3xl font-bold text-pink-600 mb-4">$4.99</div>
                                <button class="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors text-sm">
                                    Purchase
                                </button>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 relative">
                            <div class="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">20% Bonus</div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900 mb-2">25 Credits</div>
                                <div class="text-3xl font-bold text-purple-600 mb-4">$9.99</div>
                                <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm">
                                    Purchase
                                </button>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100 relative">
                            <div class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">30% Bonus</div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900 mb-2">50 Credits</div>
                                <div class="text-3xl font-bold text-blue-600 mb-4">$17.99</div>
                                <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                                    Purchase
                                </button>
                            </div>
                        </div>
                        <div class="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100 relative">
                            <div class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">40% Bonus</div>
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-900 mb-2">100 Credits</div>
                                <div class="text-3xl font-bold text-green-600 mb-4">$29.99</div>
                                <button class="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm">
                                    Purchase
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Credit Usage Examples</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-3 border-b">
                            <div class="flex items-center">
                                <i class="fas fa-rose text-pink-500 mr-3"></i>
                                <span class="font-medium">Order Flowers</span>
                            </div>
                            <span class="text-gray-600">5-15 credits</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b">
                            <div class="flex items-center">
                                <i class="fas fa-utensils text-purple-500 mr-3"></i>
                                <span class="font-medium">Restaurant Reservation</span>
                            </div>
                            <span class="text-gray-600">3-8 credits</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b">
                            <div class="flex items-center">
                                <i class="fas fa-ticket-alt text-blue-500 mr-3"></i>
                                <span class="font-medium">Concert Tickets</span>
                            </div>
                            <span class="text-gray-600">10-25 credits</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b">
                            <div class="flex items-center">
                                <i class="fas fa-broom text-green-500 mr-3"></i>
                                <span class="font-medium">House Cleaning Service</span>
                            </div>
                            <span class="text-gray-600">2-5 credits</span>
                        </div>
                        <div class="flex justify-between items-center py-3">
                            <div class="flex items-center">
                                <i class="fas fa-heart text-red-500 mr-3"></i>
                                <span class="font-medium">Custom Love Notes</span>
                            </div>
                            <span class="text-gray-600">1-3 credits</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Gift & Experience Marketplace -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gift & Experience Marketplace</h2>
                <p class="text-xl text-gray-600">AI-curated gifts and experiences with 25% of total add-on revenue</p>
            </div>

            <div class="grid md:grid-cols-4 gap-8">
                <!-- Flowers & Plants -->
                <div class="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 hover-lift transition-all duration-300">
                    <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-rose text-white text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Flowers & Plants</h3>
                    <div class="profit-badge mb-4 text-center">40-60% Markup</div>
                    <ul class="space-y-2 text-sm text-gray-600 mb-4">
                        <li>• Roses: $29.99-$199.99</li>
                        <li>• Custom Bouquets: $39.99-$299.99</li>
                        <li>• Potted Plants: $19.99-$89.99</li>
                        <li>• Subscription: $49.99/month</li>
                    </ul>
                    <button class="w-full bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                        Browse Flowers
                    </button>
                </div>

                <!-- Food & Beverages -->
                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 hover-lift transition-all duration-300">
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-wine-glass text-white text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Food & Beverages</h3>
                    <div class="profit-badge mb-4 text-center">30-50% Markup</div>
                    <ul class="space-y-2 text-sm text-gray-600 mb-4">
                        <li>• Chocolates: $24.99-$149.99</li>
                        <li>• Wine Selection: $39.99-$399.99</li>
                        <li>• Gift Cards: $25-$500</li>
                        <li>• Meal Delivery: $59.99-$199.99</li>
                    </ul>
                    <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        Shop Food & Wine
                    </button>
                </div>

                <!-- Jewelry & Accessories -->
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 hover-lift transition-all duration-300">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-gem text-white text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Jewelry & Accessories</h3>
                    <div class="profit-badge mb-4 text-center">60-80% Markup</div>
                    <ul class="space-y-2 text-sm text-gray-600 mb-4">
                        <li>• Personalized: $49.99-$999.99</li>
                        <li>• Watches: $199.99-$2,999.99</li>
                        <li>• Keepsakes: $29.99-$199.99</li>
                        <li>• Custom Engraving Available</li>
                    </ul>
                    <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        View Jewelry
                    </button>
                </div>

                <!-- Experiences -->
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 hover-lift transition-all duration-300">
                    <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-map-marked-alt text-white text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">Experiences</h3>
                    <div class="profit-badge mb-4 text-center">20-40% Commission</div>
                    <ul class="space-y-2 text-sm text-gray-600 mb-4">
                        <li>• Concerts: $99.99-$999.99</li>
                        <li>• Spa Packages: $149.99-$799.99</li>
                        <li>• Travel: $299.99-$4,999.99</li>
                        <li>• Adventures: $79.99-$499.99</li>
                    </ul>
                    <button class="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Book Experience
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Premium Features -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Premium Features & Add-Ons</h2>
                <p class="text-xl text-gray-600">12% of add-on revenue from feature upgrades and customizations</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 mb-12">
                <!-- Advanced Calendar -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover-lift transition-all duration-300">
                    <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-6">
                        <i class="fas fa-calendar-alt text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Advanced Calendar Features</h3>
                    <ul class="space-y-3 text-gray-600 mb-6">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Smart Event Planning - $6.99/month</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Anniversary Countdown - $3.99 one-time</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Custom Reminder Tones - $1.99 per pack</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Multi-Partner Sync - $4.99/month</li>
                    </ul>
                    <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Upgrade Calendar
                    </button>
                </div>

                <!-- Communication Tools -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover-lift transition-all duration-300">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-6">
                        <i class="fas fa-comments text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Enhanced Communication</h3>
                    <ul class="space-y-3 text-gray-600 mb-6">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Love Language Analysis - $9.99 one-time</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Communication Assessment - $7.99 one-time</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Conflict Resolution - $4.99 per pack</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Health Scoring - $8.99/month</li>
                    </ul>
                    <button class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        Enhance Communication
                    </button>
                </div>

                <!-- Customization -->
                <div class="bg-white rounded-2xl p-8 shadow-lg hover-lift transition-all duration-300">
                    <div class="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-6">
                        <i class="fas fa-palette text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-4">App Customization</h3>
                    <ul class="space-y-3 text-gray-600 mb-6">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Premium Themes - $3.99 each</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Custom Colors - $2.99 each</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Animated Backgrounds - $4.99 per pack</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Photo Frames - $1.99 per pack</li>
                    </ul>
                    <button class="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                        Customize App
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Revenue Projections -->
    <section class="py-16 bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Revenue Projections & Success Metrics</h2>
                <p class="text-xl text-gray-300">10,000 user scenario with mixed tier distribution</p>
            </div>

            <div class="grid md:grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 class="text-2xl font-bold mb-6">Monthly Revenue Breakdown</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center py-3 border-b border-gray-700">
                            <span>5,000 Free Users</span>
                            <span class="font-bold">$0</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b border-gray-700">
                            <span>3,500 Couple Tier ($28.49 ARPU)</span>
                            <span class="font-bold text-green-400">$99,715</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b border-gray-700">
                            <span>1,200 Premium Tier ($58.74 ARPU)</span>
                            <span class="font-bold text-green-400">$70,488</span>
                        </div>
                        <div class="flex justify-between items-center py-3 border-b border-gray-700">
                            <span>300 VIP Tier ($145.19 ARPU)</span>
                            <span class="font-bold text-green-400">$43,557</span>
                        </div>
                        <div class="flex justify-between items-center py-3 text-xl font-bold">
                            <span>Total Monthly Revenue</span>
                            <span class="text-green-400">$213,760</span>
                        </div>
                        <div class="flex justify-between items-center py-3 text-xl font-bold">
                            <span>Annual Revenue</span>
                            <span class="text-green-400">$2.56M</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 class="text-2xl font-bold mb-6">Add-On Revenue Distribution</h3>
                    <div class="space-y-6">
                        <div class="bg-gray-800 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span>AI Credits</span>
                                <span class="font-bold">35%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-2">
                                <div class="bg-pink-500 h-2 rounded-full" style="width: 35%"></div>
                            </div>
                        </div>
                        <div class="bg-gray-800 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span>Gifts & Experiences</span>
                                <span class="font-bold">25%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-2">
                                <div class="bg-purple-500 h-2 rounded-full" style="width: 25%"></div>
                            </div>
                        </div>
                        <div class="bg-gray-800 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span>Subscription Boxes</span>
                                <span class="font-bold">20%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-2">
                                <div class="bg-blue-500 h-2 rounded-full" style="width: 20%"></div>
                            </div>
                        </div>
                        <div class="bg-gray-800 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span>Premium Features</span>
                                <span class="font-bold">12%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-2">
                                <div class="bg-green-500 h-2 rounded-full" style="width: 12%"></div>
                            </div>
                        </div>
                        <div class="bg-gray-800 rounded-lg p-4">
                            <div class="flex justify-between items-center mb-2">
                                <span>Content & Courses</span>
                                <span class="font-bold">8%</span>
                            </div>
                            <div class="w-full bg-gray-700 rounded-full h-2">
                                <div class="bg-yellow-500 h-2 rounded-full" style="width: 8%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid md:grid-cols-4 gap-8 text-center">
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-green-400 mb-2">8-12%</div>
                    <div class="text-gray-300">Free to Paid</div>
                    <div class="text-sm text-gray-400">Conversion Rate</div>
                </div>
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-blue-400 mb-2"><5%</div>
                    <div class="text-gray-300">Monthly Churn</div>
                    <div class="text-sm text-gray-400">Target Rate</div>
                </div>
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-purple-400 mb-2">$35+</div>
                    <div class="text-gray-300">ARPU Target</div>
                    <div class="text-sm text-gray-400">Average Revenue</div>
                </div>
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-pink-400 mb-2">$420+</div>
                    <div class="text-gray-300">LTV Target</div>
                    <div class="text-sm text-gray-400">Lifetime Value</div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Unlock Premium Features?</h2>
            <p class="text-xl mb-8 opacity-90">Start with our most popular tier and explore premium relationship tools</p>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button class="w-full sm:w-auto bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                    <i class="fas fa-crown mr-2"></i>
                    Start Growing Together
                </button>
                <button class="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors">
                    <i class="fas fa-info-circle mr-2"></i>
                    Learn More
                </button>
            </div>
        </div>
    </section>

    <!-- JavaScript -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Purchase button interactions
            const purchaseButtons = document.querySelectorAll('button[class*="bg-"]');
            purchaseButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Add click animation
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 100);
                    
                    // Log purchase intent (integrate with payment system)
                    const buttonText = this.textContent.trim();
                    console.log('Purchase button clicked:', buttonText);
                    
                    // Here you would integrate with Stripe, PayPal, or other payment processor
                    // Example: initiatePayment(buttonText, getPriceFromButton(this));
                });
            });

            // Hover effects for cards
            const cards = document.querySelectorAll('.hover-lift');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        });
    </script>
</body>
</html>`;