# Phase 6: AI Coach - Research

**Researched:** 2026-03-05
**Domain:** AI/LLM integration, tiered model routing, conversation persistence, rate limiting
**Confidence:** HIGH

## Summary

The AI coach replaces the current keyword-matching stub in `src/api/ai-coach.ts` with real LLM calls via a tiered model strategy: Claude for complex relationship questions, OpenAI for quick/simple responses. The established approach for multi-provider LLM integration in the TypeScript/Hono ecosystem is the **Vercel AI SDK** (`ai` package), which provides a unified `generateText`/`streamText` API across providers with edge runtime compatibility.

The app already has Supabase for data persistence and Hono middleware patterns for auth (`requireAuth()`). Conversation history belongs in a Supabase table. Rate limiting should use a simple in-memory sliding window with Hono middleware, backed by Supabase counters for persistence across cold starts.

**Primary recommendation:** Use Vercel AI SDK (`ai` + `@ai-sdk/anthropic` + `@ai-sdk/openai`) for all LLM calls. Do NOT use the raw `@anthropic-ai/sdk` or `openai` SDKs directly. The AI SDK handles edge runtime compatibility, streaming, and provides a unified API for tiered routing.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `ai` | ^6.0.116 | Core AI SDK (generateText, streamText) | Unified API across providers, edge-compatible, Hono integration |
| `@ai-sdk/anthropic` | latest | Claude provider for AI SDK | Official Vercel provider, supports claude-haiku-4-5 through claude-opus-4-6 |
| `@ai-sdk/openai` | ^3.0.39 | OpenAI provider for AI SDK | Official Vercel provider, supports gpt-4o-mini through gpt-4o |
| `@supabase/supabase-js` | ^2.89.0 | Conversation history storage | Already in project, used everywhere |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | (already used) | Request/response validation | Already used in ai-coach.ts for schema validation |
| `hono` | ^4.9.2 | Middleware for rate limiting | Already the app framework, use createMiddleware pattern |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vercel AI SDK | Raw @anthropic-ai/sdk + openai | Lose unified API, must handle edge compat manually, more code |
| Supabase for history | Redis/KV | Adds infra; Supabase already available and sufficient for this volume |
| Custom rate limiter | hono-rate-limiter package | Package adds dependency; custom is ~30 lines and fits edge better |

**Installation:**
```bash
npm install ai @ai-sdk/anthropic @ai-sdk/openai
```

**Note:** Remove `@anthropic-ai/sdk` and `openai` from package.json if they were listed as planned dependencies -- the AI SDK providers replace them.

## Architecture Patterns

### Recommended Project Structure
```
src/
  api/
    ai-coach.ts              # Main router: /ask, /history, /stream endpoints
  lib/
    ai/
      coach-router.ts        # Tiered model selection logic
      prompts.ts             # System prompts and prompt templates
      conversation.ts        # Conversation history CRUD (Supabase)
      rate-limiter.ts        # Per-user rate limiting middleware
      response-cache.ts      # Common response caching layer
```

### Pattern 1: Tiered Model Routing
**What:** Route questions to Claude (complex) or OpenAI (simple) based on question classification.
**When to use:** Every AI coach request.
**Example:**
```typescript
// Source: Vercel AI SDK docs + application pattern
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';

type QuestionTier = 'complex' | 'simple';

function classifyQuestion(message: string): QuestionTier {
  // Simple heuristic-based classification (no LLM call needed)
  const complexIndicators = [
    'how do i', 'help me', 'struggling with', 'advice',
    'what should', 'feeling', 'partner', 'relationship',
    'conflict', 'trust', 'intimacy', 'communicate'
  ];
  const wordCount = message.split(/\s+/).length;
  const hasComplexIndicator = complexIndicators.some(ind =>
    message.toLowerCase().includes(ind)
  );
  // Long messages or those with complex indicators go to Claude
  return (wordCount > 15 || hasComplexIndicator) ? 'complex' : 'simple';
}

function getModel(tier: QuestionTier) {
  return tier === 'complex'
    ? anthropic('claude-haiku-4-5')   // Fast + capable for relationship advice
    : openai('gpt-4o-mini');          // Cheapest for simple responses
}

async function generateCoachResponse(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string
) {
  const tier = classifyQuestion(message);
  const model = getModel(tier);

  const { text } = await generateText({
    model,
    system: systemPrompt,
    messages: [
      ...conversationHistory,
      { role: 'user', content: message }
    ],
  });

  return { text, tier };
}
```

### Pattern 2: Conversation History with Supabase
**What:** Persist chat messages per user+relationship in Supabase.
**When to use:** Every AI coach interaction.
**Example:**
```typescript
// Source: Application pattern using existing Supabase setup
import { SupabaseClient } from '@supabase/supabase-js';

interface ChatMessage {
  id: string;
  user_id: string;
  relationship_id: string;
  role: 'user' | 'assistant';
  content: string;
  model_used: string;        // Track which model answered
  created_at: string;
}

async function getConversationHistory(
  supabase: SupabaseClient,
  userId: string,
  relationshipId: string,
  limit = 20
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('ai_coach_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('relationship_id', relationshipId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

async function saveMessage(
  supabase: SupabaseClient,
  message: Omit<ChatMessage, 'id' | 'created_at'>
): Promise<void> {
  const { error } = await supabase
    .from('ai_coach_messages')
    .insert(message);
  if (error) throw error;
}
```

### Pattern 3: Rate Limiting Middleware (Per-User, In-Memory + Supabase)
**What:** Limit AI coach requests per user per time window.
**When to use:** Applied to all AI coach endpoints.
**Example:**
```typescript
// Source: Hono createMiddleware pattern + custom rate limiter blog
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

// In-memory store (resets on cold start -- acceptable for edge)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function aiCoachRateLimit(maxRequests = 20, windowMs = 60 * 60 * 1000) {
  return createMiddleware(async (c, next) => {
    const userId = c.get('userId');
    if (!userId) throw new HTTPException(401);

    const now = Date.now();
    const key = `ai-coach:${userId}`;
    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    c.header('X-RateLimit-Limit', String(maxRequests));
    c.header('X-RateLimit-Remaining', String(Math.max(0, maxRequests - entry.count)));
    c.header('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

    if (entry.count > maxRequests) {
      throw new HTTPException(429, {
        message: 'Rate limit exceeded. Try again later.',
      });
    }

    await next();
  });
}
```

### Pattern 4: Response Caching
**What:** Cache common AI responses to avoid redundant LLM calls.
**When to use:** For frequently asked generic questions.
**Example:**
```typescript
// Simple in-memory cache with TTL
const responseCache = new Map<string, { response: string; expiresAt: number }>();

function getCacheKey(message: string): string {
  // Normalize: lowercase, trim, remove punctuation
  return message.toLowerCase().trim().replace(/[^\w\s]/g, '');
}

function getCachedResponse(message: string): string | null {
  const key = getCacheKey(message);
  const entry = responseCache.get(key);
  if (entry && Date.now() < entry.expiresAt) {
    return entry.response;
  }
  if (entry) responseCache.delete(key);
  return null;
}

function cacheResponse(message: string, response: string, ttlMs = 24 * 60 * 60 * 1000): void {
  const key = getCacheKey(message);
  responseCache.set(key, { response, expiresAt: Date.now() + ttlMs });
  // Evict old entries if cache grows too large
  if (responseCache.size > 500) {
    const oldest = responseCache.keys().next().value;
    if (oldest) responseCache.delete(oldest);
  }
}
```

### Anti-Patterns to Avoid
- **Using raw SDKs instead of AI SDK:** The `@anthropic-ai/sdk` and `openai` packages have edge runtime gotchas. The AI SDK abstracts these away.
- **Sending full conversation history every time:** Limit to last 20 messages. Claude and GPT context windows are large but cost scales linearly with input tokens.
- **Classifying questions with an LLM call:** Don't waste an API call to decide which model to use. Simple keyword/length heuristics are sufficient and free.
- **Caching by exact message match:** Normalize messages before caching (lowercase, trim, remove punctuation). Exact match caching has near-zero hit rate.
- **Storing conversation history in-memory:** In-memory is fine for rate limits (acceptable to reset on cold start). Conversation history MUST persist in Supabase.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| LLM API integration | Custom fetch to Claude/OpenAI APIs | Vercel AI SDK (`ai` package) | Handles streaming, retries, edge compat, token counting |
| Multi-provider routing | Custom provider abstraction layer | AI SDK provider pattern | Unified interface, swap models with one line |
| Streaming responses | Manual SSE/chunked transfer | `streamText().toTextStreamResponse()` | Handles backpressure, encoding, headers automatically |
| Auth on AI routes | Custom token parsing | Existing `requireAuth()` middleware | Already built, sets userId in context |
| Conversation storage | Custom database layer | Supabase query builder (already in project) | Existing `SupabaseDatabase` class handles all CRUD |

**Key insight:** The Vercel AI SDK is the dominant abstraction for multi-provider LLM apps in the TypeScript ecosystem. It replaces the need for raw SDK imports and handles all edge runtime concerns. Using it means you write ~50% less code and get streaming for free.

## Common Pitfalls

### Pitfall 1: Edge Runtime SDK Incompatibility
**What goes wrong:** Raw `@anthropic-ai/sdk` or `openai` SDK may fail in Vercel edge functions due to Node.js API dependencies (fs, crypto, etc.).
**Why it happens:** Edge runtime is not full Node.js. SDKs that assume Node APIs break silently.
**How to avoid:** Use `@ai-sdk/anthropic` and `@ai-sdk/openai` (Vercel AI SDK providers) which are designed for edge.
**Warning signs:** "Module not found" or "crypto is not defined" errors at runtime.

### Pitfall 2: Unbounded Conversation History
**What goes wrong:** Sending all messages to the LLM causes token limits to be exceeded or costs to spike.
**Why it happens:** Users with long conversation histories send thousands of tokens per request.
**How to avoid:** Limit conversation history to the last 20 messages. For longer context, implement summarization of older messages (future enhancement).
**Warning signs:** 429 errors from LLM APIs, unexpectedly high API bills.

### Pitfall 3: Missing System Prompt Guardrails
**What goes wrong:** AI coach gives medical/legal/financial advice, or goes off-topic.
**Why it happens:** No system prompt or weak system prompt constraints.
**How to avoid:** Strong system prompt that: (1) defines the coach role, (2) sets boundaries (no medical/legal/financial advice), (3) redirects to professionals when appropriate, (4) stays focused on relationship topics.
**Warning signs:** User reports of inappropriate advice, liability concerns.

### Pitfall 4: No Graceful Degradation
**What goes wrong:** If Claude API is down, the entire coach feature fails.
**Why it happens:** No fallback logic.
**How to avoid:** If the primary model fails, fall back to the secondary. If both fail, return a friendly error with generic advice. Never expose raw API errors to users.
**Warning signs:** 500 errors in production when one provider has an outage.

### Pitfall 5: Rate Limit State Loss on Cold Start
**What goes wrong:** Rate limits reset when the edge function cold starts, allowing burst abuse.
**Why it happens:** In-memory rate limit store is ephemeral.
**How to avoid:** For MVP, in-memory is acceptable (20 req/hour is generous). For production hardening, persist daily counts in Supabase and check on startup. Or use Vercel KV/Upstash Redis if available.
**Warning signs:** Users reporting they can bypass rate limits.

## Code Examples

### Complete AI Coach Route Handler
```typescript
// Source: Combining Vercel AI SDK docs + Hono cookbook + app patterns
import { Hono } from 'hono';
import { z } from 'zod';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { requireAuth } from '../lib/supabase/middleware';

const aiCoachApi = new Hono();

// Apply auth to all AI coach routes
aiCoachApi.use('/*', requireAuth());

const SYSTEM_PROMPT = `You are a warm, empathetic relationship coach for the Better Together app.
Your role is to provide supportive, actionable relationship guidance.

Guidelines:
- Be warm, non-judgmental, and encouraging
- Give specific, actionable advice (not generic platitudes)
- Ask follow-up questions to understand context
- Reference the couple's history when available
- NEVER provide medical, legal, or financial advice
- If someone describes abuse or danger, provide crisis resources
- Keep responses concise (2-3 paragraphs max)
- Focus on communication, connection, and growth`;

const askSchema = z.object({
  message: z.string().min(1).max(2000),
  relationship_id: z.string().uuid(),
});

aiCoachApi.post('/ask', async (c) => {
  const body = await c.req.json();
  const { message, relationship_id } = askSchema.parse(body);
  const userId = c.get('userId');
  const supabase = c.get('supabase');

  // 1. Get conversation history (last 20 messages)
  const { data: history } = await supabase
    .from('ai_coach_messages')
    .select('role, content')
    .eq('user_id', userId)
    .eq('relationship_id', relationship_id)
    .order('created_at', { ascending: true })
    .limit(20);

  // 2. Classify and route to appropriate model
  const tier = classifyQuestion(message);
  const model = tier === 'complex'
    ? anthropic('claude-haiku-4-5')
    : openai('gpt-4o-mini');

  // 3. Generate response
  const { text } = await generateText({
    model,
    system: SYSTEM_PROMPT,
    messages: [
      ...(history || []).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: message },
    ],
  });

  // 4. Save both messages to history
  await supabase.from('ai_coach_messages').insert([
    { user_id: userId, relationship_id, role: 'user', content: message, model_used: null },
    { user_id: userId, relationship_id, role: 'assistant', content: text, model_used: tier === 'complex' ? 'claude-haiku-4-5' : 'gpt-4o-mini' },
  ]);

  return c.json({ response: text, tier, timestamp: new Date().toISOString() });
});
```

### Database Migration for Conversation History
```sql
-- Migration: 0006_ai_coach_messages.sql
CREATE TABLE IF NOT EXISTS ai_coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_coach_messages_user_rel
  ON ai_coach_messages(user_id, relationship_id, created_at);

-- Rate limit tracking (optional, for persistence across cold starts)
CREATE TABLE IF NOT EXISTS ai_coach_rate_limits (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER DEFAULT 1,
  PRIMARY KEY (user_id, window_start)
);
```

### Environment Variables Required
```bash
# Add to Vercel environment variables
ANTHROPIC_API_KEY=sk-ant-...    # Vercel AI SDK reads this automatically
OPENAI_API_KEY=sk-...           # Vercel AI SDK reads this automatically
```

The Vercel AI SDK auto-reads `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` from environment variables -- no explicit configuration needed.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Raw @anthropic-ai/sdk | Vercel AI SDK @ai-sdk/anthropic | 2024-2025 | Unified API, edge compat |
| Raw openai npm package | Vercel AI SDK @ai-sdk/openai | 2024-2025 | Same unified API |
| generateObject() | generateText() with output setting | AI SDK v6 (Dec 2025) | generateObject deprecated |
| Custom streaming SSE | streamText().toTextStreamResponse() | AI SDK v4+ | Built-in Hono support |
| express-rate-limit | Hono createMiddleware pattern | Hono ecosystem matured 2024 | Native middleware, no extra deps |

**Deprecated/outdated:**
- `generateObject()` / `streamObject()`: Deprecated in AI SDK v6. Use `generateText` with output setting instead.
- `openai-edge` package: No longer needed. The AI SDK providers handle edge compatibility natively.
- Direct `fetch()` to LLM APIs: Unnecessary complexity. AI SDK handles auth, retries, streaming.

## Open Questions

1. **Claude model tier selection**
   - What we know: claude-haiku-4-5 is cheapest and fastest. claude-sonnet-4-6 is mid-tier. claude-opus-4-6 is most capable.
   - What's unclear: Whether haiku is sufficient quality for relationship coaching or if sonnet is needed.
   - Recommendation: Start with haiku for cost efficiency. Upgrade to sonnet if response quality is insufficient in testing. The model string is a one-line change.

2. **Streaming vs non-streaming responses**
   - What we know: The AI SDK supports both. The current stub returns JSON (non-streaming).
   - What's unclear: Whether the frontend needs streaming (progressive text display) or can wait for full response.
   - Recommendation: Implement non-streaming first (`generateText`). Add a `/stream` endpoint using `streamText` as a future enhancement when the frontend is ready.

3. **Response caching strategy**
   - What we know: In-memory caching works but has low hit rates for conversational AI (most questions are unique).
   - What's unclear: What "common responses" means in practice for this app.
   - Recommendation: Cache only the system prompt classification and any truly generic FAQs. Don't over-invest in caching -- the LLM call is the core value.

4. **Rate limit tiers by subscription**
   - What we know: Payments system exists (Phase 5). Rate limits should differ by plan.
   - What's unclear: What the tier limits should be (free: 5/day? premium: 50/day?).
   - Recommendation: Make rate limits configurable per tier. Default to 20/hour for MVP, add tier logic when payment integration is complete.

## Sources

### Primary (HIGH confidence)
- [Vercel AI SDK - Hono Cookbook](https://ai-sdk.dev/cookbook/api-servers/hono) - Complete Hono integration pattern
- [Vercel AI SDK - Anthropic Provider](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic) - Provider setup, models, config
- [@ai-sdk/openai npm](https://www.npmjs.com/package/@ai-sdk/openai) - v3.0.39, latest
- [ai npm package](https://www.npmjs.com/package/ai) - v6.0.116, latest
- Existing codebase: `src/api/ai-coach.ts`, `src/lib/supabase/middleware.ts`, `src/db-supabase.ts`

### Secondary (MEDIUM confidence)
- [Vercel AI SDK 6 Blog](https://vercel.com/blog/ai-sdk-6) - v6 changes, generateObject deprecation
- [Custom Rate Limiter for Hono](https://schof.co/building-a-custom-rate-limiter-for-hono/) - Per-user rate limiting pattern
- [hono-rate-limiter GitHub](https://github.com/rhinobase/hono-rate-limiter) - Community package (621 stars)

### Tertiary (LOW confidence)
- Edge runtime compatibility for raw SDKs - mixed signals in search results, safer to use AI SDK providers
- Exact version numbers for @ai-sdk/anthropic (not found on npm directly, using "latest")

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vercel AI SDK is clearly the standard, well-documented with Hono
- Architecture: HIGH - Patterns derived from official cookbook + existing app patterns
- Pitfalls: HIGH - Edge runtime issues well-documented, conversation history limits are universal LLM best practice
- Rate limiting: MEDIUM - Custom implementation is straightforward, but production hardening may need Redis/KV

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable domain, AI SDK actively maintained)
