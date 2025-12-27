// Activities & Date Planning Page
export const activitiesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activities - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .activity-card { transition: all 0.3s ease; }
        .activity-card:hover { transform: translateY(-2px); }
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
                    <h1 class="text-2xl font-bold text-gray-900">Activities & Dates</h1>
                    <p class="text-gray-600">Plan quality time together</p>
                </div>
            </div>
            <button onclick="showAddActivity()" class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-pink-700 hover:to-purple-700 transition shadow-lg">
                <i class="fas fa-plus mr-2"></i>Plan Activity
            </button>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-pink-600" id="upcomingCount">0</div>
                <div class="text-sm text-gray-600">Upcoming</div>
            </div>
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-green-600" id="completedCount">0</div>
                <div class="text-sm text-gray-600">Completed</div>
            </div>
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-purple-600" id="thisMonth">0</div>
                <div class="text-sm text-gray-600">This Month</div>
            </div>
            <div class="glass-card rounded-xl p-4 text-center shadow-lg">
                <div class="text-2xl font-bold text-amber-600" id="dateNights">0</div>
                <div class="text-sm text-gray-600">Date Nights</div>
            </div>
        </div>

        <!-- Activity Type Filters -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button onclick="filterActivities('all')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-pink-600 text-white whitespace-nowrap" data-filter="all">
                All Activities
            </button>
            <button onclick="filterActivities('date_night')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap" data-filter="date_night">
                <i class="fas fa-heart mr-1"></i>Date Nights
            </button>
            <button onclick="filterActivities('adventure')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap" data-filter="adventure">
                <i class="fas fa-hiking mr-1"></i>Adventures
            </button>
            <button onclick="filterActivities('relaxation')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap" data-filter="relaxation">
                <i class="fas fa-spa mr-1"></i>Relaxation
            </button>
            <button onclick="filterActivities('learning')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap" data-filter="learning">
                <i class="fas fa-book mr-1"></i>Learning
            </button>
        </div>

        <!-- View Toggle -->
        <div class="flex justify-between items-center mb-6">
            <div class="text-sm text-gray-600">
                <span id="activityCountLabel">0 activities</span>
            </div>
            <div class="flex gap-2">
                <button onclick="setView('list')" id="listViewBtn" class="p-2 rounded-lg bg-pink-100 text-pink-600">
                    <i class="fas fa-list"></i>
                </button>
                <button onclick="setView('calendar')" id="calendarViewBtn" class="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <i class="fas fa-calendar"></i>
                </button>
            </div>
        </div>

        <!-- Activities List -->
        <div id="activitiesList" class="space-y-4">
            <div class="text-center py-8 text-gray-500">Loading activities...</div>
        </div>

        <!-- Calendar View -->
        <div id="calendarView" class="hidden glass-card rounded-2xl p-6 shadow-lg">
            <div class="text-center text-gray-500">Calendar view coming soon...</div>
        </div>

        <!-- Empty State -->
        <div id="emptyState" class="hidden glass-card rounded-2xl p-8 text-center shadow-lg">
            <div class="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-calendar-plus text-pink-500 text-3xl"></i>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">No Activities Planned</h3>
            <p class="text-gray-600 mb-4">Start planning fun activities and date nights together!</p>
            <button onclick="showAddActivity()" class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium">
                Plan Your First Activity
            </button>
        </div>

        <!-- AI Suggestions -->
        <div class="mt-8 glass-card rounded-2xl p-6 shadow-lg">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                Activity Ideas
            </h2>
            <div class="grid md:grid-cols-3 gap-4" id="suggestions">
                <div class="p-4 bg-pink-50 rounded-xl cursor-pointer hover:bg-pink-100 transition" onclick="quickAdd('Romantic dinner at home')">
                    <div class="text-2xl mb-2">🍽️</div>
                    <div class="font-medium text-gray-900">Romantic Dinner</div>
                    <div class="text-sm text-gray-600">Cook a special meal together</div>
                </div>
                <div class="p-4 bg-purple-50 rounded-xl cursor-pointer hover:bg-purple-100 transition" onclick="quickAdd('Movie night with popcorn')">
                    <div class="text-2xl mb-2">🎬</div>
                    <div class="font-medium text-gray-900">Movie Night</div>
                    <div class="text-sm text-gray-600">Cozy up and watch a film</div>
                </div>
                <div class="p-4 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition" onclick="quickAdd('Nature walk or hike')">
                    <div class="text-2xl mb-2">🌿</div>
                    <div class="font-medium text-gray-900">Nature Walk</div>
                    <div class="text-sm text-gray-600">Explore outdoors together</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Activity Modal -->
    <div id="activityModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900" id="modalTitle">Plan Activity</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form id="activityForm" onsubmit="saveActivity(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Activity Name</label>
                    <input type="text" id="activityName" required placeholder="e.g., Sunset picnic"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea id="activityDescription" rows="2" placeholder="What will you do?"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select id="activityType" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <option value="date_night">Date Night</option>
                        <option value="adventure">Adventure</option>
                        <option value="relaxation">Relaxation</option>
                        <option value="learning">Learning</option>
                        <option value="social">Social</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input type="date" id="activityDate"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input type="time" id="activityTime"
                            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    </div>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
                    <input type="text" id="activityLocation" placeholder="Where?"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                </div>

                <div class="mb-6">
                    <label class="flex items-center">
                        <input type="checkbox" id="activityReminder" class="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500">
                        <span class="ml-2 text-sm text-gray-700">Remind us before the activity</span>
                    </label>
                </div>

                <button type="submit" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition">
                    <i class="fas fa-calendar-check mr-2"></i>Save Activity
                </button>
            </form>
        </div>
    </div>

    <script>
        let relationshipId = null;
        let activities = [];
        let currentFilter = 'all';
        let currentView = 'list';
        let editingActivityId = null;

        const typeIcons = {
            date_night: 'fa-heart',
            adventure: 'fa-hiking',
            relaxation: 'fa-spa',
            learning: 'fa-book',
            social: 'fa-users',
            other: 'fa-star'
        };

        const typeColors = {
            date_night: 'from-pink-500 to-rose-500',
            adventure: 'from-green-500 to-emerald-500',
            relaxation: 'from-blue-500 to-cyan-500',
            learning: 'from-purple-500 to-indigo-500',
            social: 'from-amber-500 to-orange-500',
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
                        await loadActivities();
                    } else {
                        window.location.href = '/partner-invite';
                    }
                }
            } catch (error) {
                console.error('Init error:', error);
            }
        }

        async function loadActivities() {
            if (!relationshipId) return;

            try {
                const response = await fetch('/api/activities/' + relationshipId);
                if (response.ok) {
                    const data = await response.json();
                    activities = data.activities || [];
                    updateStats();
                    renderActivities();
                }
            } catch (error) {
                console.error('Load error:', error);
            }
        }

        function updateStats() {
            const now = new Date();
            const upcoming = activities.filter(a => new Date(a.scheduled_date) >= now && a.status !== 'completed').length;
            const completed = activities.filter(a => a.status === 'completed').length;
            const thisMonth = activities.filter(a => {
                const date = new Date(a.scheduled_date);
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length;
            const dateNights = activities.filter(a => a.activity_type === 'date_night').length;

            document.getElementById('upcomingCount').textContent = upcoming;
            document.getElementById('completedCount').textContent = completed;
            document.getElementById('thisMonth').textContent = thisMonth;
            document.getElementById('dateNights').textContent = dateNights;
        }

        function renderActivities() {
            const filtered = currentFilter === 'all'
                ? activities
                : activities.filter(a => a.activity_type === currentFilter);

            const container = document.getElementById('activitiesList');
            const emptyState = document.getElementById('emptyState');

            document.getElementById('activityCountLabel').textContent = filtered.length + ' activities';

            if (filtered.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');

            // Sort by date
            filtered.sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date));

            container.innerHTML = filtered.map(activity => {
                const date = activity.scheduled_date ? new Date(activity.scheduled_date) : null;
                const isPast = date && date < new Date();
                const isCompleted = activity.status === 'completed';

                return \`
                <div class="activity-card glass-card rounded-xl p-5 shadow-lg \${isCompleted ? 'opacity-75' : ''}" data-id="\${activity.id}">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 bg-gradient-to-r \${typeColors[activity.activity_type] || typeColors.other} rounded-xl flex items-center justify-center flex-shrink-0">
                            <i class="fas \${typeIcons[activity.activity_type] || typeIcons.other} text-white"></i>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h3 class="font-semibold text-gray-900 \${isCompleted ? 'line-through' : ''}">\${activity.name}</h3>
                                    <p class="text-sm text-gray-600">\${activity.description || ''}</p>
                                </div>
                                <div class="flex gap-2">
                                    \${!isCompleted ? \`
                                        <button onclick="completeActivity('\${activity.id}')" class="text-green-500 hover:text-green-600" title="Mark Complete">
                                            <i class="fas fa-check-circle"></i>
                                        </button>
                                    \` : ''}
                                    <button onclick="editActivity('\${activity.id}')" class="text-gray-400 hover:text-pink-600">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteActivity('\${activity.id}')" class="text-gray-400 hover:text-red-600">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>

                            <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                \${date ? \`
                                    <span class="\${isPast && !isCompleted ? 'text-red-500' : ''}">
                                        <i class="fas fa-calendar mr-1"></i>
                                        \${date.toLocaleDateString()}
                                        \${activity.scheduled_time ? ' at ' + activity.scheduled_time : ''}
                                    </span>
                                \` : ''}
                                \${activity.location ? \`
                                    <span><i class="fas fa-map-marker-alt mr-1"></i>\${activity.location}</span>
                                \` : ''}
                                <span class="px-2 py-0.5 bg-gray-100 rounded-full capitalize">\${activity.activity_type?.replace('_', ' ') || 'Activity'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            \`}).join('');
        }

        function filterActivities(filter) {
            currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(btn => {
                if (btn.dataset.filter === filter) {
                    btn.classList.remove('bg-gray-200', 'text-gray-700');
                    btn.classList.add('bg-pink-600', 'text-white');
                } else {
                    btn.classList.remove('bg-pink-600', 'text-white');
                    btn.classList.add('bg-gray-200', 'text-gray-700');
                }
            });
            renderActivities();
        }

        function setView(view) {
            currentView = view;
            document.getElementById('activitiesList').classList.toggle('hidden', view !== 'list');
            document.getElementById('calendarView').classList.toggle('hidden', view !== 'calendar');
            document.getElementById('listViewBtn').classList.toggle('bg-pink-100', view === 'list');
            document.getElementById('listViewBtn').classList.toggle('text-pink-600', view === 'list');
            document.getElementById('calendarViewBtn').classList.toggle('bg-pink-100', view === 'calendar');
            document.getElementById('calendarViewBtn').classList.toggle('text-pink-600', view === 'calendar');
        }

        function showAddActivity() {
            editingActivityId = null;
            document.getElementById('modalTitle').textContent = 'Plan Activity';
            document.getElementById('activityForm').reset();
            document.getElementById('activityModal').classList.remove('hidden');
        }

        function quickAdd(name) {
            document.getElementById('activityName').value = name;
            document.getElementById('activityType').value = 'date_night';
            document.getElementById('activityModal').classList.remove('hidden');
        }

        function editActivity(activityId) {
            const activity = activities.find(a => a.id === activityId);
            if (!activity) return;

            editingActivityId = activityId;
            document.getElementById('modalTitle').textContent = 'Edit Activity';
            document.getElementById('activityName').value = activity.name;
            document.getElementById('activityDescription').value = activity.description || '';
            document.getElementById('activityType').value = activity.activity_type || 'other';
            document.getElementById('activityDate').value = activity.scheduled_date ? activity.scheduled_date.split('T')[0] : '';
            document.getElementById('activityTime').value = activity.scheduled_time || '';
            document.getElementById('activityLocation').value = activity.location || '';
            document.getElementById('activityModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('activityModal').classList.add('hidden');
            editingActivityId = null;
        }

        async function saveActivity(e) {
            e.preventDefault();

            const data = {
                relationship_id: relationshipId,
                name: document.getElementById('activityName').value,
                description: document.getElementById('activityDescription').value,
                activity_type: document.getElementById('activityType').value,
                scheduled_date: document.getElementById('activityDate').value || null,
                scheduled_time: document.getElementById('activityTime').value || null,
                location: document.getElementById('activityLocation').value
            };

            try {
                const url = editingActivityId ? '/api/activities/' + editingActivityId : '/api/activities';
                const method = editingActivityId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    closeModal();
                    await loadActivities();
                } else {
                    throw new Error('Failed to save');
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Failed to save activity');
            }
        }

        async function completeActivity(activityId) {
            try {
                await fetch('/api/activities/' + activityId + '/complete', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                });
                await loadActivities();
            } catch (error) {
                console.error('Complete error:', error);
            }
        }

        async function deleteActivity(activityId) {
            if (!confirm('Are you sure you want to delete this activity?')) return;

            try {
                await fetch('/api/activities/' + activityId, { method: 'DELETE' });
                await loadActivities();
            } catch (error) {
                console.error('Delete error:', error);
            }
        }

        init();
    </script>
</body>
</html>`;
