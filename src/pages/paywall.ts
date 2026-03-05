// Paywall Page with Two-Plan Pricing (Try It Out $30/mo, Better Together $240/yr)
export const paywallHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Choose Your Plan - Better Together</title>
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

        @keyframes floating-hearts {
            0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
            50% { transform: translateY(-20px) rotate(10deg); opacity: 1; }
        }

        .floating-hearts {
            animation: floating-hearts 3s ease-in-out infinite;
        }

        .plan-transition {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

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
                <span class="text-2xl mr-3 floating-hearts">&#x1F495;</span>
                <span class="text-xl font-semibold">Better Together</span>
            </div>
            <a href="/" class="text-white/80 hover:text-white transition-colors">
                <i class="fas fa-arrow-left mr-2"></i>Back
            </a>
        </div>
    </nav>

    <div class="max-w-5xl mx-auto px-6 pb-12">
        <!-- Hero Section -->
        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold text-white mb-4">
                Unlock Premium <span class="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Relationship Tools</span>
            </h1>
            <p class="text-xl text-white/90 max-w-2xl mx-auto mb-6">
                AI coaching, video calls, intimacy challenges, and more. Choose the plan that works for you.
            </p>
            <p class="text-white/70 text-sm">Free users get basic check-ins, goals, and community access</p>
        </div>

        <!-- Main Paywall Card -->
        <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            <div class="p-8">
                <!-- Plan Selection Tabs -->
                <div class="flex bg-gray-100 rounded-2xl p-2 mb-8 max-w-md mx-auto">
                    <button id="monthlyPlanTab" onclick="showPlan('monthly')"
                            class="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 bg-white shadow-sm text-gray-800">
                        Monthly
                    </button>
                    <button id="annualPlanTab" onclick="showPlan('annual')"
                            class="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-gray-600 hover:text-gray-800 relative">
                        Annual
                        <span class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">SAVE 33%</span>
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
                                            <span class="text-lg mb-1">Try It Out</span>
                                            <span class="text-2xl font-bold text-pink-600">$30</span>
                                            <span class="text-sm text-gray-600">/month</span>
                                        </div>
                                    </th>
                                    <th class="text-center p-4 font-semibold text-gray-800 border-l bg-gradient-to-r from-yellow-50 to-orange-50">
                                        <div class="flex flex-col items-center relative">
                                            <div class="absolute -top-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                BEST VALUE
                                            </div>
                                            <span class="text-lg mb-1 mt-2">Better Together</span>
                                            <span class="text-2xl font-bold text-purple-600">$240</span>
                                            <span class="text-sm text-gray-600">/year ($20/mo)</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="border-t">
                                    <td class="p-4 font-medium text-gray-800">AI Relationship Coach</td>
                                    <td class="p-4 text-center border-l">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                    <td class="p-4 text-center border-l bg-purple-50">
                                        <div class="flex flex-col items-center">
                                            <i class="fas fa-check text-green-500 text-lg mb-1"></i>
                                            <span class="text-xs text-purple-700 font-semibold">Advanced AI</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="border-t bg-gray-50">
                                    <td class="p-4 font-medium text-gray-800">Daily Check-ins</td>
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
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                    <td class="p-4 text-center border-l bg-purple-50">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                </tr>
                                <tr class="border-t bg-gray-50">
                                    <td class="p-4 font-medium text-gray-800">Community Access</td>
                                    <td class="p-4 text-center border-l">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                    <td class="p-4 text-center border-l bg-purple-50">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                </tr>
                                <tr class="border-t">
                                    <td class="p-4 font-medium text-gray-800">Video Calls</td>
                                    <td class="p-4 text-center border-l">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                    <td class="p-4 text-center border-l bg-purple-50">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                </tr>
                                <tr class="border-t bg-gray-50">
                                    <td class="p-4 font-medium text-gray-800">Intimacy Challenges</td>
                                    <td class="p-4 text-center border-l">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                    <td class="p-4 text-center border-l bg-purple-50">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                </tr>
                                <tr class="border-t">
                                    <td class="p-4 font-medium text-gray-800">All Assessments</td>
                                    <td class="p-4 text-center border-l">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                    <td class="p-4 text-center border-l bg-purple-50">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                </tr>
                                <tr class="border-t bg-gray-50">
                                    <td class="p-4 font-medium text-gray-800">Priority Support</td>
                                    <td class="p-4 text-center border-l">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                    <td class="p-4 text-center border-l bg-purple-50">
                                        <i class="fas fa-check text-green-500 text-lg"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Plan Details -->
                <div class="grid md:grid-cols-2 gap-8 mb-8">
                    <!-- Left: Why Premium -->
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                            <i class="fas fa-heart text-pink-500 mr-3"></i>
                            Why Go Premium?
                        </h2>

                        <div class="grid grid-cols-2 gap-4 mb-6">
                            <div class="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
                                <div class="text-2xl font-bold text-pink-600"><i class="fas fa-robot"></i></div>
                                <div class="text-sm text-pink-700">AI Coaching</div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                                <div class="text-2xl font-bold text-blue-600"><i class="fas fa-video"></i></div>
                                <div class="text-sm text-blue-700">Video Calls</div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                                <div class="text-2xl font-bold text-green-600"><i class="fas fa-fire"></i></div>
                                <div class="text-sm text-green-700">Intimacy Challenges</div>
                            </div>
                            <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
                                <div class="text-2xl font-bold text-purple-600"><i class="fas fa-heart"></i></div>
                                <div class="text-sm text-purple-700">All Assessments</div>
                            </div>
                        </div>

                        <!-- Guarantee -->
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                            <div class="flex items-center mb-2">
                                <i class="fas fa-shield-alt text-green-600 mr-2"></i>
                                <span class="font-semibold text-green-800">30-Day Money-Back Guarantee</span>
                            </div>
                            <p class="text-sm text-green-700">Try Better Together risk-free. If it's not right for you, get a full refund.</p>
                        </div>
                    </div>

                    <!-- Right: Checkout Form -->
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 text-center mb-6">Get Started Now</h3>

                        <!-- Plan Selection -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Select Your Plan</label>
                            <div class="grid grid-cols-2 gap-4">
                                <label class="cursor-pointer">
                                    <input type="radio" name="selectedPlan" value="monthly" class="sr-only" checked>
                                    <div id="monthlyCard" class="border-2 border-pink-400 rounded-xl p-4 text-center transition-colors bg-pink-50">
                                        <div class="font-semibold text-gray-800">Try It Out</div>
                                        <div class="text-2xl font-bold text-pink-600">$30</div>
                                        <div class="text-xs text-gray-600">/month</div>
                                    </div>
                                </label>
                                <label class="cursor-pointer">
                                    <input type="radio" name="selectedPlan" value="annual" class="sr-only">
                                    <div id="annualCard" class="border-2 border-purple-200 rounded-xl p-4 text-center hover:border-purple-400 transition-colors relative">
                                        <div class="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                            SAVE 33%
                                        </div>
                                        <div class="font-semibold text-gray-800 mt-2">Better Together</div>
                                        <div class="text-2xl font-bold text-purple-600">$240</div>
                                        <div class="text-xs text-gray-600">/year ($20/mo)</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Price Display -->
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl mb-6 text-center">
                            <div class="text-sm text-green-700">
                                <span id="selectedPrice">$30/month</span> for both partners
                            </div>
                            <div class="text-xs text-green-600 mt-1">Cancel anytime with one click</div>
                        </div>

                        <!-- Stripe Payment Form -->
                        <form id="payment-form">
                            <div class="mb-4">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input type="email" id="email" required
                                       class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            </div>

                            <button type="submit" id="submit-button"
                                    class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                <span id="button-text">
                                    <i class="fas fa-crown mr-2"></i>
                                    Subscribe Now
                                </span>
                                <span id="spinner" class="hidden">
                                    <div class="spinner mr-2"></div>
                                    Processing...
                                </span>
                            </button>
                        </form>

                        <!-- Security -->
                        <div class="mt-4 text-center space-y-2">
                            <div class="flex items-center justify-center text-sm text-gray-600">
                                <i class="fas fa-lock text-green-500 mr-2"></i>
                                <span>Secured by Stripe</span>
                            </div>
                            <div class="flex items-center justify-center text-sm text-gray-600">
                                <i class="fas fa-times-circle text-red-500 mr-2"></i>
                                <span>Cancel Anytime</span>
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
                    <h3 class="font-semibold text-gray-800 mb-2">What do I get as a free user?</h3>
                    <p class="text-sm text-gray-600">Free users get basic check-ins, shared goals, community access, and date activities. Premium unlocks AI coaching, video calls, intimacy challenges, and all assessments.</p>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">What is the difference between plans?</h3>
                    <p class="text-sm text-gray-600">Both plans unlock all premium features. The annual Better Together plan saves you 33% compared to monthly -- $240/year vs $360/year if you paid monthly.</p>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">Do both partners need accounts?</h3>
                    <p class="text-sm text-gray-600">Yes! Better Together is designed for couples. One subscription covers both partners with full access to all features.</p>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-800 mb-2">Can I switch plans later?</h3>
                    <p class="text-sm text-gray-600">Absolutely! You can upgrade, downgrade, or cancel anytime from your subscription management page or via the Stripe billing portal.</p>
                </div>
            </div>
        </div>
    </div>

    <script>
        let selectedPlan = 'monthly';

        function showPlan(plan) {
            selectedPlan = plan;

            const monthlyTab = document.getElementById('monthlyPlanTab');
            const annualTab = document.getElementById('annualPlanTab');
            const monthlyCard = document.getElementById('monthlyCard');
            const annualCard = document.getElementById('annualCard');

            if (plan === 'monthly') {
                monthlyTab.classList.add('bg-white', 'shadow-sm', 'text-gray-800');
                monthlyTab.classList.remove('text-gray-600', 'hover:text-gray-800');
                annualTab.classList.remove('bg-white', 'shadow-sm', 'text-gray-800');
                annualTab.classList.add('text-gray-600', 'hover:text-gray-800');

                monthlyCard.classList.add('border-pink-400', 'bg-pink-50');
                monthlyCard.classList.remove('border-pink-200');
                annualCard.classList.remove('border-purple-400', 'bg-purple-50');
                annualCard.classList.add('border-purple-200');

                document.getElementById('selectedPrice').textContent = '$30/month';
                document.querySelector('input[value="monthly"]').checked = true;
            } else {
                annualTab.classList.add('bg-white', 'shadow-sm', 'text-gray-800');
                annualTab.classList.remove('text-gray-600', 'hover:text-gray-800');
                monthlyTab.classList.remove('bg-white', 'shadow-sm', 'text-gray-800');
                monthlyTab.classList.add('text-gray-600', 'hover:text-gray-800');

                annualCard.classList.add('border-purple-400', 'bg-purple-50');
                annualCard.classList.remove('border-purple-200');
                monthlyCard.classList.remove('border-pink-400', 'bg-pink-50');
                monthlyCard.classList.add('border-pink-200');

                document.getElementById('selectedPrice').textContent = '$240/year ($20/month)';
                document.querySelector('input[value="annual"]').checked = true;
            }
        }

        document.querySelectorAll('input[name="selectedPlan"]').forEach(radio => {
            radio.addEventListener('change', function() {
                showPlan(this.value);
            });
        });

        const form = document.getElementById('payment-form');
        const submitButton = document.getElementById('submit-button');
        const buttonText = document.getElementById('button-text');
        const spinner = document.getElementById('spinner');

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            submitButton.disabled = true;
            buttonText.classList.add('hidden');
            spinner.classList.remove('hidden');

            const email = document.getElementById('email').value;
            const planType = document.querySelector('input[name="selectedPlan"]:checked').value;

            const planIdMap = {
                'monthly': 'try-it-out',
                'annual': 'better-together'
            };
            const planId = planIdMap[planType] || 'try-it-out';

            try {
                const response = await fetch('/api/payments/create-checkout-session', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        planId: planId,
                        email: email,
                        userId: localStorage.getItem('userId') || 'anonymous',
                    }),
                });

                const data = await response.json();

                if (data.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error(data.error || 'Failed to create checkout session');
                }
            } catch (error) {
                console.error('Checkout error:', error);
                alert('Failed to start checkout: ' + error.message);

                submitButton.disabled = false;
                buttonText.classList.remove('hidden');
                spinner.classList.add('hidden');
            }
        });

        showPlan('monthly');
    </script>
</body>
</html>`;
