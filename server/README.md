# KarikaRide Server

This directory contains an Express-based starter implementation for the KarikaRide API. It implements the public and admin routes defined in `api/openapi.yaml` against the MySQL schema in `db/schema.sql`.

## Running locally

1. Copy `.env.example` to `.env` and update database credentials, admin credentials, and JWT secret.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the API server:
   ```bash
   npm run dev
   ```

The server listens on `PORT` (default `3000`) and exposes routes under the `/api` prefix.
