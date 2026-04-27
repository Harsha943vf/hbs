# Groq LLM Integration Setup Guide

## 🚀 What's Been Added

Your chatbot now supports **Groq LLM** for accurate, AI-powered responses!

### Features
✅ **Groq Integration** - Uses Groq's fast LLM API (mixtral-8x7b-32768)
✅ **Fallback Mode** - Falls back to pattern matching if Groq is unavailable
✅ **Free Tier Available** - Groq offers generous free tier with high rate limits
✅ **Production Ready** - Secure API key handling with environment variables
✅ **Fast Responses** - Groq is one of the fastest LLM providers (~80-100ms)

---

## 📋 Step 1: Get Groq API Key (Free)

### 1.1 Visit Groq Console
- Go to: https://console.groq.com/
- Create a free account or login

### 1.2 Create API Key
1. Click **API Keys** in the left sidebar
2. Click **Create API Key**
3. Copy your API key (looks like: `gsk_xxxxxxxxxxxx...`)

### 1.3 Free Tier Limits
- **Requests**: 30 per minute
- **Tokens**: 6,000 per minute
- **Perfect for**: Demo, testing, moderate production use
- **No credit card needed** for free tier

---

## ⚙️ Step 2: Configure Your Application

### Option A: Using Environment Variable (Recommended for Production)

```bash
# Set the environment variable
export GROQ_API_KEY="gsk_your_api_key_here"

# Then start the backend
cd backend
mvn spring-boot:run
```

### Option B: Direct Configuration (Development Only)

Edit `backend/src/main/resources/application.properties`:

```properties
groq.api.enabled=true
groq.api.key=gsk_your_api_key_here
```

### Option C: Using .env File (Recommended)

Create a `.env` file in the backend directory:

```bash
# .env (add to .gitignore!)
GROQ_API_KEY=gsk_your_api_key_here
```

Then load it before running:
```bash
source .env
mvn spring-boot:run
```

---

## 🧪 Step 3: Test Groq Integration

### 3.1 Verify Configuration
```bash
# Check if API is reachable
curl http://localhost:8080/api/chat/health
# Should return: "Chatbot service is running"
```

### 3.2 Test the Chatbot

1. **Open** `http://localhost:5174`
2. **Login** to your account
3. **Click** the 💬 button
4. **Try these messages** to see Groq in action:
   - "What is the best hotel for a family vacation?"
   - "Tell me about luxury rooms in New York"
   - "How do I book a room with special amenities?"
   - "What are your best rated hotels?"

### 3.3 Check Logs

Watch the backend logs to see Groq responses:
```bash
tail -f logs/hotel-booking.log | grep -i groq
```

Expected output:
```
[INFO] Using Groq LLM for response generation
[INFO] Generated response from Groq: The best hotel for a family...
```

---

## 🔧 How It Works

### Response Generation Flow

```
User Message
    ↓
[Groq Enabled?] 
    ├─ Yes → Call Groq API with database context
    │          ↓
    │      [Response Generated?]
    │          ├─ Yes → Return LLM response ✓
    │          └─ No → Fall back to patterns
    │
    └─ No → Use pattern-based responses
    ↓
Store Response in Database
    ↓
Send to User
```

### Why Groq?
- **Fast**: ~80-100ms response time (fastest LLM provider)
- **Accurate**: Mixtral-8x7b model is excellent for document understanding
- **Reliable**: 99.9% uptime SLA
- **Free**: Generous free tier for development
- **Easy**: Simple REST API integration

---

## 🌍 Groq Models Available

| Model | Speed | Quality | Use Case |
|-------|-------|---------|----------|
| **mixtral-8x7b-32768** | ⚡⚡⚡ Fastest | Excellent | Default choice |
| **llama2-70b-4096** | ⚡⚡ Fast | Very Good | General purpose |
| **gemma-7b-it** | ⚡⚡⚡ Fastest | Good | Quick responses |

Current: Using **mixtral-8x7b-32768** (balanced speed & quality)

---

## 📊 Configuration Options

### application.properties

```properties
# Enable/Disable Groq
groq.api.enabled=true

# API Key (uses environment variable by default)
groq.api.key=${GROQ_API_KEY:GROQ_API_KEY}
```

### Environment Variables

```bash
# Production
export GROQ_API_KEY="gsk_..."
export GROQ_API_ENABLED="true"

# Development (optional)
export GROQ_API_ENABLED="false"  # Use pattern matching
```

---

## 🛡️ Security Best Practices

### ✅ DO:
- Store API key in environment variables
- Use `.env` file + `.gitignore`
- Change API key if accidentally committed
- Monitor API usage on Groq dashboard
- Use read-only keys when possible

### ❌ DON'T:
- Commit API key to GitHub
- Share API key in logs
- Use same key across environments
- Leave free key unmonitored

### Add to .gitignore:
```
.env
.env.local
*.pem
*.key
```

---

## 🔄 Fallback Mechanism

The chatbot automatically falls back to pattern matching if:
- Groq API is disabled
- API key is invalid or missing
- Groq service is unreachable
- Rate limit exceeded
- Network timeout

**No error to user** - just uses the fallback response!

---

## 📈 Monitoring & Logs

### Check Groq Usage

**Backend logs:**
```bash
# Show Groq API calls
grep "Groq" logs/hotel-booking.log

# Show fallback to pattern matching
grep "falling back" logs/hotel-booking.log

# Show response generation time
grep "generated response" logs/hotel-booking.log
```

### Groq Console
Visit: https://console.groq.com/usage
- View API calls made
- Check current usage vs limits
- Monitor response times

---

## 💡 Tuning Response Quality

### In GroqService.java

```java
// Adjust these parameters for different responses:

// Temperature (0.0 = deterministic, 1.0 = creative)
requestBody.addProperty("temperature", 0.7);  // Lower = more factual

// Max tokens (response length)
requestBody.addProperty("max_tokens", 500);   // Lower = shorter

// Top P (diversity)
requestBody.addProperty("top_p", 1);          // Lower = more focused
```

### Recommendations:
- **Hotel queries**: `temperature: 0.5` (factual)
- **General help**: `temperature: 0.7` (balanced)
- **Creative**: `temperature: 0.9` (creative)

---

## 🚨 Troubleshooting

### Issue: "API key is invalid"
```
ERROR: Groq API returned 401
```
**Solution:**
- Check API key spelling
- Verify it starts with `gsk_`
- Regenerate from console if needed

### Issue: "Rate limit exceeded"
```
ERROR: Groq API returned 429
```
**Solution:**
- Upgrade to paid tier (if high usage)
- Implement caching layer
- Use fallback responses for burst traffic

### Issue: "Timeout connecting to Groq"
```
ERROR: Connection timeout
```
**Solution:**
- Check internet connection
- Verify firewall allows outbound HTTPS
- Check if Groq service is down (https://status.groq.com/)

### Issue: "Falls back to pattern matching"
```
INFO: Using pattern-based response generation
```
**Solution:**
- Verify `groq.api.enabled=true` in application.properties
- Check API key is set: `echo $GROQ_API_KEY`
- Check logs: `grep "ERROR" logs/hotel-booking.log`

---

## 🎯 Example Prompts

Try these in the chatbot to see Groq in action:

### Hotel Queries
```
"What are your luxury hotels in New York?"
"Recommend a pet-friendly hotel"
"Which hotels have the best amenities?"
"Show me 5-star rated properties"
```

### Room Queries
```
"What's the most affordable room type?"
"Do you have suites with ocean views?"
"Which rooms fit a large family?"
```

### Booking Help
```
"I want to book a hotel for my honeymoon"
"Can I modify my reservation?"
"What's your cancellation policy?"
```

### General Assistance
```
"Tell me about your hotel booking process"
"What payment methods do you accept?"
"Is there a loyalty program?"
```

---

## 📱 API Details

### Groq LLM Endpoint
- **Base**: `https://api.groq.com/openai/v1/chat/completions`
- **Method**: POST
- **Auth**: Bearer token in header
- **Format**: OpenAI compatible

### Request Example
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful hotel booking assistant..."
    },
    {
      "role": "user",
      "content": "What hotels do you have?"
    }
  ],
  "model": "mixtral-8x7b-32768",
  "temperature": 0.7,
  "max_tokens": 500
}
```

### Response Example
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "We have several excellent hotels available..."
      }
    }
  ]
}
```

---

## 🎓 Learning Resources

- **Groq Docs**: https://console.groq.com/docs
- **API Reference**: https://console.groq.com/docs/api-reference
- **Rate Limits**: https://console.groq.com/docs/rate-limits
- **Status Page**: https://status.groq.com/

---

## 🚀 Next Steps

1. ✅ Get Groq API key (1 minute)
2. ✅ Set environment variable (1 minute)
3. ✅ Restart backend (auto-detected)
4. ✅ Test in chatbot (2 minutes)
5. ✅ Monitor logs for "Using Groq LLM"

---

## ✨ Benefits

With Groq LLM integration, your chatbot now:

- ✅ **Understands context** - Not just pattern matching
- ✅ **Generates natural language** - Conversational responses  
- ✅ **Handles complex queries** - Multi-step reasoning
- ✅ **Learns from context** - Uses actual database data
- ✅ **Fast responses** - Groq's speed advantage
- ✅ **Fallback support** - Never fails completely

---

## 📞 Support

**Having issues?**
1. Check logs: `tail logs/hotel-booking.log`
2. Verify API key: `echo $GROQ_API_KEY`
3. Test endpoint: `curl https://api.groq.com/openai/v1/models -H "Authorization: Bearer YOUR_KEY"`
4. Check Groq status: https://status.groq.com/

---

**Status**: ✅ Ready for Groq Integration

All code is in place. Just add your API key and restart! 🎉
