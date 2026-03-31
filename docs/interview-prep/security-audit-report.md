# CareConnect Security Audit Report

## Overview
Conducted a full security audit of the CareConnect backend API. Found and fixed 12 vulnerabilities across 13 files (309 lines changed).

---

## CRITICAL (2 issues)

### 1. SQL Injection in admin.controller.js
- **Vulnerability:** String interpolation in `db.raw()` — `DATE_SUB(NOW(), INTERVAL ${days} DAY)`
- **Attack:** If parsing is ever refactored, attacker injects arbitrary SQL
- **Fix:** Parameterized query: `db.raw('DATE_SUB(NOW(), INTERVAL ? DAY)', [days])`

### 2. SQL Injection in geo.js haversineSQL()
- **Vulnerability:** Lat/lon user values interpolated directly into SQL template string
- **Fix:** Changed to `?` placeholders with bindings array

---

## HIGH (4 issues)

### 3. Race Condition: Two Caregivers Accept Same Appointment
- **Vulnerability:** Read-then-write pattern. Between reading `status=pending` and writing `status=accepted`, another request could read the same state. Both pass the check, second overwrites the first.
- **Fix:** Atomic conditional UPDATE: `UPDATE appointments SET caregiver_id=?, status='accepted' WHERE id=? AND status='pending' AND caregiver_id IS NULL`. If `affectedRows === 0`, someone else won the race. This is **optimistic locking**.

### 4. Mass-Assignment: User Update Allows Role/Password Overwrite
- **Vulnerability:** `UserModel.update(id, req.body)` passes raw request body to DB. Attacker sends `{ "role": "admin", "password_hash": "$known_hash" }` to become admin.
- **Fix:** Whitelist safe fields: `pick(req.body, ['first_name', 'last_name', 'phone', 'avatar_url'])`

### 5. Socket.io: Eavesdrop on Any Chat Conversation
- **Vulnerability:** Any authenticated user could join ANY conversation room by sending `{ conversationId: 123 }`. They'd read private medical conversations.
- **Fix:** Check `ConversationModel.isParticipant()` before allowing `socket.join()`

### 6. Socket.io: Track Any Caregiver's Live Location
- **Vulnerability:** Any authenticated user could join any tracking room and receive real-time GPS coordinates of caregivers.
- **Fix:** Verify user is either the care receiver or assigned caregiver before allowing join. Added coordinate validation on `update_location`.

---

## MEDIUM (4 issues)

### 7. Caregiver Profile Modification by Anyone
- **Vulnerability:** No ownership check on certification/availability endpoints. Anyone could add fake certifications to another caregiver's profile.
- **Fix:** Added `requireOwnership()` helper that verifies the `:id` param matches the caller's own caregiver profile.

### 8. Review Update Mass-Assignment
- **Vulnerability:** `ReviewModel.update(id, req.body)` — attacker could rewrite `reviewee_id` or `appointment_id`.
- **Fix:** Whitelist: `pick(req.body, ['overall_rating', 'punctuality', 'professionalism', 'skill_level', 'comment'])`

### 9. Chat Pagination DoS
- **Vulnerability:** No max cap on `limit` query param. `?limit=999999` loads a million messages into memory, crashes server with OOM.
- **Fix:** `Math.min(100, Math.max(1, parsedLimit))`

### 10. Stored XSS in User-Generated Text
- **Vulnerability:** If review comments contain `<script>` tags and frontend uses `dangerouslySetInnerHTML`, script executes in every browser viewing the review.
- **Fix:** Added `sanitizeObject()` middleware at Express level that HTML-encodes all string values (`<` → `&lt;`). Defense-in-depth — frontend should also escape.

---

## LOW (2 issues)

### 11. JWT Secret Startup Validation
- **Vulnerability:** If someone forgets to change `JWT_SECRET` from `.env.example`, tokens are signed with a publicly known key. Attacker forges tokens for any user.
- **Fix:** Startup check that rejects known weak values. Hard-kills in production, warns in development.

### 12. File Upload Path Traversal
- **Vulnerability:** Used `path.extname(file.originalname)` for file extension. Attacker sends `originalname: "cert.pdf/../../../etc/cron.d/malicious"` to write outside uploads directory.
- **Fix:** Ignore user-provided extension entirely. Map MIME type to hardcoded safe extension.

---

## Key Patterns Learned

1. **Optimistic Locking** — Use atomic conditional UPDATEs for competitive resources instead of read-then-write
2. **Mass Assignment Prevention** — Never pass `req.body` directly to DB updates. Always whitelist fields.
3. **WebSocket Authorization** — Valid JWT ≠ access to any room. Always check resource ownership.
4. **SQL Injection in ORMs** — Even with Knex, `db.raw()` with string interpolation is dangerous. Always use `?` placeholders.
5. **Defense in Depth** — Sanitize on backend even if frontend escapes. Don't trust any layer.

---

## Interview Talking Points

- "I conducted a security audit and fixed 12 vulnerabilities including SQL injection, race conditions, and authorization bypass"
- "I implemented optimistic locking to prevent race conditions on appointment acceptance"
- "I added defense-in-depth XSS protection with server-side HTML encoding middleware"
- "I fixed a path traversal vulnerability in file uploads by ignoring user-provided extensions and mapping MIME types instead"
