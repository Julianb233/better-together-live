// Connection Compass Assessment Page
// Original assessment for understanding communication and appreciation styles

export function renderConnectionCompassPage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale-1.0">
  <title>The Connection Compass | Better Together</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.css">
  <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .fade-in-up { animation: fadeInUp 0.5s ease-out; }
    .option-card { transition: all 0.3s ease; }
    .option-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .option-card.selected { border-color: #6366f1; background-color: #eef2ff; }
    .progress-bar { transition: width 0.5s ease; }

    /* Likert Scale */
    .likert-option { transition: all 0.2s ease; }
    .likert-option:hover { transform: scale(1.1); }
    .likert-option.selected { background-color: #6366f1; color: white; }

    /* Ranking List */
    .sortable-item { cursor: move; }
    .sortable-ghost { opacity: 0.4; }
    .sortable-chosen { box-shadow: 0 0 20px rgba(99,102,241,0.5); }
  </style>
</head>
<body class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">

  <!-- Progress Bar -->
  <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
    <div class="h-2 bg-gray-200">
      <div id="progress-bar" class="progress-bar h-full bg-gradient-to-r from-indigo-500 to-purple-500" style="width: 0%"></div>
    </div>
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Question <span id="current-question">1</span> of <span id="total-questions">17</span>
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
        <div class="text-6xl mb-6">🧭</div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">The Connection Compass</h1>
        <p class="text-xl text-gray-600 mb-6">
          An original assessment for understanding how partners express and receive appreciation
        </p>
        <div class="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 mb-8 text-left">
          <p class="text-gray-700 mb-4">
            Every person has unique ways they naturally give and receive appreciation. Understanding yours and your partner's can transform your connection.
          </p>
          <p class="text-gray-700 font-semibold">
            This 5-minute assessment will reveal your Connection Compass - your personal map for meaningful connection.
          </p>
        </div>

        <!-- The 6 Connection Styles -->
        <div class="text-left mb-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">The 6 Connection Styles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-start gap-3">
              <div class="text-2xl">🗣️</div>
              <div>
                <div class="font-semibold text-gray-900">Verbal Appreciation</div>
                <div class="text-sm text-gray-600">Valued through spoken/written expressions</div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="text-2xl">🎯</div>
              <div>
                <div class="font-semibold text-gray-900">Focused Presence</div>
                <div class="text-sm text-gray-600">Connected through undivided attention</div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="text-2xl">🎁</div>
              <div>
                <div class="font-semibold text-gray-900">Thoughtful Gestures</div>
                <div class="text-sm text-gray-600">Loved through intentional actions</div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="text-2xl">🤲</div>
              <div>
                <div class="font-semibold text-gray-900">Supportive Partnership</div>
                <div class="text-sm text-gray-600">Cared for through practical help</div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="text-2xl">🫂</div>
              <div>
                <div class="font-semibold text-gray-900">Physical Connection</div>
                <div class="text-sm text-gray-600">Close through touch and proximity</div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="text-2xl">🌟</div>
              <div>
                <div class="font-semibold text-gray-900">Growth Championing</div>
                <div class="text-sm text-gray-600">Valued when partner supports dreams</div>
              </div>
            </div>
          </div>
        </div>

        <button id="start-quiz-btn" class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
          Discover My Compass <i class="fas fa-compass ml-2"></i>
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
        <button id="next-btn" class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Next <i class="fas fa-arrow-right ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Completion Screen -->
    <div id="completion-screen" class="hidden fade-in-up text-center">
      <div class="bg-white rounded-3xl shadow-xl p-12">
        <div class="text-6xl mb-6 animate-bounce">✨</div>
        <h2 class="text-4xl font-bold text-gray-900 mb-4">Calculating Your Compass...</h2>
        <p class="text-xl text-gray-600 mb-8">
          We're analyzing your responses to reveal your unique connection profile
        </p>
        <div class="inline-block">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
        </div>
        <p class="text-gray-500">Processing your connection compass...</p>
      </div>
    </div>

  </div>

  <script>
    let currentQuestionIndex = 0;
    let quizResponseId = null;
    let userId = 'demo-user-1';
    const quizId = 'connection-compass-v1';
    let answers = {};

    const styleMapping = {
      0: 'verbal_appreciation',
      1: 'focused_presence',
      2: 'thoughtful_gestures',
      3: 'supportive_partnership',
      4: 'physical_connection',
      5: 'growth_championing'
    };

    const questions = [
      {id: 'compass-q1', number: 1, type: 'forced_choice', section: 'Round 1: Initial Preferences',
        options: [
          {id: 'a', text: 'When my partner remembers something specific I mentioned wanting and surprises me with it'},
          {id: 'b', text: 'When my partner puts away their phone and gives me their complete attention'}
        ]
      },
      {id: 'compass-q2', number: 2, type: 'forced_choice',
        options: [
          {id: 'a', text: 'When my partner handles a task I usually do, giving me time to relax'},
          {id: 'b', text: 'When my partner tells me specifically what they appreciate about me'}
        ]
      },
      {id: 'compass-q3', number: 3, type: 'forced_choice',
        options: [
          {id: 'a', text: 'When my partner holds my hand or puts their arm around me in public'},
          {id: 'b', text: 'When my partner actively encourages me to pursue my personal goals'}
        ]
      },
      {id: 'compass-q4', number: 4, type: 'forced_choice',
        options: [
          {id: 'a', text: 'When my partner plans a special activity based on my interests'},
          {id: 'b', text: 'When my partner helps me solve a problem I\\'m struggling with'}
        ]
      },
      {id: 'compass-q5', number: 5, type: 'forced_choice',
        options: [
          {id: 'a', text: 'When my partner sends me a thoughtful message during the day'},
          {id: 'b', text: 'When my partner initiates physical closeness while watching TV'}
        ]
      },
      {id: 'compass-q6', number: 6, type: 'forced_choice', section: 'Round 2: Scenario Preferences',
        text: 'After a stressful day, what would help you feel most supported?',
        options: [
          {id: 'a', text: 'Your partner listening without judgment while you vent'},
          {id: 'b', text: 'Your partner taking care of dinner and evening chores'}
        ]
      },
      {id: 'compass-q7', number: 7, type: 'forced_choice',
        text: 'For your birthday, what would mean the most?',
        options: [
          {id: 'a', text: 'A heartfelt letter describing your impact on their life'},
          {id: 'b', text: 'A carefully planned day doing your favorite activities together'}
        ]
      },
      {id: 'compass-q8', number: 8, type: 'forced_choice',
        text: 'When you achieve something important, how would you want your partner to celebrate?',
        options: [
          {id: 'a', text: 'Bragging about you to friends and family'},
          {id: 'b', text: 'Planning a special experience to mark the achievement'}
        ]
      },
      {id: 'compass-q9', number: 9, type: 'forced_choice',
        text: 'During a regular weekday, what would make you smile most?',
        options: [
          {id: 'a', text: 'An unexpected hug from behind while you\\'re doing dishes'},
          {id: 'b', text: 'Your partner handling an errand you were dreading'}
        ]
      },
      {id: 'compass-q10', number: 10, type: 'forced_choice',
        text: 'When you\\'re doubting yourself, what helps most?',
        options: [
          {id: 'a', text: 'Your partner reminding you of your strengths and past successes'},
          {id: 'b', text: 'Your partner researching solutions and resources to help you'}
        ]
      },
      {id: 'compass-q11', number: 11, type: 'likert_scale', section: 'Round 3: Depth Questions',
        text: 'I feel most connected when we\\'re doing separate activities in the same room',
        scale: {min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree'}
      },
      {id: 'compass-q12', number: 12, type: 'likert_scale',
        text: 'Small daily gestures mean more to me than grand occasional ones',
        scale: {min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree'}
      },
      {id: 'compass-q13', number: 13, type: 'likert_scale',
        text: 'I need physical touch to feel emotionally connected',
        scale: {min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree'}
      },
      {id: 'compass-q14', number: 14, type: 'likert_scale',
        text: 'I feel loved when my partner takes interest in my hobbies',
        scale: {min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree'}
      },
      {id: 'compass-q15', number: 15, type: 'likert_scale',
        text: 'Actions speak louder than words in relationships',
        scale: {min: 1, max: 5, minLabel: 'Strongly Disagree', maxLabel: 'Strongly Agree'}
      },
      {id: 'compass-q16', number: 16, type: 'ranking', section: 'Round 4: Expression Preferences',
        text: 'How do you most naturally express love?',
        subtitle: 'Drag to rank from 1-6 (1 being most natural)',
        items: [
          'Saying encouraging and appreciative things',
          'Planning special experiences together',
          'Buying or making meaningful gifts',
          'Taking care of practical needs',
          'Being physically affectionate',
          'Supporting their independence and growth'
        ]
      },
      {id: 'compass-q17', number: 17, type: 'single_choice',
        text: 'What makes you feel most disconnected?',
        options: [
          {id: 'lack_conversation', text: 'Lack of meaningful conversation'},
          {id: 'no_quality_time', text: 'No quality time together'},
          {id: 'no_gestures', text: 'Absence of thoughtful gestures'},
          {id: 'unshared_responsibilities', text: 'Unshared responsibilities'},
          {id: 'limited_affection', text: 'Limited physical affection'},
          {id: 'unsupported_goals', text: 'Feeling unsupported in personal goals'}
        ]
      }
    ];

    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
      document.getElementById('next-btn').addEventListener('click', nextQuestion);
      document.getElementById('prev-btn').addEventListener('click', previousQuestion);
      document.getElementById('exit-btn').addEventListener('click', exitQuiz);
    });

    async function startQuiz() {
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

      let contentHTML = '';

      if (question.type === 'forced_choice') {
        contentHTML = \`
          <h3 class="text-sm font-semibold text-indigo-600 mb-4">\${question.section || ''}</h3>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">\${question.text || 'Which resonates more with you?'}</h2>
          <p class="text-gray-600 mb-8">Choose the option that feels more meaningful to you</p>
          <div class="space-y-4">
            \${question.options.map(option => \`
              <div class="option-card bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer \${answers[question.id] === option.id ? 'selected' : ''}"
                   onclick="selectForcedChoice('\${question.id}', '\${option.id}')">
                <div class="flex items-start gap-4">
                  <div class="text-indigo-600 text-xl mt-1">
                    <i class="far \${answers[question.id] === option.id ? 'fa-dot-circle' : 'fa-circle'}"></i>
                  </div>
                  <div class="flex-1">
                    <p class="text-gray-900">\${option.text}</p>
                  </div>
                </div>
              </div>
            \`).join('')}
          </div>
        \`;
      } else if (question.type === 'likert_scale') {
        contentHTML = \`
          <h3 class="text-sm font-semibold text-indigo-600 mb-4">\${question.section || ''}</h3>
          <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">\${question.text}</h2>
          <div class="bg-white rounded-xl p-8">
            <div class="flex justify-between items-center mb-2">
              \${[1,2,3,4,5].map(value => \`
                <button class="likert-option w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center font-bold text-lg \${answers[question.id] === value ? 'selected' : ''}"
                        onclick="selectLikert('\${question.id}', \${value})">
                  \${value}
                </button>
              \`).join('')}
            </div>
            <div class="flex justify-between text-sm text-gray-600 mt-4">
              <span>\${question.scale.minLabel}</span>
              <span>\${question.scale.maxLabel}</span>
            </div>
          </div>
        \`;
      } else if (question.type === 'ranking') {
        const currentRanking = answers[question.id] || question.items.slice();
        contentHTML = \`
          <h3 class="text-sm font-semibold text-indigo-600 mb-4">\${question.section || ''}</h3>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">\${question.text}</h2>
          <p class="text-gray-600 mb-6 italic">\${question.subtitle}</p>
          <div class="bg-white rounded-xl p-6">
            <div id="sortable-list" class="space-y-3">
              \${currentRanking.map((item, index) => \`
                <div class="sortable-item bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-4 cursor-move">
                  <div class="flex items-center gap-4">
                    <div class="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      \${index + 1}
                    </div>
                    <div class="flex-1 text-gray-900">\${item}</div>
                    <div class="text-gray-400">
                      <i class="fas fa-grip-vertical"></i>
                    </div>
                  </div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      } else if (question.type === 'single_choice') {
        contentHTML = \`
          <h2 class="text-3xl font-bold text-gray-900 mb-8">\${question.text}</h2>
          <div class="space-y-3">
            \${question.options.map(option => \`
              <div class="option-card bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer \${answers[question.id] === option.id ? 'selected' : ''}"
                   onclick="selectSingleChoice('\${question.id}', '\${option.id}')">
                <div class="flex items-center gap-4">
                  <div class="text-indigo-600 text-xl">
                    <i class="far \${answers[question.id] === option.id ? 'fa-dot-circle' : 'fa-circle'}"></i>
                  </div>
                  <div class="flex-1 text-gray-900">\${option.text}</div>
                </div>
              </div>
            \`).join('')}
          </div>
        \`;
      }

      container.innerHTML = \`<div class="bg-white rounded-3xl shadow-xl p-8">\${contentHTML}</div>\`;

      if (question.type === 'ranking') {
        initializeSortable(question.id);
      }

      updateProgress();
      updateNavigation();
    }

    function selectForcedChoice(questionId, optionId) {
      answers[questionId] = optionId;
      renderQuestion();
      saveAnswer(questionId, {selected_option_ids: [optionId]});
    }

    function selectLikert(questionId, value) {
      answers[questionId] = value;
      renderQuestion();
      saveAnswer(questionId, {scale_value: value});
    }

    function selectSingleChoice(questionId, optionId) {
      answers[questionId] = optionId;
      renderQuestion();
      saveAnswer(questionId, {selected_option_ids: [optionId]});
    }

    function initializeSortable(questionId) {
      const listElement = document.getElementById('sortable-list');
      const question = questions.find(q => q.id === questionId);

      Sortable.create(listElement, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        onEnd: function() {
          const items = Array.from(listElement.children).map(el =>
            el.querySelector('.flex-1').textContent.trim()
          );
          answers[questionId] = items;
          saveAnswer(questionId, {ranked_items: items});
          renderQuestion();
        }
      });
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
      if (answers[currentQuestion.id] === undefined || answers[currentQuestion.id] === null) {
        alert('Please answer the question before continuing');
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
        const response = await fetch('/api/quizzes/complete', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({user_quiz_response_id: quizResponseId})
        });

        const data = await response.json();

        setTimeout(() => {
          window.location.href = '/quiz-results.html?quiz=' + quizId + '&result=' + data.result_id;
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
      const hasAnswer = answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== null;
      document.getElementById('next-btn').disabled = !hasAnswer;

      if (currentQuestionIndex === questions.length - 1) {
        document.getElementById('next-btn').innerHTML = 'See My Results <i class="fas fa-compass ml-2"></i>';
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
