# Chatbot: Quick Start Guide 🚀

## 1️⃣ One-Command Setup

```bash
# Backend
cd backend
mvn clean install
mvn spring-boot:run

# Frontend (in another terminal)
cd frontend
npm run dev
```

## 2️⃣ That's It! 

The chatbot is now ready to use. Just:
- Go to `http://localhost:5173` (or your frontend URL)
- **Login** to your account
- Click the **💬 button** in the bottom-right corner
- **Start chatting!**

## 📝 What You Can Ask

Try these example messages:

### Hotels
```
"Show me hotels in New York"
"What hotels do you have?"
"List available accommodations"
```

### Rooms
```
"What rooms are available?"
"Show me prices"
"Do you have luxury suites?"
```

### Booking
```
"How do I book a room?"
"What's your booking process?"
"When can I check in?"
```

### Help
```
"Help me"
"Hi" / "Hello"
"What can you do?"
```

## 🛠️ Files Created/Modified

### Backend (Java/Spring Boot)
```
✅ src/main/java/com/hotelbooking/
  ├── model/ChatMessage.java (NEW)
  ├── dto/request/ChatRequest.java (NEW)
  ├── dto/response/ChatResponse.java (NEW)
  ├── repository/ChatMessageRepository.java (NEW)
  ├── service/ChatService.java (NEW)
  ├── controller/ChatController.java (NEW)
  └── repository/RoomRepository.java (UPDATED)

✅ pom.xml (UPDATED - Added dependencies)
✅ application.properties (UPDATED - Added chatbot config)
```

### Frontend (React)
```
✅ src/components/common/Chatbot.jsx (NEW)
✅ App.jsx (UPDATED - Imported Chatbot)
```

### Documentation
```
✅ CHATBOT_SETUP.md (NEW - Detailed setup guide)
✅ CHATBOT_API.md (NEW - Complete API documentation)
✅ CHATBOT_QUICKSTART.md (THIS FILE)
```

## ✨ Key Features

- **RAG-Based**: Retrieves context from database
- **Smart Intent Recognition**: Understands what you're asking
- **Chat History**: Saves all conversations
- **Multi-user**: Each user has their own chat history
- **Secure**: JWT authentication required
- **Real-time**: Instant responses with UI updates

## 🔍 Verify It's Working

### 1. Backend Health Check
```bash
curl http://localhost:8080/api/chat/health
# Response: "Chatbot service is running"
```

### 2. Check Database
```sql
-- Login to MySQL
mysql -u root -p

-- Use your database
USE hotel_booking;

-- Check the table was created
SHOW TABLES LIKE 'chat_messages';

-- View sample data
SELECT * FROM chat_messages LIMIT 5;
```

### 3. Frontend Console
- Open DevTools (F12)
- Check Console tab for any errors
- Check Network tab to verify API calls

## 🚨 Common Issues & Fixes

### Issue: "Chatbot button not showing"
**Solution:**
- ✅ Make sure you're logged in
- ✅ Check if `Chatbot` component is imported in `App.jsx`
- ✅ Clear browser cache and reload

### Issue: "Messages not sending"
**Solution:**
- ✅ Check backend is running: `http://localhost:8080/api/chat/health`
- ✅ Check JWT token is valid
- ✅ Look in browser Network tab for errors

### Issue: "Database connection error"
**Solution:**
- ✅ Verify MySQL is running
- ✅ Check credentials in `application.properties`
- ✅ Run `mvn clean install` to rebuild

### Issue: "CORS errors"
**Solution:**
- Already configured in SecurityConfig
- No additional changes needed

## 📊 Database Table

The chatbot automatically creates this table:

```sql
CREATE TABLE chat_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    sender VARCHAR(50),
    message LONGTEXT,
    context_data LONGTEXT,
    created_at DATETIME,
    embedding LONGTEXT
);
```

## 🎨 Customization (5 mins)

### Change Button Emoji
File: `frontend/src/components/common/Chatbot.jsx`

```javascript
// Line ~200 (in button)
<button>
  {isOpen ? '✕' : '💬'}  // Change 💬 to any emoji
</button>
```

### Change Colors
File: `frontend/src/components/common/Chatbot.jsx`

```javascript
// Header background
className="bg-gradient-to-r from-blue-600 to-blue-700"
// Change blue-600, blue-700 to other colors

// User message background
className="bg-blue-600"  
// Change to any Tailwind color
```

### Change Button Position
File: `frontend/src/components/common/Chatbot.jsx`

```javascript
<div className="fixed bottom-6 right-6 z-50">
  // Change bottom-6 and right-6 values
  // Examples: bottom-20, right-20 (bigger gaps)
</div>
```

## 📈 Next Steps

1. **Test with sample data**: Ask about hotels, rooms, bookings
2. **Customize appearance**: Change colors, emoji, text
3. **Monitor usage**: Check `logs/hotel-booking.log`
4. **Scale up**: Add more intent patterns in `ChatService.java`
5. **Future**: Integrate with OpenAI for smarter responses

## 🔗 Integration Points

The chatbot integrates with your existing:
- ✅ User authentication (JWT)
- ✅ Hotel database
- ✅ Room database
- ✅ Booking system
- ✅ User context

No breaking changes to existing code!

## 📞 API Endpoints

```
POST   /api/chat/send              - Send message
GET    /api/chat/history/{userId}  - Get chat history
DELETE /api/chat/history/{userId}  - Clear history
GET    /api/chat/health            - Health check
```

All require JWT authentication except `/health`

## 🎯 Success Criteria

✅ Chatbot button visible in bottom-right
✅ Can send and receive messages
✅ Chat history is saved
✅ Messages are contextual (about hotels/rooms)
✅ Backend logs show no errors
✅ Database stores messages

## 🏁 You're All Set!

Your RAG-based hotel chatbot is now live! 🎉

**Features implemented:**
- ✅ Intent recognition
- ✅ Context retrieval from database
- ✅ Multi-turn conversations
- ✅ Chat history persistence
- ✅ Secure authentication
- ✅ Beautiful responsive UI
- ✅ Real-time message processing

**Ready to handle:**
- Hotel inquiries
- Room availability questions
- Booking assistance
- General help requests

Start the servers and enjoy! 🚀
