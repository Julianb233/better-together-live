// Relationship Status Page
export const relationshipStatusHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relationship Status - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-4px); }
        .progress-ring { transform: rotate(-90deg); transform-origin: 50% 50%; }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
                <a href="/portal" class="mr-4 text-gray-600 hover:text-pink-600 transition">
                    <i class="fas fa-arrow-left text-xl"></i>
                </a>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Relationship Status</h1>
                    <p class="text-gray-600">Your journey together</p>
                </div>
            </div>
            <button onclick="editRelationship()" class="px-4 py-2 text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition">
                <i class="fas fa-edit mr-2"></i>Edit
            </button>
        </div>

        <!-- Partner Connection Card -->
        <div class="glass-card rounded-2xl p-8 shadow-xl mb-6">
            <div class="flex flex-col md:flex-row items-center gap-6">
                <!-- You -->
                <div class="text-center">
                    <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span class="text-white text-2xl font-bold" id="userInitial">Y</span>
                    </div>
                    <div class="font-semibold text-gray-900" id="userName">You</div>
                </div>

                <!-- Connection -->
                <div class="flex-1 flex items-center justify-center">
                    <div class="w-full max-w-xs">
                        <div class="flex items-center justify-center mb-2">
                            <div class="h-1 flex-1 bg-gradient-to-r from-pink-300 to-pink-500 rounded-full"></div>
                            <div class="mx-4">
                                <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                                    <i class="fas fa-heart text-white"></i>
                                </div>
                            </div>
                            <div class="h-1 flex-1 bg-gradient-to-l from-purple-300 to-purple-500 rounded-full"></div>
                        </div>
                        <div class="text-center">
                            <span class="text-2xl font-bold text-gray-900" id="daysTogether">0</span>
                            <span class="text-gray-600"> days together</span>
                        </div>
                    </div>
                </div>

                <!-- Partner -->
                <div class="text-center">
                    <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <span class="text-white text-2xl font-bold" id="partnerInitial">P</span>
                    </div>
                    <div class="font-semibold text-gray-900" id="partnerName">Partner</div>
                </div>
            </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid md:grid-cols-3 gap-4 mb-6">
            <div class="stat-card glass-card rounded-xl p-6 shadow-lg text-center">
                <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-calendar-heart text-pink-600 text-xl"></i>
                </div>
                <div class="text-2xl font-bold text-gray-900" id="activitiesCount">0</div>
                <div class="text-gray-600 text-sm">Activities Together</div>
            </div>

            <div class="stat-card glass-card rounded-xl p-6 shadow-lg text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-bullseye text-purple-600 text-xl"></i>
                </div>
                <div class="text-2xl font-bold text-gray-900" id="goalsCompleted">0</div>
                <div class="text-gray-600 text-sm">Goals Achieved</div>
            </div>

            <div class="stat-card glass-card rounded-xl p-6 shadow-lg text-center">
                <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <i class="fas fa-fire text-green-600 text-xl"></i>
                </div>
                <div class="text-2xl font-bold text-gray-900" id="checkinStreak">0</div>
                <div class="text-gray-600 text-sm">Day Check-in Streak</div>
            </div>
        </div>

        <!-- Relationship Details -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">Relationship Details</h2>

            <div class="grid md:grid-cols-2 gap-4">
                <div class="p-4 bg-gray-50 rounded-xl">
                    <div class="text-sm text-gray-600 mb-1">Relationship Type</div>
                    <div class="font-semibold text-gray-900 capitalize" id="relationshipType">-</div>
                </div>

                <div class="p-4 bg-gray-50 rounded-xl">
                    <div class="text-sm text-gray-600 mb-1">Started On</div>
                    <div class="font-semibold text-gray-900" id="startDate">-</div>
                </div>

                <div class="p-4 bg-gray-50 rounded-xl">
                    <div class="text-sm text-gray-600 mb-1">Anniversary</div>
                    <div class="font-semibold text-gray-900" id="anniversary">-</div>
                </div>

                <div class="p-4 bg-gray-50 rounded-xl">
                    <div class="text-sm text-gray-600 mb-1">Status</div>
                    <div class="flex items-center">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span class="font-semibold text-green-600" id="status">Active</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Love Languages Comparison -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">Love Languages</h2>

            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <div class="text-sm text-gray-600 mb-2">Your Love Languages</div>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm" id="yourPrimary">-</span>
                        <span class="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm" id="yourSecondary">-</span>
                    </div>
                </div>

                <div>
                    <div class="text-sm text-gray-600 mb-2">Partner's Love Languages</div>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm" id="partnerPrimary">-</span>
                        <span class="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm" id="partnerSecondary">-</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid md:grid-cols-2 gap-4">
            <a href="/checkins" class="glass-card rounded-xl p-6 shadow-lg hover:shadow-xl transition flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mr-4">
                    <i class="fas fa-heart text-white"></i>
                </div>
                <div>
                    <div class="font-semibold text-gray-900">Daily Check-in</div>
                    <div class="text-sm text-gray-600">Connect with your partner</div>
                </div>
                <i class="fas fa-chevron-right ml-auto text-gray-400"></i>
            </a>

            <a href="/activities" class="glass-card rounded-xl p-6 shadow-lg hover:shadow-xl transition flex items-center">
                <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                    <i class="fas fa-calendar-plus text-white"></i>
                </div>
                <div>
                    <div class="font-semibold text-gray-900">Plan Activity</div>
                    <div class="text-sm text-gray-600">Schedule a date night</div>
                </div>
                <i class="fas fa-chevron-right ml-auto text-gray-400"></i>
            </a>
        </div>
    </div>

    <script>
        async function loadRelationshipStatus() {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                window.location.href = '/login';
                return;
            }

            try {
                // Get relationship for user
                const relResponse = await fetch('/api/relationships/user/' + userId);
                if (!relResponse.ok) {
                    document.body.innerHTML = '<div class="min-h-screen flex items-center justify-center"><div class="text-center"><h2 class="text-xl font-bold mb-4">No Partner Connected</h2><a href="/partner-invite" class="text-pink-600">Invite your partner</a></div></div>';
                    return;
                }

                const relData = await relResponse.json();
                if (!relData.hasPartner) {
                    window.location.href = '/partner-invite';
                    return;
                }

                const rel = relData.relationship;

                // Update UI
                document.getElementById('daysTogether').textContent = rel.daysTogether || 0;
                document.getElementById('partnerName').textContent = rel.partner?.name || 'Partner';
                document.getElementById('partnerInitial').textContent = (rel.partner?.name || 'P')[0].toUpperCase();
                document.getElementById('relationshipType').textContent = rel.type || 'Dating';
                document.getElementById('startDate').textContent = rel.startDate ? new Date(rel.startDate).toLocaleDateString() : '-';
                document.getElementById('status').textContent = rel.status === 'active' ? 'Active' : rel.status;

                // Get detailed status
                const statusResponse = await fetch('/api/relationships/' + rel.id + '/status');
                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    document.getElementById('activitiesCount').textContent = statusData.stats?.activitiesCompleted || 0;
                    document.getElementById('goalsCompleted').textContent = statusData.stats?.goalsCompleted || 0;
                }

                // Get user data
                const userResponse = await fetch('/api/users/' + userId);
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    document.getElementById('userName').textContent = userData.user?.name || 'You';
                    document.getElementById('userInitial').textContent = (userData.user?.name || 'Y')[0].toUpperCase();
                }

            } catch (error) {
                console.error('Load error:', error);
            }
        }

        function editRelationship() {
            alert('Edit relationship feature coming soon!');
        }

        loadRelationshipStatus();
    </script>
</body>
</html>`;
