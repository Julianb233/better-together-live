// Discover Venues - Couples browse sponsored venues and offers
import { navigationHtml } from '../components/navigation.js'

export const discoverVenuesHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discover Date Experiences | Better Together</title>
    <meta name="description" content="Find the perfect date night. Browse exclusive couple deals from restaurants, hotels, spas, cruises, and more.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: { 50: '#fdf2f8', 100: '#fce7f3', 500: '#ec4899', 600: '#db2777' },
                    },
                    fontFamily: { 'inter': ['Inter', 'sans-serif'] }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .venue-card { transition: transform 0.2s, box-shadow 0.2s; }
        .venue-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    ${navigationHtml}

    <!-- Hero -->
    <div class="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white">
        <div class="max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 class="text-3xl md:text-5xl font-extrabold mb-3">Discover Date Experiences</h1>
            <p class="text-pink-100 text-lg max-w-2xl mx-auto mb-6">Exclusive couple-only deals from restaurants, hotels, spas, cruises, and more.</p>
            <div class="max-w-xl mx-auto relative">
                <input type="text" id="searchInput" placeholder="Search venues, experiences..." class="w-full px-5 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-pink-300 border-0">
                <button onclick="searchVenues()" class="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Category Filters -->
    <div class="bg-white border-b sticky top-0 z-30">
        <div class="max-w-7xl mx-auto px-4 py-3 flex gap-3 overflow-x-auto">
            <button onclick="filterCategory('')" class="cat-btn px-4 py-2 rounded-full bg-pink-500 text-white text-sm font-medium whitespace-nowrap" data-cat="">All</button>
            <button onclick="filterCategory('dining')" class="cat-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap hover:bg-pink-100" data-cat="dining"><i class="fas fa-utensils mr-1"></i> Restaurants</button>
            <button onclick="filterCategory('cruises')" class="cat-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap hover:bg-pink-100" data-cat="cruises"><i class="fas fa-ship mr-1"></i> Cruises</button>
            <button onclick="filterCategory('hotels')" class="cat-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap hover:bg-pink-100" data-cat="hotels"><i class="fas fa-hotel mr-1"></i> Hotels</button>
            <button onclick="filterCategory('spas')" class="cat-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap hover:bg-pink-100" data-cat="spas"><i class="fas fa-spa mr-1"></i> Spas</button>
            <button onclick="filterCategory('events')" class="cat-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap hover:bg-pink-100" data-cat="events"><i class="fas fa-calendar-star mr-1"></i> Events</button>
            <button onclick="filterCategory('vacation_packages')" class="cat-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap hover:bg-pink-100" data-cat="vacation_packages"><i class="fas fa-umbrella-beach mr-1"></i> Vacations</button>
            <button onclick="filterCategory('gifts')" class="cat-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap hover:bg-pink-100" data-cat="gifts"><i class="fas fa-gift mr-1"></i> Gifts</button>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Active Campaigns Banner -->
        <div id="campaigns-banner" class="mb-8 hidden">
            <div id="campaigns-slider" class="flex gap-4 overflow-x-auto pb-2"></div>
        </div>

        <!-- Featured Offers -->
        <div id="featured-section" class="mb-10">
            <h2 class="text-2xl font-bold text-gray-900 mb-4"><i class="fas fa-fire text-pink-500 mr-2"></i>Featured Deals</h2>
            <div id="featured-offers" class="grid md:grid-cols-2 lg:grid-cols-4 gap-4"></div>
        </div>

        <!-- All Venues -->
        <h2 class="text-2xl font-bold text-gray-900 mb-4">All Venues</h2>
        <div id="venues-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="col-span-full text-center py-12">
                <i class="fas fa-spinner fa-spin text-pink-500 text-3xl"></i>
                <p class="text-gray-500 mt-3">Loading venues...</p>
            </div>
        </div>
    </div>

    <script>
        let currentCategory = '';

        function formatCents(cents) { return '$' + (cents / 100).toFixed(0); }

        function renderVenueCard(v) {
            const verified = v.is_verified ? '<span class="text-blue-500 text-xs"><i class="fas fa-check-circle"></i> Verified</span>' : '';
            const tier = v.tier === 'premium' ? '<span class="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">Premium</span>' :
                         v.tier === 'elite' ? '<span class="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full">Elite</span>' : '';
            const img = v.cover_image_url || v.logo_url || 'https://placehold.co/400x200/ec4899/white?text=' + encodeURIComponent(v.name);
            return '<a href="/api/venues/' + v.slug + '" class="venue-card bg-white rounded-xl overflow-hidden border block">' +
                '<div class="h-40 bg-cover bg-center" style="background-image:url(' + img + ')"></div>' +
                '<div class="p-4">' +
                '<div class="flex items-center gap-2 mb-1">' + tier + ' ' + verified + '</div>' +
                '<h3 class="font-semibold text-gray-900">' + v.name + '</h3>' +
                '<p class="text-sm text-gray-500 mt-1">' + (v.city || '') + (v.state ? ', ' + v.state : '') + '</p>' +
                '<div class="flex items-center justify-between mt-3">' +
                '<div class="flex items-center gap-1 text-yellow-500 text-sm">' +
                '<i class="fas fa-star"></i> ' + (v.avg_rating || '0') +
                '<span class="text-gray-400 ml-1">(' + (v.review_count || 0) + ')</span></div>' +
                '<span class="text-gray-400 text-sm">' + (v.price_range || '') + '</span></div></div></a>';
        }

        function renderOfferCard(o) {
            const venue = o.venues || {};
            const savings = o.original_price_cents && o.offer_price_cents ?
                '<span class="text-green-600 text-sm font-medium">Save ' + formatCents(o.original_price_cents - o.offer_price_cents) + '</span>' : '';
            const verified = o.stitch_verified ? '<span class="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"><i class="fas fa-check"></i> Stitch Verified</span>' : '';
            const exclusive = o.couple_exclusive ? '<span class="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded-full"><i class="fas fa-heart"></i> Couples Only</span>' : '';
            return '<div class="bg-white rounded-xl border overflow-hidden venue-card">' +
                '<div class="p-4">' +
                '<div class="flex gap-2 mb-2">' + verified + ' ' + exclusive + '</div>' +
                '<h4 class="font-semibold text-gray-900">' + o.title + '</h4>' +
                '<p class="text-sm text-gray-500 mt-1 line-clamp-2">' + (o.description || '') + '</p>' +
                '<div class="flex items-center justify-between mt-3">' +
                '<div>' + (o.offer_price_cents ? '<span class="text-lg font-bold text-pink-500">' + formatCents(o.offer_price_cents) + '</span>' : '') +
                (o.original_price_cents && o.offer_price_cents ? ' <span class="text-sm text-gray-400 line-through">' + formatCents(o.original_price_cents) + '</span>' : '') + '</div>' +
                savings + '</div>' +
                '<p class="text-xs text-gray-400 mt-2"><i class="fas fa-store mr-1"></i>' + (venue.name || '') + '</p>' +
                '</div></div>';
        }

        async function loadFeatured() {
            try {
                const res = await fetch('/api/venues/discover/featured');
                const data = await res.json();
                if (!res.ok) return;

                // Featured offers
                const container = document.getElementById('featured-offers');
                if (data.sponsoredOffers && data.sponsoredOffers.length > 0) {
                    container.innerHTML = data.sponsoredOffers.map(renderOfferCard).join('');
                } else {
                    document.getElementById('featured-section').classList.add('hidden');
                }

                // Campaigns
                if (data.activeCampaigns && data.activeCampaigns.length > 0) {
                    document.getElementById('campaigns-banner').classList.remove('hidden');
                    document.getElementById('campaigns-slider').innerHTML = data.activeCampaigns.map(c => {
                        return '<div class="flex-shrink-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl p-5 min-w-[300px]">' +
                            '<p class="text-sm text-pink-200">' + c.campaign_type + '</p>' +
                            '<h3 class="font-bold text-lg">' + (c.sponsor_branding || c.campaign_name) + '</h3>' +
                            '<p class="text-sm text-pink-100 mt-1">' + (c.description || '') + '</p></div>';
                    }).join('');
                }
            } catch (err) { console.error(err); }
        }

        async function loadVenues(category, search) {
            try {
                let url = '/api/venues?sort=featured&limit=30';
                if (category) url += '&category=' + category;
                if (search) url += '&q=' + encodeURIComponent(search);
                const res = await fetch(url);
                const data = await res.json();
                if (!res.ok) return;

                const grid = document.getElementById('venues-grid');
                if (data.venues && data.venues.length > 0) {
                    grid.innerHTML = data.venues.map(renderVenueCard).join('');
                } else {
                    grid.innerHTML = '<div class="col-span-full text-center py-12"><i class="fas fa-search text-gray-300 text-4xl mb-3"></i><p class="text-gray-500">No venues found. Try a different category or search.</p></div>';
                }
            } catch (err) {
                console.error(err);
            }
        }

        function filterCategory(cat) {
            currentCategory = cat;
            document.querySelectorAll('.cat-btn').forEach(btn => {
                if (btn.dataset.cat === cat) {
                    btn.className = 'cat-btn px-4 py-2 rounded-full bg-pink-500 text-white text-sm font-medium whitespace-nowrap';
                } else {
                    btn.className = 'cat-btn px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm whitespace-nowrap hover:bg-pink-100';
                }
            });
            loadVenues(cat, document.getElementById('searchInput').value);
        }

        function searchVenues() {
            loadVenues(currentCategory, document.getElementById('searchInput').value);
        }

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchVenues();
        });

        // Init
        loadFeatured();
        loadVenues('', '');
    </script>
</body>
</html>`
