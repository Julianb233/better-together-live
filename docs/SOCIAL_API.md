# Social Interactions API Documentation

Complete API for reactions, comments, connections, blocks, and content moderation.

## Authentication

All endpoints (except GET requests for public content) require authentication via JWT token:
- Header: `Authorization: Bearer <token>`
- Cookie: `bt_access_token=<token>`

## Endpoints Overview

### Reactions (19 endpoints total)

#### Posts

**React to Post**
```
POST /api/posts/:postId/reactions
Body: { "reaction_type": "like" | "love" | "celebrate" | "support" | "insightful" }
```
- Upserts reaction (creates new or updates existing)
- Automatically updates post.like_count via database trigger
- Returns 201 on create, 200 on update

**Remove Reaction from Post**
```
DELETE /api/posts/:postId/reactions
```
- Removes user's reaction
- Decrements like_count automatically

**Get Post Reactions**
```
GET /api/posts/:postId/reactions?type=like
```
- Returns grouped reactions with counts and user details
- Optional `type` filter for specific reaction type
- Response format:
```json
{
  "reactions": {
    "like": {
      "count": 5,
      "users": [
        {
          "user_id": "...",
          "name": "...",
          "profile_photo_url": "...",
          "reacted_at": "..."
        }
      ]
    },
    "love": { "count": 3, "users": [...] }
  },
  "total": 8
}
```

#### Comments

**React to Comment**
```
POST /api/comments/:commentId/reactions
Body: { "reaction_type": "like" | "love" | "celebrate" | "support" | "insightful" }
```
- Same behavior as post reactions
- Updates comment.like_count via trigger

**Remove Reaction from Comment**
```
DELETE /api/comments/:commentId/reactions
```

---

### Comments (4 endpoints)

**Get Comments on Post**
```
GET /api/posts/:postId/comments?page=1&limit=20&sort=newest
```
- Query params:
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 20, max: 100)
  - `sort`: `newest` | `oldest` | `popular`
- Returns top-level comments with reply counts
- Includes user's reactions if authenticated
- Response:
```json
{
  "comments": [
    {
      "id": "...",
      "content": "...",
      "author_name": "...",
      "author_photo": "...",
      "like_count": 5,
      "reply_count": 2,
      "user_reaction": "like",
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "has_more": true
  }
}
```

**Create Comment**
```
POST /api/posts/:postId/comments
Body: {
  "content": "Great post!",
  "parent_comment_id": "..." // Optional - for replies
}
```
- Max length: 2000 characters
- Max nesting depth: 2 levels (comment → reply only)
- Checks for blocks before allowing comment
- Returns comment with author info

**Update Comment**
```
PUT /api/comments/:id
Body: { "content": "Updated content" }
```
- Only author can update
- Max length: 2000 characters
- Updates `updated_at` timestamp

**Delete Comment**
```
DELETE /api/comments/:id
```
- Soft delete (sets `deleted_at`)
- Can be deleted by:
  - Comment author
  - Post author
- Returns 403 if unauthorized

---

### Connections (5 endpoints)

**Get Connections**
```
GET /api/connections?type=followers&status=accepted&page=1&limit=20
```
- Query params:
  - `type`: `followers` | `following` | `friends` (required)
  - `status`: `pending` | `accepted` | `rejected` (default: accepted)
  - `page`, `limit`: Pagination
- Returns user info with connection metadata

**Follow User**
```
POST /api/connections/:userId/follow
```
- Creates follow connection with `status=accepted`
- Checks for blocks before allowing
- Returns 400 if already following

**Unfollow User**
```
DELETE /api/connections/:userId/unfollow
```
- Removes follow connection
- Always succeeds (idempotent)

**Send Friend Request**
```
POST /api/connections/:userId/friend
```
- Creates connection with `type=friend`, `status=pending`
- Checks for blocks
- Returns 400 if already friends or request pending

**Accept/Reject Friend Request**
```
PUT /api/connections/:userId/friend
Body: { "action": "accept" | "reject" }
```
- For accepting: Creates reciprocal connection (bidirectional friendship)
- For rejecting: Updates status to `rejected`
- Only recipient of friend request can use this endpoint

**Get Follow Suggestions**
```
GET /api/connections/suggestions?limit=10
```
- Returns users with mutual connections
- Excludes already-connected users and blocked users
- Sorted by mutual connection count + randomization
- Default limit: 10, max: 20

---

### Blocks (3 endpoints)

**Block User**
```
POST /api/blocks/:userId
Body: {
  "reason": "spam" | "harassment" | "inappropriate" | "other",
  "notes": "Optional description"
}
```
- Creates block record
- Auto-unfollows in both directions
- Removes user from shared conversations (marks as `left`)
- Prevents all future interactions

**Unblock User**
```
DELETE /api/blocks/:userId
```
- Removes block
- Does NOT restore previous connections

**List Blocked Users**
```
GET /api/blocks
```
- Returns all users blocked by current user
- Includes block reason and timestamp

---

### Reports (1 endpoint)

**Report Content**
```
POST /api/reports
Body: {
  "target_type": "post" | "comment" | "message" | "user" | "community",
  "target_id": "...",
  "reason": "spam" | "harassment" | "hate_speech" | "violence" | "inappropriate" | "misinformation" | "copyright" | "other",
  "description": "Optional detailed description"
}
```
- Creates moderation report with `status=pending`
- Prevents duplicate reports (same user, same target, within 24 hours)
- Returns report ID for tracking

---

## Security Features

### Block Checking
- All social interactions check for blocks before proceeding
- Blocked users cannot:
  - React to posts/comments
  - Comment on posts
  - Follow or friend request
  - See content from blocker

### Rate Limiting
Built into authentication middleware via `checkRateLimit()`:
- 5 attempts per 15-minute window
- Applied to authentication endpoints

### Permission Checks
- **Comments**: Only author or post author can delete
- **Reactions**: No special permissions (public action)
- **Friend Requests**: Only recipient can accept/reject
- **Blocks**: Only blocker can unblock

### Content Validation
- Comment length: Max 2000 characters
- Nesting depth: Max 2 levels
- Reaction types: Validated against whitelist
- Report reasons: Validated against enum

---

## Database Triggers (Automatic)

The following counts are updated automatically via PostgreSQL triggers:

1. **post.like_count** - Incremented/decremented on reaction insert/delete
2. **comment.like_count** - Incremented/decremented on reaction insert/delete
3. **post.comment_count** - Incremented/decremented on comment insert/delete
4. **community.member_count** - Updated on member status changes

No manual count updates needed in application code.

---

## Error Responses

All endpoints return consistent error format:
```json
{
  "error": "Human-readable error message"
}
```

Common HTTP status codes:
- `400`: Bad request (validation error)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (blocked or permission denied)
- `404`: Not found (resource doesn't exist)
- `500`: Internal server error

---

## Example Usage

### React to a post
```bash
curl -X POST https://api.better-together.live/api/posts/abc123/reactions \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reaction_type":"love"}'
```

### Add a comment with reply
```bash
# Top-level comment
curl -X POST https://api.better-together.live/api/posts/abc123/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Great post! Really helpful."}'

# Reply to comment
curl -X POST https://api.better-together.live/api/posts/abc123/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"I agree!","parent_comment_id":"comment-xyz"}'
```

### Follow a user
```bash
curl -X POST https://api.better-together.live/api/connections/user-456/follow \
  -H "Authorization: Bearer $TOKEN"
```

### Block a user
```bash
curl -X POST https://api.better-together.live/api/blocks/user-789 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason":"spam","notes":"Posting inappropriate content"}'
```

### Report a post
```bash
curl -X POST https://api.better-together.live/api/reports \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "target_type":"post",
    "target_id":"post-123",
    "reason":"inappropriate",
    "description":"Contains explicit content without age gate"
  }'
```

---

## Implementation Notes

### Performance Optimizations
1. **Denormalized counts**: All counts stored directly on parent records
2. **Database triggers**: Automatic count updates, no application overhead
3. **Indexed queries**: All foreign keys and frequently-queried columns indexed
4. **Pagination**: All list endpoints support pagination
5. **Selective fields**: Reactions endpoint returns only necessary user fields

### Scalability Considerations
- Soft deletes allow for content recovery and audit trails
- Polymorphic reactions table supports future expansion (reactions on other entities)
- Status enums allow for future workflow states (e.g., "reported", "flagged")
- JSONB fields in schema support flexible metadata without schema changes

### Future Enhancements
- [ ] Reaction animations/badges for high counts
- [ ] Comment sorting by "best" (engagement score)
- [ ] Notification system for reactions/comments/follows
- [ ] Batch operations for moderation
- [ ] Real-time updates via WebSockets
- [ ] Comment edit history
- [ ] Reaction analytics (trending posts)

---

## Related Files

- **Implementation**: `/src/api/social.ts` (1048 lines)
- **Database Schema**: `/migrations/0005_community_features.sql`
- **Authentication**: `/src/api/auth.ts`
- **Type Definitions**: `/src/types.ts`
- **Utilities**: `/src/utils.ts`

---

**Last Updated**: 2024-12-28
**API Version**: 1.0
**Status**: Production Ready ✅
