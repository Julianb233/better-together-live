// Intelligent Suggestions comprehensive feature page
import { navigationHtml } from '../components/navigation.js';

export const intelligentSuggestionsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI-Powered Personalized Suggestions - Perfect Dates Every Time | Better Together</title>
    <meta name="description" content="AI learns your unique preferences to suggest perfect activities, restaurants, and experiences. Get personalized recommendations that strengthen your relationship bond.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#fdf2f8',
                            100: '#fce7f3',
                            500: '#ec4899',
                            600: '#db2777',
                            700: '#be185d'
                        }
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-gray-50 overflow-x-hidden">
    ${navigationHtml}

    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-purple-50 to-pink-50 py-12 sm:py-16 lg:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="flex justify-center mb-6">
                <div class="bg-purple-100 p-4 rounded-full">
                    <i class="fas fa-magic text-4xl text-purple-600"></i>
                </div>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Personalized Just for You Two
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                AI learns your unique preferences, relationship dynamics, and past experiences to suggest 
                <strong>perfect activities that strengthen your bond</strong> while staying within your lifestyle.
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button class="w-full sm:w-auto bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm sm:text-base">
                    <i class="fas fa-brain mr-2"></i>
                    See AI Learning Demo
                </button>
                <button class="w-full sm:w-auto border border-purple-600 text-purple-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-sm sm:text-base">
                    <i class="fas fa-star mr-2"></i>
                    Get Personalized Preview
                </button>
            </div>
        </div>
    </div>

    <!-- How AI Learns About You -->
    <div class="py-12 sm:py-16 lg:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">AI That Actually Knows You</h2>
                <p class="text-lg sm:text-xl text-gray-600">Watch how your AI learns and adapts to your unique relationship</p>
            </div>

            <div class="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <!-- Learning Process -->
                <div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Your AI Gets Smarter Every Date</h3>
                    <div class="space-y-6">
                        <div class="flex items-start space-x-4">
                            <div class="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-eye text-blue-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">Observes Your Choices</h4>
                                <p class="text-gray-600">Tracks which restaurants you love, activities you enjoy, and experiences that create the best memories.</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-brain text-green-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">Learns Your Patterns</h4>
                                <p class="text-gray-600">Understands your relationship dynamics, energy levels, and what activities bring you closer together.</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-magic text-purple-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">Predicts What You'll Love</h4>
                                <p class="text-gray-600">Suggests new experiences based on deep understanding of your preferences and relationship goals.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Learning Timeline -->
                <div class="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl">
                    <h4 class="text-lg font-semibold text-gray-900 mb-6">Your AI Learning Journey</h4>
                    <div class="space-y-6">
                        <!-- Week 1 -->
                        <div class="flex items-start space-x-4">
                            <div class="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                            <div>
                                <p class="font-medium text-gray-900">Week 1: Basic Preferences</p>
                                <p class="text-sm text-gray-600">Learns your cuisine preferences, budget range, and activity types</p>
                            </div>
                        </div>
                        <!-- Week 2 -->
                        <div class="flex items-start space-x-4">
                            <div class="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                            <div>
                                <p class="font-medium text-gray-900">Week 2-3: Relationship Dynamics</p>
                                <p class="text-sm text-gray-600">Understands your communication styles and what activities spark connection</p>
                            </div>
                        </div>
                        <!-- Week 4+ -->
                        <div class="flex items-start space-x-4">
                            <div class="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4+</div>
                            <div>
                                <p class="font-medium text-gray-900">Month 1+: Predictive Mastery</p>
                                <p class="text-sm text-gray-600">Anticipates your needs and suggests perfectly tailored experiences</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Budget-Aware Suggestions -->
    <div class="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Perfect Suggestions for Every Budget</h2>
                <p class="text-lg sm:text-xl text-gray-600">AI finds amazing experiences at any price point</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- $0 Budget -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="text-center mb-6">
                        <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-leaf text-2xl text-green-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900">Free & Meaningful</h3>
                        <p class="text-green-600 font-semibold text-lg">$0</p>
                    </div>
                    <div class="space-y-4">
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">🌅 Sunrise Hike & Coffee</h4>
                            <p class="text-sm text-gray-600">Watch the sunrise together at Eagle Point, then make coffee over a camp stove</p>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">🎨 Museum Free Days</h4>
                            <p class="text-sm text-gray-600">Explore the modern art exhibit during resident appreciation hours</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">🌙 Stargazing Picnic</h4>
                            <p class="text-sm text-gray-600">Homemade snacks under the stars at Miller Observatory</p>
                        </div>
                    </div>
                    <div class="mt-6 pt-4 border-t border-gray-200">
                        <p class="text-sm text-gray-600"><strong>AI Insight:</strong> "Focus on shared experiences and natural beauty that create lasting memories"</p>
                    </div>
                </div>

                <!-- $50 Budget -->
                <div class="bg-white p-6 rounded-xl shadow-sm border-2 border-blue-200">
                    <div class="text-center mb-6">
                        <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-balance-scale text-2xl text-blue-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900">Sweet Spot</h3>
                        <p class="text-blue-600 font-semibold text-lg">~$50</p>
                        <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Most Popular</span>
                    </div>
                    <div class="space-y-4">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">🍷 Wine & Paint Night</h4>
                            <p class="text-sm text-gray-600">Local studio class with wine pairings - create art together</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">🍜 Cooking Class Date</h4>
                            <p class="text-sm text-gray-600">Learn to make authentic ramen from Chef Martinez</p>
                        </div>
                        <div class="bg-yellow-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">🎭 Local Theater Show</h4>
                            <p class="text-sm text-gray-600">Intimate performance + dinner at the cozy bistro next door</p>
                        </div>
                    </div>
                    <div class="mt-6 pt-4 border-t border-gray-200">
                        <p class="text-sm text-gray-600"><strong>AI Insight:</strong> "Perfect balance of novelty and comfort for regular date nights"</p>
                    </div>
                </div>

                <!-- $150+ Budget -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="text-center mb-6">
                        <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-crown text-2xl text-purple-600"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900">Special Occasions</h3>
                        <p class="text-purple-600 font-semibold text-lg">$150+</p>
                    </div>
                    <div class="space-y-4">
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">🚁 City Helicopter Tour</h4>
                            <p class="text-sm text-gray-600">Sunset flight over downtown + rooftop champagne reception</p>
                        </div>
                        <div class="bg-red-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">🏨 Weekend Getaway</h4>
                            <p class="text-sm text-gray-600">Boutique hotel in wine country with couples massage</p>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">🍾 Chef's Table Experience</h4>
                            <p class="text-sm text-gray-600">Private dining with Michelin-starred chef + wine pairings</p>
                        </div>
                    </div>
                    <div class="mt-6 pt-4 border-t border-gray-200">
                        <p class="text-sm text-gray-600"><strong>AI Insight:</strong> "Reserved for anniversaries and major milestones - maximum impact experiences"</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Personality-Based Matching -->
    <div class="py-12 sm:py-16 lg:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Matches Your Unique Personalities</h2>
                <p class="text-lg sm:text-xl text-gray-600">AI understands both partners and finds activities you'll both love</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <!-- Adventurous + Cautious -->
                <div class="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
                    <div class="text-center mb-4">
                        <div class="flex justify-center space-x-2 mb-3">
                            <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                <i class="fas fa-mountain text-white"></i>
                            </div>
                            <div class="text-2xl text-gray-400">+</div>
                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <i class="fas fa-shield-alt text-white"></i>
                            </div>
                        </div>
                        <h3 class="font-bold text-gray-900">Adventurer + Cautious</h3>
                    </div>
                    <div class="space-y-3 text-sm">
                        <div class="bg-white p-3 rounded-lg">
                            <p class="font-medium">🧗‍♀️ Indoor Rock Climbing</p>
                            <p class="text-gray-600">Safe thrill with professional instruction</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg">
                            <p class="font-medium">🎨 Art Walk Food Tour</p>
                            <p class="text-gray-600">Gentle exploration with familiar food</p>
                        </div>
                    </div>
                </div>

                <!-- Introverted + Extroverted -->
                <div class="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl">
                    <div class="text-center mb-4">
                        <div class="flex justify-center space-x-2 mb-3">
                            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <i class="fas fa-book text-white"></i>
                            </div>
                            <div class="text-2xl text-gray-400">+</div>
                            <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                                <i class="fas fa-users text-white"></i>
                            </div>
                        </div>
                        <h3 class="font-bold text-gray-900">Introvert + Extrovert</h3>
                    </div>
                    <div class="space-y-3 text-sm">
                        <div class="bg-white p-3 rounded-lg">
                            <p class="font-medium">📚 Bookstore Café + Small Concert</p>
                            <p class="text-gray-600">Quiet start, social finish</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg">
                            <p class="font-medium">🍷 Wine Tasting for Two</p>
                            <p class="text-gray-600">Intimate with optional group activities</p>
                        </div>
                    </div>
                </div>

                <!-- Creative + Analytical -->
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                    <div class="text-center mb-4">
                        <div class="flex justify-center space-x-2 mb-3">
                            <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                <i class="fas fa-palette text-white"></i>
                            </div>
                            <div class="text-2xl text-gray-400">+</div>
                            <div class="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                <i class="fas fa-calculator text-white"></i>
                            </div>
                        </div>
                        <h3 class="font-bold text-gray-900">Creative + Analytical</h3>
                    </div>
                    <div class="space-y-3 text-sm">
                        <div class="bg-white p-3 rounded-lg">
                            <p class="font-medium">🔬 Science Museum + Art Workshop</p>
                            <p class="text-gray-600">Perfect blend of both interests</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg">
                            <p class="font-medium">🏗️ Architecture Walking Tour</p>
                            <p class="text-gray-600">Form meets function exploration</p>
                        </div>
                    </div>
                </div>

                <!-- Active + Relaxed -->
                <div class="bg-gradient-to-br from-yellow-50 to-green-50 p-6 rounded-xl">
                    <div class="text-center mb-4">
                        <div class="flex justify-center space-x-2 mb-3">
                            <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                <i class="fas fa-running text-white"></i>
                            </div>
                            <div class="text-2xl text-gray-400">+</div>
                            <div class="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
                                <i class="fas fa-leaf text-white"></i>
                            </div>
                        </div>
                        <h3 class="font-bold text-gray-900">Active + Relaxed</h3>
                    </div>
                    <div class="space-y-3 text-sm">
                        <div class="bg-white p-3 rounded-lg">
                            <p class="font-medium">🚴‍♂️ Bike Ride + Spa Afternoon</p>
                            <p class="text-gray-600">Activity followed by relaxation</p>
                        </div>
                        <div class="bg-white p-3 rounded-lg">
                            <p class="font-medium">🧘‍♀️ Yoga + Brunch</p>
                            <p class="text-gray-600">Gentle movement and good food</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Real-Time Personalized Demo -->
    <div class="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">See Personalization In Action</h2>
                <p class="text-lg sm:text-xl text-gray-600">Watch AI adapt suggestions based on your relationship profile</p>
            </div>

            <!-- Demo Interface -->
            <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-xl max-w-5xl mx-auto">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span class="text-sm text-gray-500">AI Personalization Engine</span>
                </div>

                <!-- Demo Scenario Selector -->
                <div class="mb-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Choose a couple to see their personalized suggestions:</h3>
                    <div class="grid sm:grid-cols-3 gap-4 mb-6">
                        <button class="couple-btn bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 p-4 rounded-lg text-left transition-colors" data-couple="sarah-mike">
                            <div class="flex items-center space-x-3 mb-2">
                                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm font-bold">S</span>
                                </div>
                                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm font-bold">M</span>
                                </div>
                            </div>
                            <p class="font-medium text-gray-900">Sarah & Mike</p>
                            <p class="text-sm text-gray-600">Creative + Analytical, $75 budget</p>
                        </button>
                        <button class="couple-btn bg-purple-50 hover:bg-purple-100 border-2 border-transparent p-4 rounded-lg text-left transition-colors" data-couple="alex-jordan">
                            <div class="flex items-center space-x-3 mb-2">
                                <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm font-bold">A</span>
                                </div>
                                <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm font-bold">J</span>
                                </div>
                            </div>
                            <p class="font-medium text-gray-900">Alex & Jordan</p>
                            <p class="text-sm text-gray-600">Adventurous + Cautious, $120 budget</p>
                        </button>
                        <button class="couple-btn bg-green-50 hover:bg-green-100 border-2 border-transparent p-4 rounded-lg text-left transition-colors" data-couple="emma-david">
                            <div class="flex items-center space-x-3 mb-2">
                                <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm font-bold">E</span>
                                </div>
                                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                    <span class="text-white text-sm font-bold">D</span>
                                </div>
                            </div>
                            <p class="font-medium text-gray-900">Emma & David</p>
                            <p class="text-sm text-gray-600">Introverts, $40 budget</p>
                        </button>
                    </div>
                </div>

                <!-- Demo Results -->
                <div id="demo-results">
                    <!-- Sarah & Mike Results (Default) -->
                    <div id="sarah-mike-results" class="demo-content">
                        <div class="bg-blue-50 p-6 rounded-lg mb-6">
                            <h4 class="font-bold text-blue-900 mb-3">🧠 AI Analysis for Sarah & Mike</h4>
                            <div class="grid sm:grid-cols-2 gap-4 text-sm">
                                <div class="space-y-2">
                                    <p><i class="fas fa-palette mr-2 text-purple-600"></i><strong>Sarah:</strong> Creative, loves art & music</p>
                                    <p><i class="fas fa-clock mr-2 text-blue-600"></i>Free weekends, busy weekdays</p>
                                    <p><i class="fas fa-heart mr-2 text-red-500"></i>Prefers meaningful conversations</p>
                                </div>
                                <div class="space-y-2">
                                    <p><i class="fas fa-calculator mr-2 text-gray-600"></i><strong>Mike:</strong> Analytical, tech enthusiast</p>
                                    <p><i class="fas fa-coffee mr-2 text-brown-600"></i>Coffee lover, morning person</p>
                                    <p><i class="fas fa-dollar-sign mr-2 text-green-600"></i>Budget-conscious, $75 comfort zone</p>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="bg-white border-2 border-blue-200 p-6 rounded-lg">
                                <div class="flex items-start justify-between mb-4">
                                    <h5 class="font-bold text-gray-900 text-lg">🎨 Interactive Art & Tech Exhibition</h5>
                                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Perfect Match</span>
                                </div>
                                <p class="text-gray-600 mb-4">Modern art museum featuring digital installations - combines Sarah's artistic passion with Mike's tech interests</p>
                                <div class="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p class="text-sm"><strong>When:</strong> Saturday 2-5 PM</p>
                                        <p class="text-sm"><strong>Cost:</strong> $60 total</p>
                                        <p class="text-sm"><strong>Location:</strong> Downtown Arts District</p>
                                    </div>
                                    <div>
                                        <p class="text-sm"><strong>Why Perfect:</strong></p>
                                        <p class="text-sm text-gray-600">• Stimulates both creative and analytical minds</p>
                                        <p class="text-sm text-gray-600">• Plenty of conversation starters</p>
                                    </div>
                                </div>
                                <div class="flex gap-3">
                                    <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">Book This Experience</button>
                                    <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">See Similar Options</button>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-700"><strong>AI Insight:</strong> "This suggestion combines both partners' interests while staying within budget. The interactive nature will give Mike technical aspects to analyze while providing Sarah with artistic inspiration for meaningful conversations."</p>
                            </div>
                        </div>
                    </div>

                    <!-- Alex & Jordan Results (Hidden by default) -->
                    <div id="alex-jordan-results" class="demo-content hidden">
                        <div class="bg-purple-50 p-6 rounded-lg mb-6">
                            <h4 class="font-bold text-purple-900 mb-3">🧠 AI Analysis for Alex & Jordan</h4>
                            <div class="grid sm:grid-cols-2 gap-4 text-sm">
                                <div class="space-y-2">
                                    <p><i class="fas fa-mountain mr-2 text-green-600"></i><strong>Alex:</strong> Adventurous, loves new experiences</p>
                                    <p><i class="fas fa-plane mr-2 text-blue-600"></i>Recently tried skydiving, wants thrills</p>
                                    <p><i class="fas fa-users mr-2 text-orange-600"></i>Energetic, social butterfly</p>
                                </div>
                                <div class="space-y-2">
                                    <p><i class="fas fa-shield-alt mr-2 text-blue-600"></i><strong>Jordan:</strong> Cautious, values safety</p>
                                    <p><i class="fas fa-book mr-2 text-purple-600"></i>Prefers familiar environments</p>
                                    <p><i class="fas fa-dollar-sign mr-2 text-green-600"></i>Higher budget for special experiences</p>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="bg-white border-2 border-purple-200 p-6 rounded-lg">
                                <div class="flex items-start justify-between mb-4">
                                    <h5 class="font-bold text-gray-900 text-lg">🧗‍♀️ Guided Indoor Rock Climbing + Spa</h5>
                                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Compromise Winner</span>
                                </div>
                                <p class="text-gray-600 mb-4">Professional climbing gym with certified instructors, followed by couples massage at adjacent spa</p>
                                <div class="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p class="text-sm"><strong>When:</strong> Saturday 4-8 PM</p>
                                        <p class="text-sm"><strong>Cost:</strong> $115 total</p>
                                        <p class="text-sm"><strong>Safety:</strong> Professional instruction</p>
                                    </div>
                                    <div>
                                        <p class="text-sm"><strong>Why Perfect:</strong></p>
                                        <p class="text-sm text-gray-600">• Adventure with safety measures</p>
                                        <p class="text-sm text-gray-600">• Relaxing spa time after activity</p>
                                    </div>
                                </div>
                                <div class="flex gap-3">
                                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">Perfect! Book Now</button>
                                    <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">Show Alternatives</button>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-700"><strong>AI Insight:</strong> "This balances Alex's need for adventure with Jordan's preference for safety. The professional instruction addresses safety concerns while the spa provides relaxation after the thrill - perfect for both personality types."</p>
                            </div>
                        </div>
                    </div>

                    <!-- Emma & David Results (Hidden by default) -->
                    <div id="emma-david-results" class="demo-content hidden">
                        <div class="bg-green-50 p-6 rounded-lg mb-6">
                            <h4 class="font-bold text-green-900 mb-3">🧠 AI Analysis for Emma & David</h4>
                            <div class="grid sm:grid-cols-2 gap-4 text-sm">
                                <div class="space-y-2">
                                    <p><i class="fas fa-book mr-2 text-blue-600"></i><strong>Emma:</strong> Introvert, loves reading</p>
                                    <p><i class="fas fa-home mr-2 text-green-600"></i>Prefers intimate, quiet settings</p>
                                    <p><i class="fas fa-coffee mr-2 text-brown-600"></i>Coffee enthusiast, values deep conversations</p>
                                </div>
                                <div class="space-y-2">
                                    <p><i class="fas fa-leaf mr-2 text-green-600"></i><strong>David:</strong> Also introverted, nature lover</p>
                                    <p><i class="fas fa-camera mr-2 text-purple-600"></i>Photography hobbyist</p>
                                    <p><i class="fas fa-piggy-bank mr-2 text-green-600"></i>Budget-conscious, $40 comfort zone</p>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="bg-white border-2 border-green-200 p-6 rounded-lg">
                                <div class="flex items-start justify-between mb-4">
                                    <h5 class="font-bold text-gray-900 text-lg">📚 Cozy Bookstore Café + Garden Walk</h5>
                                    <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Introvert Perfect</span>
                                </div>
                                <p class="text-gray-600 mb-4">Browse books at the independent bookstore café, then peaceful walk through the botanical garden</p>
                                <div class="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p class="text-sm"><strong>When:</strong> Sunday 10 AM-1 PM</p>
                                        <p class="text-sm"><strong>Cost:</strong> $35 total</p>
                                        <p class="text-sm"><strong>Vibe:</strong> Quiet, intimate</p>
                                    </div>
                                    <div>
                                        <p class="text-sm"><strong>Why Perfect:</strong></p>
                                        <p class="text-sm text-gray-600">• No crowds, peaceful environment</p>
                                        <p class="text-sm text-gray-600">• Great photo opportunities for David</p>
                                    </div>
                                </div>
                                <div class="flex gap-3">
                                    <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">This Sounds Perfect</button>
                                    <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">More Quiet Options</button>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg">
                                <p class="text-sm text-gray-700"><strong>AI Insight:</strong> "This suggestion respects both partners' introverted nature while providing stimulating environments. The bookstore offers conversation topics while the garden provides David photo opportunities and Emma peaceful natural beauty - all within their budget comfort zone."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Continuous Learning -->
    <div class="py-12 sm:py-16 lg:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Gets Better Every Single Date</h2>
                <p class="text-lg sm:text-xl text-gray-600">Watch your AI relationship intelligence evolve</p>
            </div>

            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <!-- Learning Examples -->
                <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Real Learning Examples</h3>
                    <div class="space-y-6">
                        <div class="flex items-start space-x-4">
                            <div class="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-lightbulb text-blue-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">Learning from Feedback</h4>
                                <p class="text-gray-600 text-sm mb-2">"The Thai restaurant was too spicy for Sarah, but Mike loved it"</p>
                                <div class="bg-green-50 p-3 rounded-lg">
                                    <p class="text-green-800 text-sm"><strong>AI Adaptation:</strong> "Now suggests mild spice levels for Sarah but keeps ethnic cuisines Mike enjoys"</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-start space-x-4">
                            <div class="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-chart-line text-purple-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">Pattern Recognition</h4>
                                <p class="text-gray-600 text-sm mb-2">"They seem happiest after outdoor activities followed by quiet dinners"</p>
                                <div class="bg-purple-50 p-3 rounded-lg">
                                    <p class="text-purple-800 text-sm"><strong>AI Adaptation:</strong> "Now prioritizes active-to-calm activity combinations"</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-start space-x-4">
                            <div class="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-calendar-alt text-green-600"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900 mb-2">Seasonal Adaptation</h4>
                                <p class="text-gray-600 text-sm mb-2">"Winter dates focused on indoor activities got better ratings"</p>
                                <div class="bg-yellow-50 p-3 rounded-lg">
                                    <p class="text-yellow-800 text-sm"><strong>AI Adaptation:</strong> "Learned their seasonal preferences and weather sensitivity"</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Learning Progress Chart -->
                <div class="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
                    <h4 class="text-lg font-semibold text-gray-900 mb-6 text-center">Your AI's Learning Progress</h4>
                    
                    <!-- Mock Progress Chart -->
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-600">Date Success Rate</span>
                                <span class="text-green-600 font-medium">94%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-green-500 h-3 rounded-full" style="width: 94%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-600">Preference Accuracy</span>
                                <span class="text-blue-600 font-medium">87%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-blue-500 h-3 rounded-full" style="width: 87%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-600">Budget Optimization</span>
                                <span class="text-purple-600 font-medium">91%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-purple-500 h-3 rounded-full" style="width: 91%"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-gray-600">Timing Perfect Match</span>
                                <span class="text-red-600 font-medium">89%</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-3">
                                <div class="bg-red-500 h-3 rounded-full" style="width: 89%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 p-4 bg-white rounded-lg">
                        <p class="text-center text-gray-700 font-medium">
                            <i class="fas fa-trophy text-yellow-500 mr-2"></i>
                            Your AI has learned from 47 successful dates
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Social Proof -->
    <div class="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Join 50,000+ Happy Couples</h2>
                <p class="text-lg sm:text-xl text-gray-600">See what makes our suggestions so special</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="flex items-center mb-4">
                        <div class="flex -space-x-1 mr-3">
                            <div class="w-10 h-10 bg-indigo-500 rounded-full border-2 border-white"></div>
                            <div class="w-10 h-10 bg-pink-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Lisa & Carlos</p>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <blockquote class="text-gray-700 italic mb-4">
                        "The AI suggested a pottery class for our different personalities - I'm creative, he's practical. It was perfect! We made matching mugs and had the best conversations."
                    </blockquote>
                    <p class="text-sm text-gray-500">Together 3 years • Portland, OR</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="flex items-center mb-4">
                        <div class="flex -space-x-1 mr-3">
                            <div class="w-10 h-10 bg-blue-500 rounded-full border-2 border-white"></div>
                            <div class="w-10 h-10 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Marcus & Jamie</p>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <blockquote class="text-gray-700 italic mb-4">
                        "We were stuck in a rut of the same dinner-and-movie dates. The AI introduced us to rock climbing, cooking classes, even swing dancing! Our relationship feels fresh again."
                    </blockquote>
                    <p class="text-sm text-gray-500">Together 5 years • Austin, TX</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="flex items-center mb-4">
                        <div class="flex -space-x-1 mr-3">
                            <div class="w-10 h-10 bg-purple-500 rounded-full border-2 border-white"></div>
                            <div class="w-10 h-10 bg-red-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Priya & Tom</p>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <blockquote class="text-gray-700 italic mb-4">
                        "As busy doctors, we barely had time to plan dates. The AI handles everything and always suggests activities that help us decompress from work stress."
                    </blockquote>
                    <p class="text-sm text-gray-500">Together 2 years • Chicago, IL</p>
                </div>
            </div>

            <!-- Stats -->
            <div class="grid sm:grid-cols-4 gap-6 text-center">
                <div class="bg-white p-6 rounded-xl">
                    <div class="text-3xl font-bold text-purple-600 mb-2">96%</div>
                    <p class="text-gray-600">Suggestion Success Rate</p>
                </div>
                <div class="bg-white p-6 rounded-xl">
                    <div class="text-3xl font-bold text-blue-600 mb-2">4.2x</div>
                    <p class="text-gray-600">More Date Variety</p>
                </div>
                <div class="bg-white p-6 rounded-xl">
                    <div class="text-3xl font-bold text-green-600 mb-2">$47</div>
                    <p class="text-gray-600">Average Saved Per Date</p>
                </div>
                <div class="bg-white p-6 rounded-xl">
                    <div class="text-3xl font-bold text-red-600 mb-2">89%</div>
                    <p class="text-gray-600">Report Stronger Bond</p>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready for Perfectly Personalized Date Nights?
            </h2>
            <p class="text-lg sm:text-xl text-purple-100 mb-8">
                Let AI learn what makes your relationship special and suggest experiences you'll both love
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button class="w-full sm:w-auto bg-white text-purple-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
                    <i class="fas fa-brain mr-2"></i>Start Personalizing Now
                </button>
                <button class="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-purple-600 transition-colors font-semibold text-lg">
                    <i class="fas fa-magic mr-2"></i>See Demo First
                </button>
            </div>
            <p class="text-purple-100 text-sm">
                Free 7-day trial • No credit card required • Cancel anytime
            </p>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <div class="flex justify-center items-center mb-6">
                    <span class="text-2xl mr-2">💕</span>
                    <span class="text-xl font-bold">Better Together</span>
                </div>
                <p class="mb-6">AI-powered relationship experiences that grow with you</p>
                <div class="flex flex-wrap justify-center gap-6 text-sm">
                    <a href="/ai-coach.html" class="hover:text-white">AI Coach</a>
                    <a href="/smart-scheduling.html" class="hover:text-white">Smart Scheduling</a>
                    <a href="/intelligent-suggestions.html" class="text-purple-400 hover:text-purple-300">Suggestions</a>
                    <a href="/mobile-ui.html" class="hover:text-white">Mobile Design</a>
                    <a href="/" class="hover:text-white">Home</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle
            const mobileMenuButton = document.getElementById('mobileMenuButton');
            const mobileMenu = document.getElementById('mobileMenu');
            
            if (mobileMenuButton && mobileMenu) {
                mobileMenuButton.addEventListener('click', function() {
                    mobileMenu.classList.toggle('hidden');
                });
            }

            // Close mobile menu when clicking on links
            const mobileLinks = mobileMenu?.querySelectorAll('a');
            if (mobileLinks) {
                mobileLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        mobileMenu.classList.add('hidden');
                    });
                });
            }

            // Responsive behavior
            window.addEventListener('resize', function() {
                if (window.innerWidth >= 768 && mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            });

            // Touch-friendly buttons on mobile
            if (window.innerWidth <= 768) {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    button.style.minHeight = '44px';
                });
            }

            // Demo couple selection functionality
            const coupleButtons = document.querySelectorAll('.couple-btn');
            const demoContents = document.querySelectorAll('.demo-content');

            coupleButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const coupleId = this.getAttribute('data-couple');
                    
                    // Update button states
                    coupleButtons.forEach(btn => {
                        btn.classList.remove('border-blue-200', 'bg-blue-100');
                        btn.classList.add('border-transparent', 'bg-purple-50', 'hover:bg-purple-100');
                    });
                    this.classList.remove('border-transparent', 'bg-purple-50', 'hover:bg-purple-100');
                    this.classList.add('border-blue-200', 'bg-blue-100');
                    
                    // Show corresponding demo content
                    demoContents.forEach(content => {
                        content.classList.add('hidden');
                    });
                    document.getElementById(coupleId + '-results').classList.remove('hidden');
                });
            });

            // Set Sarah & Mike as default selected
            if (coupleButtons.length > 0) {
                coupleButtons[0].classList.remove('border-transparent', 'bg-purple-50', 'hover:bg-purple-100');
                coupleButtons[0].classList.add('border-blue-200', 'bg-blue-100');
            }
        });
    </script>
</body>
</html>`;