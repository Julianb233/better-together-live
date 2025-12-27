// Become a Partner - Premium Business Partnership Portal
import { navigationHtml } from '../components/navigation.js';

export const becomeSponsorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Partner with Better Together | #1 Couples Platform</title>
    <meta name="description" content="Join 500+ premium brands partnering with Better Together. Access 50,000+ engaged couples actively investing $2.4K+ annually in relationship experiences. Apply now for exclusive partnership opportunities.">
    <meta name="keywords" content="business partnership, couples marketing, relationship platform, B2B partnerships, customer acquisition, couple demographics, engagement marketing">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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
                        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
                        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate'
                    },
                    keyframes: {
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(30px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' }
                        },
                        slideInRight: {
                            '0%': { opacity: '0', transform: 'translateX(30px)' },
                            '100%': { opacity: '1', transform: 'translateX(0)' }
                        },
                        pulseGlow: {
                            '0%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' },
                            '100%': { boxShadow: '0 0 30px rgba(236, 72, 153, 0.8)' }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .gradient-bg {
            background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 25%, #ede9fe 50%, #e0e7ff 75%, #f0f9ff 100%);
        }
        /* iOS 26 Liquid Glass Effects */
        .liquid-glass {
            backdrop-filter: blur(40px) saturate(180%);
            background: linear-gradient(145deg, 
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.1) 100%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 
                0 25px 45px -12px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                0 1px 3px rgba(255, 255, 255, 0.2) inset;
        }
        .liquid-glass-dark {
            backdrop-filter: blur(40px) saturate(180%);
            background: linear-gradient(145deg, 
                rgba(0, 0, 0, 0.05) 0%,
                rgba(0, 0, 0, 0.02) 50%,
                rgba(0, 0, 0, 0.08) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 
                0 25px 45px -12px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.03) inset,
                0 1px 3px rgba(255, 255, 255, 0.1) inset;
        }
        .liquid-glass-accent {
            backdrop-filter: blur(30px) saturate(200%);
            background: linear-gradient(145deg, 
                rgba(236, 72, 153, 0.12) 0%,
                rgba(139, 92, 246, 0.08) 50%,
                rgba(236, 72, 153, 0.15) 100%);
            border: 1px solid rgba(236, 72, 153, 0.2);
            box-shadow: 
                0 20px 40px -12px rgba(236, 72, 153, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 1px 3px rgba(255, 255, 255, 0.3) inset;
        }
        .glass-effect {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.25);
            border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .floating-card {
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-10px) scale(1.02); }
        }
        /* iOS 26 Fluid Animations */
        .liquid-hover {
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .liquid-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 
                0 35px 60px -12px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 2px 8px rgba(255, 255, 255, 0.4) inset;
        }
        .liquid-press {
            transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .liquid-press:active {
            transform: scale(0.98);
            box-shadow: 
                0 10px 25px -8px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }
        .morphing-gradient {
            background: linear-gradient(45deg, 
                rgba(236, 72, 153, 0.8), 
                rgba(139, 92, 246, 0.8),
                rgba(59, 130, 246, 0.8),
                rgba(236, 72, 153, 0.8));
            background-size: 300% 300%;
            animation: morphGradient 8s ease infinite;
        }
        @keyframes morphGradient {
            0% { background-position: 0% 50%; }
            33% { background-position: 100% 50%; }
            66% { background-position: 50% 100%; }
            100% { background-position: 0% 50%; }
        }
        .video-thumbnail {
            position: relative;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .video-thumbnail:hover {
            transform: scale(1.05);
        }
        .play-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background: rgba(236, 72, 153, 0.9);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            transition: all 0.3s ease;
        }
        .video-thumbnail:hover .play-button {
            background: rgba(236, 72, 153, 1);
            transform: translate(-50%, -50%) scale(1.1);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation - Liquid Glass -->
    <nav class="liquid-glass sticky top-0 z-50 border-b border-white/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <a href="/" class="flex items-center liquid-hover">
                        <span class="text-2xl">💕</span>
                        <span class="ml-2 text-xl font-bold text-gray-900">Better Together</span>
                        <span class="ml-3 text-sm morphing-gradient text-white px-3 py-1 rounded-full font-semibold shadow-lg">Business</span>
                    </a>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="/" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">App Home</a>
                    <a href="/member-rewards.html" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">Member Rewards</a>
                    <a href="#roi-calculator" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">ROI Calculator</a>
                    <a href="#partnership-tiers" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">Partnership Tiers</a>
                    <a href="#book-demo" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">Book Demo</a>
                    <button class="liquid-glass-accent text-white px-6 py-2 rounded-lg font-semibold liquid-hover liquid-press shadow-lg">
                        Partner Portal Login
                    </button>
                </div>
                <div class="md:hidden">
                    <button class="text-gray-600 hover:text-gray-900 p-2" id="mobileMenuButton">
                        <i class="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section - Enhanced -->
    <section class="gradient-bg py-20 sm:py-24 overflow-hidden relative">
        <!-- Background Elements -->
        <div class="absolute inset-0">
            <div class="absolute top-20 left-10 text-pink-200 text-6xl opacity-20 floating-card">💼</div>
            <div class="absolute bottom-20 right-10 text-purple-200 text-5xl opacity-20 floating-card" style="animation-delay: -3s;">📈</div>
            <div class="absolute top-1/2 left-1/4 text-blue-200 text-4xl opacity-20 floating-card" style="animation-delay: -1.5s;">🤝</div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div class="text-center">
                <!-- Authority Badge with Live Counter - Liquid Glass -->
                <div class="inline-flex items-center px-6 py-3 liquid-glass rounded-full shadow-lg text-gray-800 text-sm font-semibold mb-8 animate-fade-in-up liquid-hover">
                    <i class="fas fa-crown text-yellow-500 mr-3"></i>
                    <span class="mr-2">Trusted by</span>
                    <span class="text-pink-600 font-bold text-lg" id="partnerCount">500+</span>
                    <span class="ml-1">Premium Brands</span>
                    <div class="ml-3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span class="ml-1 text-green-600 text-xs">Live</span>
                </div>
                
                <!-- Main Headlines with Power Words -->
                <h1 class="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight animate-fade-in-up" style="animation-delay: 0.2s;">
                    Turn Engaged Couples Into
                    <span class="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 animate-pulse-glow">
                        Your Best Customers
                    </span>
                </h1>
                
                <p class="text-xl sm:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in-up" style="animation-delay: 0.4s;">
                    Partner with the #1 relationship platform to access <strong class="text-pink-600">50,000+ actively engaged couples</strong> who invest an average of <strong class="text-green-600">$2,400+ annually</strong> in meaningful experiences together
                </p>
                
                <!-- Enhanced Value Proposition Cards -->
                <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12 animate-fade-in-up" style="animation-delay: 0.6s;">
                    <div class="liquid-glass rounded-2xl p-6 text-center liquid-hover">
                        <div class="w-16 h-16 morphing-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <i class="fas fa-users-heart text-white text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 mb-2">High-Intent Audience</h3>
                        <p class="text-gray-600">87% purchase within 7 days</p>
                        <div class="mt-2 text-2xl font-black text-pink-600">87%</div>
                    </div>
                    
                    <div class="liquid-glass rounded-2xl p-6 text-center liquid-hover">
                        <div class="w-16 h-16 morphing-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <i class="fas fa-chart-line text-white text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 mb-2">Proven Growth</h3>
                        <p class="text-gray-600">Partners see +47% revenue increase</p>
                        <div class="mt-2 text-2xl font-black text-purple-600">+47%</div>
                    </div>
                    
                    <div class="liquid-glass rounded-2xl p-6 text-center liquid-hover">
                        <div class="w-16 h-16 morphing-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <i class="fas fa-rocket text-white text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-bold text-gray-900 mb-2">Fast Setup</h3>
                        <p class="text-gray-600">Live in 48 hours or less</p>
                        <div class="mt-2 text-2xl font-black text-blue-600">48h</div>
                    </div>
                </div>

                <!-- Enhanced CTA Section - Liquid Glass -->
                <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 animate-fade-in-up" style="animation-delay: 0.8s;">
                    <button class="group w-full sm:w-auto liquid-glass-accent text-white px-10 py-4 rounded-xl font-bold text-lg liquid-hover liquid-press shadow-2xl" onclick="scrollToSection('book-demo')">
                        <i class="fas fa-calendar-plus mr-3 group-hover:animate-bounce"></i>
                        Book Your Success Demo
                        <span class="block text-sm font-normal opacity-90">See Your ROI in 15 Minutes</span>
                    </button>
                    <button class="w-full sm:w-auto liquid-glass text-gray-700 px-10 py-4 rounded-xl font-bold text-lg border-2 border-white/30 liquid-hover liquid-press shadow-lg" onclick="scrollToSection('roi-calculator')">
                        <i class="fas fa-calculator mr-3"></i>
                        Calculate Your ROI
                        <span class="block text-sm font-normal text-gray-500">Free Revenue Projection</span>
                    </button>
                </div>

                <!-- Urgency & Scarcity Elements - Liquid Glass -->
                <div class="liquid-glass-dark rounded-xl p-4 max-w-2xl mx-auto animate-fade-in-up liquid-hover" style="animation-delay: 1s;">
                    <div class="flex items-center justify-center space-x-6 text-sm">
                        <div class="flex items-center text-red-600">
                            <i class="fas fa-fire mr-2 animate-pulse"></i>
                            <span class="font-semibold">LIMITED: Only <span id="spotsRemaining">23</span> Q1 spots remaining</span>
                        </div>
                        <div class="flex items-center text-green-600">
                            <i class="fas fa-shield-check mr-2"></i>
                            <span>Revenue Guarantee or Money Back</span>
                        </div>
                        <div class="flex items-center text-blue-600">
                            <i class="fas fa-clock mr-2"></i>
                            <span>5-Minute Application</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Interactive ROI Calculator - Liquid Glass -->
    <section class="py-20 gradient-bg" id="roi-calculator">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Calculate Your Partnership ROI
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    See exactly how much revenue Better Together can generate for your business with our interactive calculator
                </p>
            </div>

            <div class="grid lg:grid-cols-2 gap-12 items-start">
                <!-- Calculator Inputs - Liquid Glass -->
                <div class="liquid-glass rounded-2xl p-8 shadow-xl liquid-hover">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Your Business Details</h3>
                    
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Business Type</label>
                            <select id="businessType" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white">
                                <option value="restaurant">Restaurant / Dining</option>
                                <option value="hotel">Hotel / Accommodation</option>
                                <option value="experience">Activities / Experiences</option>
                                <option value="retail">Retail / Gifts</option>
                                <option value="spa">Spa / Wellness</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Average Order Value</label>
                            <div class="relative">
                                <span class="absolute left-3 top-3 text-gray-500 font-semibold">$</span>
                                <input type="number" id="avgOrderValue" value="150" min="10" max="10000" class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Desired Monthly Customers</label>
                            <input type="range" id="monthlyCustomers" min="10" max="500" value="100" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                            <div class="flex justify-between text-sm text-gray-500 mt-1">
                                <span>10</span>
                                <span class="font-semibold text-pink-600" id="customerCount">100</span>
                                <span>500+</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Commission Rate You Can Offer</label>
                            <input type="range" id="commissionRate" min="8" max="25" value="15" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                            <div class="flex justify-between text-sm text-gray-500 mt-1">
                                <span>8%</span>
                                <span class="font-semibold text-purple-600" id="commissionDisplay">15%</span>
                                <span>25%</span>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-3">Repeat Visit Rate</label>
                            <select id="repeatRate" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white">
                                <option value="1.2">20% repeat (1.2x lifetime value)</option>
                                <option value="1.5">50% repeat (1.5x lifetime value)</option>
                                <option value="2.0">High repeat (2.0x lifetime value)</option>
                                <option value="3.0">Very high repeat (3.0x lifetime value)</option>
                            </select>
                        </div>
                    </div>

                    <button class="w-full mt-8 liquid-glass-accent text-white py-4 rounded-lg font-bold text-lg liquid-hover liquid-press" onclick="calculateROI()">
                        <i class="fas fa-calculator mr-2"></i>
                        Calculate My ROI
                    </button>
                </div>

                <!-- ROI Results - Liquid Glass Dark -->
                <div class="liquid-glass-dark text-white rounded-2xl p-8 shadow-2xl liquid-hover">
                    <h3 class="text-2xl font-bold mb-6">Your Projected Results</h3>
                    
                    <div class="space-y-6">
                        <!-- Monthly Revenue -->
                        <div class="liquid-glass-accent rounded-xl p-6">
                            <div class="text-pink-100 text-sm font-medium mb-1">Monthly Revenue</div>
                            <div class="text-4xl font-black" id="monthlyRevenue">$15,000</div>
                            <div class="text-pink-200 text-sm mt-1" id="monthlyDetails">100 customers × $150 avg order</div>
                        </div>

                        <!-- Annual Revenue -->
                        <div class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6">
                            <div class="text-purple-100 text-sm font-medium mb-1">Annual Revenue Potential</div>
                            <div class="text-4xl font-black" id="annualRevenue">$180,000</div>
                            <div class="text-purple-200 text-sm mt-1" id="annualDetails">Including repeat customers</div>
                        </div>

                        <!-- Commission Cost -->
                        <div class="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-6">
                            <div class="text-gray-300 text-sm font-medium mb-1">Annual Commission Cost</div>
                            <div class="text-3xl font-bold" id="commissionCost">$27,000</div>
                            <div class="text-gray-400 text-sm mt-1">15% commission rate</div>
                        </div>

                        <!-- Net Profit -->
                        <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 border-2 border-green-400">
                            <div class="text-green-100 text-sm font-medium mb-1">Net Additional Profit</div>
                            <div class="text-4xl font-black" id="netProfit">$153,000</div>
                            <div class="text-green-200 text-sm mt-1" id="roiMultiple">5.7x return on investment</div>
                        </div>
                    </div>

                    <div class="mt-8 p-4 bg-yellow-500 bg-opacity-20 rounded-lg border border-yellow-400">
                        <div class="flex items-center text-yellow-200">
                            <i class="fas fa-lightbulb mr-2"></i>
                            <span class="text-sm font-medium">Pro Tip: Most partners see 20-40% higher results than projections due to Better Together's high-quality customer base.</span>
                        </div>
                    </div>

                    <button class="w-full mt-6 liquid-glass-accent text-white py-4 rounded-lg font-bold text-lg liquid-hover liquid-press" onclick="scrollToSection('apply-now')">
                        <i class="fas fa-rocket mr-2"></i>
                        Apply Now - Lock in These Results
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Video Testimonials & Case Studies - Liquid Glass -->
    <section class="py-20 gradient-bg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Real Partners, Real Results
                </h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    See how businesses just like yours are thriving with Better Together partnerships
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Video Testimonial 1 - Liquid Glass -->
                <div class="liquid-glass rounded-2xl shadow-xl overflow-hidden group liquid-hover">
                    <div class="video-thumbnail h-48 morphing-gradient relative">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="absolute bottom-4 left-4 text-white">
                            <div class="text-sm opacity-90">Success Story</div>
                            <div class="font-bold">Bella Vista Restaurant</div>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-utensils text-pink-600"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900">Maria Rodriguez</h4>
                                <p class="text-sm text-gray-600">Owner, Bella Vista</p>
                            </div>
                        </div>
                        <blockquote class="text-gray-700 mb-4 italic">
                            "Better Together members became 35% of our weekend revenue in just 3 months. The quality of customers is incredible - they're engaged, spend more, and always return."
                        </blockquote>
                        <div class="grid grid-cols-2 gap-4 text-center">
                            <div class="bg-pink-50 p-3 rounded-lg">
                                <div class="text-2xl font-bold text-pink-600">+73%</div>
                                <div class="text-xs text-gray-600">Revenue Growth</div>
                            </div>
                            <div class="bg-purple-50 p-3 rounded-lg">
                                <div class="text-2xl font-bold text-purple-600">4.9★</div>
                                <div class="text-xs text-gray-600">Customer Rating</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Video Testimonial 2 -->
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                    <div class="video-thumbnail h-48 bg-gradient-to-br from-blue-400 to-indigo-500 relative">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="absolute bottom-4 left-4 text-white">
                            <div class="text-sm opacity-90">Case Study</div>
                            <div class="font-bold">Serenity Spa Resort</div>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-spa text-blue-600"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-gray-900">David Chen</h4>
                                <p class="text-sm text-gray-600">GM, Serenity Spa Resort</p>
                            </div>
                        </div>
                        <blockquote class="text-gray-700 mb-4 italic">
                            "Our partnership with Better Together transformed our couples packages. We went from 60% to 95% occupancy on weekends. The ROI has been phenomenal."
                        </blockquote>
                        <div class="grid grid-cols-2 gap-4 text-center">
                            <div class="bg-blue-50 p-3 rounded-lg">
                                <div class="text-2xl font-bold text-blue-600">+158%</div>
                                <div class="text-xs text-gray-600">Booking Value</div>
                            </div>
                            <div class="bg-indigo-50 p-3 rounded-lg">
                                <div class="text-2xl font-bold text-indigo-600">95%</div>
                                <div class="text-xs text-gray-600">Weekend Occupancy</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Written Testimonial with Chart -->
                <div class="bg-white rounded-2xl shadow-xl p-6 group hover:shadow-2xl transition-all duration-300">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <i class="fas fa-gem text-green-600"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-900">Sarah Williams</h4>
                            <p class="text-sm text-gray-600">Founder, Eternal Jewelry</p>
                        </div>
                    </div>
                    
                    <blockquote class="text-gray-700 mb-6 italic">
                        "As a small jewelry business, Better Together gave us access to couples actively looking for meaningful gifts. We've tripled our custom engagement orders."
                    </blockquote>
                    
                    <!-- Mini Chart -->
                    <div class="mb-6">
                        <canvas id="jewelryChart" width="300" height="150"></canvas>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 text-center">
                        <div class="bg-green-50 p-3 rounded-lg">
                            <div class="text-2xl font-bold text-green-600">+245%</div>
                            <div class="text-xs text-gray-600">Custom Orders</div>
                        </div>
                        <div class="bg-yellow-50 p-3 rounded-lg">
                            <div class="text-2xl font-bold text-yellow-600">$540</div>
                            <div class="text-xs text-gray-600">Avg Order Value</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- View All Success Stories CTA -->
            <div class="text-center mt-12">
                <button class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                    <i class="fas fa-video mr-2"></i>
                    Watch All Success Stories
                </button>
            </div>
        </div>
    </section>

    <!-- Enhanced Partnership Tiers -->
    <section class="py-20 bg-white" id="partnership-tiers">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Choose Your Partnership Level
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    From local businesses to enterprise brands, we have the perfect partnership tier to accelerate your growth
                </p>
            </div>

            <!-- Partnership Comparison Table -->
            <div class="mb-12 overflow-x-auto">
                <table class="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                    <thead class="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
                        <tr>
                            <th class="px-6 py-4 text-left font-bold">Features</th>
                            <th class="px-6 py-4 text-center font-bold">Featured<br><small class="font-normal opacity-90">Local/Emerging</small></th>
                            <th class="px-6 py-4 text-center font-bold bg-yellow-500 bg-opacity-20 relative">
                                Premium<br><small class="font-normal opacity-90">Established</small>
                                <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">POPULAR</div>
                            </th>
                            <th class="px-6 py-4 text-center font-bold">Elite<br><small class="font-normal opacity-90">Enterprise</small></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 font-semibold text-gray-900">Commission Rate</td>
                            <td class="px-6 py-4 text-center">8-12%</td>
                            <td class="px-6 py-4 text-center bg-yellow-50 font-semibold text-purple-600">12-18%</td>
                            <td class="px-6 py-4 text-center">Custom</td>
                        </tr>
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 font-semibold text-gray-900">Monthly Minimum</td>
                            <td class="px-6 py-4 text-center">$500</td>
                            <td class="px-6 py-4 text-center bg-yellow-50 font-semibold text-purple-600">$2,000</td>
                            <td class="px-6 py-4 text-center">$10,000+</td>
                        </tr>
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 font-semibold text-gray-900">App Placement</td>
                            <td class="px-6 py-4 text-center">Directory Listing</td>
                            <td class="px-6 py-4 text-center bg-yellow-50 font-semibold text-purple-600">Featured Spots</td>
                            <td class="px-6 py-4 text-center">Premium Placement</td>
                        </tr>
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 font-semibold text-gray-900">Account Management</td>
                            <td class="px-6 py-4 text-center">Email Support</td>
                            <td class="px-6 py-4 text-center bg-yellow-50 font-semibold text-purple-600">Dedicated Manager</td>
                            <td class="px-6 py-4 text-center">Strategic Partnership Team</td>
                        </tr>
                        <tr class="hover:bg-gray-50">
                            <td class="px-6 py-4 font-semibold text-gray-900">Marketing Support</td>
                            <td class="px-6 py-4 text-center"><i class="fas fa-check text-green-500"></i></td>
                            <td class="px-6 py-4 text-center bg-yellow-50"><i class="fas fa-check-double text-purple-600"></i></td>
                            <td class="px-6 py-4 text-center"><i class="fas fa-crown text-yellow-500"></i></td>
                        </tr>

                    </tbody>
                </table>
            </div>

            <!-- Partnership Cards -->
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Featured Partner -->
                <div class="bg-white rounded-2xl shadow-xl border-2 border-gray-200 hover:border-pink-300 transition-all duration-300 group">
                    <div class="p-8">
                        <div class="text-center">
                            <div class="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <i class="fas fa-handshake text-white text-3xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold mb-2 text-gray-900">Featured Partner</h3>
                            <p class="text-gray-600 mb-6">Perfect for local businesses ready to grow</p>
                            
                            <div class="space-y-4 text-left mb-8">
                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">Up to 15% member discounts</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">Partner directory listing</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">Monthly performance reports</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">Email support (24-48h response)</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">Basic marketing materials</span>
                                </div>
                            </div>

                            <div class="bg-pink-50 p-4 rounded-lg mb-6">
                                <p class="text-pink-800 text-sm font-semibold">Commission: 8-12%</p>
                                <p class="text-pink-600 text-sm">Monthly minimum: $500</p>
                                <p class="text-green-600 text-sm font-bold">Avg ROI: 340%</p>
                            </div>

                            <button class="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors group-hover:scale-105" onclick="selectTier('featured')">
                                Apply as Featured Partner
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Premium Partner - Most Popular -->
                <div class="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-2xl text-white transform scale-105 relative group hover:scale-110 transition-all duration-300">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div class="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                            🏆 MOST POPULAR
                        </div>
                    </div>
                    <div class="p-8">
                        <div class="text-center">
                            <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <i class="fas fa-crown text-white text-3xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold mb-2">Premium Partner</h3>
                            <p class="text-pink-100 mb-6">For established brands ready to scale</p>
                            
                            <div class="space-y-4 text-left mb-8">
                                <div class="flex items-center">
                                    <i class="fas fa-check text-yellow-300 mr-3"></i>
                                    <span class="text-sm">Up to 30% exclusive member discounts</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-yellow-300 mr-3"></i>
                                    <span class="text-sm">Featured placement in app</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-yellow-300 mr-3"></i>
                                    <span class="text-sm">Dedicated account manager</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-yellow-300 mr-3"></i>
                                    <span class="text-sm">Advanced analytics dashboard</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-yellow-300 mr-3"></i>
                                    <span class="text-sm">Co-marketing campaigns</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-yellow-300 mr-3"></i>
                                    <span class="text-sm">Priority customer support (4h response)</span>
                                </div>
                            </div>

                            <div class="bg-white bg-opacity-20 p-4 rounded-lg mb-6">
                                <p class="text-white text-sm font-semibold">Commission: 12-18%</p>
                                <p class="text-pink-100 text-sm">Monthly minimum: $2,000</p>
                                <p class="text-yellow-300 text-sm font-bold">Avg ROI: 520%</p>
                            </div>

                            <button class="w-full bg-white text-pink-600 py-3 rounded-lg font-bold hover:bg-pink-50 transition-colors group-hover:scale-105" onclick="selectTier('premium')">
                                Apply as Premium Partner
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Elite Partner -->
                <div class="bg-white rounded-2xl shadow-xl border-2 border-purple-300 hover:border-purple-500 transition-all duration-300 group">
                    <div class="p-8">
                        <div class="text-center">
                            <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <i class="fas fa-diamond text-white text-3xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold mb-2 text-gray-900">Elite Partner</h3>
                            <p class="text-gray-600 mb-6">Enterprise solution for market leaders</p>
                            
                            <div class="space-y-4 text-left mb-8">
                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">Custom discount structures</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">White-label integration options</span>
                                </div>

                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">Strategic partnership team</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">Exclusive member campaigns</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-check text-green-500 mr-3"></i>
                                    <span class="text-sm">24/7 priority support</span>
                                </div>
                            </div>

                            <div class="bg-purple-50 p-4 rounded-lg mb-6">
                                <p class="text-purple-800 text-sm font-semibold">Custom revenue sharing</p>
                                <p class="text-purple-600 text-sm">Enterprise-level minimums</p>
                                <p class="text-green-600 text-sm font-bold">Avg ROI: 750%+</p>
                            </div>

                            <button class="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors group-hover:scale-105" onclick="selectTier('elite')">
                                Schedule Elite Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Book Demo Section -->
    <section class="py-20 bg-gradient-to-br from-pink-600 to-purple-700" id="book-demo">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center text-white mb-16">
                <h2 class="text-4xl md:text-5xl font-bold mb-6">
                    See Better Together in Action
                </h2>
                <p class="text-xl text-pink-100 max-w-3xl mx-auto">
                    Book a personalized demo and see exactly how our platform can drive revenue for your business
                </p>
            </div>

            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <!-- Demo Benefits -->
                <div class="space-y-8">
                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <i class="fas fa-chart-line text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white mb-2">See Your Custom ROI Projection</h3>
                            <p class="text-pink-100">Get a personalized revenue forecast based on your business type, location, and customer base.</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <i class="fas fa-mobile-alt text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white mb-2">Live Platform Walkthrough</h3>
                            <p class="text-pink-100">Experience our member-facing app and business dashboard to see exactly how partnerships work.</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <i class="fas fa-users text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white mb-2">Meet Your Success Team</h3>
                            <p class="text-pink-100">Connect with our partnership specialists who will manage your account and drive your growth.</p>
                        </div>
                    </div>

                    <div class="flex items-start space-x-4">
                        <div class="flex-shrink-0 w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                            <i class="fas fa-rocket text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold text-white mb-2">Fast-Track Your Launch</h3>
                            <p class="text-pink-100">Learn how to go live in 48 hours and start seeing results within your first week.</p>
                        </div>
                    </div>

                    <!-- Social Proof -->
                    <div class="bg-white bg-opacity-20 rounded-xl p-6 mt-8">
                        <div class="flex items-center mb-4">
                            <div class="flex -space-x-2 mr-4">
                                <div class="w-8 h-8 bg-pink-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-pink-800">MB</div>
                                <div class="w-8 h-8 bg-purple-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-purple-800">DC</div>
                                <div class="w-8 h-8 bg-blue-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-blue-800">SW</div>
                                <div class="w-8 h-8 bg-green-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-green-800">+47</div>
                            </div>
                            <span class="text-white font-semibold">50+ demos this week</span>
                        </div>
                        <p class="text-pink-100 text-sm italic">"The demo convinced us immediately. We saw exactly how Better Together would impact our bottom line." - Maria R., Bella Vista Restaurant</p>
                    </div>
                </div>

                <!-- Demo Booking Form -->
                <div class="bg-white rounded-2xl p-8 shadow-2xl">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Book Your Success Demo</h3>
                    
                    <form id="demoBookingForm" class="space-y-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                                <input type="text" name="first_name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                                <input type="text" name="last_name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Business Email *</label>
                            <input type="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                            <input type="tel" name="phone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Business Name *</label>
                                <input type="text" name="business_name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Industry *</label>
                                <select name="industry" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                                    <option value="">Select Industry</option>
                                    <option value="restaurant">Restaurant / Dining</option>
                                    <option value="hotel">Hotel / Accommodation</option>
                                    <option value="experience">Activities / Experiences</option>
                                    <option value="retail">Retail / Gifts</option>
                                    <option value="spa">Spa / Wellness</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Preferred Demo Time</label>
                            <select name="demo_time" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500">
                                <option value="">Select Time Preference</option>
                                <option value="morning">Morning (9 AM - 12 PM)</option>
                                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                                <option value="evening">Evening (5 PM - 8 PM)</option>
                                <option value="flexible">I'm flexible</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">What's your main goal?</label>
                            <div class="space-y-2">
                                <label class="flex items-center">
                                    <input type="radio" name="main_goal" value="increase_revenue" class="text-pink-600 focus:ring-pink-500 mr-2">
                                    <span class="text-sm">Increase revenue and customer base</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="main_goal" value="attract_couples" class="text-pink-600 focus:ring-pink-500 mr-2">
                                    <span class="text-sm">Attract more couples to our business</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="main_goal" value="marketing_support" class="text-pink-600 focus:ring-pink-500 mr-2">
                                    <span class="text-sm">Get marketing support and exposure</span>
                                </label>
                                <label class="flex items-center">
                                    <input type="radio" name="main_goal" value="learn_more" class="text-pink-600 focus:ring-pink-500 mr-2">
                                    <span class="text-sm">Learn more about the platform</span>
                                </label>
                            </div>
                        </div>

                        <button type="submit" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                            <i class="fas fa-calendar-check mr-2"></i>
                            Book My Success Demo Now
                        </button>

                        <p class="text-xs text-gray-500 text-center">
                            We'll contact you within 2 hours to schedule your personalized demo
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Enhanced Application Form -->
    <section class="py-20 bg-white" id="apply-now">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Fast-Track Your Partnership Application
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Complete this intelligent application and get approved in 24-48 hours. Our system pre-qualifies your business for the best partnership tier.
                </p>
                
                <!-- Application Progress -->
                <div class="mt-8 max-w-2xl mx-auto">
                    <div class="flex items-center justify-center space-x-4 text-sm">
                        <div class="flex items-center text-green-600">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span>5-Minute Application</span>
                        </div>
                        <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div class="flex items-center text-blue-600">
                            <i class="fas fa-clock mr-2"></i>
                            <span>24-48h Review</span>
                        </div>
                        <div class="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div class="flex items-center text-purple-600">
                            <i class="fas fa-rocket mr-2"></i>
                            <span>48h Launch</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Smart Application Form -->
            <div class="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-2xl border border-pink-200 p-8 lg:p-12">
                <form id="smartApplicationForm" class="space-y-8">
                    <!-- Progress Indicator -->
                    <div class="mb-8">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-sm font-medium text-gray-700">Application Progress</span>
                            <span class="text-sm font-medium text-pink-600" id="progressPercentage">0%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-gradient-to-r from-pink-600 to-purple-600 h-2 rounded-full transition-all duration-300" id="progressBar" style="width: 0%"></div>
                        </div>
                    </div>

                    <!-- Section 1: Business Basics -->
                    <div class="application-section" data-section="1">
                        <div class="flex items-center mb-6">
                            <div class="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold mr-3">1</div>
                            <h3 class="text-2xl font-bold text-gray-900">Business Information</h3>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Business Name *</label>
                                <input type="text" name="business_name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all" onkeyup="updateProgress()">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Industry Category *</label>
                                <select name="industry" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" onchange="updateProgress(); showIndustrySpecific(this.value)">
                                    <option value="">Select Your Industry</option>
                                    <option value="restaurant">🍽️ Restaurant / Dining</option>
                                    <option value="hotel">🏨 Hotel / Accommodation</option>
                                    <option value="experience">🎯 Activities / Experiences</option>
                                    <option value="retail">🛍️ Retail / Gifts</option>
                                    <option value="spa">🧘 Spa / Wellness</option>
                                    <option value="entertainment">🎪 Entertainment</option>
                                    <option value="travel">✈️ Travel / Tourism</option>
                                    <option value="other">🔧 Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Website URL *</label>
                                <input type="url" name="website" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="https://www.yourbusiness.com" onkeyup="updateProgress()">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Business Size</label>
                                <select name="business_size" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" onchange="updateProgress(); suggestTier(this.value)">
                                    <option value="">Select Business Size</option>
                                    <option value="single">Single Location</option>
                                    <option value="multi-local">2-5 Locations</option>
                                    <option value="regional">6-25 Locations</option>
                                    <option value="national">25+ Locations</option>
                                    <option value="enterprise">Enterprise/Franchise</option>
                                </select>
                            </div>
                        </div>

                        <!-- Smart Tier Suggestion -->
                        <div id="tierSuggestion" class="hidden mt-6 p-4 bg-white rounded-lg border-2 border-purple-200">
                            <div class="flex items-center text-purple-600 mb-2">
                                <i class="fas fa-lightbulb mr-2"></i>
                                <span class="font-bold">Recommended Partnership Tier</span>
                            </div>
                            <p id="tierSuggestionText" class="text-gray-700"></p>
                        </div>

                        <div class="mt-6">
                            <label class="block text-sm font-bold text-gray-700 mb-2">Why are couples drawn to your business?</label>
                            <textarea name="couple_appeal" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Describe what makes your business special for couples - romantic atmosphere, couples packages, etc." onkeyup="updateProgress()"></textarea>
                        </div>
                    </div>

                    <!-- Section 2: Contact Information -->
                    <div class="application-section border-t border-gray-200 pt-8" data-section="2">
                        <div class="flex items-center mb-6">
                            <div class="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold mr-3">2</div>
                            <h3 class="text-2xl font-bold text-gray-900">Contact Details</h3>
                        </div>
                        
                        <div class="grid md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Primary Contact Name *</label>
                                <input type="text" name="contact_name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" onkeyup="updateProgress()">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Job Title / Role</label>
                                <input type="text" name="job_title" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Owner, Manager, Marketing Director, etc." onkeyup="updateProgress()">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Business Email *</label>
                                <input type="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" onkeyup="updateProgress()">
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                                <input type="tel" name="phone" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" onkeyup="updateProgress()">
                            </div>
                        </div>

                        <!-- Business Address -->
                        <div class="mt-6">
                            <label class="block text-sm font-bold text-gray-700 mb-2">Business Address</label>
                            <input type="text" name="business_address" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Street address, City, State, ZIP" onkeyup="updateProgress()">
                        </div>
                    </div>

                    <!-- Section 3: Partnership Details -->
                    <div class="application-section border-t border-gray-200 pt-8" data-section="3">
                        <div class="flex items-center mb-6">
                            <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">3</div>
                            <h3 class="text-2xl font-bold text-gray-900">Partnership Preferences</h3>
                        </div>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-3">Preferred Partnership Tier</label>
                                <div class="grid md:grid-cols-3 gap-4">
                                    <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-pink-300 transition-all">
                                        <input type="radio" name="partnership_tier" value="featured" class="text-pink-600 focus:ring-pink-500 mr-3" onchange="updateProgress()">
                                        <div>
                                            <div class="font-bold text-gray-900">Featured Partner</div>
                                            <div class="text-sm text-gray-600">Local/emerging businesses</div>
                                            <div class="text-sm text-pink-600 font-semibold">8-12% commission</div>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-4 border-2 border-purple-300 rounded-lg cursor-pointer hover:border-purple-500 transition-all bg-purple-50">
                                        <input type="radio" name="partnership_tier" value="premium" class="text-purple-600 focus:ring-purple-500 mr-3" onchange="updateProgress()">
                                        <div>
                                            <div class="font-bold text-gray-900">Premium Partner</div>
                                            <div class="text-sm text-gray-600">Established brands</div>
                                            <div class="text-sm text-purple-600 font-semibold">12-18% commission</div>
                                            <div class="text-xs bg-yellow-400 text-gray-900 px-2 py-1 rounded-full font-bold mt-1">POPULAR</div>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-all">
                                        <input type="radio" name="partnership_tier" value="elite" class="text-indigo-600 focus:ring-indigo-500 mr-3" onchange="updateProgress()">
                                        <div>
                                            <div class="font-bold text-gray-900">Elite Partner</div>
                                            <div class="text-sm text-gray-600">Enterprise/national</div>
                                            <div class="text-sm text-indigo-600 font-semibold">Custom pricing</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div class="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">Maximum discount you can offer</label>
                                    <select name="discount_percentage" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" onchange="updateProgress()">
                                        <option value="">Select discount range</option>
                                        <option value="10-15">Up to 15% off</option>
                                        <option value="15-20">Up to 20% off</option>
                                        <option value="20-25">Up to 25% off</option>
                                        <option value="25-30">Up to 30% off</option>
                                        <option value="30+">30%+ off (Premium/Elite only)</option>
                                        <option value="custom">Custom packages</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-bold text-gray-700 mb-2">Expected monthly revenue via Better Together</label>
                                    <select name="monthly_volume" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" onchange="updateProgress()">
                                        <option value="">Select expected range</option>
                                        <option value="under-1k">Under $1,000</option>
                                        <option value="1k-5k">$1,000 - $5,000</option>
                                        <option value="5k-10k">$5,000 - $10,000</option>
                                        <option value="10k-25k">$10,000 - $25,000</option>
                                        <option value="25k-50k">$25,000 - $50,000</option>
                                        <option value="50k+">$50,000+ (Elite tier)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Section 4: Final Details -->
                    <div class="application-section border-t border-gray-200 pt-8" data-section="4">
                        <div class="flex items-center mb-6">
                            <div class="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-3">4</div>
                            <h3 class="text-2xl font-bold text-gray-900">Partnership Goals</h3>
                        </div>
                        
                        <div class="space-y-6">
                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">What's your primary goal with this partnership?</label>
                                <div class="space-y-3">
                                    <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition-all">
                                        <input type="radio" name="primary_goal" value="increase_revenue" class="text-pink-600 focus:ring-pink-500 mr-3" onchange="updateProgress()">
                                        <div>
                                            <span class="font-semibold text-gray-900">💰 Increase revenue and customer base</span>
                                            <p class="text-sm text-gray-600">Drive more bookings and higher-value customers</p>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition-all">
                                        <input type="radio" name="primary_goal" value="attract_couples" class="text-pink-600 focus:ring-pink-500 mr-3" onchange="updateProgress()">
                                        <div>
                                            <span class="font-semibold text-gray-900">💕 Attract more couples to our business</span>
                                            <p class="text-sm text-gray-600">Focus specifically on the couples market</p>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition-all">
                                        <input type="radio" name="primary_goal" value="marketing_support" class="text-pink-600 focus:ring-pink-500 mr-3" onchange="updateProgress()">
                                        <div>
                                            <span class="font-semibold text-gray-900">📢 Get marketing support and exposure</span>
                                            <p class="text-sm text-gray-600">Leverage Better Together's marketing reach</p>
                                        </div>
                                    </label>
                                    <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition-all">
                                        <input type="radio" name="primary_goal" value="competitive_advantage" class="text-pink-600 focus:ring-pink-500 mr-3" onchange="updateProgress()">
                                        <div>
                                            <span class="font-semibold text-gray-900">🏆 Gain competitive advantage in my market</span>
                                            <p class="text-sm text-gray-600">Be the exclusive Better Together partner in my area</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">How did you hear about Better Together's partnership program?</label>
                                <select name="referral_source" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" onchange="updateProgress()">
                                    <option value="">Please select</option>
                                    <option value="google_search">Google search</option>
                                    <option value="social_media">Social media</option>
                                    <option value="existing_partner">Referred by existing partner</option>
                                    <option value="industry_event">Industry event/conference</option>
                                    <option value="word_of_mouth">Word of mouth</option>
                                    <option value="better_together_outreach">Better Together reached out to me</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-bold text-gray-700 mb-2">Additional information or questions</label>
                                <textarea name="additional_info" rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Tell us anything else about your business, special requests, or questions about the partnership..." onkeyup="updateProgress()"></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Terms and Submit -->
                    <div class="border-t border-gray-200 pt-8">
                        <div class="space-y-4">
                            <div class="flex items-start space-x-3">
                                <input type="checkbox" name="terms_agreement" required class="mt-1 text-pink-600 focus:ring-pink-500" onchange="updateProgress()">
                                <label class="text-sm text-gray-700">
                                    I agree to the <a href="#" class="text-pink-600 hover:underline font-semibold">Better Together Partner Terms & Conditions</a> and understand that this application will be reviewed within 24-48 hours. I authorize Better Together to contact me regarding this partnership opportunity. *
                                </label>
                            </div>
                            
                            <div class="flex items-start space-x-3">
                                <input type="checkbox" name="marketing_consent" class="mt-1 text-pink-600 focus:ring-pink-500" onchange="updateProgress()">
                                <label class="text-sm text-gray-700">
                                    I consent to receive marketing communications, partnership updates, and business growth tips from Better Together. I can unsubscribe at any time.
                                </label>
                            </div>

                            <div class="flex items-start space-x-3">
                                <input type="checkbox" name="data_accuracy" required class="mt-1 text-pink-600 focus:ring-pink-500" onchange="updateProgress()">
                                <label class="text-sm text-gray-700">
                                    I confirm that all information provided is accurate and up-to-date. I understand that false information may result in application rejection. *
                                </label>
                            </div>
                        </div>

                        <!-- Smart Submit Button -->
                        <div class="mt-8 text-center">
                            <button type="submit" id="submitButton" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold text-xl hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                <i class="fas fa-paper-plane mr-3"></i>
                                <span id="submitButtonText">Complete Application (0% complete)</span>
                            </button>

                            <div class="mt-4 grid md:grid-cols-3 gap-4 text-center text-sm text-gray-600">
                                <div class="flex items-center justify-center">
                                    <i class="fas fa-clock text-green-500 mr-2"></i>
                                    <span>24-48 hour review</span>
                                </div>
                                <div class="flex items-center justify-center">
                                    <i class="fas fa-phone text-blue-500 mr-2"></i>
                                    <span>Personal follow-up call</span>
                                </div>
                                <div class="flex items-center justify-center">
                                    <i class="fas fa-rocket text-purple-500 mr-2"></i>
                                    <span>48 hour launch</span>
                                </div>
                            </div>

                            <p class="text-sm text-gray-500 mt-4">
                                🔒 Your information is secure and will only be used for partnership evaluation. We never share your data with third parties.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
                <div class="space-y-4">
                    <div class="flex items-center">
                        <span class="text-2xl">💕</span>
                        <span class="ml-2 text-xl font-bold text-white">Better Together</span>
                        <span class="ml-3 text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full font-semibold">Business</span>
                    </div>
                    <p class="text-gray-400 leading-relaxed">
                        The #1 platform connecting businesses with engaged couples actively investing in their relationships.
                    </p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-linkedin text-xl"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">
                            <i class="fab fa-facebook text-xl"></i>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h5 class="font-semibold text-white mb-4">For Partners</h5>
                    <ul class="space-y-2">
                        <li><a href="#partnership-tiers" class="text-gray-400 hover:text-white transition-colors">Partnership Tiers</a></li>
                        <li><a href="#roi-calculator" class="text-gray-400 hover:text-white transition-colors">ROI Calculator</a></li>
                        <li><a href="#book-demo" class="text-gray-400 hover:text-white transition-colors">Book Demo</a></li>
                        <li><a href="#apply-now" class="text-gray-400 hover:text-white transition-colors">Apply Now</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Partner Portal</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Success Stories</a></li>
                    </ul>
                </div>
                
                <div>
                    <h5 class="font-semibold text-white mb-4">For Members</h5>
                    <ul class="space-y-2">
                        <li><a href="/" class="text-gray-400 hover:text-white transition-colors">Better Together App</a></li>
                        <li><a href="/member-rewards.html" class="text-gray-400 hover:text-white transition-colors">Member Rewards</a></li>
                        <li><a href="/iphone-examples.html" class="text-gray-400 hover:text-white transition-colors">iPhone Examples</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                    </ul>
                </div>
                
                <div>
                    <h5 class="font-semibold text-white mb-4">Contact</h5>
                    <ul class="space-y-2">
                        <li class="text-gray-400">
                            <i class="fas fa-envelope mr-2"></i>
                            partnerships@bettertogether.com
                        </li>
                        <li class="text-gray-400">
                            <i class="fas fa-phone mr-2"></i>
                            1-800-COUPLES (268-7537)
                        </li>
                        <li>
                            <a href="#book-demo" class="text-pink-400 hover:text-pink-300 transition-colors">
                                <i class="fas fa-calendar mr-2"></i>
                                Schedule a Partnership Call
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-gray-800 mt-12 pt-8 text-center">
                <p class="text-gray-400">
                    &copy; 2025 Better Together. Building stronger relationships, growing better businesses.
                </p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script>
        // Dynamic counters
        let partnerCount = 497;
        let spotsRemaining = 23;

        function updateCounters() {
            document.getElementById('partnerCount').textContent = partnerCount + '+';
            document.getElementById('spotsRemaining').textContent = spotsRemaining;
            
            // Simulate real-time updates
            if (Math.random() > 0.95) {
                partnerCount++;
                spotsRemaining--;
                if (spotsRemaining < 10) spotsRemaining = 25; // Reset periodically
            }
        }

        // ROI Calculator Functions
        function calculateROI() {
            const businessType = document.getElementById('businessType').value;
            const avgOrderValue = parseFloat(document.getElementById('avgOrderValue').value) || 150;
            const monthlyCustomers = parseInt(document.getElementById('monthlyCustomers').value) || 100;
            const commissionRate = parseFloat(document.getElementById('commissionRate').value) || 15;
            const repeatRate = parseFloat(document.getElementById('repeatRate').value) || 1.2;

            // Calculate results
            const monthlyRevenue = avgOrderValue * monthlyCustomers;
            const annualRevenue = monthlyRevenue * 12 * repeatRate;
            const commissionCost = annualRevenue * (commissionRate / 100);
            const netProfit = annualRevenue - commissionCost;
            const roiMultiple = netProfit / commissionCost;

            // Update display
            document.getElementById('monthlyRevenue').textContent = '$' + monthlyRevenue.toLocaleString();
            document.getElementById('monthlyDetails').textContent = monthlyCustomers + ' customers × $' + avgOrderValue + ' avg order';
            document.getElementById('annualRevenue').textContent = '$' + Math.round(annualRevenue).toLocaleString();
            document.getElementById('annualDetails').textContent = 'Including ' + Math.round((repeatRate - 1) * 100) + '% repeat customers';
            document.getElementById('commissionCost').textContent = '$' + Math.round(commissionCost).toLocaleString();
            document.getElementById('netProfit').textContent = '$' + Math.round(netProfit).toLocaleString();
            document.getElementById('roiMultiple').textContent = roiMultiple.toFixed(1) + 'x return on investment';
        }

        // Update slider displays
        document.getElementById('monthlyCustomers').addEventListener('input', function() {
            document.getElementById('customerCount').textContent = this.value;
            calculateROI();
        });

        document.getElementById('commissionRate').addEventListener('input', function() {
            document.getElementById('commissionDisplay').textContent = this.value + '%';
            calculateROI();
        });

        // Application Progress Tracking
        function updateProgress() {
            const form = document.getElementById('smartApplicationForm');
            const requiredFields = form.querySelectorAll('[required]');
            const allFields = form.querySelectorAll('input, select, textarea');
            
            let filledRequired = 0;
            let totalFilled = 0;

            requiredFields.forEach(field => {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    if (field.checked) filledRequired++;
                } else if (field.value.trim() !== '') {
                    filledRequired++;
                }
            });

            allFields.forEach(field => {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    if (field.checked) totalFilled++;
                } else if (field.value.trim() !== '') {
                    totalFilled++;
                }
            });

            const progress = Math.round((totalFilled / allFields.length) * 100);
            const requiredProgress = Math.round((filledRequired / requiredFields.length) * 100);
            
            document.getElementById('progressBar').style.width = progress + '%';
            document.getElementById('progressPercentage').textContent = progress + '%';
            
            const submitButton = document.getElementById('submitButton');
            const submitButtonText = document.getElementById('submitButtonText');
            
            if (requiredProgress === 100) {
                submitButton.disabled = false;
                submitButtonText.textContent = 'Submit Partnership Application';
                submitButton.classList.add('animate-pulse-glow');
            } else {
                submitButton.disabled = true;
                submitButtonText.textContent = \`Complete Application (\${progress}% complete)\`;
                submitButton.classList.remove('animate-pulse-glow');
            }
        }

        // Smart tier suggestions
        function suggestTier(businessSize) {
            const suggestion = document.getElementById('tierSuggestion');
            const text = document.getElementById('tierSuggestionText');
            
            let recommendedTier = '';
            switch(businessSize) {
                case 'single':
                    recommendedTier = 'Featured Partner - Perfect for single location businesses looking to grow their couples customer base.';
                    break;
                case 'multi-local':
                    recommendedTier = 'Premium Partner - Ideal for multi-location businesses ready to scale with dedicated support.';
                    break;
                case 'regional':
                case 'national':
                case 'enterprise':
                    recommendedTier = 'Elite Partner - Enterprise solution with custom pricing and dedicated strategic support.';
                    break;
            }
            
            if (recommendedTier) {
                text.textContent = recommendedTier;
                suggestion.classList.remove('hidden');
            }
        }

        // Industry-specific suggestions
        function showIndustrySpecific(industry) {
            // Could add industry-specific fields or suggestions here
            console.log('Industry selected:', industry);
        }

        // Tier selection
        function selectTier(tier) {
            document.querySelector(\`input[name="partnership_tier"][value="\${tier}"]\`).checked = true;
            scrollToSection('apply-now');
            updateProgress();
        }

        // Smooth scrolling
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Form submissions
        document.getElementById('demoBookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for booking a demo! Our partnership team will contact you within 2 hours to schedule your personalized success demo.');
            this.reset();
        });

        document.getElementById('smartApplicationForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = document.getElementById('submitButton');
            const submitButtonText = document.getElementById('submitButtonText');
            const originalButtonText = submitButtonText.textContent;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButtonText.innerHTML = '<i class="fas fa-spinner fa-spin mr-3"></i>Submitting Application...';
            submitButton.classList.remove('animate-pulse-glow');

            try {
                // Gather all form field values
                const formData = new FormData(this);

                // Map form fields to API schema
                const applicationData = {
                    businessName: formData.get('business_name') || '',
                    businessType: formData.get('industry') || '',
                    website: formData.get('website') || '',
                    address: formData.get('business_address') || '',
                    city: '', // Not in current form, using empty string
                    state: '', // Not in current form, using empty string
                    zipCode: '', // Not in current form, using empty string
                    contactName: formData.get('contact_name') || '',
                    contactEmail: formData.get('email') || '',
                    contactPhone: formData.get('phone') || '',
                    contactRole: formData.get('job_title') || '',
                    partnershipType: formData.get('partnership_tier') || '',
                    offerDescription: formData.get('couple_appeal') || '',
                    targetAudience: \`Business Size: \${formData.get('business_size') || 'N/A'}, Discount: \${formData.get('discount_percentage') || 'N/A'}\`,
                    expectedReach: formData.get('monthly_volume') || '',
                    howDidYouHear: formData.get('referral_source') || '',
                    additionalNotes: \`Primary Goal: \${formData.get('primary_goal') || 'N/A'}. \${formData.get('additional_info') || ''}\`
                };

                // Client-side validation
                const requiredFields = ['businessName', 'businessType', 'website', 'contactName', 'contactEmail', 'contactPhone'];
                const missingFields = requiredFields.filter(field => !applicationData[field] || applicationData[field].trim() === '');

                if (missingFields.length > 0) {
                    throw new Error(\`Please fill in all required fields: \${missingFields.join(', ')}\`);
                }

                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(applicationData.contactEmail)) {
                    throw new Error('Please enter a valid email address');
                }

                // URL validation
                try {
                    new URL(applicationData.website);
                } catch {
                    throw new Error('Please enter a valid website URL');
                }

                // Submit to API
                const response = await fetch('/api/sponsors/apply', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(applicationData)
                });

                const data = await response.json();

                if (!response.ok) {
                    // Handle 409 conflict (already submitted)
                    if (response.status === 409) {
                        const confirmResubmit = confirm(
                            \`It looks like you've already submitted an application with this email address.\n\n\` +
                            \`Application ID: \${data.existingApplicationId || 'N/A'}\n\n\` +
                            \`Would you like to submit a new application anyway? This will create a duplicate entry.\`
                        );

                        if (!confirmResubmit) {
                            throw new Error('Application submission cancelled');
                        }

                        // User confirmed, retry without conflict check
                        const retryResponse = await fetch('/api/sponsors/apply?force=true', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(applicationData)
                        });

                        if (!retryResponse.ok) {
                            const retryData = await retryResponse.json();
                            throw new Error(retryData.error || 'Failed to submit application');
                        }

                        const retryData = await retryResponse.json();
                        showSuccessMessage(retryData.applicationId);
                        this.reset();
                        updateProgress();
                        return;
                    }

                    throw new Error(data.error || \`Server error: \${response.status}\`);
                }

                // Show success message with application ID
                showSuccessMessage(data.applicationId);

                // Reset form
                this.reset();
                updateProgress();

            } catch (error) {
                console.error('Application submission error:', error);
                alert(\`❌ Application Submission Failed\n\n\${error.message}\n\nPlease try again or contact support if the problem persists.\`);

                // Re-enable button
                submitButton.disabled = false;
                submitButtonText.textContent = originalButtonText;

                // Re-check if form is complete to re-enable glow
                const form = document.getElementById('smartApplicationForm');
                const requiredFields = form.querySelectorAll('[required]');
                let allFilled = true;

                requiredFields.forEach(field => {
                    if (field.type === 'checkbox' || field.type === 'radio') {
                        if (!field.checked) allFilled = false;
                    } else if (field.value.trim() === '') {
                        allFilled = false;
                    }
                });

                if (allFilled) {
                    submitButton.classList.add('animate-pulse-glow');
                }
            }
        });

        // Success message helper function
        function showSuccessMessage(applicationId) {
            const successMessage = \`
                🎉 Application Submitted Successfully!

                Application ID: \${applicationId}

                What happens next:
                ✅ Review within 24-48 hours
                📞 Personal follow-up call from our team
                🚀 If approved, live within 48 hours
                💰 Start seeing revenue within your first week

                We've sent a confirmation email with your application reference number.
                Please save your Application ID for future reference.
            \`;

            alert(successMessage);
        }

        // Chart initialization
        function initializeChart() {
            const ctx = document.getElementById('jewelryChart');
            if (ctx) {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Custom Orders',
                            data: [12, 15, 18, 25, 35, 42],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    display: false
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            }
        }

        // Initialize everything
        document.addEventListener('DOMContentLoaded', function() {
            calculateROI();
            updateProgress();
            initializeChart();
            
            // Update counters every 30 seconds
            setInterval(updateCounters, 30000);
            
            // Mobile menu toggle
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            if (mobileMenuButton) {
                mobileMenuButton.addEventListener('click', function() {
                    console.log('Mobile menu clicked');
                });
            }

            // Animate elements on scroll
            const observerOptions = {
                threshold: 0.1,
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

            // Observe all sections for animation
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                section.style.opacity = '0.95';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'all 0.8s ease-out';
                observer.observe(section);
            });
        });
    </script>
</body>
</html>
`