# Hotel Booking - Booking Components Guide

## Overview
This document provides comprehensive information about the booking-related components in the frontend application. All components are fully functional with proper error handling and state management.

## Components Structure

### 1. **BookingCard.jsx**
Displays individual booking information in a card format with status indicators.

**Props:**
- `booking` (Object) - Booking data object
- `onCancel` (Function) - Callback for cancel action
- `onViewDetails` (Function) - Callback for view details action
- `canCancel` (Boolean) - Whether cancellation is allowed (default: false)
- `isLoading` (Boolean) - Loading state for cancel action (default: false)

**Features:**
- Hotel image display with fallback
- Status badge with icon (Confirmed, Cancelled, Completed, Pending)
- Booking reference, room number, total nights, and price
- Check-in/Check-out dates with guest count
- View details and cancel buttons
- Responsive design for mobile and desktop

**Status Colors:**
- CONFIRMED: Green (✓)
- CANCELLED: Red (✗)
- COMPLETED: Blue (✓)
- PENDING: Yellow (⚠)

---

### 2. **BookingConfirmation.jsx**
Shows a confirmation page after successful booking with all details.

**Props:**
- `booking` (Object) - Complete booking details

**Features:**
- Success header with animated icon
- Booking reference (copyable to clipboard)
- Hotel information with location, phone, and email
- Room details and guest count
- Check-in/Check-out dates
- Total amount paid with currency formatting
- Navigation links to view all bookings or return home
- Information box with next steps

**Displays:**
- Booking reference (₹ currency format for Indian Rupees)
- Hotel location and contact info
- Room number and type
- Guest information
- Booking status
- Total amount calculation

---

### 3. **BookingForm.jsx**
Form component for entering booking details (guests and special requests).

**Props:**
- `guests` (Number) - Number of guests selected
- `setGuests` (Function) - State setter for guests
- `specialRequests` (String) - Special requests text
- `setSpecialRequests` (Function) - State setter for special requests
- `maxOccupancy` (Number) - Maximum guests allowed
- `isSubmitting` (Boolean) - Form submission state
- `onSubmit` (Function) - Form submission handler

**Features:**
- Guest count selector (dynamic based on room capacity)
- Special requests textarea with 500 character limit
- Important information alert box
- Submit button with loading state
- Form validation messages
- Responsive layout

**Form Fields:**
1. **Number of Guests:** Dropdown from 1 to maxOccupancy
2. **Special Requests:** Optional textarea for guest preferences
3. **Terms & Conditions:** Info box with hotel policies

---

### 4. **BookingSummary.jsx**
Right sidebar component showing booking summary and price breakdown.

**Props:**
- `room` (Object) - Room details
- `hotel` (Object) - Hotel details
- `checkIn` (String) - Check-in date
- `checkOut` (String) - Check-out date
- `guests` (Number) - Number of guests

**Features:**
- Hotel information card with address
- Room details (number, type, capacity, description)
- Check-in/Check-out date display
- Number of nights calculation
- Guest count display
- Price breakdown with per-night calculation
- Sticky positioning on desktop

**Displays:**
- Hotel name and address
- Room number and type
- Room capacity
- Room description (if available)
- Dates in DD MMM YYYY format
- Price calculation: ₹/night × nights = Total

---

### 5. **CancelBookingModal.jsx**
Modal dialog for confirming booking cancellation.

**Props:**
- `booking` (Object) - Booking to be cancelled
- `onConfirm` (Function) - Confirmation handler
- `onCancel` (Function) - Cancellation handler
- `isLoading` (Boolean) - Loading state

**Features:**
- Alert icon and title
- Warning message about cancellation policy
- Booking reference and status display
- Important information about refund terms
- Cancel and Keep booking buttons
- Loading state with spinner
- Responsive design

**Warning Elements:**
- Alerts user about cancellation policies
- Shows refund availability depends on hotel terms
- Displays booking reference for verification
- Shows current booking status

---

## Page Integration

### BookingPage.jsx
Main page for completing a booking.

**Workflow:**
1. Extracts booking parameters from URL (roomId, hotelId, checkIn, checkOut)
2. Fetches hotel and room details
3. Calculates number of nights and total amount
4. Renders BookingForm and BookingSummary side by side
5. Submits booking data to API
6. Redirects to /bookings on success

**State Management:**
- `room` - Selected room details
- `hotel` - Hotel details
- `guests` - Number of guests
- `specialRequests` - Special requirements
- `loading` - Initial data loading
- `submitting` - Form submission state

---

### BookingHistoryPage.jsx
Displays user's booking history with management options.

**Workflow:**
1. Fetches all user bookings on mount
2. Displays bookings in card format
3. Shows empty state if no bookings
4. Allows cancelling confirmed bookings
5. Shows confirmation modal before cancellation

**Features:**
- List of all user bookings
- Filter/manage bookings
- Cancel confirmed bookings
- Empty state with call-to-action
- Loading spinner while fetching
- Toast notifications for feedback

---

## Styling & Tailwind Classes

### Button Classes
- `.btn-primary` - Primary action buttons (blue)
- `.btn-secondary` - Secondary action buttons (outlined)
- `.btn-gold` - Gold accent buttons

### Card & Layout
- `.card` - Card component with shadow and hover effect
- `.input-field` - Input/Select/Textarea styling
- `.badge-confirmed`, `.badge-cancelled`, etc. - Status badges

### Color Scheme
- **Primary:** Blue (#1e3a5f)
- **Gold:** #c9a84c
- **Status Colors:** Green (confirmed), Red (cancelled), Blue (completed), Yellow (pending)

---

## Data Structure

### Booking Object
```javascript
{
  id: number,
  bookingReference: string,
  hotelName: string,
  hotelLocation: string,
  hotelPhone: string,
  hotelEmail: string,
  hotelImageUrl: string,
  roomNumber: string,
  roomTypeDisplay: string,
  roomTypeId: number,
  checkInDate: string (YYYY-MM-DD),
  checkOutDate: string (YYYY-MM-DD),
  numberOfGuests: number,
  totalAmount: number,
  status: "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED",
  specialRequests: string,
  maxOccupancy: number,
  description: string,
  pricePerNight: number
}
```

---

## API Endpoints Used

### Fetch Data
- `GET /hotels/{hotelId}?checkIn={date}&checkOut={date}` - Get hotel details with availability
- `GET /bookings/my-bookings` - Get user's bookings

### Create/Modify
- `POST /bookings` - Create new booking
- `PUT /bookings/{bookingId}/cancel` - Cancel a booking

### Request Body for POST /bookings
```javascript
{
  roomId: number,
  checkInDate: string (YYYY-MM-DD),
  checkOutDate: string (YYYY-MM-DD),
  numberOfGuests: number,
  specialRequests: string
}
```

---

## Error Handling

All components include proper error handling:
- **API Errors:** Toast notifications with error messages
- **Validation:** Form field validation
- **Loading States:** Spinner display during async operations
- **Fallback Images:** Default hotel image if URL fails
- **Empty States:** Helpful messages when no data available

---

## Recent Fixes

### Fixed Issue: Missing date-fns Import
- **File:** BookingPage.jsx
- **Issue:** `differenceInDays` function was used but not imported
- **Fix:** Added `import { differenceInDays } from 'date-fns'`
- **Date:** March 31, 2026

---

## Testing Checklist

- [x] All components render without errors
- [x] Props validation and type checking
- [x] Responsive design on mobile/tablet/desktop
- [x] Form submission with validation
- [x] Cancellation workflow with confirmation
- [x] Date formatting with date-fns
- [x] Price calculation and display
- [x] API error handling
- [x] Loading states and spinners
- [x] Toast notifications

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Dependencies

Required packages (already in package.json):
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-router-dom`: ^6.22.0
- `axios`: ^1.6.7
- `react-hot-toast`: ^2.4.1
- `date-fns`: ^3.3.1
- `lucide-react`: ^0.344.0
- `tailwindcss`: ^3.4.1

---

## Future Enhancements

1. Add booking modification capability
2. Implement booking search/filter
3. Add payment gateway integration
4. Email notifications
5. SMS notifications
6. Booking PDF export
7. Booking history pagination
8. Advanced filters (date range, price, etc.)

---

## Support & Maintenance

For issues or questions about booking components:
1. Check console for error messages
2. Verify API endpoints are responding
3. Ensure authentication tokens are valid
4. Check network requests in browser DevTools
5. Review component prop values in React DevTools

---

**Last Updated:** March 31, 2026  
**Status:** ✅ All Components Complete - No Errors
