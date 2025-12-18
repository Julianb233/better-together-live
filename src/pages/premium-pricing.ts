// Premium Pricing - Annual-First Strategy with Per-User Scaling
import { navigationHtml } from '../components/navigation.js';

export const premiumPricingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Better Together Premium - Transform Your Relationship | Better Together</title>
    <meta name="description" content="Join thousands of couples building deeper connections. Premium relationship coaching, smart planning, and exclusive experiences. Gift to your partner or grow together.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        pink: { 50: '#fdf2f8', 100: '#fce7f3', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d' },
                        purple: { 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6' },
                        emerald: { 500: '#10b981', 600: '#059669', 700: '#047857' }
                    },
                    fontFamily: { 'inter': ['Inter', 'sans-serif'] },
                    animation: {
                        'pulse-glow': 'pulseGlow 3s ease-in-out infinite alternate',
                        'savings-flash': 'savingsFlash 2s ease-in-out infinite'
                    },
                    keyframes: {
                        pulseGlow: {
                            '0%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
                            '100%': { boxShadow: '0 0 40px rgba(16, 185, 129, 0.6)' }
                        },
                        savingsFlash: {
                            '0%, 100%': { backgroundColor: '#fef3c7' },
                            '50%': { backgroundColor: '#fde68a' }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .gradient-bg { background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fce7f3 100%); }
        .annual-badge { 
            background: linear-gradient(45deg, #10b981, #059669); 
            color: white; 
            padding: 8px 20px; 
            border-radius: 9999px; 
            font-size: 0.875rem; 
            font-weight: 700;
            position: absolute;
            top: -15px;
            right: 30px;
            animation: pulse-glow 3s ease-in-out infinite alternate;
        }
        .savings-highlight {
            animation: savings-flash 2s ease-in-out infinite;
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 700;
        }
        .pricing-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(16, 185, 129, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pricing-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 25px 50px rgba(16, 185, 129, 0.25);
            border-color: rgba(16, 185, 129, 0.4);
        }
        .partner-selector {
            background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
            border: 2px solid #e879f9;
            border-radius: 16px;
            padding: 24px;
        }
        .feature-locked {
            opacity: 0.6;
            position: relative;
        }
        .feature-locked::after {
            content: '🔒';
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
        }
    </style>
</head>
<body class="bg-gray-50 font-inter">
    ${navigationHtml}

    <!-- Hero Section -->
    <section class="gradient-bg py-16 sm:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <div class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
                    <i class="fas fa-heart mr-2"></i>
                    Join 50,000+ Couples Building Stronger Bonds
                </div>
                
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Unlock Your Relationship's
                    <span class="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        Full Potential
                    </span>
                </h1>
                
                <p class="text-xl sm:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                    Transform how you connect, communicate, and create memories together. Get personalized AI coaching, smart date planning, intimate challenges, and tools that help you thrive as a couple.
                </p>
                
                <!-- Relationship Value Showcase -->
                <div class="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto mb-10">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">What Matters Most to Your Relationship</h3>
                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="text-center">
                            <div class="text-pink-600 mb-2 font-semibold">Quality Time Together</div>
                            <div class="text-3xl font-bold text-pink-600 mb-2">3.2x<span class="text-lg"> More</span></div>
                            <div class="text-sm text-gray-500">From 2.3 to 7.4 hours per week</div>
                        </div>
                        <div class="text-center">
                            <div class="text-purple-600 mb-2 font-semibold">Relationship Satisfaction</div>
                            <div class="text-3xl font-bold text-purple-600 mb-2">94%<span class="text-lg"> Better</span></div>
                            <div class="text-sm text-gray-500">Couples report stronger bond</div>
                        </div>
                    </div>
                    <div class="savings-highlight text-center mt-6">
                        <span class="text-2xl font-bold text-pink-800">Your relationship deserves this investment</span>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button class="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 shadow-lg transition-all duration-300">
                        <i class="fas fa-heart mr-2"></i>
                        Start Your Journey Together
                    </button>
                    <button class="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors shadow-lg">
                        <i class="fas fa-gift mr-2"></i>
                        Gift to Your Partner
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Premium Pricing Plans -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose How You Want to Grow</h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">Every couple is unique. Pick the plan that fits your relationship journey and commitment level.</p>
            </div>

            <div class="grid lg:grid-cols-2 gap-12 mb-16">
                <!-- Better Together Plan (Most Popular) -->
                <div class="pricing-card rounded-2xl p-8 relative">
                    <div class="annual-badge">MOST POPULAR</div>
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-heart text-white text-2xl"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-gray-900 mb-2">Better Together Plan</h3>
                        <div class="text-5xl font-bold text-pink-600 mb-2">
                            $240<span class="text-2xl font-normal text-gray-600">/year</span>
                        </div>
                        <div class="text-lg text-gray-600 mb-4">
                            Just $20/month per person
                        </div>
                        <div class="savings-highlight text-center">
                            <span class="text-pink-800">Complete relationship transformation</span>
                        </div>
                    </div>

                    <div class="mb-8">
                        <h4 class="font-bold text-gray-900 mb-4 text-center">💕 EVERYTHING YOU NEED TO THRIVE 💕</h4>
                        <ul class="space-y-3">
                            <li class="flex items-center"><i class="fas fa-robot text-blue-500 mr-3"></i><span class="font-semibold">Personal AI Relationship Coach</span> - Your 24/7 relationship guide</li>
                            <li class="flex items-center"><i class="fas fa-heart text-rose-500 mr-3"></i><span class="font-semibold">Intimacy & Connection Challenges</span> - Deepen your bond safely</li>
                            <li class="flex items-center"><i class="fas fa-calendar-heart text-purple-500 mr-3"></i><span class="font-semibold">Smart Date Planning</span> - Never run out of romantic ideas</li>
                            <li class="flex items-center"><i class="fas fa-gamepad text-indigo-500 mr-3"></i><span class="font-semibold">Relationship Games & Activities</span> - Fun ways to connect</li>
                            <li class="flex items-center"><i class="fas fa-headset text-emerald-500 mr-3"></i><span class="font-semibold">Priority Expert Support</span> - Real relationship counselors</li>
                            <li class="flex items-center"><i class="fas fa-gift text-pink-500 mr-3"></i><span class="font-semibold">Surprise Your Partner Credits</span> - $50 for special moments</li>
                            <li class="flex items-center"><i class="fas fa-users text-amber-500 mr-3"></i><span class="font-semibold">Private Couples Community</span> - Connect with thriving couples</li>
                            <li class="flex items-center"><i class="fas fa-star text-purple-500 mr-3"></i><span class="font-semibold">First Access to New Features</span> - Always stay ahead</li>
                        </ul>
                    </div>

                    <button class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg text-lg">
                        <i class="fas fa-heart mr-2"></i>
                        Transform Our Relationship
                    </button>
                    
                    <div class="text-center mt-4">
                        <span class="text-sm text-gray-600">30-day money back guarantee</span>
                    </div>
                </div>

                <!-- Try It Out Plan -->
                <div class="pricing-card rounded-2xl p-8 relative border-gray-200">
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-clock text-white text-2xl"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-gray-900 mb-2">Try It Out Plan</h3>
                        <div class="text-5xl font-bold text-gray-900 mb-2">
                            $30<span class="text-2xl font-normal text-gray-600">/month</span>
                        </div>
                        <div class="text-lg text-gray-600 mb-4">
                            Per person • No commitment
                        </div>
                        <div class="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
                            Perfect for exploring our platform
                        </div>
                    </div>

                    <div class="mb-8">
                        <h4 class="font-bold text-gray-900 mb-4 text-center">CORE RELATIONSHIP TOOLS</h4>
                        <ul class="space-y-3">
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Essential AI Coach Access</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Basic Connection Challenges</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Simple Date Planning Tools</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Starter Relationship Games</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Email Support</span></li>
                            <li class="flex items-center text-gray-400"><i class="fas fa-minus text-gray-400 mr-3"></i><span>Limited to basic features</span></li>
                            <li class="flex items-center text-gray-400"><i class="fas fa-minus text-gray-400 mr-3"></i><span>No priority support</span></li>
                            <li class="flex items-center text-gray-400"><i class="fas fa-minus text-gray-400 mr-3"></i><span>No community access</span></li>
                        </ul>
                    </div>

                    <button class="w-full bg-gray-600 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-lg text-lg">
                        <i class="fas fa-clock mr-2"></i>
                        Try It Out First
                    </button>
                    
                    <div class="text-center mt-4">
                        <span class="text-sm text-gray-600">No commitment required</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Premium Add-Ons -->
    <section class="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Make Your Experience Even More Special</h2>
                <p class="text-xl text-gray-600">Optional add-ons to enhance your relationship journey</p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                <!-- Monthly Surprise Box -->
                <div class="bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-200">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-box-heart text-white text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Monthly Surprise Box</h3>
                        <p class="text-gray-600 mb-4">Curated relationship items, games, and treats delivered to your door</p>
                        <div class="text-4xl font-bold text-emerald-600 mb-2">$49<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-sm text-gray-500">Includes shipping • Skip or cancel anytime</div>
                    </div>
                    
                    <ul class="space-y-3 mb-6">
                        <li class="flex items-center"><i class="fas fa-heart text-pink-500 mr-3"></i><span>Romantic date night supplies</span></li>
                        <li class="flex items-center"><i class="fas fa-gamepad text-purple-500 mr-3"></i><span>Fun couple games & activities</span></li>
                        <li class="flex items-center"><i class="fas fa-spa text-blue-500 mr-3"></i><span>Wellness & self-care items</span></li>
                        <li class="flex items-center"><i class="fas fa-gift text-emerald-500 mr-3"></i><span>Surprise treats & keepsakes</span></li>
                    </ul>
                    
                    <button class="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
                        Add Surprise Box
                    </button>
                </div>

                <!-- Personal Coaching -->
                <div class="bg-white rounded-2xl p-8 shadow-lg border-2 border-purple-200">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-user-tie text-white text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Personal Relationship Coach</h3>
                        <p class="text-gray-600 mb-4">One-on-one sessions with certified relationship experts</p>
                        <div class="space-y-2">
                            <div><span class="text-2xl font-bold text-purple-600">$89</span><span class="text-gray-600">/virtual session</span></div>
                            <div><span class="text-2xl font-bold text-purple-600">$149</span><span class="text-gray-600">/in-person session</span></div>
                        </div>
                    </div>
                    
                    <ul class="space-y-3 mb-6">
                        <li class="flex items-center"><i class="fas fa-video text-blue-500 mr-3"></i><span>Video or in-person sessions</span></li>
                        <li class="flex items-center"><i class="fas fa-certificate text-emerald-500 mr-3"></i><span>Licensed relationship therapists</span></li>
                        <li class="flex items-center"><i class="fas fa-calendar text-purple-500 mr-3"></i><span>Flexible scheduling</span></li>
                        <li class="flex items-center"><i class="fas fa-clipboard-list text-pink-500 mr-3"></i><span>Personalized action plans</span></li>
                    </ul>
                    
                    <button class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                        Book a Session
                    </button>
                </div>
            </div>

            <!-- Premium Plus Tier -->
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white max-w-3xl mx-auto">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold mb-2">💎 Better Together Premium Plus</h3>
                    <p class="text-purple-100 mb-4">Get everything plus monthly surprise boxes</p>
                    <div class="text-4xl font-bold mb-2">$289<span class="text-xl font-normal">/year</span></div>
                    <div class="text-purple-100">or $49/month with surprise box included</div>
                </div>
                
                <div class="flex flex-wrap justify-center gap-4 mb-6">
                    <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">All Premium Features</span>
                    <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Monthly Surprise Box</span>
                    <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Save $49/year</span>
                </div>
                
                <button class="w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                    <i class="fas fa-crown mr-2"></i>
                    Upgrade to Premium Plus
                </button>
            </div>
        </div>
    </section>

    <!-- Partner Gifting System -->
    <section class="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Surprise Your Partner with Love</h2>
                <p class="text-xl text-gray-600">Give the gift of a stronger relationship. Perfect for anniversaries, birthdays, or "just because" moments.</p>
            </div>

            <div class="partner-selector max-w-4xl mx-auto mb-12">
                <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">Ways to Show You Care</h3>
                
                <div class="grid md:grid-cols-2 gap-8">
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-center mb-6">
                            <i class="fas fa-user-heart text-4xl text-pink-600 mb-4"></i>
                            <h4 class="text-xl font-bold text-gray-900">Gift for Your Partner</h4>
                            <p class="text-gray-600">Show them how much they mean to you</p>
                        </div>
                        
                        <div class="space-y-4 mb-6">
                            <div class="flex justify-between items-center">
                                <span>Better Together Plan:</span>
                                <span class="font-bold text-pink-600">$240/year</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Try It Out Plan:</span>
                                <span class="font-bold text-gray-600">$30/month</span>
                            </div>
                            <div class="bg-pink-50 p-3 rounded-lg">
                                <span class="text-pink-800 font-semibold">💝 Includes personal gift message & surprise delivery</span>
                            </div>
                        </div>
                        
                        <button class="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                            Send This Gift
                        </button>
                    </div>

                    <div class="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-300">
                        <div class="text-center mb-6">
                            <i class="fas fa-users-heart text-4xl text-purple-600 mb-4"></i>
                            <h4 class="text-xl font-bold text-gray-900">Couples Journey</h4>
                            <p class="text-gray-600">Start your transformation together</p>
                        </div>
                        
                        <div class="space-y-4 mb-6">
                            <div class="flex justify-between items-center">
                                <span>Better Together for Two:</span>
                                <div>
                                    <span class="line-through text-gray-400">$480</span>
                                    <span class="font-bold text-purple-600 ml-2">$420/year</span>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <span>Try It Out for Two:</span>
                                <span class="font-bold text-gray-600">$55/month</span>
                            </div>
                            <div class="bg-purple-50 p-3 rounded-lg">
                                <span class="text-purple-800 font-semibold">💑 Save $60 when you grow together!</span>
                            </div>
                        </div>
                        
                        <button class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                            Start Our Journey Together
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Premium Features Behind Paywall -->
    <section class="py-16 bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">All Premium Features Included</h2>
                <p class="text-xl text-gray-300">Everything you need for relationship transformation</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Relationship Challenges -->
                <div class="bg-gray-800 rounded-xl p-6 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-fire text-white text-xl"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Intimacy Challenges</h3>
                    <p class="text-gray-300 text-sm mb-4">Progressive system to deepen physical and emotional connection safely</p>
                    <div class="text-rose-400 font-semibold">🔒 Premium Only</div>
                </div>

                <!-- Smart Scheduling -->
                <div class="bg-gray-800 rounded-xl p-6 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-calendar-check text-white text-xl"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Smart Scheduling</h3>
                    <p class="text-gray-300 text-sm mb-4">AI-powered date planning and automatic calendar coordination</p>
                    <div class="text-blue-400 font-semibold">🔒 Premium Only</div>
                </div>

                <!-- Relationship Games -->
                <div class="bg-gray-800 rounded-xl p-6 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-gamepad text-white text-xl"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Relationship Games</h3>
                    <p class="text-gray-300 text-sm mb-4">Interactive games and activities to strengthen your bond</p>
                    <div class="text-purple-400 font-semibold">🔒 Premium Only</div>
                </div>

                <!-- AI Coach Advanced -->
                <div class="bg-gray-800 rounded-xl p-6 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-robot text-white text-xl"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Advanced AI Coach</h3>
                    <p class="text-gray-300 text-sm mb-4">Unlimited conversations and personalized relationship guidance</p>
                    <div class="text-emerald-400 font-semibold">🔒 Premium Only</div>
                </div>
            </div>

            <div class="text-center mt-12">
                <div class="bg-red-900 bg-opacity-50 rounded-2xl p-8 max-w-2xl mx-auto">
                    <h3 class="text-2xl font-bold text-red-200 mb-4">⚠️ No Free Tier Available</h3>
                    <p class="text-red-100 mb-6">
                        All relationship transformation features require premium access. We believe in providing complete value rather than limited free experiences.
                    </p>
                    <button class="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all transform hover:scale-105">
                        Start Your Premium Journey
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Annual Benefits Showcase -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Makes Better Together Special</h2>
                <p class="text-xl text-gray-600">The exclusive benefits that come with your commitment to growth</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6">
                    <div class="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-robot text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Personal AI Coach</h3>
                    <p class="text-gray-600 mb-4">24/7 relationship guidance that learns your unique dynamic</p>
                    <div class="text-pink-600 font-semibold">Your relationship bestie</div>
                </div>

                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-users text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Private Community</h3>
                    <p class="text-gray-600 mb-4">Exclusive couples forum with expert moderation</p>
                    <div class="text-purple-600 font-semibold">$29/month value</div>
                </div>

                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-headset text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Priority Expert Support</h3>
                    <p class="text-gray-600 mb-4">Direct access to certified relationship counselors</p>
                    <div class="text-blue-600 font-semibold">Real human experts</div>
                </div>

                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-users text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Private Community</h3>
                    <p class="text-gray-600 mb-4">Connect with other thriving couples in our exclusive forum</p>
                    <div class="text-purple-600 font-semibold">Find your tribe</div>
                </div>

                <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6">
                    <div class="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-gift text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Surprise Credits</h3>
                    <p class="text-gray-600 mb-4">$50 annual credit for spontaneous romantic gestures</p>
                    <div class="text-yellow-600 font-semibold">Keep the spark alive</div>
                </div>

                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                    <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-star text-white"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">First Access</h3>
                    <p class="text-gray-600 mb-4">Be the first to try new features and relationship tools</p>
                    <div class="text-green-600 font-semibold">Stay ahead of the curve</div>
                </div>
            </div>

            <div class="text-center mt-12">
                <div class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 max-w-3xl mx-auto">
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">What You Get for Your Investment</h3>
                    <div class="grid md:grid-cols-2 gap-6 text-left">
                        <div>
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span>Personal AI Relationship Coach</span>
                                    <span class="font-semibold">$588/year</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Private Community Access</span>
                                    <span class="font-semibold">$348/year</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Priority Expert Support</span>
                                    <span class="font-semibold">$597/year</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <span>Smart Date Planning Tools</span>
                                    <span class="font-semibold">$396/year</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Surprise Credits</span>
                                    <span class="font-semibold">$50/year</span>
                                </div>
                                <div class="flex justify-between border-t pt-2 font-bold text-lg">
                                    <span>Total Value</span>
                                    <span class="text-pink-600">$1,979</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6 text-center">
                        <div class="text-3xl font-bold text-pink-600 mb-2">
                            You Pay: $240 • You Get: $1,979 Value
                        </div>
                        <div class="text-xl text-gray-700">
                            That's <span class="font-bold text-pink-600">724% ROI</span> on your relationship investment!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Build Something Beautiful Together?</h2>
            <p class="text-xl mb-8 opacity-90">Join thousands of couples who chose to invest in their love story</p>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button class="w-full sm:w-auto bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg">
                    <i class="fas fa-heart mr-2"></i>
                    Start Our Journey - Better Together Plan
                </button>
                <button class="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors">
                    <i class="fas fa-gift mr-2"></i>
                    Surprise My Partner
                </button>
            </div>

            <div class="text-pink-100">
                <p class="text-sm">
                    <i class="fas fa-shield-alt mr-2"></i>
                    30-day happiness guarantee • Everything included • Your relationship deserves this
                </p>
            </div>
        </div>
    </section>

    <!-- JavaScript for Interactive Pricing -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Pricing calculator interactions
            const annualButton = document.querySelector('button[class*="emerald"]');
            const monthlyButton = document.querySelector('button[class*="gray-600"]');
            
            // Savings flash animation
            const savingsElements = document.querySelectorAll('.savings-highlight');
            setInterval(() => {
                savingsElements.forEach(el => {
                    el.style.animation = 'none';
                    el.offsetHeight; // Trigger reflow
                    el.style.animation = null;
                });
            }, 3000);

            // Partner gifting system
            const giftButtons = document.querySelectorAll('button[class*="pink"], button[class*="purple"]');
            giftButtons.forEach(button => {
                button.addEventListener('click', function() {
                    console.log('Partner gift purchase initiated');
                    // Here you would integrate partner gifting flow
                });
            });

            // Premium feature lock indicators
            const lockedFeatures = document.querySelectorAll('.feature-locked');
            lockedFeatures.forEach(feature => {
                feature.addEventListener('click', function() {
                    alert('This feature is available with Premium subscription only!');
                });
            });

            // Annual vs Monthly toggle
            let isAnnual = true;
            const togglePricing = () => {
                const priceElements = document.querySelectorAll('[data-price]');
                priceElements.forEach(el => {
                    const monthlyPrice = el.dataset.monthly;
                    const annualPrice = el.dataset.annual;
                    el.textContent = isAnnual ? annualPrice : monthlyPrice;
                });
                isAnnual = !isAnnual;
            };

            // Hover effects for pricing cards
            const pricingCards = document.querySelectorAll('.pricing-card');
            pricingCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-12px) scale(1.02)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        });
    </script>
</body>
</html>`;