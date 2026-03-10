// Design System — Better Together & Jesus Entered the Chat
// Live, browseable component showcase for Paper.dev integration
export const designSystemHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design System — Better Together & JETC</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="/static/design-tokens.css" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .text-gradient-bt {
            background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .text-gradient-jetc {
            background: linear-gradient(135deg, #6366F1 0%, #0EA5E9 50%, #F59E0B 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .swatch {
            width: 80px; height: 80px; border-radius: 12px;
            display: flex; align-items: flex-end; justify-content: center;
            padding: 4px; font-size: 10px; color: white; font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .swatch-sm {
            width: 60px; height: 60px; border-radius: 8px;
            display: flex; align-items: flex-end; justify-content: center;
            padding: 2px; font-size: 9px; color: white; font-weight: 600;
            text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .section-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
        }
        .glass-demo {
            backdrop-filter: blur(40px) saturate(180%);
            background: linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05), rgba(255,255,255,0.1));
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        .tab-btn { cursor: pointer; transition: all 0.2s; }
        .tab-btn.active { border-bottom: 3px solid; font-weight: 600; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">

    <!-- Header -->
    <header class="bg-white border-b sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Design System</h1>
                <p class="text-sm text-gray-500">Better Together & Jesus Entered the Chat</p>
            </div>
            <div class="flex gap-2">
                <button onclick="switchBrand('bt')" id="tab-bt" class="tab-btn px-4 py-2 rounded-lg text-sm border-pink-500 text-pink-600 active">
                    💕 Better Together
                </button>
                <button onclick="switchBrand('jetc')" id="tab-jetc" class="tab-btn px-4 py-2 rounded-lg text-sm border-indigo-500 text-indigo-600">
                    ✝️ JETC
                </button>
            </div>
        </div>
    </header>

    <!-- Table of Contents -->
    <nav class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-6 py-3 flex gap-6 overflow-x-auto text-sm">
            <a href="#colors" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">Colors</a>
            <a href="#typography" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">Typography</a>
            <a href="#buttons" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">Buttons</a>
            <a href="#cards" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">Cards</a>
            <a href="#forms" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">Forms</a>
            <a href="#icons" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">Icons</a>
            <a href="#animations" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">Animations</a>
            <a href="#screens" class="text-gray-600 hover:text-gray-900 whitespace-nowrap">Key Screens</a>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto px-6 py-12 space-y-16">

        <!-- ==================== COLORS ==================== -->
        <section id="colors">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Color Palette</h2>
            <p class="text-gray-500 mb-8">Brand colors, semantic colors, and gradient definitions.</p>

            <!-- BT Colors -->
            <div id="colors-bt">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Better Together — Primary (Pink)</h3>
                <div class="flex flex-wrap gap-3 mb-6">
                    <div class="swatch" style="background:#fdf2f8;color:#9d174d">#fdf2f8</div>
                    <div class="swatch" style="background:#fce7f3;color:#9d174d">#fce7f3</div>
                    <div class="swatch" style="background:#fbcfe8;color:#9d174d">#fbcfe8</div>
                    <div class="swatch" style="background:#f9a8d4">#f9a8d4</div>
                    <div class="swatch" style="background:#f472b6">#f472b6</div>
                    <div class="swatch" style="background:#ec4899">#ec4899</div>
                    <div class="swatch" style="background:#db2777">#db2777</div>
                    <div class="swatch" style="background:#be185d">#be185d</div>
                    <div class="swatch" style="background:#9d174d">#9d174d</div>
                    <div class="swatch" style="background:#831843">#831843</div>
                </div>

                <h3 class="text-xl font-semibold text-gray-800 mb-4">Secondary (Purple)</h3>
                <div class="flex flex-wrap gap-3 mb-6">
                    <div class="swatch" style="background:#f5f3ff;color:#4c1d95">#f5f3ff</div>
                    <div class="swatch" style="background:#ede9fe;color:#4c1d95">#ede9fe</div>
                    <div class="swatch" style="background:#ddd6fe;color:#4c1d95">#ddd6fe</div>
                    <div class="swatch" style="background:#c4b5fd">#c4b5fd</div>
                    <div class="swatch" style="background:#a78bfa">#a78bfa</div>
                    <div class="swatch" style="background:#8b5cf6">#8b5cf6</div>
                    <div class="swatch" style="background:#7c3aed">#7c3aed</div>
                    <div class="swatch" style="background:#6d28d9">#6d28d9</div>
                    <div class="swatch" style="background:#5b21b6">#5b21b6</div>
                    <div class="swatch" style="background:#4c1d95">#4c1d95</div>
                </div>

                <h3 class="text-xl font-semibold text-gray-800 mb-4">Gradients</h3>
                <div class="flex flex-wrap gap-4 mb-6">
                    <div>
                        <div class="w-64 h-20 rounded-xl" style="background:linear-gradient(135deg, #FF6B9D 0%, #8B5CF6 50%, #3B82F6 100%)"></div>
                        <p class="text-xs text-gray-500 mt-1">Hero Gradient</p>
                    </div>
                    <div>
                        <div class="w-64 h-20 rounded-xl" style="background:linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)"></div>
                        <p class="text-xs text-gray-500 mt-1">Primary Gradient</p>
                    </div>
                    <div>
                        <div class="w-64 h-20 rounded-xl" style="background:linear-gradient(135deg, #fdf2f8, #fce7f3, #f5f3ff)"></div>
                        <p class="text-xs text-gray-500 mt-1">Subtle Background</p>
                    </div>
                </div>
            </div>

            <!-- JETC Colors -->
            <div id="colors-jetc" style="display:none">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">JETC — Primary (Indigo)</h3>
                <div class="flex flex-wrap gap-3 mb-6">
                    <div class="swatch" style="background:#EEF2FF;color:#312E81">#EEF2FF</div>
                    <div class="swatch" style="background:#E0E7FF;color:#312E81">#E0E7FF</div>
                    <div class="swatch" style="background:#C7D2FE;color:#312E81">#C7D2FE</div>
                    <div class="swatch" style="background:#A5B4FC">#A5B4FC</div>
                    <div class="swatch" style="background:#818CF8">#818CF8</div>
                    <div class="swatch" style="background:#6366F1">#6366F1</div>
                    <div class="swatch" style="background:#4F46E5">#4F46E5</div>
                    <div class="swatch" style="background:#4338CA">#4338CA</div>
                    <div class="swatch" style="background:#3730A3">#3730A3</div>
                    <div class="swatch" style="background:#312E81">#312E81</div>
                </div>

                <h3 class="text-xl font-semibold text-gray-800 mb-4">Gold (Accent)</h3>
                <div class="flex flex-wrap gap-3 mb-6">
                    <div class="swatch" style="background:#FFFBEB;color:#B45309">#FFFBEB</div>
                    <div class="swatch" style="background:#FEF3C7;color:#B45309">#FEF3C7</div>
                    <div class="swatch" style="background:#FDE68A;color:#B45309">#FDE68A</div>
                    <div class="swatch" style="background:#FCD34D;color:#B45309">#FCD34D</div>
                    <div class="swatch" style="background:#FBBF24">#FBBF24</div>
                    <div class="swatch" style="background:#F59E0B">#F59E0B</div>
                    <div class="swatch" style="background:#D97706">#D97706</div>
                    <div class="swatch" style="background:#B45309">#B45309</div>
                </div>

                <h3 class="text-xl font-semibold text-gray-800 mb-4">Sky (Secondary)</h3>
                <div class="flex flex-wrap gap-3 mb-6">
                    <div class="swatch" style="background:#F0F9FF;color:#0284C7">#F0F9FF</div>
                    <div class="swatch" style="background:#E0F2FE;color:#0284C7">#E0F2FE</div>
                    <div class="swatch" style="background:#BAE6FD;color:#0284C7">#BAE6FD</div>
                    <div class="swatch" style="background:#7DD3FC">#7DD3FC</div>
                    <div class="swatch" style="background:#38BDF8">#38BDF8</div>
                    <div class="swatch" style="background:#0EA5E9">#0EA5E9</div>
                    <div class="swatch" style="background:#0284C7">#0284C7</div>
                </div>

                <h3 class="text-xl font-semibold text-gray-800 mb-4">Gradients</h3>
                <div class="flex flex-wrap gap-4 mb-6">
                    <div>
                        <div class="w-64 h-20 rounded-xl" style="background:linear-gradient(135deg, #6366F1 0%, #0EA5E9 50%, #F59E0B 100%)"></div>
                        <p class="text-xs text-gray-500 mt-1">Hero Gradient</p>
                    </div>
                    <div>
                        <div class="w-64 h-20 rounded-xl" style="background:linear-gradient(135deg, #312E81 0%, #4F46E5 100%)"></div>
                        <p class="text-xs text-gray-500 mt-1">Faith Gradient</p>
                    </div>
                    <div>
                        <div class="w-64 h-20 rounded-xl" style="background:linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)"></div>
                        <p class="text-xs text-gray-500 mt-1">Community Gradient</p>
                    </div>
                    <div>
                        <div class="w-64 h-20 rounded-xl" style="background:linear-gradient(135deg, #EEF2FF, #E0F2FE, #FFFBEB)"></div>
                        <p class="text-xs text-gray-500 mt-1">Subtle Background</p>
                    </div>
                </div>
            </div>

            <!-- Semantic Colors (Shared) -->
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Semantic Colors (Shared)</h3>
            <div class="flex flex-wrap gap-3 mb-6">
                <div class="swatch" style="background:#10b981">Success</div>
                <div class="swatch" style="background:#f59e0b">Warning</div>
                <div class="swatch" style="background:#ef4444">Error</div>
                <div class="swatch" style="background:#3b82f6">Info</div>
            </div>
        </section>

        <div class="section-divider"></div>

        <!-- ==================== TYPOGRAPHY ==================== -->
        <section id="typography">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Typography</h2>
            <p class="text-gray-500 mb-8">Inter font family across all weights and sizes.</p>

            <div class="space-y-6 bg-white rounded-2xl p-8 shadow-sm">
                <div>
                    <span class="text-xs text-gray-400 uppercase tracking-wider">Display — 48px / 800</span>
                    <p class="text-5xl font-extrabold text-gray-900">The quick brown fox</p>
                </div>
                <div>
                    <span class="text-xs text-gray-400 uppercase tracking-wider">H1 — 36px / 700</span>
                    <p class="text-4xl font-bold text-gray-900">The quick brown fox</p>
                </div>
                <div>
                    <span class="text-xs text-gray-400 uppercase tracking-wider">H2 — 30px / 700</span>
                    <p class="text-3xl font-bold text-gray-900">The quick brown fox jumps</p>
                </div>
                <div>
                    <span class="text-xs text-gray-400 uppercase tracking-wider">H3 — 24px / 600</span>
                    <p class="text-2xl font-semibold text-gray-900">The quick brown fox jumps over</p>
                </div>
                <div>
                    <span class="text-xs text-gray-400 uppercase tracking-wider">Body — 16px / 400</span>
                    <p class="text-base text-gray-700">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</p>
                </div>
                <div>
                    <span class="text-xs text-gray-400 uppercase tracking-wider">Body Small — 14px / 400</span>
                    <p class="text-sm text-gray-600">The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</p>
                </div>
                <div>
                    <span class="text-xs text-gray-400 uppercase tracking-wider">Caption — 12px / 500</span>
                    <p class="text-xs font-medium text-gray-500">THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG</p>
                </div>
                <div id="typo-bt">
                    <span class="text-xs text-gray-400 uppercase tracking-wider">Gradient Text (BT)</span>
                    <p class="text-4xl font-bold text-gradient-bt">Better Together</p>
                </div>
                <div id="typo-jetc" style="display:none">
                    <span class="text-xs text-gray-400 uppercase tracking-wider">Gradient Text (JETC)</span>
                    <p class="text-4xl font-bold text-gradient-jetc">Jesus Entered the Chat</p>
                </div>
                <div id="typo-scripture" style="display:none">
                    <span class="text-xs text-gray-400 uppercase tracking-wider">Scripture — 18px / 300 / 1.8lh</span>
                    <p class="text-lg font-light text-gray-700" style="line-height:1.8">"For where two or three gather in my name, there am I with them." — Matthew 18:20</p>
                </div>
            </div>
        </section>

        <div class="section-divider"></div>

        <!-- ==================== BUTTONS ==================== -->
        <section id="buttons">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Buttons</h2>
            <p class="text-gray-500 mb-8">All button variants with hover states.</p>

            <!-- BT Buttons -->
            <div id="buttons-bt" class="space-y-6">
                <h3 class="text-xl font-semibold text-gray-800">Better Together</h3>
                <div class="flex flex-wrap gap-4 items-center">
                    <button class="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105">
                        Primary
                    </button>
                    <button class="bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold border border-gray-300 shadow-md hover:bg-gray-50 transition-all">
                        Secondary
                    </button>
                    <button class="text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-lg transition-all">
                        Ghost
                    </button>
                    <button class="text-white px-8 py-4 rounded-xl font-bold shadow-xl transition-all hover:scale-105" style="background:linear-gradient(135deg, #ec4899, #8b5cf6)">
                        Gradient CTA
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all">
                        Danger
                    </button>
                    <button class="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed">
                        Disabled
                    </button>
                </div>
                <div class="flex flex-wrap gap-4 items-center">
                    <button class="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow">
                        Small
                    </button>
                    <button class="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg">
                        Medium (Default)
                    </button>
                    <button class="bg-pink-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl">
                        Large
                    </button>
                </div>
            </div>

            <!-- JETC Buttons -->
            <div id="buttons-jetc" class="space-y-6" style="display:none">
                <h3 class="text-xl font-semibold text-gray-800">Jesus Entered the Chat</h3>
                <div class="flex flex-wrap gap-4 items-center">
                    <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all">
                        Primary
                    </button>
                    <button class="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold border border-indigo-200 shadow-md hover:bg-indigo-50 transition-all">
                        Secondary
                    </button>
                    <button class="text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg transition-all">
                        Ghost
                    </button>
                    <button class="text-indigo-900 px-8 py-4 rounded-xl font-bold shadow-xl transition-all hover:scale-105" style="background:linear-gradient(135deg, #FBBF24, #F59E0B)">
                        Gold CTA
                    </button>
                    <button class="text-white px-6 py-3 rounded-xl font-semibold transition-all" style="background:linear-gradient(135deg, #4F46E5, #0EA5E9)">
                        Faith
                    </button>
                    <button class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed">
                        Disabled
                    </button>
                </div>
            </div>
        </section>

        <div class="section-divider"></div>

        <!-- ==================== CARDS ==================== -->
        <section id="cards">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Cards</h2>
            <p class="text-gray-500 mb-8">Card variants for content containers.</p>

            <!-- BT Cards -->
            <div id="cards-bt">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Better Together</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <!-- Standard Card -->
                    <div class="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg mb-4" style="background:linear-gradient(135deg, #ec4899, #be185d)">
                            <i class="fas fa-heart"></i>
                        </div>
                        <h4 class="font-semibold text-gray-900 mb-2">Standard Card</h4>
                        <p class="text-sm text-gray-600">White background, rounded-2xl, shadow-lg with hover lift effect.</p>
                    </div>

                    <!-- Feature Card -->
                    <div class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg mb-4" style="background:linear-gradient(135deg, #8b5cf6, #6d28d9)">
                            <i class="fas fa-star"></i>
                        </div>
                        <h4 class="font-semibold text-gray-900 mb-2">Feature Card</h4>
                        <p class="text-sm text-gray-600">Larger padding (p-8), ideal for feature showcase sections.</p>
                    </div>

                    <!-- Gradient Card -->
                    <div class="rounded-2xl p-6 text-white" style="background:linear-gradient(135deg, #ec4899, #8b5cf6)">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-pink-600 text-xl shadow-lg mb-4 bg-white/90">
                            <i class="fas fa-crown"></i>
                        </div>
                        <h4 class="font-semibold mb-2">Gradient Card</h4>
                        <p class="text-sm text-white/80">Pink-to-purple gradient for premium/highlighted content.</p>
                    </div>
                </div>

                <!-- Glass Card & Streak Banner -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div style="background:linear-gradient(135deg, #fdf2f8, #fce7f3, #f5f3ff)" class="rounded-2xl p-6">
                        <div class="bg-white/95 backdrop-blur rounded-2xl shadow-lg p-6">
                            <h4 class="font-semibold text-gray-900 mb-2">Glass Card</h4>
                            <p class="text-sm text-gray-600">Semi-transparent white with backdrop blur. Used for check-in forms.</p>
                        </div>
                    </div>
                    <div class="rounded-xl p-4 text-white flex items-center justify-between" style="background:linear-gradient(to right, #f59e0b, #f97316)">
                        <div class="flex items-center">
                            <i class="fas fa-fire text-2xl mr-3"></i>
                            <div>
                                <div class="font-semibold">Streak Banner</div>
                                <div class="text-sm opacity-90">Amber-to-orange gradient</div>
                            </div>
                        </div>
                        <div class="text-3xl font-bold">7</div>
                    </div>
                </div>
            </div>

            <!-- JETC Cards -->
            <div id="cards-jetc" style="display:none">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Jesus Entered the Chat</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <!-- Glass Container -->
                    <div class="rounded-3xl p-6" style="background:linear-gradient(135deg, #312E81, #4F46E5)">
                        <div class="glass-demo rounded-2xl p-6 text-white">
                            <h4 class="font-semibold mb-2">Glass Container</h4>
                            <p class="text-sm text-white/70">Full glassmorphism with blur(40px), border, and shadow. Core JETC pattern.</p>
                        </div>
                    </div>

                    <!-- Scripture Card -->
                    <div class="bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl p-6">
                        <p class="text-lg font-light text-gray-700 mb-3" style="line-height:1.8">"For God so loved the world..."</p>
                        <p class="text-sm font-medium text-indigo-600">John 3:16</p>
                    </div>

                    <!-- Community Card -->
                    <div class="rounded-2xl p-6 text-white" style="background:linear-gradient(135deg, #4F46E5, #0EA5E9)">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-indigo-600 text-xl shadow-lg mb-4 bg-white/90">
                            <i class="fas fa-users"></i>
                        </div>
                        <h4 class="font-semibold mb-2">Community Card</h4>
                        <p class="text-sm text-white/80">Indigo-to-sky gradient for group/community content.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Reading Plan Card -->
                    <div class="bg-white rounded-2xl shadow-md p-6 border border-indigo-100">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600">
                                <i class="fas fa-book-open"></i>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">30 Days of Psalms</h4>
                                <p class="text-xs text-gray-500">12 of 30 days completed</p>
                            </div>
                        </div>
                        <div class="w-full bg-indigo-100 rounded-full h-2">
                            <div class="h-2 rounded-full" style="width:40%;background:linear-gradient(to right, #6366F1, #0EA5E9)"></div>
                        </div>
                    </div>

                    <!-- Prayer Card -->
                    <div class="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                        <div class="flex items-center gap-2 mb-2">
                            <i class="fas fa-hands-praying text-amber-500"></i>
                            <span class="text-sm font-medium text-amber-700">Prayer Request</span>
                        </div>
                        <p class="text-sm text-gray-700">Warm-toned card for prayer requests and community care items.</p>
                        <div class="flex gap-2 mt-3">
                            <span class="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">12 praying</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="section-divider"></div>

        <!-- ==================== FORMS ==================== -->
        <section id="forms">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Form Elements</h2>
            <p class="text-gray-500 mb-8">Inputs, selects, and interactive controls.</p>

            <div class="bg-white rounded-2xl p-8 shadow-sm space-y-6 max-w-lg">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Text Input</label>
                    <input type="text" placeholder="Enter your name..." class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" placeholder="your@email.com" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Textarea</label>
                    <textarea placeholder="Share your thoughts..." class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition outline-none resize-none" rows="3"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">Mood Selector (BT)</label>
                    <div class="flex justify-between max-w-xs">
                        <button type="button" class="text-3xl hover:scale-110 transition-transform p-1">&#x1F622;</button>
                        <button type="button" class="text-3xl hover:scale-110 transition-transform p-1">&#x1F615;</button>
                        <button type="button" class="text-3xl hover:scale-110 transition-transform p-1 scale-115 ring-2 ring-pink-300 rounded-lg">&#x1F610;</button>
                        <button type="button" class="text-3xl hover:scale-110 transition-transform p-1">&#x1F642;</button>
                        <button type="button" class="text-3xl hover:scale-110 transition-transform p-1">&#x1F60A;</button>
                    </div>
                </div>
            </div>
        </section>

        <div class="section-divider"></div>

        <!-- ==================== ICONS ==================== -->
        <section id="icons">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Iconography</h2>
            <p class="text-gray-500 mb-8">Icon styles and sizes used across both brands.</p>

            <div id="icons-bt">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Better Together — Font Awesome 6</h3>
                <div class="flex flex-wrap gap-6 bg-white rounded-2xl p-8 shadow-sm">
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #ec4899, #be185d)"><i class="fas fa-heart"></i></div>
                        <span class="text-xs text-gray-500">heart</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #8b5cf6, #6d28d9)"><i class="fas fa-comments"></i></div>
                        <span class="text-xs text-gray-500">comments</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #3b82f6, #2563eb)"><i class="fas fa-calendar-check"></i></div>
                        <span class="text-xs text-gray-500">calendar</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #10b981, #059669)"><i class="fas fa-bullseye"></i></div>
                        <span class="text-xs text-gray-500">goals</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #f59e0b, #d97706)"><i class="fas fa-fire"></i></div>
                        <span class="text-xs text-gray-500">streak</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #ec4899, #8b5cf6)"><i class="fas fa-robot"></i></div>
                        <span class="text-xs text-gray-500">AI coach</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #f43f5e, #e11d48)"><i class="fas fa-video"></i></div>
                        <span class="text-xs text-gray-500">video</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #a855f7, #9333ea)"><i class="fas fa-crown"></i></div>
                        <span class="text-xs text-gray-500">premium</span>
                    </div>
                </div>
            </div>

            <div id="icons-jetc" style="display:none">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">JETC — Lucide / Font Awesome</h3>
                <div class="flex flex-wrap gap-6 bg-white rounded-2xl p-8 shadow-sm">
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #6366F1, #4F46E5)"><i class="fas fa-cross"></i></div>
                        <span class="text-xs text-gray-500">cross</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #0EA5E9, #0284C7)"><i class="fas fa-dove"></i></div>
                        <span class="text-xs text-gray-500">dove</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #F59E0B, #D97706)"><i class="fas fa-book-bible"></i></div>
                        <span class="text-xs text-gray-500">bible</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #F97316, #EA580C)"><i class="fas fa-fire-flame-curved"></i></div>
                        <span class="text-xs text-gray-500">spirit</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #818CF8, #6366F1)"><i class="fas fa-hands-praying"></i></div>
                        <span class="text-xs text-gray-500">prayer</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #4F46E5, #0EA5E9)"><i class="fas fa-users"></i></div>
                        <span class="text-xs text-gray-500">community</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #22C55E, #16A34A)"><i class="fas fa-seedling"></i></div>
                        <span class="text-xs text-gray-500">growth</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white" style="background:linear-gradient(135deg, #FBBF24, #F59E0B)"><i class="fas fa-comment-dots"></i></div>
                        <span class="text-xs text-gray-500">chat</span>
                    </div>
                </div>
            </div>
        </section>

        <div class="section-divider"></div>

        <!-- ==================== ANIMATIONS ==================== -->
        <section id="animations">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Animations & Motion</h2>
            <p class="text-gray-500 mb-8">Interactive animation previews.</p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
                    <div class="w-16 h-16 rounded-2xl mx-auto mb-3" style="background:linear-gradient(135deg, #ec4899, #8b5cf6);animation:fadeInUp 2s ease-out infinite"></div>
                    <p class="text-sm font-medium text-gray-700">Fade In Up</p>
                    <p class="text-xs text-gray-400">800ms ease-out</p>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
                    <div class="w-16 h-16 rounded-2xl mx-auto mb-3" style="background:linear-gradient(135deg, #ec4899, #8b5cf6);animation:float 3s ease-in-out infinite"></div>
                    <p class="text-sm font-medium text-gray-700">Float</p>
                    <p class="text-xs text-gray-400">6s ease-in-out infinite</p>
                </div>
                <div class="bg-white rounded-2xl p-6 shadow-sm text-center">
                    <div class="w-16 h-16 rounded-2xl mx-auto mb-3" style="background:linear-gradient(135deg, #ec4899, #8b5cf6);animation:glow 2s ease-in-out infinite alternate"></div>
                    <p class="text-sm font-medium text-gray-700">Glow Pulse</p>
                    <p class="text-xs text-gray-400">2s ease-in-out infinite</p>
                </div>
            </div>

            <style>
                @keyframes fadeInUp {
                    0%, 100% { opacity: 0; transform: translateY(20px); }
                    50% { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
                @keyframes glow {
                    from { box-shadow: 0 0 15px rgba(236, 72, 153, 0.3); }
                    to { box-shadow: 0 0 35px rgba(236, 72, 153, 0.8); }
                }
            </style>

            <!-- Elevation -->
            <h3 class="text-xl font-semibold text-gray-800 mt-8 mb-4">Elevation / Shadows</h3>
            <div class="flex flex-wrap gap-6">
                <div class="w-24 h-24 bg-white rounded-xl flex items-center justify-center text-xs text-gray-500" style="box-shadow:none">Flat</div>
                <div class="w-24 h-24 bg-white rounded-xl flex items-center justify-center text-xs text-gray-500" style="box-shadow:0 1px 3px rgba(0,0,0,0.1)">Low</div>
                <div class="w-24 h-24 bg-white rounded-xl flex items-center justify-center text-xs text-gray-500" style="box-shadow:0 4px 6px rgba(0,0,0,0.1)">Medium</div>
                <div class="w-24 h-24 bg-white rounded-xl flex items-center justify-center text-xs text-gray-500" style="box-shadow:0 10px 30px rgba(0,0,0,0.1)">High</div>
                <div class="w-24 h-24 bg-white rounded-xl flex items-center justify-center text-xs text-gray-500" style="box-shadow:0 0 30px rgba(236,72,153,0.5)">Glow</div>
                <div class="w-24 h-24 bg-white rounded-xl flex items-center justify-center text-xs text-gray-500" style="box-shadow:0 25px 50px -12px rgba(0,0,0,0.25)">2XL</div>
            </div>
        </section>

        <div class="section-divider"></div>

        <!-- ==================== KEY SCREENS ==================== -->
        <section id="screens">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Key Screens</h2>
            <p class="text-gray-500 mb-8">Reference wireframes for primary application screens.</p>

            <!-- BT Screens -->
            <div id="screens-bt">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Better Together — Screen Map</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <a href="/" class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #fdf2f8, #fce7f3)">&#x1F3E0;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Onboarding / Home</h4>
                        <p class="text-xs text-gray-500">Hero, features, social proof, CTA</p>
                    </a>
                    <a href="/checkins" class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #fdf2f8, #f5f3ff)">&#x1F60A;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Daily Check-in</h4>
                        <p class="text-xs text-gray-500">Mood selector, connection score, notes</p>
                    </a>
                    <a href="/analytics-dashboard" class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #fce7f3, #ede9fe)">&#x1F4CA;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Couples Dashboard</h4>
                        <p class="text-xs text-gray-500">Stats, health score, activity feed</p>
                    </a>
                    <a href="/ai-coach" class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #ede9fe, #fdf2f8)">&#x1F916;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Coaching Sessions</h4>
                        <p class="text-xs text-gray-500">AI chat, topics, session history</p>
                    </a>
                    <a href="/paywall" class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #FF6B9D, #8B5CF6)">&#x1F451;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Subscription Flow</h4>
                        <p class="text-xs text-gray-500">Plan comparison, Stripe checkout</p>
                    </a>
                    <a href="/login" class="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #fce7f3, #f5f3ff)">&#x1F512;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Login / Auth</h4>
                        <p class="text-xs text-gray-500">Liquid glass auth, social login</p>
                    </a>
                </div>
            </div>

            <!-- JETC Screens -->
            <div id="screens-jetc" style="display:none">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">JETC — Screen Map</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #EEF2FF, #E0E7FF)">&#x1F4AC;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Bible Chat</h4>
                        <p class="text-xs text-gray-500">AI conversation, scripture refs, glass panels</p>
                    </div>
                    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #FFFBEB, #FEF3C7)">&#x1F4D6;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Daily Verse</h4>
                        <p class="text-xs text-gray-500">Hero scripture card, share/save/reflect</p>
                    </div>
                    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #E0F2FE, #BAE6FD)">&#x1F4DA;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Reading Plans</h4>
                        <p class="text-xs text-gray-500">Plan grid, progress bars, day checklists</p>
                    </div>
                    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #FFF7ED, #FFEDD5)">&#x1F91D;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Community Hub</h4>
                        <p class="text-xs text-gray-500">Groups, prayer requests, discussions</p>
                    </div>
                    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #6366F1, #0EA5E9)">&#x1F451;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Subscription Flow</h4>
                        <p class="text-xs text-gray-500">Seeker/Disciple/Ministry tiers</p>
                    </div>
                    <div class="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                        <div class="h-32 rounded-lg mb-3 flex items-center justify-center text-4xl" style="background:linear-gradient(135deg, #312E81, #4F46E5)">&#x1F512;</div>
                        <h4 class="font-semibold text-gray-900 text-sm">Auth (Clerk)</h4>
                        <p class="text-xs text-gray-500">Clerk-powered, glassmorphism overlay</p>
                    </div>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="border-t bg-white py-8 mt-16">
        <div class="max-w-7xl mx-auto px-6 text-center text-sm text-gray-500">
            Design System v1.0 — Better Together & Jesus Entered the Chat<br>
            Tokens: <code class="bg-gray-100 px-2 py-0.5 rounded">/static/design-tokens.css</code> |
            Docs: <code class="bg-gray-100 px-2 py-0.5 rounded">docs/DESIGN_SYSTEM.md</code>
        </div>
    </footer>

    <script>
        function switchBrand(brand) {
            // Toggle tab styles
            document.getElementById('tab-bt').classList.toggle('active', brand === 'bt');
            document.getElementById('tab-jetc').classList.toggle('active', brand === 'jetc');

            // Toggle sections
            const sections = ['colors', 'buttons', 'cards', 'icons', 'screens'];
            sections.forEach(s => {
                const bt = document.getElementById(s + '-bt');
                const jetc = document.getElementById(s + '-jetc');
                if (bt) bt.style.display = brand === 'bt' ? '' : 'none';
                if (jetc) jetc.style.display = brand === 'jetc' ? '' : 'none';
            });

            // Toggle typography extras
            document.getElementById('typo-bt').style.display = brand === 'bt' ? '' : 'none';
            document.getElementById('typo-jetc').style.display = brand === 'jetc' ? '' : 'none';
            document.getElementById('typo-scripture').style.display = brand === 'jetc' ? '' : 'none';
        }
    </script>
</body>
</html>`;
