// Better Together - Professional Frontend Application
// Enhanced with modern UX patterns, smooth animations, and comprehensive demo functionality

// Configuration
const CONFIG = {
  API_BASE: window.location.origin + '/api',
  ANIMATION_DURATION: 300,
  NOTIFICATION_DURATION: 5000,
  DEMO_DELAY: 1000
}

// Global Application State
const AppState = {
  currentUser: null,
  relationship: null,
  partner: null,
  isLoggedIn: false,
  isLoading: false,
  currentPage: 'home'
}

// Utility Functions
const Utils = {
  // Format date with locale support
  formatDate: (dateString, options = {}) => {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options })
  },

  // Calculate days between dates
  daysBetween: (date1, date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    const diffTime = Math.abs(d2 - d1)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  },

  // Enhanced notification system with different types and positioning
  showNotification: (message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION) => {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove())
    
    const notification = document.createElement('div')
    notification.className = `notification ${type} fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 max-w-md transform transition-all duration-300`
    
    const iconMap = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle', 
      warning: 'fas fa-exclamation-triangle',
      info: 'fas fa-info-circle'
    }
    
    notification.innerHTML = `
      <div class="flex items-center">
        <i class="${iconMap[type]} mr-3"></i>
        <span class="font-medium">${message}</span>
        <button onclick="this.closest('.notification').remove()" class="ml-4 text-current opacity-75 hover:opacity-100">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `
    
    document.body.appendChild(notification)
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)'
      notification.style.opacity = '1'
    })
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      notification.style.opacity = '0'
      setTimeout(() => notification.remove(), CONFIG.ANIMATION_DURATION)
    }, duration)
  },

  // Enhanced loading overlay with branded styling
  showLoading: (message = 'Loading...') => {
    Utils.hideLoading() // Remove any existing loader
    
    const loader = document.createElement('div')
    loader.id = 'global-loader'
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    loader.innerHTML = `
      <div class="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4">
        <div class="relative mb-6">
          <div class="w-16 h-16 mx-auto border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-2xl animate-pulse">💕</span>
          </div>
        </div>
        <h3 class="font-semibold text-gray-800 mb-2">${message}</h3>
        <p class="text-gray-600 text-sm">Building better relationships together...</p>
      </div>
    `
    
    document.body.appendChild(loader)
    
    // Animate in
    requestAnimationFrame(() => {
      loader.style.opacity = '1'
    })
  },

  hideLoading: () => {
    const loader = document.getElementById('global-loader')
    if (loader) {
      loader.style.opacity = '0'
      setTimeout(() => loader.remove(), CONFIG.ANIMATION_DURATION)
    }
  },

  // Enhanced modal system with better UX
  createModal: (title, content, options = {}) => {
    const modal = document.createElement('div')
    modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
    modal.style.opacity = '0'
    
    const { size = 'lg', closable = true, actions = [] } = options
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg', 
      lg: 'max-w-2xl',
      xl: 'max-w-4xl'
    }
    
    const actionsHTML = actions.length ? `
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        ${actions.map(action => `
          <button onclick="${action.onClick}" class="px-4 py-2 rounded-lg font-medium transition-colors ${action.className || 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
            ${action.icon ? `<i class="${action.icon} mr-2"></i>` : ''}
            ${action.label}
          </button>
        `).join('')}
      </div>
    ` : ''
    
    modal.innerHTML = `
      <div class="modal-content bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto transform scale-95">
        <div class="p-6 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-800">${title}</h2>
            ${closable ? `
              <button onclick="this.closest('.modal').remove()" class="text-gray-500 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                <i class="fas fa-times"></i>
              </button>
            ` : ''}
          </div>
        </div>
        <div class="p-6">
          ${content}
          ${actionsHTML}
        </div>
      </div>
    `
    
    // Close on backdrop click
    if (closable) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.remove()
        }
      })
    }
    
    document.body.appendChild(modal)
    
    // Animate in
    requestAnimationFrame(() => {
      modal.style.opacity = '1'
      modal.querySelector('.modal-content').style.transform = 'scale(1)'
    })
    
    return modal
  },

  // Smooth scroll to element with offset
  scrollTo: (element, offset = 80) => {
    const targetElement = typeof element === 'string' ? document.querySelector(element) : element
    if (targetElement) {
      const elementTop = targetElement.offsetTop - offset
      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      })
    }
  },

  // Copy to clipboard with feedback
  copyToClipboard: async (text, successMessage = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text)
      Utils.showNotification(successMessage, 'success')
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      Utils.showNotification(successMessage, 'success')
    }
  },

  // Debounce function for search/input handling
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
}

// Enhanced API Layer with better error handling and retry logic
const API = {
  // Request interceptor with error handling and retry
  call: async (endpoint, options = {}, retries = 2) => {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    
    const requestOptions = {
      ...defaultOptions,
      ...options,
      headers: { ...defaultOptions.headers, ...(options.headers || {}) }
    }

    try {
      const response = await axios({
        url: `${CONFIG.API_BASE}${endpoint}`,
        timeout: 10000, // 10 second timeout
        ...requestOptions
      })
      return response.data
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      
      // Retry logic for network errors
      if (retries > 0 && (error.code === 'NETWORK_ERROR' || error.response?.status >= 500)) {
        console.log(`Retrying API call to ${endpoint}, ${retries} attempts remaining`)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
        return API.call(endpoint, options, retries - 1)
      }
      
      throw error.response?.data || { error: error.message || 'Network error occurred' }
    }
  },

  // User Management
  createUser: (userData) => API.call('/users', { method: 'POST', data: userData }),
  getUser: (userId) => API.call(`/users/${userId}`),
  updateUser: (userId, updates) => API.call(`/users/${userId}`, { method: 'PUT', data: updates }),

  // Relationship Management
  invitePartner: (userId, partnerEmail, relationshipType, startDate) => API.call('/invite-partner', {
    method: 'POST',
    data: { user_id: userId, partner_email: partnerEmail, relationship_type: relationshipType, start_date: startDate }
  }),
  getRelationship: (userId) => API.call(`/relationships/${userId}`),

  // Check-ins
  submitCheckin: (checkinData) => API.call('/checkins', { method: 'POST', data: checkinData }),
  getCheckins: (relationshipId, limit = 30) => API.call(`/checkins/${relationshipId}?limit=${limit}`),

  // Goals
  createGoal: (goalData) => API.call('/goals', { method: 'POST', data: goalData }),
  getGoals: (relationshipId, status = 'all') => API.call(`/goals/${relationshipId}?status=${status}`),
  updateGoalProgress: (goalId, progressIncrement) => API.call(`/goals/${goalId}/progress`, { method: 'PUT', data: { progress_increment: progressIncrement } }),

  // Activities
  createActivity: (activityData) => API.call('/activities', { method: 'POST', data: activityData }),
  getActivities: (relationshipId, status = 'all', limit = 50) => API.call(`/activities/${relationshipId}?status=${status}&limit=${limit}`),
  completeActivity: (activityId, completionData) => API.call(`/activities/${activityId}/complete`, { method: 'PUT', data: completionData }),

  // Important Dates
  addImportantDate: (dateData) => API.call('/important-dates', { method: 'POST', data: dateData }),
  getImportantDates: (relationshipId, upcoming = false) => API.call(`/important-dates/${relationshipId}?upcoming=${upcoming}`),

  // Challenges
  getChallenges: (category = null, difficulty = null) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (difficulty) params.append('difficulty', difficulty)
    const queryString = params.toString()
    return API.call(`/challenges${queryString ? '?' + queryString : ''}`)
  },
  startChallenge: (challengeId, relationshipId) => API.call(`/challenges/${challengeId}/start`, { method: 'POST', data: { relationship_id: relationshipId } }),
  getChallengeParticipation: (relationshipId, status = 'all') => API.call(`/challenges/participation/${relationshipId}?status=${status}`),

  // Dashboard & Analytics
  getDashboard: (userId) => API.call(`/dashboard/${userId}`),
  getAnalytics: (relationshipId) => API.call(`/analytics/${relationshipId}`),

  // Notifications
  getNotifications: (userId, unreadOnly = false, limit = 20) => API.call(`/notifications/${userId}?unread_only=${unreadOnly}&limit=${limit}`),
  markNotificationRead: (notificationId) => API.call(`/notifications/${notificationId}/read`, { method: 'PUT' })
}

// Enhanced UI Controller with Modern UX Patterns
const UI = {
  // Initialize application with enhanced features
  init: () => {
    console.log('💕 Better Together - Professional Edition Initialized')
    
    UI.initNavigation()
    UI.initScrollEffects()
    UI.initDemoFeatures()
    UI.initFormHandlers()
    UI.initAccessibility()
    
    // Initialize page-specific features
    if (window.location.pathname === '/') {
      UI.initHomepage()
    }
    
    // Global keyboard shortcuts
    document.addEventListener('keydown', UI.handleKeyboardShortcuts)
  },

  // Enhanced navigation with smooth scrolling and active states
  initNavigation: () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute('href'))
        if (target) {
          Utils.scrollTo(target)
          // Update URL without jumping
          history.pushState(null, null, link.getAttribute('href'))
        }
      })
    })

    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('[data-mobile-menu-toggle]')
    const mobileMenu = document.querySelector('[data-mobile-menu]')
    
    if (mobileMenuButton && mobileMenu) {
      mobileMenuButton.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('open')
        mobileMenu.classList.toggle('open', !isOpen)
        mobileMenuButton.querySelector('i').className = isOpen ? 'fas fa-bars' : 'fas fa-times'
      })
    }

    // Navbar scroll effect
    let lastScrollY = window.scrollY
    const navbar = document.querySelector('nav')
    
    if (navbar) {
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY
        
        // Add shadow on scroll
        if (currentScrollY > 10) {
          navbar.classList.add('shadow-lg')
        } else {
          navbar.classList.remove('shadow-lg')
        }
        
        // Hide/show navbar on scroll (optional)
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          navbar.style.transform = 'translateY(-100%)'
        } else {
          navbar.style.transform = 'translateY(0)'
        }
        
        lastScrollY = currentScrollY
      })
    }
  },

  // Scroll-triggered animations and effects
  initScrollEffects: () => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .card, .stat-item').forEach(el => {
      observer.observe(el)
    })

    // Progress bars animation when in view
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll('.progress-fill')
          progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || bar.style.width
            bar.style.width = width
          })
        }
      })
    }, observerOptions)

    document.querySelectorAll('.progress-bar').forEach(el => {
      progressObserver.observe(el.parentElement)
    })
  },

  // Enhanced demo features with better UX
  initDemoFeatures: () => {
    // Demo button handlers with improved feedback
    const demoButtons = {
      'start-trial': UI.showSignupForm,
      'view-demo': UI.showEnhancedDemo,
      'watch-demo': UI.showVideoDemo
    }

    Object.entries(demoButtons).forEach(([className, handler]) => {
      document.querySelectorAll(`.${className}, [data-action="${className}"]`).forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault()
          
          // Button feedback animation
          button.style.transform = 'scale(0.95)'
          setTimeout(() => {
            button.style.transform = 'scale(1)'
            handler()
          }, 100)
        })
      })
    })
  },

  // Form handling with validation and UX improvements
  initFormHandlers: () => {
    // Enhanced form validation
    const forms = document.querySelectorAll('form')
    forms.forEach(form => {
      // Real-time validation
      const inputs = form.querySelectorAll('input, select, textarea')
      inputs.forEach(input => {
        input.addEventListener('blur', () => UI.validateField(input))
        input.addEventListener('input', Utils.debounce(() => UI.validateField(input), 500))
      })

      // Form submission
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        UI.handleFormSubmit(form)
      })
    })
  },

  // Accessibility enhancements
  initAccessibility: () => {
    // Focus management for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal')
        if (modal) {
          modal.remove()
        }
      }
    })

    // Skip to main content link
    const skipLink = document.createElement('a')
    skipLink.href = '#main-content'
    skipLink.textContent = 'Skip to main content'
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-pink-600 text-white p-2 rounded z-50'
    document.body.insertBefore(skipLink, document.body.firstChild)
  },

  // Enhanced homepage interactions
  initHomepage: () => {
    // Statistics counter animation
    UI.animateCounters()
    
    // Feature cards hover effects
    document.querySelectorAll('.feature-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)'
      })
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)'
      })
    })

    // Pricing plan selection
    document.querySelectorAll('[data-plan-select]').forEach(button => {
      button.addEventListener('click', () => {
        const plan = button.getAttribute('data-plan-select')
        UI.handlePlanSelection(plan)
      })
    })
  },

  // Animate number counters
  animateCounters: () => {
    const counters = document.querySelectorAll('[data-counter]')
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const target = parseInt(counter.getAttribute('data-counter'))
          const duration = 2000
          const step = target / (duration / 16)
          let current = 0

          const timer = setInterval(() => {
            current += step
            if (current >= target) {
              counter.textContent = target + (counter.getAttribute('data-suffix') || '')
              clearInterval(timer)
            } else {
              counter.textContent = Math.floor(current) + (counter.getAttribute('data-suffix') || '')
            }
          }, 16)
          
          counterObserver.unobserve(counter)
        }
      })
    }, { threshold: 0.5 })

    counters.forEach(counter => counterObserver.observe(counter))
  },

  // Enhanced demo modal with interactive features
  showEnhancedDemo: () => {
    const modal = Utils.createModal('Better Together Demo Platform', `
      <div class="space-y-6">
        <div class="text-center">
          <div class="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <i class="fas fa-rocket text-white text-3xl"></i>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-800">Explore Live Features</h3>
          <p class="text-gray-600 mb-6">Experience the full power of Better Together with our interactive demo</p>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <button onclick="UI.testAPIConnection()" class="demo-feature-btn bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
            <i class="fas fa-plug text-2xl mb-3"></i>
            <h4 class="font-semibold mb-2">Test API Connection</h4>
            <p class="text-sm opacity-90">Verify backend connectivity and load live data</p>
          </button>
          
          <button onclick="UI.showSampleAnalytics()" class="demo-feature-btn bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg">
            <i class="fas fa-chart-line text-2xl mb-3"></i>
            <h4 class="font-semibold mb-2">Analytics Dashboard</h4>
            <p class="text-sm opacity-90">View relationship health metrics and insights</p>
          </button>
          
          <button onclick="UI.browseChallenges()" class="demo-feature-btn bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
            <i class="fas fa-trophy text-2xl mb-3"></i>
            <h4 class="font-semibold mb-2">Browse Challenges</h4>
            <p class="text-sm opacity-90">Explore relationship-building activities</p>
          </button>
          
          <button onclick="UI.showUserJourney()" class="demo-feature-btn bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg">
            <i class="fas fa-map-marked-alt text-2xl mb-3"></i>
            <h4 class="font-semibold mb-2">User Journey</h4>
            <p class="text-sm opacity-90">See how couples use Better Together</p>
          </button>
        </div>

        <div class="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-6">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <i class="fas fa-info-circle text-pink-600 text-xl"></i>
            </div>
            <div class="ml-3">
              <h4 class="text-sm font-semibold text-pink-800 mb-1">Live Demo Environment</h4>
              <p class="text-pink-700 text-sm leading-relaxed">
                This is a fully functional demo connected to our live API. All features work with real data and demonstrate the complete platform capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    `, {
      size: 'xl',
      actions: [
        {
          label: 'Start Free Account',
          className: 'bg-pink-600 text-white hover:bg-pink-700',
          icon: 'fas fa-user-plus',
          onClick: 'this.closest(\".modal\").remove(); UI.showSignupForm()'
        }
      ]
    })
  },

  // API Connection Test with detailed feedback
  testAPIConnection: async () => {
    Utils.showLoading('Testing API Connection...')
    
    try {
      const startTime = performance.now()
      const response = await API.getChallenges()
      const endTime = performance.now()
      const responseTime = Math.round(endTime - startTime)
      
      Utils.hideLoading()
      
      const modal = Utils.createModal('🎉 API Connection Successful', `
        <div class="space-y-6">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i class="fas fa-check text-green-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Connection Established</h3>
            <p class="text-gray-600">Successfully connected to Better Together API</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-green-600">${responseTime}ms</div>
              <div class="text-sm text-green-700">Response Time</div>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div class="text-2xl font-bold text-blue-600">${response.challenges.length}</div>
              <div class="text-sm text-blue-700">Available Challenges</div>
            </div>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold text-gray-800 mb-3">Sample Challenge Data:</h4>
            <div class="space-y-2 max-h-40 overflow-y-auto">
              ${response.challenges.slice(0, 3).map(challenge => `
                <div class="bg-white rounded-lg p-3 border border-gray-200">
                  <div class="flex justify-between items-start">
                    <div>
                      <h5 class="font-medium text-gray-800">${challenge.challenge_name}</h5>
                      <p class="text-sm text-gray-600">${challenge.challenge_description}</p>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full ${
                      challenge.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                      challenge.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }">
                      ${challenge.difficulty_level}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `)
      
      Utils.showNotification('✅ API connection verified successfully!', 'success')
    } catch (error) {
      Utils.hideLoading()
      Utils.showNotification('❌ API connection failed: ' + (error.error || error.message), 'error')
    }
  },

  // Enhanced signup form with better validation
  showSignupForm: () => {
    const modal = Utils.createModal('Start Your Relationship Journey 💕', `
      <form id="enhancedSignupForm" class="space-y-6">
        <div class="text-center mb-6">
          <div class="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-heart text-white text-2xl"></i>
          </div>
          <p class="text-gray-600">Create your account and invite your partner to begin building a stronger relationship together</p>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Your Name *</label>
            <input type="text" name="name" required class="form-input" placeholder="Enter your full name">
            <div class="error-message text-red-600 text-sm mt-1 hidden"></div>
          </div>
          
          <div>
            <label class="form-label">Email Address *</label>
            <input type="email" name="email" required class="form-input" placeholder="your@email.com">
            <div class="error-message text-red-600 text-sm mt-1 hidden"></div>
          </div>
        </div>
        
        <div>
          <label class="form-label">Partner's Email *</label>
          <input type="email" name="partner_email" required class="form-input" placeholder="partner@email.com">
          <div class="error-message text-red-600 text-sm mt-1 hidden"></div>
          <p class="text-sm text-gray-500 mt-1">Your partner will receive an invitation to join</p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="form-label">Relationship Status</label>
            <select name="relationship_type" class="form-select">
              <option value="dating">Dating</option>
              <option value="engaged">Engaged</option>
              <option value="married">Married</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>
          
          <div>
            <label class="form-label">Anniversary Date</label>
            <input type="date" name="start_date" class="form-input">
            <p class="text-sm text-gray-500 mt-1">When did your relationship begin?</p>
          </div>
        </div>

        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex">
            <i class="fas fa-shield-alt text-blue-600 mt-1 mr-3"></i>
            <div>
              <h4 class="font-medium text-blue-800 mb-1">Your Privacy Matters</h4>
              <p class="text-blue-700 text-sm">Your relationship data is encrypted and never shared. Only you and your partner can access your information.</p>
            </div>
          </div>
        </div>
        
        <button type="submit" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
          <i class="fas fa-rocket mr-2"></i>
          Create Account & Start Journey
        </button>

        <p class="text-center text-sm text-gray-500">
          By creating an account, you agree to our <a href="#" class="text-pink-600 hover:underline">Terms of Service</a> and <a href="#" class="text-pink-600 hover:underline">Privacy Policy</a>
        </p>
      </form>
    `, { size: 'lg' })
    
    // Enhanced form submission
    const form = modal.querySelector('#enhancedSignupForm')
    form.addEventListener('submit', UI.handleEnhancedSignup)
  },

  // Enhanced signup handling with better UX
  handleEnhancedSignup: async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    
    // Client-side validation
    const errors = UI.validateSignupForm(data)
    if (errors.length > 0) {
      errors.forEach(error => {
        Utils.showNotification(error, 'error')
      })
      return
    }
    
    Utils.showLoading('Creating Your Account...')
    
    try {
      // Create user account
      const userResponse = await API.createUser({
        email: data.email,
        name: data.name
      })
      
      // Invite partner
      await API.invitePartner(
        userResponse.user.id,
        data.partner_email,
        data.relationship_type,
        data.start_date
      )
      
      Utils.hideLoading()
      
      // Close signup modal
      document.querySelector('.modal').remove()
      
      // Show success modal
      UI.showSuccessModal(userResponse.user, data)
      
    } catch (error) {
      Utils.hideLoading()
      Utils.showNotification('❌ Account creation failed: ' + (error.error || error.message), 'error')
    }
  },

  // Success modal after signup
  showSuccessModal: (user, data) => {
    const modal = Utils.createModal('Welcome to Better Together! 🎉', `
      <div class="text-center space-y-6">
        <div class="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6">
          <i class="fas fa-check text-white text-4xl"></i>
        </div>
        
        <div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Account Created Successfully!</h3>
          <p class="text-gray-600">Your relationship journey starts now</p>
        </div>
        
        <div class="bg-green-50 border border-green-200 rounded-xl p-6">
          <h4 class="font-bold text-green-800 mb-4">What Happens Next?</h4>
          <div class="space-y-3 text-left">
            <div class="flex items-center">
              <i class="fas fa-check-circle text-green-600 mr-3"></i>
              <span class="text-green-700">Your account is ready to use</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-envelope text-green-600 mr-3"></i>
              <span class="text-green-700">${data.partner_email} will receive an invitation</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-heart text-green-600 mr-3"></i>
              <span class="text-green-700">Start with daily check-ins and shared goals</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-trophy text-green-600 mr-3"></i>
              <span class="text-green-700">Complete challenges and earn achievements</span>
            </div>
          </div>
        </div>
        
        <div class="space-y-4">
          <button onclick="UI.showGettingStartedGuide('${user.id}')" class="w-full bg-pink-600 text-white p-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
            <i class="fas fa-play mr-2"></i>
            Get Started Guide
          </button>
          
          <div class="text-sm text-gray-500">
            <p><strong>Your User ID:</strong> ${user.id}</p>
            <p>Save this for accessing your account</p>
          </div>
        </div>
      </div>
    `, { 
      size: 'lg',
      closable: false,
      actions: [
        {
          label: 'Continue to Dashboard',
          className: 'bg-purple-600 text-white hover:bg-purple-700',
          icon: 'fas fa-arrow-right',
          onClick: `UI.showDashboardDemo('${user.id}')`
        }
      ]
    })
  },

  // Keyboard shortcuts handler
  handleKeyboardShortcuts: (e) => {
    // Ctrl/Cmd + K for search (future feature)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      // Open search modal (future implementation)
      console.log('Search shortcut triggered')
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
      const modal = document.querySelector('.modal')
      if (modal) {
        modal.remove()
      }
    }
  },

  // Field validation with visual feedback
  validateField: (field) => {
    const errorElement = field.parentNode.querySelector('.error-message')
    const value = field.value.trim()
    let isValid = true
    let errorMessage = ''

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false
      errorMessage = 'This field is required'
    }

    // Email validation
    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      isValid = false
      errorMessage = 'Please enter a valid email address'
    }

    // Update UI
    if (isValid) {
      field.classList.remove('border-red-500')
      field.classList.add('border-green-500')
      if (errorElement) {
        errorElement.classList.add('hidden')
      }
    } else {
      field.classList.remove('border-green-500')
      field.classList.add('border-red-500')
      if (errorElement) {
        errorElement.textContent = errorMessage
        errorElement.classList.remove('hidden')
      }
    }

    return isValid
  },

  // Form validation
  validateSignupForm: (data) => {
    const errors = []

    if (!data.name?.trim()) errors.push('Name is required')
    if (!data.email?.trim()) errors.push('Email is required')
    if (!data.partner_email?.trim()) errors.push('Partner email is required')
    
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address')
    }
    
    if (data.partner_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.partner_email)) {
      errors.push('Please enter a valid partner email address')
    }

    if (data.email === data.partner_email) {
      errors.push('Your email and partner email must be different')
    }

    return errors
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  UI.init()
})

// Initialize on immediate load if DOM is already ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', UI.init)
} else {
  UI.init()
}

// Global error handling with user-friendly messages
window.addEventListener('error', (e) => {
  console.error('Application Error:', e.error)
  Utils.showNotification('Something went wrong. Please try again.', 'error')
})

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason)
  Utils.showNotification('Network error occurred. Please check your connection.', 'error')
})

// Expose core functions globally for demo and debugging
window.BetterTogether = {
  API,
  UI,
  Utils,
  AppState,
  CONFIG
}

console.log('🚀 Better Together Professional Edition Ready!')
console.log('Access demo features with: BetterTogether.UI.showEnhancedDemo()')