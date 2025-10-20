# Appointment Booking - Frontend (Vite + React + Tailwind) v1.3

This version adds:
- Appointment editing, form validation, and HTML5 date/time pickers.
- Admin UI page to view and revoke refresh tokens (visible only to users with ROLE_ADMIN).
- Integration with backend /api/auth/me to determine roles.

Run locally:
1. Install: `npm install`
2. Start dev server: `npm run dev`
3. Open: http://localhost:3000

Docker-compose:
- The repository root contains `docker-compose.integration.yml` that will start Postgres, backend (built locally), and frontend dev container.
- To use, run `docker-compose -f docker-compose.integration.yml up --build` from the backend project root.

Admin UI:
- Navigate to /admin after logging in as a user with ROLE_ADMIN.
- The Admin panel lists refresh tokens with IP/User-Agent and expiry, and allows revocation.
