// Gift Subscription Page
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
                    <span class="text-4xl">🎁</span>
                </div>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Gift Better Together</h1>
            <p class="text-gray-600">Give the gift of a stronger relationship</p>
        </div>

        <!-- Gift Plan Selection -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 text-center">Choose a Gift Plan</h2>
            <div class="grid md:grid-cols-3 gap-4">
                <!-- 1 Month -->
                <div class="plan-card glass-card rounded-2xl p-6 border-2 border-transparent shadow-lg" data-plan="monthly" onclick="selectPlan('monthly')">
                    <div class="text-center mb-4">
                        <div class="text-4xl mb-2">💝</div>
                        <h3 class="font-bold text-gray-900">1 Month</h3>
                        <div class="text-sm text-gray-500">Try it out</div>
                    </div>
                    <div class="text-center mb-4">
                        <span class="text-3xl font-bold text-gray-900">$9.99</span>
                    </div>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Full Premium Access</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>AI Relationship Coach</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>All Challenges</li>
                    </ul>
                </div>

                <!-- 6 Months - Popular -->
                <div class="plan-card glass-card rounded-2xl p-6 border-2 border-pink-500 shadow-lg relative selected" data-plan="biannual" onclick="selectPlan('biannual')">
                    <div class="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">MOST POPULAR</span>
                    </div>
                    <div class="text-center mb-4">
                        <div class="text-4xl mb-2">💖</div>
                        <h3 class="font-bold text-gray-900">6 Months</h3>
                        <div class="text-sm text-gray-500">Best value</div>
                    </div>
                    <div class="text-center mb-4">
                        <span class="text-3xl font-bold text-gray-900">$49.99</span>
                        <div class="text-sm text-green-600 font-medium">Save 17%</div>
                    </div>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Everything in Monthly</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Priority Support</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Bonus Challenges</li>
                    </ul>
                </div>

                <!-- 1 Year -->
                <div class="plan-card glass-card rounded-2xl p-6 border-2 border-transparent shadow-lg" data-plan="annual" onclick="selectPlan('annual')">
                    <div class="text-center mb-4">
                        <div class="text-4xl mb-2">💕</div>
                        <h3 class="font-bold text-gray-900">1 Year</h3>
                        <div class="text-sm text-gray-500">Full commitment</div>
                    </div>
                    <div class="text-center mb-4">
                        <span class="text-3xl font-bold text-gray-900">$79.99</span>
                        <div class="text-sm text-green-600 font-medium">Save 33%</div>
                    </div>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Everything in 6 Months</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Exclusive Content</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i>Date Box Discount</li>
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

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                    <div class="flex gap-4">
                        <label class="flex items-center">
                            <input type="radio" name="deliveryType" value="now" checked class="w-4 h-4 text-pink-600">
                            <span class="ml-2 text-gray-700">Send immediately</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="deliveryType" value="scheduled" class="w-4 h-4 text-pink-600">
                            <span class="ml-2 text-gray-700">Schedule delivery</span>
                        </label>
                    </div>
                </div>

                <div id="scheduledDate" class="hidden mb-4">
                    <input type="date" id="deliveryDate"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                </div>
            </form>
        </div>

        <!-- Gift Preview -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-envelope-open-heart text-pink-500 mr-2"></i>
                Gift Preview
            </h2>
            <div class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 text-center">
                <div class="text-4xl mb-3">🎁</div>
                <h3 class="font-bold text-gray-900 text-lg mb-2">You've Been Gifted Better Together!</h3>
                <p class="text-gray-600 text-sm mb-4">Someone special wants you to experience a stronger, happier relationship.</p>
                <div class="inline-block bg-white px-4 py-2 rounded-lg shadow">
                    <span class="font-semibold text-pink-600" id="previewPlan">6 Months Premium</span>
                </div>
            </div>
        </div>

        <!-- Order Summary -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div class="flex justify-between items-center mb-4 pb-4 border-b">
                <span class="text-gray-600">Gift Subscription (<span id="summaryPlan">6 Months</span>)</span>
                <span class="font-semibold text-gray-900" id="summaryPrice">$49.99</span>
            </div>
            <div class="flex justify-between items-center text-lg font-bold">
                <span class="text-gray-900">Total</span>
                <span class="text-pink-600" id="summaryTotal">$49.99</span>
            </div>
        </div>

        <!-- Purchase Button -->
        <button onclick="purchaseGift()" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl mb-4">
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
        let selectedPlan = 'biannual';
        const planDetails = {
            monthly: { name: '1 Month Premium', price: 9.99 },
            biannual: { name: '6 Months Premium', price: 49.99 },
            annual: { name: '1 Year Premium', price: 79.99 }
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
            document.getElementById('summaryPlan').textContent = details.name.replace(' Premium', '');
            document.getElementById('summaryPrice').textContent = '$' + details.price.toFixed(2);
            document.getElementById('summaryTotal').textContent = '$' + details.price.toFixed(2);
        }

        // Toggle scheduled date visibility
        document.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.getElementById('scheduledDate').classList.toggle('hidden', e.target.value !== 'scheduled');
            });
        });

        async function purchaseGift() {
            const recipientName = document.getElementById('recipientName').value;
            const recipientEmail = document.getElementById('recipientEmail').value;
            const message = document.getElementById('giftMessage').value;
            const deliveryType = document.querySelector('input[name="deliveryType"]:checked').value;
            const deliveryDate = deliveryType === 'scheduled' ? document.getElementById('deliveryDate').value : null;

            if (!recipientName || !recipientEmail) {
                alert('Please fill in recipient details');
                return;
            }

            try {
                const response = await fetch('/api/payments/create-gift-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        plan: selectedPlan,
                        recipientName,
                        recipientEmail,
                        message,
                        deliveryDate,
                        purchaserUserId: localStorage.getItem('userId')
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.checkoutUrl) {
                        window.location.href = data.checkoutUrl;
                    }
                } else {
                    throw new Error('Failed to create checkout');
                }
            } catch (error) {
                console.error('Purchase error:', error);
                alert('Failed to process gift purchase. Please try again.');
            }
        }

        // Initialize
        updateSummary();
    </script>
</body>
</html>`;
