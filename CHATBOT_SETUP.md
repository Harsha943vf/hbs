# RAG-Based Chatbot Implementation Guide

## ✅ What's Been Implemented

### Backend Components

1. **ChatMessage Model** (`model/ChatMessage.java`)
   - Stores chat messages with user IDs
   - Tracks sender (user/bot), message content, and context data
   - Includes creation timestamp and embedding field

2. **Chat DTOs**
   - `ChatRequest`: Contains message and userId
   - `ChatResponse`: Contains bot response, message ID, and relevant context

3. **ChatMessageRepository** (`repository/ChatMessageRepository.java`)
   - JPA repository for chat persistence
   - Methods: findByUserId, findRecentChats, etc.

4. **ChatService** (`service/ChatService.java`)
   - Core RAG implementation
   - Key features:
     - Intent recognition (hotels, rooms, bookings, amenities)
     - Context retrieval from database
     - Response generation
     - Conversation history management

5. **ChatController** (`controller/ChatController.java`)
   - REST endpoints:
     - `POST /api/chat/send` - Send message to chatbot
     - `GET /api/chat/history/{userId}` - Get chat history
     - `DELETE /api/chat/history/{userId}` - Clear history
     - `GET /api/chat/health` - Health check

### Frontend Components

1. **Chatbot Component** (`components/common/Chatbot.jsx`)
   - Floating chat widget
   - Features:
     - Expandable/collapsible chat window
     - Message history display
     - Real-time message sending
     - Loading states
     - Chat history clearing
     - Notification badge for new messages

2. **Integration in App.jsx**
   - Chatbot appears on all pages

## 🚀 How It Works (RAG Approach)

1. **User sends message** → ChatController receives request
2. **Intent analysis** → ChatService analyzes message to identify topic
3. **Context retrieval** → Queries database for relevant:
   - Hotel information
   - Room availability
   - Amenities
   - Booking policies
4. **Response generation** → Creates contextual response using:
   - Pattern matching
   - Retrieved context data
   - Pre-defined response templates
5. **Message storage** → Saves all interactions to database
6. **Response sent** → Returns response to frontend with context

## 📋 Setup Instructions

### Step 1: Database Migration
The ChatMessage table will be created automatically via JPA's `ddl-auto=update` setting.

```sql
-- Optional: Manual creation if needed
CREATE TABLE chat_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    sender VARCHAR(50) NOT NULL,
    message LONGTEXT,
    context_data LONGTEXT,
    created_at DATETIME,
    embedding LONGTEXT
);

CREATE INDEX idx_user_id ON chat_messages(user_id);
CREATE INDEX idx_sender ON chat_messages(sender);
```

### Step 2: Backend Setup
1. Update `pom.xml` - Already done ✓
2. Maven clean & build:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

### Step 3: Frontend Setup
1. Install dependencies (if needed):
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Step 4: Test the Chatbot
1. Open the application in browser
2. Login/Signup to access chatbot (requires authentication)
3. Click the "💬" button in bottom-right corner
4. Try queries like:
   - "Hello"
   - "Show me hotels in New York"
   - "What rooms do you have?"
   - "How do I make a booking?"
   - "Tell me about amenities"

## 🔧 Configuration Options

### Backend Configuration (application.properties)
```properties
# Chatbot settings
chatbot.enabled=true
chatbot.max-context-length=2000
chatbot.response-timeout=30000

# OpenAI (optional - for future LLM integration)
spring.ai.openai.api-key=${OPENAI_API_KEY}
spring.ai.openai.chat.options.model=gpt-3.5-turbo
```

### Environment Variable Setup
Optional for LLM integration:
```bash
export OPENAI_API_KEY=your_api_key_here
```

## 🎨 UI Customization

### Chatbot Component Location
- File: `frontend/src/components/common/Chatbot.jsx`
- Styling: Tailwind CSS classes
- Colors can be adjusted:
  - Blue (`from-blue-600 to-blue-700`) - Chat header
  - Gray (`bg-gray-200`) - Bot messages
  - Blue (`bg-blue-600`) - User messages

### Common Customizations
```javascript
// Change button position
<div className="fixed bottom-6 right-6 z-50">
  // Change bottom and right values (e.g., bottom-12 right-12)
</div>

// Change colors
className="bg-blue-600 hover:bg-blue-700"
// Available: blue, red, green, purple, etc.

// Change emoji
<span>💬</span> // Change to other emojis
<span>🤖</span> // Change to other emojis
```

## 📊 Database Schema

### ChatMessage Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key |
| user_id | BIGINT | FK to User |
| sender | VARCHAR(50) | "user" or "bot" |
| message | LONGTEXT | Message content |
| context_data | LONGTEXT | Retrieved context for response |
| created_at | DATETIME | Timestamp |
| embedding | LONGTEXT | Vector embedding (future use) |

## 🔐 Security Notes

- Chatbot endpoints require authentication (`@PreAuthorize`)
- Users can only access their own chat history
- JWT tokens are required for all chat operations
- All messages are stored with user context

## 🚀 Future Enhancements

1. **LLM Integration**
   - Replace pattern matching with OpenAI/Llama
   - Use Spring AI for embeddings
   - Implement vector search with Redis

2. **Vector Search**
   - Convert messages to embeddings
   - Semantic similarity search
   - Better context retrieval

3. **Advanced Features**
   - Multi-language support
   - Sentiment analysis
   - User satisfaction tracking
   - Admin analytics dashboard

4. **Data Synchronization**
   - Auto-update embeddings when hotels change
   - Real-time availability updates
   - Booking confirmation in chat

## 🧪 Testing the Chatbot

### Test Queries
```
1. "Hi" → Greeting response
2. "What hotels do you have?" → Shows available hotels
3. "I want to book a room" → Booking instructions
4. "What amenities are available?" → Amenities list
5. "Help me" → General help with options
```

### Expected Responses
- Clear, contextual responses
- Hotel/room data from database
- Helpful suggestions
- Call-to-action prompts

## 📝 Error Handling

The system handles:
- Missing user context
- Database connection issues
- Malformed requests
- Timeout errors
- Authentication failures

All errors are logged and user gets a friendly message.

## 🆘 Troubleshooting

### Chatbot not appearing
- ✓ Check if user is authenticated
- ✓ Verify Chatbot component is imported in App.jsx
- ✓ Check browser console for errors

### Messages not sending
- ✓ Verify backend is running (`http://localhost:8080/api/chat/health`)
- ✓ Check network tab for API calls
- ✓ Ensure JWT token is valid

### Database errors
- ✓ Run `mvn clean install`
- ✓ Clear target folder
- ✓ Restart backend service

### Chat history not loading
- ✓ Verify user is logged in
- ✓ Check userId is being passed correctly
- ✓ Verify database tables exist

## 📞 Support & Maintenance

### Monitoring
- Check logs: `logs/hotel-booking.log`
- Monitor chat history table size
- Track API response times

### Cleanup
- Periodically clear old chat messages
- Archive chat history to separate table
- Monitor database growth

## 💡 Example Usage Flow

```
User: "Hello"
Bot: "Hello! Welcome to our hotel booking system..."

User: "Show me hotels in New York"
Bot: "Great! Here are the hotels we found based on your search:
     - The Plaza Hotel (5 stars) in New York..."

User: "How much is a room there?"
Bot: "Here are the available rooms:
     - Room 101 (Suite): $250/night..."

User: "I want to book one"
Bot: "To make a booking:
     1. Search for available hotels
     2. Select your dates
     3. Choose a room..."
```

## 🎯 Key Features Summary

✅ RAG-based responses using database context
✅ Intent recognition for smart conversations
✅ Full chat history persistence
✅ Real-time message processing
✅ Secure & authenticated
✅ Responsive UI with notifications
✅ Easy customization
✅ Future-proof for LLM integration

---

**Installation Status:** ✅ Complete and Ready to Use!

Just run the backend and frontend, login, and start chatting! 🚀
