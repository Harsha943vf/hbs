# 🏨 Hotel Booking Application - Complete Documentation

## 📌 Quick Summary

Your hotel booking application has:
- ✅ Complete backend with Spring Boot 3.3.5
- ✅ Full-featured React frontend with booking components
- ✅ JWT authentication system
- ✅ MySQL database integration
- ❌ 403 Forbidden error when accessing booking endpoints

**Root Cause:** User must be **logged in** before accessing protected booking endpoints.

---

## 🎯 Main Issue: 403 Forbidden on `/api/bookings`

### What This Means:
The server is **rejecting your request** because:
1. You're **not logged in** (no JWT token), OR
2. The token is **not being sent** in request headers, OR
3. The token is **invalid/expired**

### How to Fix (3 Steps):

#### Step 1: Start Everything
```bash
# Terminal 1: Backend
cd backend
./mvnw spring-boot:run

# Terminal 2: Frontend  
cd frontend
npm run dev

# Terminal 3: MySQL
brew services start mysql
```

#### Step 2: Login First
1. Open: http://localhost:5173
2. Click "Login" in navbar
3. Enter credentials:
   - Email: `user@example.com`
   - Password: `User@123`
4. Submit

#### Step 3: Now Try Booking
- Search for hotels
- Click "Book Now" on a room
- Fill the booking form
- Click "Confirm Booking"

**It should work now! ✅**

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SETUP_GUIDE.md` | Complete setup & troubleshooting (READ THIS FIRST) |
| `AUTHENTICATION_GUIDE.md` | JWT auth & 403 error explanation |
| `BOOKING_COMPONENTS_GUIDE.md` | React component documentation |
| `diagnose.sh` | Automated diagnostics script |
| `README.md` | Project overview |

---

## 🔍 Diagnosing Your Issue

### Use the Diagnostic Script:
```bash
bash diagnose.sh
```

This checks:
- ✅ Backend port 8080 status
- ✅ Frontend port 5173 status  
- ✅ MySQL connection
- ✅ Node dependencies
- ✅ Backend logs

### Manual Checks:

**Check if Backend is Running:**
```bash
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}
```

**Check if Frontend is Running:**
```bash
curl http://localhost:5173
# Should return HTML (not error)
```

**Check if You Have a Token:**
```javascript
// Open browser console (F12):
localStorage.getItem('token')  // Should return JWT string or null
```

**Check if Token is Sent:**
1. Open DevTools (F12)
2. Network tab
3. Try to create a booking
4. Click the API request
5. Check "Request Headers"
6. Look for: `Authorization: Bearer eyJhbGc...`

If this header is missing → token not being sent → 403 error

---

## 🚀 Full Setup Walkthrough

### 1. Prerequisites
```bash
# Check if you have everything:
mysql --version        # MySQL 5.7+
java -version          # Java 17+
node --version         # Node 18+
npm --version          # NPM 9+
```

### 2. Clone/Navigate to Project
```bash
cd /Users/harsha/Desktop/hotel-booking
```

### 3. Database Setup
```bash
# Start MySQL
brew services start mysql

# Verify connection
mysql -u root -pBittu1302 -e "SELECT 1;"

# The database 'hotel_booking' will be created automatically
# when you start the backend for the first time
```

### 4. Backend Setup & Start
```bash
cd backend

# Build the project (first time only)
./mvnw clean package

# Start the application
./mvnw spring-boot:run

# Wait for: "Started HotelBookingApplication in X.XXs"
# Then it's ready!
```

### 5. Frontend Setup & Start
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Open: http://localhost:5173
```

### 6. Create Initial Data (if needed)
The backend automatically seeds data via `DataSeeder.java`:

**Test Admin User:**
- Email: `admin@example.com`
- Password: `Admin@123`
- Role: ADMIN

**Test Regular User:**
- Email: `user@example.com`
- Password: `User@123`
- Role: USER

If these don't exist, register new accounts via `/signup`.

---

## 🔐 How Authentication Works

```
┌─────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                    │
└─────────────────────────────────────────────────────────┘

1. USER LOGS IN
   ├─ Visits: /login
   ├─ Enters email & password
   └─ Clicks "Sign In"
   
2. FRONTEND SENDS LOGIN REQUEST
   └─ POST /api/auth/login
      └─ Body: { email, password }

3. BACKEND VALIDATES CREDENTIALS
   ├─ Checks database for user
   ├─ Compares password hash (BCrypt)
   └─ If valid, generates JWT token

4. BACKEND RETURNS RESPONSE
   └─ { id, email, firstName, lastName, role, token }

5. FRONTEND STORES TOKEN
   ├─ localStorage.setItem('token', token)
   ├─ localStorage.setItem('user', userData)
   └─ Updates AuthContext state

6. AXIOS INTERCEPTOR ADDS TOKEN
   ├─ Every API request now includes:
   └─ Header: Authorization: Bearer <token>

7. USER ACCESSES PROTECTED ENDPOINT
   ├─ Example: POST /api/bookings
   └─ Request includes Authorization header

8. BACKEND VALIDATES JWT
   ├─ Extracts token from Authorization header
   ├─ Verifies JWT signature
   ├─ Extracts user information from token
   └─ If valid → ✅ Process request
             → ❌ 403 Forbidden if invalid

9. REQUEST SUCCEEDS OR FAILS
   ├─ ✅ Success: Return booking confirmation
   └─ ❌ Error: Return 403 with error message
```

---

## 🛠️ Troubleshooting by Error

### Error: "Port 8080 already in use"
```bash
# Kill the process:
lsof -ti :8080 | xargs kill -9

# Or change port in application.properties:
server.port=8081
```

### Error: "Failed to connect to database"
```bash
# Start MySQL:
brew services start mysql

# Verify:
mysql -u root -pBittu1302 -e "SELECT 1;"
```

### Error: "Cannot find module 'react-router-dom'"
```bash
# Install dependencies:
cd frontend
npm install
```

### Error: "403 Forbidden on /api/bookings"
```javascript
// Check browser console:
localStorage.getItem('token')  // Should not be null

// If null → Login at /login
// If not null → Token might be invalid/expired
```

### Error: "Network request failed: the server responded with a status of 401"
```
This means:
- Token is sent but JWT signature is invalid
- Token has expired (24 hour limit)
- User role has changed

Solution: 
- Logout: Delete localStorage
- Login again with fresh token
```

---

## 📋 API Reference

### Public Endpoints

**Search Hotels**
```
GET /api/hotels?checkIn=2026-04-01&checkOut=2026-04-05
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Luxury Hotel",
      "city": "New York",
      "rooms": [...]
    }
  ]
}
```

**Login**
```
POST /api/auth/login
Body: { email, password }
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "role": "ROLE_USER",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Protected Endpoints (Require Login)

**Create Booking** ⚠️ (This is causing your 403 error)
```
POST /api/bookings
Header: Authorization: Bearer <token>
Body: {
  "roomId": 1,
  "checkInDate": "2026-04-01",
  "checkOutDate": "2026-04-05",
  "numberOfGuests": 2,
  "specialRequests": "Extra pillow please"
}
Response:
{
  "success": true,
  "data": {
    "id": 1,
    "bookingReference": "BK-2026-04-01-001",
    "status": "CONFIRMED"
  }
}
```

**Get My Bookings**
```
GET /api/bookings/my-bookings
Header: Authorization: Bearer <token>
Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "bookingReference": "BK-2026-04-01-001",
      "hotelName": "Luxury Hotel",
      "status": "CONFIRMED"
    }
  ]
}
```

---

## 🧪 Testing Checklist

- [ ] Backend started: `./mvnw spring-boot:run`
- [ ] Frontend started: `npm run dev`
- [ ] MySQL running: `brew services list`
- [ ] Can access http://localhost:5173
- [ ] Can see hotel listings
- [ ] Can login to /login
- [ ] Token in localStorage after login
- [ ] Token sent in API headers (check DevTools)
- [ ] Can access /booking page
- [ ] Can submit booking without 403 error
- [ ] Booking confirmation shows reference
- [ ] Can view all bookings in /bookings
- [ ] Can cancel a booking
- [ ] Admin can manage hotels in /admin

---

## 📁 Project Structure

```
hotel-booking/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/hotelbooking/
│   │   ├── HotelBookingApplication.java
│   │   ├── config/
│   │   │   ├── SecurityConfig.java   # JWT + Security
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── DataSeeder.java       # Initial data
│   │   ├── controller/
│   │   │   ├── AuthController.java   # Login/Register
│   │   │   ├── BookingController.java # ← /api/bookings
│   │   │   └── HotelController.java
│   │   ├── service/
│   │   │   ├── BookingService.java
│   │   │   ├── AuthService.java
│   │   │   └── JwtService.java       # Token generation
│   │   ├── model/
│   │   │   ├── User.java
│   │   │   ├── Booking.java          # ← Booking entity
│   │   │   └── Hotel.java
│   │   └── repository/
│   │       ├── BookingRepository.java
│   │       └── UserRepository.java
│   ├── pom.xml                       # Maven dependencies
│   └── application.properties        # Config
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── App.jsx                   # Routes
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state
│   │   ├── api/
│   │   │   └── axios.js              # API + Interceptors
│   │   ├── components/
│   │   │   ├── booking/              # ← Booking components
│   │   │   │   ├── BookingForm.jsx
│   │   │   │   ├── BookingSummary.jsx
│   │   │   │   ├── BookingCard.jsx
│   │   │   │   ├── BookingConfirmation.jsx
│   │   │   │   └── CancelBookingModal.jsx
│   │   │   ├── common/
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── AuthDebugger.jsx  # ← Debug component
│   │   │   └── layout/
│   │   │       ├── Navbar.jsx
│   │   │       └── Footer.jsx
│   │   └── pages/
│   │       ├── BookingPage.jsx       # ← Main booking page
│   │       ├── BookingHistoryPage.jsx # ← View bookings
│   │       ├── LoginPage.jsx
│   │       └── HomePage.jsx
│   ├── package.json
│   ├── vite.config.js                # Proxy config
│   └── tailwind.config.js
│
├── AUTHENTICATION_GUIDE.md           # Auth documentation
├── SETUP_GUIDE.md                    # Setup instructions
├── BOOKING_COMPONENTS_GUIDE.md       # Component docs
├── diagnose.sh                       # Diagnostics script
└── README.md                         # Project overview
```

---

## 🎓 Learning Resources

### JWT Authentication
- Token is created after login
- Token contains user info (id, email, role)
- Token is verified on each request
- Token expires after 24 hours

### Spring Security
- `SecurityConfig` defines which endpoints need auth
- `JwtAuthenticationFilter` validates tokens
- `@PreAuthorize` annotations restrict by role

### React Hooks
- `useAuth()` - Access authentication state
- `useNavigate()` - Programmatic navigation
- `useState()` - Component state
- `useEffect()` - Side effects

---

## ⚡ Performance Tips

1. **Frontend**: Uses code splitting with React Router
2. **Backend**: Database indexing on frequently queried fields
3. **API**: Pagination for large result sets
4. **Caching**: JWT tokens cached in localStorage

---

## 🔒 Security Features

✅ **Implemented:**
- JWT token-based authentication
- BCrypt password hashing
- Role-based access control (RBAC)
- CORS configured for localhost:5173
- CSRF protection disabled (stateless API)
- SQL injection protection (JPA)

⚠️ **Production Checklist:**
- [ ] Change `jwt.secret` to secure value
- [ ] Use HTTPS only
- [ ] Set `HTTPS` database URLs
- [ ] Configure proper CORS origins
- [ ] Add rate limiting
- [ ] Implement logging/monitoring
- [ ] Set secure cookie flags
- [ ] Enable SQL query sanitization

---

## 🚨 Common Mistakes

❌ **Don't:**
- Access `/booking` without login
- Share JWT tokens
- Store sensitive data in localStorage
- Use `admin` user for regular bookings
- Forget to start MySQL
- Clear localStorage while making API calls

✅ **Do:**
- Login before booking
- Keep tokens private
- Use HTTPS in production
- Test with regular user account
- Start all services before testing
- Clear cache and reload if issues

---

## 📞 Getting Help

### Step 1: Check if Everything is Running
```bash
bash diagnose.sh
```

### Step 2: Check the Logs
```bash
# Backend logs:
tail -f backend/logs/hotel-booking.log

# Frontend console (F12):
Open DevTools → Console tab
```

### Step 3: Read Relevant Docs
- 403 error? → Read `AUTHENTICATION_GUIDE.md`
- Component issue? → Read `BOOKING_COMPONENTS_GUIDE.md`
- Setup issue? → Read `SETUP_GUIDE.md`

### Step 4: Try the Diagnostic Component
1. Add `AuthDebugger` to frontend
2. Check auth status in UI
3. See token and user data
4. Use quick actions to debug

---

## ✅ Success Criteria

You'll know everything is working when:

1. ✅ Backend starts without errors
2. ✅ Frontend loads without errors
3. ✅ Can see hotels on homepage
4. ✅ Can login with test credentials
5. ✅ Token appears in localStorage
6. ✅ Can navigate to /booking page
7. ✅ Can create booking WITHOUT 403 error
8. ✅ Booking reference is displayed
9. ✅ Booking appears in /bookings page
10. ✅ Can cancel booking

---

## 📝 Quick Reference

| Command | Purpose |
|---------|---------|
| `./mvnw spring-boot:run` | Start backend |
| `npm run dev` | Start frontend |
| `brew services start mysql` | Start database |
| `bash diagnose.sh` | Check health |
| `tail -f backend/logs/hotel-booking.log` | View backend logs |
| `npm install` | Install dependencies |
| `./mvnw clean package` | Build backend |

---

**Version:** 1.0.0  
**Last Updated:** 31 March 2026  
**Status:** ✅ Ready for Use

For detailed information, see the individual documentation files!
