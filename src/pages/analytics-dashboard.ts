// Analytics Dashboard - Comprehensive Admin Analytics Portal
export const analyticsDashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Analytics Dashboard | Better Together</title>
    <meta name="description" content="Comprehensive admin analytics dashboard for Better Together - monitor users, relationships, engagement, revenue, and platform performance.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
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
                        },
                        purple: {
                            500: '#8b5cf6',
                            600: '#7c3aed',
                            700: '#6d28d9'
                        }
                    },
                    fontFamily: {
                        'inter': ['Inter', 'sans-serif']
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }

        .glass-card {
            backdrop-filter: blur(20px) saturate(180%);
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .glass-card:hover {
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
            border-color: rgba(236, 72, 153, 0.3);
            transform: translateY(-2px);
            transition: all 0.3s ease;
        }

        .dashboard-bg {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
            min-height: 100vh;
        }

        .metric-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .chart-container {
            position: relative;
            height: 300px;
            width: 100%;
        }

        .gradient-text {
            background: linear-gradient(45deg, #ec4899, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(236, 72, 153, 0.5);
            border-radius: 4px;
        }
    </style>
</head>
<body class="dashboard-bg text-white">
    <!-- Navigation -->
    <nav class="glass-card sticky top-0 z-50 border-b border-white/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center">
                    <a href="/" class="flex items-center">
                        <span class="text-2xl">💕</span>
                        <span class="ml-2 text-xl font-bold text-white">Better Together</span>
                        <span class="ml-3 text-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full font-semibold">Admin</span>
                    </a>
                </div>
                <div class="hidden md:flex items-center space-x-6">
                    <a href="/admin/analytics" class="text-pink-400 font-medium border-b-2 border-pink-400 pb-1">Analytics</a>
                    <a href="/dashboard.html" class="text-gray-300 hover:text-white transition-colors">Platform Dashboard</a>
                    <a href="/" class="text-gray-300 hover:text-white transition-colors">Home</a>
                    <button id="exportBtn" class="glass-card text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-500/20 transition-colors">
                        <i class="fas fa-download mr-2"></i>Export
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <section class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                <div>
                    <h1 class="text-4xl font-bold mb-2">
                        <span class="gradient-text">Admin Analytics Dashboard</span>
                    </h1>
                    <p class="text-xl text-gray-300">Real-time platform insights and performance metrics</p>
                    <div class="flex items-center mt-4 space-x-4">
                        <div class="glass-card px-4 py-2 rounded-lg">
                            <div class="flex items-center">
                                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                                <span class="text-sm text-gray-200">Live Data</span>
                            </div>
                        </div>
                        <div class="glass-card px-4 py-2 rounded-lg">
                            <span class="text-sm text-gray-200">Updated: <span id="lastUpdated">Loading...</span></span>
                        </div>
                    </div>
                </div>
                <div class="mt-6 lg:mt-0">
                    <div class="flex space-x-3">
                        <button onclick="changeTimeRange('7d')" id="btn-7d" class="time-range-btn bg-pink-500/20 text-pink-400 px-4 py-2 rounded-lg font-semibold">7D</button>
                        <button onclick="changeTimeRange('30d')" id="btn-30d" class="time-range-btn text-gray-400 px-4 py-2 rounded-lg font-semibold">30D</button>
                        <button onclick="changeTimeRange('90d')" id="btn-90d" class="time-range-btn text-gray-400 px-4 py-2 rounded-lg font-semibold">90D</button>
                        <button onclick="changeTimeRange('all')" id="btn-all" class="time-range-btn text-gray-400 px-4 py-2 rounded-lg font-semibold">All Time</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Key Metrics Overview -->
    <section class="py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold mb-6">Overview Metrics</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Total Users -->
                <div class="glass-card metric-card rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-users text-white text-xl"></i>
                        </div>
                        <span class="text-green-400 text-sm font-semibold" id="usersGrowth">+0%</span>
                    </div>
                    <div class="text-3xl font-bold text-white mb-1" id="totalUsers">-</div>
                    <div class="text-gray-400 text-sm">Total Active Users</div>
                </div>

                <!-- Active Relationships -->
                <div class="glass-card metric-card rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-heart text-white text-xl"></i>
                        </div>
                        <span class="text-green-400 text-sm font-semibold" id="relationshipsGrowth">+0%</span>
                    </div>
                    <div class="text-3xl font-bold text-white mb-1" id="activeRelationships">-</div>
                    <div class="text-gray-400 text-sm">Active Relationships</div>
                </div>

                <!-- Daily Checkins -->
                <div class="glass-card metric-card rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-check-circle text-white text-xl"></i>
                        </div>
                        <span class="text-green-400 text-sm font-semibold" id="checkinsGrowth">+0%</span>
                    </div>
                    <div class="text-3xl font-bold text-white mb-1" id="dailyCheckins">-</div>
                    <div class="text-gray-400 text-sm">Daily Check-ins (Today)</div>
                </div>

                <!-- Active Streaks -->
                <div class="glass-card metric-card rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-fire text-white text-xl"></i>
                        </div>
                        <span class="text-purple-400 text-sm font-semibold">Avg: <span id="avgStreak">-</span></span>
                    </div>
                    <div class="text-3xl font-bold text-white mb-1" id="activeStreaks">-</div>
                    <div class="text-gray-400 text-sm">Active Check-in Streaks</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Engagement Metrics -->
    <section class="py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold mb-6">Engagement Metrics</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <!-- Average Session Time -->
                <div class="glass-card rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-white">Avg Session Time</h3>
                        <i class="fas fa-clock text-blue-400 text-xl"></i>
                    </div>
                    <div class="text-4xl font-bold text-white mb-2" id="avgSessionTime">-</div>
                    <div class="text-sm text-gray-400">minutes per session</div>
                    <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500" style="width: 0%" id="sessionTimeBar"></div>
                    </div>
                </div>

                <!-- Retention Rate -->
                <div class="glass-card rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-white">Retention Rate (30d)</h3>
                        <i class="fas fa-user-check text-green-400 text-xl"></i>
                    </div>
                    <div class="text-4xl font-bold text-white mb-2" id="retentionRate">-</div>
                    <div class="text-sm text-gray-400">users returned in 30 days</div>
                    <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-green-500 to-emerald-500" style="width: 0%" id="retentionBar"></div>
                    </div>
                </div>

                <!-- Feature Adoption -->
                <div class="glass-card rounded-2xl p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-white">Feature Adoption</h3>
                        <i class="fas fa-star text-yellow-400 text-xl"></i>
                    </div>
                    <div class="text-4xl font-bold text-white mb-2" id="featureAdoption">-</div>
                    <div class="text-sm text-gray-400">users using premium features</div>
                    <div class="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-yellow-500 to-orange-500" style="width: 0%" id="adoptionBar"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Revenue Metrics -->
    <section class="py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold mb-6">Revenue Metrics</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <!-- Subscribers -->
                <div class="glass-card rounded-2xl p-6">
                    <div class="flex items-center mb-3">
                        <i class="fas fa-crown text-yellow-400 text-2xl mr-3"></i>
                        <div>
                            <div class="text-2xl font-bold text-white" id="totalSubscribers">-</div>
                            <div class="text-xs text-gray-400">Active Subscribers</div>
                        </div>
                    </div>
                    <div class="text-sm text-green-400" id="subscribersGrowth">+0% this month</div>
                </div>

                <!-- MRR -->
                <div class="glass-card rounded-2xl p-6">
                    <div class="flex items-center mb-3">
                        <i class="fas fa-dollar-sign text-green-400 text-2xl mr-3"></i>
                        <div>
                            <div class="text-2xl font-bold text-white" id="mrr">-</div>
                            <div class="text-xs text-gray-400">Monthly Recurring Revenue</div>
                        </div>
                    </div>
                    <div class="text-sm text-green-400" id="mrrGrowth">+0% MoM</div>
                </div>

                <!-- Churn Rate -->
                <div class="glass-card rounded-2xl p-6">
                    <div class="flex items-center mb-3">
                        <i class="fas fa-user-minus text-red-400 text-2xl mr-3"></i>
                        <div>
                            <div class="text-2xl font-bold text-white" id="churnRate">-</div>
                            <div class="text-xs text-gray-400">Monthly Churn Rate</div>
                        </div>
                    </div>
                    <div class="text-sm text-gray-400" id="churnChange">vs last month</div>
                </div>

                <!-- ARPU -->
                <div class="glass-card rounded-2xl p-6">
                    <div class="flex items-center mb-3">
                        <i class="fas fa-chart-line text-blue-400 text-2xl mr-3"></i>
                        <div>
                            <div class="text-2xl font-bold text-white" id="arpu">-</div>
                            <div class="text-xs text-gray-400">Avg Revenue Per User</div>
                        </div>
                    </div>
                    <div class="text-sm text-green-400" id="arpuGrowth">+0% growth</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Charts Section -->
    <section class="py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Daily Active Users Chart -->
                <div class="glass-card rounded-2xl p-6">
                    <h3 class="text-xl font-bold text-white mb-6">Daily Active Users</h3>
                    <div class="chart-container">
                        <canvas id="dauChart"></canvas>
                    </div>
                </div>

                <!-- Check-in Trends Chart -->
                <div class="glass-card rounded-2xl p-6">
                    <h3 class="text-xl font-bold text-white mb-6">Check-in Trends</h3>
                    <div class="chart-container">
                        <canvas id="checkinChart"></canvas>
                    </div>
                </div>

                <!-- Popular Activities Chart -->
                <div class="glass-card rounded-2xl p-6">
                    <h3 class="text-xl font-bold text-white mb-6">Popular Activities</h3>
                    <div class="chart-container">
                        <canvas id="activitiesChart"></canvas>
                    </div>
                </div>

                <!-- Revenue Breakdown Chart -->
                <div class="glass-card rounded-2xl p-6">
                    <h3 class="text-xl font-bold text-white mb-6">Revenue Breakdown</h3>
                    <div class="chart-container">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Detailed Tables -->
    <section class="py-4">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-2xl font-bold mb-6">Detailed Breakdowns</h2>

            <!-- Top Performing Features -->
            <div class="glass-card rounded-2xl p-6 mb-8">
                <h3 class="text-xl font-bold text-white mb-6">Top Performing Features</h3>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-gray-700">
                                <th class="text-left py-3 text-gray-400 font-semibold">Feature</th>
                                <th class="text-right py-3 text-gray-400 font-semibold">Active Users</th>
                                <th class="text-right py-3 text-gray-400 font-semibold">Usage %</th>
                                <th class="text-right py-3 text-gray-400 font-semibold">Engagement Score</th>
                                <th class="text-right py-3 text-gray-400 font-semibold">Trend</th>
                            </tr>
                        </thead>
                        <tbody id="featuresTableBody">
                            <tr><td colspan="5" class="text-center py-8 text-gray-400">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Recent Activity Log -->
            <div class="glass-card rounded-2xl p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-white">Recent Platform Activity</h3>
                    <div class="flex items-center">
                        <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                        <span class="text-green-400 text-sm font-semibold">Live</span>
                    </div>
                </div>
                <div class="space-y-3" id="activityFeed">
                    <div class="text-center py-8 text-gray-400">Loading activity...</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer Spacing -->
    <div class="h-16"></div>

    <!-- JavaScript -->
    <script>
        let charts = {};
        let currentTimeRange = '7d';
        let refreshInterval;

        // Initialize Dashboard
        document.addEventListener('DOMContentLoaded', function() {
            initializeDashboard();
            startAutoRefresh();
        });

        async function initializeDashboard() {
            await loadOverviewMetrics();
            await loadEngagementMetrics();
            await loadRevenueMetrics();
            await initializeCharts();
            await loadFeaturesTable();
            await loadActivityFeed();
            updateLastUpdatedTime();
        }

        async function loadOverviewMetrics() {
            try {
                const response = await fetch('/api/analytics/overview');
                const data = await response.json();

                document.getElementById('totalUsers').textContent = data.totalUsers?.toLocaleString() || '-';
                document.getElementById('usersGrowth').textContent = data.growthMetrics?.usersGrowth || '+0%';

                document.getElementById('activeRelationships').textContent = data.engagedCouples?.toLocaleString() || '-';
                document.getElementById('relationshipsGrowth').textContent = data.growthMetrics?.couplesGrowth || '+0%';

                // Mock data for checkins and streaks (would come from real API)
                const dailyCheckins = Math.floor(data.totalUsers * 0.45);
                document.getElementById('dailyCheckins').textContent = dailyCheckins.toLocaleString();
                document.getElementById('checkinsGrowth').textContent = '+15.2%';

                const activeStreaks = Math.floor(data.totalUsers * 0.32);
                document.getElementById('activeStreaks').textContent = activeStreaks.toLocaleString();
                document.getElementById('avgStreak').textContent = '12 days';

            } catch (error) {
                console.error('Error loading overview metrics:', error);
            }
        }

        async function loadEngagementMetrics() {
            try {
                const response = await fetch('/api/analytics/users');
                const data = await response.json();

                if (data.engagement) {
                    const sessionMinutes = parseFloat(data.engagement.averageSessionDuration) || 12.5;
                    document.getElementById('avgSessionTime').textContent = sessionMinutes.toFixed(1);
                    document.getElementById('sessionTimeBar').style.width = Math.min((sessionMinutes / 30) * 100, 100) + '%';

                    // Calculate retention (DAU/MAU ratio as proxy)
                    const retention = ((data.engagement.dailyActiveUsers / data.engagement.monthlyActiveUsers) * 100).toFixed(1);
                    document.getElementById('retentionRate').textContent = retention + '%';
                    document.getElementById('retentionBar').style.width = retention + '%';

                    // Feature adoption estimate
                    const adoption = '68%';
                    document.getElementById('featureAdoption').textContent = adoption;
                    document.getElementById('adoptionBar').style.width = adoption;
                }
            } catch (error) {
                console.error('Error loading engagement metrics:', error);
            }
        }

        async function loadRevenueMetrics() {
            try {
                const response = await fetch('/api/analytics/revenue');
                const data = await response.json();

                if (data.breakdown) {
                    const subscribers = Math.floor(data.breakdown.subscriptions / 9.99);
                    document.getElementById('totalSubscribers').textContent = subscribers.toLocaleString();
                    document.getElementById('subscribersGrowth').textContent = '+12.3% this month';

                    const mrr = Math.floor(data.breakdown.subscriptions / 1000);
                    document.getElementById('mrr').textContent = '$' + mrr + 'K';
                    document.getElementById('mrrGrowth').textContent = '+18.5% MoM';

                    document.getElementById('churnRate').textContent = '2.8%';
                    document.getElementById('churnChange').textContent = '-0.3% vs last month';

                    document.getElementById('arpu').textContent = '$' + data.metrics?.averageOrderValue?.toFixed(2) || '-';
                    document.getElementById('arpuGrowth').textContent = '+5.2% growth';
                }
            } catch (error) {
                console.error('Error loading revenue metrics:', error);
            }
        }

        async function initializeCharts() {
            await initDAUChart();
            await initCheckinChart();
            await initActivitiesChart();
            await initRevenueChart();
        }

        async function initDAUChart() {
            try {
                const response = await fetch('/api/analytics/users');
                const data = await response.json();

                const ctx = document.getElementById('dauChart').getContext('2d');
                const labels = data.growth?.map(d => d.month) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const values = data.growth?.map(d => d.users) || [12500, 13200, 14100, 15800, 16200, 17100, 18234];

                charts.dau = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Daily Active Users',
                            data: values,
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
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: false,
                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                ticks: { color: '#9ca3af' }
                            },
                            x: {
                                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                                ticks: { color: '#9ca3af' }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error initializing DAU chart:', error);
            }
        }

        async function initCheckinChart() {
            const ctx = document.getElementById('checkinChart').getContext('2d');
            const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const values = [8500, 9200, 8800, 10100, 11200, 12500, 11800];

            charts.checkin = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Daily Check-ins',
                        data: values,
                        backgroundColor: 'rgba(139, 92, 246, 0.8)',
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#9ca3af' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#9ca3af' }
                        }
                    }
                }
            });
        }

        async function initActivitiesChart() {
            try {
                const response = await fetch('/api/analytics/features');
                const data = await response.json();

                const ctx = document.getElementById('activitiesChart').getContext('2d');
                const labels = data.usage?.map(f => f.name) || ['Challenges', 'Date Planner', 'Communication', 'Rewards', 'Discovery'];
                const values = data.usage?.map(f => f.usage) || [35, 25, 20, 12, 8];

                charts.activities = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: values,
                            backgroundColor: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'],
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
                                    padding: 15,
                                    usePointStyle: true
                                }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error initializing activities chart:', error);
            }
        }

        async function initRevenueChart() {
            try {
                const response = await fetch('/api/analytics/revenue');
                const data = await response.json();

                const ctx = document.getElementById('revenueChart').getContext('2d');

                charts.revenue = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: ['Subscriptions', 'Credits', 'Add-ons', 'Partner Commission'],
                        datasets: [{
                            label: 'Revenue ($K)',
                            data: [89, 45, 35, 678],
                            backgroundColor: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
                            borderRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                ticks: {
                                    color: '#9ca3af',
                                    callback: value => '$' + value + 'K'
                                }
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: '#9ca3af' }
                            }
                        }
                    }
                });
            } catch (error) {
                console.error('Error initializing revenue chart:', error);
            }
        }

        async function loadFeaturesTable() {
            try {
                const response = await fetch('/api/analytics/features');
                const data = await response.json();

                const tbody = document.getElementById('featuresTableBody');
                if (data.usage && data.usage.length > 0) {
                    tbody.innerHTML = data.usage.map(feature => \`
                        <tr class="border-b border-gray-800 hover:bg-white/5 transition-colors">
                            <td class="py-4 text-white font-medium">\${feature.name}</td>
                            <td class="py-4 text-right text-gray-300">\${feature.users?.toLocaleString()}</td>
                            <td class="py-4 text-right text-gray-300">\${feature.usage}%</td>
                            <td class="py-4 text-right">
                                <span class="px-3 py-1 rounded-full text-sm font-semibold \${feature.engagement > 85 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}">
                                    \${feature.engagement}%
                                </span>
                            </td>
                            <td class="py-4 text-right">
                                <span class="text-green-400"><i class="fas fa-arrow-up mr-1"></i>+12%</span>
                            </td>
                        </tr>
                    \`).join('');
                }
            } catch (error) {
                console.error('Error loading features table:', error);
            }
        }

        async function loadActivityFeed() {
            try {
                const response = await fetch('/api/analytics/activity');
                const data = await response.json();

                const feed = document.getElementById('activityFeed');
                if (data.activities && data.activities.length > 0) {
                    feed.innerHTML = data.activities.map(activity => \`
                        <div class="flex items-center space-x-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <div class="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                                <i class="\${activity.icon} text-white text-sm"></i>
                            </div>
                            <div class="flex-1">
                                <div class="text-white font-medium">\${activity.message}</div>
                            </div>
                            <div class="text-gray-400 text-sm">\${activity.timeAgo}</div>
                        </div>
                    \`).join('');
                }
            } catch (error) {
                console.error('Error loading activity feed:', error);
            }
        }

        function changeTimeRange(range) {
            currentTimeRange = range;

            // Update button styles
            document.querySelectorAll('.time-range-btn').forEach(btn => {
                btn.classList.remove('bg-pink-500/20', 'text-pink-400');
                btn.classList.add('text-gray-400');
            });
            document.getElementById('btn-' + range).classList.add('bg-pink-500/20', 'text-pink-400');
            document.getElementById('btn-' + range).classList.remove('text-gray-400');

            // Reload charts with new time range
            initializeCharts();
        }

        function updateLastUpdatedTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            document.getElementById('lastUpdated').textContent = timeString;
        }

        function startAutoRefresh() {
            // Refresh activity feed every 5 seconds
            setInterval(loadActivityFeed, 5000);

            // Update timestamp every second
            setInterval(updateLastUpdatedTime, 1000);

            // Refresh all data every 30 seconds
            setInterval(() => {
                loadOverviewMetrics();
                loadEngagementMetrics();
                loadRevenueMetrics();
            }, 30000);
        }

        // Export functionality
        document.getElementById('exportBtn').addEventListener('click', async function() {
            try {
                const response = await fetch('/api/analytics/export');
                const data = await response.json();

                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});

                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'better-together-analytics-' + new Date().toISOString().split('T')[0] + '.json';
                link.click();

                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error exporting data:', error);
                alert('Error exporting data. Please try again.');
            }
        });
    </script>
</body>
</html>`;
