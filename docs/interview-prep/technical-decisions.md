# CareConnect — Technical Decisions & Architecture

## Why These Choices (Be Ready to Explain)

### State Machine for Appointments
- **What:** Defined valid state transitions as a map: `{ pending: ['accepted', 'cancelled'], accepted: ['in_progress', 'cancelled'], ... }`
- **Why:** Prevents invalid transitions (can't skip from pending to completed). Single source of truth for business logic. Way cleaner than nested if/else.
- **Interview angle:** "I modeled the appointment lifecycle as a finite state machine with validated transitions" — shows you think in abstractions.

### MVC + Service Layer
- **What:** Routes → Controllers → Services → Models → DB
- **Why:** Controllers handle HTTP concerns (req/res), services handle business logic, models handle data access. Each layer has one job.
- **Interview angle:** Separation of concerns. Easy to test each layer independently.

### Knex.js (Query Builder) over Raw SQL or ORM
- **What:** Knex builds SQL queries programmatically but doesn't abstract tables into objects like Sequelize
- **Why:** More control than an ORM, safer than raw SQL. Migrations are version-controlled schema changes.
- **Trade-off:** More boilerplate than an ORM, but you understand exactly what SQL runs.

### JWT Auth with Access + Refresh Tokens
- **What:** Short-lived access token (15min) + long-lived refresh token (7 days)
- **Why:** If access token is stolen, damage is limited to 15 minutes. Refresh token lets users stay logged in without re-entering password.

### camelCase API ↔ snake_case DB
- **What:** API accepts/returns camelCase (JavaScript convention), DB uses snake_case (SQL convention)
- **Why:** Each layer follows its own convention. Translation layer maps between them.

### WebSocket for Real-Time Features
- **What:** Socket.io for chat messages and caregiver live tracking
- **Why:** HTTP is request-response. WebSocket keeps a persistent connection for instant updates. Essential for "where is my caregiver" tracking.

## Key Patterns

| Pattern | Where Used | Why |
|---------|-----------|-----|
| Optimistic Locking | Appointment accept | Prevents race conditions without DB locks |
| Field Whitelisting | User/review update | Prevents mass-assignment attacks |
| `_requireX` helpers | Appointment service | Authorization that throws-or-returns, no boolean checks |
| Profile ID → User ID resolution | Notifications, reviews | Normalized schema means IDs don't always match |
| Defense in Depth | XSS sanitization | Server-side encoding even though frontend should also escape |
