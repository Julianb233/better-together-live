# Activity Feed and Posts API Documentation

## Overview
The Feed and Posts APIs provide social networking functionality for Better Together Live, enabling users to share content, view personalized feeds, and interact within communities.

---

## Posts API

Base URL: `/api/posts`

### Create Post
**POST** `/api/posts`

Create a new post in the activity feed.

**Request Body:**
```json
{
  "authorId": "user_123",
  "content": "Had an amazing date night!",
  "mediaUrls": ["https://example.com/photo.jpg"],
  "visibility": "public",
  "communityId": "comm_456",  // Optional
  "contentType": "text",       // Optional: text, photo, activity, milestone, challenge_complete, achievement
  "relationshipId": "rel_789", // Optional: post as couple
  "linkedActivityId": "act_111", // Optional
  "linkedChallengeId": "chal_222", // Optional
  "linkedAchievementId": "ach_333" // Optional
}
```

**Validation:**
- `authorId` is required
- Either `content` OR `mediaUrls` is required
- `visibility` is required (public, community, connections, private)
- If `communityId` is provided, author must be an active member

**Response:**
```json
{
  "success": true,
  "post": {
    "id": "post_123",
    "authorId": "user_123",
    "authorName": "John Doe",
    "authorPhoto": "https://...",
    "content": "Had an amazing date night!",
    "mediaUrls": ["https://example.com/photo.jpg"],
    "visibility": "public",
    "likeCount": 0,
    "commentCount": 0,
    "shareCount": 0,
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

---

### Get Post
**GET** `/api/posts/:id?userId=user_123`

Retrieve a single post with author information and user's reaction.

**Query Parameters:**
- `userId` (optional): For permission checking and retrieving user's reaction

**Visibility Checks:**
- `private`: Only author can access
- `community`: Must be an active community member
- `connections`: Must be following the author or be the author
- `public`: Anyone can access
- Blocked users cannot see posts

**Response:**
```json
{
  "id": "post_123",
  "authorId": "user_123",
  "authorName": "John Doe",
  "authorPhoto": "https://...",
  "content": "Content here",
  "mediaUrls": [],
  "visibility": "public",
  "isPinned": false,
  "isFeatured": false,
  "likeCount": 15,
  "commentCount": 3,
  "shareCount": 2,
  "userReaction": "love",  // or null if no reaction
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

### Update Post
**PUT** `/api/posts/:id`

Update an existing post. Only the author can update.

**Request Body:**
```json
{
  "userId": "user_123",
  "content": "Updated content",
  "mediaUrls": ["https://example.com/new-photo.jpg"],
  "visibility": "connections"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Post updated"
}
```

---

### Delete Post
**DELETE** `/api/posts/:id?userId=user_123`

Soft delete a post. Can be deleted by:
- Post author
- Community moderators (if posted in a community)

**Response:**
```json
{
  "success": true,
  "message": "Post deleted"
}
```

---

### Share Post
**POST** `/api/posts/:id/share`

Share a post to your feed or a community.

**Request Body:**
```json
{
  "userId": "user_123",
  "content": "Check this out!",  // Optional custom message
  "visibility": "connections",
  "communityId": "comm_456"  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "sharePostId": "post_456",
  "message": "Post shared successfully"
}
```

---

## Feed API

Base URL: `/api/feed`

### Get Personalized Feed
**GET** `/api/feed?userId=user_123&page=1&limit=20&filter=all`

Get a personalized activity feed with engagement-based ranking.

**Query Parameters:**
- `userId` (required): Current user ID
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `filter` (optional, default: all):
  - `all`: Communities + connections + public posts
  - `communities`: Only posts from user's communities
  - `connections`: Only posts from users you follow

**Feed Algorithm:**
- Aggregates posts from user's communities, connections, and public posts
- Ranks by engagement score: `(likes × 1.0 + comments × 2.0 + shares × 3.0 + featured_boost + pinned_boost) / time_decay`
- Time decay factor: Recent posts ranked higher
- Filters out blocked users
- Respects visibility settings

**Response:**
```json
{
  "posts": [
    {
      "id": "post_123",
      "authorId": "user_456",
      "authorName": "Jane Smith",
      "authorPhoto": "https://...",
      "communityId": "comm_789",
      "communityName": "Newlyweds",
      "content": "Content here",
      "mediaUrls": [],
      "likeCount": 25,
      "commentCount": 8,
      "shareCount": 3,
      "userReaction": "love",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

---

### Get Trending Posts
**GET** `/api/feed/trending?timeframe=24h&page=1&limit=20&userId=user_123`

Get trending public posts based on engagement.

**Query Parameters:**
- `timeframe` (optional, default: 24h): 24h, week, month
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `userId` (optional): For retrieving user reactions

**Trending Algorithm:**
- `trending_score = (likes × 1.0 + comments × 3.0 + shares × 5.0) / (hours_since_posted ^ 1.8)`
- Only public posts
- Weighted heavily toward recency and shares
- Higher weight on comments (indicates engagement)

**Response:**
```json
{
  "posts": [...],
  "timeframe": "24h",
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

---

### Get Community Feed
**GET** `/api/feed/community/:communityId?userId=user_123&page=1&limit=20&pinnedFirst=true`

Get posts from a specific community.

**Query Parameters:**
- `userId` (optional): For permission checking
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page
- `pinnedFirst` (optional, default: false): Show pinned posts first

**Access Control:**
- Public communities: Anyone can view
- Private/invite-only: Must be an active member

**Response:**
```json
{
  "posts": [...],
  "communityId": "comm_123",
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

---

### Get User Feed
**GET** `/api/feed/user/:userId?viewerId=user_456&page=1&limit=20`

Get posts from a specific user's profile.

**Query Parameters:**
- `viewerId` (optional): User viewing the feed (for permission checking)
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page

**Visibility Rules:**
- If viewing own profile: Show all posts
- If connected: Show public + connections posts
- If not connected: Show only public posts
- Blocked users: Access denied

**Response:**
```json
{
  "posts": [...],
  "userId": "user_123",
  "userName": "John Doe",
  "page": 1,
  "limit": 20,
  "hasMore": false
}
```

---

## Feed Algorithm Details

### Personalized Feed Ranking
The feed uses an engagement-based ranking algorithm:

```
engagement_score = (
  like_count × 1.0 +
  comment_count × 2.0 +
  share_count × 3.0 +
  (is_featured ? 100 : 0) +
  (is_pinned ? 50 : 0)
) / ((hours_since_posted + 2) ^ 1.5)
```

**Features:**
- **Time decay**: Recent posts prioritized with decay factor of 1.5
- **Engagement weights**: Comments > Likes, Shares > Comments
- **Boost factors**: Featured posts get 100pt boost, pinned posts get 50pt
- **Recency bias**: +2 hours prevents division by zero and gives new posts a chance

### Trending Feed Ranking
```
trending_score = (
  like_count × 1.0 +
  comment_count × 3.0 +
  share_count × 5.0
) / (hours_since_posted ^ 1.8)
```

**Features:**
- **Stronger time decay**: 1.8 exponent favors very recent content
- **Share emphasis**: Shares weighted 5x (viral content indicator)
- **Comment emphasis**: Comments weighted 3x (deep engagement)
- **Public only**: Only shows posts with public visibility

---

## Security & Privacy

### Visibility Control
- **public**: Visible to everyone
- **community**: Only visible to community members
- **connections**: Only visible to followers/connections
- **private**: Only visible to author

### Blocked Users
- Posts from blocked users are filtered out
- Blocked users cannot view your posts

### Community Access
- Private communities require active membership
- Moderators can delete posts in their communities
- Community post counts are updated automatically

---

## Performance Optimizations

### Denormalized Counts
- `like_count`, `comment_count`, `share_count` stored on posts
- Updated via database triggers for real-time accuracy
- No need to count on every request

### Indexes
- `idx_posts_community_created`: Fast community feed queries
- `idx_posts_author_created`: Fast user profile queries
- `idx_posts_visibility_created`: Fast public post queries
- `idx_posts_featured`: Fast featured post queries

### Pagination
- Standard limit/offset pagination
- Default limit: 20 posts
- `hasMore` indicates if more results exist

---

## Integration Examples

### Create a Post with Photo
```javascript
const response = await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    authorId: currentUser.id,
    content: 'Beautiful sunset on our date night!',
    mediaUrls: [uploadedPhotoUrl],
    visibility: 'public',
    relationshipId: currentUser.relationshipId
  })
})
```

### Load Personalized Feed
```javascript
const response = await fetch(`/api/feed?userId=${userId}&page=1&limit=20&filter=all`)
const { posts, hasMore } = await response.json()
```

### Get Trending Posts
```javascript
const response = await fetch('/api/feed/trending?timeframe=week&userId=' + userId)
const { posts } = await response.json()
```

### Share a Post
```javascript
const response = await fetch(`/api/posts/${postId}/share`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUser.id,
    content: 'This is so relatable!',
    visibility: 'connections'
  })
})
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Either content or media URLs required"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied - not a member"
}
```

### 404 Not Found
```json
{
  "error": "Post not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create post"
}
```

---

## Database Schema Reference

### Posts Table
```sql
CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  relationship_id TEXT,
  community_id TEXT,
  content_type TEXT DEFAULT 'text',
  content TEXT,
  media_urls TEXT,  -- JSON array
  linked_activity_id TEXT,
  linked_challenge_id TEXT,
  linked_achievement_id TEXT,
  visibility TEXT DEFAULT 'public',
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME
);
```

### Related Tables
- `users`: Author information
- `communities`: Community information
- `reactions`: User reactions to posts
- `comments`: Post comments
- `user_connections`: Following relationships
- `user_blocks`: Blocked users
- `community_members`: Community membership
