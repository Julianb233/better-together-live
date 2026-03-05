// Premium Pricing - Two Plans: Try It Out ($30/mo) and Better Together ($240/yr)
import { navigationHtml } from '../components/navigation.js';

export const premiumPricingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Plans - Better Together</title>
    <meta name="description" content="Choose your plan: Try It Out for $30/month or Better Together for $240/year. AI coaching, video calls, intimacy challenges, and more.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        .gradient-bg { background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fce7f3 100%); }
        .pricing-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 2px solid rgba(16, 185, 129, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .pricing-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
    </style>
</head>
<body class="bg-gray-50 font-['Inter',sans-serif]">
    \${navigationHtml}

    <!-- Hero Section -->
    <section class="gradient-bg py-16 sm:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <div class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
                    <i class="fas fa-heart mr-2"></i>
                    Build a Stronger Relationship Together
                </div>

                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Unlock Your Relationship's
                    <span class="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        Full Potential
                    </span>
                </h1>

                <p class="text-xl sm:text-2xl text-gray-700 mb-4 max-w-4xl mx-auto leading-relaxed">
                    Get personalized AI coaching, video calls, intimate challenges, and tools that help you thrive as a couple.
                </p>
                <p class="text-gray-500 mb-8">Free users enjoy basic check-ins, goals, and community. Premium unlocks everything.</p>

                <a href="#plans" class="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 shadow-lg transition-all duration-300">
                    <i class="fas fa-heart mr-2"></i>
                    View Plans
                </a>
            </div>
        </div>
    </section>

    <!-- Pricing Plans -->
    <section id="plans" class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">Both plans unlock all premium features. The annual plan saves you 33%.</p>
            </div>

            <div class="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto mb-16">
                <!-- Better Together Plan (Annual - Best Value) -->
                <div class="pricing-card rounded-2xl p-8 relative border-2 border-green-300">
                    <div class="absolute -top-4 right-8 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                        BEST VALUE - SAVE 33%
                    </div>
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-heart text-white text-2xl"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-gray-900 mb-2">Better Together</h3>
                        <div class="text-5xl font-bold text-pink-600 mb-2">
                            $240<span class="text-2xl font-normal text-gray-600">/year</span>
                        </div>
                        <div class="text-lg text-gray-600 mb-4">
                            Just $20/month
                        </div>
                    </div>

                    <div class="mb-8">
                        <h4 class="font-bold text-gray-900 mb-4 text-center">ALL PREMIUM FEATURES</h4>
                        <ul class="space-y-3">
                            <li class="flex items-center"><i class="fas fa-robot text-blue-500 mr-3"></i><span class="font-semibold">Advanced AI Relationship Coach</span></li>
                            <li class="flex items-center"><i class="fas fa-video text-purple-500 mr-3"></i><span class="font-semibold">Video Calls</span></li>
                            <li class="flex items-center"><i class="fas fa-fire text-rose-500 mr-3"></i><span class="font-semibold">Intimacy Challenges</span></li>
                            <li class="flex items-center"><i class="fas fa-calendar-heart text-pink-500 mr-3"></i><span class="font-semibold">Smart Date Planning</span></li>
                            <li class="flex items-center"><i class="fas fa-clipboard-check text-indigo-500 mr-3"></i><span class="font-semibold">All Assessments</span></li>
                            <li class="flex items-center"><i class="fas fa-headset text-emerald-500 mr-3"></i><span class="font-semibold">Priority Support</span></li>
                            <li class="flex items-center"><i class="fas fa-users text-amber-500 mr-3"></i><span class="font-semibold">Community Access</span></li>
                        </ul>
                    </div>

                    <button onclick="subscribe('better-together')" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all shadow-lg text-lg">
                        <i class="fas fa-heart mr-2"></i>
                        Choose Better Together
                    </button>

                    <div class="text-center mt-4">
                        <span class="text-sm text-gray-600">30-day money back guarantee</span>
                    </div>
                </div>

                <!-- Try It Out Plan (Monthly) -->
                <div class="pricing-card rounded-2xl p-8 relative border-gray-200">
                    <div class="text-center mb-8">
                        <div class="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i class="fas fa-clock text-white text-2xl"></i>
                        </div>
                        <h3 class="text-3xl font-bold text-gray-900 mb-2">Try It Out</h3>
                        <div class="text-5xl font-bold text-gray-900 mb-2">
                            $30<span class="text-2xl font-normal text-gray-600">/month</span>
                        </div>
                        <div class="text-lg text-gray-600 mb-4">
                            No long-term commitment
                        </div>
                    </div>

                    <div class="mb-8">
                        <h4 class="font-bold text-gray-900 mb-4 text-center">ALL PREMIUM FEATURES</h4>
                        <ul class="space-y-3">
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Advanced AI Relationship Coach</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Video Calls</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Intimacy Challenges</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Smart Date Planning</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>All Assessments</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Priority Support</span></li>
                            <li class="flex items-center"><i class="fas fa-check text-gray-600 mr-3"></i><span>Community Access</span></li>
                        </ul>
                    </div>

                    <button onclick="subscribe('try-it-out')" class="w-full bg-gray-600 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-lg text-lg">
                        <i class="fas fa-clock mr-2"></i>
                        Try It Out
                    </button>

                    <div class="text-center mt-4">
                        <span class="text-sm text-gray-600">Cancel anytime</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Premium Features -->
    <section class="py-16 bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Premium Features Included</h2>
                <p class="text-xl text-gray-300">Everything you need for relationship growth</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="bg-gray-800 rounded-xl p-6 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-fire text-white text-xl"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Intimacy Challenges</h3>
                    <p class="text-gray-300 text-sm">Progressive system to deepen physical and emotional connection</p>
                </div>

                <div class="bg-gray-800 rounded-xl p-6 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-video text-white text-xl"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Video Calls</h3>
                    <p class="text-gray-300 text-sm">Stay connected with built-in couple video calling</p>
                </div>

                <div class="bg-gray-800 rounded-xl p-6 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-robot text-white text-xl"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Advanced AI Coach</h3>
                    <p class="text-gray-300 text-sm">Personalized relationship guidance powered by AI</p>
                </div>

                <div class="bg-gray-800 rounded-xl p-6 text-center">
                    <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-clipboard-check text-white text-xl"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">All Assessments</h3>
                    <p class="text-gray-300 text-sm">Complete compatibility and love language assessments</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Partner Gifting -->
    <section class="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gift Better Together</h2>
            <p class="text-xl text-gray-600 mb-8">Give the gift of a stronger relationship. Perfect for anniversaries, birthdays, or just because.</p>

            <div class="bg-white rounded-2xl p-8 shadow-lg max-w-lg mx-auto">
                <div class="space-y-4 mb-6">
                    <div class="flex justify-between items-center">
                        <span>Better Together (Annual):</span>
                        <span class="font-bold text-pink-600">$240/year</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span>Try It Out (Monthly):</span>
                        <span class="font-bold text-gray-600">$30/month</span>
                    </div>
                </div>
                <a href="/gift-subscription" class="inline-block w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                    <i class="fas fa-gift mr-2"></i>Send a Gift
                </a>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">Ready to Invest in Your Relationship?</h2>
            <p class="text-xl mb-8 opacity-90">Join couples who chose to grow together</p>

            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button onclick="subscribe('better-together')" class="w-full sm:w-auto bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg text-lg">
                    <i class="fas fa-heart mr-2"></i>
                    Better Together - $240/year
                </button>
                <button onclick="subscribe('try-it-out')" class="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors">
                    <i class="fas fa-clock mr-2"></i>
                    Try It Out - $30/month
                </button>
            </div>

            <div class="text-pink-100">
                <p class="text-sm">
                    <i class="fas fa-shield-alt mr-2"></i>
                    30-day money-back guarantee on all plans
                </p>
            </div>
        </div>
    </section>

    <script>
        async function subscribe(planId) {
            const userId = localStorage.getItem('userId');
            const email = localStorage.getItem('userEmail');

            if (!userId || !email) {
                window.location.href = '/login?redirect=/premium-pricing';
                return;
            }

            try {
                const response = await fetch('/api/payments/create-checkout-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ planId, userId, email })
                });

                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    alert(data.error || 'Failed to create checkout session');
                }
            } catch (error) {
                console.error('Checkout error:', error);
                alert('Failed to start checkout. Please try again.');
            }
        }
    </script>
</body>
</html>`;
