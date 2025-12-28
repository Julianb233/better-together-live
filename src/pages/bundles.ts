// Bundles Shop Page - Customer-facing product catalog
import { navigationHtml } from '../components/navigation.js';

export const bundlesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop Bundles - Better Together</title>
    <meta name="description" content="Premium relationship subscription boxes and bundles. Monthly themes, intimate moments, platinum collections, and more.">
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.1/dist/ScrollTrigger.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(20px); }
        .gradient-border { background: linear-gradient(135deg, #ec4899, #8b5cf6); padding: 3px; border-radius: 20px; }
        .hover-scale { transition: all 0.3s ease; }
        .hover-scale:hover { transform: scale(1.03); }
        .badge-limited { background: linear-gradient(135deg, #f59e0b, #ef4444); }
        .badge-popular { background: linear-gradient(135deg, #ec4899, #8b5cf6); }
        .badge-new { background: linear-gradient(135deg, #10b981, #3b82f6); }
    </style>
</head>
<body class="min-h-screen">
    ${navigationHtml}

    <!-- Hero Section -->
    <section class="py-16 px-4">
        <div class="max-w-7xl mx-auto text-center">
            <div class="hero-badge inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
                <i class="fas fa-gift mr-2"></i>
                Shop Relationship Bundles
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Curated Experiences for
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                    Stronger Bonds
                </span>
            </h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Monthly subscription boxes, special bundles, and exclusive collections designed to bring couples closer together.
            </p>
        </div>
    </section>

    <!-- Monthly Subscription Section -->
    <section class="py-12 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">2025 Monthly Themes</h2>
                <p class="text-gray-600">Subscribe and receive a new themed box every month</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <!-- January: Love Goals -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <div class="text-4xl mb-4">🎯</div>
                    <h3 class="font-bold text-gray-900 mb-2">January: Love Goals</h3>
                    <p class="text-sm text-gray-600 mb-4">Start the year with relationship resolutions and goal-setting activities</p>
                    <div class="text-pink-600 font-bold">$49.99/month</div>
                </div>

                <!-- February: Valentine's Magic -->
                <div class="gradient-border hover-scale">
                    <div class="glass-card rounded-[17px] p-6">
                        <span class="badge-popular text-white text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block">MOST POPULAR</span>
                        <div class="text-4xl mb-4">💕</div>
                        <h3 class="font-bold text-gray-900 mb-2">February: Valentine's Magic</h3>
                        <p class="text-sm text-gray-600 mb-2">"Love is in the Air Edition"</p>
                        <ul class="text-xs text-gray-500 mb-4 space-y-1">
                            <li>• First Dance Music Box</li>
                            <li>• Love Letter Writing Kit</li>
                            <li>• 52 Reasons I Love You Cards</li>
                            <li>• Couples Massage Oil Set</li>
                        </ul>
                        <div class="text-pink-600 font-bold">$59.99/month</div>
                    </div>
                </div>

                <!-- March: Spring Renewal -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <div class="text-4xl mb-4">🌸</div>
                    <h3 class="font-bold text-gray-900 mb-2">March: Spring Renewal</h3>
                    <p class="text-sm text-gray-600 mb-4">Fresh beginnings and new adventures for couples</p>
                    <div class="text-pink-600 font-bold">$49.99/month</div>
                </div>

                <!-- April: Playful Partners -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <div class="text-4xl mb-4">🎮</div>
                    <h3 class="font-bold text-gray-900 mb-2">April: Playful Partners</h3>
                    <p class="text-sm text-gray-600 mb-4">Games, fun activities, and laughter-filled moments</p>
                    <div class="text-pink-600 font-bold">$49.99/month</div>
                </div>

                <!-- May: Wedding Season -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <div class="text-4xl mb-4">💒</div>
                    <h3 class="font-bold text-gray-900 mb-2">May: Wedding Season</h3>
                    <p class="text-sm text-gray-600 mb-4">Celebrate love and commitment with elegant touches</p>
                    <div class="text-pink-600 font-bold">$49.99/month</div>
                </div>

                <!-- June: Adventure Together -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <div class="text-4xl mb-4">🏔️</div>
                    <h3 class="font-bold text-gray-900 mb-2">June: Adventure Together</h3>
                    <p class="text-sm text-gray-600 mb-4">Outdoor activities and exploration gear for couples</p>
                    <div class="text-pink-600 font-bold">$54.99/month</div>
                </div>

                <!-- July: Summer Romance -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <div class="text-4xl mb-4">☀️</div>
                    <h3 class="font-bold text-gray-900 mb-2">July: Summer Romance</h3>
                    <p class="text-sm text-gray-600 mb-4">Beach dates, sunset picnics, and warm memories</p>
                    <div class="text-pink-600 font-bold">$49.99/month</div>
                </div>

                <!-- August: Gratitude & Growth -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <div class="text-4xl mb-4">🌻</div>
                    <h3 class="font-bold text-gray-900 mb-2">August: Gratitude & Growth</h3>
                    <p class="text-sm text-gray-600 mb-4">Appreciation exercises and relationship reflection</p>
                    <div class="text-pink-600 font-bold">$49.99/month</div>
                </div>

                <!-- October: Spooky Couples -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <span class="badge-new text-white text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block">SEASONAL</span>
                    <div class="text-4xl mb-4">🎃</div>
                    <h3 class="font-bold text-gray-900 mb-2">October: Spooky Couples</h3>
                    <p class="text-sm text-gray-600 mb-4">Halloween fun, cozy movie nights, and fall treats</p>
                    <div class="text-pink-600 font-bold">$49.99/month</div>
                </div>

                <!-- November: Thankful Hearts -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <div class="text-4xl mb-4">🦃</div>
                    <h3 class="font-bold text-gray-900 mb-2">November: Thankful Hearts</h3>
                    <p class="text-sm text-gray-600 mb-4">Gratitude practices and cozy couple activities</p>
                    <div class="text-pink-600 font-bold">$49.99/month</div>
                </div>

                <!-- December: Cozy Nights -->
                <div class="gradient-border hover-scale">
                    <div class="glass-card rounded-[17px] p-6">
                        <span class="badge-popular text-white text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block">BEST SELLER</span>
                        <div class="text-4xl mb-4">❄️</div>
                        <h3 class="font-bold text-gray-900 mb-2">December: Cozy Nights</h3>
                        <p class="text-sm text-gray-600 mb-2">"Winter Warmth Edition"</p>
                        <ul class="text-xs text-gray-500 mb-4 space-y-1">
                            <li>• Matching Holiday Pajamas</li>
                            <li>• Hot Cocoa Bomb Set</li>
                            <li>• Fireside Chat Candle</li>
                            <li>• Holiday Ornament</li>
                        </ul>
                        <div class="text-pink-600 font-bold">$59.99/month</div>
                    </div>
                </div>

                <!-- September: New Surprises -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg">
                    <span class="badge-new text-white text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block">COMING SOON</span>
                    <div class="text-4xl mb-4">🍂</div>
                    <h3 class="font-bold text-gray-900 mb-2">September: New Surprises</h3>
                    <p class="text-sm text-gray-600 mb-4">Mystery theme revealed soon!</p>
                    <div class="text-gray-400 font-bold">TBD</div>
                </div>
            </div>

            <!-- Subscribe CTA -->
            <div class="text-center">
                <button class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 shadow-lg transition-all">
                    <i class="fas fa-box-heart mr-2"></i>
                    Subscribe to Monthly Box - $49.99/month
                </button>
                <p class="text-sm text-gray-500 mt-4">Cancel anytime. Free shipping on all boxes.</p>
            </div>
        </div>
    </section>

    <!-- Special Bundles Section -->
    <section class="py-16 px-4 bg-white/50">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Special Edition Bundles</h2>
                <p class="text-gray-600">Premium curated collections for special occasions</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Intimate Moments Bundle -->
                <div class="glass-card rounded-2xl overflow-hidden hover-scale shadow-xl">
                    <div class="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
                        <span class="badge-limited text-white text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block">LIMITED EDITION</span>
                        <h3 class="text-2xl font-bold mb-2">Intimate Moments Bundle</h3>
                        <p class="opacity-90">Deepen your connection</p>
                    </div>
                    <div class="p-6">
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-pink-500 mr-3"></i>
                                Silk Sleep Mask Set
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-pink-500 mr-3"></i>
                                Premium Candles Collection
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-pink-500 mr-3"></i>
                                Couples Massage Oil Set
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-pink-500 mr-3"></i>
                                Relationship Journal
                            </li>
                        </ul>
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="text-3xl font-bold text-gray-900">$89.99</span>
                                <span class="text-sm text-gray-500 line-through ml-2">$120</span>
                            </div>
                            <button class="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Platinum Collection -->
                <div class="glass-card rounded-2xl overflow-hidden hover-scale shadow-xl">
                    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                        <span class="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block">LIFETIME EXCLUSIVE</span>
                        <h3 class="text-2xl font-bold mb-2">Platinum Collection</h3>
                        <p class="opacity-90">The ultimate relationship package</p>
                    </div>
                    <div class="p-6">
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-crown text-purple-500 mr-3"></i>
                                Matching Promise Rings
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-crown text-purple-500 mr-3"></i>
                                Premium Couples Journal
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-crown text-purple-500 mr-3"></i>
                                Crystal Heart Keepsake
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-crown text-purple-500 mr-3"></i>
                                Lifetime App Access
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-crown text-purple-500 mr-3"></i>
                                VIP Support Priority
                            </li>
                        </ul>
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="text-3xl font-bold text-gray-900">$199.99</span>
                                <span class="text-sm text-gray-500 line-through ml-2">$350</span>
                            </div>
                            <button class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Wellness Together Box -->
                <div class="glass-card rounded-2xl overflow-hidden hover-scale shadow-xl">
                    <div class="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
                        <span class="badge-new text-white text-xs px-3 py-1 rounded-full font-semibold mb-3 inline-block">MIND BODY SOUL</span>
                        <h3 class="text-2xl font-bold mb-2">Wellness Together Box</h3>
                        <p class="opacity-90">Health & harmony for couples</p>
                    </div>
                    <div class="p-6">
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                Matching Yoga Mats
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                Couples Meditation Guide
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                Aromatherapy Set
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-check text-green-500 mr-3"></i>
                                Healthy Recipe Cards
                            </li>
                        </ul>
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="text-3xl font-bold text-gray-900">$79.99</span>
                                <span class="text-sm text-gray-500 line-through ml-2">$110</span>
                            </div>
                            <button class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Custom Wall Art Section -->
    <section class="py-16 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="glass-card rounded-2xl p-8 md:p-12 shadow-xl">
                <div class="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <span class="badge-new text-white text-xs px-3 py-1 rounded-full font-semibold mb-4 inline-block">PERSONALIZED</span>
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">Custom Wall Art</h2>
                        <p class="text-gray-600 mb-6">
                            Create personalized artwork featuring your names, special dates, and meaningful quotes. Perfect for anniversaries, weddings, or just because.
                        </p>
                        <ul class="space-y-3 mb-6">
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-palette text-pink-500 mr-3"></i>
                                Multiple design templates
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-heart text-pink-500 mr-3"></i>
                                Custom names & dates
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-print text-pink-500 mr-3"></i>
                                Premium canvas or framed prints
                            </li>
                            <li class="flex items-center text-gray-700">
                                <i class="fas fa-truck text-pink-500 mr-3"></i>
                                Free shipping on orders $50+
                            </li>
                        </ul>
                        <div class="flex items-center gap-4">
                            <span class="text-2xl font-bold text-gray-900">Starting at $39.99</span>
                            <button class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition">
                                Create Yours
                            </button>
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-8">
                            <div class="text-6xl mb-4">🖼️</div>
                            <p class="text-gray-600 font-medium">"Sarah & Michael"</p>
                            <p class="text-gray-500 text-sm">Est. June 15, 2020</p>
                            <p class="text-pink-600 mt-2 italic">"Forever & Always"</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Merchandise Section -->
    <section class="py-16 px-4 bg-white/50">
        <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Couples Merchandise</h2>
                <p class="text-gray-600">Show off your love with matching items</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Coffee Mugs -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg text-center">
                    <div class="text-5xl mb-4">☕</div>
                    <h3 class="font-bold text-gray-900 mb-2">Couples Mugs</h3>
                    <p class="text-sm text-gray-600 mb-4">Soulmate Fuel, Love Perks, Brewing Love Daily</p>
                    <div class="text-pink-600 font-bold">$24.99/pair</div>
                </div>

                <!-- T-Shirts -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg text-center">
                    <div class="text-5xl mb-4">👕</div>
                    <h3 class="font-bold text-gray-900 mb-2">Matching T-Shirts</h3>
                    <p class="text-sm text-gray-600 mb-4">His/Hers, King/Queen, Partner in Crime</p>
                    <div class="text-pink-600 font-bold">$39.99/pair</div>
                </div>

                <!-- Hoodies -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg text-center">
                    <div class="text-5xl mb-4">🧥</div>
                    <h3 class="font-bold text-gray-900 mb-2">Couples Hoodies</h3>
                    <p class="text-sm text-gray-600 mb-4">Cozy matching sets for all seasons</p>
                    <div class="text-pink-600 font-bold">$59.99/pair</div>
                </div>

                <!-- Accessories -->
                <div class="glass-card rounded-2xl p-6 hover-scale shadow-lg text-center">
                    <div class="text-5xl mb-4">💍</div>
                    <h3 class="font-bold text-gray-900 mb-2">Accessories</h3>
                    <p class="text-sm text-gray-600 mb-4">Bracelets, keychains, phone cases</p>
                    <div class="text-pink-600 font-bold">From $14.99</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Hearts Loyalty Program -->
    <section class="py-16 px-4">
        <div class="max-w-7xl mx-auto">
            <div class="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
                <div class="text-center mb-12">
                    <div class="text-5xl mb-4">💖</div>
                    <h2 class="text-3xl font-bold mb-4">Hearts Loyalty Program</h2>
                    <p class="text-pink-100 max-w-2xl mx-auto">Earn hearts with every purchase and unlock exclusive rewards. The more you love, the more you save!</p>
                </div>

                <div class="grid md:grid-cols-4 gap-6">
                    <div class="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                        <div class="text-2xl mb-2">💕</div>
                        <h3 class="font-bold mb-2">New Love</h3>
                        <p class="text-sm text-pink-100 mb-2">0-499 Hearts</p>
                        <p class="text-xs text-pink-200">Earn 1 heart per $1</p>
                    </div>
                    <div class="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                        <div class="text-2xl mb-2">💖</div>
                        <h3 class="font-bold mb-2">Growing Strong</h3>
                        <p class="text-sm text-pink-100 mb-2">500-999 Hearts</p>
                        <p class="text-xs text-pink-200">5% off all orders</p>
                    </div>
                    <div class="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                        <div class="text-2xl mb-2">💝</div>
                        <h3 class="font-bold mb-2">Deeply Connected</h3>
                        <p class="text-sm text-pink-100 mb-2">1000-2499 Hearts</p>
                        <p class="text-xs text-pink-200">10% off + free shipping</p>
                    </div>
                    <div class="bg-white/20 backdrop-blur rounded-xl p-6 text-center border border-white/30">
                        <div class="text-2xl mb-2">👑</div>
                        <h3 class="font-bold mb-2">Soulmates</h3>
                        <p class="text-sm text-pink-100 mb-2">2500+ Hearts</p>
                        <p class="text-xs text-pink-200">15% off + VIP access</p>
                    </div>
                </div>

                <div class="text-center mt-8">
                    <button class="bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold hover:bg-pink-50 transition shadow-lg">
                        Join Hearts Program - It's Free!
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 px-4">
        <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Ready to Strengthen Your Bond?</h2>
            <p class="text-gray-600 mb-8">Start your subscription today and receive your first themed box within 5-7 business days.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 shadow-lg transition">
                    <i class="fas fa-box-heart mr-2"></i>
                    Subscribe Now
                </button>
                <button class="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 shadow-lg transition">
                    <i class="fas fa-gift mr-2"></i>
                    Gift a Subscription
                </button>
            </div>
            <p class="text-sm text-gray-500 mt-6">
                <i class="fas fa-shield-alt mr-2"></i>
                30-day money back guarantee • Cancel anytime • Free shipping on annual plans
            </p>
        </div>
    </section>

    <script>
        // Register GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Hero section animations
        gsap.from('.hero-badge', {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('h1', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            delay: 0.3,
            ease: 'power3.out'
        });

        gsap.from('h1 + p', {
            y: 40,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: 'power3.out'
        });

        // Monthly cards stagger animation
        gsap.utils.toArray('.glass-card, .gradient-border').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                y: 60,
                opacity: 0,
                scale: 0.95,
                duration: 0.8,
                delay: (i % 4) * 0.1,
                ease: 'power3.out'
            });
        });

        // Section headers fade in
        gsap.utils.toArray('section h2').forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Loyalty program card special animation
        const loyaltyCard = document.querySelector('.bg-gradient-to-r.from-pink-600.to-purple-600.rounded-2xl');
        if (loyaltyCard) {
            gsap.from(loyaltyCard, {
                scrollTrigger: {
                    trigger: loyaltyCard,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0.9,
                opacity: 0,
                duration: 1,
                ease: 'back.out(1.5)'
            });

            // Animate tier cards inside
            gsap.from(loyaltyCard.querySelectorAll('.bg-white\\\\/10, .bg-white\\\\/20'), {
                scrollTrigger: {
                    trigger: loyaltyCard,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse'
                },
                y: 30,
                opacity: 0,
                stagger: 0.15,
                duration: 0.6,
                delay: 0.3,
                ease: 'power2.out'
            });
        }

        // Parallax effect on background
        gsap.to('body', {
            backgroundPosition: '50% 100%',
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            }
        });

        // Floating animation for emojis
        gsap.utils.toArray('.text-4xl, .text-5xl').forEach(emoji => {
            gsap.to(emoji, {
                y: -8,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
        });

        // Button hover enhancement
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
            });
        });

        // Add click handlers for purchase buttons
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function() {
                const text = this.textContent.trim();
                if (text.includes('Subscribe') || text.includes('Buy')) {
                    gsap.to(this, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
                    setTimeout(() => alert('Opening checkout... (Demo mode - checkout integration coming soon!)'), 200);
                } else if (text.includes('Join Hearts')) {
                    gsap.to(this, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
                    setTimeout(() => alert('Welcome to Hearts! You\\'ve been enrolled in our loyalty program.'), 200);
                } else if (text.includes('Create Yours')) {
                    window.location.href = '/custom-art';
                } else if (text.includes('Gift')) {
                    window.location.href = '/gift-subscription';
                }
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        scrollTo: { y: target, offsetY: 80 },
                        duration: 1,
                        ease: 'power3.inOut'
                    });
                }
            });
        });
    </script>
</body>
</html>`;
