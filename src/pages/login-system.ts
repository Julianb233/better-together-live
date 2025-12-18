// Complete Login & Registration System
export const loginSystemHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        body { 
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #FF6B9D 0%, #8B5CF6 50%, #3B82F6 100%);
            min-height: 100vh;
        }
        
        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .heart-pulse {
            animation: heartbeat 1.5s ease-in-out infinite;
        }
        
        @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .form-transition {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .input-focus:focus {
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="p-6">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <div class="flex items-center text-white">
                <span class="text-2xl mr-3 heart-pulse">💕</span>
                <span class="text-xl font-semibold">Better Together</span>
            </div>
            <a href="/" class="text-white/80 hover:text-white transition-colors">
                <i class="fas fa-home mr-2"></i>Home
            </a>
        </div>
    </nav>

    <div class="max-w-md mx-auto px-6 py-8">
        <!-- Toggle Buttons -->
        <div class="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1 mb-8">
            <button id="loginTab" onclick="showLogin()" 
                    class="flex-1 py-3 px-6 rounded-xl text-white font-semibold transition-all duration-200 bg-white/20">
                <i class="fas fa-sign-in-alt mr-2"></i>Login
            </button>
            <button id="registerTab" onclick="showRegister()" 
                    class="flex-1 py-3 px-6 rounded-xl text-white/70 font-semibold transition-all duration-200 hover:text-white">
                <i class="fas fa-user-plus mr-2"></i>Register
            </button>
        </div>

        <!-- Login Form -->
        <div id="loginForm" class="glass-card rounded-3xl shadow-2xl p-8">
            <div class="text-center mb-8">
                <div class="text-4xl mb-4 heart-pulse">💕</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                <p class="text-gray-600">Continue your relationship journey</p>
            </div>

            <form id="loginFormData" onsubmit="handleLogin(event)">
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-envelope mr-2 text-pink-500"></i>Email Address
                    </label>
                    <input type="email" id="loginEmail" required 
                           class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus form-transition"
                           placeholder="your.email@example.com">
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-lock mr-2 text-purple-500"></i>Password
                    </label>
                    <div class="relative">
                        <input type="password" id="loginPassword" required 
                               class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus form-transition pr-12"
                               placeholder="••••••••">
                        <button type="button" onclick="togglePassword('loginPassword')" 
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between mb-6">
                    <label class="flex items-center">
                        <input type="checkbox" class="rounded border-gray-300 text-pink-600 focus:ring-pink-500">
                        <span class="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <a href="#" onclick="showForgotPassword()" class="text-sm text-pink-600 hover:text-pink-700">
                        Forgot password?
                    </a>
                </div>

                <button type="submit" 
                        class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl">
                    <i class="fas fa-heart mr-2"></i>
                    Sign In to Your Love Journey
                </button>
            </form>

            <!-- Social Login -->
            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-4">
                    <button onclick="loginWithGoogle()" 
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <i class="fab fa-google text-red-500 mr-2"></i>
                        Google
                    </button>
                    <button onclick="loginWithFacebook()" 
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <i class="fab fa-facebook text-blue-600 mr-2"></i>
                        Facebook
                    </button>
                </div>
            </div>
        </div>

        <!-- Register Form -->
        <div id="registerForm" class="glass-card rounded-3xl shadow-2xl p-8 hidden">
            <div class="text-center mb-8">
                <div class="text-4xl mb-4 heart-pulse">💕</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Start Your Journey</h1>
                <p class="text-gray-600">Create your relationship account</p>
            </div>

            <form id="registerFormData" onsubmit="handleRegister(event)">
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-user mr-2 text-blue-500"></i>First Name
                        </label>
                        <input type="text" id="firstName" required 
                               class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus form-transition"
                               placeholder="Sarah">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-user mr-2 text-blue-500"></i>Last Name
                        </label>
                        <input type="text" id="lastName" required 
                               class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus form-transition"
                               placeholder="Johnson">
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-envelope mr-2 text-pink-500"></i>Email Address
                    </label>
                    <input type="email" id="registerEmail" required 
                           class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus form-transition"
                           placeholder="sarah@example.com">
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-phone mr-2 text-green-500"></i>Phone Number (Optional)
                    </label>
                    <input type="tel" id="phoneNumber" 
                           class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus form-transition"
                           placeholder="+1 (555) 123-4567">
                </div>
                
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-lock mr-2 text-purple-500"></i>Password
                    </label>
                    <div class="relative">
                        <input type="password" id="registerPassword" required 
                               class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus form-transition pr-12"
                               placeholder="••••••••">
                        <button type="button" onclick="togglePassword('registerPassword')" 
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        Must be at least 8 characters with numbers and letters
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-heart mr-2 text-red-500"></i>Relationship Status
                    </label>
                    <select id="relationshipStatus" required 
                            class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus form-transition">
                        <option value="">Select your status</option>
                        <option value="dating">Dating</option>
                        <option value="engaged">Engaged</option>
                        <option value="married">Married</option>
                        <option value="committed">Committed Relationship</option>
                    </select>
                </div>

                <div class="mb-6">
                    <label class="flex items-start">
                        <input type="checkbox" id="agreeTerms" required class="mt-1 rounded border-gray-300 text-pink-600 focus:ring-pink-500">
                        <span class="ml-3 text-sm text-gray-600">
                            I agree to the <a href="#" class="text-pink-600 hover:text-pink-700">Terms of Service</a> 
                            and <a href="#" class="text-pink-600 hover:text-pink-700">Privacy Policy</a>
                        </span>
                    </label>
                </div>

                <div class="mb-6">
                    <label class="flex items-start">
                        <input type="checkbox" id="subscribeNewsletter" class="mt-1 rounded border-gray-300 text-pink-600 focus:ring-pink-500">
                        <span class="ml-3 text-sm text-gray-600">
                            Send me relationship tips and exclusive offers (optional)
                        </span>
                    </label>
                </div>

                <button type="submit" 
                        class="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-blue-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl">
                    <i class="fas fa-heart mr-2"></i>
                    Create My Love Account
                </button>
            </form>

            <!-- Social Register -->
            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-4">
                    <button onclick="registerWithGoogle()" 
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <i class="fab fa-google text-red-500 mr-2"></i>
                        Google
                    </button>
                    <button onclick="registerWithFacebook()" 
                            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <i class="fab fa-facebook text-blue-600 mr-2"></i>
                        Facebook
                    </button>
                </div>
            </div>
        </div>

        <!-- Forgot Password Form -->
        <div id="forgotPasswordForm" class="glass-card rounded-3xl shadow-2xl p-8 hidden">
            <div class="text-center mb-8">
                <div class="text-4xl mb-4">🔐</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
                <p class="text-gray-600">We'll send you a reset link</p>
            </div>

            <form id="forgotPasswordData" onsubmit="handleForgotPassword(event)">
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-envelope mr-2 text-pink-500"></i>Email Address
                    </label>
                    <input type="email" id="forgotEmail" required 
                           class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus form-transition"
                           placeholder="your.email@example.com">
                </div>

                <button type="submit" 
                        class="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl">
                    <i class="fas fa-paper-plane mr-2"></i>
                    Send Reset Link
                </button>
            </form>

            <div class="mt-6 text-center">
                <button onclick="showLogin()" class="text-pink-600 hover:text-pink-700 text-sm">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Login
                </button>
            </div>
        </div>
    </div>

    <script>
        // Form switching
        function showLogin() {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('forgotPasswordForm').classList.add('hidden');
            
            document.getElementById('loginTab').classList.add('bg-white/20');
            document.getElementById('loginTab').classList.remove('text-white/70');
            document.getElementById('registerTab').classList.remove('bg-white/20');
            document.getElementById('registerTab').classList.add('text-white/70');
        }

        function showRegister() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
            document.getElementById('forgotPasswordForm').classList.add('hidden');
            
            document.getElementById('registerTab').classList.add('bg-white/20');
            document.getElementById('registerTab').classList.remove('text-white/70');
            document.getElementById('loginTab').classList.remove('bg-white/20');
            document.getElementById('loginTab').classList.add('text-white/70');
        }

        function showForgotPassword() {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.add('hidden');
            document.getElementById('forgotPasswordForm').classList.remove('hidden');
        }

        // Password visibility toggle
        function togglePassword(inputId) {
            const input = document.getElementById(inputId);
            const icon = input.nextElementSibling.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        // Form handlers
        async function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (data.success) {
                    // Store auth token
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Redirect to dashboard
                    window.location.href = '/portal';
                } else {
                    alert('Login failed: ' + data.message);
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please try again.');
            }
        }

        async function handleRegister(event) {
            event.preventDefault();
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('registerEmail').value,
                phone: document.getElementById('phoneNumber').value,
                password: document.getElementById('registerPassword').value,
                relationshipStatus: document.getElementById('relationshipStatus').value,
                agreeTerms: document.getElementById('agreeTerms').checked,
                subscribeNewsletter: document.getElementById('subscribeNewsletter').checked
            };

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data.success) {
                    alert('Registration successful! Please check your email to verify your account.');
                    showLogin();
                } else {
                    alert('Registration failed: ' + data.message);
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('Registration failed. Please try again.');
            }
        }

        async function handleForgotPassword(event) {
            event.preventDefault();
            const email = document.getElementById('forgotEmail').value;

            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (data.success) {
                    alert('Password reset link sent! Check your email.');
                    showLogin();
                } else {
                    alert('Failed to send reset link: ' + data.message);
                }
            } catch (error) {
                console.error('Forgot password error:', error);
                alert('Failed to send reset link. Please try again.');
            }
        }

        // Social login handlers
        function loginWithGoogle() {
            // Implement Google OAuth login
            window.location.href = '/api/auth/google';
        }

        function loginWithFacebook() {
            // Implement Facebook OAuth login  
            window.location.href = '/api/auth/facebook';
        }

        function registerWithGoogle() {
            // Implement Google OAuth registration
            window.location.href = '/api/auth/google?register=true';
        }

        function registerWithFacebook() {
            // Implement Facebook OAuth registration
            window.location.href = '/api/auth/facebook?register=true';
        }
    </script>
</body>
</html>`;