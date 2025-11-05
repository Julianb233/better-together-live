# Better Together Quiz Systems

Comprehensive quiz and assessment system for relationship insights and personalized recommendations.

## Overview

This implementation includes two major assessments:

1. **Initial Intake Quiz** - "Discover Your Relationship Journey"
   - 12 conversational questions
   - Gathers relationship stage, goals, challenges, preferences
   - Progressive, mobile-friendly interface
   - 5-7 minute completion time

2. **Connection Compass Assessment** - Original communication styles assessment
   - 17 questions across 4 rounds
   - Multiple question types: forced choice, Likert scale, ranking
   - Identifies 6 unique connection styles
   - Generates personalized results and compatibility reports

## Features

### Quiz Experience
- Progressive question flow with smooth transitions
- Real-time progress tracking
- Answer persistence (save and resume)
- Mobile-responsive design
- Celebration animations on completion
- Print/share results functionality

### Connection Styles Assessed

1. **🗣️ Verbal Appreciation** - Valued through spoken/written expressions
2. **🎯 Focused Presence** - Connected through undivided attention
3. **🎁 Thoughtful Gestures** - Loved through intentional actions
4. **🤲 Supportive Partnership** - Cared for through practical help
5. **🫂 Physical Connection** - Close through touch and proximity
6. **🌟 Growth Championing** - Valued when partner supports dreams

### Results & Analysis
- Visual radar chart showing all 6 styles
- Primary and secondary style identification
- Personalized action steps for partners
- Detailed descriptions and recommendations
- Couple compatibility reports (when both complete)

## File Structure

```
/migrations/
  0002_quiz_systems.sql          # Database schema

/src/
  types.ts                        # TypeScript type definitions
  utils.ts                        # Quiz scoring and utility functions

  /pages/
    intake-quiz.ts                # Initial intake quiz UI
    connection-compass.ts         # Connection Compass assessment UI
    quiz-results.ts               # Results presentation page

  index.tsx                       # Main app with API routes

/seed_quiz_questions.sql          # Pre-populated quiz questions
```

## Database Schema

### Core Tables
- `quizzes` - Quiz definitions and metadata
- `quiz_questions` - Individual questions with scoring logic
- `user_quiz_responses` - User quiz sessions
- `quiz_answer_responses` - Individual answer storage
- `quiz_results` - Calculated results and profiles
- `couple_compatibility_reports` - Partner compatibility analysis

### User Fields Added
- `intake_quiz_completed` - Boolean flag
- `connection_compass_completed` - Boolean flag
- `primary_connection_style` - Top connection style
- `secondary_connection_style` - Second connection style

## API Endpoints

### Quiz Management
```
POST   /api/quizzes/start              # Start a new quiz session
POST   /api/quizzes/answer             # Submit an answer
POST   /api/quizzes/complete           # Complete quiz & calculate results
GET    /api/quizzes/results/:resultId  # Get quiz results
GET    /api/quizzes/user/:userId       # Get user's quiz history
POST   /api/quizzes/compatibility      # Generate couple compatibility report
```

### Page Routes
```
GET    /intake-quiz.html               # Intake quiz interface
GET    /connection-compass.html        # Connection Compass assessment
GET    /quiz-results.html              # Results display page
```

## Usage Flow

### 1. Initial Intake Quiz
```javascript
// User starts quiz
POST /api/quizzes/start {
  user_id: "user-123",
  quiz_id: "intake-quiz-v1"
}
// Returns: { quiz_response_id: "resp-456" }

// User answers questions
POST /api/quizzes/answer {
  user_quiz_response_id: "resp-456",
  question_id: "intake-q1",
  answer_data: { selected_option_ids: ["committed"] }
}

// Complete quiz
POST /api/quizzes/complete {
  user_quiz_response_id: "resp-456"
}
// Redirects to Connection Compass
```

### 2. Connection Compass Assessment
```javascript
// Same flow as intake quiz
// Results include:
{
  result_id: "result-789",
  primary_style: "focused_presence",
  secondary_style: "verbal_appreciation",
  full_breakdown: {
    focused_presence: { percentage: 32, score: 12 },
    verbal_appreciation: { percentage: 28, score: 10 },
    // ... other styles
  }
}
```

### 3. Results Display
```javascript
GET /api/quizzes/results/result-789
// Returns full results with:
// - Primary/secondary styles
// - Percentage breakdown
// - Personalized summary
// - Action steps for partner
```

### 4. Compatibility Report (Optional)
```javascript
// After both partners complete Connection Compass
POST /api/quizzes/compatibility {
  relationship_id: "rel-123"
}
// Returns:
{
  compatibility_score: 75,
  style_overlap: 50,
  strengths: [...],
  growth_areas: [...],
  potential_conflicts: [...]
}
```

## Scoring Logic

### Connection Compass Calculation

1. **Forced Choice Questions (Q1-10)**: Award 1 point to the selected style
2. **Likert Scale Questions (Q11-15)**: Award 0-2 points based on response (4-5 rating)
3. **Ranking Question (Q16)**: Award 6-1 points (6 for rank 1, 1 for rank 6)
4. **Final Question (Q17)**: Award 2 points to identified disconnect style

Total scores are converted to percentages, with top 2 styles identified as primary/secondary.

### Compatibility Calculation

- **Style Overlap**: Percentage of shared top styles (0-100%)
- **Complementary Score**: How well partners can fulfill each other's needs
- **Overall Compatibility**: Weighted combination (40% overlap + 60% complementary)

## Customization

### Adding New Quizzes

1. Insert quiz definition in `quizzes` table
2. Add questions to `quiz_questions` table with scoring data
3. Update quiz completion logic in `/api/quizzes/complete` endpoint
4. Create UI page in `/src/pages/`
5. Add page route in `index.tsx`

### Modifying Connection Styles

Update the following locations:
- Type definition in `types.ts` (`ConnectionStyle`)
- Utility functions in `utils.ts` (emojis, names, descriptions)
- Scoring logic in `calculateConnectionCompassScores()`
- UI components (emoji maps, style names)

## Design Principles

1. **Progressive Disclosure**: Show information as needed, not all at once
2. **Visual Engagement**: Use emojis, colors, animations to maintain interest
3. **Mobile-First**: All interfaces optimized for touch and small screens
4. **Data Persistence**: Save answers immediately to prevent loss
5. **Gamification**: Progress bars, celebration screens, visual results

## Future Enhancements

- [ ] AI-powered insights using OpenAI/Anthropic APIs
- [ ] Scheduled re-assessments with progress tracking
- [ ] Interactive couple discussion guides
- [ ] Recommended activities based on styles
- [ ] Integration with daily check-ins and challenges
- [ ] Social proof and shared results features
- [ ] Multi-language support
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

## Testing

### Manual Testing Checklist

- [ ] Start intake quiz successfully
- [ ] Navigate through all 12 intake questions
- [ ] Answer persistence (refresh page mid-quiz)
- [ ] Complete intake quiz and redirect
- [ ] Start Connection Compass assessment
- [ ] Test all question types (forced choice, Likert, ranking)
- [ ] Complete Connection Compass and see results
- [ ] Verify radar chart displays correctly
- [ ] Test results sharing functionality
- [ ] Complete as second partner and generate compatibility report

### Database Setup

```sql
-- Run migrations in order
sqlite3 database.db < migrations/0001_initial_relationship_schema.sql
sqlite3 database.db < migrations/0002_quiz_systems.sql

-- Seed quiz questions
sqlite3 database.db < seed_quiz_questions.sql
```

## Notes

- All quiz data is stored in JSON format for flexibility
- Scoring algorithms are transparent and documented
- No external dependencies for quiz logic (fully self-contained)
- Original Connection Compass assessment avoids copyright issues with existing frameworks
- Mobile-responsive throughout with Tailwind CSS
- Uses Chart.js for visual result displays

## Support

For questions or issues, refer to the main Better Together documentation or contact the development team.
