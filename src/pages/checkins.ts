// Daily Check-ins Page
export const checkinsPageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily Check-in - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .mood-btn { transition: all 0.3s ease; }
        .mood-btn:hover { transform: scale(1.1); }
        .mood-btn.selected { transform: scale(1.15); box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3); }
        .score-slider { -webkit-appearance: none; height: 8px; border-radius: 4px; background: linear-gradient(to right, #f43f5e, #a855f7); }
        .score-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer; }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8">
    <div class="max-w-lg mx-auto">
        <!-- Header -->
        <div class="flex items-center mb-6">
            <a href="/portal" class="mr-4 text-gray-600 hover:text-pink-600 transition">
                <i class="fas fa-arrow-left text-xl"></i>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Daily Check-in</h1>
                <p class="text-gray-600" id="dateDisplay">Loading...</p>
            </div>
        </div>

        <!-- Streak Banner -->
        <div class="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 mb-6 text-white flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas fa-fire text-2xl mr-3"></i>
                <div>
                    <div class="font-semibold">Check-in Streak</div>
                    <div class="text-sm opacity-90">Keep it going!</div>
                </div>
            </div>
            <div class="text-3xl font-bold" id="streakCount">0</div>
        </div>

        <!-- Check-in Form -->
        <form id="checkinForm" onsubmit="submitCheckin(event)">
            <!-- Mood Score -->
            <div class="glass-card rounded-2xl p-6 shadow-lg mb-4">
                <h2 class="font-semibold text-gray-900 mb-4">How are you feeling today?</h2>
                <div class="flex justify-between">
                    <button type="button" class="mood-btn text-4xl p-2" data-mood="1" onclick="selectMood(1)">😢</button>
                    <button type="button" class="mood-btn text-4xl p-2" data-mood="2" onclick="selectMood(2)">😕</button>
                    <button type="button" class="mood-btn text-4xl p-2" data-mood="3" onclick="selectMood(3)">😐</button>
                    <button type="button" class="mood-btn text-4xl p-2" data-mood="4" onclick="selectMood(4)">🙂</button>
                    <button type="button" class="mood-btn text-4xl p-2" data-mood="5" onclick="selectMood(5)">😊</button>
                </div>
                <input type="hidden" id="moodScore" name="mood_score" value="3">
            </div>

            <!-- Connection Score -->
            <div class="glass-card rounded-2xl p-6 shadow-lg mb-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-semibold text-gray-900">Connection with Partner</h2>
                    <span class="text-pink-600 font-bold" id="connectionValue">5</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value="5"
                    class="score-slider w-full"
                    id="connectionScore"
                    oninput="updateSlider('connection', this.value)"
                >
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Distant</span>
                    <span>Very Connected</span>
                </div>
            </div>

            <!-- Relationship Satisfaction -->
            <div class="glass-card rounded-2xl p-6 shadow-lg mb-4">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="font-semibold text-gray-900">Relationship Satisfaction</h2>
                    <span class="text-purple-600 font-bold" id="satisfactionValue">5</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value="5"
                    class="score-slider w-full"
                    id="satisfactionScore"
                    oninput="updateSlider('satisfaction', this.value)"
                >
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Needs Work</span>
                    <span>Very Satisfied</span>
                </div>
            </div>

            <!-- Gratitude Note -->
            <div class="glass-card rounded-2xl p-6 shadow-lg mb-4">
                <h2 class="font-semibold text-gray-900 mb-4">
                    <i class="fas fa-heart text-pink-500 mr-2"></i>
                    What are you grateful for today?
                </h2>
                <textarea
                    id="gratitudeNote"
                    rows="3"
                    placeholder="Something your partner did, a moment you shared..."
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                ></textarea>
            </div>

            <!-- Highlight of the Day -->
            <div class="glass-card rounded-2xl p-6 shadow-lg mb-4">
                <h2 class="font-semibold text-gray-900 mb-4">
                    <i class="fas fa-star text-yellow-500 mr-2"></i>
                    Highlight of your day
                </h2>
                <textarea
                    id="highlightNote"
                    rows="2"
                    placeholder="Best moment of your day..."
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                ></textarea>
            </div>

            <!-- Support Needed -->
            <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
                <h2 class="font-semibold text-gray-900 mb-4">
                    <i class="fas fa-hands-helping text-blue-500 mr-2"></i>
                    Any support you need?
                </h2>
                <textarea
                    id="supportNote"
                    rows="2"
                    placeholder="Something you'd like help with..."
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                ></textarea>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
            >
                <i class="fas fa-check-circle mr-2"></i>
                Complete Check-in
            </button>
        </form>

        <!-- Recent Check-ins -->
        <div class="mt-8">
            <h2 class="font-semibold text-gray-900 mb-4">Recent Check-ins</h2>
            <div id="recentCheckins" class="space-y-3">
                <div class="text-gray-500 text-center py-4">Loading...</div>
            </div>
        </div>
    </div>

    <script>
        let selectedMood = 3;
        let relationshipId = null;

        function selectMood(mood) {
            selectedMood = mood;
            document.getElementById('moodScore').value = mood;
            document.querySelectorAll('.mood-btn').forEach(btn => {
                btn.classList.toggle('selected', parseInt(btn.dataset.mood) === mood);
            });
        }

        function updateSlider(type, value) {
            document.getElementById(type + 'Value').textContent = value;
        }

        async function submitCheckin(e) {
            e.preventDefault();

            const userId = localStorage.getItem('userId');
            if (!userId || !relationshipId) {
                alert('Please log in and connect with a partner first');
                return;
            }

            const data = {
                relationship_id: relationshipId,
                user_id: userId,
                mood_score: selectedMood,
                connection_score: parseInt(document.getElementById('connectionScore').value),
                relationship_satisfaction: parseInt(document.getElementById('satisfactionScore').value),
                gratitude_note: document.getElementById('gratitudeNote').value,
                highlight_of_day: document.getElementById('highlightNote').value,
                support_needed: document.getElementById('supportNote').value
            };

            try {
                const response = await fetch('/api/checkins', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Check-in completed! ' + (result.achievements_earned?.length ? 'You earned new achievements!' : ''));
                    loadRecentCheckins();
                    document.getElementById('checkinForm').reset();
                    selectMood(3);
                } else if (response.status === 409) {
                    alert("You've already checked in today!");
                } else {
                    throw new Error('Failed to submit');
                }
            } catch (error) {
                console.error('Submit error:', error);
                alert('Failed to submit check-in');
            }
        }

        async function loadRecentCheckins() {
            if (!relationshipId) return;

            try {
                const response = await fetch('/api/checkins/' + relationshipId + '?limit=5');
                if (response.ok) {
                    const data = await response.json();
                    const container = document.getElementById('recentCheckins');

                    if (!data.checkins?.length) {
                        container.innerHTML = '<div class="text-gray-500 text-center py-4">No check-ins yet</div>';
                        return;
                    }

                    container.innerHTML = data.checkins.map(c => \`
                        <div class="glass-card rounded-xl p-4 shadow">
                            <div class="flex justify-between items-start mb-2">
                                <div class="font-medium text-gray-900">\${c.user_name}</div>
                                <div class="text-sm text-gray-500">\${new Date(c.checkin_date).toLocaleDateString()}</div>
                            </div>
                            <div class="flex items-center gap-4 text-sm">
                                <span>Mood: \${['😢','😕','😐','🙂','😊'][c.mood_score - 1] || '😐'}</span>
                                <span>Connection: \${c.connection_score}/10</span>
                            </div>
                            \${c.gratitude_note ? \`<p class="text-gray-600 text-sm mt-2">"\${c.gratitude_note}"</p>\` : ''}
                        </div>
                    \`).join('');
                }
            } catch (error) {
                console.error('Load error:', error);
            }
        }

        async function init() {
            document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            const userId = localStorage.getItem('userId');
            if (!userId) {
                window.location.href = '/login';
                return;
            }

            // Get relationship
            try {
                const relResponse = await fetch('/api/relationships/user/' + userId);
                if (relResponse.ok) {
                    const relData = await relResponse.json();
                    if (relData.hasPartner) {
                        relationshipId = relData.relationship.id;
                        loadRecentCheckins();
                    } else {
                        window.location.href = '/partner-invite';
                    }
                }
            } catch (error) {
                console.error('Init error:', error);
            }

            selectMood(3);
        }

        init();
    </script>
</body>
</html>`;
