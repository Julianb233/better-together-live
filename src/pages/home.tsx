export const HomePage = () => (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navigation - Mobile Responsive */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl">💕</span>
              <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">Better Together</span>
            </div>
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <a href="#features" className="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">Features</a>
              <a href="/mobile-ui.html" className="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">iOS Design</a>
              <a href="/iphone-examples.html" className="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">Live Examples</a>
              <a href="/member-rewards.html" className="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">Rewards</a>
              <a href="/paywall" className="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">Premium</a>
              <a href="/login" className="text-gray-600 hover:text-pink-600 transition-all duration-300 text-sm lg:text-base font-medium hover:scale-105">
                <i className="fas fa-sign-in-alt mr-1"></i>Login
              </a>
              <a href="/login" className="bg-white text-pink-600 px-5 py-2.5 rounded-full font-semibold border-2 border-pink-300 hover:border-pink-500 hover:bg-pink-50 transform hover:scale-105 hover:shadow-md transition-all duration-300 text-sm lg:text-base">
                <i className="fas fa-user-plus mr-1"></i>Sign Up
              </a>
              <a href="/paywall" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 hover:shadow-lg transition-all duration-300 text-sm lg:text-base inline-flex items-center justify-center">
                <i className="fas fa-crown mr-2 animate-pulse"></i>
                Get Premium Access
              </a>
            </div>
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900 p-2" id="mobileMenuButton">
                <i className="fas fa-bars text-lg"></i>
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          <div id="mobileMenu" className="hidden md:hidden pb-4 transform transition-all duration-300">
            <div className="flex flex-col space-y-3 bg-gradient-to-b from-white to-pink-50 p-4 rounded-lg shadow-lg">
              <a href="#features" className="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                <i className="fas fa-heart mr-3 text-pink-500"></i>Features
              </a>
              <a href="/mobile-ui.html" className="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                <i className="fas fa-mobile-alt mr-3 text-purple-500"></i>iOS Design
              </a>
              <a href="/iphone-examples.html" className="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                <i className="fas fa-play-circle mr-3 text-blue-500"></i>Live Examples
              </a>
              <a href="/member-rewards.html" className="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                <i className="fas fa-gift mr-3 text-green-500"></i>Rewards <span className="text-xs text-amber-600 font-normal">(Coming Soon)</span>
              </a>
              <a href="/paywall" className="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                <i className="fas fa-crown mr-3 text-yellow-500"></i>Premium
              </a>
              <div className="border-t border-pink-200 my-2"></div>
              <a href="/login" className="text-gray-600 hover:text-pink-600 transition-all duration-300 py-3 px-4 rounded-lg hover:bg-pink-50 font-medium">
                <i className="fas fa-sign-in-alt mr-3 text-pink-500"></i>Login
              </a>
              <a href="/login" className="text-white bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 py-3 px-4 rounded-lg font-medium">
                <i className="fas fa-user-plus mr-3"></i>Sign Up Free
              </a>
              <a href="/paywall" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-4 rounded-full font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 hover:shadow-xl transition-all duration-300 w-full mt-4 inline-flex items-center justify-center">
                <i className="fas fa-crown mr-2 animate-pulse"></i>
                Get Premium Access
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced Animations & Mobile Responsive */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-white bg-opacity-50"></div>
        <div className="absolute top-10 left-4 sm:left-10 text-pink-200 text-4xl sm:text-6xl opacity-30 animate-bounce">💕</div>
        <div className="absolute bottom-10 right-4 sm:right-10 text-purple-200 text-3xl sm:text-4xl opacity-30 animate-pulse">💫</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-100 text-8xl opacity-10 animate-spin" style="animation-duration: 20s;">✨</div>
        
        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-pink-300 text-2xl opacity-40 animate-bounce" style="animation-delay: 0s; animation-duration: 3s;">💖</div>
          <div className="absolute top-32 right-20 text-purple-300 text-xl opacity-40 animate-bounce" style="animation-delay: 1s; animation-duration: 4s;">💕</div>
          <div className="absolute bottom-40 left-20 text-blue-300 text-lg opacity-40 animate-bounce" style="animation-delay: 2s; animation-duration: 5s;">💘</div>
          <div className="absolute bottom-20 right-32 text-pink-300 text-xl opacity-40 animate-bounce" style="animation-delay: 1.5s; animation-duration: 3.5s;">💝</div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Social Proof Badge - Authority Bias */}
            <div className="mb-6 sm:mb-8 animate-fade-in-up">
              <div className="inline-flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-pink-800 text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <i className="fas fa-crown mr-2 text-yellow-500"></i>
                AI-Powered Relationship Platform for Couples
              </div>
            </div>
            
            {/* Headlines - Loss Aversion + Urgency */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight px-2 animate-fade-in-up" style="animation-delay: 0.2s;">
              Stop Letting Your Relationship 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 block sm:inline animate-pulse"> Drift Apart</span>
            </h1>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-700 mb-6 sm:mb-8 px-2 animate-fade-in-up" style="animation-delay: 0.4s;">
              Your AI Coach Plans, Schedules & Grows Your Love—
              <span className="text-pink-600 font-bold">Automatically</span>
            </h2>
            
            {/* Value Proposition - Anchoring Effect */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed px-4 animate-fade-in-up" style="animation-delay: 0.6s;">
              While other couples spend <strong className="text-red-600 animate-pulse">$300+/month</strong> on therapy and still struggle, you get 24/7 personalized relationship coaching, automatic date planning, and proven growth strategies for just <strong className="text-green-600 font-bold animate-pulse">pennies per day</strong>. 
            </p>
            
            {/* CTAs - Enhanced with Animations */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-8 px-4 animate-fade-in-up" style="animation-delay: 0.8s;">
              <a href="/paywall" className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-110 hover:shadow-2xl text-sm sm:text-base group relative overflow-hidden animate-glow inline-flex items-center justify-center">
                <i className="fas fa-crown mr-2 group-hover:animate-bounce"></i>
                Get Premium Access Now
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>

            {/* Limited Time Offer - Enhanced Urgency */}
            <div className="mb-8 px-4 animate-scale-in" style="animation-delay: 1s;">
              <div className="inline-flex items-center bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-full px-6 py-3 text-emerald-700 text-xs sm:text-sm font-bold animate-glow shadow-lg">
                <i className="fas fa-crown mr-2 text-emerald-500 animate-pulse"></i>
                Premium Plans Starting at $30/mo for Couples
                <span className="ml-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs animate-bounce">7-Day Free Trial</span>
              </div>
            </div>
            
            {/* Trust Signals - Enhanced with Animations */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600 px-4 animate-slide-in-bottom" style="animation-delay: 1.2s;">
              <div className="flex items-center justify-center sm:justify-start hover-lift p-3 rounded-lg hover:bg-emerald-50 transition-all">
                <i className="fas fa-crown text-emerald-500 mr-2 text-lg"></i>
                <span className="font-semibold">Premium Features Only</span>
              </div>
              <div className="flex items-center justify-center hover-lift p-3 rounded-lg hover:bg-blue-50 transition-all">
                <i className="fas fa-shield-alt text-blue-500 mr-2 text-lg"></i>
                <span className="font-semibold">Bank-Level Security</span>
              </div>
              <div className="flex items-center justify-center sm:justify-end hover-lift p-3 rounded-lg hover:bg-purple-50 transition-all">
                <i className="fas fa-medal text-purple-500 mr-2 text-lg"></i>
                <span className="font-semibold">30-Day Guarantee</span>
              </div>
            </div>

            {/* Mobile-First Social Proof */}
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-500">
              <div className="flex items-center">
                <div className="flex -space-x-1 mr-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs">👩</div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs">👨</div>
                  <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs">👩</div>
                </div>
                <span className="text-xs sm:text-sm">Couples growing stronger together</span>
              </div>
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  <i className="fas fa-star text-sm"></i>
                  <i className="fas fa-star text-sm"></i>
                  <i className="fas fa-star text-sm"></i>
                  <i className="fas fa-star text-sm"></i>
                  <i className="fas fa-star text-sm"></i>
                </div>
                <span className="text-xs sm:text-sm">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-pink-600"><i className="fas fa-robot"></i></div>
              <div className="text-gray-600">AI Coaching</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600"><i className="fas fa-calendar-check"></i></div>
              <div className="text-gray-600">Daily Check-ins</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600"><i className="fas fa-bullseye"></i></div>
              <div className="text-gray-600">Shared Goals</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600"><i className="fas fa-heart"></i></div>
              <div className="text-gray-600">Date Activities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Relationship Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Science-backed features designed to strengthen your connection and build lasting love.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-robot text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">AI Relationship Assistant <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Premium</span></h3>
              <p className="text-gray-600 leading-relaxed">
                Talk naturally to your AI coach that understands your relationship, suggests personalized experiences, and automatically schedules meaningful activities in both partners' calendars.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-calendar-plus text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Smart Scheduling <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Premium</span></h3>
              <p className="text-gray-600 leading-relaxed">
                AI automatically finds optimal times, suggests location-based experiences, and adds personalized activities to your partner's calendar with thoughtful reminders and context.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-lightbulb text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Intelligent Suggestions <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Premium</span></h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized recommendations for date ideas, conversation topics, gifts, and growth opportunities based on your relationship patterns and love languages.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-heart text-pink-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Love Language Integration</h4>
                  <p className="text-gray-600">Understand and speak each other's love language with personalized insights and recommendations.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar-check text-purple-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Smart Reminders</h4>
                  <p className="text-gray-600">Never miss important dates, anniversaries, or special moments with intelligent notifications.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-comments text-blue-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Daily Best Friend Chats <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Premium</span></h4>
                  <p className="text-gray-600">Simple conversations like talking with your best friend—your AI coach learns how you each show love naturally, then helps your partner express appreciation the way you actually want to receive it.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-medal text-green-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Achievement System</h4>
                  <p className="text-gray-600">Celebrate milestones together with meaningful badges and rewards that strengthen your bond.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-semibold text-gray-900">Relationship Health</h5>
                    <span className="text-2xl font-bold text-green-600"><i className="fas fa-heart text-green-500"></i></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>Connection: 9.2/10</span>
                    <span>12-day streak</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-sm font-medium text-gray-900">Active Goals</div>
                    <div className="text-lg font-bold text-purple-600">3</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="text-2xl mb-2">🏆</div>
                    <div className="text-sm font-medium text-gray-900">Achievements</div>
                    <div className="text-lg font-bold text-pink-600">8</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Better Together Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A simple 4-step process to transform your relationship into a thriving partnership
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Create Profiles</h3>
              <p className="text-gray-600">
                Set up detailed profiles with love languages, preferences, and relationship goals. Invite your partner to join your journey.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Chat Like Best Friends</h3>
              <p className="text-gray-600">
                Have casual daily conversations with your AI coach—just like texting your best friend. It learns how you naturally show love and how your partner wants to receive it.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Set Goals & Activities</h3>
              <p className="text-gray-600">
                Create shared goals, plan date nights, take on challenges, and track your progress together as a team.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Grow Together</h3>
              <p className="text-gray-600">
                Watch your relationship health score improve, earn achievements, and build lasting intimacy through consistent actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI-Powered Features */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-100 rounded-full text-indigo-800 text-sm font-medium mb-6">
              <i className="fas fa-brain mr-2"></i>
              AI-Powered Relationship Intelligence
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Personal AI Relationship Coach
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Talk to your AI assistant like a friend. It learns your relationship patterns and proactively creates meaningful experiences for both partners.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-4">
                    <i class="fas fa-comment-heart text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Talk Like Best Friends</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  "I keep buying Sarah flowers but she seems more excited when I help with the dishes. Am I missing something?"
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    <strong>AI Coach:</strong> "Exactly! Sarah's love language is Acts of Service—she feels most loved when you do helpful things, not gifts. I'll remind you about little ways to help her daily. You're already showing love, just not in her 'language' yet!"
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-calendar-heart text-white text-xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Smart Partner Scheduling</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  AI automatically adds thoughtful activities to your partner's calendar with personalized context and preparation reminders.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <i className="fas fa-heart text-purple-500 mr-3"></i>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Surprise Date Night</div>
                      <div className="text-sm text-gray-600">Friday 7:00 PM • Bella Vista Restaurant</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                    <i className="fas fa-gift text-pink-500 mr-3"></i>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Preparation Reminder</div>
                      <div className="text-sm text-gray-600">Friday 5:30 PM • Wear the dress you love</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Intelligent Experience Suggestions</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Based on Your Patterns</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    "You both rated hiking dates 9/10 and it's been 3 weeks since your last outdoor activity."
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Suggestion:</strong> Weekend hiking at Blue Ridge Trail + picnic lunch (weather will be perfect Saturday)
                    </p>
                  </div>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Love Language Optimization</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    "Alex's primary love language is 'Acts of Service' and he's been stressed about work deadlines."
                  </p>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-purple-800 text-sm">
                      <strong>Suggestion:</strong> Surprise him by organizing his home office and preparing his favorite meal for when he gets home
                    </p>
                  </div>
                </div>
                
                <div className="border-l-4 border-pink-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Growth Opportunities</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    "Your communication scores have been lower lately. Here's a research-backed approach."
                  </p>
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <p className="text-pink-800 text-sm">
                      <strong>Suggestion:</strong> Try the "Daily Appreciation" challenge - 5 minutes of gratitude sharing after dinner for 2 weeks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                What Makes Our AI Different
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user-check text-white text-2xl"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Relationship Context</h4>
                <p className="text-gray-600 text-sm">
                  Understands your unique dynamic, history, preferences, and current relationship phase to provide hyper-personalized suggestions.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-sync-alt text-white text-2xl"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Proactive Planning</h4>
                <p className="text-gray-600 text-sm">
                  Doesn't wait for you to ask. Notices patterns, anticipates needs, and suggests experiences before relationships hit rough patches.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart-pulse text-white text-2xl"></i>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Emotional Intelligence</h4>
                <p className="text-gray-600 text-sm">
                  Reads between the lines of your check-ins, recognizes emotional patterns, and suggests interventions that strengthen your bond.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Feature Set
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every tool you need to build a thriving, data-driven relationship
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Conversation Engine */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-indigo-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-comment-dots text-indigo-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI Conversation Engine</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Natural language relationship coaching</li>
                <li>• Context-aware conversation understanding</li>
                <li>• Personalized advice and suggestions</li>
                <li>• Relationship pattern recognition</li>
                <li>• Proactive intervention recommendations</li>
              </ul>
            </div>

            {/* AI Smart Scheduling */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-magic text-purple-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI Smart Scheduling</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Automatic calendar integration for both partners</li>
                <li>• Intelligent optimal time-finding</li>
                <li>• Contextual activity suggestions</li>
                <li>• Location-based experience recommendations</li>
                <li>• Preparation reminders and gift ideas</li>
              </ul>
            </div>

            {/* Intelligent Experience Suggestions */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-sparkles text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Intelligent Experience Suggestions</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Personalized date ideas based on preferences</li>
                <li>• Love language-optimized activities</li>
                <li>• Growth opportunity recommendations</li>
                <li>• Local event and experience discovery</li>
                <li>• Timing optimization for maximum impact</li>
              </ul>
            </div>

            {/* Daily Check-ins */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-clipboard-check text-green-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Daily Check-ins</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Connection score (1-10 scale)</li>
                <li>• Mood & satisfaction tracking</li>
                <li>• Gratitude notes & highlights</li>
                <li>• Support needs communication</li>
                <li>• Streak tracking & rewards</li>
              </ul>
            </div>

            {/* Activity Logs */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-heart-circle-plus text-yellow-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Activity Logs</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Date night planning & tracking</li>
                <li>• Activity satisfaction ratings</li>
                <li>• Location & cost tracking</li>
                <li>• Photo memories</li>
                <li>• Activity type categorization</li>
              </ul>
            </div>

            {/* Gamified System */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-gamepad text-indigo-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Gamified System</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Relationship challenges</li>
                <li>• Achievement badges & rewards</li>
                <li>• Streak counters</li>
                <li>• Progress celebrations</li>
                <li>• Motivation through gamification</li>
              </ul>
            </div>

            {/* Analytics Dashboard */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-chart-pie text-red-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Relationship health scoring</li>
                <li>• Trend analysis & insights</li>
                <li>• Communication frequency</li>
                <li>• Goal completion rates</li>
                <li>• Activity satisfaction trends</li>
              </ul>
            </div>

            {/* Smart Notifications */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-bell text-cyan-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Notifications</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Daily check-in reminders</li>
                <li>• Important date alerts</li>
                <li>• Achievement notifications</li>
                <li>• Goal progress updates</li>
                <li>• Partner activity alerts</li>
              </ul>
            </div>

            {/* Enhanced User Profiles */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-user-circle text-pink-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Enhanced User Profiles</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Primary & secondary love languages</li>
                <li>• Relationship preferences & goals</li>
                <li>• Profile photos & nicknames</li>
                <li>• Calendar integration & availability</li>
                <li>• AI learning from interaction patterns</li>
              </ul>
            </div>

            {/* Goal Tracking */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-bullseye text-green-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Goal Tracking</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Weekly, monthly & milestone goals</li>
                <li>• Progress tracking & visualization</li>
                <li>• AI-suggested next steps</li>
                <li>• Custom goal categories</li>
                <li>• Achievement celebrations</li>
              </ul>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <i className="fas fa-shield-halved text-gray-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
              </div>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li>• Data encrypted in transit and at rest</li>
                <li>• Private AI conversations</li>
                <li>• Secure calendar integration</li>
                <li>• GDPR compliant</li>
                <li>• Data export options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Activities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Relationship Challenges & Activities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proven challenges designed by relationship psychologists to strengthen your bond
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-seedling text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">7-Day Gratitude Challenge</h3>
              <p className="text-sm text-gray-600 mb-3">Express daily appreciation for your partner</p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Beginner</span>
                <span className="text-green-600 font-medium">7 days</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-clock text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">30-Day Quality Time</h3>
              <p className="text-sm text-gray-600 mb-3">Dedicated time together every day</p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Intermediate</span>
                <span className="text-blue-600 font-medium">30 days</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-comments text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Deep Conversations</h3>
              <p className="text-sm text-gray-600 mb-3">Meaningful dialogue starters</p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Advanced</span>
                <span className="text-purple-600 font-medium">Ongoing</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-6 border border-pink-200">
              <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-heart-pulse text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Weekly Date Nights</h3>
              <p className="text-sm text-gray-600 mb-3">Regular romantic connections</p>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">Intermediate</span>
                <span className="text-pink-600 font-medium">Weekly</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-trophy text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Achievement System</h3>
              <p className="text-gray-600">
                Earn badges for milestones like "Week Strong" (7-day streak), "Communication Champion", and "Goal Getter" to celebrate your progress.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-fire text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Streak Tracking</h3>
              <p className="text-gray-600">
                Build momentum with daily check-in streaks, goal completion chains, and activity consistency that strengthens your relationship habits.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-star text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Progress Rewards</h3>
              <p className="text-gray-600">
                Unlock new challenges, celebrate relationship milestones, and get personalized insights as you grow stronger together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium Only */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-pink-100 text-pink-800 rounded-full text-sm font-semibold mb-6">
              <i className="fas fa-heart mr-2"></i>
              Choose Your Plan
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Relationship Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every great relationship is an investment. Choose how you want to grow together and unlock your full potential as a couple.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Better Together Plan (Most Popular) */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-8 relative text-white transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-medium">
                  MOST POPULAR
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">Growing Together</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">$30</span>
                  <span className="text-pink-200">/month</span>
                  <div className="text-lg text-pink-100 mt-2">
                    Per couple &middot; Billed monthly
                  </div>
                </div>
                <div className="bg-pink-100 text-pink-800 px-4 py-2 rounded-lg mb-6">
                  <span className="font-bold">Essential relationship tools</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <i className="fas fa-robot text-blue-300 mr-3"></i>
                    <span>AI Relationship Coach</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-clipboard-check text-rose-300 mr-3"></i>
                    <span>Daily Check-ins &amp; Analytics</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-calendar-heart text-purple-300 mr-3"></i>
                    <span>Manual Date Planning</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-gamepad text-indigo-300 mr-3"></i>
                    <span>Basic Relationship Challenges</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-bullseye text-amber-300 mr-3"></i>
                    <span>Up to 5 Shared Goals</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-brain text-pink-300 mr-3"></i>
                    <span>3 Love Assessments</span>
                  </li>
                </ul>
                <a href="/paywall" className="w-full bg-white text-pink-600 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-colors text-lg inline-flex items-center justify-center">
                  Transform Our Relationship
                </a>
              </div>
            </div>

            {/* Growing Together+ Plan */}
            <div className="bg-white rounded-2xl border-2 border-purple-300 p-8 relative">
              <div className="absolute -top-3 -right-3">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  7-Day Free Trial
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">Growing Together+</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">$69</span>
                  <span className="text-gray-600">/month</span>
                  <div className="text-lg text-gray-600 mt-2">
                    Per couple &middot; 7-day free trial
                  </div>
                </div>
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg mb-6">
                  <span className="font-bold">Complete relationship transformation</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <i className="fas fa-check text-purple-600 mr-3"></i>
                    <span className="text-gray-700">Advanced AI Coach + 24/7 Support</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-purple-600 mr-3"></i>
                    <span className="text-gray-700">All 6 Love Assessments</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-purple-600 mr-3"></i>
                    <span className="text-gray-700">Auto-Scheduling &amp; Booking</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-purple-600 mr-3"></i>
                    <span className="text-gray-700">Premium Intimacy Challenges</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-purple-600 mr-3"></i>
                    <span className="text-gray-700">Unlimited Shared Goals</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-purple-600 mr-3"></i>
                    <span className="text-gray-700">Priority Customer Support</span>
                  </li>
                </ul>
                <a href="/paywall" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors text-lg inline-flex items-center justify-center">
                  Start Free Trial
                </a>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <a href="/paywall" className="inline-flex items-center text-pink-600 hover:text-pink-700 font-semibold">
              <i className="fas fa-gift mr-2"></i>
              Surprise Your Partner & View Couples Packages
              <i className="fas fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-pink-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Relationship?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of couples who are building stronger, more connected relationships with Better Together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="/paywall" className="w-full sm:w-auto bg-white text-pink-600 px-8 py-4 rounded-lg font-semibold hover:bg-pink-50 transition-all transform hover:scale-105 shadow-lg inline-flex items-center justify-center">
              <i className="fas fa-crown mr-2"></i>
              Get Premium Access
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-2xl">💕</span>
                <span className="ml-2 text-xl font-bold text-white">Better Together</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transforming relationships through intelligent connection tracking and shared growth experiences.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Product</h5>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/paywall" className="text-gray-400 hover:text-white transition-colors">Premium</a></li>
                <li><a href="/api" className="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Account</h5>
              <ul className="space-y-2">
                <li><a href="/login" className="text-gray-400 hover:text-white transition-colors">Login</a></li>
                <li><a href="/portal" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/subscription" className="text-gray-400 hover:text-white transition-colors">Subscription</a></li>
                <li><a href="/email-preferences" className="text-gray-400 hover:text-white transition-colors">Email Preferences</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-white mb-4">Business</h5>
              <ul className="space-y-2">
                <li><a href="/become-sponsor.html" className="text-gray-400 hover:text-white transition-colors">Become a Partner</a></li>
                <li><a href="/gift-subscription" className="text-gray-400 hover:text-white transition-colors">Gift a Subscription</a></li>
                <li><a href="/bundles" className="text-gray-400 hover:text-white transition-colors">Shop Bundles</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 Better Together. Built with 💕 for couples who want to thrive together.
            </p>
          </div>
        </div>
      </footer>

      {/* Enhanced Mobile JavaScript with Animations */}
      <script>
        {`
          document.addEventListener('DOMContentLoaded', function() {
            // Enhanced Mobile menu toggle with animations
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
                
                // Animate hamburger to X
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

            // Enhanced button interactions
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
              // Add ripple effect
              button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                  ripple.remove();
                }, 600);
              });
              
              // Touch-friendly sizing on mobile
              if (window.innerWidth <= 768) {
                button.style.minHeight = '44px';
              }
            });

            // Enhanced scroll animations
            const observerOptions = {
              threshold: 0.1,
              rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.style.opacity = '1';
                  entry.target.style.transform = 'translateY(0)';
                }
              });
            }, observerOptions);
            
            // Observe animated elements
            const animatedElements = document.querySelectorAll('[class*="animate-"]');
            animatedElements.forEach(el => {
              // Set initial state for scroll animations
              if (!el.style.animationDelay) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                observer.observe(el);
              }
            });

            // Smooth scrolling for anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(link => {
              link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                  // Add scroll offset for fixed header
                  const headerHeight = 80;
                  const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                  
                  window.scrollTo({ 
                    top: targetPosition,
                    behavior: 'smooth'
                  });
                }
              });
            });

            // Parallax effect for background elements
            window.addEventListener('scroll', function() {
              const scrolled = window.pageYOffset;
              const parallax = document.querySelectorAll('[class*="animate-float"]');
              
              parallax.forEach((element, index) => {
                const speed = (index + 1) * 0.5;
                element.style.transform = 'translateY(' + (scrolled * speed) + 'px)';
              });
            });

            // Close mobile menu on resize
            window.addEventListener('resize', function() {
              if (window.innerWidth >= 768 && mobileMenu) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton?.querySelector('i');
                if (icon) icon.style.transform = 'rotate(0deg)';
              }
            });

          });
          
          // Add CSS for ripple effect
          const style = document.createElement('style');
          style.textContent = \`
            .ripple {
              position: absolute;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.6);
              transform: scale(0);
              animation: ripple 0.6s linear;
              pointer-events: none;
            }
            
            @keyframes ripple {
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
          \`;
          document.head.appendChild(style);
        `}
      </script>
    </div>
)
