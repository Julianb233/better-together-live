// Login Page - iOS 26 Liquid Glass Authentication
export const loginHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Login | Better Together</title>
    <meta name="description" content="Secure login to Better Together analytics dashboard. Access real-time business intelligence and relationship platform metrics.">
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
                        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                        'slide-in-right': 'slideInRight 1s ease-out forwards',
                        'pulse-glow': 'pulseGlow 3s ease-in-out infinite alternate',
                        'float-slow': 'floatSlow 6s ease-in-out infinite',
                        'rotate-slow': 'rotateSlow 20s linear infinite'
                    },
                    keyframes: {
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(40px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' }
                        },
                        slideInRight: {
                            '0%': { opacity: '0', transform: 'translateX(50px)' },
                            '100%': { opacity: '1', transform: 'translateX(0)' }
                        },
                        pulseGlow: {
                            '0%': { boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)' },
                            '100%': { boxShadow: '0 0 60px rgba(236, 72, 153, 0.8)' }
                        },
                        floatSlow: {
                            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                            '50%': { transform: 'translateY(-20px) rotate(5deg)' }
                        },
                        rotateSlow: {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' }
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        
        /* iOS 26 Liquid Glass Effects */
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
        
        .liquid-glass-form {
            backdrop-filter: blur(30px) saturate(180%);
            background: linear-gradient(145deg, 
                rgba(255, 255, 255, 0.08) 0%,
                rgba(255, 255, 255, 0.03) 50%,
                rgba(255, 255, 255, 0.12) 100%);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 
                0 30px 60px -12px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                0 2px 6px rgba(255, 255, 255, 0.15) inset;
        }
        
        .liquid-glass-accent {
            backdrop-filter: blur(25px) saturate(200%);
            background: linear-gradient(145deg, 
                rgba(236, 72, 153, 0.15) 0%,
                rgba(139, 92, 246, 0.10) 50%,
                rgba(236, 72, 153, 0.20) 100%);
            border: 1px solid rgba(236, 72, 153, 0.25);
            box-shadow: 
                0 25px 50px -12px rgba(236, 72, 153, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 2px 8px rgba(255, 255, 255, 0.25) inset;
        }
        
        /* Advanced Animations */
        .liquid-hover {
            transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .liquid-hover:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 
                0 40px 80px -12px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(255, 255, 255, 0.12) inset,
                0 3px 12px rgba(255, 255, 255, 0.4) inset;
        }
        
        .liquid-press {
            transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .liquid-press:active {
            transform: scale(0.96);
            box-shadow: 
                0 15px 30px -8px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.05) inset;
        }
        
        .morphing-gradient {
            background: linear-gradient(45deg, 
                rgba(236, 72, 153, 0.9), 
                rgba(139, 92, 246, 0.9),
                rgba(59, 130, 246, 0.9),
                rgba(16, 185, 129, 0.9),
                rgba(236, 72, 153, 0.9));
            background-size: 400% 400%;
            animation: morphGradient 8s ease infinite;
        }
        @keyframes morphGradient {
            0% { background-position: 0% 50%; }
            25% { background-position: 100% 50%; }
            50% { background-position: 50% 100%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Dynamic Background */
        .login-bg {
            background: linear-gradient(135deg, #0f1419 0%, #1a202c 25%, #2d3748 50%, #1a202c 75%, #0f1419 100%);
            min-height: 100vh;
            position: relative;
            overflow: hidden;
        }
        
        .bg-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.7;
        }
        
        .orb-1 {
            width: 300px;
            height: 300px;
            background: linear-gradient(45deg, #ec4899, #8b5cf6);
            top: 10%;
            left: 15%;
            animation: floatSlow 8s ease-in-out infinite;
        }
        
        .orb-2 {
            width: 200px;
            height: 200px;
            background: linear-gradient(45deg, #3b82f6, #10b981);
            bottom: 20%;
            right: 10%;
            animation: floatSlow 6s ease-in-out infinite reverse;
        }
        
        .orb-3 {
            width: 150px;
            height: 150px;
            background: linear-gradient(45deg, #f59e0b, #ef4444);
            top: 60%;
            left: 70%;
            animation: floatSlow 10s ease-in-out infinite;
        }
        
        /* Input Field Styling */
        .liquid-input {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }
        .liquid-input:focus {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(236, 72, 153, 0.4);
            box-shadow: 0 0 20px rgba(236, 72, 153, 0.2);
        }
        
        /* Floating Labels */
        .floating-label {
            transition: all 0.3s ease;
            pointer-events: none;
        }
        .liquid-input:focus + .floating-label,
        .liquid-input:not(:placeholder-shown) + .floating-label {
            transform: translateY(-25px) scale(0.85);
            color: #ec4899;
        }
        
        /* Loading Animation */
        .loading-dots {
            display: none;
        }
        .loading .loading-dots {
            display: inline-block;
        }
        .loading .login-text {
            display: none;
        }
        
        @keyframes dots {
            0%, 20% { color: rgba(255,255,255,0.3); }
            50% { color: rgba(255,255,255,1); }
            80%, 100% { color: rgba(255,255,255,0.3); }
        }
        .loading-dots span:nth-child(1) { animation: dots 1.4s linear infinite 0s; }
        .loading-dots span:nth-child(2) { animation: dots 1.4s linear infinite 0.2s; }
        .loading-dots span:nth-child(3) { animation: dots 1.4s linear infinite 0.4s; }
    </style>
</head>
<body class="login-bg text-white">
    <!-- Animated Background Orbs -->
    <div class="bg-orb orb-1"></div>
    <div class="bg-orb orb-2"></div>
    <div class="bg-orb orb-3"></div>
    
    <!-- Login Container -->
    <div class="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div class="w-full max-w-md">
            <!-- Logo and Branding -->
            <div class="text-center mb-8 animate-fade-in-up">
                <div class="liquid-glass rounded-2xl p-6 mb-6 liquid-hover">
                    <div class="morphing-gradient w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span class="text-3xl">💕</span>
                    </div>
                    <h1 class="text-2xl font-bold text-white mb-2">Better Together</h1>
                    <p class="text-gray-300 text-sm">Analytics Dashboard</p>
                </div>
            </div>
            
            <!-- Login Form -->
            <div class="liquid-glass-form rounded-2xl p-8 liquid-hover animate-fade-in-up" style="animation-delay: 0.2s;">
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p class="text-gray-300">Sign in to access your analytics dashboard</p>
                </div>
                
                <form id="loginForm" class="space-y-6">
                    <!-- Email Field -->
                    <div class="relative">
                        <input 
                            type="email" 
                            id="email" 
                            class="liquid-input w-full px-4 py-4 text-white placeholder-transparent rounded-lg focus:outline-none"
                            placeholder="Email address"
                            required
                        >
                        <label for="email" class="floating-label absolute left-4 top-4 text-gray-400 transition-all">
                            <i class="fas fa-envelope mr-2"></i>Email Address
                        </label>
                    </div>
                    
                    <!-- Password Field -->
                    <div class="relative">
                        <input 
                            type="password" 
                            id="password" 
                            class="liquid-input w-full px-4 py-4 text-white placeholder-transparent rounded-lg focus:outline-none pr-12"
                            placeholder="Password"
                            required
                        >
                        <label for="password" class="floating-label absolute left-4 top-4 text-gray-400 transition-all">
                            <i class="fas fa-lock mr-2"></i>Password
                        </label>
                        <button type="button" id="togglePassword" class="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    
                    <!-- Remember Me & Forgot Password -->
                    <div class="flex items-center justify-between text-sm">
                        <label class="flex items-center text-gray-300 cursor-pointer liquid-hover">
                            <input type="checkbox" class="mr-2 rounded liquid-input">
                            Remember me
                        </label>
                        <a href="#" class="text-pink-400 hover:text-pink-300 transition-colors liquid-hover">
                            Forgot password?
                        </a>
                    </div>
                    
                    <!-- Login Button -->
                    <button 
                        type="submit" 
                        id="loginBtn"
                        class="w-full liquid-glass-accent text-white py-4 rounded-lg font-semibold text-lg liquid-hover liquid-press animate-pulse-glow"
                    >
                        <span class="login-text">
                            <i class="fas fa-chart-line mr-2"></i>
                            Access Dashboard
                        </span>
                        <span class="loading-dots">
                            Authenticating<span>.</span><span>.</span><span>.</span>
                        </span>
                    </button>
                </form>
                
                <!-- Demo Login -->
                <div class="mt-8 pt-6 border-t border-gray-600">
                    <div class="text-center">
                        <p class="text-gray-400 text-sm mb-4">Demo Access</p>
                        <button 
                            id="demoLogin"
                            class="liquid-glass text-gray-300 px-6 py-3 rounded-lg font-medium liquid-hover liquid-press"
                        >
                            <i class="fas fa-play mr-2"></i>
                            Try Demo Dashboard
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- Security Notice -->
            <div class="mt-6 text-center animate-fade-in-up" style="animation-delay: 0.4s;">
                <div class="liquid-glass rounded-xl p-4">
                    <div class="flex items-center justify-center text-gray-400 text-sm">
                        <i class="fas fa-shield-alt mr-2 text-green-400"></i>
                        <span>Enterprise-grade security with end-to-end encryption</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Success Modal -->
    <div id="successModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div class="liquid-glass-form rounded-2xl p-8 max-w-sm w-full mx-4 animate-fade-in-up">
            <div class="text-center">
                <div class="morphing-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-check text-white text-2xl"></i>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">Login Successful!</h3>
                <p class="text-gray-300 mb-4">Redirecting to analytics dashboard...</p>
                <div class="flex justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Login Form Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const loginForm = document.getElementById('loginForm');
            const loginBtn = document.getElementById('loginBtn');
            const demoBtn = document.getElementById('demoLogin');
            const togglePassword = document.getElementById('togglePassword');
            const passwordInput = document.getElementById('password');
            const successModal = document.getElementById('successModal');
            
            // Toggle Password Visibility
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
            });
            
            // Handle Login Form Submit
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Add loading state
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;
                
                // Simulate authentication
                setTimeout(() => {
                    // Set authentication status
                    localStorage.setItem('bt_authenticated', 'true');
                    localStorage.setItem('bt_user', JSON.stringify({
                        email: document.getElementById('email').value,
                        name: 'Analytics Admin',
                        role: 'admin',
                        loginTime: new Date().toISOString()
                    }));
                    
                    // Show success modal
                    successModal.classList.remove('hidden');
                    
                    // Redirect to dashboard after 2 seconds
                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
                    }, 2000);
                }, 2000);
            });
            
            // Demo Login
            demoBtn.addEventListener('click', function() {
                // Add loading animation
                this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading Demo...';
                this.disabled = true;
                
                // Set demo authentication
                localStorage.setItem('bt_authenticated', 'true');
                localStorage.setItem('bt_user', JSON.stringify({
                    email: 'demo@bettertogether.com',
                    name: 'Demo User',
                    role: 'demo',
                    loginTime: new Date().toISOString()
                }));
                
                // Redirect to dashboard after 1 second
                setTimeout(() => {
                    window.location.href = '/dashboard.html?demo=true';
                }, 1000);
            });
            
            // Floating Label Animation for Inputs
            const inputs = document.querySelectorAll('.liquid-input');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (this.value === '') {
                        const label = this.nextElementSibling;
                        if (label && label.classList.contains('floating-label')) {
                            label.style.transform = 'translateY(0) scale(1)';
                            label.style.color = '#9ca3af';
                        }
                    }
                });
            });
            
            // Add subtle parallax effect to background orbs
            document.addEventListener('mousemove', function(e) {
                const orbs = document.querySelectorAll('.bg-orb');
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;
                
                orbs.forEach((orb, index) => {
                    const speed = (index + 1) * 0.02;
                    const x = (mouseX - 0.5) * speed * 100;
                    const y = (mouseY - 0.5) * speed * 100;
                    orb.style.transform = \`translate(\${x}px, \${y}px)\`;
                });
            });
        });
    </script>
</body>
</html>`;