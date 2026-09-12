# HireLoop

A full-stack interview management platform. Streamlines the hiring pipeline — candidate management, interview scheduling, question banks, structured evaluations, and candidate scoring — through a role-based dashboard for admins, interviewers, and candidates.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Spring Boot 4.1.0, Java 21, Maven (Maven Wrapper)
- **Database:** MySQL (Spring Data JPA + Hibernate)
- **Auth:** Spring Security + JWT (stateless)
- **IDE / OS:** VS Code, Windows (PowerShell)
- **API testing:** Postman ("HireLoop API" collection)
Backend package structure is feature-based: each domain (`user`, `auth`, `candidate`, `interview`, `question`, `evaluation`) owns its own `controller/service/repository/entity/dto`.

## Getting Started

### Backend
```powershell
cd backend
copy src\main\resources\application.yml.example src\main\resources\application.yml
# edit application.yml with your local MySQL credentials and a JWT secret
.\mvnw.cmd spring-boot:run
```
Runs on `http://localhost:8080`.

### Frontend
```powershell
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

### Database
Create a local MySQL database named `hireloop_db`. Hibernate auto-creates tables (`ddl-auto: update`).

## Authentication & Authorization (Week 2)

HireLoop uses JWT-based stateless authentication with Spring Security. Passwords are hashed with BCrypt; no plaintext passwords are ever stored or logged.

### How it works
1. User registers or logs in via `/api/auth/*`
2. On successful login, the server returns a signed JWT (HS256) containing the user's email, role, and user ID
3. The frontend attaches this token to subsequent requests via the `Authorization: Bearer <token>` header
4. `JwtAuthenticationFilter` validates the token on every request and authenticates the user for that request only (fully stateless — no server-side sessions)
5. Protected endpoints check role via `@PreAuthorize`, e.g. `@PreAuthorize("hasRole('ADMIN')")`

### Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create a new account (open self-registration) |
| POST | `/api/auth/login` | No | Authenticate and receive a JWT |
| GET | `/api/users/me` | Yes (any authenticated user) | Get the current logged-in user's profile |
| GET | `/api/users` | Yes (ADMIN only) | List all users |

### Request/Response examples

**POST `/api/auth/register`**
```json
// Request
{
  "name": "Jane Doe",
  "email": "jane@hireloop.com",
  "password": "securepass123",
  "role": "CANDIDATE"
}

// Response (200)
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@hireloop.com",
  "role": "CANDIDATE",
  "token": null
}
```

**POST `/api/auth/login`**
```json
// Request
{
  "email": "jane@hireloop.com",
  "password": "securepass123"
}

// Response (200)
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@hireloop.com",
  "role": "CANDIDATE",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

**Error responses** (consistent shape across the API — wrong password, duplicate email, validation failure, insufficient role, etc.):
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid email or password",
  "timestamp": "2026-08-24T10:15:30"
}
```

### Roles
- `ADMIN` — full access, including `GET /api/users`
- `INTERVIEWER` — permissions to be defined as interview features are built (Week 4+)
- `CANDIDATE` — standard user, can only access their own profile via `/me`

### Key architectural decisions
- **Registration:** open self-registration (role selectable at signup for now — may be restricted to admin-managed creation later)
- **Token expiry:** access-token-only, ~4 hour expiry (no refresh token — deferred for simplicity)
- **Token storage (frontend):** localStorage
- **Password hashing:** BCrypt via Spring Security's `PasswordEncoder`

### Environment setup
`backend/src/main/resources/application.yml` is gitignored (contains DB credentials and the JWT signing secret). Copy `application.yml.example` and fill in real values before running locally.

## Candidate & User Management (Week 3)

### Candidate Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/candidates/me | CANDIDATE | Create own candidate profile |
| GET | /api/candidates/me | CANDIDATE | Get own candidate profile |
| PUT | /api/candidates/me | CANDIDATE | Update own candidate profile |
| GET | /api/candidates/{id} | ADMIN, INTERVIEWER | Get a specific candidate by id |
| GET | /api/candidates | ADMIN, INTERVIEWER | List all candidates |

### User Endpoints (extended)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/users/me | Authenticated | Get own user profile (no password field) |
| GET | /api/users | ADMIN | List all users (no password fields) |
| GET | /api/users/{id} | ADMIN | Get a specific user by id |

### Example — Create Candidate Profile
**Request:** `POST /api/candidates/me`
```json
{
  "resumeUrl": "https://example.com/resume.pdf",
  "experience": "2 years"
}
```
**Response (201):**
```json
{
  "id": 1,
  "userId": 5,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "resumeUrl": "https://example.com/resume.pdf",
  "experience": "2 years",
  "createdAt": "2026-09-01T10:00:00"
}
```

### Key Decisions (Week 3)
- **Candidate identity:** own auto-increment `id`, separate `user_id` FK with a unique constraint (not a shared-PK `@MapsId`) — keeps `Candidate.id` independent for future FKs (e.g. `interviews.candidate_id` in Week 4).
- **DTO discipline:** all user/candidate responses go through `UserResponse`/`CandidateResponse` DTOs — fixed a password-hash leak in `/api/users/me` and `/api/users` originally returning the raw `User` entity.
- **Error handling:** extended `GlobalExceptionHandler` with `MethodArgumentTypeMismatchException` (bad path variable types) and `HttpMessageNotReadableException` (malformed/empty JSON body) handlers.
- **Self-registration restriction:** deliberately deferred — anyone can still self-register as ADMIN/INTERVIEWER. Flagged for future work once admin-managed account creation exists.

## Week 4: Interview Scheduling

### Endpoints

| Method | Path | Access | Description |
|---|---|---|---|
| POST | `/api/interviews` | ADMIN, INTERVIEWER | Schedule a new interview |
| GET | `/api/interviews/{id}` | ADMIN, INTERVIEWER (own only) | Fetch a single interview |
| GET | `/api/interviews/candidate/{candidateId}` | ADMIN, INTERVIEWER | List all interviews for a candidate |
| GET | `/api/interviews/me` | INTERVIEWER | List interviews assigned to the authenticated interviewer |
| GET | `/api/interviews/candidate/me` | CANDIDATE | List the authenticated candidate's own interviews |
| PATCH | `/api/interviews/{id}` | ADMIN, INTERVIEWER (own only) | Partially update `scheduledAt` and/or `status` |

### Request Example — Schedule Interview
`POST /api/interviews`
\```json
{
  "candidateId": 2,
  "interviewerId": 13,
  "interviewType": "TECHNICAL",
  "scheduledAt": "2026-09-25T10:00:00"
}
\```

### Response Example
\```json
{
  "id": 1,
  "candidateId": 2,
  "candidateName": "Test Candidate",
  "interviewerId": 13,
  "interviewerName": "Test Interviewer",
  "scheduledAt": "2026-09-25T10:00:00",
  "status": "SCHEDULED",
  "interviewType": "TECHNICAL",
  "createdAt": "2026-09-08T12:00:00"
}
\```

### Request Example — Partial Update
`PATCH /api/interviews/{id}`
\```json
{
  "status": "COMPLETED"
}
\```
Only fields present in the request body are updated; omitted fields remain unchanged.

### Key Decisions
- **Candidate/Interviewer linked via `@ManyToOne`, not embedded data** — `Interview` references `Candidate` and `User` (interviewer) by relationship, keeping a single source of truth for names/emails rather than duplicating them.
- **Interviewer role validated at schedule time** — `interviewerId` must belong to a `User` with `Role.INTERVIEWER`; attempting to assign a non-interviewer returns `400`.
- **Ownership enforced on `GetById` and `PATCH`** — an `INTERVIEWER` can only view/update interviews assigned to them; `ADMIN` has unrestricted access. Enforced in the service layer (requires a DB lookup, not expressible via `@PreAuthorize` alone).
- **`status` defaults to `SCHEDULED`** on creation via `@PrePersist`, reinforced explicitly in the service layer.
- **`PATCH` is a true partial update** — omitted fields are left untouched, not nulled out; verified via `Update - EmptyBody - Success` test case.
- **`GetByCandidateId` now returns `400` for a nonexistent candidate** (fixed Day 28), consistent with `GetById`'s not-found behavior — previously returned a silently misleading `200 []`.

### Known Deferred Items (Week 4)
- No/invalid JWT currently returns `403` rather than `401`, due to Spring Security's anonymous authentication being evaluated before `@PreAuthorize` — would require an explicit `AuthenticationEntryPoint` to properly distinguish "unauthenticated" from "forbidden."
- Double-booking prevention — no check yet preventing the same interviewer being scheduled twice at the same time.
- `candidateId` field naming ambiguity — `candidates.id` vs `users.id` confusion surfaced during testing; a future rename to `candidateProfileId` was discussed but not yet implemented.
- No status-transition rules on `PATCH` (e.g. `COMPLETED` → `SCHEDULED` is currently allowed) — accepted as out of scope for MVP.

## 8-Week Roadmap

| Week | Focus | Status |
|---|---|---|
| 1 | Foundation & project setup | ✅ Complete |
| 2 | Authentication & Authorization (JWT, roles) | ✅ Complete |
| 3 | User & Candidate Management | ✅ Complete  |
| 4 | Interview Scheduling | Not started |
| 5 | Interview Questions | Not started |
| 6 | Evaluation | Not started |
| 7 | Scoring, Ranking & Reports | Not started |
| 8 | Dashboard, Polish & Deployment Prep | Not started |
