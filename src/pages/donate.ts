// Donate Page - "Let's Help These Kids" nonprofit donation page
// Preset amounts with impact messaging, one-time vs monthly toggle, mobile-optimized
export const donatePageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donate - Let's Help These Kids | Better Together</title>
    <meta name="description" content="Make a donation to help kids in need. Every dollar makes a difference.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .amount-btn { transition: all 0.2s ease; }
        .amount-btn:hover { transform: translateY(-2px); }
        .amount-btn.selected {
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            color: white;
            border-color: transparent;
            box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
        }
        .toggle-container { position: relative; width: 280px; height: 48px; background: #f3f4f6; border-radius: 9999px; padding: 4px; }
        .toggle-slider { position: absolute; top: 4px; width: calc(50% - 4px); height: 40px; background: linear-gradient(135deg, #ec4899, #8b5cf6); border-radius: 9999px; transition: left 0.3s ease; }
        .toggle-slider.monthly { left: calc(50%); }
        .toggle-slider.onetime { left: 4px; }
        .toggle-label { position: relative; z-index: 1; width: 50%; text-align: center; line-height: 48px; font-weight: 600; font-size: 14px; cursor: pointer; transition: color 0.3s ease; }
        .toggle-label.active { color: white; }
        .toggle-label:not(.active) { color: #6b7280; }
        .impact-card { transition: all 0.3s ease; }
        .impact-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        .float-animation { animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.3); } 50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.6); } }
        .donate-btn { animation: pulse-glow 2s ease-in-out infinite; }
        .donate-btn:hover { animation: none; box-shadow: 0 8px 30px rgba(236, 72, 153, 0.5); transform: translateY(-2px); }
    </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">

    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="flex justify-between items-center h-16">
                <a href="/" class="flex items-center">
                    <span class="text-2xl">💕</span>
                    <span class="ml-2 text-xl font-bold text-gray-900">Better Together</span>
                </a>
                <a href="/" class="text-gray-600 hover:text-pink-600 font-medium text-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Home
                </a>
            </div>
        </div>
    </nav>

    <div class="max-w-4xl mx-auto px-4 py-8 md:py-12">

        <!-- Hero Section -->
        <div class="text-center mb-10">
            <div class="float-animation inline-block mb-4">
                <div class="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl mx-auto">
                    <span class="text-5xl">🤝</span>
                </div>
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Let's Help These Kids</h1>
            <p class="text-lg text-gray-600 max-w-xl mx-auto">Every donation directly supports children in need. Together, we can make a lasting difference in their lives.</p>
        </div>

        <!-- Donation Form Card -->
        <div class="glass-card rounded-3xl shadow-xl p-6 md:p-10 mb-10">

            <!-- One-time / Monthly Toggle -->
            <div class="flex justify-center mb-8">
                <div class="toggle-container flex items-center">
                    <div class="toggle-slider onetime" id="toggleSlider"></div>
                    <div class="toggle-label active" id="labelOnetime" onclick="setDonationType('onetime')">One-Time</div>
                    <div class="toggle-label" id="labelMonthly" onclick="setDonationType('monthly')">Monthly</div>
                </div>
            </div>

            <!-- Preset Amounts -->
            <div class="mb-8">
                <p class="text-center text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Select Amount</p>
                <div class="grid grid-cols-3 md:grid-cols-6 gap-3" id="amountGrid">
                    <button class="amount-btn rounded-xl border-2 border-gray-200 py-3 px-2 text-center font-bold text-gray-800 text-lg bg-white" onclick="selectAmount(25)" data-amount="25">$25</button>
                    <button class="amount-btn rounded-xl border-2 border-gray-200 py-3 px-2 text-center font-bold text-gray-800 text-lg bg-white selected" onclick="selectAmount(50)" data-amount="50">$50</button>
                    <button class="amount-btn rounded-xl border-2 border-gray-200 py-3 px-2 text-center font-bold text-gray-800 text-lg bg-white" onclick="selectAmount(100)" data-amount="100">$100</button>
                    <button class="amount-btn rounded-xl border-2 border-gray-200 py-3 px-2 text-center font-bold text-gray-800 text-lg bg-white" onclick="selectAmount(250)" data-amount="250">$250</button>
                    <button class="amount-btn rounded-xl border-2 border-gray-200 py-3 px-2 text-center font-bold text-gray-800 text-lg bg-white" onclick="selectAmount(500)" data-amount="500">$500</button>
                    <button class="amount-btn rounded-xl border-2 border-gray-200 py-3 px-2 text-center font-bold text-gray-800 text-lg bg-white" onclick="selectCustom()" data-amount="custom" id="customBtn">Other</button>
                </div>

                <!-- Custom Amount Input (hidden by default) -->
                <div id="customAmountWrap" class="hidden mt-4 max-w-xs mx-auto">
                    <div class="relative">
                        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-bold">$</span>
                        <input type="number" id="customAmountInput" min="1" max="99999" placeholder="Enter amount"
                            class="w-full pl-10 pr-4 py-3 text-xl font-bold text-center border-2 border-pink-300 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none"
                            oninput="updateCustomAmount()">
                    </div>
                </div>
            </div>

            <!-- Impact Message -->
            <div id="impactMessage" class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 mb-8 text-center border border-pink-100">
                <p class="text-pink-700 font-semibold text-base">
                    <i class="fas fa-heart text-pink-500 mr-1"></i>
                    <span id="impactText">$50 = School supplies for 1 kid for an entire semester</span>
                </p>
            </div>

            <!-- Donor Info -->
            <div class="space-y-4 mb-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">First Name <span class="text-gray-400">(optional)</span></label>
                        <input type="text" id="donorFirstName" placeholder="Jane"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Last Name <span class="text-gray-400">(optional)</span></label>
                        <input type="text" id="donorLastName" placeholder="Doe"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-400">*</span></label>
                    <input type="email" id="donorEmail" placeholder="jane@example.com" required
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none">
                </div>
                <div class="flex items-center">
                    <input type="checkbox" id="anonymousCheck" class="w-4 h-4 text-pink-500 rounded border-gray-300 focus:ring-pink-400">
                    <label for="anonymousCheck" class="ml-2 text-sm text-gray-600">Make my donation anonymous</label>
                </div>
            </div>

            <!-- Donate Button -->
            <button id="donateBtn" onclick="submitDonation()"
                class="donate-btn w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2">
                <i class="fas fa-heart"></i>
                <span id="donateBtnText">Donate $50</span>
            </button>

            <p class="text-center text-xs text-gray-400 mt-3">
                <i class="fas fa-lock mr-1"></i> Secure payment powered by Stripe. Your data is encrypted.
            </p>

            <!-- Error Message -->
            <div id="errorMessage" class="hidden mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center"></div>
        </div>

        <!-- Impact Cards -->
        <div class="mb-12">
            <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">Your Impact</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="impact-card bg-white rounded-2xl p-6 shadow-md text-center">
                    <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">📚</span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-1">$25</h3>
                    <p class="text-gray-600 text-sm">Provides books and reading materials for 1 child</p>
                </div>
                <div class="impact-card bg-white rounded-2xl p-6 shadow-md text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">🎒</span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-1">$50</h3>
                    <p class="text-gray-600 text-sm">School supplies for 1 kid for an entire semester</p>
                </div>
                <div class="impact-card bg-white rounded-2xl p-6 shadow-md text-center">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">🏫</span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-1">$100</h3>
                    <p class="text-gray-600 text-sm">After-school program access for 1 child for a month</p>
                </div>
                <div class="impact-card bg-white rounded-2xl p-6 shadow-md text-center">
                    <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">🎓</span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-1">$250</h3>
                    <p class="text-gray-600 text-sm">Full tutoring package for 1 student for 3 months</p>
                </div>
                <div class="impact-card bg-white rounded-2xl p-6 shadow-md text-center">
                    <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">💻</span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-1">$500</h3>
                    <p class="text-gray-600 text-sm">Technology access and mentorship for 1 child for a year</p>
                </div>
                <div class="impact-card bg-white rounded-2xl p-6 shadow-md text-center">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-3xl">❤️</span>
                    </div>
                    <h3 class="font-bold text-gray-900 mb-1">Every $1</h3>
                    <p class="text-gray-600 text-sm">100% goes directly to programs that support kids</p>
                </div>
            </div>
        </div>

        <!-- Trust Signals -->
        <div class="text-center pb-12">
            <div class="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
                <span><i class="fas fa-shield-alt mr-1"></i> SSL Encrypted</span>
                <span><i class="fab fa-stripe mr-1"></i> Powered by Stripe</span>
                <span><i class="fas fa-hand-holding-heart mr-1"></i> 501(c)(3) Nonprofit</span>
            </div>
        </div>

    </div>

    <script>
        let selectedAmount = 50;
        let donationType = 'onetime'; // 'onetime' or 'monthly'
        let isCustom = false;

        const impactMessages = {
            25: '$25 = Books and reading materials for 1 child',
            50: '$50 = School supplies for 1 kid for an entire semester',
            100: '$100 = After-school program access for 1 child for a month',
            250: '$250 = Full tutoring package for 1 student for 3 months',
            500: '$500 = Technology access and mentorship for 1 child for a year',
        };

        function selectAmount(amount) {
            selectedAmount = amount;
            isCustom = false;
            document.getElementById('customAmountWrap').classList.add('hidden');
            document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
            const btn = document.querySelector('[data-amount="' + amount + '"]');
            if (btn) btn.classList.add('selected');
            updateUI();
        }

        function selectCustom() {
            isCustom = true;
            document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
            document.getElementById('customBtn').classList.add('selected');
            document.getElementById('customAmountWrap').classList.remove('hidden');
            document.getElementById('customAmountInput').focus();
            const val = parseInt(document.getElementById('customAmountInput').value);
            if (val > 0) selectedAmount = val;
            updateUI();
        }

        function updateCustomAmount() {
            const val = parseInt(document.getElementById('customAmountInput').value);
            if (val > 0) {
                selectedAmount = val;
                updateUI();
            }
        }

        function setDonationType(type) {
            donationType = type;
            const slider = document.getElementById('toggleSlider');
            const labelOnetime = document.getElementById('labelOnetime');
            const labelMonthly = document.getElementById('labelMonthly');
            if (type === 'monthly') {
                slider.className = 'toggle-slider monthly';
                labelMonthly.classList.add('active');
                labelOnetime.classList.remove('active');
            } else {
                slider.className = 'toggle-slider onetime';
                labelOnetime.classList.add('active');
                labelMonthly.classList.remove('active');
            }
            updateUI();
        }

        function updateUI() {
            const prefix = donationType === 'monthly' ? 'Donate $' + selectedAmount + '/month' : 'Donate $' + selectedAmount;
            document.getElementById('donateBtnText').textContent = prefix;

            // Impact message
            const impact = impactMessages[selectedAmount];
            if (impact) {
                document.getElementById('impactText').textContent = donationType === 'monthly'
                    ? impact.replace('=', 'per month =')
                    : impact;
            } else if (selectedAmount > 0) {
                document.getElementById('impactText').textContent = '$' + selectedAmount + ' helps change a child\\'s life';
            }
        }

        async function submitDonation() {
            const email = document.getElementById('donorEmail').value.trim();
            const firstName = document.getElementById('donorFirstName').value.trim();
            const lastName = document.getElementById('donorLastName').value.trim();
            const anonymous = document.getElementById('anonymousCheck').checked;
            const errorDiv = document.getElementById('errorMessage');
            const btn = document.getElementById('donateBtn');
            const btnText = document.getElementById('donateBtnText');

            errorDiv.classList.add('hidden');

            if (!email) {
                errorDiv.textContent = 'Please enter your email address.';
                errorDiv.classList.remove('hidden');
                return;
            }

            if (!selectedAmount || selectedAmount < 1) {
                errorDiv.textContent = 'Please select or enter a donation amount.';
                errorDiv.classList.remove('hidden');
                return;
            }

            btn.disabled = true;
            btnText.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';

            try {
                const res = await fetch('/api/donations/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: selectedAmount,
                        type: donationType,
                        email: email,
                        firstName: firstName || undefined,
                        lastName: lastName || undefined,
                        anonymous: anonymous,
                    }),
                });

                const data = await res.json();

                if (!res.ok || !data.url) {
                    throw new Error(data.error || 'Failed to create checkout session');
                }

                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } catch (err) {
                errorDiv.textContent = err.message || 'Something went wrong. Please try again.';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btnText.innerHTML = '<i class="fas fa-heart mr-1"></i> Donate $' + selectedAmount;
            }
        }

        // Initialize
        updateUI();
    </script>
</body>
</html>`;
