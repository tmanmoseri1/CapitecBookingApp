# Capitec Booking App
Tech Stack
Layer	            Technology
Backend	            Java 17, Spring Boot 3
Frontend	        React + Vite
Database	        PostgreSQL
Auth	            JWT + Spring Security
Build Tools	        Maven, npm
Containerization	Docker, Docker Compose

# Prerequisites

# Before running the project, make sure you have installed:
 ---------------------------------------------------------
Git
Java 17 and Maven
Node.js (v18+) & npm
Docker & Docker Compose

# Clone the Repository
---------------------
git clone https://github.com/tmanmoseri1/CapitecBookingApp.git
cd CapitecBookingApp

# Run Locally (Without Docker)
------------------------------
1. Backend
cd backend
mvn clean install
mvn spring-boot:run
Backend will run at: http://localhost:8080

2. Frontend
cd frontend
npm install
npm run dev
Frontend will run at: http://localhost:5173
Make sure PostgreSQL is running locally before starting backend.

# Run with Docker (Backend + Frontend + PostgreSQL)
--------------------------------------------------------
From the project root:

docker-compose up --build

Frontend: http://localhost:3000
Backend: http://localhost:8080
PostgreSQL: localhost:5432

To stop containers:
docker-compose down

# Run Tests
-----------
Backend tests
cd backend
mvn test

Frontend tests
cd frontend
npm test

# Build for Production
------------------------
Backend Jar
cd backend
mvn clean package
Frontend Build
cd frontend
npm run build

 Environment Variables
These can be set in .env files or system environment variables.

DB_HOST=postgres
DB_PORT=5432
DB_NAME=capitecdb
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
 Troubleshooting

If Docker gives port error address already in use:

sudo lsof -i :5432
sudo kill -9 <PID>

If containers don't rebuild changes:

docker-compose down -v
docker-compose up --build