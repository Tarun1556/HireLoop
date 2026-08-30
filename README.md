# HireLoop

A full-stack interview management platform. Streamlines the hiring pipeline — candidate management, interview scheduling, question banks, structured evaluations, and candidate scoring — through a role-based dashboard for admins, interviewers, and candidates.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Spring Boot 4.1.0, Java 21, Maven (Maven Wrapper)
- **Database:** MySQL (Spring Data JPA + Hibernate)
- **Auth:** Spring Security + JWT (stateless)
- **IDE / OS:** VS Code, Windows (PowerShell)
- **API testing:** Postman ("HireLoop API" collection)

## Project Structure

```
HireLoop/
├── backend/     → Spring Boot REST API (port 8080)
├── frontend/    → React + Vite app (port 5173)
├── postman/     → "HireLoop API" Postman collection
└── docker-compose.yml   → placeholder, filled in later
```

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

## 8-Week Roadmap

| Week | Focus | Status |
|---|---|---|
| 1 | Foundation & project setup | ✅ Complete |
| 2 | Authentication & Authorization (JWT, roles) | ✅ Complete |
| 3 | User & Candidate Management | Not started |
| 4 | Interview Scheduling | Not started |
| 5 | Interview Questions | Not started |
| 6 | Evaluation | Not started |
| 7 | Scoring, Ranking & Reports | Not started |
| 8 | Dashboard, Polish & Deployment Prep | Not started |
