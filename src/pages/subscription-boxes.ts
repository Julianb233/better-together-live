// Subscription Boxes - Full E-commerce System with Lean Canvas Integration
import { navigationHtml } from '../components/navigation.js';

export const subscriptionBoxesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relationship Subscription Boxes - Curated Experiences Delivered | Better Together</title>
    <meta name="description" content="Premium subscription boxes with 60-70% margins. Romance, Adventure, Anniversary, Self-Care & Personalized boxes delivered monthly. AI-curated experiences for couples.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
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
                            700: '#be185d',
                            800: '#9d174d'
                        },
                        purple: {
                            500: '#8b5cf6',
                            600: '#7c3aed',
                            700: '#6d28d9'
                        }
                    },
                    fontFamily: {
                        'inter': ['Inter', 'sans-serif']
                    },
                    animation: {
                        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
                        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite'
                    }
                }
            }
        }
    </script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fce7f3 100%);
        }
        .box-shadow-custom {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .profit-badge {
            background: linear-gradient(45deg, #10b981, #059669);
            color: white;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
    </style>
</head>
<body class="bg-gray-50 font-inter">
    ${navigationHtml}

    <!-- Hero Section -->
    <section class="gradient-bg py-16 sm:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <!-- Lean Canvas Value Prop Badge -->
                <div class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
                    <i class="fas fa-heart mr-2"></i>
                    AI-Curated Relationship Experiences
                </div>
                
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Subscription Boxes That
                    <span class="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        Strengthen Your Bond
                    </span>
                </h1>
                
                <p class="text-xl sm:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                    Premium curated experiences delivered monthly. Our AI learns your relationship preferences and selects the perfect items to deepen your connection.
                </p>
                
                <!-- Key Metrics Preview -->
                <div class="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-pink-600 mb-2">60-70%</div>
                        <div class="text-sm text-gray-600">Profit Margins</div>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-purple-600 mb-2">5 Types</div>
                        <div class="text-sm text-gray-600">Box Categories</div>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-blue-600 mb-2">$50-120</div>
                        <div class="text-sm text-gray-600">Price Range</div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button class="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 shadow-lg transition-all duration-300">
                        <i class="fas fa-box-heart mr-2"></i>
                        Start Your Subscription
                    </button>
                    <button class="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors shadow-lg">
                        <i class="fas fa-play mr-2"></i>
                        See Unboxing Video
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Subscription Box Types -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Choose Your Relationship Experience
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Each box is AI-curated based on your relationship preferences and designed for maximum profit margins while delivering exceptional value.
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <!-- Romance Box -->
                <div class="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="mb-6 rounded-xl overflow-hidden">
                        <img src="/images/generated/romance-box.png" alt="Romance Box - Premium candle, chocolates, bath bomb" class="w-full h-48 object-cover">
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-heart text-white text-lg"></i>
                        </div>
                        <div class="profit-badge">60% Margin</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Romance Box</h3>
                    <p class="text-gray-600 mb-6">Premium candle, artisan chocolates, luxury bath bomb, personalized love note card</p>
                    
                    <!-- Cost Breakdown -->
                    <div class="bg-white rounded-lg p-4 mb-6 text-sm">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">COGS:</span>
                            <span class="font-semibold">$15.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Shipping (1.5 lbs):</span>
                            <span class="font-semibold">$5.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Packaging & Handling:</span>
                            <span class="font-semibold">$4.25</span>
                        </div>
                        <div class="border-t pt-2 flex justify-between items-center font-bold">
                            <span>Total Cost:</span>
                            <span class="text-red-600">$24.25</span>
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$60<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Profit: $35.75 per box</div>
                        <button class="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                            Subscribe Now
                        </button>
                    </div>
                </div>

                <!-- Adventure Date Box -->
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="mb-6 rounded-xl overflow-hidden">
                        <img src="/images/generated/adventure-box.png" alt="Adventure Date Box - Hiking gear, picnic supplies" class="w-full h-48 object-cover">
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-mountain text-white text-lg"></i>
                        </div>
                        <div class="profit-badge">62% Margin</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Adventure Date Box</h3>
                    <p class="text-gray-600 mb-6">DIY painting kit, picnic blanket, couples game, adventure planning guide</p>
                    
                    <!-- Cost Breakdown -->
                    <div class="bg-white rounded-lg p-4 mb-6 text-sm">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">COGS:</span>
                            <span class="font-semibold">$20.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Shipping (3.0 lbs):</span>
                            <span class="font-semibold">$8.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Packaging & Handling:</span>
                            <span class="font-semibold">$4.50</span>
                        </div>
                        <div class="border-t pt-2 flex justify-between items-center font-bold">
                            <span>Total Cost:</span>
                            <span class="text-red-600">$32.50</span>
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$85<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Profit: $52.50 per box</div>
                        <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            Subscribe Now
                        </button>
                    </div>
                </div>

                <!-- Anniversary Box -->
                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="mb-6 rounded-xl overflow-hidden">
                        <img src="/images/generated/anniversary-box.png" alt="Anniversary Box - Champagne glasses, jewelry, keepsake" class="w-full h-48 object-cover">
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-gift text-white text-lg"></i>
                        </div>
                        <div class="profit-badge">62% Margin</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Anniversary Box</h3>
                    <p class="text-gray-600 mb-6">Jewelry piece, wine glass set, gourmet snacks, celebration accessories</p>
                    
                    <!-- Cost Breakdown -->
                    <div class="bg-white rounded-lg p-4 mb-6 text-sm">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">COGS:</span>
                            <span class="font-semibold">$30.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Shipping (4.0 lbs):</span>
                            <span class="font-semibold">$10.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Packaging & Handling:</span>
                            <span class="font-semibold">$5.00</span>
                        </div>
                        <div class="border-t pt-2 flex justify-between items-center font-bold">
                            <span>Total Cost:</span>
                            <span class="text-red-600">$45.00</span>
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$120<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Profit: $75.00 per box</div>
                        <button class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                            Subscribe Now
                        </button>
                    </div>
                </div>

                <!-- Self-Care Box -->
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="mb-6 rounded-xl overflow-hidden">
                        <img src="/images/generated/selfcare-box.png" alt="Self-Care Box - Skincare, aromatherapy, tea" class="w-full h-48 object-cover">
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-leaf text-white text-lg"></i>
                        </div>
                        <div class="profit-badge">57% Margin</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Self-Care Box</h3>
                    <p class="text-gray-600 mb-6">Relationship journal, premium tea set, aromatherapy oils, mindfulness guide</p>
                    
                    <!-- Cost Breakdown -->
                    <div class="bg-white rounded-lg p-4 mb-6 text-sm">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">COGS:</span>
                            <span class="font-semibold">$12.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Shipping (1.2 lbs):</span>
                            <span class="font-semibold">$5.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Packaging & Handling:</span>
                            <span class="font-semibold">$4.25</span>
                        </div>
                        <div class="border-t pt-2 flex justify-between items-center font-bold">
                            <span>Total Cost:</span>
                            <span class="text-red-600">$21.25</span>
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$50<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Profit: $28.75 per box</div>
                        <button class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                            Subscribe Now
                        </button>
                    </div>
                </div>

                <!-- Personalized Box -->
                <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="flex items-center justify-between mb-6">
                        <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-star text-white text-2xl"></i>
                        </div>
                        <div class="profit-badge">62% Margin</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Personalized Box</h3>
                    <p class="text-gray-600 mb-6">Custom engraved keepsake, personalized candle, luxury gift wrap, AI-selected items</p>
                    
                    <!-- Cost Breakdown -->
                    <div class="bg-white rounded-lg p-4 mb-6 text-sm">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">COGS:</span>
                            <span class="font-semibold">$25.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Shipping (2.5 lbs):</span>
                            <span class="font-semibold">$8.00</span>
                        </div>
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-gray-600">Packaging & Handling:</span>
                            <span class="font-semibold">$4.75</span>
                        </div>
                        <div class="border-t pt-2 flex justify-between items-center font-bold">
                            <span>Total Cost:</span>
                            <span class="text-red-600">$37.75</span>
                        </div>
                    </div>

                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$100<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Profit: $62.25 per box</div>
                        <button class="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                            Subscribe Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Revenue Projections -->
    <section class="py-16 bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Revenue & Profitability Projections</h2>
                <p class="text-xl text-gray-300">Example revenue for 1,000 subscribers per box type</p>
            </div>

            <div class="overflow-x-auto mb-12">
                <table class="w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead class="bg-gray-700">
                        <tr>
                            <th class="px-6 py-4 text-left">Box Type</th>
                            <th class="px-6 py-4 text-center">Retail Price</th>
                            <th class="px-6 py-4 text-center">Total Cost</th>
                            <th class="px-6 py-4 text-center">Profit Per Box</th>
                            <th class="px-6 py-4 text-center">Monthly Revenue</th>
                            <th class="px-6 py-4 text-center">Monthly Profit</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-700">
                        <tr>
                            <td class="px-6 py-4 font-semibold">Romance Box</td>
                            <td class="px-6 py-4 text-center">$60</td>
                            <td class="px-6 py-4 text-center text-red-400">$24.25</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$35.75</td>
                            <td class="px-6 py-4 text-center font-semibold">$60,000</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$35,750</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 font-semibold">Adventure Date Box</td>
                            <td class="px-6 py-4 text-center">$85</td>
                            <td class="px-6 py-4 text-center text-red-400">$32.50</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$52.50</td>
                            <td class="px-6 py-4 text-center font-semibold">$85,000</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$52,500</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 font-semibold">Anniversary Box</td>
                            <td class="px-6 py-4 text-center">$120</td>
                            <td class="px-6 py-4 text-center text-red-400">$45.00</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$75.00</td>
                            <td class="px-6 py-4 text-center font-semibold">$120,000</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$75,000</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 font-semibold">Self-Care Box</td>
                            <td class="px-6 py-4 text-center">$50</td>
                            <td class="px-6 py-4 text-center text-red-400">$21.25</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$28.75</td>
                            <td class="px-6 py-4 text-center font-semibold">$50,000</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$28,750</td>
                        </tr>
                        <tr>
                            <td class="px-6 py-4 font-semibold">Personalized Box</td>
                            <td class="px-6 py-4 text-center">$100</td>
                            <td class="px-6 py-4 text-center text-red-400">$37.75</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$62.25</td>
                            <td class="px-6 py-4 text-center font-semibold">$100,000</td>
                            <td class="px-6 py-4 text-center text-green-400 font-bold">$62,250</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="grid md:grid-cols-3 gap-8 text-center">
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-green-400 mb-2">$415,000</div>
                    <div class="text-gray-300">Total Monthly Revenue</div>
                    <div class="text-sm text-gray-400 mt-1">Per 1,000 subscribers each</div>
                </div>
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-green-400 mb-2">$254,250</div>
                    <div class="text-gray-300">Total Monthly Profit</div>
                    <div class="text-sm text-gray-400 mt-1">61% average margin</div>
                </div>
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-blue-400 mb-2">$3.05M</div>
                    <div class="text-gray-300">Annual Profit Potential</div>
                    <div class="text-sm text-gray-400 mt-1">Scalable to millions</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Annual Subscription Benefits -->
    <section class="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Annual Subscription Perks</h2>
                <p class="text-xl text-gray-600">Commit for a year and unlock exclusive benefits that boost customer retention</p>
            </div>

            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Exclusive Annual Benefits</h3>
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-percentage text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">15% Discount</h4>
                                <p class="text-gray-600">Save on all subscription boxes for the entire year</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-crown text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Custom Engraving</h4>
                                <p class="text-gray-600">Free personalized items and handwritten notes in every box</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-gift text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Bonus Premium Items</h4>
                                <p class="text-gray-600">Luxury candle or wine opener added to every monthly box</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-calendar-star text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Special Occasion Box</h4>
                                <p class="text-gray-600">Free anniversary and holiday boxes for committed subscribers</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-qrcode text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Exclusive Content</h4>
                                <p class="text-gray-600">QR codes for curated date ideas and relationship tutorials</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">Annual Savings Calculator</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Monthly Romance Box:</span>
                            <span class="font-semibold">$60 × 12 = $720</span>
                        </div>
                        <div class="flex justify-between items-center text-green-600">
                            <span>Annual Discount (15%):</span>
                            <span class="font-semibold">-$108</span>
                        </div>
                        <div class="flex justify-between items-center text-purple-600">
                            <span>Free Special Occasion Boxes:</span>
                            <span class="font-semibold">-$120 value</span>
                        </div>
                        <div class="border-t pt-4 flex justify-between items-center text-xl font-bold">
                            <span>Your Annual Price:</span>
                            <span class="text-green-600">$612</span>
                        </div>
                        <div class="text-center text-gray-600">
                            <span class="font-semibold text-green-600">Save $228</span> compared to monthly billing
                        </div>
                    </div>
                    <button class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold mt-6 hover:from-pink-700 hover:to-purple-700 transition-all">
                        Subscribe Annually & Save
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Lean Canvas Integration -->
    <section class="py-16 bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Strategic Business Model</h2>
                <p class="text-xl text-gray-300">How subscription boxes integrate with our Lean Canvas strategy</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-users text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Customer Segments</h3>
                    <ul class="text-sm text-gray-300 space-y-2">
                        <li>• Couples seeking deeper connection</li>
                        <li>• Friend groups supporting relationships</li>
                        <li>• Therapists & relationship coaches</li>
                        <li>• Retail & experience vendors</li>
                    </ul>
                </div>

                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-lightbulb text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Value Proposition</h3>
                    <p class="text-sm text-gray-300">
                        AI-driven relationship guidance + curated physical experiences + calendar reminders + community support = Complete relationship ecosystem
                    </p>
                </div>

                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-dollar-sign text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Revenue Streams</h3>
                    <ul class="text-sm text-gray-300 space-y-2">
                        <li>• Subscription boxes (60-70% margins)</li>
                        <li>• App subscriptions (recurring revenue)</li>
                        <li>• Vendor partnerships & commissions</li>
                        <li>• Premium AI-executed services</li>
                    </ul>
                </div>

                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-star text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Unfair Advantage</h3>
                    <ul class="text-sm text-gray-300 space-y-2">
                        <li>• AI-executed actions for partners</li>
                        <li>• Emotionally intelligent AI</li>
                        <li>• Integrated calendar & reminders</li>
                        <li>• Vendor-curated experiences</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Start Building Stronger Relationships Today
            </h2>
            <p class="text-xl mb-8 opacity-90">
                Join thousands of couples already strengthening their bonds with AI-curated experiences
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button class="w-full sm:w-auto bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                    <i class="fas fa-box-heart mr-2"></i>
                    Choose Your First Box
                </button>
                <button class="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors">
                    <i class="fas fa-mobile-alt mr-2"></i>
                    Download the App
                </button>
            </div>

            <div class="text-pink-100">
                <p class="text-sm">
                    <i class="fas fa-shield-alt mr-2"></i>
                    30-day money back guarantee • Cancel anytime • Free shipping on annual plans
                </p>
            </div>
        </div>
    </section>

    <!-- JavaScript for Interactive Features -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Add smooth scrolling for anchor links
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

            // Add hover effects to subscription boxes
            const boxCards = document.querySelectorAll('.hover-lift');
            boxCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Subscription button interactions
            const subscribeButtons = document.querySelectorAll('button[class*="bg-"]');
            subscribeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Add ripple effect
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 100);
                    
                    // Here you would integrate with subscription service
                    console.log('Subscription button clicked:', this.textContent.trim());
                });
            });

            // Animate numbers on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        if (element.classList.contains('animate-number')) {
                            animateNumber(element);
                            observer.unobserve(element);
                        }
                    }
                });
            }, observerOptions);

            // Observe elements with animation
            const animateElements = document.querySelectorAll('.animate-number');
            animateElements.forEach(el => observer.observe(el));
        });

        function animateNumber(element) {
            const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
            const duration = 1500;
            const start = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(progress * target);
                
                if (element.textContent.includes('%')) {
                    element.textContent = current + '%';
                } else if (element.textContent.includes('$')) {
                    element.textContent = '$' + current.toLocaleString();
                } else {
                    element.textContent = current.toLocaleString();
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }
    </script>
</body>
</html>`;