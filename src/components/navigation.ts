// Consistent Navigation Component for Better Together
export const navigationHtml = `
<!-- Consistent Navigation - Better Together Branding -->
<nav class="bg-white shadow-sm border-b sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14 sm:h-16">
            <div class="flex items-center">
                <a href="/" class="flex items-center hover:scale-105 transition-transform duration-300">
                    <span class="text-xl sm:text-2xl">💕</span>
                    <span class="ml-2 text-lg sm:text-xl font-bold text-gray-900">Better Together</span>
                </a>
            </div>
            <div class="hidden md:flex items-center space-x-6 lg:space-x-8">
                <a href="/#features" class="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">Features</a>
                <a href="/mobile-ui.html" class="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">iOS Design</a>
                <a href="/iphone-examples.html" class="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">Live Examples</a>
                <a href="/member-rewards.html" class="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">Rewards</a>
                <a href="/#pricing" class="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">Pricing</a>
                <button class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 hover:shadow-lg transition-all duration-300 text-sm lg:text-base">
                    <span class="flex items-center">
                        <i class="fas fa-heart mr-2 animate-pulse"></i>
                        Start Free Trial
                    </span>
                </button>
            </div>
            <div class="md:hidden">
                <button class="text-gray-600 hover:text-gray-900 p-2" id="mobileMenuButton">
                    <i class="fas fa-bars text-lg"></i>
                </button>
            </div>
        </div>
        <!-- Mobile Menu -->
        <div id="mobileMenu" class="hidden md:hidden pb-4 transform transition-all duration-300">
            <div class="flex flex-col space-y-3 bg-gradient-to-b from-white to-pink-50 p-4 rounded-lg shadow-lg">
                <a href="/#features" class="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                    <i class="fas fa-heart mr-3 text-pink-500"></i>Features
                </a>
                <a href="/mobile-ui.html" class="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                    <i class="fas fa-mobile-alt mr-3 text-purple-500"></i>iOS Design
                </a>
                <a href="/iphone-examples.html" class="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                    <i class="fas fa-play-circle mr-3 text-blue-500"></i>Live Examples
                </a>
                <a href="/member-rewards.html" class="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                    <i class="fas fa-gift mr-3 text-green-500"></i>Rewards
                </a>
                <a href="/#pricing" class="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                    <i class="fas fa-tag mr-3 text-yellow-500"></i>Pricing
                </a>
                <button class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-4 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 hover:shadow-xl transition-all duration-300 w-full mt-4">
                    <span class="flex items-center justify-center">
                        <i class="fas fa-heart mr-2 animate-pulse"></i>
                        Start Free Trial
                    </span>
                </button>
            </div>
        </div>
    </div>
</nav>

<!-- Mobile Menu JavaScript -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', function() {
                const isHidden = mobileMenu.classList.contains('hidden');
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    mobileMenu.style.transform = 'translateY(-10px)';
                    mobileMenu.style.opacity = '0';
                    setTimeout(() => {
                        mobileMenu.style.transform = 'translateY(0)';
                        mobileMenu.style.opacity = '1';
                    }, 10);
                } else {
                    mobileMenu.style.transform = 'translateY(-10px)';
                    mobileMenu.style.opacity = '0';
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                    }, 300);
                }
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = isHidden ? 'rotate(90deg)' : 'rotate(0deg)';
                }
            });
        }
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu?.querySelectorAll('a');
        if (mobileLinks) {
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.style.transform = 'translateY(-10px)';
                    mobileMenu.style.opacity = '0';
                    setTimeout(() => {
                        mobileMenu.classList.add('hidden');
                    }, 300);
                });
            });
        }
        
        // Close mobile menu on resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768 && mobileMenu) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton?.querySelector('i');
                if (icon) icon.style.transform = 'rotate(0deg)';
            }
        });
    });
</script>
`;