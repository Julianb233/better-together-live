// Password Reset Page
// Renders a form for setting a new password after clicking the reset link in email.
// Expects access_token and refresh_token as query params (set by /api/auth/callback).
export const resetPasswordHtml = `<!DOCTYPE html>
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

        .input-focus:focus {
            transform: translateY(-1px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <nav class="p-6">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
            <div class="flex items-center text-white">
                <span class="text-2xl mr-3 heart-pulse">&#x1F495;</span>
                <span class="text-xl font-semibold">Better Together</span>
            </div>
            <a href="/login" class="text-white/80 hover:text-white transition-colors">
                <i class="fas fa-sign-in-alt mr-2"></i>Login
            </a>
        </div>
    </nav>

    <div class="max-w-md mx-auto px-6 py-8">
        <!-- Reset Password Form -->
        <div id="resetForm" class="glass-card rounded-3xl shadow-2xl p-8">
            <div class="text-center mb-8">
                <div class="text-4xl mb-4">&#x1F510;</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Set New Password</h1>
                <p class="text-gray-600">Enter your new password below</p>
            </div>

            <form id="resetFormData" onsubmit="handleResetPassword(event)">
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-lock mr-2 text-purple-500"></i>New Password
                    </label>
                    <div class="relative">
                        <input type="password" id="newPassword" required minlength="8"
                               class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus pr-12"
                               placeholder="Enter new password">
                        <button type="button" onclick="togglePassword('newPassword')"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        Must be at least 8 characters
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        <i class="fas fa-lock mr-2 text-purple-500"></i>Confirm Password
                    </label>
                    <div class="relative">
                        <input type="password" id="confirmPassword" required minlength="8"
                               class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent input-focus pr-12"
                               placeholder="Confirm new password">
                        <button type="button" onclick="togglePassword('confirmPassword')"
                                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div id="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm hidden"></div>
                <div id="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm hidden"></div>

                <button type="submit" id="submitBtn"
                        class="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl">
                    <i class="fas fa-key mr-2"></i>
                    Reset Password
                </button>
            </form>
        </div>

        <!-- Invalid Link Message -->
        <div id="invalidLink" class="glass-card rounded-3xl shadow-2xl p-8 hidden">
            <div class="text-center">
                <div class="text-4xl mb-4">&#x26A0;&#xFE0F;</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">Invalid Reset Link</h1>
                <p class="text-gray-600 mb-6">This password reset link is invalid or has expired. Please request a new one.</p>
                <a href="/login"
                   class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all duration-200">
                    <i class="fas fa-arrow-left mr-2"></i>Back to Login
                </a>
            </div>
        </div>
    </div>

    <script>
        // Extract tokens from URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');

        // If no tokens, show invalid link message
        if (!accessToken || !refreshToken) {
            document.getElementById('resetForm').classList.add('hidden');
            document.getElementById('invalidLink').classList.remove('hidden');
        }

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

        async function handleResetPassword(event) {
            event.preventDefault();

            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorEl = document.getElementById('errorMessage');
            const successEl = document.getElementById('successMessage');
            const submitBtn = document.getElementById('submitBtn');

            // Hide previous messages
            errorEl.classList.add('hidden');
            successEl.classList.add('hidden');

            if (newPassword !== confirmPassword) {
                errorEl.textContent = 'Passwords do not match.';
                errorEl.classList.remove('hidden');
                return;
            }

            if (newPassword.length < 8) {
                errorEl.textContent = 'Password must be at least 8 characters.';
                errorEl.classList.remove('hidden');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Resetting...';

            try {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        newPassword,
                        accessToken,
                        refreshToken
                    })
                });

                const data = await response.json();

                if (data.success) {
                    successEl.textContent = 'Password reset successfully! Redirecting to login...';
                    successEl.classList.remove('hidden');
                    document.getElementById('resetFormData').classList.add('hidden');
                    setTimeout(function() { window.location.href = '/login'; }, 2000);
                } else {
                    errorEl.textContent = data.error || 'Failed to reset password. Please try again.';
                    errorEl.classList.remove('hidden');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-key mr-2"></i>Reset Password';
                }
            } catch (error) {
                console.error('Reset password error:', error);
                errorEl.textContent = 'An error occurred. Please try again.';
                errorEl.classList.remove('hidden');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-key mr-2"></i>Reset Password';
            }
        }
    </script>
</body>
</html>`;
