// Smart Scheduling comprehensive feature page
import { navigationHtml } from '../components/navigation.js';

export const smartSchedulingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart AI Scheduling - Never Miss Date Night Again | Better Together</title>
    <meta name="description" content="AI automatically finds perfect times, books activities, and adds thoughtful reminders to both calendars. Save 5+ hours per week on relationship planning.">
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
                </div>
            </div>
            <!-- Mobile Menu -->
            <div id="mobileMenu" class="hidden md:hidden pb-4">
                <div class="flex flex-col space-y-3">
                    <a href="/ai-coach.html" class="text-gray-600 hover:text-gray-900 transition-colors py-2">AI Coach</a>
                    <a href="/smart-scheduling.html" class="text-primary-600 font-medium py-2">Smart Scheduling</a>
                    <a href="/intelligent-suggestions.html" class="text-gray-600 hover:text-gray-900 transition-colors py-2">Suggestions</a>
                    <a href="/mobile-ui.html" class="text-gray-600 hover:text-gray-900 transition-colors py-2">Mobile Design</a>
                    <a href="/" class="bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors w-full text-center">
                        Get Started
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-green-50 to-blue-50 py-12 sm:py-16 lg:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="flex justify-center mb-6">
                <div class="bg-green-100 p-4 rounded-full">
                    <i class="fas fa-calendar-check text-4xl text-green-600"></i>
                </div>
            </div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Never Fight About Scheduling Again
            </h1>
            <p class="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                AI finds perfect times for both of you, books everything automatically, and adds thoughtful reminders. 
                <strong>Save 5+ hours per week</strong> while building stronger connections.
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button class="w-full sm:w-auto bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base">
                    <i class="fas fa-magic mr-2"></i>
                    See AI Scheduling Demo
                </button>
                <button class="w-full sm:w-auto border border-green-600 text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm sm:text-base">
                    <i class="fas fa-clock mr-2"></i>
                    Try Free for 7 Days
                </button>
            </div>
        </div>
    </div>

    <!-- Problem & Solution -->
    <div class="py-12 sm:py-16 lg:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <!-- Problem -->
                <div>
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Stop the Scheduling Struggle</h2>
                    <div class="space-y-4 mb-8">
                        <div class="flex items-start space-x-4 p-4 bg-red-50 rounded-lg">
                            <i class="fas fa-times-circle text-red-500 mt-1 flex-shrink-0"></i>
                            <div>
                                <h3 class="font-semibold text-red-800">Hours Wasted Planning</h3>
                                <p class="text-red-700 text-sm">Spending weekends researching restaurants, checking calendars, coordinating schedules</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg">
                            <i class="fas fa-times-circle text-yellow-500 mt-1 flex-shrink-0"></i>
                            <div>
                                <h3 class="font-semibold text-yellow-800">Missed Opportunities</h3>
                                <p class="text-yellow-700 text-sm">Great events sell out while you're "trying to find time"</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                            <i class="fas fa-times-circle text-blue-500 mt-1 flex-shrink-0"></i>
                            <div>
                                <h3 class="font-semibold text-blue-800">Calendar Conflicts</h3>
                                <p class="text-blue-700 text-sm">Double bookings, forgotten commitments, scheduling stress</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Solution -->
                <div>
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">AI Does It All Automatically</h2>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                            <i class="fas fa-check-circle text-green-500 mt-1 flex-shrink-0"></i>
                            <div>
                                <h3 class="font-semibold text-green-800">Smart Time Finding</h3>
                                <p class="text-green-700 text-sm">AI analyzes both calendars and finds optimal free time automatically</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                            <i class="fas fa-check-circle text-blue-500 mt-1 flex-shrink-0"></i>
                            <div>
                                <h3 class="font-semibold text-blue-800">Automatic Booking</h3>
                                <p class="text-blue-700 text-sm">Reserves tables, buys tickets, books classes—all with your approval</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                            <i class="fas fa-check-circle text-purple-500 mt-1 flex-shrink-0"></i>
                            <div>
                                <h3 class="font-semibold text-purple-800">Thoughtful Reminders</h3>
                                <p class="text-purple-700 text-sm">Contextual notifications with prep tips and surprise elements</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Live Demo Section -->
    <div class="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">See It In Action</h2>
                <p class="text-lg sm:text-xl text-gray-600">Watch AI schedule a perfect date night in real-time</p>
            </div>

            <!-- Demo Container -->
            <div class="bg-white rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto">
                <div class="flex items-center justify-between mb-6">
                    <div class="flex items-center space-x-3">
                        <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span class="text-sm text-gray-500">AI Scheduling Assistant</span>
                </div>

                <!-- Demo Steps -->
                <div class="space-y-6">
                    <!-- Step 1: Request -->
                    <div class="flex items-start space-x-4">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-user text-blue-600"></i>
                        </div>
                        <div class="flex-1">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <p class="text-gray-800">"Can you plan a romantic dinner for Sarah and me this Friday? Something special since it's our anniversary month."</p>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: AI Analysis -->
                    <div class="flex items-start space-x-4">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-robot text-green-600"></i>
                        </div>
                        <div class="flex-1">
                            <div class="bg-green-50 p-4 rounded-lg">
                                <p class="text-gray-800 font-medium mb-3">🤖 Analyzing schedules and preferences...</p>
                                <div class="grid sm:grid-cols-2 gap-4 text-sm">
                                    <div class="space-y-2">
                                        <div class="flex items-center"><i class="fas fa-calendar mr-2 text-green-600"></i> Both free Friday 7-10 PM</div>
                                        <div class="flex items-center"><i class="fas fa-map-marker mr-2 text-blue-600"></i> Downtown area preferred</div>
                                        <div class="flex items-center"><i class="fas fa-heart mr-2 text-red-500"></i> Italian cuisine (Sarah's favorite)</div>
                                    </div>
                                    <div class="space-y-2">
                                        <div class="flex items-center"><i class="fas fa-dollar-sign mr-2 text-yellow-600"></i> $80-120 budget range</div>
                                        <div class="flex items-center"><i class="fas fa-cloud mr-2 text-gray-500"></i> Clear weather forecast</div>
                                        <div class="flex items-center"><i class="fas fa-star mr-2 text-purple-600"></i> Anniversary significance</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: AI Recommendation -->
                    <div class="flex items-start space-x-4">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-robot text-green-600"></i>
                        </div>
                        <div class="flex-1">
                            <div class="bg-green-50 p-4 rounded-lg">
                                <p class="text-gray-800 font-medium mb-4">Perfect! I found the ideal evening:</p>
                                
                                <div class="bg-white p-4 rounded-lg border border-green-200 mb-4">
                                    <h4 class="font-bold text-gray-900 mb-2">🍝 Bella Vista Rooftop</h4>
                                    <div class="grid sm:grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p><strong>Time:</strong> Friday 7:30 PM</p>
                                            <p><strong>Table:</strong> Corner window seat</p>
                                            <p><strong>Special:</strong> Anniversary dessert included</p>
                                        </div>
                                        <div>
                                            <p><strong>Rating:</strong> 4.8/5 ⭐⭐⭐⭐⭐</p>
                                            <p><strong>Price:</strong> $95 for two</p>
                                            <p><strong>Ambiance:</strong> Romantic, city views</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col sm:flex-row gap-3">
                                    <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex-1">
                                        <i class="fas fa-check mr-2"></i>Book This Perfect Evening
                                    </button>
                                    <button class="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                                        Show Other Options
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: Confirmation -->
                    <div class="flex items-start space-x-4">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <i class="fas fa-robot text-green-600"></i>
                        </div>
                        <div class="flex-1">
                            <div class="bg-green-50 p-4 rounded-lg">
                                <p class="text-gray-800 font-medium mb-3">🎉 All set! I've taken care of everything:</p>
                                <div class="space-y-2 text-sm">
                                    <div class="flex items-center"><i class="fas fa-check text-green-600 mr-2"></i> Reserved corner table for 7:30 PM</div>
                                    <div class="flex items-center"><i class="fas fa-check text-green-600 mr-2"></i> Added to both calendars with prep reminders</div>
                                    <div class="flex items-center"><i class="fas fa-check text-green-600 mr-2"></i> Requested anniversary dessert surprise</div>
                                    <div class="flex items-center"><i class="fas fa-check text-green-600 mr-2"></i> Sent Sarah a sweet "looking forward to tonight" message</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p class="text-center text-blue-800 font-medium">
                        <i class="fas fa-clock mr-2"></i>Total time saved: 2.5 hours of research and coordination
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Calendar Integration -->
    <div class="py-12 sm:py-16 lg:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Works With Your Existing Calendars</h2>
                <p class="text-lg sm:text-xl text-gray-600">Seamless integration with all major calendar platforms</p>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                    <i class="fab fa-google text-4xl text-blue-600 mb-4"></i>
                    <h3 class="font-semibold text-gray-900">Google Calendar</h3>
                    <p class="text-sm text-gray-600 mt-2">Full two-way sync</p>
                </div>
                <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
                    <i class="fab fa-microsoft text-4xl text-purple-600 mb-4"></i>
                    <h3 class="font-semibold text-gray-900">Outlook</h3>
                    <p class="text-sm text-gray-600 mt-2">Enterprise ready</p>
                </div>
                <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl text-center">
                    <i class="fab fa-apple text-4xl text-gray-700 mb-4"></i>
                    <h3 class="font-semibold text-gray-900">Apple Calendar</h3>
                    <p class="text-sm text-gray-600 mt-2">Native iOS integration</p>
                </div>
                <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
                    <i class="fas fa-plus text-4xl text-green-600 mb-4"></i>
                    <h3 class="font-semibold text-gray-900">And More</h3>
                    <p class="text-sm text-gray-600 mt-2">15+ integrations</p>
                </div>
            </div>

            <!-- Sample Calendar View -->
            <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-900">This Week - Shared Calendar View</h3>
                </div>
                <div class="p-6">
                    <div class="grid grid-cols-7 gap-2 mb-4">
                        <div class="text-center text-sm font-medium text-gray-600 py-2">Sun</div>
                        <div class="text-center text-sm font-medium text-gray-600 py-2">Mon</div>
                        <div class="text-center text-sm font-medium text-gray-600 py-2">Tue</div>
                        <div class="text-center text-sm font-medium text-gray-600 py-2">Wed</div>
                        <div class="text-center text-sm font-medium text-gray-600 py-2">Thu</div>
                        <div class="text-center text-sm font-medium text-gray-600 py-2">Fri</div>
                        <div class="text-center text-sm font-medium text-gray-600 py-2">Sat</div>
                    </div>
                    <div class="grid grid-cols-7 gap-2">
                        <div class="h-24 p-2 text-sm">
                            <div class="text-gray-400">15</div>
                        </div>
                        <div class="h-24 p-2 text-sm">
                            <div class="text-gray-900 font-medium">16</div>
                            <div class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs mt-1">Work mtg</div>
                        </div>
                        <div class="h-24 p-2 text-sm">
                            <div class="text-gray-900 font-medium">17</div>
                            <div class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mt-1">Gym</div>
                        </div>
                        <div class="h-24 p-2 text-sm">
                            <div class="text-gray-900 font-medium">18</div>
                        </div>
                        <div class="h-24 p-2 text-sm">
                            <div class="text-gray-900 font-medium">19</div>
                            <div class="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs mt-1">Date Night ❤️</div>
                        </div>
                        <div class="h-24 p-2 text-sm">
                            <div class="text-gray-900 font-medium">20</div>
                            <div class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mt-1">Cooking Class</div>
                        </div>
                        <div class="h-24 p-2 text-sm">
                            <div class="text-gray-900 font-medium">21</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Smart Features -->
    <div class="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Beyond Basic Scheduling</h2>
                <p class="text-lg sm:text-xl text-gray-600">AI that understands relationships, not just calendars</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Weather Intelligence -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-cloud-sun text-blue-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Weather-Smart Planning</h3>
                    <p class="text-gray-600 mb-4">Automatically adjusts outdoor plans based on weather forecasts and suggests indoor alternatives.</p>
                    <div class="bg-blue-50 p-3 rounded-lg text-sm">
                        <p class="text-blue-800"><i class="fas fa-umbrella mr-2"></i>"Rain expected Saturday - switched to indoor rock climbing instead of hiking"</p>
                    </div>
                </div>

                <!-- Stress Level Analysis -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-heart-pulse text-green-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Stress-Level Optimization</h3>
                    <p class="text-gray-600 mb-4">Analyzes both partners' schedules to suggest relaxing activities during stressful periods.</p>
                    <div class="bg-green-50 p-3 rounded-lg text-sm">
                        <p class="text-green-800"><i class="fas fa-leaf mr-2"></i>"Detected high work stress - suggesting spa evening instead of party"</p>
                    </div>
                </div>

                <!-- Location Intelligence -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-map-marked-alt text-purple-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Location Optimization</h3>
                    <p class="text-gray-600 mb-4">Considers traffic patterns, parking, and commute times to pick optimal locations and timing.</p>
                    <div class="bg-purple-50 p-3 rounded-lg text-sm">
                        <p class="text-purple-800"><i class="fas fa-route mr-2"></i>"Moved dinner 30 min earlier to avoid downtown traffic"</p>
                    </div>
                </div>

                <!-- Budget Awareness -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-dollar-sign text-yellow-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Budget-Smart Suggestions</h3>
                    <p class="text-gray-600 mb-4">Tracks spending patterns and suggests activities within your comfort zone.</p>
                    <div class="bg-yellow-50 p-3 rounded-lg text-sm">
                        <p class="text-yellow-800"><i class="fas fa-piggy-bank mr-2"></i>"Found similar restaurant with 30% better value"</p>
                    </div>
                </div>

                <!-- Energy Matching -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-battery-three-quarters text-red-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Energy Level Matching</h3>
                    <p class="text-gray-600 mb-4">Suggests high or low-energy activities based on recent schedules and preferences.</p>
                    <div class="bg-red-50 p-3 rounded-lg text-sm">
                        <p class="text-red-800"><i class="fas fa-couch mr-2"></i>"Both had busy weeks - suggesting movie night at home"</p>
                    </div>
                </div>

                <!-- Relationship Milestones -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-heart text-pink-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Milestone Awareness</h3>
                    <p class="text-gray-600 mb-4">Remembers important dates and automatically plans special celebrations.</p>
                    <div class="bg-pink-50 p-3 rounded-lg text-sm">
                        <p class="text-pink-800"><i class="fas fa-calendar-heart mr-2"></i>"6-month anniversary next week - planning surprise dinner"</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Success Stories -->
    <div class="py-12 sm:py-16 lg:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Real Results from Real Couples</h2>
                <p class="text-lg sm:text-xl text-gray-600">See how smart scheduling transformed their relationships</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-green-50 p-6 rounded-xl">
                    <div class="flex items-center mb-4">
                        <div class="flex -space-x-1 mr-3">
                            <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span class="text-white text-sm font-bold">M</span>
                            </div>
                            <div class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span class="text-white text-sm font-bold">J</span>
                            </div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Mike & Jessica</p>
                            <p class="text-sm text-gray-600">Together 2 years</p>
                        </div>
                    </div>
                    <blockquote class="text-gray-700 italic mb-4">
                        "We went from constantly arguing about plans to having amazing dates every week. The AI knows us better than we know ourselves!"
                    </blockquote>
                    <div class="bg-white p-3 rounded-lg">
                        <p class="text-green-800 font-medium text-sm">✅ 12 perfect dates planned this month</p>
                        <p class="text-green-800 font-medium text-sm">✅ 8 hours/week saved on planning</p>
                        <p class="text-green-800 font-medium text-sm">✅ 0 scheduling arguments since starting</p>
                    </div>
                </div>

                <div class="bg-blue-50 p-6 rounded-xl">
                    <div class="flex items-center mb-4">
                        <div class="flex -space-x-1 mr-3">
                            <div class="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span class="text-white text-sm font-bold">A</span>
                            </div>
                            <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span class="text-white text-sm font-bold">D</span>
                            </div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Alex & Dana</p>
                            <p class="text-sm text-gray-600">Busy professionals</p>
                        </div>
                    </div>
                    <blockquote class="text-gray-700 italic mb-4">
                        "With our crazy work schedules, we thought weekly dates were impossible. Now we have quality time every single week."
                    </blockquote>
                    <div class="bg-white p-3 rounded-lg">
                        <p class="text-blue-800 font-medium text-sm">✅ 95% success rate finding free time</p>
                        <p class="text-blue-800 font-medium text-sm">✅ $200/month saved vs. using planners</p>
                        <p class="text-blue-800 font-medium text-sm">✅ Relationship satisfaction up 40%</p>
                    </div>
                </div>

                <div class="bg-purple-50 p-6 rounded-xl">
                    <div class="flex items-center mb-4">
                        <div class="flex -space-x-1 mr-3">
                            <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span class="text-white text-sm font-bold">S</span>
                            </div>
                            <div class="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white">
                                <span class="text-white text-sm font-bold">T</span>
                            </div>
                        </div>
                        <div>
                            <p class="font-semibold text-gray-900">Sam & Taylor</p>
                            <p class="text-sm text-gray-600">Long-distance</p>
                        </div>
                    </div>
                    <blockquote class="text-gray-700 italic mb-4">
                        "The AI coordinates our visits perfectly across time zones and helps us make every moment count when we're together."
                    </blockquote>
                    <div class="bg-white p-3 rounded-lg">
                        <p class="text-purple-800 font-medium text-sm">✅ Perfect visit timing across 3 time zones</p>
                        <p class="text-purple-800 font-medium text-sm">✅ Maximized quality time during visits</p>
                        <p class="text-purple-800 font-medium text-sm">✅ Never missed important virtual dates</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Never Fight About Scheduling Again?
            </h2>
            <p class="text-lg sm:text-xl text-green-100 mb-8">
                Join 50,000+ couples who've saved 5+ hours per week with AI scheduling
            </p>
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button class="w-full sm:w-auto bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
                    <i class="fas fa-magic mr-2"></i>Start Free 7-Day Trial
                </button>
                <button class="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-green-600 transition-colors font-semibold text-lg">
                    <i class="fas fa-calendar mr-2"></i>See Live Demo
                </button>
            </div>
            <p class="text-green-100 text-sm">
                No credit card required • Cancel anytime • 30-day money-back guarantee
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
                <p class="mb-6">Making relationship scheduling effortless with AI</p>
                <div class="flex flex-wrap justify-center gap-6 text-sm">
                    <a href="/ai-coach.html" class="hover:text-white">AI Coach</a>
                    <a href="/smart-scheduling.html" class="text-green-400 hover:text-green-300">Smart Scheduling</a>
                    <a href="/intelligent-suggestions.html" class="hover:text-white">Suggestions</a>
                    <a href="/mobile-ui.html" class="hover:text-white">Mobile Design</a>
                    <a href="/" class="hover:text-white">Home</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {

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