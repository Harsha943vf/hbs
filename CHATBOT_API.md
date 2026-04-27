# Chatbot API Documentation

## Base URL
```
http://localhost:8080/api/chat
```

## Endpoints

### 1. Send Message to Chatbot
**POST** `/send`

**Authentication Required:** Yes (Bearer Token)

**Request Body:**
```json
{
  "message": "Show me hotels in New York",
  "userId": 1
}
```

**Response (200 OK):**
```json
{
  "message": "Great! Here are the hotels we found based on your search:\n- The Plaza Hotel (5 stars) in New York: Luxury accommodations...",
  "sender": "bot",
  "chatMessageId": 45,
  "relevantContext": "Available Hotels:\n- The Plaza Hotel (5 stars) in New York..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized - Please login first"
}
```

**Example Curl:**
```bash
curl -X POST http://localhost:8080/api/chat/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "Hello",
    "userId": 1
  }'
```

---

### 2. Get Chat History
**GET** `/history/{userId}`

**Authentication Required:** Yes (Bearer Token)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | Long | The user ID to fetch history for |

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "sender": "user",
    "message": "Hello",
    "contextData": null,
    "createdAt": "2024-01-15T10:30:00",
    "embedding": null
  },
  {
    "id": 2,
    "userId": 1,
    "sender": "bot",
    "message": "Hello! Welcome to our hotel booking system...",
    "contextData": "General hotel booking system information",
    "createdAt": "2024-01-15T10:30:05",
    "embedding": null
  }
]
```

**Example Curl:**
```bash
curl -X GET http://localhost:8080/api/chat/history/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Clear Chat History
**DELETE** `/history/{userId}`

**Authentication Required:** Yes (Bearer Token)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | Long | The user ID to clear history for |

**Response (200 OK):**
```json
"Chat history cleared successfully"
```

**Example Curl:**
```bash
curl -X DELETE http://localhost:8080/api/chat/history/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. Health Check
**GET** `/health`

**Authentication Required:** No

**Response (200 OK):**
```json
"Chatbot service is running"
```

**Example Curl:**
```bash
curl -X GET http://localhost:8080/api/chat/health
```

---

## Request/Response Models

### ChatRequest
```java
{
  "message": "string",    // User's message
  "userId": "number"      // User ID from JWT token
}
```

### ChatResponse
```java
{
  "message": "string",           // Bot's response
  "sender": "bot",               // Always "bot"
  "chatMessageId": "number",     // ID of stored message
  "relevantContext": "string"    // Context used to generate response
}
```

### ChatMessage
```java
{
  "id": "number",
  "userId": "number",
  "sender": "string",            // "user" or "bot"
  "message": "string",
  "contextData": "string",       // Data used to generate bot response
  "createdAt": "datetime",
  "embedding": "string"          // Vector embedding (for future use)
}
```

---

## Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | User doesn't have permission |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Example Conversation Flow with API Calls

### Step 1: User Login (Get JWT Token)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": 1,
#     "email": "user@example.com",
#     ...
#   }
# }
```

### Step 2: Send Chat Message
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:8080/api/chat/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "What hotels do you have?",
    "userId": 1
  }'
```

### Step 3: Get Chat History
```bash
curl -X GET http://localhost:8080/api/chat/history/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Step 4: Clear History (Optional)
```bash
curl -X DELETE http://localhost:8080/api/chat/history/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Query Examples

The chatbot understands various query intents:

### Hotel Queries
```
"Show me hotels in New York"
"What accommodation do you offer?"
"List available hotels"
"Hotels near Times Square"
```

### Room Queries
```
"What rooms are available?"
"Show me prices"
"Do you have suites?"
"Occupancy limit?"
```

### Booking Queries
```
"How do I book?"
"What's the booking process?"
"Can I reserve a room?"
"Check-in details?"
```

### Amenities Queries
```
"What amenities do you offer?"
"Do you have WiFi?"
"Is there a pool?"
"What facilities are available?"
```

### General Queries
```
"Hello" / "Hi"
"Help me"
"What can you do?"
"Tell me more"
```

---

## Performance Notes

- **Response Time:** ~100-500ms
- **Max Message Length:** 2000 characters
- **Timeout:** 30 seconds
- **Database Queries:** Optimized with indexes on user_id and sender
- **Rate Limiting:** Not currently implemented (add as needed)

---

## Error Handling

### Invalid Request Format
```
POST /api/chat/send
Content-Type: application/json

{
  "message": "Hello"
  // Missing userId
}

Status: 400
Body: "Invalid request format"
```

### Unauthorized Access
```
GET /api/chat/history/1
// Missing Authorization header

Status: 401
Body: "Unauthorized - Please login first"
```

### User Not Found
```
GET /api/chat/history/999
Authorization: Bearer VALID_TOKEN

Status: 404
Body: "User not found"
```

---

## Testing with Postman

1. **Collection Setup:**
   - Create a new collection "HBS Chatbot API"
   - Add base URL: `http://localhost:8080/api`

2. **Variables:**
   - `token`: JWT token from login
   - `userId`: Current user ID (e.g., 1)

3. **Sample Requests:**

   **Login Request:**
   ```
   POST: /auth/login
   Headers: Content-Type: application/json
   Body: {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

   **Send Message:**
   ```
   POST: /chat/send
   Headers:
     - Content-Type: application/json
     - Authorization: Bearer {{token}}
   Body: {
     "message": "Hello",
     "userId": {{userId}}
   }
   ```

   **Get History:**
   ```
   GET: /chat/history/{{userId}}
   Headers: Authorization: Bearer {{token}}
   ```

---

## Integration Example (Frontend)

```javascript
// Frontend API call example
const sendChatMessage = async (message, userId, token) => {
  try {
    const response = await fetch('http://localhost:8080/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: message,
        userId: userId
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
```

---

## Data Privacy & Security

- ✅ JWT authentication required for all endpoints
- ✅ User can only access their own chat history
- ✅ Messages stored with user context
- ✅ No sensitive data in context
- ✅ SQL injection prevention via JPA
- ✅ XSS prevention via proper encoding

---

## Database Queries Generated

### Insert Chat Message
```sql
INSERT INTO chat_messages 
(user_id, sender, message, context_data, created_at) 
VALUES (?, ?, ?, ?, NOW())
```

### Fetch Chat History
```sql
SELECT * FROM chat_messages 
WHERE user_id = ? 
ORDER BY created_at DESC
```

### Clear History
```sql
DELETE FROM chat_messages 
WHERE user_id = ?
```

---

## Monitoring & Logging

All chat operations are logged with:
- Timestamp
- User ID
- Message content (first 100 chars)
- Response time
- Any errors

Check logs in: `logs/hotel-booking.log`

```
[2024-01-15 10:30:00] INFO: Received chat message from user: 1
[2024-01-15 10:30:01] DEBUG: Generated response using context
[2024-01-15 10:30:01] INFO: Chat message stored successfully
```

---

**API Status:** ✅ Ready for Integration
