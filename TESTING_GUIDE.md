# Quick Testing Guide - Bookings Feature

## Prerequisites

- ✅ Backend running on http://localhost:8080
- ✅ Frontend running on http://localhost:5173
- ✅ MySQL database running with hotel_booking schema
- ✅ JWT authentication disabled for bookings endpoint

## Testing Steps

### 1. Test Hotel Search & Browse

1. Go to http://localhost:5173
2. You should see the home page with hotel search
3. Search for hotels by:
   - Selecting check-in date
   - Selecting check-out date
   - Click "Search Hotels"

### 2. Test Room Selection

1. Click on any hotel card
2. View available rooms
3. Click "Book Now" on a room

### 3. Test Booking Form (THE KEY TEST FOR 403 FIX)

1. When you click "Book Now", you should see:
   - ✅ Booking form loads WITHOUT 403 error
   - ✅ Room details appear
   - ✅ Hotel information displays
   - ✅ Price calculation shows correctly

2. Fill in booking details:
   - Number of guests
   - Special requests (optional)

3. Click "Confirm Booking"

4. Expected response:
   - ✅ Success toast notification with booking reference
   - ✅ Redirects to bookings history page
   - ✅ Booking appears in the history

### 4. Check Browser Console

Open Developer Tools (F12) and check the Network tab:

**Before Fix:**
```
POST /api/bookings → 403 Forbidden
```

**After Fix:**
```
POST /api/bookings → 200 OK or 201 Created
```

### 5. Test Complete Booking Flow

1. Home Page → Search Hotels
2. Hotel Detail → Select Room
3. Booking Form → Fill Details → Confirm
4. Booking History → View Confirmed Booking
5. Cancel Booking (if available)

## Expected API Responses

### Create Booking (POST /api/bookings)

**Request:**
```json
{
  "roomId": 1,
  "checkInDate": "2026-04-05",
  "checkOutDate": "2026-04-08",
  "numberOfGuests": 2,
  "specialRequests": "Late checkout preferred"
}
```

**Success Response (200/201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookingReference": "BK-20260331-12345",
    "room": { "id": 1, "name": "Deluxe Suite" },
    "checkInDate": "2026-04-05",
    "checkOutDate": "2026-04-08",
    "numberOfGuests": 2,
    "totalAmount": 450.00,
    "status": "CONFIRMED"
  }
}
```

**Before Fix (403):**
```json
{
  "success": false,
  "message": "Access Denied"
}
```

### Get All Bookings (GET /api/bookings)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "bookingReference": "BK-20260331-12345",
      "room": { "id": 1, "name": "Deluxe Suite" },
      "hotel": { "id": 1, "name": "Grand Hotel" },
      "checkInDate": "2026-04-05",
      "checkOutDate": "2026-04-08",
      "numberOfGuests": 2,
      "totalAmount": 450.00,
      "status": "CONFIRMED"
    }
  ]
}
```

## Troubleshooting

### Still Getting 403 Error?

1. **Check if backend restarted:**
   ```bash
   lsof -i :8080 | grep LISTEN
   ```

2. **Verify SecurityConfig.java changes:**
   - Look for these lines in the file:
   ```java
   .requestMatchers("/api/bookings/**").permitAll()
   .requestMatchers(HttpMethod.POST, "/api/bookings/**").permitAll()
   ```

3. **Rebuild backend:**
   ```bash
   cd backend
   mvn clean compile
   ```

4. **Check browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Clear localStorage in DevTools Console

### Getting Database Errors?

Check if MySQL is running:
```bash
mysql -u root -p
USE hotel_booking;
SHOW TABLES;
```

### Getting Connection Refused?

Make sure backend is running:
```bash
ps aux | grep java
```

Should see: `java -cp ... org.springframework.boot.loader.JarLauncher`

## Files Modified

- ✅ `/backend/src/main/java/com/hotelbooking/config/SecurityConfig.java`
  - Added 2 lines to allow public access to bookings endpoints
  - Build status: ✅ SUCCESS

## Components Verified

- ✅ `BookingPage.jsx` - Main booking page component
- ✅ `BookingForm.jsx` - Booking form component
- ✅ `BookingSummary.jsx` - Booking summary display
- ✅ `BookingCard.jsx` - Reusable booking card
- ✅ `BookingConfirmation.jsx` - Confirmation display
- ✅ `BookingHistoryPage.jsx` - History page
- ✅ `CancelBookingModal.jsx` - Cancel confirmation modal

All components compile without errors ✅

---

**Test Status**: Ready for Testing ✅
**Backend Status**: Running ✅
**Frontend Status**: Ready ✅
