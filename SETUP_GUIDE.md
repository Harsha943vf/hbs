# Hotel Booking Application - Complete Setup & Troubleshooting Guide

## 📋 Project Overview

This is a full-stack hotel booking application with:
- **Backend:** Spring Boot 3.3.5 with MySQL, JWT Auth, Spring Security
- **Frontend:** React 18 with Vite, Tailwind CSS, React Router
- **Database:** MySQL with JPA/Hibernate ORM

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start MySQL Database
```bash
brew services start mysql
# Verify: mysql -u root -pBittu1302 -e "SELECT 1;"
```

### Step 2: Start Backend (Terminal 1)
```bash
cd backend
./mvnw spring-boot:run
# Wait for: "Started HotelBookingApplication in X.XXs"
```

### Step 3: Start Frontend (Terminal 2)
```bash
cd frontend
npm install  # If not already installed
npm run dev
# Open: http://localhost:5173
```

---

## 🔴 Fixing "403 Forbidden" Error

### Error Message:
```
Failed to load resource: the server responded with a status of 403 (Forbidden)
:5173/api/bookings:1
```

### Root Cause:
You're trying to access a **protected endpoint** without being authenticated.

### Solution (Step by Step):

#### 1. **Check if You're Logged In**
```javascript
// Open Browser DevTools → Console
localStorage.getItem('token')   // Should return a long JWT string
localStorage.getItem('user')    // Should return user JSON data
```

If both return `null`, you need to **login first**.

#### 2. **Login to Create a Token**
- Go to: `http://localhost:5173/login`
- Enter credentials:
  - **Email:** `user@example.com` (or any registered user)
  - **Password:** `User@123` (or the correct password)
- Click "Sign In"
- You'll be redirected to the homepage with a token in localStorage

#### 3. **Now Try Booking Again**
- Search for hotels
- Click "Book Now" on a room
- You should now be able to create a booking

### Test Credentials:

**Regular User (for booking):**
```
Email: user@example.com
Password: User@123
```

**Admin User (for hotel management):**
```
Email: admin@example.com
Password: Admin@123
```

If these don't exist in your database, you need to:
1. Register a new account via `/signup`
2. Or check `backend/src/main/java/com/hotelbooking/config/DataSeeder.java` for initial data

---

## 🔴 Port 8080 Already in Use

### Error Message:
```
Port 8080 was already in use
Exception encountered during context initialization - cancelling refresh attempt
```

### Solution:

#### Option 1: Kill the Process Using Port 8080
```bash
# Find the process
lsof -i :8080

# Kill it (replace XXXX with PID)
kill -9 XXXX

# Or use this shortcut (macOS):
lsof -ti :8080 | xargs kill -9
```

#### Option 2: Change the Backend Port
Edit `backend/src/main/resources/application.properties`:
```properties
server.port=8080  # Change to 8081, 9000, etc.
```

Then update `frontend/vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8081',  // Match new port
      changeOrigin: true,
    }
  }
}
```

---

## 🟡 Database Connection Issues

### Error Message:
```
com.mysql.cj.jdbc.exceptions.CommunicationsException: 
Communications link failure
```

### Solution:

#### Check 1: MySQL is Running
```bash
brew services list | grep mysql

# If not running:
brew services start mysql

# Verify connection:
mysql -u root -pBittu1302 -e "SELECT 1;"
```

#### Check 2: Database Exists
```bash
mysql -u root -pBittu1302 -e "SHOW DATABASES;" | grep hotel_booking

# If not exists, Spring will create it automatically when you run the app
```

#### Check 3: Credentials Match
In `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_booking?...
spring.datasource.username=root
spring.datasource.password=Bittu1302
```

Make sure these match your MySQL setup.

---

## 🟡 Frontend Dependencies Missing

### Error Message:
```
Cannot find module 'react-router-dom'
Cannot find module 'axios'
```

### Solution:
```bash
cd frontend
npm install

# Or reinstall everything:
rm -rf node_modules package-lock.json
npm install
```

### Required Dependencies:
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "react-hot-toast": "^2.x",
  "lucide-react": "^latest",
  "date-fns": "^latest",
  "tailwindcss": "^3.x"
}
```

---

## 🟡 Vite Development Server Not Starting

### Error Message:
```
EADDRINUSE: address already in use :::5173
```

### Solution:

#### Kill Process on Port 5173
```bash
lsof -ti :5173 | xargs kill -9
```

#### Or Change Vite Port
Edit `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,  // Change to different port
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

---

## 🔧 Diagnostic Commands

### Check All Services Status
```bash
# Run the diagnostic script:
bash diagnose.sh

# Or manually:
lsof -i :8080        # Check backend port
lsof -i :5173        # Check frontend port
lsof -i :3306        # Check MySQL port
```

### View Backend Logs
```bash
# Real-time logs:
tail -f backend/logs/hotel-booking.log

# Last 50 lines:
tail -50 backend/logs/hotel-booking.log

# Search for errors:
grep -i error backend/logs/hotel-booking.log
```

### Check Network Requests (Browser)
1. Open DevTools (F12)
2. Go to Network tab
3. Make a booking request
4. Click the request to see:
   - **Request Headers** (Authorization header should be present)
   - **Response Headers** (Status should be 200, not 403)
   - **Response Body** (Error message if failed)

---

## 📱 API Endpoints Status

### Public Endpoints (No Login)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/hotels` | List all hotels |
| GET | `/api/hotels/{id}` | Get hotel details |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/signup` | Register user |

### Protected Endpoints (Login Required)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/bookings` | Create booking ⚠️ Getting 403? |
| GET | `/api/bookings/my-bookings` | Get user's bookings |
| GET | `/api/bookings/{id}` | Get booking details |
| PUT | `/api/bookings/{id}/cancel` | Cancel booking |

### Admin Endpoints (Admin Only)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/admin/**` | Admin dashboard |
| GET | `/api/hotels` | Manage hotels |
| POST | `/api/hotels` | Create hotel |
| PUT | `/api/hotels/{id}` | Update hotel |
| DELETE | `/api/hotels/{id}` | Delete hotel |

---

## 🔐 JWT Authentication Flow

```
User enters credentials → POST /api/auth/login
                            ↓
                    Backend validates password
                            ↓
                    Returns JWT token + user data
                            ↓
Frontend stores in localStorage
                            ↓
Every request adds: Authorization: Bearer <token>
                            ↓
Backend validates JWT signature
                            ↓
✅ Request allowed OR ❌ 403 Forbidden
```

### Token Structure:
```javascript
{
  id: 1,
  email: "user@example.com",
  firstName: "John",
  lastName: "Doe",
  role: "ROLE_USER",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Token Expiration:
- **Valid for:** 24 hours (86400000 ms)
- **After expiration:** Get 401 Unauthorized → Auto redirect to login

---

## 🧪 Testing Booking Flow

### Complete Test Scenario:

1. **Access Homepage**
   ```
   http://localhost:5173
   ```

2. **Search Hotels**
   - Select check-in date, check-out date, guests
   - Click "Search"

3. **View Hotel Details**
   - Click on a hotel to see rooms
   - Click "View Details"

4. **Click "Book Now"**
   - If not logged in → Redirected to `/login`
   - If logged in → Go to booking page

5. **Fill Booking Form**
   - Number of guests (1-max occupancy)
   - Special requests (optional)

6. **Review Summary**
   - Room details
   - Total price
   - Booking reference (after confirmation)

7. **Confirm Booking**
   - Click "Confirm Booking"
   - Should see success toast
   - Redirected to `/bookings`

8. **View Bookings**
   - See all your bookings on `/bookings`
   - Can cancel bookings here

---

## 📂 File Structure for Bookings

### Frontend Components:
```
frontend/src/components/booking/
├── BookingCard.jsx           # Display booking info
├── BookingConfirmation.jsx   # Booking confirmed page
├── BookingForm.jsx           # Form for booking details
├── BookingSummary.jsx        # Price summary sidebar
└── CancelBookingModal.jsx    # Cancel confirmation modal

frontend/src/pages/
├── BookingPage.jsx           # Booking form page
└── BookingHistoryPage.jsx    # View all bookings
```

### Backend Controllers:
```
backend/src/main/java/com/hotelbooking/
├── controller/
│   └── BookingController.java
├── service/
│   └── BookingService.java
├── repository/
│   └── BookingRepository.java
└── model/
    └── Booking.java
```

---

## ✅ Verification Checklist

- [ ] MySQL is running: `brew services list | grep mysql`
- [ ] Backend logs show "Started HotelBookingApplication"
- [ ] Frontend starts on port 5173 with no errors
- [ ] Can access `http://localhost:5173` in browser
- [ ] Can see hotel listings on homepage
- [ ] Can navigate to `/login` page
- [ ] Can login with test credentials
- [ ] JWT token is in localStorage after login
- [ ] Can access `/booking` page after login
- [ ] Can submit booking without 403 error
- [ ] Booking confirmation shows booking reference
- [ ] Can see bookings on `/bookings` page
- [ ] Can cancel bookings

---

## 🆘 Still Having Issues?

### Step 1: Run Diagnostics
```bash
bash diagnose.sh
```

### Step 2: Check Logs
```bash
# Backend
tail -50 backend/logs/hotel-booking.log

# Frontend (in browser console)
Open DevTools → Console tab
```

### Step 3: Review Documentation
- `AUTHENTICATION_GUIDE.md` - For 403 errors
- `BOOKING_COMPONENTS_GUIDE.md` - For component details
- `README.md` - For general info

### Step 4: Common Fixes
```bash
# Clear everything and restart
cd backend && ./mvnw clean package && ./mvnw spring-boot:run

# In another terminal
cd frontend && rm -rf node_modules && npm install && npm run dev
```

---

## 📞 Support

For specific issues:
1. Check the error message carefully
2. Search documentation files
3. Review browser console and backend logs
4. Try the suggested fixes above
5. Restart both services from scratch

---

**Last Updated:** 31 March 2026
**Version:** 1.0.0
