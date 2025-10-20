# Appointment Booking System - Backend Skeleton (v1.7)

This repository contains a minimal Spring Boot backend skeleton for an Appointment Booking System.
New: token metadata (IP, User-Agent), admin endpoints to view/revoke refresh tokens, and CI workflow.

CI:
- GitHub Actions workflow at `.github/workflows/ci.yml` runs tests and builds a Docker image (no push).
- Workflow spins up a Postgres service for integration tests.

Admin endpoints (admin role required):
- GET /api/admin/refresh-tokens - list tokens (optional ?username=)
- POST /api/admin/refresh-tokens/{id}/revoke - revoke a token by id

Database:
- Flyway migration updated to create `ip_address` and `user_agent` columns on `refresh_tokens` table.
