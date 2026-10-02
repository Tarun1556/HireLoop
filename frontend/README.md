# HireLoop Frontend

React single-page app for the HireLoop interview management platform. Role-based
UI for admins, interviewers, and candidates, talking to the Spring Boot REST API.

## Tech stack
- React (Vite), React Router
- Tailwind CSS + shadcn/ui (Radix), Lucide icons
- TanStack Query (server state), Axios (JWT interceptor)
- Recharts (dashboard and rankings charts)

## Run locally
The backend must be running first (from the repo root):

```bash
docker compose up
```

Then:

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

The API base URL is set in `src/services/apiClient.js` (`http://localhost:8080/api`).
The backend allows the `http://localhost:5173` origin via CORS.

## Pages by role

| Role | Pages |
|---|---|
| Admin | Dashboard (stats + chart), Candidates (list/detail), Interviews (list/schedule/detail with questions + evaluation), Question Bank (full CRUD), Rankings |
| Interviewer | Home, My Interviews (detail + evaluation), Candidates, Question Bank (read-only), Rankings |
| Candidate | Home, My Profile (create/edit), My Interviews |

## Structure
```
src/
├── components/   ui/ (shadcn), layout/ (sidebar, topbar), common/, dashboard/, interviews/
├── context/      AuthContext (user + token)
├── hooks/        TanStack Query hooks, one file per resource
├── layouts/      AppLayout (shell), AuthLayout (login/register)
├── pages/        admin/, candidate/, candidates/, interviewer/, interviews/, questions/, rankings/
├── services/     apiClient.js (Axios instance + interceptors)
└── utils/        roles, formatting, per-resource field helpers
```

## How it works
- **Auth:** login stores the JWT in `localStorage`; on load the app verifies it via
  `GET /users/me`. Axios attaches it to every request and logs out on a 401.
- **Route protection:** `ProtectedRoute` checks login state and allowed roles, and
  redirects users to their own home page.
- **Server state:** TanStack Query caches reads; mutations invalidate related queries.
- **Scores:** the overall score is computed server-side (weighted by interview type).
  The UI only displays it.
- **Resilience:** every data page has loading skeletons, empty states, and an error
  state with retry. An error boundary catches render crashes.

## Known limitations
- JWT is kept in `localStorage` (accepted trade-off; no refresh tokens)
- Lists filter and sort on the client (no pagination)
- Clickable table rows are not keyboard-focusable
- No dark mode
- Self-registration only creates candidates in the UI; admin and interviewer
  accounts are created through the API