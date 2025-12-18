// Analytics API Routes - Backend data for dashboard
import { Hono } from 'hono'

const analyticsApi = new Hono()

// Mock data for dashboard - In production, this would connect to your database
const generateMockData = () => {
    const baseDate = new Date()
    const userGrowthData = []
    const revenueData = []
    const featureUsageData = []
    
    // Generate user growth data for last 12 months
    for (let i = 11; i >= 0; i--) {
        const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1)
        const baseUsers = 30000 + (11 - i) * 2000
        const variance = Math.floor(Math.random() * 1000)
        userGrowthData.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            users: baseUsers + variance,
            growth: i === 11 ? 0 : Math.floor(Math.random() * 15) + 5
        })
    }
    
    // Generate revenue data
    for (let i = 11; i >= 0; i--) {
        const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1)
        const baseRevenue = 400 + (11 - i) * 40
        const variance = Math.floor(Math.random() * 50)
        revenueData.push({
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            revenue: baseRevenue + variance,
            partners: 50 + (11 - i) * 40 + Math.floor(Math.random() * 20)
        })
    }
    
    return {
        userGrowthData,
        revenueData,
        featureUsageData: [
            { name: 'Relationship Challenges', usage: 35, engagement: 87, users: 12500 },
            { name: 'Date Night Planner', usage: 25, engagement: 73, users: 8200 },
            { name: 'Communication Tools', usage: 20, engagement: 91, users: 45000 },
            { name: 'Member Rewards', usage: 12, engagement: 89, users: 22000 },
            { name: 'Local Discovery', usage: 8, engagement: 76, users: 15000 }
        ]
    }
}

// Dashboard overview metrics
analyticsApi.get('/overview', (c) => {
    const now = new Date()
    const variance = Math.random() * 0.1 - 0.05 // ±5% variance for realism
    
    return c.json({
        totalUsers: Math.floor(50247 * (1 + variance)),
        engagedCouples: Math.floor(25124 * (1 + variance)),
        partnerRevenue: Math.floor(847 * (1 + variance)),
        appSessions: Number((1.2 * (1 + variance)).toFixed(1)),
        growthMetrics: {
            usersGrowth: '+12.5%',
            couplesGrowth: '+8.7%',
            revenueGrowth: '+34.2%',
            sessionsGrowth: '+19.3%'
        },
        lastUpdated: now.toISOString()
    })
})

// User analytics data
analyticsApi.get('/users', (c) => {
    const data = generateMockData()
    
    return c.json({
        growth: data.userGrowthData,
        demographics: {
            ageGroups: [
                { range: '18-24', percentage: 15, count: 7537 },
                { range: '25-34', percentage: 45, count: 22611 },
                { range: '35-44', percentage: 28, count: 14069 },
                { range: '45-54', percentage: 10, count: 5025 },
                { range: '55+', percentage: 2, count: 1005 }
            ],
            locations: [
                { city: 'San Francisco', users: 8245, percentage: 16.4 },
                { city: 'New York', users: 7521, percentage: 15.0 },
                { city: 'Los Angeles', users: 6234, percentage: 12.4 },
                { city: 'Chicago', users: 4521, percentage: 9.0 },
                { city: 'Seattle', users: 3876, percentage: 7.7 }
            ]
        },
        engagement: {
            dailyActiveUsers: 18234,
            weeklyActiveUsers: 32456,
            monthlyActiveUsers: 50247,
            averageSessionDuration: '12.5 minutes',
            sessionsPerUser: 4.8
        }
    })
})

// Revenue analytics
analyticsApi.get('/revenue', (c) => {
    const data = generateMockData()
    
    return c.json({
        monthly: data.revenueData,
        breakdown: {
            partnerCommissions: 678000,
            subscriptions: 89000,
            premiumFeatures: 45000,
            other: 35000
        },
        topPartners: [
            { name: 'Bella Vista Restaurant', category: 'Dining', revenue: 25400, growth: '+15%' },
            { name: 'Sunset Spa Resort', category: 'Wellness', revenue: 18900, growth: '+22%' },
            { name: 'Adventure Tours Co', category: 'Activities', revenue: 16700, growth: '+8%' },
            { name: 'Fine Jewelry Studio', category: 'Gifts', revenue: 14200, growth: '+31%' },
            { name: 'Boutique Hotel Chain', category: 'Travel', revenue: 12800, growth: '+12%' }
        ],
        metrics: {
            averageOrderValue: 156,
            conversionRate: 3.4,
            customerLifetimeValue: 420,
            repeatPurchaseRate: 68
        }
    })
})

// Feature usage analytics
analyticsApi.get('/features', (c) => {
    const data = generateMockData()
    
    return c.json({
        usage: data.featureUsageData,
        adoption: {
            relationshipChallenges: {
                totalUsers: 12500,
                completionRate: 87,
                averageTimeSpent: '8.5 minutes',
                topChallenges: ['Date Night Planning', 'Communication Skills', 'Shared Goals']
            },
            dateNightPlanner: {
                totalUsers: 8200,
                plansCreated: 15600,
                executionRate: 73,
                averageRating: 4.6
            },
            memberRewards: {
                totalUsers: 22000,
                creditsEarned: 1240000,
                creditsRedeemed: 890000,
                redemptionRate: 72,
                averageSpend: 2400
            },
            communicationTools: {
                totalUsers: 45000,
                messagesPerDay: 125000,
                voiceNotesPerDay: 8900,
                calendarEventsCreated: 3400
            }
        },
        heatmap: [
            { hour: 0, activity: 15 }, { hour: 1, activity: 8 }, { hour: 2, activity: 5 },
            { hour: 3, activity: 3 }, { hour: 4, activity: 2 }, { hour: 5, activity: 5 },
            { hour: 6, activity: 25 }, { hour: 7, activity: 45 }, { hour: 8, activity: 65 },
            { hour: 9, activity: 72 }, { hour: 10, activity: 68 }, { hour: 11, activity: 75 },
            { hour: 12, activity: 85 }, { hour: 13, activity: 78 }, { hour: 14, activity: 70 },
            { hour: 15, activity: 65 }, { hour: 16, activity: 68 }, { hour: 17, activity: 75 },
            { hour: 18, activity: 88 }, { hour: 19, activity: 95 }, { hour: 20, activity: 92 },
            { hour: 21, activity: 85 }, { hour: 22, activity: 70 }, { hour: 23, activity: 45 }
        ]
    })
})

// Partner analytics
analyticsApi.get('/partners', (c) => {
    return c.json({
        summary: {
            totalPartners: 542,
            activePartners: 487,
            newThisMonth: 23,
            churnRate: 2.1
        },
        categories: [
            { name: 'Dining', count: 342, revenue: 425000, growth: '+15%' },
            { name: 'Travel', count: 187, revenue: 298000, growth: '+22%' },
            { name: 'Gifts', count: 156, revenue: 178000, growth: '+8%' },
            { name: 'Wellness', count: 124, revenue: 145000, growth: '+31%' },
            { name: 'Entertainment', count: 98, revenue: 89000, growth: '+12%' },
            { name: 'Activities', count: 87, revenue: 76000, growth: '+18%' }
        ],
        performance: {
            topPerforming: [
                { name: 'Bella Vista Restaurant', bookings: 456, rating: 4.8, revenue: 25400 },
                { name: 'Sunset Spa Resort', bookings: 234, rating: 4.9, revenue: 18900 },
                { name: 'Adventure Tours Co', bookings: 187, rating: 4.7, revenue: 16700 }
            ],
            metrics: {
                averageRating: 4.6,
                bookingConversion: 12.4,
                repeatBookingRate: 34,
                customerSatisfaction: 89
            }
        },
        geographic: [
            { region: 'San Francisco Bay', partners: 124, revenue: 234000 },
            { region: 'New York Metro', partners: 98, revenue: 187000 },
            { region: 'Los Angeles', partners: 87, revenue: 156000 },
            { region: 'Chicago', partners: 65, revenue: 123000 },
            { region: 'Seattle', partners: 54, revenue: 98000 }
        ]
    })
})

// Real-time activity feed
analyticsApi.get('/activity', (c) => {
    const activities = [
        { type: 'user_join', icon: 'fas fa-heart', color: 'text-pink-400', message: 'New couple joined from San Francisco', timestamp: new Date() },
        { type: 'challenge_complete', icon: 'fas fa-trophy', color: 'text-yellow-400', message: 'Challenge completed: "Date Night Planning"', timestamp: new Date(Date.now() - 2 * 60 * 1000) },
        { type: 'partner_join', icon: 'fas fa-handshake', color: 'text-blue-400', message: 'New partner registered: "Bella Vista Restaurant"', timestamp: new Date(Date.now() - 5 * 60 * 1000) },
        { type: 'reward_redeem', icon: 'fas fa-gift', color: 'text-green-400', message: 'Reward redeemed: 25% off spa package', timestamp: new Date(Date.now() - 7 * 60 * 1000) },
        { type: 'tier_achievement', icon: 'fas fa-star', color: 'text-purple-400', message: 'Couple achieved Silver tier status', timestamp: new Date(Date.now() - 12 * 60 * 1000) },
        { type: 'date_planned', icon: 'fas fa-calendar', color: 'text-blue-400', message: 'Date night planned: Romantic dinner for two', timestamp: new Date(Date.now() - 15 * 60 * 1000) },
        { type: 'milestone', icon: 'fas fa-medal', color: 'text-orange-400', message: '6-month anniversary milestone reached', timestamp: new Date(Date.now() - 18 * 60 * 1000) },
        { type: 'booking', icon: 'fas fa-ticket-alt', color: 'text-indigo-400', message: 'Spa day booking confirmed', timestamp: new Date(Date.now() - 22 * 60 * 1000) }
    ]
    
    return c.json({
        activities: activities.map(activity => ({
            ...activity,
            timeAgo: getTimeAgo(activity.timestamp)
        }))
    })
})

// System health and performance
analyticsApi.get('/system', (c) => {
    return c.json({
        health: {
            status: 'healthy',
            uptime: '99.98%',
            responseTime: '142ms',
            errorRate: '0.02%'
        },
        infrastructure: {
            cloudflareEdge: {
                status: 'operational',
                cacheHitRate: '94.2%',
                edgeLocations: 275
            },
            database: {
                status: 'optimal',
                connectionPool: '87% utilized',
                queryTime: '23ms average'
            },
            api: {
                status: 'healthy',
                requestsPerSecond: 342,
                peakRPS: 1250
            }
        },
        performance: {
            pageLoadTime: '1.2s',
            mobileScore: 94,
            desktopScore: 98,
            seoScore: 95
        }
    })
})

// Export analytics for business intelligence
analyticsApi.get('/export', (c) => {
    const exportData = {
        timestamp: new Date().toISOString(),
        summary: {
            totalUsers: 50247,
            engagedCouples: 25124,
            partnerRevenue: 847000,
            appSessions: 1200000
        },
        features: [
            { name: 'Relationship Challenges', activeUsers: 12500, engagement: 87 },
            { name: 'Date Night Planner', activeUsers: 8200, engagement: 73 },
            { name: 'Communication Tools', activeUsers: 45000, engagement: 91 },
            { name: 'Member Rewards', activeUsers: 22000, engagement: 89 },
            { name: 'Local Discovery', activeUsers: 15000, engagement: 76 }
        ],
        partners: {
            total: 542,
            categories: ['Dining', 'Travel', 'Gifts', 'Wellness', 'Entertainment', 'Activities'],
            topRevenue: 847000
        }
    }
    
    // Set CSV headers
    c.header('Content-Type', 'application/json')
    c.header('Content-Disposition', 'attachment; filename=better-together-analytics.json')
    
    return c.json(exportData)
})

// Utility function to calculate time ago
function getTimeAgo(timestamp: Date): string {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
}

export default analyticsApi