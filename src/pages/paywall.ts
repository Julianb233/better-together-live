// Paywall Page with Updated Pricing Tiers and Feature Comparison
export const paywallHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Start Your 7-Day Free Trial - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://js.stripe.com/v3/"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body { 
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #FF6B9D 0%, #8B5CF6 50%, #3B82F6 100%);
            min-height: 100vh;
        }
        
        /* Floating hearts animation */
        @keyframes floating-hearts {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
            50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
        }
        
        .floating-hearts {
            animation: floating-hearts 3s ease-in-out infinite;
        }
        
        /* Premium shimmer effect */
        @keyframes shimmer {
            0% { background-position: -200px 0; }
            100% { background-position: calc(200px + 100%) 0; }
        }
        
        .premium-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
        }
        
        /* Pulse for urgency */
        @keyframes urgent-pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 157, 0.7); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(255, 107, 157, 0); }
        }
        
        .urgent-pulse {
            animation: urgent-pulse 2s infinite;
        }
        
        /* Plan switching animation */
        .plan-transition {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Loading spinner for Stripe */
        .spinner {
            border: 2px solid #f3f3f3;
            border-top: 2px solid #FF6B9D;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="p-6">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <div class="flex items-center text-white">
                <span class="text-2xl mr-3 floating-hearts">💕</span>
                <span class="text-xl font-semibold">Better Together</span>
            </div>
            <a href="/" class="text-white/80 hover:text-white transition-colors">
                <i class="fas fa-arrow-left mr-2"></i>Back
            </a>
        </div>
    </nav>

    <div class="max-w-5xl mx-auto px-6 pb-12">
        <!-- Clean Hero Section -->
        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold text-white mb-4">
                Start Your <span class="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">7-Day Free Trial</span>
            </h1>
            <p class="text-xl text-white/90 max-w-2xl mx-auto mb-6">
                Transform your relationship in just one week. Cancel anytime.
            </p>
            <div class="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block">
                <div class="text-3xl font-bold text-white">$0 for 7 days</div>
                <div class="text-white/80 text-sm">Then choose your plan • Cancel anytime</div>
            </div>
        </div>

        <!-- Main Paywall Card -->
        <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            <!-- Premium Badge -->
            <div class="bg-gradient-to-r from-yellow-400 to-orange-500 text-center py-3">
                <div class="flex items-center justify-center text-white font-semibold">
                    <i class="fas fa-crown mr-2"></i>
                    <span class="premium-shimmer">PREMIUM ACCESS • 7-DAY FREE TRIAL</span>
                </div>
            </div>

            <div class="p-8">
                <!-- Pricing Plans Comparison -->
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
                        <i class="fas fa-crown text-yellow-500 mr-3"></i>
                        Choose Your Love Plan
                    </h2>
                    
                    <!-- Plan Selection Tabs -->
                    <div class="flex bg-gray-100 rounded-2xl p-2 mb-6 max-w-md mx-auto">
                        <button id="basicPlanTab" onclick="showPlan('basic')" 
                                class="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 bg-white shadow-sm text-gray-800">
                            Growing Together
                        </button>
                        <button id="premiumPlanTab" onclick="showPlan('premium')" 
                                class="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-gray-600 hover:text-gray-800">
                            Growing Together+
                        </button>
                    </div>

                    <!-- Feature Comparison Table -->
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <th class="text-left p-4 font-semibold text-gray-800">Features</th>
                                        <th class="text-center p-4 font-semibold text-gray-800 border-l">
                                            <div class="flex flex-col items-center">
                                                <span class="text-lg mb-1">Growing Together</span>
                                                <span class="text-2xl font-bold text-pink-600">$39</span>
                                                <span class="text-sm text-gray-600">/month for couple</span>
                                            </div>
                                        </th>
                                        <th class="text-center p-4 font-semibold text-gray-800 border-l bg-gradient-to-r from-yellow-50 to-orange-50">
                                            <div class="flex flex-col items-center relative">
                                                <div class="absolute -top-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                    MOST POPULAR
                                                </div>
                                                <span class="text-lg mb-1 mt-2">Growing Together+</span>
                                                <span class="text-2xl font-bold text-purple-600">$69</span>
                                                <span class="text-sm text-gray-600">/month for couple</span>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-t">
                                        <td class="p-4 font-medium text-gray-800">Scientific Love Assessments</td>
                                        <td class="p-4 text-center border-l">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-gray-600">Basic (3 assessments)</span>
                                            </div>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-purple-700 font-semibold">Complete (6 assessments)</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-t bg-gray-50">
                                        <td class="p-4 font-medium text-gray-800">AI Relationship Coach</td>
                                        <td class="p-4 text-center border-l">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-gray-600">Basic advice</span>
                                            </div>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-purple-700 font-semibold">Advanced AI + 24/7 support</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-t">
                                        <td class="p-4 font-medium text-gray-800">Smart Date Planning</td>
                                        <td class="p-4 text-center border-l">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-gray-600">Manual planning</span>
                                            </div>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-purple-700 font-semibold">Auto-scheduling + booking</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-t bg-gray-50">
                                        <td class="p-4 font-medium text-gray-800">Daily Check-ins & Analytics</td>
                                        <td class="p-4 text-center border-l">
                                            <i class="fas fa-check text-green-500 text-lg"></i>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <i class="fas fa-check text-green-500 text-lg"></i>
                                        </td>
                                    </tr>
                                    <tr class="border-t">
                                        <td class="p-4 font-medium text-gray-800">Relationship Challenges</td>
                                        <td class="p-4 text-center border-l">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-gray-600">Basic challenges</span>
                                            </div>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-purple-700 font-semibold">Premium + intimacy challenges</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-t bg-gray-50">
                                        <td class="p-4 font-medium text-gray-800">Mobile App Access</td>
                                        <td class="p-4 text-center border-l">
                                            <i class="fas fa-check text-green-500 text-lg"></i>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <i class="fas fa-check text-green-500 text-lg"></i>
                                        </td>
                                    </tr>
                                    <tr class="border-t">
                                        <td class="p-4 font-medium text-gray-800">Priority Customer Support</td>
                                        <td class="p-4 text-center border-l">
                                            <i class="fas fa-times text-red-400 text-lg"></i>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <i class="fas fa-check text-green-500 text-lg"></i>
                                        </td>
                                    </tr>
                                    <tr class="border-t bg-gray-50">
                                        <td class="p-4 font-medium text-gray-800">Advanced Compatibility Analysis</td>
                                        <td class="p-4 text-center border-l">
                                            <i class="fas fa-times text-red-400 text-lg"></i>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <i class="fas fa-check text-green-500 text-lg"></i>
                                        </td>
                                    </tr>
                                    <tr class="border-t">
                                        <td class="p-4 font-medium text-gray-800">Custom Relationship Goals</td>
                                        <td class="p-4 text-center border-l">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-gray-600">Up to 5 goals</span>
                                            </div>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-purple-700 font-semibold">Unlimited goals</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="border-t bg-gray-50">
                                        <td class="p-4 font-medium text-gray-800">Monthly Surprise Box</td>
                                        <td class="p-4 text-center border-l">
                                            <i class="fas fa-times text-red-400 text-lg"></i>
                                        </td>
                                        <td class="p-4 text-center border-l bg-purple-50">
                                            <div class="flex flex-col items-center">
                                                <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                                <span class="text-xs text-purple-700 font-semibold">Curated date ideas & gifts</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Plan Details & Social Proof -->
                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <!-- Left: Selected Plan Benefits -->
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <i class="fas fa-gift text-pink-500 mr-3"></i>
                            <span id="selectedPlanTitle">Growing Together Includes</span>
                        </h2>
                        
                        <div id="planFeatures" class="space-y-4 plan-transition">
                            <!-- Basic Plan Features -->
                            <div id="basicFeatures">
                                <div class="flex items-start mb-4">
                                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">Essential Love Assessments</div>
                                        <div class="text-sm text-gray-600">Love Languages, Attachment Style, Communication Style</div>
                                    </div>
                                </div>
                                
                                <div class="flex items-start mb-4">
                                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">AI-Powered Daily Check-ins</div>
                                        <div class="text-sm text-gray-600">Personalized conversation starters & connection tracking</div>
                                    </div>
                                </div>
                                
                                <div class="flex items-start mb-4">
                                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">Manual Date Planning</div>
                                        <div class="text-sm text-gray-600">Plan and track date nights with AI suggestions</div>
                                    </div>
                                </div>
                                
                                <div class="flex items-start mb-4">
                                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">Basic Relationship Coaching</div>
                                        <div class="text-sm text-gray-600">AI coach with essential growth strategies</div>
                                    </div>
                                </div>
                                
                                <div class="flex items-start">
                                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-check text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">Relationship Analytics</div>
                                        <div class="text-sm text-gray-600">Track progress, streaks, and relationship health</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Premium Plan Features (Hidden by default) -->
                            <div id="premiumFeatures" class="hidden">
                                <div class="flex items-start mb-4">
                                    <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-crown text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">Complete Assessment Suite</div>
                                        <div class="text-sm text-gray-600">All 6 assessments + advanced compatibility analysis</div>
                                    </div>
                                </div>
                                
                                <div class="flex items-start mb-4">
                                    <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-crown text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">Advanced AI Coach</div>
                                        <div class="text-sm text-gray-600">24/7 premium AI coach + priority expert support</div>
                                    </div>
                                </div>
                                
                                <div class="flex items-start mb-4">
                                    <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-crown text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">Auto-Scheduling & Booking</div>
                                        <div class="text-sm text-gray-600">AI automatically plans, schedules & books date nights</div>
                                    </div>
                                </div>
                                
                                <div class="flex items-start mb-4">
                                    <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-crown text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">Premium Challenges</div>
                                        <div class="text-sm text-gray-600">Exclusive intimacy & connection challenges</div>
                                    </div>
                                </div>
                                
                                <div class="flex items-start">
                                    <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3 mt-1">
                                        <i class="fas fa-crown text-white text-xs"></i>
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">Monthly Surprise Box</div>
                                        <div class="text-sm text-gray-600">Curated date ideas, gifts & relationship tools</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Social Proof & Urgency -->
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <i class="fas fa-users text-blue-500 mr-3"></i>
                            Join 50,000+ Happy Couples
                        </h2>
                        
                        <!-- Stats -->
                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                                <div class="text-2xl font-bold text-pink-600">87%</div>
                                <div class="text-sm text-pink-700">Improved Communication</div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                <div class="text-2xl font-bold text-blue-600">94%</div>
                                <div class="text-sm text-blue-700">Relationship Satisfaction</div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                                <div class="text-2xl font-bold text-green-600">15+</div>
                                <div class="text-sm text-green-700">Days Average Streak</div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                                <div class="text-2xl font-bold text-purple-600">98%</div>
                                <div class="text-sm text-purple-700">Would Recommend</div>
                            </div>
                        </div>

                        <!-- Testimonial -->
                        <div class="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border-l-4 border-pink-500 mb-4">
                            <div class="flex items-center mb-2">
                                <div class="flex text-yellow-400 text-sm">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                </div>
                                <span class="text-xs text-gray-600 ml-2">Verified User</span>
                            </div>
                            <p class="text-sm text-gray-700 italic">"We went from barely talking to having deep conversations every night. The 7-day trial convinced us this actually works!"</p>
                            <div class="text-xs text-gray-500 mt-2">— Sarah & Mike, married 8 years</div>
                        </div>

                        <!-- Limited Time Offer -->
                        <div class="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-xl border border-orange-200">
                            <div class="flex items-center mb-2">
                                <i class="fas fa-clock text-orange-600 mr-2"></i>
                                <span class="font-semibold text-orange-800">Limited Time Offer</span>
                            </div>
                            <p class="text-sm text-orange-700">Start your free trial today and get your first month at 50% off!</p>
                        </div>
                    </div>
                </div>

                <!-- Stripe Checkout Form -->
                <div class="border-t pt-8">
                    <div class="max-w-md mx-auto">
                        <h3 class="text-xl font-bold text-gray-800 text-center mb-6">Start Your Free Trial Now</h3>
                        
                        <!-- Plan Selection -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Select Your Plan</label>
                            <div class="grid grid-cols-2 gap-4">
                                <label class="cursor-pointer">
                                    <input type="radio" name="selectedPlan" value="basic" class="sr-only" checked>
                                    <div class="border-2 border-pink-200 rounded-xl p-4 text-center hover:border-pink-400 transition-colors">
                                        <div class="font-semibold text-gray-800">Growing Together</div>
                                        <div class="text-2xl font-bold text-pink-600">$39</div>
                                        <div class="text-xs text-gray-600">/month</div>
                                    </div>
                                </label>
                                <label class="cursor-pointer">
                                    <input type="radio" name="selectedPlan" value="premium" class="sr-only">
                                    <div class="border-2 border-purple-200 rounded-xl p-4 text-center hover:border-purple-400 transition-colors relative">
                                        <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                                            POPULAR
                                        </div>
                                        <div class="font-semibold text-gray-800 mt-2">Growing Together+</div>
                                        <div class="text-2xl font-bold text-purple-600">$69</div>
                                        <div class="text-xs text-gray-600">/month</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        
                        <!-- Trial Info -->
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-6 text-center">
                            <div class="text-2xl font-bold text-green-600 mb-1">FREE for 7 days</div>
                            <div class="text-sm text-green-700">Then <span id="selectedPrice">$39</span>/month for both partners • Cancel anytime with one click</div>
                        </div>

                        <!-- Stripe Payment Form -->
                        <form id="payment-form">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" id="email" required 
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            </div>
                            
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input type="text" id="name" required
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            </div>

                            <button type="submit" id="submit-button" 
                                    class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg urgent-pulse hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <span id="button-text">
                                    <i class="fas fa-crown mr-2"></i>
                                    Start 7-Day FREE Trial
                                </span>
                                <span id="spinner" class="hidden">
                                    <div class="spinner mr-2"></div>
                                    Processing...
                                </span>
                            </button>
                        </form>

                        <!-- Security & Guarantees -->
                        <div class="mt-6 text-center space-y-3">
                            <div class="flex items-center justify-center text-sm text-gray-600">
                                <i class="fas fa-lock text-green-500 mr-2"></i>
                                <span>Secured by Stripe • SSL Encrypted</span>
                            </div>
                            <div class="flex items-center justify-center text-sm text-gray-600">
                                <i class="fas fa-shield-alt text-blue-500 mr-2"></i>
                                <span>30-Day Money-Back Guarantee</span>
                            </div>
                            <div class="flex items-center justify-center text-sm text-gray-600">
                                <i class="fas fa-times-circle text-red-500 mr-2"></i>
                                <span>Cancel Anytime • No Questions Asked</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- FAQ Section -->
        <div class="mt-12 bg-white/90 backdrop-blur-sm rounded-2xl p-8">
            <h2 class="text-2xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">How does the 7-day free trial work?</h3>
                    <p class="text-sm text-gray-600">You get full access to all features for 7 days. If you don't cancel before the trial ends, you'll be charged based on your selected plan. You can cancel anytime with one click.</p>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">What's the difference between the plans?</h3>
                    <p class="text-sm text-gray-600">Growing Together+ includes all premium features like complete assessments, advanced AI coaching, auto-scheduling, and monthly surprise boxes. Growing Together has essential features for couples starting their journey.</p>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">Do both partners need accounts?</h3>
                    <p class="text-sm text-gray-600">Yes! Better Together is designed for couples. One subscription covers both partners with full access to all relationship tools, AI coaching, and personalized insights.</p>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">Can I switch plans later?</h3>
                    <p class="text-sm text-gray-600">Absolutely! You can upgrade or downgrade your plan anytime from your account settings. Changes will be reflected in your next billing cycle.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        let selectedPlan = 'basic';
        
        // Plan switching functionality
        function showPlan(plan) {
            selectedPlan = plan;
            
            // Update tab appearance
            const basicTab = document.getElementById('basicPlanTab');
            const premiumTab = document.getElementById('premiumPlanTab');
            
            if (plan === 'basic') {
                basicTab.classList.add('bg-white', 'shadow-sm', 'text-gray-800');
                basicTab.classList.remove('text-gray-600', 'hover:text-gray-800');
                premiumTab.classList.remove('bg-white', 'shadow-sm', 'text-gray-800');
                premiumTab.classList.add('text-gray-600', 'hover:text-gray-800');
                
                // Update features display
                document.getElementById('basicFeatures').classList.remove('hidden');
                document.getElementById('premiumFeatures').classList.add('hidden');
                document.getElementById('selectedPlanTitle').textContent = 'Growing Together Includes';
                document.getElementById('selectedPrice').textContent = '$39';
                
            } else {
                premiumTab.classList.add('bg-white', 'shadow-sm', 'text-gray-800');
                premiumTab.classList.remove('text-gray-600', 'hover:text-gray-800');
                basicTab.classList.remove('bg-white', 'shadow-sm', 'text-gray-800');
                basicTab.classList.add('text-gray-600', 'hover:text-gray-800');
                
                // Update features display
                document.getElementById('premiumFeatures').classList.remove('hidden');
                document.getElementById('basicFeatures').classList.add('hidden');
                document.getElementById('selectedPlanTitle').textContent = 'Growing Together+ Includes';
                document.getElementById('selectedPrice').textContent = '$69';
            }
            
            // Update radio button selection
            document.querySelector(\`input[value="\${plan}"]\`).checked = true;
        }
        
        // Handle plan selection from radio buttons
        document.querySelectorAll('input[name="selectedPlan"]').forEach(radio => {
            radio.addEventListener('change', function() {
                showPlan(this.value);
            });
        });

        // Initialize Stripe (key will be loaded from backend if needed)
        // Using Stripe Checkout redirect flow - no Elements needed

        // Handle form submission
        const form = document.getElementById('payment-form');
        const submitButton = document.getElementById('submit-button');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Disable submit button and show loading
            submitButton.disabled = true;
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');

            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            const planType = document.querySelector('input[name="selectedPlan"]:checked').value;

            // Map plan types to actual tier IDs
            const tierIdMap = {
                'basic': 'growing-together',
                'premium': 'growing-together-plus'
            };
            const tierId = tierIdMap[planType] || 'growing-together';

            try {
                // Create checkout session and redirect to Stripe Checkout
                const response = await fetch('/api/payments/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        tierId: tierId,
                        email: email,
                        userId: null, // Will be created during checkout
                        successUrl: window.location.origin + '/portal?session_id={CHECKOUT_SESSION_ID}',
                        cancelUrl: window.location.origin + '/paywall'
                    }),
                });

                const data = await response.json();

                if (data.url) {
                    // Redirect to Stripe Checkout
                    window.location.href = data.url;
                } else {
                    throw new Error(data.error || 'Failed to create checkout session');
                }
            } catch (error) {
                console.error('Checkout error:', error);
                alert('Failed to start checkout: ' + error.message);

                // Re-enable submit button
                submitButton.disabled = false;
                buttonText.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });
        
        // Initialize with basic plan
        showPlan('basic');
    </script>
</body>
</html>`;