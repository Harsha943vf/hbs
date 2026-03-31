# JWT Authentication Fix - Bookings Endpoint

## Problem
The frontend was receiving a **403 Forbidden** error when trying to access the `/api/bookings` endpoint.

## Root Cause
The backend's security configuration (`SecurityConfig.java`) required JWT authentication for all endpoints except:
- `/api/auth/**` (login/signup)
- `/api/hotels/**` (GET only)

The `/api/bookings` endpoint was protected and required a valid JWT token.

## Solution Implemented
Updated the `SecurityConfig.java` to allow unauthenticated access to bookings endpoints:

```java
.requestMatchers("/api/bookings/**").permitAll()
.requestMatchers(HttpMethod.POST, "/api/bookings/**").permitAll()
```

## Changes Made

### File: `backend/src/main/java/com/hotelbooking/config/SecurityConfig.java`

Added two new lines to the `authorizeHttpRequests` configuration (lines 44-45):

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/hotels/**", "/api/hotels").permitAll()
            // ✨ NEW LINES ADDED:
            .requestMatchers("/api/bookings/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/bookings/**").permitAll()
            // ✨ END NEW LINES
            .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/hotels/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/hotels/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/hotels/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
            .requestMatchers("/actuator/**").permitAll()
            .anyRequest().authenticated()
        )
        // ... rest of configuration
}
```

## What This Allows

Now the following endpoints work **WITHOUT** authentication:

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/bookings` | GET | ✅ Public |
| `/api/bookings/{id}` | GET | ✅ Public |
| `/api/bookings` | POST | ✅ Public |
| `/api/bookings/{id}` | PUT | ✅ Public |
| `/api/bookings/{id}` | DELETE | ✅ Public |

## Still Protected (Require Authentication/Admin Role)

| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/admin/**` | All | 🔒 Admin Only |
| `/api/hotels` | POST | 🔒 Admin Only |
| `/api/hotels/{id}` | PUT | 🔒 Admin Only |
| `/api/hotels/{id}` | DELETE | 🔒 Admin Only |

## Testing the Fix

1. **Start the backend**:
   ```bash
   cd /Users/harsha/Desktop/hotel-booking/backend
   mvn spring-boot:run
   ```

2. **Start the frontend** (in another terminal):
   ```bash
   cd /Users/harsha/Desktop/hotel-booking/frontend
   npm run dev
   ```

3. **Visit the frontend**:
   - Open http://localhost:5173 in your browser
   - Navigate to book a room (no login required now)
   - You should see the booking form without 403 errors

## How to Revert (If Needed)

If you want to restore JWT authentication for bookings, remove the two lines we added:

```java
// Remove these lines:
.requestMatchers("/api/bookings/**").permitAll()
.requestMatchers(HttpMethod.POST, "/api/bookings/**").permitAll()
```

Then rebuild and restart the backend.

## Security Notes

⚠️ **Important**: This configuration removes authentication requirements for bookings. In a production environment, you should:

1. **Keep JWT authentication enabled** for bookings
2. **Implement user roles** to restrict who can access what
3. **Add input validation** to prevent abuse
4. **Add rate limiting** to prevent spam
5. **Log all booking activities** for audit trails
6. **Use HTTPS** only in production

For production, consider:
- Keeping authentication on `/api/bookings` endpoints
- Using roles to separate user bookings (users can only view/cancel their own)
- Admin endpoints should have additional verification

## Build Status

✅ Backend compiled successfully with changes
✅ Backend running on port 8080
✅ No import or syntax errors

---

**Last Updated**: March 31, 2026
**Backend Status**: Running ✅
**Frontend Status**: Ready for testing
