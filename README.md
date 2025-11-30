# KarikaRide

KarikaRide is a bike rental web application that offers a public booking experience and an administrative dashboard. The platform is designed for an Angular 19 frontend (PrimeNG + Transloco + NgRx/Store) with either a Laravel or NestJS backend backed by MySQL/MariaDB.

## Features

- **Public app:** browse categories and bicycles, check availability, book rentals and service appointments without authentication.
- **Admin app:** JWT-secured CRUD management for bicycles, templates, categories, accessories, opening hours, service capacities, and daily rentals overview.
- **Availability-aware booking:** ensures bicycles cannot be double-booked when confirmed rentals overlap.

## Repository layout

- `api/openapi.yaml` — OpenAPI 3 definition covering public and admin endpoints.
- `db/schema.sql` — MySQL DDL creating core entities with indexes and status enums.
- `docs/architecture.md` — end-to-end architecture notes, data model summaries, and frontend module guidance.

## Getting started

1. Review the database schema in `db/schema.sql` and apply it to a MySQL/MariaDB instance.
2. Choose a backend (Laravel or NestJS) and scaffold the API following the routes documented in `api/openapi.yaml`.
3. Scaffold the Angular workspace using the structure outlined in `docs/architecture.md`, wiring services to the documented endpoints.
4. Integrate Transloco and PrimeNG for UI and localization, then implement pages/components incrementally.

## Availability logic refresher

A bicycle is unavailable for a requested period when a confirmed rental overlaps the requested window. For SQL-backed checks:

```sql
SELECT * FROM rentals
WHERE bicycle_id = :id
  AND status = 'confirmed'
  AND NOT (
    to_datetime <= :fromDatetime
    OR from_datetime >= :toDatetime
  );
```

Refer to `docs/architecture.md` for framework-specific helper functions.
