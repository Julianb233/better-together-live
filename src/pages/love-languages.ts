// Love Languages Assessment & Profile Page
export const loveLanguagesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Love Languages - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .language-card { transition: all 0.3s ease; cursor: pointer; }
        .language-card:hover { transform: translateY(-4px); }
        .language-card.selected { border-color: #ec4899; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); }
        .language-card.selected .check-icon { display: flex; }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex items-center mb-8">
            <a href="/portal" class="mr-4 text-gray-600 hover:text-pink-600 transition">
                <i class="fas fa-arrow-left text-xl"></i>
            </a>
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Love Languages</h1>
                <p class="text-gray-600">Understand how you and your partner express love</p>
            </div>
        </div>

        <!-- Current Love Languages -->
        <div class="glass-card rounded-2xl p-6 shadow-lg mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Your Love Languages</h2>

            <div class="grid md:grid-cols-2 gap-4 mb-6">
                <div class="bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-4">
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                            <span class="text-white text-sm">1</span>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600">Primary Language</div>
                            <div class="font-semibold text-gray-900" id="primaryLanguage">Select below</div>
                        </div>
                    </div>
                </div>

                <div class="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4">
                    <div class="flex items-center mb-2">
                        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                            <span class="text-white text-sm">2</span>
                        </div>
                        <div>
                            <div class="text-sm text-gray-600">Secondary Language</div>
                            <div class="font-semibold text-gray-900" id="secondaryLanguage">Select below</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Partner's Languages -->
            <div class="border-t pt-4">
                <h3 class="text-sm font-semibold text-gray-600 mb-3">Your Partner's Love Languages</h3>
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm" id="partnerPrimary">Not set</span>
                    <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm" id="partnerSecondary">Not set</span>
                </div>
            </div>
        </div>

        <!-- Love Language Options -->
        <div class="mb-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Select Your Love Languages</h2>
            <p class="text-gray-600 mb-6">Choose your primary (most important) and secondary love languages</p>

            <div class="grid gap-4">
                <!-- Words of Affirmation -->
                <div class="language-card glass-card rounded-xl p-5 border-2 border-transparent" data-language="words_of_affirmation" onclick="selectLanguage(this)">
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                            <i class="fas fa-comment-heart text-white text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h3 class="font-semibold text-gray-900">Words of Affirmation</h3>
                                <div class="check-icon hidden w-6 h-6 bg-pink-500 rounded-full items-center justify-center">
                                    <i class="fas fa-check text-white text-xs"></i>
                                </div>
                            </div>
                            <p class="text-gray-600 text-sm mt-1">Verbal compliments, encouragement, and expressions of appreciation make you feel loved</p>
                        </div>
                    </div>
                </div>

                <!-- Quality Time -->
                <div class="language-card glass-card rounded-xl p-5 border-2 border-transparent" data-language="quality_time" onclick="selectLanguage(this)">
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                            <i class="fas fa-clock text-white text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h3 class="font-semibold text-gray-900">Quality Time</h3>
                                <div class="check-icon hidden w-6 h-6 bg-pink-500 rounded-full items-center justify-center">
                                    <i class="fas fa-check text-white text-xs"></i>
                                </div>
                            </div>
                            <p class="text-gray-600 text-sm mt-1">Undivided attention, meaningful conversations, and shared experiences</p>
                        </div>
                    </div>
                </div>

                <!-- Receiving Gifts -->
                <div class="language-card glass-card rounded-xl p-5 border-2 border-transparent" data-language="receiving_gifts" onclick="selectLanguage(this)">
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                            <i class="fas fa-gift text-white text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h3 class="font-semibold text-gray-900">Receiving Gifts</h3>
                                <div class="check-icon hidden w-6 h-6 bg-pink-500 rounded-full items-center justify-center">
                                    <i class="fas fa-check text-white text-xs"></i>
                                </div>
                            </div>
                            <p class="text-gray-600 text-sm mt-1">Thoughtful presents, surprises, and visual symbols of love</p>
                        </div>
                    </div>
                </div>

                <!-- Acts of Service -->
                <div class="language-card glass-card rounded-xl p-5 border-2 border-transparent" data-language="acts_of_service" onclick="selectLanguage(this)">
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                            <i class="fas fa-hands-helping text-white text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h3 class="font-semibold text-gray-900">Acts of Service</h3>
                                <div class="check-icon hidden w-6 h-6 bg-pink-500 rounded-full items-center justify-center">
                                    <i class="fas fa-check text-white text-xs"></i>
                                </div>
                            </div>
                            <p class="text-gray-600 text-sm mt-1">Helpful actions, doing things to ease your burden, and practical support</p>
                        </div>
                    </div>
                </div>

                <!-- Physical Touch -->
                <div class="language-card glass-card rounded-xl p-5 border-2 border-transparent" data-language="physical_touch" onclick="selectLanguage(this)">
                    <div class="flex items-start">
                        <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                            <i class="fas fa-hand-holding-heart text-white text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex items-center justify-between">
                                <h3 class="font-semibold text-gray-900">Physical Touch</h3>
                                <div class="check-icon hidden w-6 h-6 bg-pink-500 rounded-full items-center justify-center">
                                    <i class="fas fa-check text-white text-xs"></i>
                                </div>
                            </div>
                            <p class="text-gray-600 text-sm mt-1">Hugs, holding hands, and physical presence make you feel connected</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Save Button -->
        <button onclick="saveLanguages()" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl mb-8">
            <i class="fas fa-heart mr-2"></i>
            Save My Love Languages
        </button>

        <!-- Tips Section -->
        <div class="glass-card rounded-2xl p-6 shadow-lg">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
                <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                Understanding Love Languages
            </h2>
            <div class="space-y-3 text-gray-600 text-sm">
                <p>Love languages help partners understand how each other prefers to give and receive love.</p>
                <p>When you speak your partner's love language, they feel more loved and appreciated.</p>
                <p>Our AI Coach uses this information to suggest personalized activities and conversation topics!</p>
            </div>
        </div>
    </div>

    <script>
        let selectedLanguages = [];
        const languageNames = {
            'words_of_affirmation': 'Words of Affirmation',
            'quality_time': 'Quality Time',
            'receiving_gifts': 'Receiving Gifts',
            'acts_of_service': 'Acts of Service',
            'physical_touch': 'Physical Touch'
        };

        function selectLanguage(card) {
            const language = card.dataset.language;

            if (card.classList.contains('selected')) {
                card.classList.remove('selected');
                selectedLanguages = selectedLanguages.filter(l => l !== language);
            } else {
                if (selectedLanguages.length >= 2) {
                    // Deselect the first one
                    const firstSelected = document.querySelector('.language-card.selected');
                    if (firstSelected) {
                        firstSelected.classList.remove('selected');
                        selectedLanguages.shift();
                    }
                }
                card.classList.add('selected');
                selectedLanguages.push(language);
            }

            // Update display
            document.getElementById('primaryLanguage').textContent =
                selectedLanguages[0] ? languageNames[selectedLanguages[0]] : 'Select below';
            document.getElementById('secondaryLanguage').textContent =
                selectedLanguages[1] ? languageNames[selectedLanguages[1]] : 'Select below';
        }

        async function saveLanguages() {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert('Please log in first');
                return;
            }

            if (selectedLanguages.length < 1) {
                alert('Please select at least one love language');
                return;
            }

            try {
                const response = await fetch('/api/users/' + userId + '/love-languages', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        primary: selectedLanguages[0],
                        secondary: selectedLanguages[1] || null
                    })
                });

                if (response.ok) {
                    alert('Love languages saved successfully!');
                } else {
                    throw new Error('Failed to save');
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Failed to save love languages');
            }
        }

        // Load existing languages
        async function loadLanguages() {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            try {
                const response = await fetch('/api/users/' + userId + '/love-languages');
                if (response.ok) {
                    const data = await response.json();
                    if (data.primary) {
                        const primaryCard = document.querySelector('[data-language="' + data.primary + '"]');
                        if (primaryCard) selectLanguage(primaryCard);
                    }
                    if (data.secondary) {
                        const secondaryCard = document.querySelector('[data-language="' + data.secondary + '"]');
                        if (secondaryCard) selectLanguage(secondaryCard);
                    }
                }
            } catch (error) {
                console.error('Load error:', error);
            }
        }

        loadLanguages();
    </script>
</body>
</html>`;
