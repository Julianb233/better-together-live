// Subscription Boxes - Full E-commerce System with Lean Canvas Integration
import { navigationHtml } from '../components/navigation.js';

export const subscriptionBoxesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relationship Subscription Boxes - Curated Experiences Delivered | Better Together</title>
    <meta name="description" content="Premium subscription boxes for couples. Romance, Adventure, Anniversary, Self-Care & Personalized boxes delivered monthly. AI-curated experiences for couples.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
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
                        }
                    },
                    fontFamily: {
                        'inter': ['Inter', 'sans-serif']
                    },
                    animation: {
                        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                        'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
                        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite'
                    }
                }
            }
        }
    </script>
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fce7f3 100%);
        }
        .box-shadow-custom {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .profit-badge {
            background: linear-gradient(45deg, #10b981, #059669);
            color: white;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }
    </style>
</head>
<body class="bg-gray-50 font-inter">
    ${navigationHtml}

    <!-- Coming Soon Banner -->
    <section class="bg-amber-50 border-b border-amber-200">
        <div class="max-w-4xl mx-auto px-4 py-6 text-center">
            <div class="inline-flex items-center px-4 py-2 bg-amber-100 border border-amber-300 rounded-full mb-2">
                <i class="fas fa-clock text-amber-600 mr-2"></i>
                <span class="text-amber-800 font-semibold text-lg">Coming Soon</span>
            </div>
            <p class="text-amber-700 text-sm mt-1">Subscription boxes are currently in development. Join our waitlist to be notified when they launch.</p>
        </div>
    </section>

    <!-- Hero Section -->
    <section class="gradient-bg py-16 sm:py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <!-- Lean Canvas Value Prop Badge -->
                <div class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
                    <i class="fas fa-heart mr-2"></i>
                    AI-Curated Relationship Experiences
                </div>
                
                <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Subscription Boxes That
                    <span class="block text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        Strengthen Your Bond
                    </span>
                </h1>
                
                <p class="text-xl sm:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
                    Premium curated experiences delivered monthly. Our AI learns your relationship preferences and selects the perfect items to deepen your connection.
                </p>
                
                <!-- Key Metrics Preview -->
                <div class="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-pink-600 mb-2"><i class="fas fa-heart"></i></div>
                        <div class="text-sm text-gray-600">AI-Curated</div>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-purple-600 mb-2">5 Types</div>
                        <div class="text-sm text-gray-600">Box Categories</div>
                    </div>
                    <div class="bg-white rounded-xl p-6 shadow-lg">
                        <div class="text-3xl font-bold text-blue-600 mb-2">$50-120</div>
                        <div class="text-sm text-gray-600">Price Range</div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <button disabled class="w-full sm:w-auto bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold cursor-not-allowed opacity-75 shadow-lg">
                        <i class="fas fa-clock mr-2"></i>
                        Coming Soon
                    </button>
                    <a href="/paywall" class="w-full sm:w-auto bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold border border-pink-300 hover:bg-pink-50 transition-colors shadow-lg text-center">
                        <i class="fas fa-crown mr-2"></i>
                        View Current Plans
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Subscription Box Types -->
    <section class="py-16 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Choose Your Relationship Experience
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Each box is AI-curated based on your relationship preferences and designed to deliver exceptional value.
                </p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <!-- Romance Box -->
                <div class="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="mb-6 rounded-xl overflow-hidden">
                        <img src="/images/generated/romance-box.png" alt="Romance Box - Premium candle, chocolates, bath bomb" class="w-full h-48 object-cover">
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-heart text-white text-lg"></i>
                        </div>
                        <div class="text-pink-600 font-semibold text-sm">Most Popular</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Romance Box</h3>
                    <p class="text-gray-600 mb-6">Premium candle, artisan chocolates, luxury bath bomb, personalized love note card</p>
                    
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$60<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Free shipping included</div>
                        <button disabled class="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed opacity-75">
                            Coming Soon
                        </button>
                    </div>
                </div>

                <!-- Adventure Date Box -->
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="mb-6 rounded-xl overflow-hidden">
                        <img src="/images/generated/adventure-box.png" alt="Adventure Date Box - Hiking gear, picnic supplies" class="w-full h-48 object-cover">
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-mountain text-white text-lg"></i>
                        </div>
                        <div class="text-purple-600 font-semibold text-sm">Premium</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Adventure Date Box</h3>
                    <p class="text-gray-600 mb-6">DIY painting kit, picnic blanket, couples game, adventure planning guide</p>
                    
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$85<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Free shipping included</div>
                        <button disabled class="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed opacity-75">
                            Coming Soon
                        </button>
                    </div>
                </div>

                <!-- Anniversary Box -->
                <div class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="mb-6 rounded-xl overflow-hidden">
                        <img src="/images/generated/anniversary-box.png" alt="Anniversary Box - Champagne glasses, jewelry, keepsake" class="w-full h-48 object-cover">
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-gift text-white text-lg"></i>
                        </div>
                        <div class="text-purple-600 font-semibold text-sm">Premium</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Anniversary Box</h3>
                    <p class="text-gray-600 mb-6">Jewelry piece, wine glass set, gourmet snacks, celebration accessories</p>
                    
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$120<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Free shipping included</div>
                        <button disabled class="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed opacity-75">
                            Coming Soon
                        </button>
                    </div>
                </div>

                <!-- Self-Care Box -->
                <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="mb-6 rounded-xl overflow-hidden">
                        <img src="/images/generated/selfcare-box.png" alt="Self-Care Box - Skincare, aromatherapy, tea" class="w-full h-48 object-cover">
                    </div>
                    <div class="flex items-center justify-between mb-4">
                        <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-leaf text-white text-lg"></i>
                        </div>
                        <div class="text-green-600 font-semibold text-sm">Wellness</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Self-Care Box</h3>
                    <p class="text-gray-600 mb-6">Relationship journal, premium tea set, aromatherapy oils, mindfulness guide</p>
                    
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$50<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Free shipping included</div>
                        <button disabled class="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed opacity-75">
                            Coming Soon
                        </button>
                    </div>
                </div>

                <!-- Personalized Box -->
                <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 hover-lift transition-all duration-300 box-shadow-custom">
                    <div class="flex items-center justify-between mb-6">
                        <div class="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                            <i class="fas fa-star text-white text-2xl"></i>
                        </div>
                        <div class="text-purple-600 font-semibold text-sm">Premium</div>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">Personalized Box</h3>
                    <p class="text-gray-600 mb-6">Custom engraved keepsake, personalized candle, luxury gift wrap, AI-selected items</p>
                    
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-900 mb-2">$100<span class="text-lg font-normal text-gray-600">/month</span></div>
                        <div class="text-green-600 font-semibold mb-4">Free shipping included</div>
                        <button disabled class="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed opacity-75">
                            Coming Soon
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- What's in Each Box -->
    <section class="py-16 bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">What Makes Our Boxes Special</h2>
                <p class="text-xl text-gray-300">Every item is hand-selected and AI-curated for your relationship</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 text-center">
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-pink-400 mb-2"><i class="fas fa-brain"></i></div>
                    <div class="text-gray-300">AI-Curated Selection</div>
                    <div class="text-sm text-gray-400 mt-1">Personalized to your preferences</div>
                </div>
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-purple-400 mb-2"><i class="fas fa-gem"></i></div>
                    <div class="text-gray-300">Premium Quality Items</div>
                    <div class="text-sm text-gray-400 mt-1">Handpicked artisan products</div>
                </div>
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="text-3xl font-bold text-blue-400 mb-2"><i class="fas fa-truck"></i></div>
                    <div class="text-gray-300">Free Shipping</div>
                    <div class="text-sm text-gray-400 mt-1">Delivered to your door monthly</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Annual Subscription Benefits -->
    <section class="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Annual Subscription Perks</h2>
                <p class="text-xl text-gray-600">Commit for a year and unlock exclusive benefits that boost customer retention</p>
            </div>

            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">Exclusive Annual Benefits</h3>
                    <div class="space-y-4">
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-percentage text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">15% Discount</h4>
                                <p class="text-gray-600">Save on all subscription boxes for the entire year</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-crown text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Custom Engraving</h4>
                                <p class="text-gray-600">Free personalized items and handwritten notes in every box</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-gift text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Bonus Premium Items</h4>
                                <p class="text-gray-600">Luxury candle or wine opener added to every monthly box</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-calendar-star text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Special Occasion Box</h4>
                                <p class="text-gray-600">Free anniversary and holiday boxes for committed subscribers</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                                <i class="fas fa-qrcode text-white"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Exclusive Content</h4>
                                <p class="text-gray-600">QR codes for curated date ideas and relationship tutorials</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-2xl p-8 shadow-lg">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6 text-center">Annual Savings Calculator</h3>
                    <div class="space-y-4">
                        <div class="flex justify-between items-center">
                            <span class="text-gray-600">Monthly Romance Box:</span>
                            <span class="font-semibold">$60 × 12 = $720</span>
                        </div>
                        <div class="flex justify-between items-center text-green-600">
                            <span>Annual Discount (15%):</span>
                            <span class="font-semibold">-$108</span>
                        </div>
                        <div class="flex justify-between items-center text-purple-600">
                            <span>Free Special Occasion Boxes:</span>
                            <span class="font-semibold">-$120 value</span>
                        </div>
                        <div class="border-t pt-4 flex justify-between items-center text-xl font-bold">
                            <span>Your Annual Price:</span>
                            <span class="text-green-600">$612</span>
                        </div>
                        <div class="text-center text-gray-600">
                            <span class="font-semibold text-green-600">Save $228</span> compared to monthly billing
                        </div>
                    </div>
                    <button disabled class="w-full bg-gray-400 text-white py-4 rounded-xl font-semibold mt-6 cursor-not-allowed opacity-75">
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Lean Canvas Integration -->
    <section class="py-16 bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Strategic Business Model</h2>
                <p class="text-xl text-gray-300">How subscription boxes integrate with our Lean Canvas strategy</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-users text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Customer Segments</h3>
                    <ul class="text-sm text-gray-300 space-y-2">
                        <li>• Couples seeking deeper connection</li>
                        <li>• Friend groups supporting relationships</li>
                        <li>• Therapists & relationship coaches</li>
                        <li>• Retail & experience vendors</li>
                    </ul>
                </div>

                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-lightbulb text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Value Proposition</h3>
                    <p class="text-sm text-gray-300">
                        AI-driven relationship guidance + curated physical experiences + calendar reminders + community support = Complete relationship ecosystem
                    </p>
                </div>

                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-dollar-sign text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Revenue Streams</h3>
                    <ul class="text-sm text-gray-300 space-y-2">
                        <li>• Subscription boxes (recurring)</li>
                        <li>• App subscriptions (recurring revenue)</li>
                        <li>• Vendor partnerships & commissions</li>
                        <li>• Premium AI-executed services</li>
                    </ul>
                </div>

                <div class="bg-gray-800 rounded-xl p-6">
                    <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-4">
                        <i class="fas fa-star text-white"></i>
                    </div>
                    <h3 class="text-lg font-bold mb-3">Unfair Advantage</h3>
                    <ul class="text-sm text-gray-300 space-y-2">
                        <li>• AI-executed actions for partners</li>
                        <li>• Emotionally intelligent AI</li>
                        <li>• Integrated calendar & reminders</li>
                        <li>• Vendor-curated experiences</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-pink-600 to-purple-600 text-white">
        <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl md:text-4xl font-bold mb-4">
                Start Building Stronger Relationships Today
            </h2>
            <p class="text-xl mb-8 opacity-90">
                Join thousands of couples already strengthening their bonds with AI-curated experiences
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <button disabled class="w-full sm:w-auto bg-white/50 text-pink-300 px-8 py-4 rounded-xl font-semibold cursor-not-allowed shadow-lg">
                    <i class="fas fa-clock mr-2"></i>
                    Coming Soon
                </button>
                <a href="/paywall" class="w-full sm:w-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pink-600 transition-colors text-center">
                    <i class="fas fa-crown mr-2"></i>
                    View Current Plans
                </a>
            </div>

            <div class="text-pink-100">
                <p class="text-sm">
                    <i class="fas fa-shield-alt mr-2"></i>
                    30-day money back guarantee • Cancel anytime • Free shipping on annual plans
                </p>
            </div>
        </div>
    </section>

    <!-- JavaScript for Interactive Features -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Add smooth scrolling for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add hover effects to subscription boxes
            const boxCards = document.querySelectorAll('.hover-lift');
            boxCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Subscription button interactions
            const subscribeButtons = document.querySelectorAll('button[class*="bg-"]');
            subscribeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Add ripple effect
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 100);
                    
                    // Here you would integrate with subscription service
                    console.log('Subscription button clicked:', this.textContent.trim());
                });
            });

            // Animate numbers on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        if (element.classList.contains('animate-number')) {
                            animateNumber(element);
                            observer.unobserve(element);
                        }
                    }
                });
            }, observerOptions);

            // Observe elements with animation
            const animateElements = document.querySelectorAll('.animate-number');
            animateElements.forEach(el => observer.observe(el));
        });

        function animateNumber(element) {
            const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
            const duration = 1500;
            const start = performance.now();
            
            function update(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(progress * target);
                
                if (element.textContent.includes('%')) {
                    element.textContent = current + '%';
                } else if (element.textContent.includes('$')) {
                    element.textContent = '$' + current.toLocaleString();
                } else {
                    element.textContent = current.toLocaleString();
                }
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }
            
            requestAnimationFrame(update);
        }
    </script>
</body>
</html>`;