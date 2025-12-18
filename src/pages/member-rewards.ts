// Member Rewards & Savings - Exclusive Benefits for Better Together Users
import { navigationHtml } from '../components/navigation.js';

export const memberRewardsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Member Rewards & Savings | Better Together</title>
    <meta name="description" content="Unlock exclusive savings on date nights, getaways, and experiences as you grow your relationship with Better Together. Active couples save up to 50% on what they already love doing together.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        pink: {
                            50: '#fdf2f8',
                            100: '#fce7f3',
                            500: '#ec4899',
                            600: '#db2777',
                            700: '#be185d'
                        },
                        purple: {
                            500: '#8b5cf6',
                            600: '#7c3aed',
                            700: '#6d28d9'
                        }
                    },
                    fontFamily: {
                        'inter': ['Inter', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .gradient-bg {
            background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #ede9fe 100%);
        }
        .floating {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
    </style>
</head>
<body class="bg-gray-50">
    ${navigationHtml}

    <!-- Hero Section -->
    <section class="gradient-bg py-16 sm:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <!-- Breadcrumb Badge -->
                <div class="inline-flex items-center px-4 py-2 bg-pink-100 rounded-full text-pink-800 text-sm font-medium mb-8">
                    <i class="fas fa-heart mr-2"></i>
                    Member Exclusive Benefits
                </div>
                
                <!-- Main Headlines -->
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Your Relationship Growth
                    <span class="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        Rewards You Both
                    </span>
                </h1>
                
                <p class="text-xl sm:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                    The more you use Better Together to strengthen your relationship, the more you save on the experiences you already love sharing
                </p>
                
                <!-- Value Proposition -->
                <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-lg max-w-4xl mx-auto mb-10">
                    <div class="grid md:grid-cols-3 gap-6 text-center">
                        <div class="space-y-3">
                            <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto">
                                <i class="fas fa-calendar-check text-white text-2xl"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900">Stay Connected</h3>
                            <p class="text-gray-600 text-sm">Have daily best friend chats and build your relationship streak</p>
                        </div>
                        <div class="space-y-3">
                            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto">
                                <i class="fas fa-gift text-white text-2xl"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900">Unlock Rewards</h3>
                            <p class="text-gray-600 text-sm">Earn exclusive discounts on experiences you're planning together</p>
                        </div>
                        <div class="space-y-3">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                                <i class="fas fa-piggy-bank text-white text-2xl"></i>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900">Save Together</h3>
                            <p class="text-gray-600 text-sm">Active couples save $2,400+ annually on date nights and trips</p>
                        </div>
                    </div>
                </div>

                <!-- CTA Buttons -->
                <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button class="w-full sm:w-auto bg-pink-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-pink-700 transition-all transform hover:scale-105 shadow-lg">
                        <i class="fas fa-rocket mr-2"></i>
                        Start Earning Rewards
                    </button>
                    <button class="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors shadow-md">
                        <i class="fas fa-play mr-2"></i>
                        See How It Works
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- How Member Rewards Work -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    How Your Relationship Activity Earns Rewards
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Better Together partners with top brands to give active couples exclusive access to savings on experiences they're already planning together.
                </p>
            </div>

            <div class="grid md:grid-cols-4 gap-8 mb-16">
                <!-- Step 1 -->
                <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                        1
                    </div>
                    <h3 class="text-xl font-semibold mb-4 text-gray-900">Use the App Together</h3>
                    <p class="text-gray-600">
                        Have daily best friend chats, plan activities, and engage with your AI coach to build your relationship streak and engagement score.
                    </p>
                </div>
                
                <!-- Step 2 -->
                <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                        2
                    </div>
                    <h3 class="text-xl font-semibold mb-4 text-gray-900">Earn Reward Tiers</h3>
                    <p class="text-gray-600">
                        Your consistent relationship activities unlock Bronze (Week 2), Silver (Month 1), Gold (Month 3), and Platinum (Month 6) member tiers.
                    </p>
                </div>
                
                <!-- Step 3 -->
                <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                        3
                    </div>
                    <h3 class="text-xl font-semibold mb-4 text-gray-900">Browse & Save</h3>
                    <p class="text-gray-600">
                        Access your member portal to discover exclusive discounts on restaurants, experiences, gifts, and getaways perfect for couples.
                    </p>
                </div>
                
                <!-- Step 4 -->
                <div class="text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                        4
                    </div>
                    <h3 class="text-xl font-semibold mb-4 text-gray-900">Enjoy & Track</h3>
                    <p class="text-gray-600">
                        Book your discounted experiences directly through the app and track your savings while building amazing memories together.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Member Tier Benefits -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Member Reward Tiers
                </h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    The more connected you become, the better your rewards get
                </p>
            </div>

            <div class="grid md:grid-cols-4 gap-6">
                <!-- Bronze Tier -->
                <div class="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-200">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-medal text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-900">Bronze Member</h3>
                        <p class="text-sm text-gray-600 mb-4">2+ weeks of consistent activity</p>
                        <div class="space-y-3 text-left">
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-sm">Up to 15% off local dining</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-sm">Access to date night deals</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-sm">50 bonus reward credits monthly</span>
                            </div>
                        </div>
                        <div class="mt-6 p-3 bg-orange-50 rounded-lg">
                            <p class="text-orange-800 text-sm font-medium">Avg. Monthly Savings: $120</p>
                        </div>
                    </div>
                </div>

                <!-- Silver Tier -->
                <div class="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-300">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-star text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-900">Silver Member</h3>
                        <p class="text-sm text-gray-600 mb-4">1+ month of active engagement</p>
                        <div class="space-y-3 text-left">
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-sm">Up to 25% off dining & activities</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-sm">Exclusive weekend getaway deals</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-sm">100 bonus reward credits monthly</span>
                            </div>
                        </div>
                        <div class="mt-6 p-3 bg-gray-50 rounded-lg">
                            <p class="text-gray-800 text-sm font-medium">Avg. Monthly Savings: $240</p>
                        </div>
                    </div>
                </div>

                <!-- Gold Tier -->
                <div class="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-lg text-white transform scale-105 relative">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div class="bg-white text-yellow-600 px-4 py-1 rounded-full text-sm font-bold">
                            Most Popular
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-crown text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2">Gold Member</h3>
                        <p class="text-sm text-yellow-100 mb-4">3+ months of relationship growth</p>
                        <div class="space-y-3 text-left">
                            <div class="flex items-center">
                                <i class="fas fa-check text-yellow-200 mr-3"></i>
                                <span class="text-sm">Up to 40% off premium experiences</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-check text-yellow-200 mr-3"></i>
                                <span class="text-sm">Luxury travel partnerships</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-check text-yellow-200 mr-3"></i>
                                <span class="text-sm">200 bonus reward credits monthly</span>
                            </div>
                        </div>
                        <div class="mt-6 p-3 bg-white bg-opacity-20 rounded-lg">
                            <p class="text-white text-sm font-medium">Avg. Monthly Savings: $420</p>
                        </div>
                    </div>
                </div>

                <!-- Platinum Tier -->
                <div class="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
                    <div class="text-center">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-gem text-white text-2xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 text-gray-900">Platinum Member</h3>
                        <p class="text-sm text-gray-600 mb-4">6+ months of relationship mastery</p>
                        <div class="space-y-3 text-left">
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-sm">Up to 60% off luxury experiences</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-sm">Exclusive event invitations</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                <span class="text-sm">500 bonus reward credits monthly</span>
                            </div>
                        </div>
                        <div class="mt-6 p-3 bg-purple-50 rounded-lg">
                            <p class="text-purple-800 text-sm font-medium">Avg. Monthly Savings: $680</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Partner Savings -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Where Your Savings Work
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    We've partnered with the brands couples already love to give you exclusive member pricing on experiences that strengthen your bond.
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Date Night Dining -->
                <div class="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-utensils text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900">Date Night Dining</h3>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Save up to 35% at partner restaurants perfect for meaningful conversations and romantic evenings together.
                    </p>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Local Fine Dining</span>
                            <span class="text-pink-600 font-semibold">UP TO 25% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Wine & Dine Experiences</span>
                            <span class="text-pink-600 font-semibold">UP TO 30% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Cooking Classes</span>
                            <span class="text-pink-600 font-semibold">UP TO 35% OFF</span>
                        </div>
                    </div>
                    <div class="mt-6 p-3 bg-white rounded-lg border border-pink-200">
                        <p class="text-pink-800 text-sm"><strong>Real Member:</strong> "We saved $180 on our monthly date nights last year!" - Sarah & Mike</p>
                    </div>
                </div>

                <!-- Weekend Getaways -->
                <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-plane-departure text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900">Romantic Getaways</h3>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Exclusive rates on couple-friendly accommodations, from cozy B&Bs to luxury resorts designed for connection.
                    </p>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Boutique Hotels</span>
                            <span class="text-purple-600 font-semibold">UP TO 40% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Couples Spa Retreats</span>
                            <span class="text-purple-600 font-semibold">UP TO 45% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Adventure Packages</span>
                            <span class="text-purple-600 font-semibold">35% OFF</span>
                        </div>
                    </div>
                    <div class="mt-6 p-3 bg-white rounded-lg border border-purple-200">
                        <p class="text-purple-800 text-sm"><strong>Real Member:</strong> "Our Napa Valley weekend cost half what we expected!" - James & Lisa</p>
                    </div>
                </div>

                <!-- Meaningful Gifts -->
                <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-gift text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900">Thoughtful Gifts</h3>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Special pricing on personalized jewelry, custom art, and meaningful keepsakes that celebrate your unique bond.
                    </p>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Custom Jewelry</span>
                            <span class="text-blue-600 font-semibold">UP TO 30% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Personalized Art</span>
                            <span class="text-blue-600 font-semibold">25% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Memory Books</span>
                            <span class="text-blue-600 font-semibold">40% OFF</span>
                        </div>
                    </div>
                    <div class="mt-6 p-3 bg-white rounded-lg border border-blue-200">
                        <p class="text-blue-800 text-sm"><strong>Real Member:</strong> "The perfect anniversary gift for $100 less!" - Alex & Jordan</p>
                    </div>
                </div>

                <!-- Experience Adventures -->
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-mountain text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900">Adventure Experiences</h3>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Try new activities together with member discounts on everything from dance lessons to hot air balloon rides.
                    </p>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Dance Lessons</span>
                            <span class="text-green-600 font-semibold">UP TO 30% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Wine Tours</span>
                            <span class="text-green-600 font-semibold">35% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Adventure Sports</span>
                            <span class="text-green-600 font-semibold">25% OFF</span>
                        </div>
                    </div>
                    <div class="mt-6 p-3 bg-white rounded-lg border border-green-200">
                        <p class="text-green-800 text-sm"><strong>Real Member:</strong> "Finally tried couples yoga - and saved $60!" - Maya & David</p>
                    </div>
                </div>

                <!-- Home & Wellness -->
                <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-home text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900">Home Together</h3>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Build your shared space with discounts on couple-friendly home goods, wellness products, and tech that brings you closer.
                    </p>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Home Decor</span>
                            <span class="text-yellow-600 font-semibold">UP TO 25% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Wellness Products</span>
                            <span class="text-yellow-600 font-semibold">30% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Smart Home Tech</span>
                            <span class="text-yellow-600 font-semibold">20% OFF</span>
                        </div>
                    </div>
                    <div class="mt-6 p-3 bg-white rounded-lg border border-yellow-200">
                        <p class="text-yellow-800 text-sm"><strong>Real Member:</strong> "Our smart home setup cost $200 less!" - Emma & Chris</p>
                    </div>
                </div>

                <!-- Special Occasions -->
                <div class="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border border-red-200 hover:shadow-lg transition-shadow">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
                            <i class="fas fa-calendar-heart text-white text-xl"></i>
                        </div>
                        <h3 class="text-xl font-semibold text-gray-900">Special Celebrations</h3>
                    </div>
                    <p class="text-gray-600 mb-4">
                        Make your milestones memorable with exclusive access to venues, photographers, and celebration services.
                    </p>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Event Venues</span>
                            <span class="text-red-600 font-semibold">UP TO 20% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Photography</span>
                            <span class="text-red-600 font-semibold">35% OFF</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Celebration Planning</span>
                            <span class="text-red-600 font-semibold">25% OFF</span>
                        </div>
                    </div>
                    <div class="mt-6 p-3 bg-white rounded-lg border border-red-200">
                        <p class="text-red-800 text-sm"><strong>Real Member:</strong> "Our anniversary dinner saved us $150!" - Ryan & Taylor</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Success Stories -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Real Couples, Real Savings, Real Growth
                </h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    See how Better Together members are strengthening their relationships while saving money on experiences they love
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Success Story 1 -->
                <div class="bg-white rounded-xl p-6 shadow-lg">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                            <span class="text-pink-600 font-bold">S&M</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900">Sarah & Michael</h4>
                            <p class="text-sm text-gray-600">Gold Members • 4 months</p>
                        </div>
                    </div>
                    <blockquote class="text-gray-600 mb-4">
                        "We went from arguing about date night costs to actually looking forward to trying new places. The member discounts make it feel guilt-free, and our relationship has never been stronger."
                    </blockquote>
                    <div class="bg-pink-50 p-4 rounded-lg">
                        <div class="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-pink-600">$1,840</div>
                                <div class="text-sm text-gray-600">Total Saved</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-pink-600">127</div>
                                <div class="text-sm text-gray-600">Day Streak</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Success Story 2 -->
                <div class="bg-white rounded-xl p-6 shadow-lg">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                            <span class="text-purple-600 font-bold">J&L</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900">James & Lisa</h4>
                            <p class="text-sm text-gray-600">Platinum Members • 8 months</p>
                        </div>
                    </div>
                    <blockquote class="text-gray-600 mb-4">
                        "The app helped us identify our communication patterns, and the reward system made it fun to work on them together. Plus we saved enough for an amazing anniversary trip!"
                    </blockquote>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <div class="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-purple-600">$3,200</div>
                                <div class="text-sm text-gray-600">Total Saved</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-purple-600">89%</div>
                                <div class="text-sm text-gray-600">Connection Score</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Success Story 3 -->
                <div class="bg-white rounded-xl p-6 shadow-lg">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span class="text-blue-600 font-bold">A&J</span>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900">Alex & Jordan</h4>
                            <p class="text-sm text-gray-600">Silver Members • 6 weeks</p>
                        </div>
                    </div>
                    <blockquote class="text-gray-600 mb-4">
                        "Even as new members, we're already seeing the benefits. The Bronze tier dining discounts paid for our weekly date nights, and our check-in streak is motivating!"
                    </blockquote>
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <div class="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-blue-600">$420</div>
                                <div class="text-sm text-gray-600">Total Saved</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-blue-600">42</div>
                                <div class="text-sm text-gray-600">Day Streak</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Reward Credits System -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Reward Credits: Your Flexible Savings Currency
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Earn credits through app activity or purchase additional credits to unlock even more savings on experiences you love.
                </p>
            </div>

            <div class="grid md:grid-cols-2 gap-12 items-center mb-16">
                <!-- How Credits Work -->
                <div class="space-y-6">
                    <h3 class="text-2xl font-semibold text-gray-900 mb-6">How Reward Credits Work</h3>
                    
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0 w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-coins text-pink-600"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-2">Earn Through Activity</h4>
                            <p class="text-gray-600">Complete check-ins, reach relationship milestones, and engage with your partner to earn credits automatically.</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-shopping-cart text-purple-600"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-2">Purchase Additional Credits</h4>
                            <p class="text-gray-600">Buy credit packs to unlock more savings opportunities and access premium partner deals.</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-ticket-alt text-blue-600"></i>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-2">Redeem for Savings</h4>
                            <p class="text-gray-600">Use credits to unlock exclusive discounts at partner locations or enhance your existing member tier benefits.</p>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border border-pink-200">
                        <h4 class="font-semibold text-gray-900 mb-2">💡 Pro Tip</h4>
                        <p class="text-gray-600">Credits never expire! Save them up for special occasions or use them regularly to maximize your relationship experiences.</p>
                    </div>
                </div>

                <!-- Credit Packages -->
                <div class="space-y-6">
                    <h3 class="text-2xl font-semibold text-gray-900 mb-6">Credit Packages</h3>
                    
                    <!-- Starter Pack -->
                    <div class="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-pink-300 transition-colors">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="text-lg font-semibold text-gray-900">Starter Pack</h4>
                            <div class="text-2xl font-bold text-gray-900">$9.99</div>
                        </div>
                        <div class="space-y-2 mb-4">
                            <div class="flex justify-between">
                                <span class="text-gray-600">100 Reward Credits</span>
                                <span class="font-medium text-gray-900">$0.10 each</span>
                            </div>
                            <div class="text-sm text-gray-500">Perfect for date night upgrades</div>
                        </div>
                        <button class="w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                            Purchase Credits
                        </button>
                    </div>

                    <!-- Popular Pack -->
                    <div class="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg p-6 transform scale-105 relative">
                        <div class="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div class="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                                Best Value
                            </div>
                        </div>
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="text-lg font-semibold">Value Pack</h4>
                            <div class="text-2xl font-bold">$24.99</div>
                        </div>
                        <div class="space-y-2 mb-4">
                            <div class="flex justify-between">
                                <span class="text-pink-100">300 Reward Credits</span>
                                <span class="font-medium">$0.08 each</span>
                            </div>
                            <div class="text-sm text-pink-100">Great for weekend getaways</div>
                        </div>
                        <button class="w-full bg-white text-pink-600 py-2 rounded-lg font-medium hover:bg-pink-50 transition-colors">
                            Purchase Credits
                        </button>
                    </div>

                    <!-- Premium Pack -->
                    <div class="bg-white border-2 border-purple-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="text-lg font-semibold text-gray-900">Premium Pack</h4>
                            <div class="text-2xl font-bold text-gray-900">$49.99</div>
                        </div>
                        <div class="space-y-2 mb-4">
                            <div class="flex justify-between">
                                <span class="text-gray-600">750 Reward Credits</span>
                                <span class="font-medium text-gray-900">$0.07 each</span>
                            </div>
                            <div class="text-sm text-gray-500">Ideal for luxury experiences</div>
                        </div>
                        <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                            Purchase Credits
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-br from-pink-600 to-purple-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">
                Start Growing Your Relationship & Your Savings Today
            </h2>
            <p class="text-xl mb-10 opacity-90 max-w-3xl mx-auto">
                Join thousands of couples who are not only building stronger relationships but also saving money on the experiences that matter most to them.
            </p>
            
            <!-- Member Benefits Summary -->
            <div class="grid md:grid-cols-3 gap-6 mb-10">
                <div class="bg-white bg-opacity-20 rounded-lg p-4">
                    <div class="text-2xl font-bold mb-2">$2,400+</div>
                    <div class="text-pink-100">Average Annual Savings</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4">
                    <div class="text-2xl font-bold mb-2">500+</div>
                    <div class="text-pink-100">Partner Locations</div>
                </div>
                <div class="bg-white bg-opacity-20 rounded-lg p-4">
                    <div class="text-2xl font-bold mb-2">94%</div>
                    <div class="text-pink-100">Member Satisfaction</div>
                </div>
            </div>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button class="w-full sm:w-auto bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-all transform hover:scale-105 shadow-lg">
                    <i class="fas fa-heart mr-2"></i>
                    Start Your Free Trial & Earn Rewards
                </button>
                <button class="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors">
                    <i class="fas fa-play mr-2"></i>
                    See Member Success Stories
                </button>
            </div>
            
            <!-- Trust Indicators -->
            <div class="mt-8 text-pink-100">
                <p class="text-sm">
                    <i class="fas fa-shield-alt mr-2"></i>
                    No credit card required • Cancel anytime • Member rewards start immediately
                </p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div class="space-y-4">
                    <div class="flex items-center">
                        <span class="text-2xl">💕</span>
                        <span class="ml-2 text-xl font-bold text-white">Better Together</span>
                    </div>
                    <p class="text-gray-400 leading-relaxed">
                        Strengthening relationships through intelligent connection tracking and exclusive member rewards.
                    </p>
                </div>
                
                <div>
                    <h5 className="font-semibold text-white mb-4">Product</h5>
                    <ul className="space-y-2">
                        <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                        <li><a href="/member-rewards.html" className="text-gray-400 hover:text-white transition-colors">Member Rewards</a></li>
                        <li><a href="/iphone-examples.html" className="text-gray-400 hover:text-white transition-colors">Examples</a></li>
                    </ul>
                </div>
                
                <div>
                    <h5 className="font-semibold text-white mb-4">Support</h5>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Member Portal</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                    </ul>
                </div>
                
                <div>
                    <h5 className="font-semibold text-white mb-4">Business</h5>
                    <ul className="space-y-2">
                        <li><a href="/become-sponsor.html" className="text-gray-400 hover:text-white transition-colors">Become a Partner</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partner Portal</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                <p className="text-gray-400">
                    &copy; 2025 Better Together. Grow stronger together, save smarter together.
                </p>
            </div>
        </div>
    </footer>

    <!-- Interactive JavaScript -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {


            // Smooth scrolling for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add hover effects to cards
            const cards = document.querySelectorAll('.bg-white.rounded-xl, .bg-gradient-to-br');
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });

            // Animate numbers on scroll (simple version)
            const observerOptions = {
                threshold: 0.5,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe all sections
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                section.style.opacity = '0.95';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'all 0.6s ease-out';
                observer.observe(section);
            });
        });
    </script>
</body>
</html>
`