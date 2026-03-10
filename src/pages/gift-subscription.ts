// Gift Subscription Page - Two Plans: Try It Out ($30) and Better Together ($240/yr)
export const giftSubscriptionHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gift a Subscription - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .plan-card { transition: all 0.3s ease; cursor: pointer; }
        .plan-card:hover { transform: translateY(-4px); }
        .plan-card.selected { border-color: #ec4899; box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2); }
        .float-animation { animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8">
    <div class="max-w-3xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="float-animation inline-block mb-4">
                <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                    <span class="text-4xl">&#127873;</span>
                </div>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Gift Better Together</h1>
            <p class="text-gray-600">Give the gift of a stronger relationship</p>
        </div>

        <!-- Gift Plan Selection -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 text-center">Choose a Gift Plan</h2>
            <div class="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <!-- Try It Out - 1 Month -->
                <div class="plan-card glass-card rounded-2xl p-6 border-2 border-transparent shadow-lg" data-plan="try-it-out" onclick="selectPlan('try-it-out')">
                    <div class="text-center mb-4">
                        <div class="text-4xl mb-2">&#128157;</div>
                        <h3 class="font-bold text-gray-900">Try It Out</h3>
                        <div class="text-sm text-gray-500">1 month of premium</div>
                    </div>
                    <div class="text-center mb-4">
                        <span class="text-3xl font-bold text-gray-900">$30</span>
                    </div>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Full Premium Access</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>AI Relationship Coach</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>All Challenges & Video</li>
                    </ul>
                </div>

                <!-- Better Together - Annual -->
                <div class="plan-card glass-card rounded-2xl p-6 border-2 border-pink-500 shadow-lg relative selected" data-plan="better-together" onclick="selectPlan('better-together')">
                    <div class="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">BEST VALUE</span>
                    </div>
                    <div class="text-center mb-4">
                        <div class="text-4xl mb-2">&#128150;</div>
                        <h3 class="font-bold text-gray-900">Better Together</h3>
                        <div class="text-sm text-gray-500">Full year of premium</div>
                    </div>
                    <div class="text-center mb-4">
                        <span class="text-3xl font-bold text-gray-900">$240</span>
                        <div class="text-sm text-green-600 font-medium">Save 33% vs monthly</div>
                    </div>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Everything in Try It Out</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Priority Support</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>12 months for $20/mo</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Recipient Details -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-user-heart text-pink-500 mr-2"></i>
                Recipient Details
            </h2>
            <form id="giftForm">
                <div class="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                        <input type="text" id="recipientName" required placeholder="Their name"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
                        <input type="email" id="recipientEmail" required placeholder="their@email.com"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
                    <textarea id="giftMessage" rows="3" placeholder="Add a heartfelt message..."
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
                </div>
            </form>
        </div>

        <!-- Gift Preview -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-envelope text-pink-500 mr-2"></i>
                Gift Preview
            </h2>
            <div class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 text-center">
                <div class="text-4xl mb-3">&#127873;</div>
                <h3 class="font-bold text-gray-900 text-lg mb-2">You've Been Gifted Better Together!</h3>
                <p class="text-gray-600 text-sm mb-4">Someone special wants you to experience a stronger, happier relationship.</p>
                <div class="inline-block bg-white px-4 py-2 rounded-lg shadow">
                    <span class="font-semibold text-pink-600" id="previewPlan">Better Together (1 Year)</span>
                </div>
            </div>
        </div>

        <!-- Order Summary -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div class="flex justify-between items-center mb-4 pb-4 border-b">
                <span class="text-gray-600">Gift Subscription (<span id="summaryPlan">Better Together</span>)</span>
                <span class="font-semibold text-gray-900" id="summaryPrice">$240.00</span>
            </div>
            <div class="flex justify-between items-center text-lg font-bold">
                <span class="text-gray-900">Total</span>
                <span class="text-pink-600" id="summaryTotal">$240.00</span>
            </div>
        </div>

        <!-- Purchase Button -->
        <button onclick="purchaseGift()" id="purchaseBtn" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl mb-4">
            <i class="fas fa-gift mr-2"></i>
            Purchase Gift
        </button>

        <p class="text-center text-sm text-gray-500">
            <i class="fas fa-lock mr-1"></i>
            Secure payment powered by Stripe
        </p>

        <!-- Back Link -->
        <div class="text-center mt-6">
            <a href="/portal" class="text-gray-600 hover:text-pink-600 transition">
                <i class="fas fa-arrow-left mr-2"></i>Back to Portal
            </a>
        </div>
    </div>

    <script>
        let selectedPlan = 'better-together';
        const planDetails = {
            'try-it-out': { name: 'Try It Out (1 Month)', price: 30.00 },
            'better-together': { name: 'Better Together (1 Year)', price: 240.00 }
        };

        function selectPlan(plan) {
            selectedPlan = plan;
            document.querySelectorAll('.plan-card').forEach(card => {
                card.classList.toggle('selected', card.dataset.plan === plan);
                card.classList.toggle('border-pink-500', card.dataset.plan === plan);
                card.classList.toggle('border-transparent', card.dataset.plan !== plan);
            });
            updateSummary();
        }

        function updateSummary() {
            const details = planDetails[selectedPlan];
            document.getElementById('previewPlan').textContent = details.name;
            document.getElementById('summaryPlan').textContent = details.name;
            document.getElementById('summaryPrice').textContent = '$' + details.price.toFixed(2);
            document.getElementById('summaryTotal').textContent = '$' + details.price.toFixed(2);
        }

        async function purchaseGift() {
            const recipientName = document.getElementById('recipientName').value;
            const recipientEmail = document.getElementById('recipientEmail').value;
            const message = document.getElementById('giftMessage').value;

            if (!recipientName || !recipientEmail) {
                alert('Please fill in recipient details');
                return;
            }

            const userId = localStorage.getItem('userId');
            if (!userId) {
                window.location.href = '/login?redirect=/gift-subscription';
                return;
            }

            const btn = document.getElementById('purchaseBtn');
            btn.disabled = true;
            btn.innerHTML = '<div class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Processing...';

            try {
                const response = await fetch('/api/payments/create-gift-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        planId: selectedPlan,
                        senderUserId: userId,
                        recipientEmail,
                        recipientName,
                        message
                    })
                });

                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error(data.error || 'Failed to create checkout');
                }
            } catch (error) {
                console.error('Purchase error:', error);
                alert('Failed to process gift purchase. Please try again.');
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-gift mr-2"></i>Purchase Gift';
            }
        }

        // Initialize
        updateSummary();
    </script>
</body>
</html>`;
