// AI Coach feature page HTML content
import { navigationHtml } from '../components/navigation.js';

export const aiCoachHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Coach - Your 24/7 Relationship Expert | Better Together</title>
    <meta name="description" content="Meet your AI relationship coach that provides personalized guidance, solves conflicts, and helps couples grow stronger together 24/7.">
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
<body class="bg-gray-50">
    ${navigationHtml}

    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-50 to-purple-50 py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="flex justify-center mb-6">
                <div class="bg-primary-100 p-4 rounded-full">
                    <i class="fas fa-robot text-4xl text-primary-600"></i>
                </div>
            </div>
            <h1 class="text-5xl font-bold text-gray-900 mb-6">
                Your AI Relationship Coach
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Available 24/7 to guide conversations, resolve conflicts, and help your relationship grow stronger. 
                Get personalized advice based on your unique situation and communication styles.
            </p>
            <div class="flex justify-center space-x-4">
                <button class="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                    <i class="fas fa-comments mr-2"></i>Start Chatting
                </button>
                <button class="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold">
                    <i class="fas fa-play mr-2"></i>See Demo
                </button>
            </div>
        </div>
    </div>

    <!-- How It Works -->
    <div class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">How Your AI Coach Helps Daily</h2>
                <p class="text-xl text-gray-600">Real scenarios from real couples</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Morning Guidance -->
                <div class="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-sun text-2xl text-yellow-600 mr-3"></i>
                        <h3 class="text-xl font-semibold text-gray-900">Morning Guidance</h3>
                    </div>
                    <div class="bg-white p-4 rounded-lg mb-4 shadow-sm">
                        <p class="text-gray-700 italic">
                            "We had a fight last night about money. How should I approach Sarah this morning?"
                        </p>
                    </div>
                    <div class="bg-yellow-100 p-4 rounded-lg">
                        <p class="text-gray-800">
                            <strong>AI Coach:</strong> Start with acknowledging her feelings. Try: "Sarah, I've been thinking about our conversation last night. I know money stress affects us both, and I want to understand your perspective better."
                        </p>
                    </div>
                    <div class="mt-4 flex items-center text-sm text-gray-600">
                        <i class="fas fa-clock mr-2"></i>
                        <span>7:30 AM - Before work conversation</span>
                    </div>
                </div>

                <!-- Conflict Resolution -->
                <div class="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-heart text-2xl text-red-500 mr-3"></i>
                        <h3 class="text-xl font-semibold text-gray-900">Real-Time Support</h3>
                    </div>
                    <div class="bg-white p-4 rounded-lg mb-4 shadow-sm">
                        <p class="text-gray-700 italic">
                            "We're arguing right now about whose turn it is to do dishes. This always escalates!"
                        </p>
                    </div>
                    <div class="bg-red-100 p-4 rounded-lg">
                        <p class="text-gray-800">
                            <strong>AI Coach:</strong> Stop the cycle. Take 3 deep breaths together. This isn't about dishes - it's about feeling appreciated. Try: "Let's pause this and talk about what we both need to feel supported."
                        </p>
                    </div>
                    <div class="mt-4 flex items-center text-sm text-gray-600">
                        <i class="fas fa-bolt mr-2"></i>
                        <span>Instant de-escalation techniques</span>
                    </div>
                </div>

                <!-- Evening Connection -->
                <div class="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-moon text-2xl text-purple-600 mr-3"></i>
                        <h3 class="text-xl font-semibold text-gray-900">Evening Connection</h3>
                    </div>
                    <div class="bg-white p-4 rounded-lg mb-4 shadow-sm">
                        <p class="text-gray-700 italic">
                            "We barely talked today. How can we reconnect before bed?"
                        </p>
                    </div>
                    <div class="bg-purple-100 p-4 rounded-lg">
                        <p class="text-gray-800">
                            <strong>AI Coach:</strong> Try the "3 Things" ritual: Share 3 things - something that went well, something challenging, and something you appreciated about each other today.
                        </p>
                    </div>
                    <div class="mt-4 flex items-center text-sm text-gray-600">
                        <i class="fas fa-heart mr-2"></i>
                        <span>10 PM - Relationship check-in</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- AI Features -->
    <div class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Intelligent Coaching Features</h2>
                <p class="text-xl text-gray-600">Powered by advanced relationship psychology</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-brain text-blue-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Learns Your Style</h3>
                    <p class="text-gray-600">Adapts to how you and your partner communicate best</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-comments text-green-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Natural Conversation</h3>
                    <p class="text-gray-600">Chat like you would with a close friend who understands relationships</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-clock text-yellow-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">24/7 Available</h3>
                    <p class="text-gray-600">Get support whenever you need it, day or night</p>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm">
                    <div class="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-shield-alt text-purple-600"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Private & Secure</h3>
                    <p class="text-gray-600">Your conversations stay completely confidential</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Conversation Examples -->
    <div class="py-20 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Real AI Conversations</h2>
                <p class="text-xl text-gray-600">See how our AI coach handles real relationship challenges</p>
            </div>

            <div class="space-y-8">
                <!-- Conversation 1 -->
                <div class="bg-gray-50 p-6 rounded-xl">
                    <div class="flex items-start space-x-4 mb-4">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-blue-600"></i>
                        </div>
                        <div class="flex-1">
                            <p class="text-gray-800 bg-white p-4 rounded-lg shadow-sm">
                                "My partner never seems to hear what I'm actually saying. We keep having the same arguments over and over. I'm feeling really frustrated and don't know how to break this cycle."
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-robot text-primary-600"></i>
                        </div>
                        <div class="flex-1">
                            <div class="bg-primary-50 p-4 rounded-lg">
                                <p class="text-gray-800 mb-3">
                                    <strong>AI Coach:</strong> That repetitive cycle is so draining, and your frustration makes complete sense. Let's break this pattern together.
                                </p>
                                <p class="text-gray-800 mb-3">
                                    First, this usually happens when both people feel unheard. Here's a technique that works well:
                                </p>
                                <div class="bg-white p-3 rounded-lg mb-3">
                                    <p class="text-gray-800">
                                        <strong>Next time, try this:</strong><br>
                                        1. Start with "I notice we keep coming back to this. Can we try something different?"<br>
                                        2. Then: "I'd like to understand your perspective first. Can you help me see this from your side?"<br>
                                        3. Listen without planning your response<br>
                                        4. Repeat back what you heard before sharing your view
                                    </p>
                                </div>
                                <p class="text-gray-800">
                                    Would you like me to help you practice how to bring this up, or would you prefer to focus on understanding why these cycles happen?
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Conversation 2 -->
                <div class="bg-gray-50 p-6 rounded-xl">
                    <div class="flex items-start space-x-4 mb-4">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user text-blue-600"></i>
                        </div>
                        <div class="flex-1">
                            <p class="text-gray-800 bg-white p-4 rounded-lg shadow-sm">
                                "We've been together for 3 years and things feel... routine. We love each other but the spark seems to be fading. How do we get that excitement back?"
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex items-start space-x-4">
                        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-robot text-primary-600"></i>
                        </div>
                        <div class="flex-1">
                            <div class="bg-primary-50 p-4 rounded-lg">
                                <p class="text-gray-800 mb-3">
                                    <strong>AI Coach:</strong> Three years is actually when many couples notice this shift - you're not alone! The good news is that long-term excitement is totally achievable, just different from the early butterflies.
                                </p>
                                <div class="bg-white p-3 rounded-lg mb-3">
                                    <p class="text-gray-800">
                                        <strong>The "spark" evolves through three phases:</strong><br>
                                        🔥 <strong>Passion (0-2 years):</strong> Intense, unpredictable<br>
                                        💚 <strong>Intimacy (2-5 years):</strong> Deep connection, comfort<br>
                                        💎 <strong>Commitment (5+ years):</strong> Chosen love, partnership
                                    </p>
                                </div>
                                <p class="text-gray-800 mb-3">
                                    You're transitioning to phase 2, which can feel less intense but offers something beautiful: deep security plus intentional excitement.
                                </p>
                                <div class="bg-white p-3 rounded-lg mb-3">
                                    <p class="text-gray-800">
                                        <strong>Try this week:</strong><br>
                                        • Plan one "first time" experience together (new restaurant, activity, etc.)<br>
                                        • Ask each other: "What's one thing about me you've discovered recently?"<br>
                                        • Set aside 20 minutes for uninterrupted conversation about dreams/goals
                                    </p>
                                </div>
                                <p class="text-gray-800">
                                    What type of activities used to excite you both in the early days? Let's build on those patterns.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Budget-Aware Coaching -->
    <div class="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Budget-Smart Relationship Coaching</h2>
                <p class="text-xl text-gray-600">Great advice doesn't require spending money</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
                <!-- Free Coaching -->
                <div class="bg-white p-8 rounded-2xl shadow-sm">
                    <div class="flex items-center mb-6">
                        <div class="bg-green-100 p-3 rounded-full mr-4">
                            <i class="fas fa-gift text-green-600 text-xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">$0 Coaching</h3>
                    </div>
                    <div class="space-y-4">
                        <div class="p-4 bg-green-50 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Home Date Night Ideas</h4>
                            <p class="text-gray-700">"Cook a meal from your childhood together and share stories from that time"</p>
                        </div>
                        <div class="p-4 bg-green-50 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Communication Exercises</h4>
                            <p class="text-gray-700">"Try the 20-question game: Ask deeper questions you've never asked before"</p>
                        </div>
                        <div class="p-4 bg-green-50 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Appreciation Rituals</h4>
                            <p class="text-gray-700">"Write 3 specific things you appreciate about each other every Sunday"</p>
                        </div>
                    </div>
                </div>

                <!-- Budget Coaching -->
                <div class="bg-white p-8 rounded-2xl shadow-sm">
                    <div class="flex items-center mb-6">
                        <div class="bg-blue-100 p-3 rounded-full mr-4">
                            <i class="fas fa-wallet text-blue-600 text-xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">$20-50 Coaching</h3>
                    </div>
                    <div class="space-y-4">
                        <div class="p-4 bg-blue-50 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Meaningful Experiences</h4>
                            <p class="text-gray-700">"Visit a local museum during free hours and discuss what art speaks to you both"</p>
                        </div>
                        <div class="p-4 bg-blue-50 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Growth Activities</h4>
                            <p class="text-gray-700">"Take a couples' online course together ($25) and discuss insights weekly"</p>
                        </div>
                        <div class="p-4 bg-blue-50 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Adventure Planning</h4>
                            <p class="text-gray-700">"Plan a local hiking trip with a picnic - focus on exploring together"</p>
                        </div>
                    </div>
                </div>

                <!-- Investment Coaching -->
                <div class="bg-white p-8 rounded-2xl shadow-sm">
                    <div class="flex items-center mb-6">
                        <div class="bg-purple-100 p-3 rounded-full mr-4">
                            <i class="fas fa-star text-purple-600 text-xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900">$100+ Coaching</h3>
                    </div>
                    <div class="space-y-4">
                        <div class="p-4 bg-purple-50 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Professional Growth</h4>
                            <p class="text-gray-700">"Invest in couples therapy sessions when AI coaching identifies deeper patterns to address"</p>
                        </div>
                        <div class="p-4 bg-purple-50 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Relationship Retreats</h4>
                            <p class="text-gray-700">"Weekend getaway focused on relationship goals and intimate conversations"</p>
                        </div>
                        <div class="p-4 bg-purple-50 rounded-lg">
                            <h4 class="font-semibold text-gray-900 mb-2">Skill Building</h4>
                            <p class="text-gray-700">"Enroll in workshops for communication, intimacy, or conflict resolution"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- CTA Section -->
    <div class="py-20 bg-primary-600">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-4xl font-bold text-white mb-6">
                Start Your AI Coaching Journey Today
            </h2>
            <p class="text-xl text-primary-100 mb-8">
                Join thousands of couples who are growing stronger together with personalized AI guidance
            </p>
            <div class="flex justify-center space-x-4">
                <button class="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg">
                    <i class="fas fa-comments mr-2"></i>Start Free Coaching
                </button>
                <button class="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-colors font-semibold text-lg">
                    <i class="fas fa-calendar mr-2"></i>Schedule Demo
                </button>
            </div>
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
                <p class="mb-6">Building stronger relationships through AI-powered coaching</p>
                <div class="flex justify-center space-x-6">
                    <a href="/ai-coach.html" class="text-primary-400 hover:text-primary-300">AI Coach</a>
                    <a href="/smart-scheduling.html" class="hover:text-white">Smart Scheduling</a>
                    <a href="/intelligent-suggestions.html" class="hover:text-white">Suggestions</a>
                    <a href="/" class="hover:text-white">Home</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Simple interaction handlers
        document.addEventListener('DOMContentLoaded', function() {
            // Add smooth scrolling to internal links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
        });
    </script>
</body>
</html>`;