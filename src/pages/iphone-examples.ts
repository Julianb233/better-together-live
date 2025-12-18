// iPhone interaction examples showing real user scenarios
import { navigationHtml } from '../components/navigation.js';

export const iphoneExamplesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iPhone User Interactions - See Real Couples Using Better Together</title>
    <meta name="description" content="Watch real couples use Better Together on iPhone. See actual AI conversations, scheduling in action, and relationship coaching scenarios with authentic user interactions.">
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
    <style>
        /* iPhone-specific responsive classes */
        .iphone-screen {
            width: 375px;
            height: 812px;
            max-width: 100%;
        }
        @media (max-width: 640px) {
            .iphone-screen {
                width: 100%;
                height: auto;
                min-height: 600px;
            }
        }
        /* Custom animation for typing effect */
        @keyframes typing {
            from { width: 0; }
            to { width: 100%; }
        }
        .typing-animation {
            overflow: hidden;
            white-space: nowrap;
            animation: typing 2s steps(40, end);
        }
        /* Custom styles for interactive elements */
        .interaction-step {
            transition: all 0.3s ease;
        }
        .interaction-step.active {
            transform: scale(1.02);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
    </style>
</head>
<body class="bg-gray-50 overflow-x-hidden">
    ${navigationHtml}

    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-50 to-purple-50 py-12 sm:py-16 lg:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="flex justify-center mb-6">
                <div class="bg-blue-100 p-4 rounded-full">
                    <i class="fas fa-mobile-alt text-4xl text-blue-600"></i>
                </div>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                See Real Couples Using Better Together
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Watch authentic iPhone interactions showing how couples actually use AI coaching, smart scheduling, 
                and personalized suggestions to <strong>strengthen their relationships daily</strong>.
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button class="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base">
                    <i class="fas fa-play mr-2"></i>
                    Start Interactive Demo
                </button>
                <button class="w-full sm:w-auto border border-blue-600 text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm sm:text-base">
                    <i class="fas fa-download mr-2"></i>
                    Try on Your iPhone
                </button>
            </div>
        </div>
    </div>

    <!-- Scenario Selector -->
    <div class="py-12 sm:py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Choose a Real User Scenario</h2>
                <p class="text-lg sm:text-xl text-gray-600">Select a couple to see their authentic iPhone interactions</p>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <!-- Scenario 1: Busy Professionals -->
                <div class="scenario-card cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all" data-scenario="busy-professionals">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">M</span>
                        </div>
                        <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">L</span>
                        </div>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">Mike & Lisa</h3>
                    <p class="text-sm text-gray-600 mb-3">Busy professionals, NYC</p>
                    <div class="space-y-2 text-xs">
                        <div class="bg-white p-2 rounded">⏰ "Schedule date night around work"</div>
                        <div class="bg-white p-2 rounded">🤖 AI finds perfect solution</div>
                    </div>
                </div>

                <!-- Scenario 2: New Parents -->
                <div class="scenario-card cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-transparent hover:border-green-400 transition-all" data-scenario="new-parents">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">S</span>
                        </div>
                        <div class="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">J</span>
                        </div>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">Sarah & James</h3>
                    <p class="text-sm text-gray-600 mb-3">New parents, Austin TX</p>
                    <div class="space-y-2 text-xs">
                        <div class="bg-white p-2 rounded">👶 "Need couple time with baby"</div>
                        <div class="bg-white p-2 rounded">💡 AI suggests solutions</div>
                    </div>
                </div>

                <!-- Scenario 3: Long Distance -->
                <div class="scenario-card cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-transparent hover:border-purple-400 transition-all" data-scenario="long-distance">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">A</span>
                        </div>
                        <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">C</span>
                        </div>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">Alex & Casey</h3>
                    <p class="text-sm text-gray-600 mb-3">Long-distance couple</p>
                    <div class="space-y-2 text-xs">
                        <div class="bg-white p-2 rounded">✈️ "Plan visit across time zones"</div>
                        <div class="bg-white p-2 rounded">📅 Smart scheduling magic</div>
                    </div>
                </div>

                <!-- Scenario 4: Anniversary Planning -->
                <div class="scenario-card cursor-pointer bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-transparent hover:border-yellow-400 transition-all" data-scenario="anniversary">
                    <div class="flex items-center space-x-3 mb-4">
                        <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">D</span>
                        </div>
                        <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                            <span class="text-white font-bold">R</span>
                        </div>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-2">David & Rachel</h3>
                    <p class="text-sm text-gray-600 mb-3">5-year anniversary</p>
                    <div class="space-y-2 text-xs">
                        <div class="bg-white p-2 rounded">💍 "Perfect anniversary surprise"</div>
                        <div class="bg-white p-2 rounded">✨ AI creates magic</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Interactive iPhone Demo Container -->
    <div class="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <!-- Scenario 1: Busy Professionals -->
            <div id="busy-professionals-demo" class="scenario-demo">
                <div class="text-center mb-12">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Mike & Lisa: Busy Professionals in NYC</h2>
                    <p class="text-lg text-gray-600">Watch how AI helps two lawyers with 70-hour work weeks maintain their relationship</p>
                </div>

                <div class="grid lg:grid-cols-2 gap-12 items-start">
                    <!-- iPhone Mockup -->
                    <div class="flex justify-center">
                        <div class="relative iphone-screen bg-black rounded-[3rem] p-3 shadow-2xl">
                            <!-- iPhone Screen -->
                            <div class="bg-white rounded-[2.5rem] h-full overflow-hidden relative">
                                <!-- Status Bar -->
                                <div class="bg-black text-white text-xs px-6 py-2 flex justify-between items-center rounded-t-[2.5rem]">
                                    <span>9:23 AM</span>
                                    <div class="flex items-center space-x-1">
                                        <i class="fas fa-signal"></i>
                                        <i class="fas fa-wifi"></i>
                                        <i class="fas fa-battery-full"></i>
                                    </div>
                                </div>

                                <!-- App Interface -->
                                <div class="h-full bg-white">
                                    <!-- Header -->
                                    <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                                        <div class="flex items-center justify-between">
                                            <h1 class="text-lg font-semibold">Better Together</h1>
                                            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                                <i class="fas fa-heart text-sm"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Chat Interface -->
                                    <div class="p-4 space-y-4 h-full overflow-y-auto pb-20" id="chat-container-1">
                                        <!-- Step 1: User message -->
                                        <div class="flex justify-end demo-step" data-step="1" style="display: none;">
                                            <div class="bg-blue-500 text-white p-3 rounded-2xl max-w-xs">
                                                <p class="text-sm">We haven't had a date night in 3 weeks 😔 Lisa's working late again and I'm in court all day tomorrow. Can you help us find some time together?</p>
                                                <span class="text-xs text-blue-200">9:23 AM</span>
                                            </div>
                                        </div>

                                        <!-- Step 2: AI thinking -->
                                        <div class="flex justify-start demo-step" data-step="2" style="display: none;">
                                            <div class="bg-gray-100 p-3 rounded-2xl max-w-xs">
                                                <div class="flex items-center space-x-2">
                                                    <div class="flex space-x-1">
                                                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                                                        <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                                                    </div>
                                                    <span class="text-xs text-gray-500">Analyzing calendars...</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Step 3: AI analysis -->
                                        <div class="flex justify-start demo-step" data-step="3" style="display: none;">
                                            <div class="bg-gray-100 p-3 rounded-2xl max-w-xs">
                                                <p class="text-sm">I found some opportunities! 📊</p>
                                                <div class="mt-2 text-xs space-y-1">
                                                    <div>📅 Both free Thursday 7-9 PM</div>
                                                    <div>📅 Saturday morning slot available</div>
                                                    <div>📍 3 restaurants near Lisa's office</div>
                                                </div>
                                                <span class="text-xs text-gray-500">9:24 AM</span>
                                            </div>
                                        </div>

                                        <!-- Step 4: AI suggestion -->
                                        <div class="flex justify-start demo-step" data-step="4" style="display: none;">
                                            <div class="bg-purple-100 border-l-4 border-purple-500 p-3 rounded-r-2xl max-w-xs">
                                                <h4 class="font-semibold text-purple-900 text-sm">Perfect Solution Found! ✨</h4>
                                                <div class="mt-2 space-y-2">
                                                    <div class="bg-white p-2 rounded-lg">
                                                        <p class="font-medium text-sm">🍝 Romano's Italian Bistro</p>
                                                        <p class="text-xs text-gray-600">Thursday 7:30 PM • 5 min from Lisa's office</p>
                                                        <p class="text-xs text-green-600">Table reserved! ✓</p>
                                                    </div>
                                                    <div class="bg-white p-2 rounded-lg">
                                                        <p class="text-xs">📱 Added to both calendars</p>
                                                        <p class="text-xs">🚗 Uber scheduled for Lisa</p>
                                                        <p class="text-xs">💐 Surprise flowers ordered</p>
                                                    </div>
                                                </div>
                                                <span class="text-xs text-gray-500">9:25 AM</span>
                                            </div>
                                        </div>

                                        <!-- Step 5: User response -->
                                        <div class="flex justify-end demo-step" data-step="5" style="display: none;">
                                            <div class="bg-blue-500 text-white p-3 rounded-2xl max-w-xs">
                                                <p class="text-sm">This is AMAZING! 🤩 You even thought of flowers? Lisa is going to love this. Thank you!</p>
                                                <span class="text-xs text-blue-200">9:26 AM</span>
                                            </div>
                                        </div>

                                        <!-- Step 6: AI follow-up -->
                                        <div class="flex justify-start demo-step" data-step="6" style="display: none;">
                                            <div class="bg-gray-100 p-3 rounded-2xl max-w-xs">
                                                <p class="text-sm">You're welcome! 💕 I also set a reminder for next week to check in about your next date. Building regular couple time is key for busy professionals like you two!</p>
                                                <div class="mt-2 text-xs bg-yellow-50 p-2 rounded">
                                                    <p>💡 <strong>Pro tip:</strong> I noticed you both rate Italian food highly. Want me to find a cooking class you could do together at home next weekend?</p>
                                                </div>
                                                <span class="text-xs text-gray-500">9:27 AM</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Message Input -->
                                    <div class="absolute bottom-0 left-0 right-0 bg-white border-t p-3">
                                        <div class="flex items-center space-x-2">
                                            <input type="text" placeholder="Message..." class="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm">
                                            <button class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                                <i class="fas fa-arrow-up text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Interaction Timeline -->
                    <div class="space-y-6">
                        <div class="bg-white p-6 rounded-xl shadow-sm">
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">What's Happening Behind the Scenes</h3>
                            <div class="space-y-4" id="timeline-1">
                                <div class="timeline-step opacity-50" data-step="1">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span class="text-blue-600 font-bold text-sm">1</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">User Request Analysis</h4>
                                            <p class="text-sm text-gray-600">AI detects frustration and relationship maintenance need</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="2">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <span class="text-purple-600 font-bold text-sm">2</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Smart Calendar Integration</h4>
                                            <p class="text-sm text-gray-600">Analyzes both Google Calendars, work patterns, commute times</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="3">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span class="text-green-600 font-bold text-sm">3</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Personalized Location Intelligence</h4>
                                            <p class="text-sm text-gray-600">Uses previous preferences, location data, and reviews</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="4">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <span class="text-yellow-600 font-bold text-sm">4</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Automatic Booking & Coordination</h4>
                                            <p class="text-sm text-gray-600">Reserves table, schedules transport, orders surprise element</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="5">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                            <span class="text-red-600 font-bold text-sm">5</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Calendar Synchronization</h4>
                                            <p class="text-sm text-gray-600">Adds events to both calendars with preparation reminders</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="6">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span class="text-indigo-600 font-bold text-sm">6</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Proactive Relationship Building</h4>
                                            <p class="text-sm text-gray-600">Suggests next steps and maintains relationship momentum</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Play Button -->
                        <div class="text-center">
                            <button id="play-demo-1" class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                <i class="fas fa-play mr-2"></i>Watch This Interaction
                            </button>
                            <p class="text-sm text-gray-600 mt-2">2 minute interactive demo</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scenario 2: New Parents -->
            <div id="new-parents-demo" class="scenario-demo hidden">
                <div class="text-center mb-12">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Sarah & James: New Parents Finding Balance</h2>
                    <p class="text-lg text-gray-600">See how AI helps exhausted parents maintain their romantic connection</p>
                </div>

                <div class="grid lg:grid-cols-2 gap-12 items-start">
                    <!-- iPhone Mockup for New Parents -->
                    <div class="flex justify-center">
                        <div class="relative iphone-screen bg-black rounded-[3rem] p-3 shadow-2xl">
                            <div class="bg-white rounded-[2.5rem] h-full overflow-hidden relative">
                                <!-- Status Bar -->
                                <div class="bg-black text-white text-xs px-6 py-2 flex justify-between items-center rounded-t-[2.5rem]">
                                    <span>2:15 AM</span>
                                    <div class="flex items-center space-x-1">
                                        <i class="fas fa-signal"></i>
                                        <i class="fas fa-wifi"></i>
                                        <i class="fas fa-battery-half"></i>
                                    </div>
                                </div>

                                <!-- App Interface -->
                                <div class="h-full bg-white">
                                    <!-- Header -->
                                    <div class="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4">
                                        <div class="flex items-center justify-between">
                                            <h1 class="text-lg font-semibold">Better Together</h1>
                                            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                                <i class="fas fa-baby text-sm"></i>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Chat Interface -->
                                    <div class="p-4 space-y-4 h-full overflow-y-auto pb-20" id="chat-container-2">
                                        <!-- Step 1: Sarah's late night message -->
                                        <div class="flex justify-end demo-step" data-step="1" style="display: none;">
                                            <div class="bg-green-500 text-white p-3 rounded-2xl max-w-xs">
                                                <p class="text-sm">Up feeding Emma again 😴 James and I barely talk anymore except about diapers and sleep schedules. We're losing ourselves as a couple...</p>
                                                <span class="text-xs text-green-200">2:15 AM</span>
                                            </div>
                                        </div>

                                        <!-- Step 2: AI empathetic response -->
                                        <div class="flex justify-start demo-step" data-step="2" style="display: none;">
                                            <div class="bg-pink-100 p-3 rounded-2xl max-w-xs">
                                                <p class="text-sm">Sarah, this is so normal for new parents ❤️ Let me help you and James reconnect even with Emma's schedule. I have some ideas that work specifically for couples with newborns.</p>
                                                <span class="text-xs text-gray-500">2:16 AM</span>
                                            </div>
                                        </div>

                                        <!-- Step 3: AI suggestions -->
                                        <div class="flex justify-start demo-step" data-step="3" style="display: none;">
                                            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r-2xl max-w-xs">
                                                <h4 class="font-semibold text-gray-900 text-sm">Baby-Friendly Connection Ideas 👶</h4>
                                                <div class="mt-2 space-y-2">
                                                    <div class="bg-white p-2 rounded">
                                                        <p class="text-xs font-medium">🏠 At-Home Date Night</p>
                                                        <p class="text-xs text-gray-600">During Emma's 7-9 PM sleep window</p>
                                                    </div>
                                                    <div class="bg-white p-2 rounded">
                                                        <p class="text-xs font-medium">☕ Morning Connection Ritual</p>
                                                        <p class="text-xs text-gray-600">15 minutes before Emma wakes</p>
                                                    </div>
                                                    <div class="bg-white p-2 rounded">
                                                        <p class="text-xs font-medium">👨‍👩‍👧 Family Activities</p>
                                                        <p class="text-xs text-gray-600">Bond while including Emma</p>
                                                    </div>
                                                </div>
                                                <span class="text-xs text-gray-500">2:17 AM</span>
                                            </div>
                                        </div>

                                        <!-- Step 4: Specific plan -->
                                        <div class="flex justify-start demo-step" data-step="4" style="display: none;">
                                            <div class="bg-purple-100 p-3 rounded-2xl max-w-xs">
                                                <h4 class="font-semibold text-purple-900 text-sm">This Week's Plan ✨</h4>
                                                <div class="mt-2 space-y-2 text-xs">
                                                    <div class="bg-white p-2 rounded">
                                                        <strong>Tonight:</strong> Order takeout from your favorite Thai place, eat by candlelight after Emma's 7 PM feed
                                                    </div>
                                                    <div class="bg-white p-2 rounded">
                                                        <strong>Tomorrow:</strong> 15-minute coffee together at 6:30 AM (I'll set gentle alarms)
                                                    </div>
                                                    <div class="bg-white p-2 rounded">
                                                        <strong>Weekend:</strong> Baby-wearing walk through the park you loved pre-Emma
                                                    </div>
                                                </div>
                                                <span class="text-xs text-gray-500">2:18 AM</span>
                                            </div>
                                        </div>

                                        <!-- Step 5: Sarah's relieved response -->
                                        <div class="flex justify-end demo-step" data-step="5" style="display: none;">
                                            <div class="bg-green-500 text-white p-3 rounded-2xl max-w-xs">
                                                <p class="text-sm">This gives me hope 🥺 I was worried we'd never be "us" again. James will love the Thai food idea - it's where we had our first date!</p>
                                                <span class="text-xs text-green-200">2:19 AM</span>
                                            </div>
                                        </div>

                                        <!-- Step 6: AI encouragement -->
                                        <div class="flex justify-start demo-step" data-step="6" style="display: none;">
                                            <div class="bg-gray-100 p-3 rounded-2xl max-w-xs">
                                                <p class="text-sm">You two are still "you" - just evolving into an even stronger version! 💕 I've added these plans to both your calendars and will send gentle reminders. Emma is lucky to have parents who prioritize their love.</p>
                                                <div class="mt-2 text-xs bg-green-50 p-2 rounded">
                                                    <p>💡 <strong>New parent tip:</strong> I'll check in weekly with baby-phase appropriate suggestions. This season is temporary, but your love is forever!</p>
                                                </div>
                                                <span class="text-xs text-gray-500">2:20 AM</span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Message Input -->
                                    <div class="absolute bottom-0 left-0 right-0 bg-white border-t p-3">
                                        <div class="flex items-center space-x-2">
                                            <input type="text" placeholder="Message..." class="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm">
                                            <button class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                                <i class="fas fa-arrow-up text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- New Parents Timeline -->
                    <div class="space-y-6">
                        <div class="bg-white p-6 rounded-xl shadow-sm">
                            <h3 class="text-xl font-semibold text-gray-900 mb-4">AI Adapts to Life Stages</h3>
                            <div class="space-y-4" id="timeline-2">
                                <div class="timeline-step opacity-50" data-step="1">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                            <span class="text-pink-600 font-bold text-sm">1</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Emotional Context Recognition</h4>
                                            <p class="text-sm text-gray-600">Detects new parent exhaustion and relationship strain patterns</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="2">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span class="text-green-600 font-bold text-sm">2</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Life Stage Optimization</h4>
                                            <p class="text-sm text-gray-600">Adapts suggestions for baby schedules and energy levels</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="3">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <span class="text-yellow-600 font-bold text-sm">3</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Realistic Activity Matching</h4>
                                            <p class="text-sm text-gray-600">Only suggests activities that work with newborn constraints</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="4">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <span class="text-purple-600 font-bold text-sm">4</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Memory & History Integration</h4>
                                            <p class="text-sm text-gray-600">References pre-baby relationship memories for continuity</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="5">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span class="text-indigo-600 font-bold text-sm">5</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Gentle Momentum Building</h4>
                                            <p class="text-sm text-gray-600">Small, achievable steps that rebuild connection gradually</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="timeline-step opacity-50" data-step="6">
                                    <div class="flex items-start space-x-3">
                                        <div class="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                                            <span class="text-teal-600 font-bold text-sm">6</span>
                                        </div>
                                        <div>
                                            <h4 class="font-medium text-gray-900">Long-term Relationship Vision</h4>
                                            <p class="text-sm text-gray-600">Maintains hope and perspective during difficult transition periods</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Play Button -->
                        <div class="text-center">
                            <button id="play-demo-2" class="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                <i class="fas fa-play mr-2"></i>Watch This Interaction
                            </button>
                            <p class="text-sm text-gray-600 mt-2">2 minute interactive demo</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Additional scenarios would follow the same pattern... -->
            
        </div>
    </div>

    <!-- Real Impact Results -->
    <div class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Real Results from iPhone Users</h2>
                <p class="text-lg text-gray-600">These couples saw these improvements in just 30 days</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-calendar-check text-2xl text-blue-600"></i>
                    </div>
                    <div class="text-3xl font-bold text-gray-900 mb-2">3.2x</div>
                    <p class="text-gray-600">More quality time together</p>
                    <p class="text-xs text-gray-500 mt-2">From 2.3 hrs to 7.4 hrs per week</p>
                </div>

                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-heart text-2xl text-green-600"></i>
                    </div>
                    <div class="text-3xl font-bold text-gray-900 mb-2">89%</div>
                    <p class="text-gray-600">Feel more emotionally connected</p>
                    <p class="text-xs text-gray-500 mt-2">Based on daily check-in scores</p>
                </div>

                <div class="text-center">
                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-clock text-2xl text-purple-600"></i>
                    </div>
                    <div class="text-3xl font-bold text-gray-900 mb-2">6.5 hrs</div>
                    <p class="text-gray-600">Saved per week on planning</p>
                    <p class="text-xs text-gray-500 mt-2">More time for actual connection</p>
                </div>

                <div class="text-center">
                    <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-star text-2xl text-pink-600"></i>
                    </div>
                    <div class="text-3xl font-bold text-gray-900 mb-2">94%</div>
                    <p class="text-gray-600">Say it improved their relationship</p>
                    <p class="text-xs text-gray-500 mt-2">30-day follow-up survey</p>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Experience This on Your iPhone?
            </h2>
            <p class="text-lg sm:text-xl text-blue-100 mb-8">
                Join thousands of couples who are building stronger relationships with AI-powered coaching and smart scheduling
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button class="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
                    <i class="fab fa-apple mr-2"></i>Try on Your iPhone Now
                </button>
                <button class="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg">
                    <i class="fas fa-play mr-2"></i>Watch More Examples
                </button>
            </div>
            <p class="text-blue-100 text-sm">
                Works on iPhone 12 and later • iOS 15+ required • 7-day free trial
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
                <p class="mb-6">Real couples. Real conversations. Real results.</p>
                <div class="flex flex-wrap justify-center gap-6 text-sm">
                    <a href="/ai-coach.html" class="hover:text-white">AI Coach</a>
                    <a href="/smart-scheduling.html" class="hover:text-white">Smart Scheduling</a>
                    <a href="/intelligent-suggestions.html" class="hover:text-white">Suggestions</a>
                    <a href="/mobile-ui.html" class="hover:text-white">Mobile Design</a>
                    <a href="/iphone-examples.html" class="text-blue-400 hover:text-blue-300">Live Examples</a>
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

            // Scenario selection functionality
            const scenarioCards = document.querySelectorAll('.scenario-card');
            const scenarioDemos = document.querySelectorAll('.scenario-demo');

            scenarioCards.forEach(card => {
                card.addEventListener('click', function() {
                    const scenario = this.getAttribute('data-scenario');
                    
                    // Update card states
                    scenarioCards.forEach(c => {
                        c.classList.remove('border-blue-400', 'bg-blue-100');
                        c.classList.add('border-transparent');
                    });
                    this.classList.add('border-blue-400');
                    
                    // Show corresponding demo
                    scenarioDemos.forEach(demo => {
                        demo.classList.add('hidden');
                    });
                    
                    const targetDemo = document.getElementById(scenario + '-demo');
                    if (targetDemo) {
                        targetDemo.classList.remove('hidden');
                    }
                });
            });

            // Interactive demo functionality
            function playDemo(demoNumber) {
                const chatContainer = document.getElementById('chat-container-' + demoNumber);
                const timeline = document.getElementById('timeline-' + demoNumber);
                const steps = chatContainer.querySelectorAll('.demo-step');
                const timelineSteps = timeline.querySelectorAll('.timeline-step');
                
                // Reset all steps
                steps.forEach(step => {
                    step.style.display = 'none';
                    step.classList.remove('active');
                });
                timelineSteps.forEach(step => {
                    step.classList.remove('opacity-100');
                    step.classList.add('opacity-50');
                });
                
                let currentStep = 0;
                
                function showNextStep() {
                    if (currentStep < steps.length) {
                        const step = steps[currentStep];
                        const timelineStep = timelineSteps[currentStep];
                        
                        step.style.display = 'flex';
                        step.classList.add('active');
                        
                        if (timelineStep) {
                            timelineStep.classList.remove('opacity-50');
                            timelineStep.classList.add('opacity-100');
                        }
                        
                        // Scroll chat to bottom
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                        
                        currentStep++;
                        
                        // Different timing for different steps
                        let delay = 2000; // Default 2 seconds
                        if (currentStep === 2) delay = 3000; // AI thinking takes longer
                        if (currentStep === 4) delay = 4000; // Complex suggestions take longer
                        
                        if (currentStep < steps.length) {
                            setTimeout(showNextStep, delay);
                        }
                    }
                }
                
                showNextStep();
            }

            // Play demo buttons
            document.getElementById('play-demo-1')?.addEventListener('click', function() {
                playDemo(1);
                this.innerHTML = '<i class="fas fa-refresh mr-2"></i>Replay Interaction';
            });

            document.getElementById('play-demo-2')?.addEventListener('click', function() {
                playDemo(2);
                this.innerHTML = '<i class="fas fa-refresh mr-2"></i>Replay Interaction';
            });

            // Set default scenario (busy professionals)
            if (scenarioCards.length > 0) {
                scenarioCards[0].click();
            }

            // Touch-friendly buttons on mobile
            if (window.innerWidth <= 768) {
                const buttons = document.querySelectorAll('button');
                buttons.forEach(button => {
                    button.style.minHeight = '44px';
                });
            }
        });
    </script>
</body>
</html>`;