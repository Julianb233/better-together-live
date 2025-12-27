// Password Reset Page
export const passwordResetHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #fdf2f8 0%, #f5f3ff 50%, #ede9fe 100%);
            min-height: 100vh;
        }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .input-focus:focus { box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2); }
    </style>
</head>
<body class="flex items-center justify-center p-4">
    <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <span class="text-3xl">💕</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">Reset Your Password</h1>
            <p class="text-gray-600 mt-2">We'll help you get back to your relationship journey</p>
        </div>

        <!-- Reset Form Container -->
        <div class="glass-card rounded-2xl shadow-xl p-8">
            <!-- Step 1: Email Input -->
            <div id="step1">
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div class="relative">
                        <input
                            type="email"
                            id="resetEmail"
                            placeholder="your@email.com"
                            class="input-focus w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition"
                        >
                        <i class="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                <button
                    onclick="sendResetCode()"
                    class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
                >
                    <i class="fas fa-paper-plane mr-2"></i>
                    Send Reset Code
                </button>
            </div>

            <!-- Step 2: Enter Code -->
            <div id="step2" class="hidden">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-envelope-open-text text-green-600 text-2xl"></i>
                    </div>
                    <h2 class="font-semibold text-gray-900">Check Your Email</h2>
                    <p class="text-gray-600 text-sm mt-1">We've sent a reset code to <span id="sentToEmail" class="font-medium"></span></p>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Reset Code</label>
                    <div class="flex gap-2 justify-center">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none" id="code1">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none" id="code2">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none" id="code3">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none" id="code4">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none" id="code5">
                        <input type="text" maxlength="1" class="w-12 h-12 text-center text-xl font-bold border border-gray-200 rounded-lg focus:border-pink-500 focus:outline-none" id="code6">
                    </div>
                </div>

                <button
                    onclick="verifyCode()"
                    class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl mb-4"
                >
                    <i class="fas fa-check-circle mr-2"></i>
                    Verify Code
                </button>

                <button onclick="sendResetCode()" class="w-full text-pink-600 py-2 text-sm hover:underline">
                    Didn't receive it? Send again
                </button>
            </div>

            <!-- Step 3: New Password -->
            <div id="step3" class="hidden">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-key text-pink-600 text-2xl"></i>
                    </div>
                    <h2 class="font-semibold text-gray-900">Create New Password</h2>
                    <p class="text-gray-600 text-sm mt-1">Choose a strong password for your account</p>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div class="relative">
                        <input
                            type="password"
                            id="newPassword"
                            placeholder="Enter new password"
                            class="input-focus w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition"
                        >
                        <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <button type="button" onclick="togglePassword('newPassword', this)" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div class="relative">
                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            class="input-focus w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition"
                        >
                        <i class="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    </div>
                </div>

                <!-- Password Requirements -->
                <div class="mb-6 p-4 bg-gray-50 rounded-xl text-sm">
                    <div class="font-medium text-gray-700 mb-2">Password must contain:</div>
                    <ul class="space-y-1 text-gray-600">
                        <li id="req-length" class="flex items-center"><i class="fas fa-circle text-xs mr-2 text-gray-300"></i>At least 8 characters</li>
                        <li id="req-upper" class="flex items-center"><i class="fas fa-circle text-xs mr-2 text-gray-300"></i>One uppercase letter</li>
                        <li id="req-number" class="flex items-center"><i class="fas fa-circle text-xs mr-2 text-gray-300"></i>One number</li>
                    </ul>
                </div>

                <button
                    onclick="resetPassword()"
                    class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
                >
                    <i class="fas fa-check mr-2"></i>
                    Reset Password
                </button>
            </div>

            <!-- Success Step -->
            <div id="step4" class="hidden text-center">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class="fas fa-check-circle text-green-600 text-4xl"></i>
                </div>
                <h2 class="text-xl font-semibold text-gray-900 mb-2">Password Reset!</h2>
                <p class="text-gray-600 mb-6">Your password has been successfully reset. You can now log in with your new password.</p>

                <a href="/login" class="block w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl text-center">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    Go to Login
                </a>
            </div>
        </div>

        <!-- Back to Login Link -->
        <div class="text-center mt-6">
            <a href="/login" class="text-gray-600 hover:text-pink-600 transition">
                <i class="fas fa-arrow-left mr-2"></i>
                Back to Login
            </a>
        </div>
    </div>

    <script>
        let currentStep = 1;
        let resetToken = '';

        // Auto-focus next code input
        document.querySelectorAll('[id^="code"]').forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < 5) {
                    document.getElementById('code' + (index + 2)).focus();
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    document.getElementById('code' + index).focus();
                }
            });
        });

        async function sendResetCode() {
            const email = document.getElementById('resetEmail').value;
            if (!email) {
                alert('Please enter your email address');
                return;
            }

            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    document.getElementById('sentToEmail').textContent = email;
                    showStep(2);
                } else {
                    const data = await response.json();
                    alert(data.error || 'Failed to send reset code');
                }
            } catch (error) {
                console.error('Reset error:', error);
                alert('Failed to send reset code');
            }
        }

        async function verifyCode() {
            const code = Array.from({ length: 6 }, (_, i) =>
                document.getElementById('code' + (i + 1)).value
            ).join('');

            if (code.length !== 6) {
                alert('Please enter the 6-digit code');
                return;
            }

            try {
                const response = await fetch('/api/auth/verify-reset-code', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: document.getElementById('resetEmail').value,
                        code
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    resetToken = data.token;
                    showStep(3);
                } else {
                    alert('Invalid code. Please try again.');
                }
            } catch (error) {
                console.error('Verify error:', error);
                alert('Failed to verify code');
            }
        }

        async function resetPassword() {
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (newPassword.length < 8) {
                alert('Password must be at least 8 characters');
                return;
            }

            try {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: resetToken,
                        newPassword
                    })
                });

                if (response.ok) {
                    showStep(4);
                } else {
                    const data = await response.json();
                    alert(data.error || 'Failed to reset password');
                }
            } catch (error) {
                console.error('Reset error:', error);
                alert('Failed to reset password');
            }
        }

        function showStep(step) {
            currentStep = step;
            for (let i = 1; i <= 4; i++) {
                document.getElementById('step' + i).classList.toggle('hidden', i !== step);
            }
        }

        function togglePassword(inputId, button) {
            const input = document.getElementById(inputId);
            const icon = button.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        }

        // Password validation
        document.getElementById('newPassword')?.addEventListener('input', (e) => {
            const password = e.target.value;
            updateRequirement('req-length', password.length >= 8);
            updateRequirement('req-upper', /[A-Z]/.test(password));
            updateRequirement('req-number', /[0-9]/.test(password));
        });

        function updateRequirement(id, met) {
            const el = document.getElementById(id);
            const icon = el.querySelector('i');
            if (met) {
                icon.classList.replace('fa-circle', 'fa-check-circle');
                icon.classList.replace('text-gray-300', 'text-green-500');
            } else {
                icon.classList.replace('fa-check-circle', 'fa-circle');
                icon.classList.replace('text-green-500', 'text-gray-300');
            }
        }
    </script>
</body>
</html>`;
