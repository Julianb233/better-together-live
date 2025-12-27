// Shared Goals Page
export const goalsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relationship Goals - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .goal-card { transition: all 0.3s ease; }
        .goal-card:hover { transform: translateY(-2px); }
        .progress-bar { transition: width 0.5s ease; }
    </style>
</head>
<body class="min-h-screen p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div class="flex items-center">
                <a href="/portal" class="mr-4 text-gray-600 hover:text-pink-600 transition">
                    <i class="fas fa-arrow-left text-xl"></i>
                </a>
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Relationship Goals</h1>
                    <p class="text-gray-600">Work together toward your dreams</p>
                </div>
            </div>
            <button onclick="showAddGoal()" class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-pink-700 hover:to-purple-700 transition shadow-lg">
                <i class="fas fa-plus mr-2"></i>New Goal
            </button>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-pink-600" id="activeGoals">0</div>
                <div class="text-sm text-gray-600">Active Goals</div>
            </div>
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-green-600" id="completedGoals">0</div>
                <div class="text-sm text-gray-600">Completed</div>
            </div>
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-purple-600" id="avgProgress">0%</div>
                <div class="text-sm text-gray-600">Avg Progress</div>
            </div>
        </div>

        <!-- Goals Categories -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button onclick="filterGoals('all')" class="category-btn px-4 py-2 rounded-full text-sm font-medium bg-pink-600 text-white whitespace-nowrap" data-category="all">
                All Goals
            </button>
            <button onclick="filterGoals('relationship')" class="category-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap" data-category="relationship">
                Relationship
            </button>
            <button onclick="filterGoals('financial')" class="category-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap" data-category="financial">
                Financial
            </button>
            <button onclick="filterGoals('health')" class="category-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap" data-category="health">
                Health
            </button>
            <button onclick="filterGoals('travel')" class="category-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap" data-category="travel">
                Travel
            </button>
            <button onclick="filterGoals('personal')" class="category-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 whitespace-nowrap" data-category="personal">
                Personal Growth
            </button>
        </div>

        <!-- Goals List -->
        <div id="goalsList" class="space-y-4">
            <div class="text-center py-8 text-gray-500">Loading goals...</div>
        </div>

        <!-- Empty State -->
        <div id="emptyState" class="hidden glass-card rounded-2xl p-8 text-center shadow-lg">
            <div class="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-bullseye text-pink-500 text-3xl"></i>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">No Goals Yet</h3>
            <p class="text-gray-600 mb-4">Start setting goals to work on together as a couple!</p>
            <button onclick="showAddGoal()" class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium">
                Create Your First Goal
            </button>
        </div>
    </div>

    <!-- Add/Edit Goal Modal -->
    <div id="goalModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900" id="modalTitle">New Goal</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form id="goalForm" onsubmit="saveGoal(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                    <input type="text" id="goalTitle" required placeholder="e.g., Save for vacation"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea id="goalDescription" rows="3" placeholder="Describe your goal..."
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select id="goalCategory" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <option value="relationship">Relationship</option>
                        <option value="financial">Financial</option>
                        <option value="health">Health & Wellness</option>
                        <option value="travel">Travel</option>
                        <option value="personal">Personal Growth</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                        <input type="date" id="goalTargetDate"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                        <select id="goalPriority" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                            <option value="low">Low</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <button type="submit" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition">
                    <i class="fas fa-save mr-2"></i>Save Goal
                </button>
            </form>
        </div>
    </div>

    <script>
        let relationshipId = null;
        let goals = [];
        let currentFilter = 'all';
        let editingGoalId = null;

        const categoryIcons = {
            relationship: 'fa-heart',
            financial: 'fa-piggy-bank',
            health: 'fa-heartbeat',
            travel: 'fa-plane',
            personal: 'fa-user-graduate',
            other: 'fa-flag'
        };

        const categoryColors = {
            relationship: 'from-pink-500 to-rose-500',
            financial: 'from-green-500 to-emerald-500',
            health: 'from-blue-500 to-cyan-500',
            travel: 'from-purple-500 to-indigo-500',
            personal: 'from-amber-500 to-orange-500',
            other: 'from-gray-500 to-slate-500'
        };

        async function init() {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                window.location.href = '/login';
                return;
            }

            try {
                const relResponse = await fetch('/api/relationships/user/' + userId);
                if (relResponse.ok) {
                    const relData = await relResponse.json();
                    if (relData.hasPartner) {
                        relationshipId = relData.relationship.id;
                        await loadGoals();
                    } else {
                        window.location.href = '/partner-invite';
                    }
                }
            } catch (error) {
                console.error('Init error:', error);
            }
        }

        async function loadGoals() {
            if (!relationshipId) return;

            try {
                const response = await fetch('/api/goals/' + relationshipId);
                if (response.ok) {
                    const data = await response.json();
                    goals = data.goals || [];
                    updateStats();
                    renderGoals();
                }
            } catch (error) {
                console.error('Load error:', error);
            }
        }

        function updateStats() {
            const active = goals.filter(g => g.status !== 'completed').length;
            const completed = goals.filter(g => g.status === 'completed').length;
            const avgProgress = goals.length > 0
                ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
                : 0;

            document.getElementById('activeGoals').textContent = active;
            document.getElementById('completedGoals').textContent = completed;
            document.getElementById('avgProgress').textContent = avgProgress + '%';
        }

        function renderGoals() {
            const filtered = currentFilter === 'all'
                ? goals
                : goals.filter(g => g.category === currentFilter);

            const container = document.getElementById('goalsList');
            const emptyState = document.getElementById('emptyState');

            if (filtered.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');
            container.innerHTML = filtered.map(goal => \`
                <div class="goal-card glass-card rounded-xl p-5 shadow-lg" data-id="\${goal.id}">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-gradient-to-r \${categoryColors[goal.category] || categoryColors.other} rounded-xl flex items-center justify-center flex-shrink-0">
                            <i class="fas \${categoryIcons[goal.category] || categoryIcons.other} text-white"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h3 class="font-semibold text-gray-900">\${goal.title}</h3>
                                    <p class="text-sm text-gray-600">\${goal.description || ''}</p>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editGoal('\${goal.id}')" class="text-gray-400 hover:text-pink-600">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteGoal('\${goal.id}')" class="text-gray-400 hover:text-red-600">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- Progress Bar -->
                            <div class="mb-3">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-gray-600">Progress</span>
                                    <span class="font-medium text-gray-900">\${goal.progress || 0}%</span>
                                </div>
                                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div class="progress-bar h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                                        style="width: \${goal.progress || 0}%"></div>
                                </div>
                            </div>

                            <!-- Meta Info -->
                            <div class="flex items-center gap-4 text-sm text-gray-500">
                                \${goal.target_date ? \`<span><i class="fas fa-calendar mr-1"></i>\${new Date(goal.target_date).toLocaleDateString()}</span>\` : ''}
                                <span class="px-2 py-0.5 bg-gray-100 rounded-full capitalize">\${goal.priority || 'medium'} priority</span>
                            </div>

                            <!-- Progress Update -->
                            <div class="mt-4 pt-4 border-t flex items-center gap-2">
                                <input type="range" min="0" max="100" value="\${goal.progress || 0}"
                                    class="flex-1" onchange="updateProgress('\${goal.id}', this.value)">
                                <button onclick="markComplete('\${goal.id}')"
                                    class="\${goal.progress >= 100 ? 'bg-green-500' : 'bg-gray-200'} text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition">
                                    <i class="fas fa-check mr-1"></i>Complete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        function filterGoals(category) {
            currentFilter = category;
            document.querySelectorAll('.category-btn').forEach(btn => {
                if (btn.dataset.category === category) {
                    btn.classList.remove('bg-gray-200', 'text-gray-700');
                    btn.classList.add('bg-pink-600', 'text-white');
                } else {
                    btn.classList.remove('bg-pink-600', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                }
            });
            renderGoals();
        }

        function showAddGoal() {
            editingGoalId = null;
            document.getElementById('modalTitle').textContent = 'New Goal';
            document.getElementById('goalForm').reset();
            document.getElementById('goalModal').classList.remove('hidden');
        }

        function editGoal(goalId) {
            const goal = goals.find(g => g.id === goalId);
            if (!goal) return;

            editingGoalId = goalId;
            document.getElementById('modalTitle').textContent = 'Edit Goal';
            document.getElementById('goalTitle').value = goal.title;
            document.getElementById('goalDescription').value = goal.description || '';
            document.getElementById('goalCategory').value = goal.category || 'other';
            document.getElementById('goalTargetDate').value = goal.target_date ? goal.target_date.split('T')[0] : '';
            document.getElementById('goalPriority').value = goal.priority || 'medium';
            document.getElementById('goalModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('goalModal').classList.add('hidden');
            editingGoalId = null;
        }

        async function saveGoal(e) {
            e.preventDefault();

            const data = {
                relationship_id: relationshipId,
                title: document.getElementById('goalTitle').value,
                description: document.getElementById('goalDescription').value,
                category: document.getElementById('goalCategory').value,
                target_date: document.getElementById('goalTargetDate').value || null,
                priority: document.getElementById('goalPriority').value
            };

            try {
                const url = editingGoalId ? '/api/goals/' + editingGoalId : '/api/goals';
                const method = editingGoalId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    closeModal();
                    await loadGoals();
                } else {
                    throw new Error('Failed to save goal');
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Failed to save goal');
            }
        }

        async function updateProgress(goalId, progress) {
            try {
                await fetch('/api/goals/' + goalId + '/progress', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ progress: parseInt(progress) })
                });
                await loadGoals();
            } catch (error) {
                console.error('Update error:', error);
            }
        }

        async function markComplete(goalId) {
            await updateProgress(goalId, 100);
        }

        async function deleteGoal(goalId) {
            if (!confirm('Are you sure you want to delete this goal?')) return;

            try {
                const response = await fetch('/api/goals/' + goalId, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    await loadGoals();
                }
            } catch (error) {
                console.error('Delete error:', error);
            }
        }

        init();
    </script>
</body>
</html>`;
