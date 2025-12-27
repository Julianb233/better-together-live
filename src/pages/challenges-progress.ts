// Challenges Progress Page
export const challengesProgressHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relationship Challenges - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .challenge-card { transition: all 0.3s ease; }
        .challenge-card:hover { transform: translateY(-2px); }
        .progress-ring { transition: stroke-dashoffset 0.5s ease; }
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
                    <h1 class="text-2xl font-bold text-gray-900">Relationship Challenges</h1>
                    <p class="text-gray-600">Grow stronger together</p>
                </div>
            </div>
        </div>

        <!-- Current Challenge Banner -->
        <div id="currentChallenge" class="hidden mb-8">
            <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div class="relative">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">Active Challenge</span>
                    </div>
                    <h2 class="text-xl font-bold mb-2" id="currentChallengeName">-</h2>
                    <p class="opacity-90 text-sm mb-4" id="currentChallengeDesc">-</p>
                    <div class="flex items-center justify-between">
                        <div>
                            <div class="text-sm opacity-90">Progress</div>
                            <div class="flex items-center gap-2">
                                <div class="w-32 h-2 bg-white/30 rounded-full overflow-hidden">
                                    <div class="h-full bg-white rounded-full" id="currentProgress" style="width: 0%"></div>
                                </div>
                                <span class="font-bold" id="currentProgressText">0%</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm opacity-90">Days Left</div>
                            <div class="text-2xl font-bold" id="currentDaysLeft">-</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-purple-600" id="completedChallenges">0</div>
                <div class="text-sm text-gray-600">Completed</div>
            </div>
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-pink-600" id="currentStreak">0</div>
                <div class="text-sm text-gray-600">Day Streak</div>
            </div>
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-amber-600" id="totalPoints">0</div>
                <div class="text-sm text-gray-600">Points</div>
            </div>
        </div>

        <!-- Available Challenges -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Available Challenges</h2>
            <div id="availableChallenges" class="grid gap-4">
                <div class="text-center py-8 text-gray-500">Loading challenges...</div>
            </div>
        </div>

        <!-- Completed Challenges -->
        <div id="completedSection" class="hidden">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Completed Challenges</h2>
            <div id="completedList" class="grid gap-4"></div>
        </div>
    </div>

    <!-- Challenge Detail Modal -->
    <div id="challengeModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900" id="modalTitle">Challenge Details</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <div id="modalContent">
                <!-- Dynamic content -->
            </div>
        </div>
    </div>

    <script>
        let relationshipId = null;
        let challenges = [];
        let participation = [];

        const challengeIcons = {
            communication: 'fa-comments',
            intimacy: 'fa-heart',
            adventure: 'fa-hiking',
            gratitude: 'fa-pray',
            quality_time: 'fa-clock',
            romance: 'fa-kiss-wink-heart',
            growth: 'fa-seedling',
            fun: 'fa-smile-beam'
        };

        const challengeColors = {
            communication: 'from-blue-500 to-cyan-500',
            intimacy: 'from-pink-500 to-rose-500',
            adventure: 'from-green-500 to-emerald-500',
            gratitude: 'from-amber-500 to-yellow-500',
            quality_time: 'from-purple-500 to-indigo-500',
            romance: 'from-red-500 to-pink-500',
            growth: 'from-teal-500 to-green-500',
            fun: 'from-orange-500 to-amber-500'
        };

        const difficultyLabels = {
            easy: { label: 'Easy', color: 'bg-green-100 text-green-700' },
            medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
            hard: { label: 'Hard', color: 'bg-red-100 text-red-700' }
        };

        async function init() {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                window.location.href = '/login';
                return;
            }

            try {
                const relResponse = await fetch('/api/relationships/user/' + userId);
                if (relResponse.ok) {
                    const relData = await relResponse.json();
                    if (relData.hasPartner) {
                        relationshipId = relData.relationship.id;
                        await Promise.all([loadChallenges(), loadParticipation()]);
                        renderChallenges();
                    } else {
                        window.location.href = '/partner-invite';
                    }
                }
            } catch (error) {
                console.error('Init error:', error);
            }
        }

        async function loadChallenges() {
            try {
                const response = await fetch('/api/challenges');
                if (response.ok) {
                    const data = await response.json();
                    challenges = data.challenges || [];
                }
            } catch (error) {
                console.error('Load challenges error:', error);
            }
        }

        async function loadParticipation() {
            if (!relationshipId) return;

            try {
                const response = await fetch('/api/challenges/participation/' + relationshipId);
                if (response.ok) {
                    const data = await response.json();
                    participation = data.participation || [];
                    updateStats();
                    updateCurrentChallenge();
                }
            } catch (error) {
                console.error('Load participation error:', error);
            }
        }

        function updateStats() {
            const completed = participation.filter(p => p.status === 'completed').length;
            const points = participation.reduce((sum, p) => sum + (p.points_earned || 0), 0);
            // Calculate streak based on consecutive completions
            let streak = 0;
            const sortedCompleted = participation
                .filter(p => p.status === 'completed')
                .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
            // Simplified streak calculation
            streak = sortedCompleted.length > 0 ? Math.min(sortedCompleted.length, 7) : 0;

            document.getElementById('completedChallenges').textContent = completed;
            document.getElementById('currentStreak').textContent = streak;
            document.getElementById('totalPoints').textContent = points;
        }

        function updateCurrentChallenge() {
            const active = participation.find(p => p.status === 'in_progress');
            const banner = document.getElementById('currentChallenge');

            if (active) {
                const challenge = challenges.find(c => c.id === active.challenge_id);
                if (challenge) {
                    banner.classList.remove('hidden');
                    document.getElementById('currentChallengeName').textContent = challenge.name;
                    document.getElementById('currentChallengeDesc').textContent = challenge.description;

                    const progress = active.progress || 0;
                    document.getElementById('currentProgress').style.width = progress + '%';
                    document.getElementById('currentProgressText').textContent = progress + '%';

                    const startDate = new Date(active.started_at);
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + (challenge.duration_days || 7));
                    const daysLeft = Math.max(0, Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24)));
                    document.getElementById('currentDaysLeft').textContent = daysLeft;
                }
            } else {
                banner.classList.add('hidden');
            }
        }

        function renderChallenges() {
            const participationMap = new Map(participation.map(p => [p.challenge_id, p]));

            const available = challenges.filter(c => {
                const p = participationMap.get(c.id);
                return !p || p.status !== 'completed';
            });

            const completed = challenges.filter(c => {
                const p = participationMap.get(c.id);
                return p && p.status === 'completed';
            });

            const container = document.getElementById('availableChallenges');
            if (available.length === 0) {
                container.innerHTML = '<div class="text-center py-8 text-gray-500">All challenges completed! More coming soon...</div>';
            } else {
                container.innerHTML = available.map(challenge => {
                    const p = participationMap.get(challenge.id);
                    const isActive = p && p.status === 'in_progress';
                    const diff = difficultyLabels[challenge.difficulty] || difficultyLabels.medium;

                    return \`
                    <div class="challenge-card glass-card rounded-xl p-5 shadow-lg cursor-pointer" onclick="showChallenge('\${challenge.id}')">
                        <div class="flex items-start gap-4">
                            <div class="w-14 h-14 bg-gradient-to-r \${challengeColors[challenge.category] || challengeColors.growth} rounded-xl flex items-center justify-center flex-shrink-0">
                                <i class="fas \${challengeIcons[challenge.category] || 'fa-star'} text-white text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <div class="flex justify-between items-start mb-1">
                                    <h3 class="font-semibold text-gray-900">\${challenge.name}</h3>
                                    \${isActive ? '<span class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">In Progress</span>' : ''}
                                </div>
                                <p class="text-sm text-gray-600 mb-3">\${challenge.description}</p>
                                <div class="flex flex-wrap items-center gap-2 text-sm">
                                    <span class="px-2 py-1 \${diff.color} rounded-full text-xs">\${diff.label}</span>
                                    <span class="text-gray-500"><i class="fas fa-clock mr-1"></i>\${challenge.duration_days || 7} days</span>
                                    <span class="text-amber-600"><i class="fas fa-coins mr-1"></i>\${challenge.points || 100} pts</span>
                                </div>
                                \${isActive ? \`
                                    <div class="mt-3">
                                        <div class="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Progress</span>
                                            <span>\${p.progress || 0}%</span>
                                        </div>
                                        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" style="width: \${p.progress || 0}%"></div>
                                        </div>
                                    </div>
                                \` : ''}
                            </div>
                        </div>
                    </div>
                \`}).join('');
            }

            // Completed section
            const completedSection = document.getElementById('completedSection');
            const completedList = document.getElementById('completedList');

            if (completed.length > 0) {
                completedSection.classList.remove('hidden');
                completedList.innerHTML = completed.map(challenge => {
                    const p = participationMap.get(challenge.id);
                    return \`
                    <div class="glass-card rounded-xl p-4 shadow-lg opacity-75">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <i class="fas fa-check text-green-600"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="font-medium text-gray-900">\${challenge.name}</h3>
                                <p class="text-sm text-gray-500">Completed \${p.completed_at ? new Date(p.completed_at).toLocaleDateString() : ''}</p>
                            </div>
                            <div class="text-amber-600 font-medium">
                                +\${p.points_earned || challenge.points || 100} pts
                            </div>
                        </div>
                    </div>
                \`}).join('');
            } else {
                completedSection.classList.add('hidden');
            }
        }

        function showChallenge(challengeId) {
            const challenge = challenges.find(c => c.id === challengeId);
            if (!challenge) return;

            const p = participation.find(p => p.challenge_id === challengeId);
            const isActive = p && p.status === 'in_progress';
            const diff = difficultyLabels[challenge.difficulty] || difficultyLabels.medium;

            document.getElementById('modalTitle').textContent = challenge.name;
            document.getElementById('modalContent').innerHTML = \`
                <div class="mb-6">
                    <div class="w-16 h-16 bg-gradient-to-r \${challengeColors[challenge.category] || challengeColors.growth} rounded-xl flex items-center justify-center mx-auto mb-4">
                        <i class="fas \${challengeIcons[challenge.category] || 'fa-star'} text-white text-2xl"></i>
                    </div>
                    <p class="text-gray-600 text-center">\${challenge.description}</p>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-6">
                    <div class="text-center p-3 bg-gray-50 rounded-xl">
                        <div class="text-sm text-gray-500">Difficulty</div>
                        <div class="font-medium capitalize">\${challenge.difficulty || 'Medium'}</div>
                    </div>
                    <div class="text-center p-3 bg-gray-50 rounded-xl">
                        <div class="text-sm text-gray-500">Duration</div>
                        <div class="font-medium">\${challenge.duration_days || 7} days</div>
                    </div>
                    <div class="text-center p-3 bg-gray-50 rounded-xl">
                        <div class="text-sm text-gray-500">Reward</div>
                        <div class="font-medium text-amber-600">\${challenge.points || 100} pts</div>
                    </div>
                </div>

                \${challenge.tasks ? \`
                    <div class="mb-6">
                        <h3 class="font-medium text-gray-900 mb-3">Daily Tasks</h3>
                        <ul class="space-y-2">
                            \${(challenge.tasks || []).map((task, i) => \`
                                <li class="flex items-start gap-2 text-sm text-gray-600">
                                    <span class="w-5 h-5 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs">\${i + 1}</span>
                                    \${task}
                                </li>
                            \`).join('')}
                        </ul>
                    </div>
                \` : ''}

                \${isActive ? \`
                    <div class="mb-6 p-4 bg-green-50 rounded-xl">
                        <div class="flex items-center gap-2 text-green-700 mb-2">
                            <i class="fas fa-play-circle"></i>
                            <span class="font-medium">Challenge in Progress</span>
                        </div>
                        <div class="text-sm text-green-600">
                            Progress: \${p.progress || 0}%
                        </div>
                        <input type="range" min="0" max="100" value="\${p.progress || 0}"
                            class="w-full mt-2"
                            onchange="updateProgress('\${challengeId}', this.value)">
                    </div>
                    <button onclick="completeChallenge('\${challengeId}')"
                        class="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition mb-2">
                        <i class="fas fa-check-circle mr-2"></i>Mark Complete
                    </button>
                \` : \`
                    <button onclick="startChallenge('\${challengeId}')"
                        class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition">
                        <i class="fas fa-play mr-2"></i>Start Challenge
                    </button>
                \`}
            \`;

            document.getElementById('challengeModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('challengeModal').classList.add('hidden');
        }

        async function startChallenge(challengeId) {
            try {
                const response = await fetch('/api/challenges/' + challengeId + '/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ relationship_id: relationshipId })
                });

                if (response.ok) {
                    closeModal();
                    await loadParticipation();
                    renderChallenges();
                } else {
                    throw new Error('Failed to start');
                }
            } catch (error) {
                console.error('Start error:', error);
                alert('Failed to start challenge');
            }
        }

        async function updateProgress(challengeId, progress) {
            try {
                await fetch('/api/challenges/' + challengeId + '/progress', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        relationship_id: relationshipId,
                        progress: parseInt(progress)
                    })
                });
                await loadParticipation();
            } catch (error) {
                console.error('Update error:', error);
            }
        }

        async function completeChallenge(challengeId) {
            try {
                await fetch('/api/challenges/' + challengeId + '/complete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ relationship_id: relationshipId })
                });
                closeModal();
                await loadParticipation();
                renderChallenges();
                alert('Congratulations! Challenge completed! 🎉');
            } catch (error) {
                console.error('Complete error:', error);
            }
        }

        init();
    </script>
</body>
</html>`;
