// Intake Quiz Page
// "Discover Your Relationship Journey" - Initial relationship assessment

export function renderIntakeQuizPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Discover Your Relationship Journey | Better Together</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .fade-in-up {
      animation: fadeInUp 0.5s ease-out;
    }
    .option-card {
      transition: all 0.3s ease;
    }
    .option-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .option-card.selected {
      border-color: #6366f1;
      background-color: #eef2ff;
    }
    .progress-bar {
      transition: width 0.5s ease;
    }
  </style>
</head>
<body class="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 min-h-screen">

  <!-- Progress Bar -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
    <div class="h-2 bg-gray-200">
      <div id="progress-bar" class="progress-bar h-full bg-gradient-to-r from-purple-500 to-pink-500" style="width: 0%"></div>
    </div>
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Question <span id="current-question">1</span> of <span id="total-questions">12</span>
      </div>
      <button id="exit-btn" class="text-gray-500 hover:text-gray-700">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>

  <!-- Main Content -->
  <div class="container mx-auto px-4 pt-24 pb-12 max-w-4xl">

    <!-- Welcome Screen -->
    <div id="welcome-screen" class="fade-in-up text-center">
      <div class="bg-white rounded-3xl shadow-xl p-12 mb-8">
        <div class="text-6xl mb-6">💑</div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Discover Your Relationship Journey</h1>
        <p class="text-xl text-gray-600 mb-8">
          A progressive, conversational assessment to understand your unique relationship and create personalized experiences just for you.
        </p>
        <div class="flex items-center justify-center gap-8 mb-8 text-left">
          <div class="flex items-start gap-3">
            <div class="text-purple-500 text-2xl">⏱️</div>
            <div>
              <div class="font-semibold text-gray-900">5-7 minutes</div>
              <div class="text-sm text-gray-600">Quick & engaging</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="text-pink-500 text-2xl">🎯</div>
            <div>
              <div class="font-semibold text-gray-900">12 questions</div>
              <div class="text-sm text-gray-600">Personalized insights</div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="text-blue-500 text-2xl">🔒</div>
            <div>
              <div class="font-semibold text-gray-900">Private</div>
              <div class="text-sm text-gray-600">Your data is secure</div>
            </div>
          </div>
        </div>
        <button id="start-quiz-btn" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
          Let's Begin <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Quiz Questions -->
    <div id="quiz-container" class="hidden">
      <div id="question-container" class="fade-in-up"></div>

      <!-- Navigation -->
      <div class="flex justify-between mt-8">
        <button id="prev-btn" class="px-6 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-semibold hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled>
          <i class="fas fa-arrow-left mr-2"></i> Previous
        </button>
        <button id="next-btn" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Next <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Completion Screen -->
    <div id="completion-screen" class="hidden fade-in-up text-center">
      <div class="bg-white rounded-3xl shadow-xl p-12">
        <div class="text-6xl mb-6 animate-bounce">🎉</div>
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Amazing Work!</h2>
        <p class="text-xl text-gray-600 mb-8">
          We're processing your responses to create personalized recommendations just for you and your partner.
        </p>
        <div class="inline-block">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
        </div>
        <p class="text-gray-500">Generating your relationship profile...</p>
      </div>
    </div>

  </div>

  <script>
    // Quiz State
    let currentQuestionIndex = 0;
    let quizResponseId = null;
    let userId = 'demo-user-1'; // TODO: Get from auth
    const quizId = 'intake-quiz-v1';
    let answers = {};

    // Quiz Questions Data
    const questions = [
      {
        id: 'intake-q1',
        number: 1,
        text: "Let's start with where you are in your journey together...",
        type: 'single_choice',
        options: [
          {id: 'just_started', text: 'Just started dating (0-6 months)', emoji: '🌱'},
          {id: 'dating', text: 'Dating (6+ months)', emoji: '🌿'},
          {id: 'committed', text: 'In a committed relationship', emoji: '💑'},
          {id: 'engaged', text: 'Engaged', emoji: '💍'},
          {id: 'newlyweds', text: 'Newlyweds (married <2 years)', emoji: '👰‍♀️'},
          {id: 'married_medium', text: 'Married (2-10 years)', emoji: '💏'},
          {id: 'married_long', text: 'Married (10+ years)', emoji: '❤️'},
          {id: 'fresh_start', text: 'Starting fresh (reconciling/renewed commitment)', emoji: '🔄'}
        ]
      },
      {
        id: 'intake-q2',
        number: 2,
        text: 'What would make your relationship feel even stronger?',
        subtitle: 'Select up to 3',
        type: 'multiple_choice',
        maxSelections: 3,
        options: [
          {id: 'emotional_intimacy', text: 'Deeper emotional intimacy'},
          {id: 'conflict_communication', text: 'Better communication during conflicts'},
          {id: 'quality_time', text: 'More quality time together'},
          {id: 'romance_passion', text: 'Reigniting romance and passion'},
          {id: 'shared_experiences', text: 'Building shared experiences'},
          {id: 'future_goals', text: 'Aligning on future goals'},
          {id: 'stress_management', text: 'Managing daily stress together'},
          {id: 'fun_playfulness', text: 'Having more fun and playfulness'}
        ]
      },
      {
        id: 'intake-q3',
        number: 3,
        text: 'Every relationship has growth areas. What feels most challenging right now?',
        type: 'single_choice',
        options: [
          {id: 'tech_distraction', text: 'We get distracted by technology/work', emoji: '📱'},
          {id: 'time_finding', text: 'Finding time for just us', emoji: '⏰'},
          {id: 'expressing_feelings', text: 'Expressing feelings openly', emoji: '💬'},
          {id: 'stuck_routine', text: 'Stuck in routine/feeling bored', emoji: '🔄'},
          {id: 'financial_stress', text: 'Financial stress affecting us', emoji: '💰'},
          {id: 'household_balance', text: 'Balancing household responsibilities', emoji: '🏠'},
          {id: 'parenting_energy', text: 'Parenting taking all our energy', emoji: '👨‍👩‍👧'},
          {id: 'different_goals', text: 'Different life goals or priorities', emoji: '🎯'}
        ]
      },
      {
        id: 'intake-q4',
        number: 4,
        text: 'Picture your perfect time together. What does it look like?',
        type: 'single_choice',
        options: [
          {id: 'adventure_seekers', text: 'Adventure Seekers', description: 'Trying something new and exciting', emoji: '🏔️'},
          {id: 'intimate_connectors', text: 'Intimate Connectors', description: 'Deep conversation over wine', emoji: '🍷'},
          {id: 'playful_partners', text: 'Playful Partners', description: 'Games, laughs, and friendly competition', emoji: '🎮'},
          {id: 'zen_duo', text: 'Zen Duo', description: 'Peaceful, relaxing, recharging together', emoji: '🧘'},
          {id: 'creative_souls', text: 'Creative Souls', description: 'Making, building, or learning something', emoji: '🎨'},
          {id: 'social_butterflies', text: 'Social Butterflies', description: 'Out with friends or meeting new people', emoji: '🌃'},
          {id: 'homebodies', text: 'Homebodies', description: 'Cozy night in, just us', emoji: '🏡'},
          {id: 'culture_enthusiasts', text: 'Culture Enthusiasts', description: 'Museums, theater, concerts', emoji: '🎭'}
        ]
      },
      {
        id: 'intake-q5',
        number: 5,
        text: 'How do you both typically feel at the end of a workday?',
        type: 'single_choice',
        options: [
          {id: 'ready_active', text: 'Ready to go out and do something active', emoji: '🚀'},
          {id: 'low_key', text: 'Up for something low-key but engaging', emoji: '😊'},
          {id: 'need_decompress', text: 'Need to relax and decompress first', emoji: '😴'},
          {id: 'varies_wildly', text: 'It varies wildly day to day', emoji: '🎲'},
          {id: 'energy_mismatch', text: "One of us has energy, the other doesn't", emoji: '💪'},
          {id: 'night_owls', text: "We're night owls - energy comes later", emoji: '🌙'}
        ]
      },
      {
        id: 'intake-q6',
        number: 6,
        text: 'When it comes to experiences and dates, what feels comfortable?',
        type: 'single_choice',
        options: [
          {id: 'free_creative', text: 'Free & Creative ($0)', description: 'Parks, home activities, free events', emoji: '💚'},
          {id: 'budget_friendly', text: 'Budget-Friendly ($25-50)', description: 'Coffee dates, casual outings', emoji: '💙'},
          {id: 'moderate', text: 'Moderate ($50-100)', description: 'Dinner out, local activities', emoji: '💜'},
          {id: 'flexible', text: 'Flexible ($100-200)', description: 'Special experiences when worth it', emoji: '💛'},
          {id: 'generous', text: 'Generous ($200+)', description: 'Premium experiences, no restrictions', emoji: '❤️'},
          {id: 'varies', text: 'Varies', description: 'Depends on the occasion', emoji: '🎯'}
        ]
      },
      {
        id: 'intake-q7',
        number: 7,
        text: 'How do you prefer to plan your time together?',
        type: 'single_choice',
        options: [
          {id: 'plan_ahead', text: 'We love planning ahead and anticipating', emoji: '📅'},
          {id: 'spontaneous', text: 'Spontaneous - best moments are unplanned', emoji: '⚡'},
          {id: 'mix_both', text: 'Mix of both - some planned, some surprises', emoji: '🎲'},
          {id: 'need_help', text: 'We struggle with this and need help', emoji: '🤷'},
          {id: 'one_plans', text: 'One plans, the other goes along', emoji: '📱'},
          {id: 'take_turns', text: 'We take turns surprising each other', emoji: '🔄'}
        ]
      },
      {
        id: 'intake-q8',
        number: 8,
        text: 'How do you prefer to spend couple time?',
        type: 'single_choice',
        options: [
          {id: 'just_us', text: 'Just Us', description: 'Alone time is sacred', emoji: '👥'},
          {id: 'double_dates', text: 'Double Dates', description: 'Love other couple friends', emoji: '👫'},
          {id: 'family_included', text: 'Family Included', description: 'Kids/family often involved', emoji: '👨‍👩‍👧‍👦'},
          {id: 'group_settings', text: 'Group Settings', description: 'The more the merrier', emoji: '🎉'},
          {id: 'balanced_mix', text: 'Balanced Mix', description: 'Variety is key', emoji: '🔄'},
          {id: 'parallel_play', text: 'Parallel Play', description: 'Together but doing own things', emoji: '🏠'}
        ]
      },
      {
        id: 'intake-q9',
        number: 9,
        text: "What's your attitude toward relationship development?",
        type: 'single_choice',
        options: [
          {id: 'actively_learn', text: 'We actively read/learn about relationships', emoji: '📚'},
          {id: 'open_coaching', text: "We're open to coaching or guidance", emoji: '💬'},
          {id: 'want_grow', text: "We want to grow but don't know how", emoji: '🌱'},
          {id: 'figure_out', text: 'We figure things out ourselves', emoji: '💪'},
          {id: 'address_issues', text: 'We address issues as they come up', emoji: '🎯'},
          {id: 'just_fun', text: "We're good - just want fun ideas", emoji: '❤️'}
        ]
      },
      {
        id: 'intake-q10',
        number: 10,
        text: 'How would you describe your current communication?',
        type: 'single_choice',
        options: [
          {id: 'excellent', text: 'Excellent', description: 'We talk about everything openly', emoji: '⭐'},
          {id: 'good', text: 'Good', description: 'Usually communicate well', emoji: '👍'},
          {id: 'inconsistent', text: 'Inconsistent', description: 'Sometimes great, sometimes not', emoji: '🔄'},
          {id: 'challenging', text: 'Challenging', description: 'Often misunderstand each other', emoji: '😕'},
          {id: 'needs_work', text: 'Needs Work', description: 'Avoid difficult conversations', emoji: '🚧'},
          {id: 'digital_heavy', text: 'Digital Heavy', description: 'Text more than talk', emoji: '📱'}
        ]
      },
      {
        id: 'intake-q11',
        number: 11,
        text: 'How do you most naturally show love?',
        subtitle: "We'll explore this more later - just pick your top one for now",
        type: 'single_choice',
        options: [
          {id: 'thoughtful_gestures', text: 'Thoughtful gestures and surprises', emoji: '💝'},
          {id: 'helping_supporting', text: 'Helping and supporting each other', emoji: '🤝'},
          {id: 'words_appreciation', text: 'Words and verbal appreciation', emoji: '💬'},
          {id: 'quality_time', text: 'Focused quality time together', emoji: '⏰'},
          {id: 'physical_affection', text: 'Physical affection and closeness', emoji: '🤗'},
          {id: 'supporting_goals', text: "Supporting each other's goals", emoji: '🎯'}
        ]
      },
      {
        id: 'intake-q12',
        number: 12,
        text: 'When are you typically free for couple time?',
        subtitle: 'Select all that apply',
        type: 'multiple_choice',
        options: [
          {id: 'weekday_mornings', text: 'Weekday mornings'},
          {id: 'weekday_lunch', text: 'Weekday lunch breaks'},
          {id: 'weekday_evenings', text: 'Weekday evenings'},
          {id: 'friday_nights', text: 'Friday nights'},
          {id: 'saturday_days', text: 'Saturday days'},
          {id: 'saturday_nights', text: 'Saturday nights'},
          {id: 'sunday_days', text: 'Sunday days'},
          {id: 'sunday_nights', text: 'Sunday nights'},
          {id: 'changes_weekly', text: 'It changes weekly'}
        ]
      }
    ];

    // Initialize
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
      document.getElementById('next-btn').addEventListener('click', nextQuestion);
      document.getElementById('prev-btn').addEventListener('click', previousQuestion);
      document.getElementById('exit-btn').addEventListener('click', exitQuiz);
    });

    async function startQuiz() {
      // Start quiz session
      try {
        const response = await fetch('/api/quizzes/start', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user_id: userId, quiz_id: quizId})
        });
        const data = await response.json();
        quizResponseId = data.quiz_response_id;
      } catch (error) {
        console.error('Error starting quiz:', error);
      }

      document.getElementById('welcome-screen').classList.add('hidden');
      document.getElementById('quiz-container').classList.remove('hidden');
      document.getElementById('total-questions').textContent = questions.length;
      renderQuestion();
    }

    function renderQuestion() {
      const question = questions[currentQuestionIndex];
      const container = document.getElementById('question-container');

      let optionsHTML = '';

      if (question.type === 'single_choice') {
        optionsHTML = question.options.map(option => \`
          <div class="option-card bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer \${answers[question.id]?.includes(option.id) ? 'selected' : ''}"
               data-option-id="\${option.id}"
               onclick="selectSingleOption('\${question.id}', '\${option.id}')">
            <div class="flex items-center gap-4">
              \${option.emoji ? \`<div class="text-3xl">\${option.emoji}</div>\` : ''}
              <div class="flex-1">
                <div class="font-semibold text-gray-900">\${option.text}</div>
                \${option.description ? \`<div class="text-sm text-gray-600 mt-1">\${option.description}</div>\` : ''}
              </div>
              <div class="text-purple-600 \${answers[question.id]?.includes(option.id) ? 'block' : 'hidden'}">
                <i class="fas fa-check-circle text-2xl"></i>
              </div>
            </div>
          </div>
        \`).join('');
      } else if (question.type === 'multiple_choice') {
        optionsHTML = question.options.map(option => \`
          <div class="option-card bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer \${answers[question.id]?.includes(option.id) ? 'selected' : ''}"
               data-option-id="\${option.id}"
               onclick="selectMultipleOption('\${question.id}', '\${option.id}', \${question.maxSelections || 999})">
            <div class="flex items-center gap-4">
              <div class="text-purple-600">
                <i class="far \${answers[question.id]?.includes(option.id) ? 'fa-check-square' : 'fa-square'} text-2xl"></i>
              </div>
              <div class="flex-1">
                <div class="font-semibold text-gray-900">\${option.text}</div>
              </div>
            </div>
          </div>
        \`).join('');
      }

      container.innerHTML = \`
        <div class="bg-white rounded-3xl shadow-xl p-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">\${question.text}</h2>
          \${question.subtitle ? \`<p class="text-gray-600 mb-6 italic">\${question.subtitle}</p>\` : '<div class="mb-6"></div>'}
          <div class="space-y-3">
            \${optionsHTML}
          </div>
        </div>
      \`;

      updateProgress();
      updateNavigation();
    }

    function selectSingleOption(questionId, optionId) {
      answers[questionId] = [optionId];
      renderQuestion();

      // Save answer
      saveAnswer(questionId, {selected_option_ids: [optionId]});
    }

    function selectMultipleOption(questionId, optionId, maxSelections) {
      if (!answers[questionId]) answers[questionId] = [];

      const index = answers[questionId].indexOf(optionId);
      if (index > -1) {
        answers[questionId].splice(index, 1);
      } else {
        if (answers[questionId].length < maxSelections) {
          answers[questionId].push(optionId);
        } else {
          alert(\`You can only select up to \${maxSelections} options\`);
          return;
        }
      }

      renderQuestion();

      // Save answer
      saveAnswer(questionId, {selected_option_ids: answers[questionId]});
    }

    async function saveAnswer(questionId, answerData) {
      if (!quizResponseId) return;

      try {
        await fetch('/api/quizzes/answer', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            user_quiz_response_id: quizResponseId,
            question_id: questionId,
            answer_data: answerData
          })
        });
      } catch (error) {
        console.error('Error saving answer:', error);
      }
    }

    function nextQuestion() {
      const currentQuestion = questions[currentQuestionIndex];
      if (!answers[currentQuestion.id] || answers[currentQuestion.id].length === 0) {
        alert('Please select an answer before continuing');
        return;
      }

      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
      } else {
        completeQuiz();
      }
    }

    function previousQuestion() {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
      }
    }

    async function completeQuiz() {
      document.getElementById('quiz-container').classList.add('hidden');
      document.getElementById('completion-screen').classList.remove('hidden');

      try {
        await fetch('/api/quizzes/complete', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user_quiz_response_id: quizResponseId})
        });

        // Redirect to results after 2 seconds
        setTimeout(() => {
          window.location.href = '/connection-compass.html?from=intake';
        }, 2000);
      } catch (error) {
        console.error('Error completing quiz:', error);
      }
    }

    function updateProgress() {
      const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
      document.getElementById('progress-bar').style.width = progress + '%';
      document.getElementById('current-question').textContent = currentQuestionIndex + 1;
    }

    function updateNavigation() {
      document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
      const currentQuestion = questions[currentQuestionIndex];
      const hasAnswer = answers[currentQuestion.id] && answers[currentQuestion.id].length > 0;
      document.getElementById('next-btn').disabled = !hasAnswer;

      if (currentQuestionIndex === questions.length - 1) {
        document.getElementById('next-btn').innerHTML = 'Complete <i class="fas fa-check ml-2"></i>';
      } else {
        document.getElementById('next-btn').innerHTML = 'Next <i class="fas fa-arrow-right ml-2"></i>';
      }
    }

    function exitQuiz() {
      if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
        window.location.href = '/portal';
      }
    }
  </script>
</body>
</html>
  `.trim();
}
