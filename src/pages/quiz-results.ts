// Quiz Results Page
// Displays Connection Compass results with visualizations and recommendations

export function renderQuizResultsPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Connection Compass | Better Together</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .fade-in-up { animation: fadeInUp 0.6s ease-out; }
    .slide-in { animation: slideInRight 0.6s ease-out; }
    .style-card { transition: all 0.3s ease; }
    .style-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
  </style>
</head>
<body class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">

  <!-- Loading Screen -->
  <div id="loading-screen" class="container mx-auto px-4 py-12 text-center">
    <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
    <p class="text-gray-600">Loading your results...</p>
  </div>

  <!-- Results Container -->
  <div id="results-container" class="hidden">

    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <div class="text-6xl mb-4 animate-bounce">🧭</div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Your Connection Compass</h1>
        <p class="text-xl opacity-90 mb-8">Understanding how you give and receive love</p>
        <div class="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4">
          <div class="text-sm uppercase tracking-wide mb-1">Your Top Connection Styles</div>
          <div class="text-3xl font-bold">
            <span id="primary-style-name"></span> + <span id="secondary-style-name"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12 max-w-6xl">

      <!-- Primary & Secondary Styles -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

        <!-- Primary Style -->
        <div class="fade-in-up style-card bg-white rounded-3xl shadow-xl p-8">
          <div class="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            PRIMARY STYLE
          </div>
          <div class="flex items-center gap-4 mb-4">
            <div class="text-5xl" id="primary-emoji"></div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900" id="primary-name"></h3>
              <div class="text-3xl font-bold text-indigo-600" id="primary-percentage"></div>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed mb-6" id="primary-description"></p>
          <div class="bg-indigo-50 rounded-xl p-4">
            <div class="font-semibold text-gray-900 mb-2">How to speak this language:</div>
            <ul class="space-y-2 text-sm text-gray-700" id="primary-tips"></ul>
          </div>
        </div>

        <!-- Secondary Style -->
        <div class="slide-in style-card bg-white rounded-3xl shadow-xl p-8">
          <div class="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            SECONDARY STYLE
          </div>
          <div class="flex items-center gap-4 mb-4">
            <div class="text-5xl" id="secondary-emoji"></div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900" id="secondary-name"></h3>
              <div class="text-3xl font-bold text-purple-600" id="secondary-percentage"></div>
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed mb-6" id="secondary-description"></p>
          <div class="bg-purple-50 rounded-xl p-4">
            <div class="font-semibold text-gray-900 mb-2">How to speak this language:</div>
            <ul class="space-y-2 text-sm text-gray-700" id="secondary-tips"></ul>
          </div>
        </div>
      </div>

      <!-- What This Means -->
      <div class="fade-in-up bg-white rounded-3xl shadow-xl p-8 mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">What This Means For You</h2>
        <div class="prose prose-lg max-w-none">
          <p class="text-gray-700 leading-relaxed text-lg" id="profile-summary"></p>
        </div>
      </div>

      <!-- Full Breakdown Chart -->
      <div class="fade-in-up bg-white rounded-3xl shadow-xl p-8 mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Your Complete Connection Profile</h2>
        <div class="max-w-2xl mx-auto">
          <canvas id="compass-chart"></canvas>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8" id="all-styles-breakdown"></div>
      </div>

      <!-- Action Steps -->
      <div class="fade-in-up bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white mb-12">
        <h2 class="text-3xl font-bold mb-6">Action Steps For Your Partner</h2>
        <p class="text-white/90 mb-6">Share these with your partner so they know how to make you feel most loved:</p>
        <div class="space-y-4" id="action-steps"></div>
      </div>

      <!-- Invite Partner -->
      <div class="fade-in-up bg-white rounded-3xl shadow-xl p-8 mb-12 text-center">
        <div class="text-5xl mb-4">💑</div>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Invite Your Partner</h2>
        <p class="text-gray-600 mb-6 text-lg">
          When your partner completes the Connection Compass, you'll unlock a detailed compatibility report showing how your styles work together!
        </p>
        <button class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all">
          <i class="fas fa-envelope mr-2"></i> Invite Partner to Take Assessment
        </button>
      </div>

      <!-- Share & Continue -->
      <div class="flex flex-col md:flex-row gap-4 justify-center">
        <button onclick="window.print()" class="px-8 py-4 border-2 border-indigo-600 text-indigo-600 rounded-full font-semibold hover:bg-indigo-50 transition-all">
          <i class="fas fa-download mr-2"></i> Save as PDF
        </button>
        <button onclick="shareResults()" class="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
          <i class="fas fa-share-alt mr-2"></i> Share Results
        </button>
        <button onclick="window.location.href='/portal'" class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all">
          Continue to Dashboard <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>

    </div>
  </div>

  <script>
    const styleEmojis = {
      verbal_appreciation: '🗣️',
      focused_presence: '🎯',
      thoughtful_gestures: '🎁',
      supportive_partnership: '🤲',
      physical_connection: '🫂',
      growth_championing: '🌟'
    };

    const styleNames = {
      verbal_appreciation: 'Verbal Appreciation',
      focused_presence: 'Focused Presence',
      thoughtful_gestures: 'Thoughtful Gestures',
      supportive_partnership: 'Supportive Partnership',
      physical_connection: 'Physical Connection',
      growth_championing: 'Growth Championing'
    };

    const styleTips = {
      verbal_appreciation: [
        'Say "I love you" and "I appreciate you" regularly',
        'Give specific compliments about what you admire',
        'Write notes or send thoughtful texts',
        'Verbally celebrate their achievements'
      ],
      focused_presence: [
        'Put away phones during quality time',
        'Make eye contact during conversations',
        'Plan device-free date nights',
        'Be fully present when they share their day'
      ],
      thoughtful_gestures: [
        'Remember the little things they mention',
        'Surprise them with their favorite treat',
        'Plan activities based on their interests',
        'Notice and act on small ways to delight them'
      ],
      supportive_partnership: [
        'Help with tasks without being asked',
        'Take on responsibilities they usually handle',
        'Problem-solve together as a team',
        'Show love through practical support'
      ],
      physical_connection: [
        'Initiate hugs, kisses, and hand-holding',
        'Sit close during movies or conversations',
        'Give back rubs or massages',
        'Use appropriate touch to show affection'
      ],
      growth_championing: [
        'Encourage their personal goals and dreams',
        'Support their hobbies and interests',
        'Celebrate their individual achievements',
        'Give them space to grow independently'
      ]
    };

    async function loadResults() {
      const params = new URLSearchParams(window.location.search);
      const resultId = params.get('result');

      if (!resultId) {
        alert('No result ID found');
        return;
      }

      try {
        const response = await fetch(\`/api/quizzes/results/\${resultId}\`);
        const data = await response.json();
        displayResults(data);
      } catch (error) {
        console.error('Error loading results:', error);
        document.getElementById('loading-screen').innerHTML = '<p class="text-red-600">Error loading results. Please try again.</p>';
      }
    }

    function displayResults(result) {
      document.getElementById('loading-screen').classList.add('hidden');
      document.getElementById('results-container').classList.remove('hidden');

      const breakdown = result.full_breakdown;
      const primary = result.primary_style;
      const secondary = result.secondary_style;

      // Hero section
      document.getElementById('primary-style-name').textContent = styleNames[primary];
      document.getElementById('secondary-style-name').textContent = styleNames[secondary];

      // Primary style card
      document.getElementById('primary-emoji').textContent = styleEmojis[primary];
      document.getElementById('primary-name').textContent = styleNames[primary];
      document.getElementById('primary-percentage').textContent = breakdown[primary].percentage + '%';
      document.getElementById('primary-description').textContent = breakdown[primary].description;
      document.getElementById('primary-tips').innerHTML = styleTips[primary].map(tip =>
        \`<li class="flex items-start gap-2"><i class="fas fa-check text-indigo-600 mt-1"></i><span>\${tip}</span></li>\`
      ).join('');

      // Secondary style card
      document.getElementById('secondary-emoji').textContent = styleEmojis[secondary];
      document.getElementById('secondary-name').textContent = styleNames[secondary];
      document.getElementById('secondary-percentage').textContent = breakdown[secondary].percentage + '%';
      document.getElementById('secondary-description').textContent = breakdown[secondary].description;
      document.getElementById('secondary-tips').innerHTML = styleTips[secondary].map(tip =>
        \`<li class="flex items-start gap-2"><i class="fas fa-check text-purple-600 mt-1"></i><span>\${tip}</span></li>\`
      ).join('');

      // Profile summary
      document.getElementById('profile-summary').textContent = result.result_data.profile_summary;

      // Action steps
      const actionStepsHTML = result.result_data.action_steps.map((step, index) => \`
        <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="bg-white text-indigo-600 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
              \${index + 1}
            </div>
            <div>
              <h4 class="font-bold text-lg mb-2">\${step.title}</h4>
              <p class="text-white/90">\${step.description}</p>
            </div>
          </div>
        </div>
      \`).join('');
      document.getElementById('action-steps').innerHTML = actionStepsHTML;

      // All styles breakdown
      const stylesBreakdownHTML = Object.entries(breakdown)
        .sort(([,a], [,b]) => b.percentage - a.percentage)
        .map(([style, data]) => \`
          <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
            <div class="flex items-center gap-3 mb-2">
              <div class="text-2xl">\${styleEmojis[style]}</div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900 text-sm">\${styleNames[style]}</div>
              </div>
            </div>
            <div class="text-2xl font-bold text-indigo-600">\${data.percentage}%</div>
          </div>
        \`).join('');
      document.getElementById('all-styles-breakdown').innerHTML = stylesBreakdownHTML;

      // Radar chart
      createRadarChart(breakdown);
    }

    function createRadarChart(breakdown) {
      const ctx = document.getElementById('compass-chart').getContext('2d');

      const labels = Object.keys(breakdown).map(style => styleNames[style]);
      const data = Object.values(breakdown).map(d => d.percentage);

      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Your Connection Profile',
            data: data,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(99, 102, 241, 1)'
          }]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                stepSize: 20
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }

    function shareResults() {
      if (navigator.share) {
        navigator.share({
          title: 'My Connection Compass Results',
          text: 'I just discovered my connection styles with Better Together!',
          url: window.location.href
        });
      } else {
        alert('Sharing is not supported on this device. Copy the URL to share!');
      }
    }

    // Load results on page load
    document.addEventListener('DOMContentLoaded', loadResults);
  </script>
</body>
</html>
  `.trim();
}
