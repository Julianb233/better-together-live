# Discovery & Search API - Quick Reference

## 🔍 Search Endpoints

### Universal Search
```http
GET /api/search?q=travel&type=all&page=1&limit=10
```
Search everything: users, communities, posts.

### User Search
```http
GET /api/search/users?q=john&page=1&limit=20
```
Find users with connection status.

### Community Search
```http
GET /api/search/communities?q=fitness&category=interests&privacy_level=public
```
Search communities with filters.

---

## 🎯 Discovery Endpoints

### Discover Communities
```http
# Featured communities
GET /api/discover/communities?category=featured

# Popular communities
GET /api/discover/communities?category=popular

# New communities
GET /api/discover/communities?category=new

# Personalized recommendations (requires auth)
GET /api/discover/communities?category=for_you
```

### Discover Users
```http
# Find similar users/couples (requires auth)
GET /api/discover/users?page=1&limit=20
```
**Similarity Algorithm:**
- Mutual connections: 3 points
- Shared communities: 2 points
- Same relationship stage: 2 points
- Interest overlap: 1 point each

### Discover Trending
```http
# Last 24 hours
GET /api/discover/trending?timeframe=24h&limit=10

# Last week
GET /api/discover/trending?timeframe=week&limit=10
```

---

## 📊 Explore Endpoints

### Explore Categories
```http
GET /api/explore/categories
```
Get all community categories with stats.

### Explore Topics
```http
GET /api/explore/topics?limit=20
```
Get trending hashtags from recent posts.

---

## 🔐 Authentication

### Optional Auth (Enhanced Results)
- `/api/search` - Better visibility filtering
- `/api/search/users` - Connection status
- `/api/search/communities` - Membership info
- `/api/discover/trending` - Personalized visibility

### Required Auth
- `/api/discover/communities?category=for_you`
- `/api/discover/users`

### How to Authenticate
```javascript
fetch('/api/discover/users', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    // OR use cookies (automatically sent)
  }
})
```

---

## 📁 Response Formats

### Search Response
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

### User Object
```json
{
  "id": "user_123",
  "name": "John & Jane",
  "nickname": "J&J",
  "profilePhotoUrl": "https://...",
  "relationshipType": "married",
  "connectionStatus": "connected",
  "followerCount": 45
}
```

### Community Object
```json
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
```

### Post Object
```json
{
  "id": "post_789",
  "content": "Just visited Paris!",
  "contentType": "photo",
  "mediaUrls": ["https://..."],
  "likeCount": 45,
  "commentCount": 12,
  "engagementScore": 69,
  "createdAt": "2025-12-28T10:30:00Z",
  "author": {
    "id": "user_456",
    "name": "Alex & Sam",
    "profilePhotoUrl": "https://..."
  },
  "community": {
    "id": "comm_789",
    "name": "Adventure Couples"
  }
}
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "error": "Search query must be at least 2 characters"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required for personalized recommendations"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to perform search"
}
```

---

## 🎨 Frontend Integration Examples

### React Component
```typescript
import { useState, useEffect } from 'react'

function UniversalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)

  const handleSearch = async () => {
    if (query.length < 2) return

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=all`)
    const data = await res.json()
    setResults(data.results)
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Search users, communities, posts..."
      />

      {results && (
        <div>
          <h3>Users</h3>
          {results.users?.map(user => (
            <UserCard key={user.id} user={user} />
          ))}

          <h3>Communities</h3>
          {results.communities?.map(comm => (
            <CommunityCard key={comm.id} community={comm} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### Trending Content Widget
```typescript
function TrendingWidget() {
  const [trending, setTrending] = useState(null)

  useEffect(() => {
    fetch('/api/discover/trending?timeframe=24h&limit=5')
      .then(res => res.json())
      .then(data => setTrending(data))
  }, [])

  return (
    <div className="trending-widget">
      <h3>Trending Now</h3>

      <h4>Popular Posts</h4>
      {trending?.posts?.map(post => (
        <TrendingPost key={post.id} post={post} />
      ))}

      <h4>Growing Communities</h4>
      {trending?.communities?.map(comm => (
        <TrendingCommunity key={comm.id} community={comm} />
      ))}
    </div>
  )
}
```

### Discovery Page
```typescript
function DiscoveryCommunities() {
  const [category, setCategory] = useState('featured')
  const [communities, setCommunities] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetch(`/api/discover/communities?category=${category}&page=${page}`)
      .then(res => res.json())
      .then(data => setCommunities(data.communities))
  }, [category, page])

  return (
    <div>
      <nav>
        <button onClick={() => setCategory('featured')}>Featured</button>
        <button onClick={() => setCategory('popular')}>Popular</button>
        <button onClick={() => setCategory('new')}>New</button>
        <button onClick={() => setCategory('for_you')}>For You</button>
      </nav>

      <div className="communities-grid">
        {communities.map(comm => (
          <CommunityCard key={comm.id} community={comm} />
        ))}
      </div>

      <Pagination
        page={page}
        onNext={() => setPage(p => p + 1)}
        onPrev={() => setPage(p => Math.max(1, p - 1))}
      />
    </div>
  )
}
```

---

## 🔧 Common Use Cases

### 1. Search Bar with Autocomplete
```javascript
// Debounced search
const debouncedSearch = debounce(async (query) => {
  if (query.length < 2) return
  const res = await fetch(`/api/search?q=${query}&type=all&limit=5`)
  const data = await res.json()
  showAutocomplete(data.results)
}, 300)
```

### 2. "Suggested for You" Section
```javascript
// Get personalized user recommendations
const res = await fetch('/api/discover/users?limit=10', {
  headers: { 'Authorization': `Bearer ${token}` }
})
const { users } = await res.json()
```

### 3. Community Directory
```javascript
// Browse by category
const category = 'interests' // or 'relationship_stage', etc.
const res = await fetch(`/api/search/communities?q=&category=${category}`)
const { communities } = await res.json()
```

### 4. Trending Section
```javascript
// Show what's hot
const res = await fetch('/api/discover/trending?timeframe=24h&limit=10')
const { posts, communities } = await res.json()
```

### 5. Topic/Hashtag Pages
```javascript
// Show trending topics
const res = await fetch('/api/explore/topics?limit=20')
const { topics } = await res.json()

// topics = [{ topic: 'datenight', postCount: 45 }, ...]
```

---

## 🎯 Best Practices

### Performance
- Cache trending content (updates every 5-15 min)
- Debounce search input (300ms)
- Use pagination for large result sets
- Lazy load images in results

### UX
- Show "No results" message when empty
- Display loading states
- Handle errors gracefully
- Provide search suggestions
- Show result counts

### Security
- Always encode query parameters
- Validate input on frontend AND backend
- Handle 401 errors for auth-required endpoints
- Don't expose user emails in search results

---

## 📚 Additional Resources

- **Full API Docs:** `/DISCOVERY_API.md`
- **Implementation:** `/src/api/discovery.ts`
- **Summary:** `/IMPLEMENTATION_SUMMARY.md`

---

## 🚀 Quick Start

1. **Basic Search:**
   ```bash
   curl "http://localhost:8787/api/search?q=travel&type=all"
   ```

2. **Discover Communities:**
   ```bash
   curl "http://localhost:8787/api/discover/communities?category=popular"
   ```

3. **Trending Content:**
   ```bash
   curl "http://localhost:8787/api/discover/trending?timeframe=24h"
   ```

4. **With Authentication:**
   ```bash
   curl "http://localhost:8787/api/discover/users" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

---

**Last Updated:** 2025-12-28
**API Version:** 1.0
**Status:** Production Ready
