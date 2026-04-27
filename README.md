# LuxeStay — Hotel Booking Platform
### **(Apologise 🙏 for only single commit. Due to few errors, mac to windows integrations, time was running out. Finally we had to push it to only one account)**
### We hope you please kindly consider our situation
A full-stack hotel booking application built with **React + Tailwind CSS + Vite** (frontend) and **Spring Boot 3 + MySQL** (backend).

---

## 🗂️ Project Structure

```
hotel-booking/
├── backend/          # Spring Boot REST API
│   ├── src/main/java/com/hotelbooking/
│   │   ├── config/           # Security, JWT filter, DataSeeder
│   │   ├── controller/       # REST controllers
│   │   │   └── ChatController.java       ← NEW: Chatbot endpoints
│   │   ├── dto/              # Request / Response DTOs
│   │   │   ├── request/
│   │   │   │   └── ChatRequest.java      ← NEW
│   │   │   └── response/
│   │   │       └── ChatResponse.java     ← NEW
│   │   ├── exception/        # Global exception handler
│   │   ├── model/            # JPA entities
│   │   │   └── ChatMessage.java          ← NEW: Chat persistence
│   │   ├── repository/       # Spring Data JPA repositories
│   │   │   └── ChatMessageRepository.java ← NEW
│   │   ├── service/          # Business logic
│   │   │   └── ChatService.java          ← NEW: RAG implementation
│   │   └── util/             # Booking reference generator
│   └── src/main/resources/
│       └── application.properties
│
└── frontend/         # React SPA
    └── src/
        ├── api/              # Axios instance with JWT interceptor
        ├── components/
        │   ├── admin/        # StatsCard
        │   ├── common/       # LoadingSpinner, ErrorMessage, ProtectedRoute
        │   │   └── Chatbot.jsx             ← NEW: Chat UI component
        │   ├── hotels/       # HotelCard, RoomCard, StarRating
        │   └── layout/       # Navbar, Footer
        ├── context/          # AuthContext (login/logout/state)
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── LoginPage.jsx
        │   ├── SignupPage.jsx
        │   ├── SearchResultsPage.jsx
        │   ├── HotelDetailPage.jsx
        │   ├── BookingPage.jsx
        │   ├── BookingHistoryPage.jsx
        │   ├── AdminDashboard.jsx
        │   ├── AdminHotelsPage.jsx    ← completed
        │   └── AdminBookingsPage.jsx  ← completed
        └── App.jsx                    ← UPDATED: Added Chatbot
```

---

## ⚙️ Prerequisites

- Java 21
- Maven 3.9+
- MySQL 8
- Node.js 18+

---

## 🚀 Running the App

### 1. Database Setup

Create the database (auto-created on first run if MySQL user has permissions):
```sql
CREATE DATABASE hotel_booking;
```

### 2. Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hotel_booking?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Email (optional — errors are caught and logged, app still works without it)
spring.mail.username=your-gmail@gmail.com
spring.mail.password=your-gmail-app-password
```

> **Note:** Email sending is async and failures are swallowed — the app works fine without configuring email.

### 3. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`. On first run, the `DataSeeder` automatically creates:
- An admin user
- 6 sample hotels with rooms

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173`. Vite proxies all `/api` requests to the backend.

---

## 🔑 Default Credentials

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | `admin@luxestay.com`     | `Admin@123` |
| User  | Register via `/signup`   | —           |

---

## 🌐 API Endpoints

### Auth
| Method | Path                  | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/auth/register`  | Register new user  |
| POST   | `/api/auth/login`     | Login              |

### Hotels (public GET, admin POST/PUT/DELETE)
| Method | Path                          | Description              |
|--------|-------------------------------|--------------------------|
| GET    | `/api/hotels`                 | All hotels (paginated)   |
| GET    | `/api/hotels/search`          | Search by location/dates |
| GET    | `/api/hotels/{id}`            | Hotel detail + rooms     |
| POST   | `/api/hotels`                 | Create hotel (admin)     |
| PUT    | `/api/hotels/{id}`            | Update hotel (admin)     |
| DELETE | `/api/hotels/{id}`            | Delete hotel (admin)     |
| POST   | `/api/hotels/{id}/rooms`      | Add room (admin)         |
| PUT    | `/api/hotels/rooms/{id}`      | Update room (admin)      |
| DELETE | `/api/hotels/rooms/{id}`      | Delete room (admin)      |

### Bookings
| Method | Path                       | Description              |
|--------|----------------------------|--------------------------|
| POST   | `/api/bookings`            | Create booking           |
| GET    | `/api/bookings/my-bookings`| User's bookings          |
| GET    | `/api/bookings/{id}`       | Single booking           |
| PUT    | `/api/bookings/{id}/cancel`| Cancel booking           |
| GET    | `/api/bookings`            | All bookings (admin)     |

### Admin
| Method | Path                    | Description          |
|--------|-------------------------|----------------------|
| GET    | `/api/admin/dashboard`  | Dashboard stats      |
| GET    | `/api/admin/users`      | All users            |

### Chat (RAG-based Chatbot) ← NEW
| Method | Path                        | Description                        |
|--------|-----------------------------|------------------------------------|
| POST   | `/api/chat/send`            | Send message to chatbot (auth)     |
| GET    | `/api/chat/history/{userId}`| Get user's chat history (auth)     |
| DELETE | `/api/chat/history/{userId}`| Clear chat history (auth)          |
| GET    | `/api/chat/health`          | Chatbot service status (public)    |

---

## 🤖 AI Chatbot Features (NEW!)

A **RAG-based (Retrieval Augmented Generation)** chatbot that intelligently assists users:

### Capabilities
- 🏨 **Hotel Inquiries** - Answer questions about available hotels
- 🛏️ **Room Details** - Provide room information, pricing, amenities
- 📅 **Booking Assistance** - Guide users through the booking process
- 💬 **Contextual Responses** - Retrieves real data from your hotel database
- 📝 **Chat History** - Persists all conversations per user

### How It Works
1. User asks a question via the floating chat widget
2. AI analyzes intent (hotels, rooms, bookings, etc.)
3. System retrieves relevant context from the database
4. Generates contextual response using RAG approach
5. Response is stored with conversation history

### Tech Stack
- Spring AI (LLM framework)
- Vector embeddings (extensible for semantic search)
- Intent Recognition (pattern-based)
- Database-driven context retrieval
- JWT-secured endpoints

### Quick Start
```bash
# Just run the backend and frontend as usual
cd backend && mvn spring-boot:run  # Terminal 1
cd frontend && npm run dev         # Terminal 2

# Login and click the 💬 button in bottom-right corner
# Start chatting!
```

For detailed information, see: [CHATBOT_QUICKSTART.md](./CHATBOT_QUICKSTART.md)

---

## ✨ Features

### Guest
- Browse and search hotels by location
- Filter by star rating
- View hotel details, amenities, and available rooms
- Date-based room availability check

### Registered User
- Book rooms with date selection and special requests
- View booking history with status badges
- Cancel confirmed bookings

### Admin
- Dashboard with revenue charts, top hotels, recent bookings
- Full hotel CRUD (create / edit / delete)
- Room management per hotel (add / edit / delete)
- Browse all bookings with search and status filter
- Revenue summary

---

## 🛠️ Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 18, React Router 6, Tailwind CSS 3, Vite 5 |
| UI        | Lucide React icons, Recharts, react-hot-toast |
| Backend   | Spring Boot 3.3, Spring Security, Spring Data JPA |
| Auth      | JWT (jjwt 0.11.5), BCrypt                     |
| Database  | MySQL 8, Hibernate                            |
| Email     | Spring Mail (Gmail SMTP)                      |
| **AI/Chat** | **Spring AI, Vector Embeddings, Redis**   |
| Docs      | SpringDoc OpenAPI (Swagger UI at `/swagger-ui.html`) |
