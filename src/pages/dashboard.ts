// Analytics Dashboard - Professional Enterprise Analytics Portal
export const dashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard | Better Together Business Intelligence</title>
    <meta name="description" content="Comprehensive analytics dashboard for Better Together relationship platform. Track user engagement, partner performance, and business metrics in real-time.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/date-fns@2.29.3/index.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        pink: {
                            50: '#fdf2f8',
                            100: '#fce7f3',
                            500: '#ec4899',
                            600: '#db2777',
                            700: '#be185d',
                            800: '#9d174d'
                        },
                        purple: {
                            500: '#8b5cf6',
                            600: '#7c3aed',
                            700: '#6d28d9'
                        },
                        slate: {
                            850: '#1a202c',
                            900: '#0f1419'
                        }
                    },
                    fontFamily: {
                        'inter': ['Inter', 'sans-serif']
                    },
                    animation: {
                        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
                        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
                        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite'
                    },
                    keyframes: {
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(30px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' }
                        },
                        slideInRight: {
                            '0%': { opacity: '0', transform: 'translateX(30px)' },
                            '100%': { opacity: '1', transform: 'translateX(0)' }
                        },
                        pulseGlow: {
                            '0%': { boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' },
                            '100%': { boxShadow: '0 0 30px rgba(236, 72, 153, 0.8)' }
                        },
                        bounceSubtle: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-5px)' }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        
        /* iOS 26 Liquid Glass Effects for Dashboard */
        .liquid-glass {
            backdrop-filter: blur(40px) saturate(180%);
            background: linear-gradient(145deg, 
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.1) 100%);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 
                0 25px 45px -12px rgba(0, 0, 0, 0.1),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                0 1px 3px rgba(255, 255, 255, 0.2) inset;
        }
        
        .liquid-glass-dark {
            backdrop-filter: blur(40px) saturate(180%);
            background: linear-gradient(145deg, 
                rgba(15, 20, 25, 0.95) 0%,
                rgba(26, 32, 44, 0.90) 50%,
                rgba(15, 20, 25, 0.98) 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 
                0 25px 45px -12px rgba(0, 0, 0, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset,
                0 1px 3px rgba(255, 255, 255, 0.1) inset;
        }
        
        .liquid-glass-accent {
            backdrop-filter: blur(30px) saturate(200%);
            background: linear-gradient(145deg, 
                rgba(236, 72, 153, 0.12) 0%,
                rgba(139, 92, 246, 0.08) 50%,
                rgba(236, 72, 153, 0.15) 100%);
            border: 1px solid rgba(236, 72, 153, 0.2);
            box-shadow: 
                0 20px 40px -12px rgba(236, 72, 153, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 1px 3px rgba(255, 255, 255, 0.3) inset;
        }
        
        /* Dashboard Specific Styles */
        .liquid-hover {
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .liquid-hover:hover {
            transform: translateY(-4px) scale(1.01);
            box-shadow: 
                0 35px 60px -12px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 2px 8px rgba(255, 255, 255, 0.4) inset;
        }
        
        .liquid-press {
            transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .liquid-press:active {
            transform: scale(0.98);
            box-shadow: 
                0 10px 25px -8px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }
        
        .morphing-gradient {
            background: linear-gradient(45deg, 
                rgba(236, 72, 153, 0.8), 
                rgba(139, 92, 246, 0.8),
                rgba(59, 130, 246, 0.8),
                rgba(16, 185, 129, 0.8),
                rgba(236, 72, 153, 0.8));
            background-size: 300% 300%;
            animation: morphGradient 8s ease infinite;
        }
        @keyframes morphGradient {
            0% { background-position: 0% 50%; }
            25% { background-position: 100% 50%; }
            50% { background-position: 50% 100%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Dark Mode Gradient Background */
        .dashboard-bg {
            background: linear-gradient(135deg, #0f1419 0%, #1a202c 25%, #2d3748 50%, #1a202c 75%, #0f1419 100%);
            min-height: 100vh;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(236, 72, 153, 0.5);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(236, 72, 153, 0.8);
        }
        
        /* Chart Container Styles */
        .chart-container {
            position: relative;
            height: 300px;
            width: 100%;
        }
        
        /* Metric Card Animation */
        .metric-card {
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .metric-card:hover {
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05));
            border: 1px solid rgba(236, 72, 153, 0.3);
            transform: translateY(-2px);
        }
        
        /* Feature Status Indicators */
        .status-active { background: linear-gradient(45deg, #10b981, #34d399); }
        .status-beta { background: linear-gradient(45deg, #f59e0b, #fbbf24); }
        .status-planned { background: linear-gradient(45deg, #6b7280, #9ca3af); }
        .status-inactive { background: linear-gradient(45deg, #ef4444, #f87171); }
    </style>
</head>
<body class="dashboard-bg text-white">
    <!-- Navigation - Liquid Glass -->
    <nav class="liquid-glass-dark sticky top-0 z-50 border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <a href="/" class="flex items-center liquid-hover">
                        <span class="text-2xl">💕</span>
                        <span class="ml-2 text-xl font-bold text-white">Better Together</span>
                        <span class="ml-3 text-sm morphing-gradient text-white px-3 py-1 rounded-full font-semibold shadow-lg">Analytics</span>
                    </a>
                </div>
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/dashboard.html" class="text-pink-400 hover:text-pink-300 transition-colors font-medium border-b-2 border-pink-400">Dashboard</a>
                    <a href="/become-sponsor.html" class="text-gray-300 hover:text-white transition-colors font-medium">Partners</a>
                    <a href="/member-rewards.html" class="text-gray-300 hover:text-white transition-colors font-medium">Members</a>
                    <a href="/" class="text-gray-300 hover:text-white transition-colors font-medium">App Home</a>
                    <div class="flex items-center space-x-3">
                        <div class="liquid-glass px-3 py-2 rounded-lg">
                            <span class="text-sm text-gray-300" id="userInfo">Admin User</span>
                        </div>
                        <button id="logoutBtn" class="liquid-glass text-gray-300 px-4 py-2 rounded-lg font-semibold liquid-hover liquid-press">
                            <i class="fas fa-sign-out-alt mr-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Dashboard Header -->
    <section class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                <div>
                    <h1 class="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
                    <p class="text-xl text-gray-300">Real-time insights into Better Together platform performance</p>
                    <div class="flex items-center mt-4 space-x-4">
                        <div class="flex items-center liquid-glass px-4 py-2 rounded-lg">
                            <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                            <span class="text-sm text-gray-200">Live Data</span>
                        </div>
                        <div class="liquid-glass px-4 py-2 rounded-lg">
                            <span class="text-sm text-gray-200">Last updated: <span id="lastUpdated">now</span></span>
                        </div>
                    </div>
                </div>
                <div class="mt-6 lg:mt-0 flex space-x-4">
                    <button class="liquid-glass-accent text-white px-6 py-3 rounded-lg font-semibold liquid-hover liquid-press">
                        <i class="fas fa-download mr-2"></i>Export Report
                    </button>
                    <button class="liquid-glass text-white px-6 py-3 rounded-lg font-semibold liquid-hover liquid-press">
                        <i class="fas fa-cog mr-2"></i>Settings
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Key Metrics Overview -->
    <section class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Total Users -->
                <div class="metric-card rounded-2xl p-6 liquid-hover">
                    <div class="flex items-center justify-between mb-4">
                        <div class="morphing-gradient w-12 h-12 rounded-full flex items-center justify-center">
                            <i class="fas fa-users text-white text-xl"></i>
                        </div>
                        <span class="text-green-400 text-sm font-semibold">+12.5%</span>
                    </div>
                    <div class="text-3xl font-bold text-white mb-1" id="totalUsers">50,247</div>
                    <div class="text-gray-400 text-sm">Total Active Users</div>
                    <div class="text-xs text-gray-500 mt-2">vs last month</div>
                </div>

                <!-- Engaged Couples -->
                <div class="metric-card rounded-2xl p-6 liquid-hover">
                    <div class="flex items-center justify-between mb-4">
                        <div class="morphing-gradient w-12 h-12 rounded-full flex items-center justify-center">
                            <i class="fas fa-heart text-white text-xl"></i>
                        </div>
                        <span class="text-green-400 text-sm font-semibold">+8.7%</span>
                    </div>
                    <div class="text-3xl font-bold text-white mb-1" id="engagedCouples">25,124</div>
                    <div class="text-gray-400 text-sm">Engaged Couples</div>
                    <div class="text-xs text-gray-500 mt-2">actively using app</div>
                </div>

                <!-- Partner Revenue -->
                <div class="metric-card rounded-2xl p-6 liquid-hover">
                    <div class="flex items-center justify-between mb-4">
                        <div class="morphing-gradient w-12 h-12 rounded-full flex items-center justify-center">
                            <i class="fas fa-dollar-sign text-white text-xl"></i>
                        </div>
                        <span class="text-green-400 text-sm font-semibold">+34.2%</span>
                    </div>
                    <div class="text-3xl font-bold text-white mb-1" id="partnerRevenue">$847K</div>
                    <div class="text-gray-400 text-sm">Partner Revenue</div>
                    <div class="text-xs text-gray-500 mt-2">this month</div>
                </div>

                <!-- App Sessions -->
                <div class="metric-card rounded-2xl p-6 liquid-hover">
                    <div class="flex items-center justify-between mb-4">
                        <div class="morphing-gradient w-12 h-12 rounded-full flex items-center justify-center">
                            <i class="fas fa-mobile-alt text-white text-xl"></i>
                        </div>
                        <span class="text-green-400 text-sm font-semibold">+19.3%</span>
                    </div>
                    <div class="text-3xl font-bold text-white mb-1" id="appSessions">1.2M</div>
                    <div class="text-gray-400 text-sm">Monthly Sessions</div>
                    <div class="text-xs text-gray-500 mt-2">avg 4.8 per user</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Charts Section -->
    <section class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- User Growth Chart -->
                <div class="liquid-glass-dark rounded-2xl p-6 liquid-hover">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-white">User Growth</h3>
                        <div class="flex space-x-2">
                            <button class="text-pink-400 bg-pink-400/20 px-3 py-1 rounded-lg text-sm font-semibold">7D</button>
                            <button class="text-gray-400 hover:text-white px-3 py-1 rounded-lg text-sm">30D</button>
                            <button class="text-gray-400 hover:text-white px-3 py-1 rounded-lg text-sm">90D</button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="userGrowthChart"></canvas>
                    </div>
                </div>

                <!-- Revenue Analytics -->
                <div class="liquid-glass-dark rounded-2xl p-6 liquid-hover">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold text-white">Revenue Analytics</h3>
                        <div class="flex items-center space-x-2">
                            <div class="w-3 h-3 bg-pink-500 rounded-full"></div>
                            <span class="text-sm text-gray-400">Partner Revenue</span>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Engagement Metrics -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <!-- Feature Usage -->
                <div class="liquid-glass-dark rounded-2xl p-6 liquid-hover">
                    <h3 class="text-xl font-bold text-white mb-6">Feature Usage</h3>
                    <div class="chart-container">
                        <canvas id="featureUsageChart"></canvas>
                    </div>
                </div>

                <!-- Couple Activity -->
                <div class="liquid-glass-dark rounded-2xl p-6 liquid-hover">
                    <h3 class="text-xl font-bold text-white mb-6">Daily Activity</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Morning (6-12pm)</span>
                            <div class="flex items-center">
                                <div class="w-24 bg-gray-700 rounded-full h-2 mr-3">
                                    <div class="bg-pink-500 h-2 rounded-full" style="width: 65%"></div>
                                </div>
                                <span class="text-white font-semibold">65%</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Afternoon (12-6pm)</span>
                            <div class="flex items-center">
                                <div class="w-24 bg-gray-700 rounded-full h-2 mr-3">
                                    <div class="bg-purple-500 h-2 rounded-full" style="width: 45%"></div>
                                </div>
                                <span class="text-white font-semibold">45%</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Evening (6pm-12am)</span>
                            <div class="flex items-center">
                                <div class="w-24 bg-gray-700 rounded-full h-2 mr-3">
                                    <div class="bg-blue-500 h-2 rounded-full" style="width: 85%"></div>
                                </div>
                                <span class="text-white font-semibold">85%</span>
                            </div>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-gray-300">Late Night (12-6am)</span>
                            <div class="flex items-center">
                                <div class="w-24 bg-gray-700 rounded-full h-2 mr-3">
                                    <div class="bg-green-500 h-2 rounded-full" style="width: 25%"></div>
                                </div>
                                <span class="text-white font-semibold">25%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Top Partner Categories -->
                <div class="liquid-glass-dark rounded-2xl p-6 liquid-hover">
                    <h3 class="text-xl font-bold text-white mb-6">Top Partners</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-utensils text-white text-sm"></i>
                                </div>
                                <span class="text-gray-300">Dining</span>
                            </div>
                            <span class="text-white font-semibold">342 partners</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-plane text-white text-sm"></i>
                                </div>
                                <span class="text-gray-300">Travel</span>
                            </div>
                            <span class="text-white font-semibold">187 partners</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-gift text-white text-sm"></i>
                                </div>
                                <span class="text-gray-300">Gifts</span>
                            </div>
                            <span class="text-white font-semibold">156 partners</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-spa text-white text-sm"></i>
                                </div>
                                <span class="text-gray-300">Wellness</span>
                            </div>
                            <span class="text-white font-semibold">124 partners</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mr-3">
                                    <i class="fas fa-theater-masks text-white text-sm"></i>
                                </div>
                                <span class="text-gray-300">Entertainment</span>
                            </div>
                            <span class="text-white font-semibold">98 partners</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Feature Status Dashboard -->
    <section class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-white mb-8">Platform Features Status</h2>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Core Features -->
                <div class="liquid-glass-dark rounded-2xl p-6">
                    <h3 class="text-xl font-bold text-white mb-6 flex items-center">
                        <i class="fas fa-heart text-pink-500 mr-3"></i>
                        Core Relationship Features
                    </h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-active rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">Relationship Challenges</div>
                                    <div class="text-gray-400 text-sm">Daily activities for couples</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-green-400 font-semibold">87% engagement</div>
                                <div class="text-gray-400 text-sm">12.5K daily active</div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-active rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">Date Night Planner</div>
                                    <div class="text-gray-400 text-sm">Personalized date suggestions</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-green-400 font-semibold">73% usage</div>
                                <div class="text-gray-400 text-sm">8.2K weekly plans</div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-active rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">Communication Tools</div>
                                    <div class="text-gray-400 text-sm">Chat, voice notes, shared calendars</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-green-400 font-semibold">91% active</div>
                                <div class="text-gray-400 text-sm">45K messages/day</div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-active rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">Progress Tracking</div>
                                    <div class="text-gray-400 text-sm">Relationship milestones & goals</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-green-400 font-semibold">65% completion</div>
                                <div class="text-gray-400 text-sm">3.4K goals set</div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-beta rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">AI Relationship Coach</div>
                                    <div class="text-gray-400 text-sm">Personalized advice & insights</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-yellow-400 font-semibold">Beta Testing</div>
                                <div class="text-gray-400 text-sm">500 beta users</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Business Features -->
                <div class="liquid-glass-dark rounded-2xl p-6">
                    <h3 class="text-xl font-bold text-white mb-6 flex items-center">
                        <i class="fas fa-business-time text-blue-500 mr-3"></i>
                        Business & Partner Features
                    </h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-active rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">Member Rewards Program</div>
                                    <div class="text-gray-400 text-sm">Credits, tiers, exclusive discounts</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-green-400 font-semibold">89% adoption</div>
                                <div class="text-gray-400 text-sm">$2.4K avg spend</div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-active rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">Partner Integration</div>
                                    <div class="text-gray-400 text-sm">API, booking system, analytics</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-green-400 font-semibold">500+ partners</div>
                                <div class="text-gray-400 text-sm">847K revenue</div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-active rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">Local Discovery</div>
                                    <div class="text-gray-400 text-sm">Geo-based partner recommendations</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-green-400 font-semibold">76% usage</div>
                                <div class="text-gray-400 text-sm">15K searches/day</div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-beta rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">Smart Recommendations</div>
                                    <div class="text-gray-400 text-sm">ML-powered partner matching</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-yellow-400 font-semibold">Beta Phase</div>
                                <div class="text-gray-400 text-sm">85% accuracy</div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="flex items-center">
                                <div class="w-3 h-3 status-planned rounded-full mr-4"></div>
                                <div>
                                    <div class="text-white font-semibold">Enterprise Dashboard</div>
                                    <div class="text-gray-400 text-sm">Partner analytics & reporting</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-gray-400 font-semibold">Q2 2025</div>
                                <div class="text-gray-400 text-sm">Development</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Real-time Activity Feed -->
    <section class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="liquid-glass-dark rounded-2xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-white flex items-center">
                        <i class="fas fa-pulse text-green-400 mr-3"></i>
                        Live Activity Feed
                    </h3>
                    <div class="flex items-center space-x-2">
                        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span class="text-green-400 text-sm font-semibold">Live</span>
                    </div>
                </div>
                <div class="space-y-3" id="activityFeed">
                    <!-- Activity items will be populated by JavaScript -->
                </div>
            </div>
        </div>
    </section>

    <!-- JavaScript for Dashboard Functionality -->
    <script>
        // Dashboard Data and Functionality
        let charts = {};

        // Initialize Dashboard
        document.addEventListener('DOMContentLoaded', function() {
            // Check authentication (demo purposes - in production use proper auth)
            const isAuthenticated = localStorage.getItem('bt_authenticated') === 'true';
            if (!isAuthenticated && !window.location.search.includes('demo=true')) {
                // Redirect to login page
                window.location.href = '/login.html';
                return;
            }
            
            // Display user info
            const user = JSON.parse(localStorage.getItem('bt_user') || '{}');
            const userInfo = document.getElementById('userInfo');
            if (userInfo && user.name) {
                userInfo.textContent = user.name;
            }
            
            // Logout functionality
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    localStorage.removeItem('bt_authenticated');
                    localStorage.removeItem('bt_user');
                    window.location.href = '/login.html';
                });
            }
            
            initializeCharts();
            startRealTimeUpdates();
            updateLastUpdatedTime();
        });

        // Initialize Charts
        function initializeCharts() {
            // User Growth Chart
            const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
            charts.userGrowth = new Chart(userGrowthCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Active Users',
                        data: [32000, 35500, 38200, 42100, 45800, 48300, 50247],
                        borderColor: '#ec4899',
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#9ca3af'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#9ca3af'
                            }
                        }
                    }
                }
            });

            // Revenue Chart
            const revenueCtx = document.getElementById('revenueChart').getContext('2d');
            charts.revenue = new Chart(revenueCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                    datasets: [{
                        label: 'Partner Revenue',
                        data: [425, 468, 523, 587, 634, 721, 847],
                        backgroundColor: [
                            'rgba(236, 72, 153, 0.8)',
                            'rgba(139, 92, 246, 0.8)',
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(168, 85, 247, 0.8)'
                        ],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#9ca3af',
                                callback: function(value) {
                                    return '$' + value + 'K';
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                color: '#9ca3af'
                            }
                        }
                    }
                }
            });

            // Feature Usage Chart
            const featureCtx = document.getElementById('featureUsageChart').getContext('2d');
            charts.featureUsage = new Chart(featureCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Challenges', 'Date Planner', 'Chat', 'Rewards', 'Discovery'],
                    datasets: [{
                        data: [35, 25, 20, 12, 8],
                        backgroundColor: [
                            '#ec4899',
                            '#8b5cf6',
                            '#3b82f6',
                            '#10b981',
                            '#f59e0b'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#9ca3af',
                                usePointStyle: true,
                                padding: 20
                            }
                        }
                    }
                }
            });
        }

        // Real-time Updates
        function startRealTimeUpdates() {
            // Update activity feed every 3 seconds
            setInterval(updateActivityFeed, 3000);
            
            // Update metrics every 30 seconds
            setInterval(updateMetrics, 30000);
            
            // Update timestamp every minute
            setInterval(updateLastUpdatedTime, 60000);
        }

        // Update Activity Feed
        function updateActivityFeed() {
            const activities = [
                { icon: 'fas fa-heart', color: 'text-pink-400', text: 'New couple joined from San Francisco', time: 'now' },
                { icon: 'fas fa-trophy', color: 'text-yellow-400', text: 'Challenge completed: "Date Night Planning"', time: '2m ago' },
                { icon: 'fas fa-handshake', color: 'text-blue-400', text: 'New partner registered: "Bella Vista Restaurant"', time: '5m ago' },
                { icon: 'fas fa-gift', color: 'text-green-400', text: 'Reward redeemed: 25% off spa package', time: '7m ago' },
                { icon: 'fas fa-star', color: 'text-purple-400', text: 'Couple achieved Silver tier status', time: '12m ago' }
            ];

            const feed = document.getElementById('activityFeed');
            feed.innerHTML = activities.map(activity => 
                '<div class="flex items-center space-x-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors animate-fade-in-up">' +
                    '<div class="morphing-gradient w-10 h-10 rounded-full flex items-center justify-center">' +
                        '<i class="' + activity.icon + ' text-white text-sm"></i>' +
                    '</div>' +
                    '<div class="flex-1">' +
                        '<div class="text-white font-medium">' + activity.text + '</div>' +
                    '</div>' +
                    '<div class="text-gray-400 text-sm">' + activity.time + '</div>' +
                '</div>'
            ).join('');
        }

        // Update Metrics
        function updateMetrics() {
            // Simulate real-time metric updates
            const totalUsers = Math.floor(50247 + Math.random() * 100);
            const engagedCouples = Math.floor(totalUsers * 0.5);
            const partnerRevenue = Math.floor(847 + Math.random() * 10);
            const appSessions = (1.2 + (Math.random() * 0.1 - 0.05)).toFixed(1);

            document.getElementById('totalUsers').textContent = totalUsers.toLocaleString();
            document.getElementById('engagedCouples').textContent = engagedCouples.toLocaleString();
            document.getElementById('partnerRevenue').textContent = '$' + partnerRevenue + 'K';
            document.getElementById('appSessions').textContent = appSessions + 'M';
        }

        // Update Last Updated Time
        function updateLastUpdatedTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            document.getElementById('lastUpdated').textContent = timeString;
        }

        // Smooth scroll to sections
        function scrollToSection(sectionId) {
            document.getElementById(sectionId)?.scrollIntoView({ 
                behavior: 'smooth' 
            });
        }

        // Initialize activity feed on load
        updateActivityFeed();
    </script>
</body>
</html>`;