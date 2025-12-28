# Discovery and Search API Documentation

## Overview
The Discovery and Search API provides comprehensive search, discovery, and recommendation functionality for Better Together Live's social features.

**File:** `/src/api/discovery.ts`

---

## Search Endpoints

### 1. Universal Search
**GET** `/api/search`

Search across users, communities, and posts in a single query.

**Query Parameters:**
- `q` (required) - Search query (min 2 characters)
- `type` (optional) - Result type: `all`, `users`, `communities`, `posts` (default: `all`)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 10)

**Features:**
- Searches user names and nicknames
- Searches community names and descriptions
- Searches post content (public posts only, or based on user permissions)
- Excludes blocked users automatically
- Smart ranking (exact matches, prefix matches, relevance)
- Grouped results by type

**Response:**
```json
{
  "query": "travel",
  "type": "all",
  "results": {
    "users": [...],
    "communities": [...],
    "posts": [...]
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "hasMore": true
  }
}
```

**Authentication:** Optional (public search available, enhanced for authenticated users)

---

### 2. User Search
**GET** `/api/search/users`

Search for users with detailed connection status.

**Query Parameters:**
- `q` (required) - Search query (min 2 characters)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 20)

**Features:**
- Connection status: `connected`, `pending_sent`, `pending_received`, `none`
- Shows follower counts
- Excludes blocked users
- Shows relationship type (dating, engaged, married, partnership)
- Smart ranking by relevance and follower count

**Response:**
```json
{
  "users": [
    {
      "id": "user_123",
      "name": "John & Jane",
      "nickname": "J&J",
      "profilePhotoUrl": "https://...",
      "relationshipType": "married",
      "connectionStatus": "connected",
      "followerCount": 45
    }
  ],
  "pagination": { ... }
}
```

**Authentication:** Optional (enhanced for authenticated users)

---

### 3. Community Search
**GET** `/api/search/communities`

Search communities with advanced filtering.

**Query Parameters:**
- `q` (required) - Search query (min 2 characters)
- `category` (optional) - Filter by category
- `privacy_level` (optional) - Filter by privacy (`public`, `private`, `invite_only`)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 20)

**Features:**
- Filters by category and privacy level
- Shows membership status for authenticated users
- Prioritizes featured and verified communities
- Only shows public communities (unless user is member)

**Response:**
```json
{
  "communities": [
    {
      "id": "comm_123",
      "name": "Travel Couples",
      "slug": "travel-couples",
      "description": "For couples who love to travel",
      "coverImageUrl": "https://...",
      "category": "interests",
      "privacyLevel": "public",
      "memberCount": 1234,
      "postCount": 567,
      "isVerified": true,
      "isFeatured": true,
      "membershipStatus": "active",
      "membershipRole": "member"
    }
  ],
  "pagination": { ... }
}
```

**Authentication:** Optional (enhanced for authenticated users)

---

## Discovery Endpoints

### 4. Discover Communities
**GET** `/api/discover/communities`

Discover communities based on different categories.

**Query Parameters:**
- `category` (required) - Discovery category:
  - `featured` - Featured and verified communities
  - `popular` - Most popular by member count
  - `new` - Newest communities
  - `for_you` - Personalized recommendations (requires auth)
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 20)

**Recommendation Logic (for_you):**
- Communities joined by your connections (weight: 3)
- Popular communities (weight: 1)
- Filters out communities you're already in

**Response:**
```json
{
  "category": "for_you",
  "communities": [ ... ],
  "pagination": { ... }
}
```

**Authentication:**
- Optional for `featured`, `popular`, `new`
- Required for `for_you`

---

### 5. Discover Users
**GET** `/api/discover/users`

Discover users/couples based on similarity score.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 20)

**Similarity Algorithm:**
```
Similarity Score =
  (mutual_connections × 3) +
  (shared_communities × 2) +
  (same_relationship_stage × 2) +
  (interest_overlap × 1)
```

**Features:**
- Finds users with mutual connections
- Identifies shared community memberships
- Matches by relationship stage (dating, engaged, married)
- Excludes users you're already following
- Excludes blocked users
- Requires at least one connection factor to appear in results

**Response:**
```json
{
  "users": [
    {
      "id": "user_456",
      "name": "Alex & Sam",
      "nickname": "A&S",
      "profilePhotoUrl": "https://...",
      "relationshipType": "engaged",
      "similarityScore": 8,
      "followerCount": 32
    }
  ],
  "pagination": { ... }
}
```

**Authentication:** Required

---

### 6. Discover Trending
**GET** `/api/discover/trending`

Get trending posts and communities.

**Query Parameters:**
- `timeframe` (optional) - Time window: `24h`, `week` (default: `24h`)
- `limit` (optional) - Results per item type (default: 10)

**Features:**
- **Trending Posts:** Ranked by engagement score (likes + comments × 2)
- **Trending Communities:** Ranked by recent member growth
- Respects post visibility (public, connections, community)
- Excludes blocked users

**Response:**
```json
{
  "timeframe": "24h",
  "posts": [
    {
      "id": "post_789",
      "content": "Just visited Paris!",
      "contentType": "photo",
      "mediaUrls": ["https://..."],
      "likeCount": 45,
      "commentCount": 12,
      "engagementScore": 69,
      "createdAt": "2025-12-28T10:30:00Z",
      "author": { ... },
      "community": { ... }
    }
  ],
  "communities": [
    {
      "id": "comm_456",
      "name": "Newlyweds Network",
      "memberCount": 567,
      "recentJoins": 23,
      ...
    }
  ]
}
```

**Authentication:** Optional (enhanced for authenticated users)

---

## Explore Endpoints

### 7. Explore Categories
**GET** `/api/explore/categories`

Get all community categories with statistics.

**Features:**
- Lists all available categories
- Shows community count per category
- Shows total member count per category

**Response:**
```json
{
  "categories": [
    {
      "id": "relationship_stage",
      "name": "Relationship Stage",
      "description": "Groups by relationship phase: newlyweds, long-distance, etc.",
      "communityCount": 45,
      "totalMembers": 12345
    },
    {
      "id": "interests",
      "name": "Interests",
      "description": "Shared hobbies: travel, fitness, cooking, etc.",
      "communityCount": 78,
      "totalMembers": 23456
    },
    ...
  ]
}
```

**Available Categories:**
- `relationship_stage` - Relationship phase groups
- `interests` - Hobby-based communities
- `location` - City/region-based
- `support` - Therapy and support groups
- `lifestyle` - DINK, parents, lifestyle choices
- `other` - Miscellaneous

**Authentication:** Not required

---

### 8. Explore Topics
**GET** `/api/explore/topics`

Get trending hashtags/topics from recent posts.

**Query Parameters:**
- `limit` (optional) - Max number of topics (default: 20)

**Features:**
- Extracts hashtags from posts in last 7 days
- Counts mentions per hashtag
- Sorted by popularity

**Response:**
```json
{
  "topics": [
    {
      "topic": "datenight",
      "postCount": 45
    },
    {
      "topic": "anniversary",
      "postCount": 32
    },
    ...
  ]
}
```

**Authentication:** Not required

---

## Security Features

### Automatic Protections
1. **Blocked Users:** Automatically filtered from all search and discovery results
2. **Privacy Levels:** Respects community privacy settings
3. **Post Visibility:** Enforces post visibility rules (public, connections, community, private)
4. **Authentication:** Optional for most endpoints, required for personalized features

### Query Requirements
- Minimum 2 characters for search queries
- Input sanitization via SQL parameterization
- SQL injection protection through Neon PostgreSQL prepared statements

---

## Performance Optimizations

### Database Indexes Used
- `idx_communities_featured` - Fast featured community lookup
- `idx_posts_visibility_created` - Efficient post filtering
- `idx_user_connections_follower` - Quick connection lookups
- `idx_community_members_user` - Fast membership checks

### Query Optimizations
- Denormalized counts (member_count, like_count, etc.)
- Smart LIMIT/OFFSET pagination
- Conditional JOINs based on authentication status
- Efficient EXISTS checks for visibility filtering

---

## Integration Examples

### Basic Search
```javascript
// Universal search
const response = await fetch('/api/search?q=travel&type=all&page=1&limit=10')
const data = await response.json()
```

### Personalized Discovery
```javascript
// Get personalized community recommendations
const response = await fetch('/api/discover/communities?category=for_you', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
const data = await response.json()
```

### Trending Content
```javascript
// Get trending in last 24 hours
const response = await fetch('/api/discover/trending?timeframe=24h&limit=10')
const data = await response.json()
```

---

## Error Responses

**400 Bad Request**
```json
{
  "error": "Search query must be at least 2 characters"
}
```

**401 Unauthorized**
```json
{
  "error": "Authentication required for personalized recommendations"
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to perform search"
}
```

---

## Dependencies

### Required Tables
- `users` - User profiles
- `communities` - Community data
- `community_members` - Membership tracking
- `posts` - Post content
- `user_connections` - Social graph
- `user_blocks` - Block list
- `relationships` - Partner relationships

### Required API Utilities
- `createDatabase()` - Database connection
- `verifyToken()` - JWT verification
- `extractToken()` - Token extraction from headers/cookies

---

## Future Enhancements

### Potential Additions
1. **Advanced Filters:**
   - Location-based search
   - Date range filters
   - Content type filters

2. **Search Analytics:**
   - Track popular search terms
   - Search result click-through rates

3. **Smart Recommendations:**
   - ML-based user similarity
   - Content-based filtering
   - Collaborative filtering

4. **Full-Text Search:**
   - PostgreSQL FTS for better relevance
   - Fuzzy matching for typos
   - Multi-language support

5. **Search History:**
   - Recent searches
   - Saved searches
   - Search suggestions

---

## Testing Checklist

- [ ] Universal search returns correct result types
- [ ] Search excludes blocked users
- [ ] Discovery respects privacy levels
- [ ] Similarity scores calculate correctly
- [ ] Trending content sorts by engagement
- [ ] Pagination works across all endpoints
- [ ] Authentication is enforced where required
- [ ] Error handling for invalid queries
- [ ] SQL injection protection verified
- [ ] Performance tested with large datasets
