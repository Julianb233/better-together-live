// Important Dates Page
export const importantDatesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Important Dates - Better Together</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #f5f3ff 100%); }
        .glass-card { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); }
        .date-card { transition: all 0.3s ease; }
        .date-card:hover { transform: translateY(-2px); }
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
                    <h1 class="text-2xl font-bold text-gray-900">Important Dates</h1>
                    <p class="text-gray-600">Never forget a special moment</p>
                </div>
            </div>
            <button onclick="showAddDate()" class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-pink-700 hover:to-purple-700 transition shadow-lg">
                <i class="fas fa-plus mr-2"></i>Add Date
            </button>
        </div>

        <!-- Upcoming Dates Highlight -->
        <div id="upcomingHighlight" class="hidden mb-8">
            <div class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-sm opacity-90 mb-1">Coming Up</div>
                        <h2 class="text-2xl font-bold" id="upcomingName">-</h2>
                        <p class="opacity-90" id="upcomingDate">-</p>
                    </div>
                    <div class="text-right">
                        <div class="text-4xl font-bold" id="upcomingDays">0</div>
                        <div class="text-sm opacity-90">days away</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Categories Filter -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
            <button onclick="filterDates('all')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-pink-600 text-white whitespace-nowrap" data-filter="all">
                All Dates
            </button>
            <button onclick="filterDates('anniversary')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap" data-filter="anniversary">
                <i class="fas fa-heart mr-1"></i>Anniversary
            </button>
            <button onclick="filterDates('birthday')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap" data-filter="birthday">
                <i class="fas fa-birthday-cake mr-1"></i>Birthday
            </button>
            <button onclick="filterDates('first')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap" data-filter="first">
                <i class="fas fa-star mr-1"></i>First Time
            </button>
            <button onclick="filterDates('other')" class="filter-btn px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 whitespace-nowrap" data-filter="other">
                <i class="fas fa-calendar mr-1"></i>Other
            </button>
        </div>

        <!-- Dates Timeline -->
        <div id="datesList" class="space-y-4">
            <div class="text-center py-8 text-gray-500">Loading dates...</div>
        </div>

        <!-- Empty State -->
        <div id="emptyState" class="hidden glass-card rounded-2xl p-8 text-center shadow-lg">
            <div class="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-calendar-heart text-pink-500 text-3xl"></i>
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">No Important Dates Yet</h3>
            <p class="text-gray-600 mb-4">Add anniversaries, birthdays, and special moments to remember!</p>
            <button onclick="showAddDate()" class="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium">
                Add Your First Date
            </button>
        </div>

        <!-- Tips -->
        <div class="mt-8 glass-card rounded-2xl p-6 shadow-lg">
            <h2 class="font-semibold text-gray-900 mb-4">
                <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                Date Ideas to Track
            </h2>
            <div class="grid md:grid-cols-2 gap-4">
                <div class="flex items-center p-3 bg-pink-50 rounded-xl">
                    <span class="text-2xl mr-3">💕</span>
                    <div>
                        <div class="font-medium text-gray-900">Anniversary</div>
                        <div class="text-sm text-gray-600">When you started dating</div>
                    </div>
                </div>
                <div class="flex items-center p-3 bg-purple-50 rounded-xl">
                    <span class="text-2xl mr-3">💋</span>
                    <div>
                        <div class="font-medium text-gray-900">First Kiss</div>
                        <div class="text-sm text-gray-600">That magical moment</div>
                    </div>
                </div>
                <div class="flex items-center p-3 bg-blue-50 rounded-xl">
                    <span class="text-2xl mr-3">🏠</span>
                    <div>
                        <div class="font-medium text-gray-900">Moving In Together</div>
                        <div class="text-sm text-gray-600">Starting your home</div>
                    </div>
                </div>
                <div class="flex items-center p-3 bg-green-50 rounded-xl">
                    <span class="text-2xl mr-3">✈️</span>
                    <div>
                        <div class="font-medium text-gray-900">First Trip Together</div>
                        <div class="text-sm text-gray-600">Adventure awaits</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add/Edit Date Modal -->
    <div id="dateModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-900" id="modalTitle">Add Important Date</h2>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>

            <form id="dateForm" onsubmit="saveDate(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">What are we celebrating?</label>
                    <input type="text" id="dateName" required placeholder="e.g., Our First Date"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input type="date" id="dateValue" required
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select id="dateCategory" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                        <option value="anniversary">Anniversary</option>
                        <option value="birthday">Birthday</option>
                        <option value="first">First Time</option>
                        <option value="milestone">Milestone</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                    <textarea id="dateNotes" rows="2" placeholder="Any special memories..."
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"></textarea>
                </div>

                <div class="mb-6">
                    <label class="flex items-center">
                        <input type="checkbox" id="dateRecurring" checked class="w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500">
                        <span class="ml-2 text-sm text-gray-700">Remind us every year</span>
                    </label>
                </div>

                <button type="submit" class="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition">
                    <i class="fas fa-save mr-2"></i>Save Date
                </button>
            </form>
        </div>
    </div>

    <script>
        let relationshipId = null;
        let dates = [];
        let currentFilter = 'all';
        let editingDateId = null;

        const categoryIcons = {
            anniversary: 'fa-heart',
            birthday: 'fa-birthday-cake',
            first: 'fa-star',
            milestone: 'fa-trophy',
            other: 'fa-calendar'
        };

        const categoryColors = {
            anniversary: 'from-pink-500 to-rose-500',
            birthday: 'from-purple-500 to-indigo-500',
            first: 'from-amber-500 to-orange-500',
            milestone: 'from-green-500 to-emerald-500',
            other: 'from-blue-500 to-cyan-500'
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
                        await loadDates();
                    } else {
                        window.location.href = '/partner-invite';
                    }
                }
            } catch (error) {
                console.error('Init error:', error);
            }
        }

        async function loadDates() {
            if (!relationshipId) return;

            try {
                const response = await fetch('/api/important-dates/' + relationshipId);
                if (response.ok) {
                    const data = await response.json();
                    dates = data.dates || [];
                    updateUpcoming();
                    renderDates();
                }
            } catch (error) {
                console.error('Load error:', error);
            }
        }

        function updateUpcoming() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Find next upcoming date (considering recurring)
            let nextDate = null;
            let daysAway = Infinity;

            dates.forEach(d => {
                const date = new Date(d.date_value);
                // For recurring dates, check this year and next year
                for (let yearOffset = 0; yearOffset <= 1; yearOffset++) {
                    const checkDate = new Date(date);
                    checkDate.setFullYear(today.getFullYear() + yearOffset);
                    checkDate.setHours(0, 0, 0, 0);

                    if (checkDate >= today) {
                        const diff = Math.ceil((checkDate - today) / (1000 * 60 * 60 * 24));
                        if (diff < daysAway) {
                            daysAway = diff;
                            nextDate = { ...d, nextOccurrence: checkDate };
                        }
                    }
                }
            });

            const highlight = document.getElementById('upcomingHighlight');
            if (nextDate && daysAway <= 30) {
                highlight.classList.remove('hidden');
                document.getElementById('upcomingName').textContent = nextDate.name;
                document.getElementById('upcomingDate').textContent = nextDate.nextOccurrence.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                document.getElementById('upcomingDays').textContent = daysAway === 0 ? 'Today!' : daysAway;
            } else {
                highlight.classList.add('hidden');
            }
        }

        function renderDates() {
            const filtered = currentFilter === 'all'
                ? dates
                : dates.filter(d => d.category === currentFilter);

            const container = document.getElementById('datesList');
            const emptyState = document.getElementById('emptyState');

            if (filtered.length === 0) {
                container.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }

            emptyState.classList.add('hidden');

            // Sort by month/day for timeline view
            filtered.sort((a, b) => {
                const dateA = new Date(a.date_value);
                const dateB = new Date(b.date_value);
                return (dateA.getMonth() * 31 + dateA.getDate()) - (dateB.getMonth() * 31 + dateB.getDate());
            });

            container.innerHTML = filtered.map(date => {
                const d = new Date(date.date_value);
                const today = new Date();
                const thisYearDate = new Date(d);
                thisYearDate.setFullYear(today.getFullYear());
                if (thisYearDate < today) thisYearDate.setFullYear(today.getFullYear() + 1);
                const daysUntil = Math.ceil((thisYearDate - today) / (1000 * 60 * 60 * 24));
                const yearsAgo = today.getFullYear() - d.getFullYear();

                return \`
                <div class="date-card glass-card rounded-xl p-5 shadow-lg" data-id="\${date.id}">
                    <div class="flex items-start gap-4">
                        <div class="w-14 h-14 bg-gradient-to-r \${categoryColors[date.category] || categoryColors.other} rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white">
                            <div class="text-xs font-medium">\${d.toLocaleDateString('en-US', { month: 'short' })}</div>
                            <div class="text-lg font-bold">\${d.getDate()}</div>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-1">
                                <div>
                                    <h3 class="font-semibold text-gray-900">\${date.name}</h3>
                                    <p class="text-sm text-gray-600">\${d.getFullYear()} • \${yearsAgo > 0 ? yearsAgo + ' year' + (yearsAgo > 1 ? 's' : '') + ' ago' : 'This year'}</p>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="editDate('\${date.id}')" class="text-gray-400 hover:text-pink-600">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button onclick="deleteDate('\${date.id}')" class="text-gray-400 hover:text-red-600">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            \${date.notes ? \`<p class="text-sm text-gray-500 mt-2">\${date.notes}</p>\` : ''}
                            <div class="flex items-center gap-3 mt-3 text-sm">
                                <span class="px-2 py-1 bg-\${date.category === 'anniversary' ? 'pink' : date.category === 'birthday' ? 'purple' : 'gray'}-100 text-\${date.category === 'anniversary' ? 'pink' : date.category === 'birthday' ? 'purple' : 'gray'}-700 rounded-full capitalize">
                                    <i class="fas \${categoryIcons[date.category] || categoryIcons.other} mr-1"></i>
                                    \${date.category}
                                </span>
                                \${daysUntil <= 30 ? \`<span class="text-pink-600 font-medium">\${daysUntil === 0 ? 'Today!' : 'In ' + daysUntil + ' days'}</span>\` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            \`}).join('');
        }

        function filterDates(filter) {
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
            renderDates();
        }

        function showAddDate() {
            editingDateId = null;
            document.getElementById('modalTitle').textContent = 'Add Important Date';
            document.getElementById('dateForm').reset();
            document.getElementById('dateModal').classList.remove('hidden');
        }

        function editDate(dateId) {
            const date = dates.find(d => d.id === dateId);
            if (!date) return;

            editingDateId = dateId;
            document.getElementById('modalTitle').textContent = 'Edit Date';
            document.getElementById('dateName').value = date.name;
            document.getElementById('dateValue').value = date.date_value.split('T')[0];
            document.getElementById('dateCategory').value = date.category || 'other';
            document.getElementById('dateNotes').value = date.notes || '';
            document.getElementById('dateRecurring').checked = date.is_recurring !== false;
            document.getElementById('dateModal').classList.remove('hidden');
        }

        function closeModal() {
            document.getElementById('dateModal').classList.add('hidden');
            editingDateId = null;
        }

        async function saveDate(e) {
            e.preventDefault();

            const data = {
                relationship_id: relationshipId,
                name: document.getElementById('dateName').value,
                date_value: document.getElementById('dateValue').value,
                category: document.getElementById('dateCategory').value,
                notes: document.getElementById('dateNotes').value,
                is_recurring: document.getElementById('dateRecurring').checked
            };

            try {
                const url = editingDateId ? '/api/important-dates/' + editingDateId : '/api/important-dates';
                const method = editingDateId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    closeModal();
                    await loadDates();
                } else {
                    throw new Error('Failed to save');
                }
            } catch (error) {
                console.error('Save error:', error);
                alert('Failed to save date');
            }
        }

        async function deleteDate(dateId) {
            if (!confirm('Are you sure you want to delete this date?')) return;

            try {
                await fetch('/api/important-dates/' + dateId, { method: 'DELETE' });
                await loadDates();
            } catch (error) {
                console.error('Delete error:', error);
            }
        }

        init();
    </script>
</body>
</html>`;
