# Authentication & 403 Forbidden Error Guide

## Problem: 403 Forbidden on `/api/bookings` Endpoint

You're seeing a 403 Forbidden error when trying to access booking endpoints. This means the request is being rejected due to authentication/authorization issues.

## Root Causes

### 1. **Not Logged In** (Most Common)
The user must be authenticated before accessing booking endpoints.

**Solution:**
1. Navigate to `/login`
2. Enter valid credentials (email and password)
3. After successful login, a JWT token will be stored in `localStorage`
4. Now you can access protected routes like `/booking` and `/bookings`

### 2. **Missing or Invalid JWT Token**
The token might not be properly stored or has expired.

**How to Check:**
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Look for a `token` key
4. If missing or empty, you need to login again

### 3. **Token Not Being Sent in Request Headers**
Even with a valid token, if it's not sent to the backend, you'll get 403.

**How JWT is Sent (in `frontend/src/api/axios.js`):**
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

This automatically adds the token to every request header as:
```
Authorization: Bearer <your-jwt-token>
```

## Backend Security Configuration

In `backend/src/main/java/com/hotelbooking/config/SecurityConfig.java`:

### Public Endpoints (No Login Required)
- `GET /api/hotels` - List all hotels
- `GET /api/hotels/{id}` - Get hotel details
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Register

### Protected Endpoints (Login Required)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/{id}` - Get booking details
- `PUT /api/bookings/{id}/cancel` - Cancel booking

### Admin-Only Endpoints (Admin Role Required)
- `GET /api/admin/**` - All admin endpoints
- `POST /api/hotels/**` - Create/edit hotels (must be admin)
- `PUT /api/hotels/**` - Update hotels (must be admin)
- `DELETE /api/hotels/**` - Delete hotels (must be admin)
- `GET /api/bookings` - View all bookings (must be admin)

## Step-by-Step: Creating a Booking

### 1. **Start Application**
```bash
# Terminal 1: Backend
cd backend
./mvnw spring-boot:run

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 2. **Visit Home Page**
```
http://localhost:5173
```

### 3. **Search and Browse Hotels**
- Use the search filters to find hotels
- Click on a hotel to view rooms
- Click "Book Now" on a room

### 4. **If Not Logged In**
- You'll be redirected to `/login`
- Enter your credentials or create a new account

### 5. **Complete Booking**
- Fill in guest count and special requests
- Review the booking summary
- Click "Confirm Booking"

## JWT Token Structure

The JWT token returned from `/api/auth/login` contains:
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ROLE_USER",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The token is:
- **Valid for 24 hours** (86400000 ms from `application.properties`)
- **Stored** in browser localStorage
- **Sent** automatically with every request via axios interceptor
- **Validated** by backend on each request

## Debugging 403 Errors

### Check 1: Verify Login
```javascript
// In browser console:
localStorage.getItem('token')
localStorage.getItem('user')
```

Should return non-null values if logged in.

### Check 2: Monitor Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Make a booking request
4. Click the request
5. Check "Request Headers" for:
   ```
   Authorization: Bearer eyJhbGciOi...
   ```

### Check 3: Check Backend Logs
```
tail -f logs/hotel-booking.log
```

Look for:
- `JWT validation failed` - Token is invalid/expired
- `No token provided` - Token wasn't sent
- `ROLE_ADMIN required` - User doesn't have admin role

## Test Credentials

Make sure you have test users in the database. Check `DataSeeder.java`:

```java
// Admin user
Email: admin@example.com
Password: Admin@123

// Regular user
Email: user@example.com
Password: User@123
```

If these don't work, register a new account.

## Common Issues & Fixes

### Issue: "403 Forbidden" when creating booking
**Fix:** Login first via `/login` page

### Issue: Token in localStorage but still 403
**Fix:** 
- Token might be expired (24 hours max)
- Try logging out and logging back in
- Clear localStorage and login again

### Issue: Can't see JWT token in Network headers
**Fix:**
- Check if axios is properly configured
- Verify interceptor in `frontend/src/api/axios.js`
- Restart the development server

### Issue: "ROLE_ADMIN" error on `/api/admin` endpoints
**Fix:**
- Your user account is not an admin
- Login with admin credentials or ask admin to upgrade your account

## Fixing Port 8080 Already in Use

If you see: `Port 8080 was already in use`

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

## API Response Format

Success response:
```json
{
  "success": true,
  "message": "Booking confirmed",
  "data": {
    "id": 1,
    "bookingReference": "BK-2026-03-31-001",
    ...
  }
}
```

Error response (403):
```json
{
  "success": false,
  "message": "Access Denied",
  "timestamp": "2026-03-31T14:30:00",
  "path": "/api/bookings"
}
```

## Security Best Practices

✅ **Implemented:**
- JWT tokens with 24-hour expiration
- BCrypt password hashing
- CORS configured for localhost:5173
- Role-based access control (RBAC)
- HTTP-only storage of sensitive data

⚠️ **Important:**
- Never share JWT tokens
- Always use HTTPS in production
- Regenerate `jwt.secret` in production
- Set strong database credentials

## Next Steps

1. ✅ Ensure backend is running: `./mvnw spring-boot:run`
2. ✅ Ensure frontend is running: `npm run dev`
3. ✅ Login with valid credentials
4. ✅ Make bookings with authenticated user
5. ✅ View booking history in `/bookings`
6. ✅ Admin users can manage hotels in `/admin`

---

**For more help:** Check `BOOKING_COMPONENTS_GUIDE.md` for component documentation.
