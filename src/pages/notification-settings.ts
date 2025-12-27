// Notification Settings Page
export const notificationSettingsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification Settings - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .toggle-switch { transition: all 0.3s ease; }
        .toggle-switch.active { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); }
        .toggle-switch.active .toggle-dot { transform: translateX(24px); }
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
                <h1 class="text-2xl font-bold text-gray-900">Notification Settings</h1>
                <p class="text-gray-600">Manage how you receive updates</p>
            </div>
        </div>

        <!-- Notification Categories -->
        <div class="space-y-6">
            <!-- Push Notifications -->
            <div class="glass-card rounded-2xl p-6 shadow-lg">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-bell text-white"></i>
                    </div>
                    <div>
                        <h2 class="font-semibold text-gray-900">Push Notifications</h2>
                        <p class="text-sm text-gray-500">Real-time alerts on your device</p>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <div class="font-medium text-gray-700">Partner Check-ins</div>
                            <div class="text-sm text-gray-500">When your partner completes a check-in</div>
                        </div>
                        <button class="toggle-switch active w-12 h-6 bg-gray-300 rounded-full relative" onclick="toggleNotification(this)">
                            <div class="toggle-dot w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                        </button>
                    </div>

                    <div class="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <div class="font-medium text-gray-700">Daily Reminders</div>
                            <div class="text-sm text-gray-500">Gentle nudges to connect</div>
                        </div>
                        <button class="toggle-switch active w-12 h-6 bg-gray-300 rounded-full relative" onclick="toggleNotification(this)">
                            <div class="toggle-dot w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                        </button>
                    </div>

                    <div class="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <div class="font-medium text-gray-700">Goal Progress</div>
                            <div class="text-sm text-gray-500">Updates on shared goal achievements</div>
                        </div>
                        <button class="toggle-switch active w-12 h-6 bg-gray-300 rounded-full relative" onclick="toggleNotification(this)">
                            <div class="toggle-dot w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                        </button>
                    </div>

                    <div class="flex items-center justify-between py-3">
                        <div>
                            <div class="font-medium text-gray-700">Important Dates</div>
                            <div class="text-sm text-gray-500">Reminders for anniversaries & events</div>
                        </div>
                        <button class="toggle-switch active w-12 h-6 bg-gray-300 rounded-full relative" onclick="toggleNotification(this)">
                            <div class="toggle-dot w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Email Notifications -->
            <div class="glass-card rounded-2xl p-6 shadow-lg">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-envelope text-white"></i>
                    </div>
                    <div>
                        <h2 class="font-semibold text-gray-900">Email Notifications</h2>
                        <p class="text-sm text-gray-500">Updates delivered to your inbox</p>
                    </div>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <div class="font-medium text-gray-700">Weekly Summary</div>
                            <div class="text-sm text-gray-500">Relationship insights every week</div>
                        </div>
                        <button class="toggle-switch active w-12 h-6 bg-gray-300 rounded-full relative" onclick="toggleNotification(this)">
                            <div class="toggle-dot w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                        </button>
                    </div>

                    <div class="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                            <div class="font-medium text-gray-700">AI Coach Tips</div>
                            <div class="text-sm text-gray-500">Personalized advice and suggestions</div>
                        </div>
                        <button class="toggle-switch w-12 h-6 bg-gray-300 rounded-full relative" onclick="toggleNotification(this)">
                            <div class="toggle-dot w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                        </button>
                    </div>

                    <div class="flex items-center justify-between py-3">
                        <div>
                            <div class="font-medium text-gray-700">Marketing & Offers</div>
                            <div class="text-sm text-gray-500">Special promotions and new features</div>
                        </div>
                        <button class="toggle-switch w-12 h-6 bg-gray-300 rounded-full relative" onclick="toggleNotification(this)">
                            <div class="toggle-dot w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Quiet Hours -->
            <div class="glass-card rounded-2xl p-6 shadow-lg">
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                        <i class="fas fa-moon text-white"></i>
                    </div>
                    <div>
                        <h2 class="font-semibold text-gray-900">Quiet Hours</h2>
                        <p class="text-sm text-gray-500">Pause notifications during these times</p>
                    </div>
                </div>

                <div class="flex items-center justify-between mb-4">
                    <span class="font-medium text-gray-700">Enable Quiet Hours</span>
                    <button class="toggle-switch w-12 h-6 bg-gray-300 rounded-full relative" onclick="toggleNotification(this)" id="quietHoursToggle">
                        <div class="toggle-dot w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform"></div>
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-4" id="quietHoursTime">
                    <div>
                        <label class="block text-sm text-gray-600 mb-1">Start Time</label>
                        <input type="time" value="22:00" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-600 mb-1">End Time</label>
                        <input type="time" value="07:00" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    </div>
                </div>
            </div>

            <!-- Save Button -->
            <button onclick="saveSettings()" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl">
                <i class="fas fa-save mr-2"></i>
                Save Settings
            </button>
        </div>
    </div>

    <script>
        function toggleNotification(button) {
            button.classList.toggle('active');
        }

        async function saveSettings() {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in first');
                return;
            }

            const settings = {
                push_partner_checkins: document.querySelectorAll('.toggle-switch')[0].classList.contains('active'),
                push_daily_reminders: document.querySelectorAll('.toggle-switch')[1].classList.contains('active'),
                push_goal_progress: document.querySelectorAll('.toggle-switch')[2].classList.contains('active'),
                push_important_dates: document.querySelectorAll('.toggle-switch')[3].classList.contains('active'),
                email_weekly_summary: document.querySelectorAll('.toggle-switch')[4].classList.contains('active'),
                email_ai_tips: document.querySelectorAll('.toggle-switch')[5].classList.contains('active'),
                email_marketing: document.querySelectorAll('.toggle-switch')[6].classList.contains('active'),
                quiet_hours_enabled: document.getElementById('quietHoursToggle').classList.contains('active')
            };

            try {
                const response = await fetch('/api/users/' + userId + '/notification-settings', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(settings)
                });

                if (response.ok) {
                    alert('Settings saved successfully!');
                } else {
                    throw new Error('Failed to save');
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Failed to save settings');
            }
        }

        // Load existing settings on page load
        async function loadSettings() {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            try {
                const response = await fetch('/api/users/' + userId + '/notification-settings');
                if (response.ok) {
                    const data = await response.json();
                    // Apply settings to toggles
                    console.log('Loaded settings:', data);
                }
            } catch (error) {
                console.error('Load error:', error);
            }
        }

        loadSettings();
    </script>
</body>
</html>`;
