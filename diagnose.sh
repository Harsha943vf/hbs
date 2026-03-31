#!/bin/bash

# Hotel Booking Application - Troubleshooting Script
# This script helps diagnose common issues with the application

echo "🔍 Hotel Booking - Application Diagnostics"
echo "==========================================="
echo ""

# Check if ports are in use
echo "1️⃣ Checking Port Status..."
echo ""

if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "✅ Backend (port 8080): RUNNING"
else
  echo "❌ Backend (port 8080): NOT RUNNING"
  echo "   To start: cd backend && ./mvnw spring-boot:run"
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "✅ Frontend (port 5173): RUNNING"
else
  echo "❌ Frontend (port 5173): NOT RUNNING"
  echo "   To start: cd frontend && npm run dev"
fi

echo ""
echo "2️⃣ Checking Database Connection..."
echo ""

if command -v mysql &> /dev/null; then
  if mysql -h localhost -u root -pBittu1302 -e "SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'hotel_booking' LIMIT 1;" 2>/dev/null | grep -q "1"; then
    echo "✅ MySQL Database: CONNECTED"
    echo "   Database: hotel_booking"
  else
    echo "❌ MySQL Database: NOT CONNECTED or EMPTY"
    echo "   Check if MySQL is running: brew services list"
    echo "   Or restart MySQL: brew services restart mysql"
  fi
else
  echo "⚠️  MySQL client not found. Install with: brew install mysql"
fi

echo ""
echo "3️⃣ Checking Node Dependencies..."
echo ""

if [ -d "frontend/node_modules" ]; then
  echo "✅ Frontend Dependencies: INSTALLED"
else
  echo "❌ Frontend Dependencies: NOT INSTALLED"
  echo "   To install: cd frontend && npm install"
fi

echo ""
echo "4️⃣ Checking Backend Build..."
echo ""

if [ -f "backend/target/hotel-booking-0.0.1-SNAPSHOT.jar" ]; then
  echo "✅ Backend JAR: BUILT"
else
  echo "⚠️  Backend JAR: NOT BUILT"
  echo "   To build: cd backend && ./mvnw clean package"
fi

echo ""
echo "5️⃣ Checking Logs..."
echo ""

if [ -f "backend/logs/hotel-booking.log" ]; then
  echo "✅ Backend Log File Exists"
  echo "   Last 5 lines:"
  tail -5 backend/logs/hotel-booking.log | sed 's/^/   /'
else
  echo "⚠️  Backend Log File: NOT FOUND"
fi

echo ""
echo "6️⃣ Quick Start Commands"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend && ./mvnw spring-boot:run"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "==========================================="
echo "If you see errors, check:"
echo "  • AUTHENTICATION_GUIDE.md - For 403 Forbidden errors"
echo "  • BOOKING_COMPONENTS_GUIDE.md - For component documentation"
echo "  • application.properties - Database and JWT config"
echo ""
