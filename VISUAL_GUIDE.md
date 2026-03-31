# 🎯 VISUAL GUIDE: Fixing the 403 Error

## Problem You're Seeing

```
Browser Console Error:
❌ Failed to load resource: the server responded with a status of 403 (Forbidden)
❌ :5173/api/bookings:1
```

---

## What This Means

```
USER                              SERVER
  │                                 │
  ├─ Tries to book a room           │
  │                                 │
  ├─ Sends request to              │
  └──────────────────────────► POST /api/bookings
                                    │
                              Server checks:
                              "Do you have a token?"
                                    │
                               Token missing!
                                    │
                   ❌ 403 Forbidden ◄──────
                                    │
  ◄──────────────────────────────────┘
  
  Browser shows: 403 Forbidden
```

---

## The 3-Step Fix

### Step 1️⃣: Start Services (If Not Already Running)

```
┌─────────────────────────────────────────────────┐
│           TERMINAL 1: BACKEND                   │
├─────────────────────────────────────────────────┤
│ $ cd backend                                    │
│ $ ./mvnw spring-boot:run                        │
│                                                 │
│ ✅ Waiting for: "Started HotelBookingApp"      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│           TERMINAL 2: FRONTEND                  │
├─────────────────────────────────────────────────┤
│ $ cd frontend                                   │
│ $ npm run dev                                   │
│                                                 │
│ ✅ Opens: http://localhost:5173               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         TERMINAL 3: DATABASE (Optional)         │
├─────────────────────────────────────────────────┤
│ $ brew services start mysql                     │
│                                                 │
│ ✅ MySQL running on :3306                     │
└─────────────────────────────────────────────────┘
```

### Step 2️⃣: Login to Get Token

```
BROWSER
┌──────────────────────────────────────────────────────┐
│ http://localhost:5173/login                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ Sign In                                        │ │
│  ├────────────────────────────────────────────────┤ │
│  │                                                │ │
│  │ Email:    user@example.com                   │ │
│  │ Password: User@123                            │ │
│  │                                                │ │
│  │  [Sign In Button]                            │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  Click "Sign In" →                                  │
│  Backend generates JWT token ✅                    │
│  Frontend stores in localStorage ✅                │
│  You see success message ✅                        │
│                                                      │
└──────────────────────────────────────────────────────┘

WHAT HAPPENS BEHIND THE SCENES:

1. Frontend sends: POST /api/auth/login
   { email: "user@example.com", password: "User@123" }
   
2. Backend validates credentials
   
3. Backend returns:
   {
     id: 1,
     email: "user@example.com",
     firstName: "John",
     token: "eyJhbGciOiJIUzI1NiIs..."  ← JWT Token!
   }
   
4. Frontend stores token:
   localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIs...')
   
5. Frontend stores user:
   localStorage.setItem('user', '{"id":1,"email":"..."}')
   
✅ NOW YOU HAVE A TOKEN!
```

### Step 3️⃣: Try Booking Again

```
BROWSER
┌──────────────────────────────────────────────────────┐
│ http://localhost:5173                                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. Search Hotels  [Search button clicked]          │
│                                                      │
│  2. See Results                                      │
│     ┌─────────────────────────────────────────────┐ │
│     │ Luxury Hotel - New York                    │ │
│     │ Room: 150/night                            │ │
│     │ [Book Now] ← Click this                    │ │
│     └─────────────────────────────────────────────┘ │
│                                                      │
│  3. Redirected to Booking Page                      │
│     ┌─────────────────────────────────────────────┐ │
│     │ Confirm Your Booking                       │ │
│     │                                            │ │
│     │ Guests: [2]                                │ │
│     │ Requests: [Extra pillow]                   │ │
│     │                                            │ │
│     │ [Confirm Booking] ← Click this            │ │
│     └─────────────────────────────────────────────┘ │
│                                                      │
│  ✅ NOW IT WORKS! (No 403 error)                   │
│                                                      │
│  Success! Booking Reference: BK-2026-04-01-001     │
│                                                      │
└──────────────────────────────────────────────────────┘

WHAT'S DIFFERENT NOW:

BEFORE (403 Error):
  Browser → API request
  WITHOUT token
  ↓
  Server: "No token? 403 Forbidden!"
  ↓
  ❌ Error

AFTER (Works):
  Browser → API request
  WITH token in header:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  ↓
  Server: "Token is valid! ✅"
  ↓
  Server processes booking
  ↓
  ✅ Success!
```

---

## How Token Gets Added Automatically

```
FRONTEND CODE (axios.js):

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    ↑ Token is added here automatically! ↑
  }
  return config
})

EVERY API CALL NOW INCLUDES:
  Header: Authorization: Bearer eyJhbGc...
```

---

## Visual Token Flow

```
┌────────────────────────────────────────────────────────────┐
│                   HOW AUTHENTICATION WORKS                  │
└────────────────────────────────────────────────────────────┘

[1] USER ACTION
    ↓
    User clicks "Sign In"
    
[2] LOGIN REQUEST
    ↓
    POST /api/auth/login
    { email, password }
    
[3] BACKEND VALIDATES
    ↓
    Check database for user
    Verify password hash
    
[4] TOKEN GENERATED
    ↓
    Create JWT: eyJhbGciOiJIUzI1NiIs...
    
[5] RESPONSE SENT
    ↓
    { token, user data }
    
[6] TOKEN STORED
    ↓
    localStorage.setItem('token', token)
    
[7] API INTERCEPTOR
    ↓
    Every request adds:
    Authorization: Bearer <token>
    
[8] PROTECTED REQUEST
    ↓
    POST /api/bookings
    Header: Authorization: Bearer <token>
    
[9] BACKEND VALIDATES TOKEN
    ↓
    Extract token from header
    Verify JWT signature
    Check if not expired
    
[10] REQUEST PROCESSED
    ↓
    ✅ Valid token → Process booking
    ❌ Invalid/missing → 403 Forbidden
```

---

## Debugging Checklist

```
✓ Is backend running?
  Check: http://localhost:8080/actuator/health

✓ Is frontend running?
  Check: http://localhost:5173

✓ Did you login?
  Browser console: localStorage.getItem('token')
  Should return: eyJhbGciOiJIUzI1NiIs...
  If NULL: Need to login

✓ Is token being sent?
  Open DevTools → Network tab
  Make booking request
  Click request
  Check "Request Headers"
  Should have: Authorization: Bearer eyJhbGc...

✓ Is MySQL running?
  Command: mysql -u root -pBittu1302 -e "SELECT 1;"
  Should return: 1
```

---

## If Still Getting 403

```
┌─────────────────────────────────────────────────┐
│            TROUBLESHOOTING TREE                 │
└─────────────────────────────────────────────────┘

Still seeing 403?
    ↓
Check: localStorage.getItem('token')
    ├─ NULL → Login again! 
    │   Go to /login and sign in
    │
    └─ Has value → Token exists
         ↓
         Check: Authorization header in request
         (Open DevTools → Network tab)
              ├─ Missing → axios interceptor issue
              │   Try: Reload page (F5)
              │   Try: Restart frontend (npm run dev)
              │
              └─ Present → Backend validation issue
                   Check: Backend logs
                   tail -f backend/logs/hotel-booking.log
                   Look for: "JWT validation failed"
```

---

## Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| 403 Forbidden | No valid token | Login first |
| 401 Unauthorized | Token expired | Login again |
| Network Error | Backend not running | Start backend |
| Cannot find module | Dependencies missing | `npm install` |
| Port 8080 in use | Backend already running | `lsof -ti :8080 \| xargs kill -9` |

---

## Success Indicators

```
You'll know it's working when:

✅ Backend started with:
   "Started HotelBookingApplication in 5.123s"

✅ Frontend started with:
   "VITE v4.x.x  ready in XXX ms"

✅ Can see token after login:
   localStorage.getItem('token')
   Returns: "eyJhbGciOiJIUzI1NiIs..."

✅ Can see user after login:
   localStorage.getItem('user')
   Returns: {"id":1,"email":"user@example.com"...}

✅ Booking request succeeds:
   No 403 error
   See booking confirmation
   Get booking reference number

✅ Booking appears in /bookings:
   Can see your bookings
   Can cancel booking
```

---

## Quick Reference

| When | What to Do | Command |
|------|-----------|---------|
| First time | Install deps | `npm install` |
| Every time | Start backend | `./mvnw spring-boot:run` |
| Every time | Start frontend | `npm run dev` |
| Before booking | Login | Go to /login |
| Stuck | Run diagnostics | `bash diagnose.sh` |
| Lost | Read guides | See docs folder |

---

## The Bottom Line

```
WHY YOU GET 403:
  User not logged in → No token → 403 error
  
HOW TO FIX:
  Login → Get token → Token sent with requests → No more 403
  
IS THIS A BUG?
  No! It's a security feature.
  Bookings should only be created by authenticated users.
  
IS IT WORKING CORRECTLY?
  Yes! 403 = "Not allowed" = "Please login first"
  
WHAT NEXT?
  Login and try booking again!
```

---

## Navigation Guide

```
Starting Fresh?
├─ Read: QUICK_FIX.md (this page but detailed)
├─ Or: Read: PROJECT_COMPLETE.md (overview)
└─ Or: Read: README.md (general info)

Setup Issues?
└─ Read: SETUP_GUIDE.md (comprehensive setup)

Understanding 403?
└─ Read: AUTHENTICATION_GUIDE.md (deep dive)

Component Details?
└─ Read: BOOKING_COMPONENTS_GUIDE.md (React docs)

Want Everything?
└─ Read: COMPLETE_GUIDE.md (full documentation)
```

---

**Remember:** 403 is not an error with your code. It's the API correctly telling you: "You must login first!" 🔐

Once you login and have a token, everything works perfectly! ✅
