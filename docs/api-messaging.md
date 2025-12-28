# Messaging API Documentation

## Overview

The Messaging API provides a complete direct messaging and group chat system for Better Together Live. It supports one-on-one conversations, group chats, message editing, read receipts, and notification muting.

**Base URL**: `/api/conversations`

**Authentication**: All endpoints require JWT authentication via `requireAuth` middleware.

---

## Database Schema Reference

### Tables Used

- `conversations` - Conversation metadata (direct or group)
- `conversation_participants` - User participation in conversations
- `messages` - Individual messages
- `user_blocks` - Blocked users (prevents messaging)

---

## API Endpoints

### 1. List Conversations

**GET** `/api/conversations`

Get all conversations for the authenticated user, sorted by most recent activity.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number for pagination |
| `limit` | integer | 20 | Number of conversations per page |

#### Response

```json
{
  "conversations": [
    {
      "id": "conv_1234567890_abc123",
      "type": "direct",
      "name": null,
      "avatar_url": null,
      "participants": [
        {
          "id": "user_123",
          "name": "Jane Smith",
          "nickname": "Jane",
          "profile_photo_url": "https://...",
          "role": "member"
        }
      ],
      "last_message_at": "2025-12-28T10:30:00Z",
      "last_message_preview": "Hey, how are you?",
      "unread_count": 3,
      "is_muted": false,
      "created_at": "2025-12-20T08:00:00Z"
    },
    {
      "id": "conv_1234567890_xyz789",
      "type": "group",
      "name": "Planning Committee",
      "avatar_url": "https://...",
      "participants": [
        {
          "id": "user_456",
          "name": "Bob Jones",
          "nickname": "Bob",
          "profile_photo_url": "https://...",
          "role": "owner"
        },
        {
          "id": "user_789",
          "name": "Alice Brown",
          "nickname": "Alice",
          "profile_photo_url": "https://...",
          "role": "member"
        }
      ],
      "last_message_at": "2025-12-28T09:15:00Z",
      "last_message_preview": "Let's meet tomorrow",
      "unread_count": 0,
      "is_muted": false,
      "created_at": "2025-12-15T12:00:00Z"
    }
  ],
  "page": 1,
  "limit": 20,
  "hasMore": false
}
```

#### Notes

- Excludes conversations where user has left (left_at IS NULL)
- Unread count calculated based on messages after last_read_at
- Participants list excludes the current user for direct messages
- Sorted by last_message_at DESC, then created_at DESC

---

### 2. Create or Get Conversation

**POST** `/api/conversations`

Create a new conversation or return existing direct conversation.

#### Request Body

**For Direct Message:**

```json
{
  "participant_id": "user_123"
}
```

**For Group Chat:**

```json
{
  "type": "group",
  "name": "Weekend Planning",
  "participant_ids": ["user_123", "user_456", "user_789"]
}
```

#### Response

**201 Created** (new conversation)

```json
{
  "conversation": {
    "id": "conv_1234567890_abc123",
    "type": "direct",
    "name": null,
    "avatar_url": null,
    "created_by": "user_current",
    "last_message_at": null,
    "last_message_preview": null,
    "created_at": "2025-12-28T10:00:00Z",
    "updated_at": "2025-12-28T10:00:00Z",
    "participants": [
      {
        "id": "user_current",
        "name": "Current User",
        "nickname": "Me",
        "profile_photo_url": "https://..."
      },
      {
        "id": "user_123",
        "name": "Jane Smith",
        "nickname": "Jane",
        "profile_photo_url": "https://..."
      }
    ]
  },
  "isNew": true
}
```

**200 OK** (existing conversation)

```json
{
  "conversation": { ... },
  "isNew": false
}
```

#### Error Responses

- `400 Bad Request` - Missing required fields
- `403 Forbidden` - User is blocked
- `401 Unauthorized` - Not authenticated

#### Notes

- For direct messages, if conversation exists, returns existing
- For groups, requires at least 2 participants plus creator
- Group name is required for group conversations
- Creator is automatically added as 'owner' for groups
- Checks user_blocks table to prevent messaging blocked users

---

### 3. Get Conversation Details

**GET** `/api/conversations/:id`

Get detailed information about a specific conversation.

#### Response

```json
{
  "conversation": {
    "id": "conv_1234567890_abc123",
    "type": "direct",
    "name": null,
    "avatar_url": null,
    "created_by": "user_123",
    "last_message_at": "2025-12-28T10:30:00Z",
    "last_message_preview": "Hey, how are you?",
    "created_at": "2025-12-20T08:00:00Z",
    "updated_at": "2025-12-28T10:30:00Z",
    "last_read_at": "2025-12-28T09:00:00Z",
    "is_muted": false,
    "role": "member",
    "participants": [
      {
        "id": "user_123",
        "name": "Jane Smith",
        "nickname": "Jane",
        "profile_photo_url": "https://...",
        "role": "member",
        "joined_at": "2025-12-20T08:00:00Z"
      },
      {
        "id": "user_456",
        "name": "Current User",
        "nickname": "Me",
        "profile_photo_url": "https://...",
        "role": "member",
        "joined_at": "2025-12-20T08:00:00Z"
      }
    ]
  }
}
```

#### Error Responses

- `403 Forbidden` - Not a participant
- `404 Not Found` - Conversation doesn't exist

---

### 4. Get Messages

**GET** `/api/conversations/:id/messages`

Retrieve paginated messages from a conversation.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Max messages to return (default: 50) |
| `before_id` | string | Get messages before this message ID (pagination backwards) |
| `after_id` | string | Get messages after this message ID (pagination forwards) |

#### Response

```json
{
  "messages": [
    {
      "id": "msg_1234567890_abc123",
      "conversation_id": "conv_1234567890_xyz789",
      "sender": {
        "id": "user_123",
        "name": "Jane Smith",
        "nickname": "Jane",
        "profile_photo_url": "https://..."
      },
      "message_type": "text",
      "content": "Hey, how are you?",
      "media_url": null,
      "shared_activity_id": null,
      "shared_post_id": null,
      "shared_challenge_id": null,
      "is_edited": false,
      "edited_at": null,
      "created_at": "2025-12-28T10:30:00Z"
    },
    {
      "id": "msg_1234567890_def456",
      "conversation_id": "conv_1234567890_xyz789",
      "sender": {
        "id": "user_456",
        "name": "Current User",
        "nickname": "Me",
        "profile_photo_url": "https://..."
      },
      "message_type": "image",
      "content": "Check this out!",
      "media_url": "https://storage.example.com/image.jpg",
      "shared_activity_id": null,
      "shared_post_id": null,
      "shared_challenge_id": null,
      "is_edited": false,
      "edited_at": null,
      "created_at": "2025-12-28T10:31:00Z"
    }
  ],
  "hasMore": true
}
```

#### Message Types

- `text` - Plain text message
- `image` - Image with optional text caption
- `activity_share` - Shared activity from activities table
- `post_share` - Shared post from posts table
- `challenge_share` - Shared challenge from challenges table

#### Pagination

- Default: Returns most recent 50 messages
- Use `before_id` to load older messages (scroll up)
- Use `after_id` to load newer messages (scroll down)
- Messages are returned oldest first (reversed from query order)

#### Error Responses

- `403 Forbidden` - Not a participant

---

### 5. Send Message

**POST** `/api/conversations/:id/messages`

Send a new message to a conversation.

#### Request Body

**Text Message:**

```json
{
  "content": "Hello, how are you doing today?",
  "message_type": "text"
}
```

**Image Message:**

```json
{
  "content": "Check this out!",
  "media_url": "https://storage.example.com/photo.jpg",
  "message_type": "image"
}
```

**Activity Share:**

```json
{
  "content": "We should try this!",
  "message_type": "activity_share",
  "shared_activity_id": "activity_123"
}
```

#### Response

**201 Created**

```json
{
  "message": {
    "id": "msg_1234567890_abc123",
    "conversation_id": "conv_1234567890_xyz789",
    "sender": {
      "id": "user_current",
      "name": "Current User",
      "nickname": "Me",
      "profile_photo_url": "https://..."
    },
    "message_type": "text",
    "content": "Hello, how are you doing today?",
    "media_url": null,
    "shared_activity_id": null,
    "shared_post_id": null,
    "shared_challenge_id": null,
    "created_at": "2025-12-28T10:35:00Z"
  }
}
```

#### Validation

- At least one of: `content`, `media_url`, or `shared_*_id` required
- Content is sanitized and limited to 5000 characters
- Rate limited to 60 messages per minute per user

#### Error Responses

- `400 Bad Request` - Invalid input
- `403 Forbidden` - Not a participant
- `429 Too Many Requests` - Rate limit exceeded

#### Side Effects

- Updates conversation `last_message_at` and `last_message_preview`
- Triggers may send push notifications to other participants

---

### 6. Edit Message

**PUT** `/api/conversations/:id/messages/:messageId`

Edit an existing message (within 15 minute time window).

#### Request Body

```json
{
  "content": "Updated message text"
}
```

#### Response

```json
{
  "message": {
    "id": "msg_1234567890_abc123",
    "content": "Updated message text",
    "is_edited": true,
    "edited_at": "2025-12-28T10:40:00Z",
    "created_at": "2025-12-28T10:30:00Z"
  }
}
```

#### Restrictions

- Only sender can edit
- Must edit within 15 minutes of sending
- Sets `is_edited = true` and `edited_at` timestamp
- Content is sanitized

#### Error Responses

- `403 Forbidden` - Not the sender or time window expired
- `404 Not Found` - Message doesn't exist

---

### 7. Delete Message

**DELETE** `/api/conversations/:id/messages/:messageId`

Soft delete a message (only sender can delete).

#### Response

```json
{
  "success": true,
  "message": "Message deleted"
}
```

#### Notes

- Soft delete (sets `deleted_at` timestamp)
- Only sender can delete
- Deleted messages are excluded from message queries

#### Error Responses

- `403 Forbidden` - Not the sender
- `404 Not Found` - Message doesn't exist

---

### 8. Mark Conversation as Read

**POST** `/api/conversations/:id/read`

Update the user's `last_read_at` timestamp to mark messages as read.

#### Response

```json
{
  "success": true,
  "message": "Marked as read"
}
```

#### Notes

- Updates `last_read_at` to current timestamp
- Affects unread count calculation
- Should be called when user views conversation

#### Error Responses

- `403 Forbidden` - Not a participant

---

### 9. Mute/Unmute Conversation

**PUT** `/api/conversations/:id/mute`

Toggle notification muting for a conversation.

#### Request Body

```json
{
  "is_muted": true
}
```

#### Response

```json
{
  "success": true,
  "is_muted": true,
  "message": "Conversation muted"
}
```

#### Notes

- Only affects current user's notifications
- Muted conversations still appear in conversation list
- Other participants are not affected

---

### 10. Leave Group Conversation

**POST** `/api/conversations/:id/leave`

Leave a group conversation (sets `left_at` timestamp).

#### Response

```json
{
  "success": true,
  "message": "Left conversation"
}
```

#### Restrictions

- Only works for group conversations
- Cannot leave direct messages
- Sets `left_at` timestamp in `conversation_participants`

#### Error Responses

- `400 Bad Request` - Trying to leave direct conversation
- `403 Forbidden` - Not a participant

---

### 11. Add Participants to Group

**POST** `/api/conversations/:id/participants`

Add new participants to a group conversation (admin/owner only).

#### Request Body

```json
{
  "participant_ids": ["user_789", "user_012"]
}
```

#### Response

```json
{
  "success": true,
  "added_count": 2,
  "message": "Added 2 participant(s)"
}
```

#### Restrictions

- Only group conversations
- Only owners/admins can add participants
- Skips users already in conversation
- New participants added with 'member' role

#### Error Responses

- `400 Bad Request` - Invalid input or direct conversation
- `403 Forbidden` - Not admin/owner

---

## Security Features

### Block Prevention

All conversation creation and message sending checks the `user_blocks` table to prevent:
- Creating conversations with blocked users
- Sending messages to blocked users
- Being messaged by blocked users

### Rate Limiting

Messages are rate limited to **60 messages per minute** per user to prevent spam.

### Authorization

All endpoints verify:
1. User is authenticated (JWT)
2. User is a participant in the conversation (where applicable)
3. User has not left the conversation (`left_at IS NULL`)

### Input Sanitization

- Message content is trimmed and limited to 5000 characters
- Content is sanitized to prevent injection attacks
- Media URLs should be validated before storage (implement in client/upload service)

---

## Performance Considerations

### Indexes Used

```sql
-- Conversation participants by user
idx_conversation_participants_user ON conversation_participants(user_id) WHERE left_at IS NULL

-- Messages by conversation
idx_messages_conversation_created ON messages(conversation_id, created_at DESC) WHERE deleted_at IS NULL

-- Conversations by last activity
idx_conversations_last_message ON conversations(last_message_at DESC)
```

### Pagination

- Use `before_id` / `after_id` for cursor-based pagination
- Avoid large offsets for better performance
- Default limit of 50 messages balances UX and performance

### Denormalization

- `last_message_at` and `last_message_preview` stored in conversations table
- Updated via trigger on message insert
- Reduces joins for conversation list queries

---

## WebSocket Integration (Future)

The messaging API is designed to work with real-time updates via WebSockets:

1. **Send message via POST** - Creates message in database
2. **Broadcast via WebSocket** - Push to connected clients in real-time
3. **Mark as read via POST** - Updates read receipt

Recommended WebSocket events:
- `message.new` - New message received
- `message.edited` - Message was edited
- `message.deleted` - Message was deleted
- `conversation.typing` - User is typing
- `conversation.read` - Messages marked as read

---

## Usage Examples

### Creating a Direct Conversation

```typescript
// Create or get existing conversation
const response = await fetch('/api/conversations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    participant_id: 'user_123'
  })
})

const { conversation, isNew } = await response.json()

if (isNew) {
  console.log('New conversation created!')
} else {
  console.log('Existing conversation found')
}
```

### Sending a Message

```typescript
const response = await fetch(`/api/conversations/${conversationId}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Hello!',
    message_type: 'text'
  })
})

const { message } = await response.json()
```

### Loading Older Messages

```typescript
// First load
const response1 = await fetch(`/api/conversations/${conversationId}/messages?limit=50`, {
  headers: { 'Authorization': `Bearer ${accessToken}` }
})
const { messages, hasMore } = await response1.json()

// Load more (pagination)
if (hasMore) {
  const oldestMessageId = messages[0].id
  const response2 = await fetch(
    `/api/conversations/${conversationId}/messages?before_id=${oldestMessageId}&limit=50`,
    { headers: { 'Authorization': `Bearer ${accessToken}` } }
  )
  const { messages: olderMessages } = await response2.json()
}
```

### Marking as Read

```typescript
await fetch(`/api/conversations/${conversationId}/read`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${accessToken}` }
})
```

---

## Error Codes Reference

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Not authorized for this action |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

---

## Future Enhancements

1. **Message Reactions** - Allow emoji reactions to messages
2. **Message Threads** - Reply to specific messages
3. **Voice Messages** - Support audio messages
4. **File Attachments** - Support document sharing
5. **Message Search** - Full-text search across conversations
6. **Archived Conversations** - Archive/unarchive conversations
7. **Message Forwarding** - Forward messages to other conversations
8. **Read Receipts** - Show who has read each message
9. **Typing Indicators** - Show when users are typing
10. **Message Pinning** - Pin important messages in group chats
