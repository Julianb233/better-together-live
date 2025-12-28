# Community Features Database Schema

## Overview
Migration `0005_community_features.sql` adds comprehensive social networking capabilities to Better Together Live, enabling couples to connect, share, and engage with community content.

## Schema Design Philosophy

### Normalization Strategy
- **Hybrid approach**: Normalized core data with strategic denormalization for read performance
- **Denormalized counts**: `member_count`, `like_count`, `comment_count` updated via triggers
- **Performance-first**: Composite indexes on common query patterns

### Technology Decisions
- **PostgreSQL/Neon compatible**: Uses TEXT IDs, DATETIME timestamps, and PostgreSQL triggers
- **Soft deletes**: `deleted_at` timestamps preserve data for analytics and recovery
- **Polymorphic relationships**: Reactions and reports support multiple target types
- **JSONB for flexibility**: Notification preferences, media arrays stored as JSON

## Table Relationships

### Community Structure
```
communities (1) ─── (*) community_members ─── (1) users
                                          └─── (1) relationships (optional)
                └─── (*) community_invites
                └─── (*) posts
```

### Content & Engagement
```
posts (1) ─── (*) comments ─── (1) users
                          └─── (*) comments (nested)
      └─── (*) reactions ─── (1) users

comments (1) ─── (*) reactions ─── (1) users
```

### Social Graph
```
users (1) ─── (*) user_connections (follower_id)
         └─── (*) user_connections (following_id)
         └─── (*) user_blocks (blocker_id)
         └─── (*) user_blocks (blocked_id)
```

### Messaging
```
conversations (1) ─── (*) conversation_participants ─── (1) users
              └─── (*) messages ─── (1) users
```

## Key Tables

### 1. Communities
**Purpose**: Groups for couples with shared interests
**Key Features**:
- Privacy levels: public, private, invite_only
- Categories: relationship_stage, interests, location, support, lifestyle
- Verification and featured status
- Denormalized member_count for performance

**Indexes**:
- `slug` (unique lookup)
- `category` (filtering)
- `is_featured, member_count DESC` (discovery)

### 2. Posts
**Purpose**: Activity feed content with rich media support
**Content Types**:
- `text`: Regular posts
- `photo`: Photo sharing
- `activity`: Linked to activities table
- `milestone`: Relationship milestones
- `challenge_complete`: Challenge completion
- `achievement`: Achievement unlocks

**Visibility Levels**:
- `public`: Everyone
- `community`: Community members only
- `connections`: Friends/followers
- `private`: Author only

**Performance Optimizations**:
- Denormalized `like_count`, `comment_count`, `share_count`
- Composite indexes: `(community_id, created_at)`, `(author_id, created_at)`
- Partial indexes exclude soft-deleted content

### 3. Reactions
**Purpose**: Multi-type engagement (LinkedIn-style)
**Types**: like, love, celebrate, support, insightful
**Constraint**: One reaction per user per target (polymorphic)

### 4. Messages & Conversations
**Features**:
- Direct and group conversations
- Rich message types (text, image, activity_share, post_share)
- Read receipts via `last_read_at`
- Mute settings per participant

### 5. Content Reports
**Purpose**: User-driven moderation
**Workflow**: pending → under_review → action_taken/dismissed
**Target Types**: post, comment, message, user, community

## Performance Optimizations

### Denormalized Counts (Auto-Updated via Triggers)
1. **communities.member_count**: Updated when community_members status changes
2. **posts.like_count**: Updated when reactions added/removed
3. **comments.like_count**: Updated when reactions added/removed
4. **posts.comment_count**: Updated when comments added/removed
5. **conversations.last_message_at**: Updated when messages inserted

### Index Strategy
- **Composite indexes** for common query patterns (e.g., feed queries)
- **Partial indexes** excluding deleted content
- **Covering indexes** for read-heavy operations
- **Unique constraints** for data integrity

### Query Patterns Optimized
```sql
-- Community feed (most common query)
SELECT * FROM posts
WHERE community_id = ? AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;
-- Uses: idx_posts_community_created

-- User connections (followers/following)
SELECT * FROM user_connections
WHERE follower_id = ? AND status = 'accepted';
-- Uses: idx_user_connections_follower

-- Conversation messages (paginated)
SELECT * FROM messages
WHERE conversation_id = ? AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 50;
-- Uses: idx_messages_conversation_created
```

## Scalability Considerations

### Current Design Supports
- **Communities**: Millions (indexed on slug, category)
- **Posts**: Billions (partitionable by created_at)
- **Messages**: Billions (partitionable by conversation_id)
- **Reactions**: Billions (composite index on target)

### Future Scaling Strategies
1. **Horizontal partitioning**: Partition posts/messages by date range
2. **Caching layer**: Redis for hot content (trending posts, active communities)
3. **Read replicas**: Separate read/write workloads
4. **CDN**: Media URLs stored as TEXT, served via CDN

## Migration Checklist

### Before Running Migration
- [ ] Backup production database
- [ ] Review migration in staging environment
- [ ] Verify PostgreSQL version compatibility (triggers use plpgsql)
- [ ] Estimate migration time (< 1 second for empty tables)

### After Running Migration
- [ ] Verify all tables created: `\dt` in psql
- [ ] Verify all indexes created: `\di`
- [ ] Test triggers with sample data
- [ ] Update TypeScript types (src/types/community.ts)
- [ ] Implement API endpoints
- [ ] Update API documentation

## Integration Points

### Existing Tables Referenced
- `users` (via foreign keys)
- `relationships` (for couple membership)
- `activities` (for activity sharing)
- `challenges` (for challenge sharing)
- `achievements` (for achievement posts)

### New API Endpoints Needed
```
POST   /communities
GET    /communities/:slug
POST   /communities/:id/join
GET    /communities/:id/posts
POST   /posts
GET    /feed (personalized)
POST   /posts/:id/reactions
POST   /posts/:id/comments
GET    /conversations
POST   /conversations/:id/messages
POST   /connections/follow
GET    /connections/followers
```

## TypeScript Types Example

```typescript
// src/types/community.ts
export interface Community {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImageUrl?: string;
  privacyLevel: 'public' | 'private' | 'invite_only';
  category: 'relationship_stage' | 'interests' | 'location' | 'support' | 'lifestyle' | 'other';
  createdBy: string;
  memberCount: number;
  postCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  authorId: string;
  relationshipId?: string;
  communityId?: string;
  contentType: 'text' | 'photo' | 'activity' | 'milestone' | 'challenge_complete' | 'achievement';
  content?: string;
  mediaUrls?: string[];
  visibility: 'public' | 'community' | 'connections' | 'private';
  isPinned: boolean;
  isFeatured: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## Testing Recommendations

### Unit Tests
- Test trigger functions with sample data
- Verify unique constraints (reactions, connections)
- Test soft delete behavior

### Integration Tests
- Feed aggregation performance (< 100ms)
- Notification generation on reactions/comments
- Block functionality prevents interaction

### Load Tests
- 1000 concurrent users browsing feed
- 100 posts/second sustained write load
- Message delivery latency < 500ms

## Security Considerations

### Access Control
- Row-level security for private communities
- Block list enforcement at query level
- Moderator permissions for content_reports

### Data Privacy
- Soft deletes preserve audit trail
- User blocks prevent data leakage
- Message deletion cascades properly

### Rate Limiting (Application Layer)
- Post creation: 10/hour per user
- Comments: 100/hour per user
- Reactions: 1000/hour per user
- Messages: 100/hour per conversation

## Monitoring Metrics

### Health Indicators
- Average feed load time
- Reaction latency (trigger execution)
- Message delivery time
- Moderation queue depth

### Growth Metrics
- Daily active communities
- Posts per day
- Messages per day
- Reaction rate (reactions/posts)

## Maintenance Tasks

### Daily
- Monitor trigger execution times
- Review content_reports queue
- Check for blocked/banned users

### Weekly
- Analyze slow query log
- Review index usage (unused indexes)
- Clean up expired invites

### Monthly
- Vacuum analyze all tables
- Review denormalized count accuracy
- Archive old messages (optional)
