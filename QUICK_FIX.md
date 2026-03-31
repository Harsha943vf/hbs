# 🚀 QUICK REFERENCE - 403 Error Fix

## Problem
```
Failed to load resource: the server responded with a status of 403 (Forbidden)
:5173/api/bookings:1
```

## Solution in 3 Steps

### ⚠️ STEP 1: Ensure Services are Running

**Terminal 1:**
```bash
cd backend
./mvnw spring-boot:run
# Wait for: "Started HotelBookingApplication"
```

**Terminal 2:**
```bash
cd frontend
npm run dev
# Frontend should open at http://localhost:5173
```

**Verify MySQL:**
```bash
brew services start mysql
```

### 🔐 STEP 2: Login to Get JWT Token

1. Go to: http://localhost:5173/login
2. Enter credentials:
   ```
   Email: user@example.com
   Password: User@123
   ```
3. Click "Sign In"
4. You should see success message

### ✅ STEP 3: Now Try Booking

1. Search for hotels on homepage
2. Click "Book Now" on a room
3. Fill booking details
4. Click "Confirm Booking"
5. **Should work without 403 error!**

---

## Verify It's Working

```javascript
// Open browser console (F12)
localStorage.getItem('token')
// Should return: eyJhbGciOiJIUzI1NiIs...

localStorage.getItem('user')
// Should return: {"id":1,"email":"user@example.com",...}
```

---

## If Still Getting 403

### Check 1: Token in LocalStorage?
```javascript
// Console:
localStorage.getItem('token')
// If NULL → Login again
// If has value → Go to Check 2
```

### Check 2: Token in Request Headers?
1. Open DevTools (F12)
2. Network tab
3. Try to create booking
4. Click the request
5. Check "Request Headers" → Should have `Authorization: Bearer ...`

**If Authorization header missing:**
- This is in `frontend/src/api/axios.js`
- It should auto-add the token
- Try refreshing the page

### Check 3: Backend Logs
```bash
tail -50 backend/logs/hotel-booking.log | grep -i "error\|forbidden\|jwt"
```

---

## Troubleshooting Matrix

| Symptom | Cause | Fix |
|---------|-------|-----|
| 403 Forbidden | Not logged in | Go to /login |
| 403 Forbidden | Token expired | Logout → Login again |
| 403 Forbidden | Token not sent | Check axios interceptor |
| Cannot login | User doesn't exist | Register via /signup |
| Cannot login | Wrong password | Check credentials |
| Port 8080 in use | Process exists | `lsof -ti :8080 \| xargs kill -9` |
| Frontend won't load | Port 5173 in use | `lsof -ti :5173 \| xargs kill -9` |

---

## Test Credentials

```
Admin User:
  Email: admin@example.com
  Password: Admin@123

Regular User:
  Email: user@example.com
  Password: User@123
```

Don't have these? Register new account at /signup

---

## Diagnostic Script

```bash
bash diagnose.sh
```

This shows:
- ✅ Backend status
- ✅ Frontend status
- ✅ Database status
- ✅ Dependencies status
- ✅ Log file contents

---

## Kill Stuck Processes

```bash
# Kill backend (port 8080)
lsof -ti :8080 | xargs kill -9

# Kill frontend (port 5173)
lsof -ti :5173 | xargs kill -9

# Kill MySQL
brew services stop mysql

# Start MySQL again
brew services start mysql
```

---

## View Logs

```bash
# Backend logs
tail -f backend/logs/hotel-booking.log

# Frontend console
Open browser DevTools (F12) → Console tab
```

---

## Full Restart (Nuclear Option)

```bash
# Stop everything
killall java
lsof -ti :5173 | xargs kill -9
brew services stop mysql

# Start everything fresh
brew services start mysql
sleep 2

# Terminal 1
cd backend && ./mvnw spring-boot:run

# Terminal 2 (after backend starts)
cd frontend && npm run dev
```

---

## Still Stuck?

1. ✅ Read: `SETUP_GUIDE.md`
2. ✅ Read: `AUTHENTICATION_GUIDE.md`
3. ✅ Read: `COMPLETE_GUIDE.md`
4. ✅ Check: `BOOKING_COMPONENTS_GUIDE.md`
5. ✅ Run: `bash diagnose.sh`
6. ✅ Enable: `AuthDebugger` component

---

## Quick Links

| Doc | Purpose |
|-----|---------|
| `SETUP_GUIDE.md` | Complete setup instructions |
| `AUTHENTICATION_GUIDE.md` | JWT & 403 error deep dive |
| `COMPLETE_GUIDE.md` | Full project documentation |
| `BOOKING_COMPONENTS_GUIDE.md` | React component docs |
| `diagnose.sh` | Run diagnostics |

---

**Remember:** 
- **Must be logged in** to access booking endpoints
- **Token goes in Authorization header** automatically
- **If 403 → Check if you're logged in**
- **If still 403 → Check backend logs**

Good luck! 🍀
