// Post-Donation Thank You Page with social sharing
// Reads donation details from URL query params set by Stripe redirect
export const donateThankyouHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You! - Let's Help These Kids | Better Together</title>
    <meta name="description" content="Thank you for your generous donation to help kids in need.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        @keyframes confetti-fall {
            0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .confetti-piece {
            position: fixed;
            width: 10px;
            height: 10px;
            top: -10px;
            z-index: 0;
            animation: confetti-fall linear forwards;
        }
        @keyframes check-pop {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        .check-icon { animation: check-pop 0.6s ease-out forwards; }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .share-btn { transition: all 0.2s ease; }
        .share-btn:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }
    </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-green-50 via-pink-50 to-purple-50">

    <!-- Confetti Container (populated by JS) -->
    <div id="confettiContainer"></div>

    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <div class="flex justify-between items-center h-16">
                <a href="/" class="flex items-center">
                    <span class="text-2xl">💕</span>
                    <span class="ml-2 text-xl font-bold text-gray-900">Better Together</span>
                </a>
                <a href="/donate" class="text-pink-600 hover:text-pink-700 font-medium text-sm">
                    <i class="fas fa-heart mr-1"></i> Donate Again
                </a>
            </div>
        </div>
    </nav>

    <div class="max-w-2xl mx-auto px-4 py-12 md:py-16 relative z-10">

        <!-- Success Icon -->
        <div class="text-center mb-8">
            <div class="check-icon w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl mb-6">
                <i class="fas fa-check text-white text-4xl"></i>
            </div>
            <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 fade-in-up">Thank You!</h1>
            <p class="text-lg text-gray-600 fade-in-up" style="animation-delay: 0.1s" id="thankYouSubtext">
                Your generosity is making a real difference.
            </p>
        </div>

        <!-- Donation Summary Card -->
        <div class="glass-card rounded-3xl shadow-xl p-8 mb-8 text-center fade-in-up" style="animation-delay: 0.2s">
            <div class="mb-4">
                <span class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Your Donation</span>
            </div>
            <div class="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2" id="donationAmount">
                $50
            </div>
            <div id="donationTypeLabel" class="text-gray-500 font-medium mb-6">One-time donation</div>

            <!-- Impact -->
            <div class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-5 border border-pink-100">
                <p class="text-pink-700 font-semibold" id="impactMessage">
                    <i class="fas fa-heart text-pink-500 mr-1"></i>
                    Your $50 provides school supplies for 1 kid for an entire semester
                </p>
            </div>
        </div>

        <!-- What Happens Next -->
        <div class="glass-card rounded-3xl shadow-lg p-6 mb-8 fade-in-up" style="animation-delay: 0.3s">
            <h2 class="font-bold text-gray-900 mb-4 text-center">What Happens Next</h2>
            <div class="space-y-4">
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i class="fas fa-envelope text-green-600 text-sm"></i>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-800 text-sm">Confirmation Email</p>
                        <p class="text-gray-500 text-sm">A receipt has been sent to your email</p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i class="fas fa-hands-helping text-blue-600 text-sm"></i>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-800 text-sm">Funds Allocated</p>
                        <p class="text-gray-500 text-sm">100% of your donation goes directly to kid-focused programs</p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i class="fas fa-chart-line text-purple-600 text-sm"></i>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-800 text-sm">Impact Updates</p>
                        <p class="text-gray-500 text-sm">We'll share stories of the kids you've helped</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Social Sharing -->
        <div class="glass-card rounded-3xl shadow-lg p-6 mb-8 fade-in-up" style="animation-delay: 0.4s">
            <h2 class="font-bold text-gray-900 mb-2 text-center">Spread the Word</h2>
            <p class="text-gray-500 text-sm text-center mb-5">Help us reach more people who want to make a difference</p>
            <div class="flex flex-wrap justify-center gap-3">
                <button onclick="shareOnFacebook()" class="share-btn flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold text-sm">
                    <i class="fab fa-facebook-f"></i> Facebook
                </button>
                <button onclick="shareOnTwitter()" class="share-btn flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-semibold text-sm">
                    <i class="fab fa-x-twitter"></i> Post
                </button>
                <button onclick="copyLink()" id="copyLinkBtn" class="share-btn flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-3 rounded-xl font-semibold text-sm border border-gray-200">
                    <i class="fas fa-link"></i> <span id="copyLinkText">Copy Link</span>
                </button>
            </div>
        </div>

        <!-- Back to Home -->
        <div class="text-center fade-in-up" style="animation-delay: 0.5s">
            <a href="/" class="inline-flex items-center gap-2 text-gray-500 hover:text-pink-600 font-medium transition-colors">
                <i class="fas fa-arrow-left"></i> Back to Better Together
            </a>
        </div>
    </div>

    <script>
        // Parse URL params from Stripe redirect
        const params = new URLSearchParams(window.location.search);
        const amount = parseInt(params.get('amount') || '0');
        const type = params.get('type') || 'onetime';

        const impactMessages = {
            25: 'Your $25 provides books and reading materials for 1 child',
            50: 'Your $50 provides school supplies for 1 kid for an entire semester',
            100: 'Your $100 gives after-school program access for 1 child for a month',
            250: 'Your $250 funds a full tutoring package for 1 student for 3 months',
            500: 'Your $500 provides technology access and mentorship for 1 child for a year',
        };

        if (amount > 0) {
            document.getElementById('donationAmount').textContent = '$' + amount;
            document.getElementById('donationTypeLabel').textContent =
                type === 'monthly' ? 'Monthly recurring donation' : 'One-time donation';

            const impact = impactMessages[amount] || 'Your $' + amount + ' donation helps change children\\'s lives';
            document.getElementById('impactMessage').innerHTML =
                '<i class="fas fa-heart text-pink-500 mr-1"></i> ' + impact;

            if (type === 'monthly') {
                document.getElementById('thankYouSubtext').textContent =
                    'Your monthly support creates lasting, reliable impact for kids in need.';
            }
        }

        // Confetti animation
        function createConfetti() {
            const container = document.getElementById('confettiContainer');
            const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
            for (let i = 0; i < 50; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.left = Math.random() * 100 + 'vw';
                piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                piece.style.width = (Math.random() * 8 + 5) + 'px';
                piece.style.height = (Math.random() * 8 + 5) + 'px';
                piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                piece.style.animationDuration = (Math.random() * 3 + 2) + 's';
                piece.style.animationDelay = (Math.random() * 2) + 's';
                container.appendChild(piece);
            }
            // Clean up after animation
            setTimeout(() => { container.innerHTML = ''; }, 7000);
        }

        createConfetti();

        // Social sharing
        const shareUrl = window.location.origin + '/donate';
        const shareText = 'I just donated to help kids through Better Together! Join me in making a difference.';

        function shareOnFacebook() {
            window.open(
                'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(shareUrl) + '&quote=' + encodeURIComponent(shareText),
                '_blank', 'width=600,height=400'
            );
        }

        function shareOnTwitter() {
            window.open(
                'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(shareUrl),
                '_blank', 'width=600,height=400'
            );
        }

        function copyLink() {
            navigator.clipboard.writeText(shareUrl).then(() => {
                const textEl = document.getElementById('copyLinkText');
                textEl.textContent = 'Copied!';
                setTimeout(() => { textEl.textContent = 'Copy Link'; }, 2000);
            });
        }
    </script>
</body>
</html>`;
