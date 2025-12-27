// Email Preferences Page
export const emailPreferencesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Preferences - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .toggle-checkbox:checked { right: 0; border-color: #ec4899; }
        .toggle-checkbox:checked + .toggle-label { background-color: #ec4899; }
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
                <h1 class="text-2xl font-bold text-gray-900">Email Preferences</h1>
                <p class="text-gray-600">Manage your email notifications</p>
            </div>
        </div>

        <!-- Email Address -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-envelope text-pink-500 mr-2"></i>
                Your Email
            </h2>
            <div class="flex items-center justify-between">
                <div>
                    <div class="font-medium text-gray-900" id="userEmail">Loading...</div>
                    <div class="text-sm text-gray-500">Primary email for all notifications</div>
                </div>
                <button onclick="changeEmail()" class="text-pink-600 hover:text-pink-700 text-sm font-medium">
                    Change
                </button>
            </div>
        </div>

        <!-- Relationship Notifications -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-heart text-pink-500 mr-2"></i>
                Relationship Notifications
            </h2>

            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Partner Check-ins</div>
                        <div class="text-sm text-gray-500">When your partner completes their daily check-in</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="partnerCheckins" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Goal Updates</div>
                        <div class="text-sm text-gray-500">Progress updates on shared goals</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="goalUpdates" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Activity Reminders</div>
                        <div class="text-sm text-gray-500">Upcoming scheduled activities and dates</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="activityReminders" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Important Dates</div>
                        <div class="text-sm text-gray-500">Anniversary and special date reminders</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="importantDates" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Challenge Updates</div>
                        <div class="text-sm text-gray-500">New challenges and progress notifications</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="challengeUpdates" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
            </div>
        </div>

        <!-- Weekly & Monthly Digests -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-calendar-week text-pink-500 mr-2"></i>
                Digests & Summaries
            </h2>

            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Weekly Summary</div>
                        <div class="text-sm text-gray-500">Your relationship highlights every Sunday</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="weeklySummary" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Monthly Insights</div>
                        <div class="text-sm text-gray-500">Relationship trends and AI coach tips</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="monthlyInsights" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
            </div>
        </div>

        <!-- Product & Marketing -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-bullhorn text-pink-500 mr-2"></i>
                Product & Updates
            </h2>

            <div class="space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">New Features</div>
                        <div class="text-sm text-gray-500">Be the first to know about new app features</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="newFeatures" class="sr-only peer" checked>
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Tips & Advice</div>
                        <div class="text-sm text-gray-500">Relationship tips and expert advice</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="tipsAdvice" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Promotions & Offers</div>
                        <div class="text-sm text-gray-500">Special deals and discounts</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="promotions" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>

                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-medium text-gray-900">Surveys & Research</div>
                        <div class="text-sm text-gray-500">Help us improve with your feedback</div>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="surveys" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                    </label>
                </div>
            </div>
        </div>

        <!-- Email Frequency -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-clock text-pink-500 mr-2"></i>
                Email Frequency
            </h2>

            <div class="space-y-3">
                <label class="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                    <input type="radio" name="frequency" value="realtime" class="w-4 h-4 text-pink-600">
                    <div class="ml-3">
                        <div class="font-medium text-gray-900">Real-time</div>
                        <div class="text-sm text-gray-500">Get notifications as they happen</div>
                    </div>
                </label>

                <label class="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                    <input type="radio" name="frequency" value="daily" class="w-4 h-4 text-pink-600" checked>
                    <div class="ml-3">
                        <div class="font-medium text-gray-900">Daily Digest</div>
                        <div class="text-sm text-gray-500">One email per day with all updates</div>
                    </div>
                </label>

                <label class="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
                    <input type="radio" name="frequency" value="weekly" class="w-4 h-4 text-pink-600">
                    <div class="ml-3">
                        <div class="font-medium text-gray-900">Weekly Summary</div>
                        <div class="text-sm text-gray-500">One email per week</div>
                    </div>
                </label>
            </div>
        </div>

        <!-- Unsubscribe All -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-6">
            <div class="flex items-center justify-between">
                <div>
                    <div class="font-medium text-gray-900">Unsubscribe from All</div>
                    <div class="text-sm text-gray-500">Stop receiving all non-essential emails</div>
                </div>
                <button onclick="unsubscribeAll()" class="text-red-600 hover:text-red-700 text-sm font-medium">
                    Unsubscribe
                </button>
            </div>
        </div>

        <!-- Save Button -->
        <button onclick="savePreferences()" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl">
            <i class="fas fa-save mr-2"></i>
            Save Preferences
        </button>
    </div>

    <script>
        const preferenceIds = [
            'partnerCheckins', 'goalUpdates', 'activityReminders', 'importantDates', 'challengeUpdates',
            'weeklySummary', 'monthlyInsights', 'newFeatures', 'tipsAdvice', 'promotions', 'surveys'
        ];

        async function loadPreferences() {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                window.location.href = '/login';
                return;
            }

            try {
                // Load user email
                const userResponse = await fetch('/api/users/' + userId);
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    document.getElementById('userEmail').textContent = userData.user?.email || 'Not set';
                }

                // Load email preferences
                const prefsResponse = await fetch('/api/users/' + userId + '/email-preferences');
                if (prefsResponse.ok) {
                    const prefs = await prefsResponse.json();

                    preferenceIds.forEach(id => {
                        const checkbox = document.getElementById(id);
                        if (checkbox && prefs[id] !== undefined) {
                            checkbox.checked = prefs[id];
                        }
                    });

                    if (prefs.frequency) {
                        const freqRadio = document.querySelector('input[name="frequency"][value="' + prefs.frequency + '"]');
                        if (freqRadio) freqRadio.checked = true;
                    }
                }
            } catch (error) {
                console.error('Load error:', error);
            }
        }

        async function savePreferences() {
            const userId = localStorage.getItem('userId');

            const preferences = {};
            preferenceIds.forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    preferences[id] = checkbox.checked;
                }
            });

            const frequencyRadio = document.querySelector('input[name="frequency"]:checked');
            preferences.frequency = frequencyRadio?.value || 'daily';

            try {
                const response = await fetch('/api/users/' + userId + '/email-preferences', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(preferences)
                });

                if (response.ok) {
                    alert('Email preferences saved successfully!');
                } else {
                    throw new Error('Failed to save');
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Failed to save preferences');
            }
        }

        function changeEmail() {
            const newEmail = prompt('Enter your new email address:');
            if (newEmail && newEmail.includes('@')) {
                // Would typically verify email before changing
                alert('A verification email has been sent to ' + newEmail);
            }
        }

        function unsubscribeAll() {
            if (!confirm('Are you sure you want to unsubscribe from all non-essential emails?')) return;

            preferenceIds.forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) checkbox.checked = false;
            });

            savePreferences();
        }

        loadPreferences();
    </script>
</body>
</html>`;
