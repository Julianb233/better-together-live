// Intimacy Challenges - Premium Adult Relationship Enhancement System
import { navigationHtml } from '../components/navigation.js';

export const intimacyChallengesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Intimacy Challenges - Reignite Your Passion | Better Together</title>
    <meta name="description" content="Premium intimacy challenges designed to deepen connection, build trust, and reignite passion. Progressive system with expert-designed content for couples ready to explore.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        rose: { 50: '#fff1f2', 100: '#ffe4e6', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239' },
                        purple: { 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6' },
                        amber: { 500: '#f59e0b', 600: '#d97706', 700: '#b45309' }
                    },
                    fontFamily: { 'inter': ['Inter', 'sans-serif'] },
                    animation: {
                        'pulse-glow': 'pulseGlow 3s ease-in-out infinite alternate',
                        'float': 'float 6s ease-in-out infinite'
                    },
                    keyframes: {
                        pulseGlow: {
                            '0%': { boxShadow: '0 0 20px rgba(244, 63, 94, 0.3)' },
                            '100%': { boxShadow: '0 0 40px rgba(244, 63, 94, 0.6)' }
                        },
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-10px)' }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .gradient-bg { background: linear-gradient(135deg, #fff1f2 0%, #fce7f3 30%, #f3e8ff 70%, #ede9fe 100%); }
        .intimacy-glow { box-shadow: 0 0 30px rgba(244, 63, 94, 0.3); }
        .premium-badge { 
            background: linear-gradient(45deg, #be123c, #9f1239); 
            color: white; 
            padding: 6px 16px; 
            border-radius: 9999px; 
            font-size: 0.75rem; 
            font-weight: 700;
            position: absolute;
            top: -10px;
            right: 20px;
            animation: pulse-glow 3s ease-in-out infinite alternate;
        }
        .challenge-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(244, 63, 94, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .challenge-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 25px 50px rgba(244, 63, 94, 0.25);
            border-color: rgba(244, 63, 94, 0.3);
        }
        .age-verification {
            backdrop-filter: blur(25px);
            background: rgba(0, 0, 0, 0.8);
        }
        .comfort-zone-indicator {
            position: relative;
            height: 8px;
            background: linear-gradient(90deg, #10b981 0%, #f59e0b 50%, #ef4444 100%);
            border-radius: 4px;
            overflow: hidden;
        }
        .comfort-zone-marker {
            position: absolute;
            width: 4px;
            height: 12px;
            background: white;
            border: 2px solid #374151;
            border-radius: 2px;
            top: -2px;
            transition: left 0.3s ease;
        }
        .privacy-lock {
            position: absolute;
            top: 15px;
            right: 15px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px;
            border-radius: 50%;
            font-size: 0.875rem;
        }
    </style>
</head>
<body class="bg-gray-50 font-inter">
    <!-- Age Verification Modal -->
    <div id="ageVerification" class="fixed inset-0 age-verification flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
            <div class="mb-6">
                <i class="fas fa-shield-alt text-4xl text-rose-600 mb-4"></i>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Age Verification Required</h2>
                <p class="text-gray-600">This content is designed for adults in committed relationships.</p>
            </div>
            <div class="space-y-4">
                <button id="confirmAge" class="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors">
                    I am 18+ and in a committed relationship
                </button>
                <button id="exitPage" class="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                    Take me back to main page
                </button>
            </div>
            <p class="text-xs text-gray-500 mt-4">
                Content is educational and relationship-focused. Privacy and discretion guaranteed.
            </p>
        </div>
    </div>

    <!-- Main Content (Hidden until age verified) -->
    <div id="mainContent" class="hidden">
        ${navigationHtml}

        <!-- Hero Section -->
        <section class="gradient-bg py-16 sm:py-20 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <div class="absolute top-20 left-10 w-32 h-32 bg-rose-300 rounded-full animate-float"></div>
                <div class="absolute bottom-20 right-10 w-24 h-24 bg-purple-300 rounded-full animate-float" style="animation-delay: -2s;"></div>
            </div>
            
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div class="text-center">
                    <div class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-8 shadow-lg intimacy-glow">
                        <i class="fas fa-heart mr-2 animate-pulse"></i>
                        Premium Intimacy Enhancement
                    </div>
                    
                    <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Reignite Your
                        <span class="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">
                            Passionate Connection
                        </span>
                    </h1>
                    
                    <p class="text-xl sm:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                        Expert-designed intimacy challenges that safely guide couples out of their comfort zone to rediscover passion, build deeper trust, and create unforgettable moments together.
                    </p>
                    
                    <!-- Trust & Privacy Indicators -->
                    <div class="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
                        <div class="bg-white bg-opacity-80 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                            <i class="fas fa-lock text-3xl text-rose-600 mb-2"></i>
                            <div class="font-semibold text-gray-900">100% Private</div>
                            <div class="text-sm text-gray-600">End-to-end encryption</div>
                        </div>
                        <div class="bg-white bg-opacity-80 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                            <i class="fas fa-user-md text-3xl text-purple-600 mb-2"></i>
                            <div class="font-semibold text-gray-900">Expert Designed</div>
                            <div class="text-sm text-gray-600">Licensed therapists</div>
                        </div>
                        <div class="bg-white bg-opacity-80 rounded-xl p-6 shadow-lg backdrop-blur-sm">
                            <i class="fas fa-chart-line text-3xl text-blue-600 mb-2"></i>
                            <div class="font-semibold text-gray-900">Progressive</div>
                            <div class="text-sm text-gray-600">Safe boundary expansion</div>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <button class="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-rose-700 hover:to-purple-700 transform hover:scale-105 shadow-lg transition-all duration-300">
                            <i class="fas fa-fire mr-2"></i>
                            Start Intimacy Journey
                        </button>
                        <button class="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors shadow-lg">
                            <i class="fas fa-play mr-2"></i>
                            See How It Works
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Challenge Categories -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Progressive Challenge Categories</h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto">Carefully designed progression system that respects boundaries while encouraging growth</p>
                </div>

                <div class="grid md:grid-cols-3 gap-8 mb-16">
                    <!-- Emotional Intimacy -->
                    <div class="challenge-card rounded-2xl p-8 relative">
                        <div class="privacy-lock">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="mb-6">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-heart text-white text-2xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">Emotional Intimacy</h3>
                            <p class="text-gray-600 mb-4">Deep emotional connection and vulnerability exercises</p>
                        </div>
                        
                        <div class="mb-6">
                            <div class="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Comfort Zone</span>
                                <span>Growth Zone</span>
                            </div>
                            <div class="comfort-zone-indicator">
                                <div class="comfort-zone-marker" style="left: 25%;"></div>
                            </div>
                        </div>

                        <div class="space-y-3 mb-6">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">• Soul-baring conversations</span>
                                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">SAFE</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">• Fear & dream sharing</span>
                                <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">GROWTH</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">• Past relationship healing</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">STRETCH</span>
                            </div>
                        </div>

                        <div class="mb-4">
                            <div class="text-2xl font-bold text-gray-900 mb-1">$14.99<span class="text-lg font-normal text-gray-600">/month</span></div>
                            <div class="text-sm text-gray-600">7-day free trial</div>
                        </div>

                        <button class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            Start Emotional Journey
                        </button>
                    </div>

                    <!-- Physical Connection -->
                    <div class="challenge-card rounded-2xl p-8 relative">
                        <div class="premium-badge">Most Popular</div>
                        <div class="privacy-lock">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="mb-6">
                            <div class="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-fire text-white text-2xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">Physical Connection</h3>
                            <p class="text-gray-600 mb-4">Sensual exploration and physical intimacy enhancement</p>
                        </div>
                        
                        <div class="mb-6">
                            <div class="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Comfort Zone</span>
                                <span>Adventure Zone</span>
                            </div>
                            <div class="comfort-zone-indicator">
                                <div class="comfort-zone-marker" style="left: 60%;"></div>
                            </div>
                        </div>

                        <div class="space-y-3 mb-6">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">• Sensual massage techniques</span>
                                <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">GROWTH</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">• Role-playing scenarios</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">STRETCH</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">• Adventure locations</span>
                                <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">BOLD</span>
                            </div>
                        </div>

                        <div class="mb-4">
                            <div class="text-2xl font-bold text-gray-900 mb-1">$29.99<span class="text-lg font-normal text-gray-600">/month</span></div>
                            <div class="text-sm text-gray-600">Includes expert video guides</div>
                        </div>

                        <button class="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors">
                            Ignite Passion
                        </button>
                    </div>

                    <!-- Adventure & Fantasy -->
                    <div class="challenge-card rounded-2xl p-8 relative">
                        <div class="privacy-lock">
                            <i class="fas fa-lock"></i>
                        </div>
                        <div class="mb-6">
                            <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-mask text-white text-2xl"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-gray-900 mb-2">Adventure & Fantasy</h3>
                            <p class="text-gray-600 mb-4">Creative scenarios and boundary-pushing experiences</p>
                        </div>
                        
                        <div class="mb-6">
                            <div class="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Safe Exploration</span>
                                <span>Wild Adventures</span>
                            </div>
                            <div class="comfort-zone-indicator">
                                <div class="comfort-zone-marker" style="left: 80%;"></div>
                            </div>
                        </div>

                        <div class="space-y-3 mb-6">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">• Fantasy exploration games</span>
                                <span class="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">STRETCH</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">• Public adventure dares</span>
                                <span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">BOLD</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-700">• Ultimate boundaries</span>
                                <span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">EXTREME</span>
                            </div>
                        </div>

                        <div class="mb-4">
                            <div class="text-2xl font-bold text-gray-900 mb-1">$49.99<span class="text-lg font-normal text-gray-600">/month</span></div>
                            <div class="text-sm text-gray-600">VIP expert consultations</div>
                        </div>

                        <button class="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                            Explore Fantasies
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Progressive Challenge System -->
        <section class="py-16 bg-gradient-to-br from-rose-50 to-purple-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Progressive Challenges Work</h2>
                    <p class="text-xl text-gray-600">Safe, consensual, and expertly guided boundary expansion</p>
                </div>

                <div class="grid md:grid-cols-4 gap-8 mb-16">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span class="text-white text-2xl font-bold">1</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-900">Comfort Assessment</h3>
                        <p class="text-gray-600">
                            Take our comprehensive intimacy assessment to establish your current comfort levels and boundaries.
                        </p>
                    </div>
                    
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span class="text-white text-2xl font-bold">2</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-900">Personalized Path</h3>
                        <p class="text-gray-600">
                            AI creates a custom progression plan that respects boundaries while encouraging growth at your pace.
                        </p>
                    </div>
                    
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span class="text-white text-2xl font-bold">3</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-900">Guided Challenges</h3>
                        <p class="text-gray-600">
                            Complete expertly designed challenges with built-in safety measures and communication prompts.
                        </p>
                    </div>
                    
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <span class="text-white text-2xl font-bold">4</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-4 text-gray-900">Growth & Reflection</h3>
                        <p class="text-gray-600">
                            Reflect on experiences together and unlock new levels of intimacy and connection.
                        </p>
                    </div>
                </div>

                <!-- Expert Testimonials -->
                <div class="bg-white rounded-2xl p-8 shadow-lg backdrop-blur-sm">
                    <div class="text-center mb-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-4">Expert-Designed Content</h3>
                        <p class="text-gray-600">Created by licensed sex therapists and relationship experts</p>
                    </div>
                    
                    <div class="grid md:grid-cols-3 gap-8">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-user-md text-white text-xl"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">Dr. Sarah Martinez</h4>
                            <p class="text-sm text-gray-600">Licensed Sex Therapist, 15+ years</p>
                            <p class="text-xs text-gray-500 mt-2 italic">"Safe exploration is key to lasting intimacy"</p>
                        </div>
                        <div class="text-center">
                            <div class="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-heart text-white text-xl"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">Dr. Michael Chen</h4>
                            <p class="text-sm text-gray-600">Relationship Coach, Author</p>
                            <p class="text-xs text-gray-500 mt-2 italic">"Boundaries create freedom for growth"</p>
                        </div>
                        <div class="text-center">
                            <div class="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-graduation-cap text-white text-xl"></i>
                            </div>
                            <h4 class="font-semibold text-gray-900 mb-2">Prof. Lisa Thompson</h4>
                            <p class="text-sm text-gray-600">Human Sexuality PhD</p>
                            <p class="text-xs text-gray-500 mt-2 italic">"Research-backed progressive methods"</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Premium Features & Pricing -->
        <section class="py-16 bg-gray-900 text-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold mb-4">Premium Intimacy Features</h2>
                    <p class="text-xl text-gray-300">Advanced tools for couples ready to deepen their connection</p>
                </div>

                <div class="grid md:grid-cols-2 gap-12 mb-16">
                    <div>
                        <h3 class="text-2xl font-bold mb-6">Exclusive Premium Content</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between py-3 border-b border-gray-700">
                                <div class="flex items-center">
                                    <i class="fas fa-video text-rose-500 mr-3"></i>
                                    <span>Expert Video Tutorials</span>
                                </div>
                                <span class="text-gray-400">$19.99/month</span>
                            </div>
                            <div class="flex items-center justify-between py-3 border-b border-gray-700">
                                <div class="flex items-center">
                                    <i class="fas fa-comments text-purple-500 mr-3"></i>
                                    <span>Private Couple Coaching</span>
                                </div>
                                <span class="text-gray-400">$149.99/session</span>
                            </div>
                            <div class="flex items-center justify-between py-3 border-b border-gray-700">
                                <div class="flex items-center">
                                    <i class="fas fa-book text-blue-500 mr-3"></i>
                                    <span>Intimacy Masterclass</span>
                                </div>
                                <span class="text-gray-400">$99.99 one-time</span>
                            </div>
                            <div class="flex items-center justify-between py-3 border-b border-gray-700">
                                <div class="flex items-center">
                                    <i class="fas fa-users text-green-500 mr-3"></i>
                                    <span>Private Couples Community</span>
                                </div>
                                <span class="text-gray-400">$29.99/month</span>
                            </div>
                            <div class="flex items-center justify-between py-3">
                                <div class="flex items-center">
                                    <i class="fas fa-box-heart text-pink-500 mr-3"></i>
                                    <span>Intimacy Challenge Box</span>
                                </div>
                                <span class="text-gray-400">$89.99/month</span>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl p-8">
                        <h3 class="text-2xl font-bold mb-6 text-center">VIP Intimacy Package</h3>
                        <div class="text-center mb-6">
                            <div class="text-5xl font-bold mb-2">$199<span class="text-2xl font-normal text-gray-400">/month</span></div>
                            <p class="text-gray-300">Complete intimacy transformation program</p>
                        </div>
                        
                        <ul class="space-y-4 mb-8">
                            <li class="flex items-center"><i class="fas fa-check text-green-400 mr-3"></i><span>All challenge categories included</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-green-400 mr-3"></i><span>Weekly expert consultations</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-green-400 mr-3"></i><span>Custom challenge creation</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-green-400 mr-3"></i><span>Priority support & guidance</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-green-400 mr-3"></i><span>Monthly intimacy box delivery</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-green-400 mr-3"></i><span>Couples retreat discounts</span></li>
                        </ul>

                        <button class="w-full bg-gradient-to-r from-rose-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-rose-700 hover:to-purple-700 transition-all transform hover:scale-105">
                            Start VIP Program
                        </button>
                        
                        <div class="text-center mt-4">
                            <span class="text-sm text-gray-400">30-day money back guarantee</span>
                        </div>
                    </div>
                </div>

                <!-- Revenue Breakdown -->
                <div class="grid md:grid-cols-4 gap-8 text-center">
                    <div class="bg-gray-800 rounded-xl p-6">
                        <div class="text-3xl font-bold text-rose-400 mb-2">$89</div>
                        <div class="text-gray-300">Avg Monthly ARPU</div>
                        <div class="text-sm text-gray-400">Per premium user</div>
                    </div>
                    <div class="bg-gray-800 rounded-xl p-6">
                        <div class="text-3xl font-bold text-purple-400 mb-2">78%</div>
                        <div class="text-gray-300">Profit Margin</div>
                        <div class="text-sm text-gray-400">Digital content</div>
                    </div>
                    <div class="bg-gray-800 rounded-xl p-6">
                        <div class="text-3xl font-bold text-blue-400 mb-2">94%</div>
                        <div class="text-gray-300">Retention Rate</div>
                        <div class="text-sm text-gray-400">Premium subscribers</div>
                    </div>
                    <div class="bg-gray-800 rounded-xl p-6">
                        <div class="text-3xl font-bold text-green-400 mb-2">$1,068</div>
                        <div class="text-gray-300">Annual LTV</div>
                        <div class="text-sm text-gray-400">Per couple</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Privacy & Safety -->
        <section class="py-16 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Privacy & Safety First</h2>
                    <p class="text-xl text-gray-600">Built with the highest standards of security and discretion</p>
                </div>

                <div class="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Advanced Security Features</h3>
                        <div class="space-y-6">
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                                    <i class="fas fa-shield-alt text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900 mb-2">End-to-End Encryption</h4>
                                    <p class="text-gray-600">All content and communications are encrypted with military-grade security.</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                                    <i class="fas fa-eye-slash text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900 mb-2">Anonymous Usage</h4>
                                    <p class="text-gray-600">No personal data shared with third parties. Complete privacy protection.</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                                    <i class="fas fa-trash text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900 mb-2">Self-Destructing Content</h4>
                                    <p class="text-gray-600">Sensitive content automatically expires for added security.</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <div class="flex-shrink-0 w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center mr-4">
                                    <i class="fas fa-hand-paper text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-semibold text-gray-900 mb-2">Consent Protocols</h4>
                                    <p class="text-gray-600">Built-in consent verification and boundary respect mechanisms.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl p-8">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">Safety Guidelines</h3>
                        <div class="space-y-4">
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-heart text-rose-500 mr-2"></i>
                                    <span class="font-semibold text-gray-900">Mutual Consent</span>
                                </div>
                                <p class="text-sm text-gray-600">Both partners must agree to participate in all challenges.</p>
                            </div>
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-comments text-blue-500 mr-2"></i>
                                    <span class="font-semibold text-gray-900">Open Communication</span>
                                </div>
                                <p class="text-sm text-gray-600">Regular check-ins and safe word protocols included.</p>
                            </div>
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-pause text-purple-500 mr-2"></i>
                                    <span class="font-semibold text-gray-900">Stop Anytime</span>
                                </div>
                                <p class="text-sm text-gray-600">Immediate pause options for any discomfort or hesitation.</p>
                            </div>
                            <div class="bg-white rounded-lg p-4 shadow-sm">
                                <div class="flex items-center mb-2">
                                    <i class="fas fa-user-md text-green-500 mr-2"></i>
                                    <span class="font-semibold text-gray-900">Expert Support</span>
                                </div>
                                <p class="text-sm text-gray-600">24/7 access to certified relationship counselors.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="py-16 bg-gradient-to-r from-rose-600 to-purple-600 text-white">
            <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Reignite Your Passion?</h2>
                <p class="text-xl mb-8 opacity-90">Join thousands of couples who've transformed their intimate connection</p>
                
                <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                    <button class="w-full sm:w-auto bg-white text-rose-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                        <i class="fas fa-fire mr-2"></i>
                        Start Your Journey
                    </button>
                    <button class="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-rose-600 transition-colors">
                        <i class="fas fa-lock mr-2"></i>
                        Privacy Guaranteed
                    </button>
                </div>

                <div class="text-rose-100">
                    <p class="text-sm">
                        <i class="fas fa-shield-alt mr-2"></i>
                        100% private • Expert designed • 30-day guarantee • Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    </div>

    <!-- JavaScript -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Age verification
            const ageVerification = document.getElementById('ageVerification');
            const mainContent = document.getElementById('mainContent');
            const confirmAge = document.getElementById('confirmAge');
            const exitPage = document.getElementById('exitPage');

            confirmAge.addEventListener('click', function() {
                ageVerification.classList.add('hidden');
                mainContent.classList.remove('hidden');
                // Set verification in localStorage (expires in 24 hours)
                localStorage.setItem('intimacyVerified', Date.now() + (24 * 60 * 60 * 1000));
            });

            exitPage.addEventListener('click', function() {
                window.location.href = '/';
            });

            // Check if already verified today
            const verified = localStorage.getItem('intimacyVerified');
            if (verified && Date.now() < parseInt(verified)) {
                ageVerification.classList.add('hidden');
                mainContent.classList.remove('hidden');
            }

            // Comfort zone sliders
            const comfortSliders = document.querySelectorAll('.comfort-zone-marker');
            comfortSliders.forEach(slider => {
                slider.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Add interactive comfort level adjustment
                    console.log('Comfort level adjustment clicked');
                });
            });

            // Challenge card interactions
            const challengeCards = document.querySelectorAll('.challenge-card');
            challengeCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-12px) scale(1.02)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Premium purchase buttons
            const purchaseButtons = document.querySelectorAll('button[class*="bg-"]');
            purchaseButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Add purchase animation
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 100);
                    
                    // Log purchase intent
                    console.log('Intimacy challenge purchase:', this.textContent.trim());
                    
                    // Here you would integrate with payment system
                    // Example: initiateIntimacyPurchase(getPriceFromButton(this));
                });
            });

            // Privacy and safety emphasis
            const privacyElements = document.querySelectorAll('[class*="privacy"], [class*="lock"]');
            privacyElements.forEach(element => {
                element.addEventListener('mouseenter', function() {
                    this.style.color = '#10b981';
                    this.style.transform = 'scale(1.1)';
                });
                element.addEventListener('mouseleave', function() {
                    this.style.color = '';
                    this.style.transform = 'scale(1)';
                });
            });
        });
    </script>
</body>
</html>`;