// Partner Invitation Page
export const partnerInviteHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invite Your Partner - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .float-animation { animation: float 3s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8">
    <div class="max-w-lg mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
            <div class="float-animation inline-block mb-4">
                <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                    <span class="text-4xl">💕</span>
                </div>
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Invite Your Partner</h1>
            <p class="text-gray-600">Start your relationship journey together</p>
        </div>

        <!-- Invite Form -->
        <div class="glass-card rounded-2xl p-8 shadow-xl mb-6">
            <form id="inviteForm" onsubmit="sendInvite(event)">
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Partner's Email</label>
                    <div class="relative">
                        <input
                            type="email"
                            id="partnerEmail"
                            placeholder="partner@email.com"
                            required
                            class="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
                        >
                        <i class="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Relationship Type</label>
                    <select id="relationshipType" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <option value="dating">Dating</option>
                        <option value="engaged">Engaged</option>
                        <option value="married">Married</option>
                        <option value="partnership">Long-term Partnership</option>
                    </select>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Relationship Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                </div>

                <div class="mb-8">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
                    <textarea
                        id="message"
                        rows="3"
                        placeholder="Add a personal note to your invitation..."
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
                >
                    <i class="fas fa-paper-plane mr-2"></i>
                    Send Invitation
                </button>
            </form>
        </div>

        <!-- How It Works -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">How It Works</h2>
            <div class="space-y-4">
                <div class="flex items-start">
                    <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-pink-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                        <div class="font-medium text-gray-800">Send Invitation</div>
                        <p class="text-sm text-gray-600">Your partner receives an email invitation</p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-purple-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                        <div class="font-medium text-gray-800">Partner Signs Up</div>
                        <p class="text-sm text-gray-600">They create an account (or log in)</p>
                    </div>
                </div>
                <div class="flex items-start">
                    <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span class="text-indigo-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                        <div class="font-medium text-gray-800">Get Connected</div>
                        <p class="text-sm text-gray-600">Start your journey together!</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Share Link Option -->
        <div class="glass-card rounded-2xl p-6 shadow-lg">
            <h2 class="font-semibold text-gray-900 mb-4">Or Share a Link</h2>
            <div class="flex gap-2">
                <input
                    type="text"
                    id="inviteLink"
                    readonly
                    value="Loading..."
                    class="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-sm"
                >
                <button
                    onclick="copyLink()"
                    class="px-4 py-3 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200 transition"
                >
                    <i class="fas fa-copy"></i>
                </button>
            </div>
            <p class="text-sm text-gray-500 mt-2">Share this link directly with your partner</p>
        </div>
    </div>

    <!-- Success Modal -->
    <div id="successModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-check-circle text-green-600 text-4xl"></i>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Invitation Sent!</h2>
            <p class="text-gray-600 mb-6">We've sent an invitation to your partner. They'll receive an email shortly.</p>
            <button onclick="closeModal()" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold">
                Got It
            </button>
        </div>
    </div>

    <script>
        // Generate invite link on load
        async function generateInviteLink() {
            const userId = localStorage.getItem('userId');
            if (userId) {
                document.getElementById('inviteLink').value =
                    window.location.origin + '/accept-invite?from=' + userId;
            }
        }

        async function sendInvite(e) {
            e.preventDefault();

            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in first');
                window.location.href = '/login';
                return;
            }

            const data = {
                inviterUserId: userId,
                partnerEmail: document.getElementById('partnerEmail').value,
                relationshipType: document.getElementById('relationshipType').value,
                startDate: document.getElementById('startDate').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('/api/relationships/invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    document.getElementById('successModal').classList.remove('hidden');
                } else {
                    const result = await response.json();
                    alert(result.error || 'Failed to send invitation');
                }
            } catch (error) {
                console.error('Invite error:', error);
                alert('Failed to send invitation');
            }
        }

        function copyLink() {
            const input = document.getElementById('inviteLink');
            input.select();
            document.execCommand('copy');
            alert('Link copied to clipboard!');
        }

        function closeModal() {
            document.getElementById('successModal').classList.add('hidden');
            window.location.href = '/portal';
        }

        generateInviteLink();
    </script>
</body>
</html>`;
