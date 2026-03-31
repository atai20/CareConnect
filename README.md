# CareConnect Backend API

> On-demand home care platform connecting older adults with verified caregivers (CNAs, RNAs, NPs).

Built with **Node.js**, **Express**, **MySQL**, and **Socket.io** for real-time features.

## Architecture

```
Client (React) ─── REST API (Express) ─── MySQL
                   WebSocket (Socket.io)   Redis (cache)
```

**Key patterns:**
- **Service Layer** — Controllers are thin; business logic lives in services for testability
- **Knex.js** — SQL query builder with migration support (not a heavy ORM)
- **JWT Auth** — Stateless with refresh token rotation
- **RBAC** — Role-based access (care_receiver, caregiver, admin)
- **Appointment State Machine** — `pending → accepted → in_progress → completed`

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+
- Redis (optional, for caching)

### Setup

```bash
# Clone & install
git clone <repo-url>
cd careconnect-backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# Create database
mysql -u root -p -e "CREATE DATABASE careconnect;"

# Run migrations & seed data
npm run migrate
npm run seed

# Start development server
npm run dev
```

The server starts at `http://localhost:3000` with:
- API: `http://localhost:3000/api/v1`
- Swagger Docs: `http://localhost:3000/api/docs`
- Health Check: `http://localhost:3000/health`
- WebSocket: `ws://localhost:3000`

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@careconnect.com | Password123! |
| Caregiver | maria.garcia@example.com | Password123! |
| Caregiver | james.wilson@example.com | Password123! |
| Care Receiver | dorothy.chen@example.com | Password123! |

## API Overview

### Authentication
```
POST /api/v1/auth/register     # Create account
POST /api/v1/auth/login        # Get JWT tokens
POST /api/v1/auth/refresh      # Refresh access token
GET  /api/v1/auth/me           # Current user profile
```

### Core Resources
```
# Appointments (the heart of the platform)
POST   /api/v1/appointments              # Book care
GET    /api/v1/appointments              # List (filtered by role)
POST   /api/v1/appointments/:id/accept   # Caregiver accepts
POST   /api/v1/appointments/:id/start    # Check-in
POST   /api/v1/appointments/:id/complete # Mark done

# Caregivers
GET    /api/v1/caregivers                # Search with geo filters
GET    /api/v1/caregivers/:id            # Profile + certs + rating
PUT    /api/v1/caregivers/:id/availability

# Reviews, Chat, Payments, Notifications, Addresses
# → See Swagger docs at /api/docs for full reference
```

### WebSocket Events
```
# Chat
send_message → new_message
typing → user_typing

# Live Tracking
update_location → location_update

# Notifications (server push)
→ new_notification
→ appointment_update
```

## Project Structure

```
src/
├── config/          # Database, Socket.io, Swagger setup
├── middleware/       # Auth, RBAC, validation, rate limiting, error handling
├── routes/          # Express route definitions
├── controllers/     # Request/response handling (thin)
├── services/        # Business logic (testable without HTTP)
├── models/          # Data access layer (Knex queries)
├── validations/     # Joi request schemas
├── socket/          # WebSocket event handlers
├── utils/           # ApiError, catchAsync, geo, pagination
└── app.js           # Express app configuration

database/
├── migrations/      # Schema version control
└── seeds/           # Demo data

docs/
└── swagger.yaml     # OpenAPI 3.0 spec
```

## Database Schema

20 tables covering users, profiles, appointments, reviews, chat, payments, notifications, and geolocation tracking. Key design decisions:

- **Single `users` table** with role field instead of separate caregiver/receiver tables
- **Appointment state machine** with validated transitions
- **Haversine distance queries** for proximity-based caregiver search
- **Normalized chat** with conversations, participants, and messages
- **Denormalized rating** on caregiver profile (updated on review create)

## Scripts

```bash
npm run dev              # Start with hot-reload (nodemon)
npm start                # Production start
npm run migrate          # Run database migrations
npm run migrate:rollback # Undo last migration
npm run seed             # Load demo data
npm test                 # Run test suite
npm run lint             # ESLint
```

## Security

- Helmet.js security headers
- Rate limiting (100 req/15min general, 20 req/15min for auth)
- bcrypt password hashing (12 rounds)
- JWT with short-lived access tokens (15min)
- Parameterized queries via Knex (SQL injection prevention)
- CORS whitelisting
- Input validation on all endpoints (Joi)
- HPP (HTTP parameter pollution protection)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| Database | MySQL 8 |
| Query Builder | Knex.js |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Real-time | Socket.io |
| Validation | Joi |
| Docs | Swagger UI + OpenAPI 3.0 |
| Security | Helmet, CORS, express-rate-limit, HPP |

## Team

| Name | Role |
|------|------|
| Arsenii Chan | Backend & Database |
| Joshua Immordino | Reporting & Analytics |
| Atai Kydyrov | Deployment & DevOps |
| Faisal/Abdullah Zidan | Database & AI Integration |
| Axyl Frederick | Frontend & AI Integration |

---

*CSC33600 — Spring 2026*
