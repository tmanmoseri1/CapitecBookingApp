PR Summary - Feature: Appointment editing, Admin UI, docker-compose, validation

Files added/modified:

Backend:
- ADD src/main/java/com/example/appointment/controller/MeController.java  (new endpoint /api/auth/me)
- MOD src/main/resources/db/migration/V1__init.sql  (added ip_address, user_agent columns)
- MOD src/main/java/com/example/appointment/entity/RefreshToken.java  (added ipAddress, userAgent fields)
- MOD src/main/java/com/example/appointment/service/RefreshTokenService.java (signature changed to accept ip/userAgent)
- MOD src/main/java/com/example/appointment/controller/AuthController.java (passes IP/UA for refresh tokens)
- ADD src/main/java/com/example/appointment/controller/RefreshTokenAdminController.java (admin endpoints) [previously added]
- ADD docker-compose.integration.yml (runs postgres, backend, frontend dev container)
- MOD .github/workflows/ci.yml (existing CI) - unchanged in this PR but present in repo

Frontend:
- MOD src/context/AuthContext.jsx (fetches /api/auth/me to get roles)
- MOD src/App.jsx (adds Admin link and route)
- ADD src/pages/AdminTokens.jsx (admin UI)
- MOD src/pages/Appointments.jsx (editing, validation, datetime-local inputs)
- MOD README.md (docs)

This PR implements client-side appointment editing and validation, an admin UI to manage refresh tokens, and a docker-compose to run the full stack locally for integration testing.
