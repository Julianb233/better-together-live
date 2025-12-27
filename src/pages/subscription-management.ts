// Subscription Management Page
export const subscriptionManagementHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Subscription - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8">
    <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="flex items-center mb-8">
            <a href="/portal" class="mr-4 text-gray-600 hover:text-pink-600 transition">
                <i class="fas fa-arrow-left text-xl"></i>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Subscription</h1>
                <p class="text-gray-600">Manage your premium membership</p>
            </div>
        </div>

        <!-- Current Plan Card -->
        <div id="currentPlanSection" class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <div class="text-sm text-gray-500 mb-1">Current Plan</div>
                    <h2 class="text-xl font-bold text-gray-900" id="planName">Loading...</h2>
                </div>
                <div id="planBadge" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    Active
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="p-4 bg-gray-50 rounded-xl">
                    <div class="text-sm text-gray-500 mb-1">Billing Cycle</div>
                    <div class="font-semibold text-gray-900" id="billingCycle">-</div>
                </div>
                <div class="p-4 bg-gray-50 rounded-xl">
                    <div class="text-sm text-gray-500 mb-1">Next Billing</div>
                    <div class="font-semibold text-gray-900" id="nextBilling">-</div>
                </div>
                <div class="p-4 bg-gray-50 rounded-xl">
                    <div class="text-sm text-gray-500 mb-1">Amount</div>
                    <div class="font-semibold text-gray-900" id="amount">-</div>
                </div>
                <div class="p-4 bg-gray-50 rounded-xl">
                    <div class="text-sm text-gray-500 mb-1">Member Since</div>
                    <div class="font-semibold text-gray-900" id="memberSince">-</div>
                </div>
            </div>

            <!-- Premium Features -->
            <div class="border-t pt-4">
                <h3 class="font-medium text-gray-900 mb-3">Your Premium Benefits</h3>
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        AI Relationship Coach
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        Unlimited Check-ins
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        All Challenges
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        Priority Support
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        Analytics Dashboard
                    </div>
                    <div class="flex items-center text-sm text-gray-600">
                        <i class="fas fa-check-circle text-green-500 mr-2"></i>
                        Exclusive Content
                    </div>
                </div>
            </div>
        </div>

        <!-- Free Plan Section (hidden when premium) -->
        <div id="freePlanSection" class="hidden glass-card rounded-2xl p-6 shadow-lg mb-6">
            <div class="text-center py-6">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-user text-gray-400 text-2xl"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">Free Plan</h2>
                <p class="text-gray-600 mb-6">Upgrade to unlock all premium features</p>
                <a href="/premium-pricing" class="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition">
                    <i class="fas fa-crown mr-2"></i>Upgrade to Premium
                </a>
            </div>
        </div>

        <!-- Payment Method -->
        <div id="paymentSection" class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-credit-card text-pink-500 mr-2"></i>
                Payment Method
            </h2>

            <div id="paymentMethod" class="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                <div class="flex items-center">
                    <div class="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center mr-3">
                        <i class="fab fa-cc-visa text-white"></i>
                    </div>
                    <div>
                        <div class="font-medium text-gray-900" id="cardInfo">•••• •••• •••• 4242</div>
                        <div class="text-sm text-gray-500" id="cardExpiry">Expires 12/25</div>
                    </div>
                </div>
                <button onclick="updatePaymentMethod()" class="text-pink-600 hover:text-pink-700 text-sm font-medium">
                    Update
                </button>
            </div>

            <button onclick="openBillingPortal()" class="w-full py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
                <i class="fas fa-external-link-alt mr-2"></i>
                Open Billing Portal
            </button>
        </div>

        <!-- Billing History -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-receipt text-pink-500 mr-2"></i>
                Billing History
            </h2>

            <div id="billingHistory" class="space-y-3">
                <div class="text-gray-500 text-center py-4">Loading...</div>
            </div>
        </div>

        <!-- Subscription Actions -->
        <div id="subscriptionActions" class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">Subscription Options</h2>

            <div class="space-y-3">
                <button onclick="changePlan()" class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div class="flex items-center">
                        <i class="fas fa-exchange-alt text-gray-500 mr-3"></i>
                        <span class="text-gray-700">Change Plan</span>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </button>

                <button onclick="pauseSubscription()" class="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div class="flex items-center">
                        <i class="fas fa-pause-circle text-gray-500 mr-3"></i>
                        <span class="text-gray-700">Pause Subscription</span>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </button>

                <button onclick="cancelSubscription()" class="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition">
                    <div class="flex items-center">
                        <i class="fas fa-times-circle text-red-500 mr-3"></i>
                        <span class="text-red-700">Cancel Subscription</span>
                    </div>
                    <i class="fas fa-chevron-right text-red-400"></i>
                </button>
            </div>
        </div>

        <!-- Gift a Subscription -->
        <div class="glass-card rounded-2xl p-6 shadow-lg">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="font-semibold text-gray-900">Gift Better Together</h2>
                    <p class="text-sm text-gray-600">Share the love with someone special</p>
                </div>
                <a href="/gift-subscription" class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-pink-700 hover:to-purple-700 transition">
                    <i class="fas fa-gift mr-2"></i>Send Gift
                </a>
            </div>
        </div>
    </div>

    <!-- Cancel Modal -->
    <div id="cancelModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-heart-broken text-red-500 text-2xl"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">We're sad to see you go</h2>
                <p class="text-gray-600">Are you sure you want to cancel? You'll lose access to all premium features.</p>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Help us improve - why are you canceling?</label>
                <select id="cancelReason" class="w-full px-4 py-3 border border-gray-200 rounded-xl">
                    <option value="">Select a reason</option>
                    <option value="too_expensive">Too expensive</option>
                    <option value="not_using">Not using enough</option>
                    <option value="missing_features">Missing features I need</option>
                    <option value="technical_issues">Technical issues</option>
                    <option value="other">Other reason</option>
                </select>
            </div>

            <div class="flex gap-3">
                <button onclick="closeCancelModal()" class="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition font-medium">
                    Keep Subscription
                </button>
                <button onclick="confirmCancel()" class="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-medium">
                    Confirm Cancel
                </button>
            </div>
        </div>
    </div>

    <script>
        let subscriptionData = null;

        async function loadSubscription() {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                window.location.href = '/login';
                return;
            }

            try {
                const response = await fetch('/api/payments/subscription-status?userId=' + userId);
                if (response.ok) {
                    subscriptionData = await response.json();
                    renderSubscription();
                }
            } catch (error) {
                console.error('Load error:', error);
            }
        }

        function renderSubscription() {
            const isPremium = subscriptionData?.status === 'active';

            document.getElementById('currentPlanSection').classList.toggle('hidden', !isPremium);
            document.getElementById('freePlanSection').classList.toggle('hidden', isPremium);
            document.getElementById('paymentSection').classList.toggle('hidden', !isPremium);
            document.getElementById('subscriptionActions').classList.toggle('hidden', !isPremium);

            if (isPremium) {
                const planNames = {
                    monthly: 'Monthly Premium',
                    biannual: '6-Month Premium',
                    annual: 'Annual Premium'
                };

                document.getElementById('planName').textContent = planNames[subscriptionData.plan] || 'Premium';
                document.getElementById('billingCycle').textContent = subscriptionData.interval || 'Monthly';
                document.getElementById('nextBilling').textContent = subscriptionData.currentPeriodEnd
                    ? new Date(subscriptionData.currentPeriodEnd).toLocaleDateString()
                    : '-';
                document.getElementById('amount').textContent = subscriptionData.amount
                    ? '$' + (subscriptionData.amount / 100).toFixed(2)
                    : '-';
                document.getElementById('memberSince').textContent = subscriptionData.startDate
                    ? new Date(subscriptionData.startDate).toLocaleDateString()
                    : '-';

                if (subscriptionData.cancelAtPeriodEnd) {
                    document.getElementById('planBadge').textContent = 'Canceling';
                    document.getElementById('planBadge').classList.remove('bg-green-100', 'text-green-700');
                    document.getElementById('planBadge').classList.add('bg-yellow-100', 'text-yellow-700');
                }
            }

            loadBillingHistory();
        }

        async function loadBillingHistory() {
            const userId = localStorage.getItem('userId');

            try {
                const response = await fetch('/api/payments/billing-history?userId=' + userId);
                if (response.ok) {
                    const data = await response.json();
                    renderBillingHistory(data.invoices || []);
                }
            } catch (error) {
                console.error('Load billing error:', error);
                document.getElementById('billingHistory').innerHTML = '<div class="text-gray-500 text-center py-4">No billing history</div>';
            }
        }

        function renderBillingHistory(invoices) {
            const container = document.getElementById('billingHistory');

            if (invoices.length === 0) {
                container.innerHTML = '<div class="text-gray-500 text-center py-4">No billing history yet</div>';
                return;
            }

            container.innerHTML = invoices.slice(0, 5).map(invoice => \`
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                        <div class="font-medium text-gray-900">$\${(invoice.amount / 100).toFixed(2)}</div>
                        <div class="text-sm text-gray-500">\${new Date(invoice.date).toLocaleDateString()}</div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-2 py-1 \${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} rounded-full text-xs capitalize">
                            \${invoice.status}
                        </span>
                        \${invoice.receiptUrl ? \`
                            <a href="\${invoice.receiptUrl}" target="_blank" class="text-pink-600 hover:text-pink-700">
                                <i class="fas fa-download"></i>
                            </a>
                        \` : ''}
                    </div>
                </div>
            \`).join('');
        }

        async function openBillingPortal() {
            const userId = localStorage.getItem('userId');

            try {
                const response = await fetch('/api/payments/create-portal-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.url) {
                        window.location.href = data.url;
                    }
                }
            } catch (error) {
                console.error('Portal error:', error);
                alert('Failed to open billing portal');
            }
        }

        function updatePaymentMethod() {
            openBillingPortal();
        }

        function changePlan() {
            window.location.href = '/premium-pricing';
        }

        async function pauseSubscription() {
            if (!confirm('Pause your subscription? You can resume anytime.')) return;

            try {
                const response = await fetch('/api/payments/pause-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: localStorage.getItem('userId') })
                });

                if (response.ok) {
                    alert('Subscription paused. You can resume from this page anytime.');
                    loadSubscription();
                }
            } catch (error) {
                console.error('Pause error:', error);
                alert('Failed to pause subscription');
            }
        }

        function cancelSubscription() {
            document.getElementById('cancelModal').classList.remove('hidden');
        }

        function closeCancelModal() {
            document.getElementById('cancelModal').classList.add('hidden');
        }

        async function confirmCancel() {
            const reason = document.getElementById('cancelReason').value;

            try {
                const response = await fetch('/api/payments/cancel-subscription', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: localStorage.getItem('userId'),
                        reason
                    })
                });

                if (response.ok) {
                    closeCancelModal();
                    alert('Your subscription has been canceled. You will have access until the end of your billing period.');
                    loadSubscription();
                }
            } catch (error) {
                console.error('Cancel error:', error);
                alert('Failed to cancel subscription');
            }
        }

        loadSubscription();
    </script>
</body>
</html>`;
