// Complete User Portal & Dashboard System
export const userPortalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Love Dashboard - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body { 
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .sidebar-item:hover {
            background: linear-gradient(135deg, #ff6b9d 0%, #8b5cf6 100%);
            transform: translateX(4px);
        }
        
        .metric-card {
            transition: all 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .progress-ring {
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
        }
        
        .mobile-menu-slide {
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
        }
        
        .mobile-menu-slide.open {
            transform: translateX(0);
        }
    </style>
</head>
<body>
    <!-- Mobile Header -->
    <div class="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <div class="flex items-center">
            <button id="mobileMenuToggle" class="mr-4 text-gray-600">
                <i class="fas fa-bars text-xl"></i>
            </button>
            <div class="flex items-center">
                <span class="text-xl mr-2">💕</span>
                <span class="font-semibold text-gray-800">Better Together</span>
            </div>
        </div>
        <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold" id="userInitials">SJ</span>
            </div>
        </div>
    </div>

    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <div id="sidebar" class="lg:w-64 bg-white shadow-lg lg:relative absolute inset-y-0 left-0 z-50 mobile-menu-slide">
            <div class="p-6 border-b">
                <div class="flex items-center">
                    <span class="text-2xl mr-3">💕</span>
                    <div>
                        <div class="font-semibold text-gray-800">Better Together</div>
                        <div class="text-xs text-gray-500 flex items-center">
                            <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span id="planType">Growing Together+</span>
                        </div>
                    </div>
                </div>
            </div>

            <nav class="p-4">
                <!-- User Profile Section -->
                <div class="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                    <div class="flex items-center mb-3">
                        <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                            <span class="text-white font-semibold" id="sidebarInitials">SJ</span>
                        </div>
                        <div>
                            <div class="font-semibold text-gray-800" id="userName">Sarah Johnson</div>
                            <div class="text-xs text-gray-500" id="userEmail">sarah@example.com</div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <span class="text-gray-600">Relationship Health</span>
                        <span class="font-semibold text-green-600" id="healthScore">92%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div class="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style="width: 92%"></div>
                    </div>
                </div>

                <!-- Navigation Items -->
                <div class="space-y-1">
                    <a href="#dashboard" onclick="showSection('dashboard')" class="sidebar-item flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                        <i class="fas fa-home mr-3"></i>
                        <span>Dashboard</span>
                    </a>
                    <a href="#assessments" onclick="showSection('assessments')" class="sidebar-item flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200">
                        <i class="fas fa-heart mr-3"></i>
                        <span>Love Assessments</span>
                    </a>
                    <a href="#ai-coach" onclick="showSection('ai-coach')" class="sidebar-item flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200">
                        <i class="fas fa-robot mr-3"></i>
                        <span>AI Coach</span>
                    </a>
                    <a href="#goals" onclick="showSection('goals')" class="sidebar-item flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200">
                        <i class="fas fa-bullseye mr-3"></i>
                        <span>Shared Goals</span>
                    </a>
                    <a href="#activities" onclick="showSection('activities')" class="sidebar-item flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200">
                        <i class="fas fa-calendar-heart mr-3"></i>
                        <span>Activities & Dates</span>
                    </a>
                    <a href="#challenges" onclick="showSection('challenges')" class="sidebar-item flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200">
                        <i class="fas fa-trophy mr-3"></i>
                        <span>Challenges</span>
                    </a>
                    <a href="#analytics" onclick="showSection('analytics')" class="sidebar-item flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200">
                        <i class="fas fa-chart-line mr-3"></i>
                        <span>Analytics</span>
                    </a>
                    <a href="#settings" onclick="showSection('settings')" class="sidebar-item flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200">
                        <i class="fas fa-cog mr-3"></i>
                        <span>Settings</span>
                    </a>
                </div>

                <!-- Partner Section -->
                <div class="mt-8 pt-6 border-t">
                    <div class="mb-4">
                        <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Partner</h3>
                    </div>
                    <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                            <span class="text-white font-semibold">MJ</span>
                        </div>
                        <div>
                            <div class="font-medium text-gray-800">Mike Johnson</div>
                            <div class="text-xs text-gray-500 flex items-center">
                                <div class="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                Online now
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="mt-6 space-y-3">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">Current Streak</span>
                        <span class="font-semibold text-orange-600">12 days</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">Goals Completed</span>
                        <span class="font-semibold text-green-600">8/10</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-600">Date Nights</span>
                        <span class="font-semibold text-purple-600">24 this year</span>
                    </div>
                </div>

                <!-- Logout -->
                <div class="mt-8 pt-6 border-t">
                    <button onclick="logout()" class="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                        <i class="fas fa-sign-out-alt mr-3"></i>
                        <span>Sign Out</span>
                    </button>
                </div>
            </nav>
        </div>

        <!-- Mobile Overlay -->
        <div id="mobileOverlay" class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 hidden"></div>

        <!-- Main Content -->
        <div class="flex-1 lg:ml-0">
            <!-- Dashboard Section -->
            <div id="dashboard-section" class="p-6">
                <!-- Welcome Header -->
                <div class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">Good morning, Sarah! 💕</h1>
                    <p class="text-gray-600">Your relationship is thriving. Here's what's happening today.</p>
                </div>

                <!-- Key Metrics -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="metric-card glass-card p-6 rounded-2xl shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
                                <i class="fas fa-heart text-white text-xl"></i>
                            </div>
                            <span class="text-xs text-gray-500">Today</span>
                        </div>
                        <div class="text-2xl font-bold text-gray-800 mb-1">9.2</div>
                        <div class="text-sm text-gray-600">Connection Score</div>
                        <div class="flex items-center mt-2">
                            <i class="fas fa-arrow-up text-green-500 text-xs mr-1"></i>
                            <span class="text-green-500 text-xs">+0.3 from yesterday</span>
                        </div>
                    </div>

                    <div class="metric-card glass-card p-6 rounded-2xl shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl">
                                <i class="fas fa-fire text-white text-xl"></i>
                            </div>
                            <span class="text-xs text-gray-500">Streak</span>
                        </div>
                        <div class="text-2xl font-bold text-gray-800 mb-1">12</div>
                        <div class="text-sm text-gray-600">Days in a Row</div>
                        <div class="flex items-center mt-2">
                            <i class="fas fa-calendar text-orange-500 text-xs mr-1"></i>
                            <span class="text-orange-500 text-xs">Daily check-ins</span>
                        </div>
                    </div>

                    <div class="metric-card glass-card p-6 rounded-2xl shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                <i class="fas fa-bullseye text-white text-xl"></i>
                            </div>
                            <span class="text-xs text-gray-500">Progress</span>
                        </div>
                        <div class="text-2xl font-bold text-gray-800 mb-1">80%</div>
                        <div class="text-sm text-gray-600">Goals Complete</div>
                        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div class="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style="width: 80%"></div>
                        </div>
                    </div>

                    <div class="metric-card glass-card p-6 rounded-2xl shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <div class="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                                <i class="fas fa-trophy text-white text-xl"></i>
                            </div>
                            <span class="text-xs text-gray-500">Total</span>
                        </div>
                        <div class="text-2xl font-bold text-gray-800 mb-1">15</div>
                        <div class="text-sm text-gray-600">Achievements</div>
                        <div class="flex items-center mt-2">
                            <i class="fas fa-star text-yellow-500 text-xs mr-1"></i>
                            <span class="text-yellow-500 text-xs">Latest: Date Night Pro</span>
                        </div>
                    </div>
                </div>

                <!-- Today's Highlights -->
                <div class="grid lg:grid-cols-3 gap-6 mb-8">
                    <!-- Daily Check-in -->
                    <div class="glass-card p-6 rounded-2xl shadow-lg">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-sun text-yellow-500 mr-2"></i>
                            Daily Check-in
                        </h3>
                        <div class="space-y-4">
                            <div class="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl">
                                <div class="text-sm font-medium text-gray-700 mb-2">How connected do you feel today?</div>
                                <div class="flex items-center space-x-2">
                                    <button class="w-8 h-8 bg-pink-500 text-white rounded-full text-sm hover:bg-pink-600 transition-colors">8</button>
                                    <div class="flex-1 text-xs text-gray-600">Feeling very connected!</div>
                                </div>
                            </div>
                            <button class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all">
                                Complete Today's Check-in
                            </button>
                        </div>
                    </div>

                    <!-- Upcoming Activity -->
                    <div class="glass-card p-6 rounded-2xl shadow-lg">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-calendar-heart text-red-500 mr-2"></i>
                            Next Date Night
                        </h3>
                        <div class="space-y-3">
                            <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                                <div class="font-medium text-gray-800">Romantic Dinner</div>
                                <div class="text-sm text-gray-600">Friday, 7:00 PM</div>
                                <div class="text-xs text-blue-600 mt-1">Bella Vista Restaurant</div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
                                    Edit Plans
                                </button>
                                <button class="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- AI Suggestion -->
                    <div class="glass-card p-6 rounded-2xl shadow-lg">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                            AI Suggestion
                        </h3>
                        <div class="space-y-3">
                            <div class="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
                                <div class="text-sm text-gray-700">
                                    "Since Mike's been stressed at work, try cooking his favorite meal together tonight. It combines quality time with acts of service!"
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button class="flex-1 bg-yellow-100 text-yellow-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors">
                                    Love It!
                                </button>
                                <button class="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                                    Not Today
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity & Quick Actions -->
                <div class="grid lg:grid-cols-2 gap-6">
                    <!-- Recent Activity -->
                    <div class="glass-card p-6 rounded-2xl shadow-lg">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                            <span><i class="fas fa-clock text-blue-500 mr-2"></i>Recent Activity</span>
                            <a href="#" class="text-sm text-blue-600 hover:text-blue-700">View All</a>
                        </h3>
                        <div class="space-y-3">
                            <div class="flex items-center p-3 bg-green-50 rounded-lg">
                                <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                <div class="flex-1">
                                    <div class="text-sm font-medium text-gray-800">Completed goal: Weekly Date Night</div>
                                    <div class="text-xs text-gray-500">2 hours ago</div>
                                </div>
                                <i class="fas fa-check text-green-500"></i>
                            </div>
                            <div class="flex items-center p-3 bg-blue-50 rounded-lg">
                                <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                                <div class="flex-1">
                                    <div class="text-sm font-medium text-gray-800">Mike completed Love Languages quiz</div>
                                    <div class="text-xs text-gray-500">Yesterday</div>
                                </div>
                                <i class="fas fa-heart text-blue-500"></i>
                            </div>
                            <div class="flex items-center p-3 bg-purple-50 rounded-lg">
                                <div class="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                <div class="flex-1">
                                    <div class="text-sm font-medium text-gray-800">Started 30-Day Connection Challenge</div>
                                    <div class="text-xs text-gray-500">3 days ago</div>
                                </div>
                                <i class="fas fa-trophy text-purple-500"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div class="glass-card p-6 rounded-2xl shadow-lg">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4">
                            <i class="fas fa-zap text-yellow-500 mr-2"></i>Quick Actions
                        </h3>
                        <div class="grid grid-cols-2 gap-3">
                            <button class="p-4 bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 rounded-xl transition-all text-left">
                                <i class="fas fa-calendar-plus text-pink-600 text-xl mb-2"></i>
                                <div class="text-sm font-medium text-gray-800">Plan Date</div>
                            </button>
                            <button class="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 rounded-xl transition-all text-left">
                                <i class="fas fa-comment text-blue-600 text-xl mb-2"></i>
                                <div class="text-sm font-medium text-gray-800">Ask AI Coach</div>
                            </button>
                            <button class="p-4 bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 rounded-xl transition-all text-left">
                                <i class="fas fa-bullseye text-green-600 text-xl mb-2"></i>
                                <div class="text-sm font-medium text-gray-800">Set Goal</div>
                            </button>
                            <button class="p-4 bg-gradient-to-r from-purple-100 to-violet-100 hover:from-purple-200 hover:to-violet-200 rounded-xl transition-all text-left">
                                <i class="fas fa-heart text-purple-600 text-xl mb-2"></i>
                                <div class="text-sm font-medium text-gray-800">Send Love</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Other Sections (Hidden by default) -->
            <div id="assessments-section" class="p-6 hidden">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">Love Assessments</h1>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Assessment cards will be dynamically generated -->
                </div>
            </div>

            <div id="ai-coach-section" class="p-6 hidden">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">AI Relationship Coach</h1>
                <!-- AI Coach interface will be here -->
            </div>

            <div id="goals-section" class="p-6 hidden">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">Shared Goals</h1>
                <!-- Goals management interface -->
            </div>

            <div id="activities-section" class="p-6 hidden">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">Activities & Date Nights</h1>
                <!-- Activities management interface -->
            </div>

            <div id="challenges-section" class="p-6 hidden">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">Relationship Challenges</h1>
                <!-- Challenges interface -->
            </div>

            <div id="analytics-section" class="p-6 hidden">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">Relationship Analytics</h1>
                <!-- Analytics dashboard -->
            </div>

            <div id="settings-section" class="p-6 hidden">
                <h1 class="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
                <!-- Settings interface -->
            </div>
        </div>
    </div>

    <script>
        // Mobile menu toggle
        document.getElementById('mobileMenuToggle').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobileOverlay');
            
            sidebar.classList.toggle('open');
            overlay.classList.toggle('hidden');
        });

        document.getElementById('mobileOverlay').addEventListener('click', function() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobileOverlay');
            
            sidebar.classList.remove('open');
            overlay.classList.add('hidden');
        });

        // Section switching
        function showSection(sectionName) {
            // Hide all sections
            const sections = ['dashboard', 'assessments', 'ai-coach', 'goals', 'activities', 'challenges', 'analytics', 'settings'];
            sections.forEach(section => {
                document.getElementById(section + '-section').classList.add('hidden');
            });

            // Show selected section
            document.getElementById(sectionName + '-section').classList.remove('hidden');

            // Update sidebar active state
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('bg-gradient-to-r', 'from-pink-500', 'to-purple-600', 'text-white');
                item.classList.add('text-gray-700');
            });

            event.target.closest('.sidebar-item').classList.add('bg-gradient-to-r', 'from-pink-500', 'to-purple-600', 'text-white');
            event.target.closest('.sidebar-item').classList.remove('text-gray-700');

            // Close mobile menu if open
            if (window.innerWidth < 1024) {
                document.getElementById('sidebar').classList.remove('open');
                document.getElementById('mobileOverlay').classList.add('hidden');
            }
        }

        // Load user data
        async function loadUserData() {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await fetch('/api/user/profile', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.ok) {
                    const userData = await response.json();
                    updateUIWithUserData(userData);
                } else {
                    // Token might be expired
                    localStorage.removeItem('authToken');
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            }
        }

        function updateUIWithUserData(userData) {
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userEmail').textContent = userData.email;
            
            const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
            document.getElementById('userInitials').textContent = initials;
            document.getElementById('sidebarInitials').textContent = initials;
            
            if (userData.subscription) {
                document.getElementById('planType').textContent = userData.subscription.plan_name;
            }
        }

        // Logout function
        function logout() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadUserData();
        });
    </script>
</body>
</html>`;