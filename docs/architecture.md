# Architecture Overview

KarikaRide is split into a **Public** experience (unauthenticated) and an **Admin** dashboard (JWT-secured). The stack pairs an Angular 19 frontend (PrimeNG + Transloco + RxJS + Store) with either Laravel or NestJS for the backend. MySQL/MariaDB stores all data.

## Core entities

Names are reused for database tables, DTOs, interfaces, and services to maintain consistency.

- **Bicycle** — individual rentable bike; links to `BicycleCategory` and optionally a `BicycleTemplate`.
- **BicycleTemplate** — reusable presets for description, recommended riders, and size.
- **BicycleCategory** — pricing buckets (hour/day) and descriptions.
- **Accessory** — rentable add-ons with pricing.
- **Rental** — booking window for a bicycle with contact details and status lifecycle.
- **OpeningHours** — weekday-based open/close times.
- **ServiceBooking** — workshop/service appointments on specific dates.
- **ServiceCapacity** — per-weekday service capacity limits.

## Availability logic

A rental overlaps when the requested window intersects an existing **confirmed** rental. Recommended helpers:

- **Laravel (PHP)**

```php
public function hasOverlap($bicycleId, $from, $to) {
    return Rental::where('bicycle_id', $bicycleId)
        ->where('status', 'confirmed')
        ->where(function ($q) use ($from, $to) {
            $q->where('from_datetime', '<', $to)
              ->where('to_datetime', '>', $from);
        })->exists();
}
```

- **NestJS (TypeScript)**

```ts
async hasOverlap(bicycleId: number, from: Date, to: Date): Promise<boolean> {
  const count = await this.db.rental.count({
    where: {
      bicycleId,
      status: 'confirmed',
      NOT: [
        { toDatetime: { lte: from } },
        { fromDatetime: { gte: to } }
      ]
    }
  });
  return count > 0;
}
```

## Angular workspace blueprint

```
/src
  /app
    /core
      /services
      /models
      /guards
    /public
      /components
      /pages
      /services
    /admin
      /components
      /pages
      /services
    /shared
      /ui
      /pipes
      /validators
    app-routing.module.ts
    app.module.ts
```

### Recommended modules & pages

- **PublicModule**
  - `RentBikePage`, `CalendarComponent`, `BikeListComponent`, `BikeDetailsComponent`, `ServiceBookingPage`
- **AdminModule**
  - `LoginPage`, `DashboardPage`, `BicycleCrudPage`, `CategoryCrudPage`, `AccessoryCrudPage`, `RentalsTodayPage`, `OpeningHoursPage`, `ServiceCapacityPage`

### Key services

- **AvailabilityService** — `getAvailableBicycles(from: string, to: string): Observable<Bicycle[]>` (calls `/api/public/availability`).
- **RentalService** — `createRental(payload: CreateRentalRequest)`, `getRentalsToday()`, `updateRentalStatus(id: number, status: string)`.

### Frontend data models

Interfaces mirror backend entities:

- `Bicycle { id: number; categoryId: number; templateId?: number; name: string; description: string; recommendedFor: string; size: string; imageUrl: string; status: 'active' | 'inactive'; }`
- `BicycleTemplate { id: number; name: string; description: string; recommendedFor: string; size: string; }`
- `BicycleCategory { id: number; name: string; priceHour: number; priceDay: number; description: string; }`
- `Accessory { id: number; name: string; price: number; description: string; imageUrl: string; }`
- `Rental { id: number; bicycleId: number; userName: string; userPhone: string; userEmail?: string; fromDatetime: string; toDatetime: string; status: 'confirmed' | 'cancelled' | 'completed'; }`
- `OpeningHours { id: number; weekday: number; openTime: string; closeTime: string; }`
- `ServiceBooking { id: number; date: string; userName: string; userPhone: string; description: string; }`
- `ServiceCapacity { id: number; weekday: number; capacity: number; }`

### Routing notes

- **Public** routes are unprotected and surface category browsing, bike details, availability search, rental creation, and service booking.
- **Admin** routes are protected via JWT guard; failed authorization should redirect to `LoginPage`.

## API surface

The application exposes two base URL groups: `/api/public/*` (unprotected) and `/api/admin/*` (JWT-protected). The full OpenAPI definition lives in `api/openapi.yaml`.

### Public endpoints

- `GET /api/public/categories` — list all categories.
- `GET /api/public/bicycles?categoryId=` — list bicycles (optional category filter).
- `GET /api/public/availability?from=&to=` — return bicycles available in a time period.
- `POST /api/public/rental` — create a rental request.
- `GET /api/public/service/capacity?date=YYYY-MM-DD` — remaining service capacity for the date.
- `POST /api/public/service-booking` — create a service booking request.

### Admin endpoints

- `POST /api/admin/login` — returns JWT token.
- CRUD: Bicycle Templates, Bicycles, Categories, Accessories, Opening Hours, Service Capacity.
- `GET /api/admin/rentals/today` — rentals for current day.
- `PUT /api/admin/rental/:id/status` — update rental status (confirmed | cancelled | completed).

## Database considerations

- Use `ENUM` for status fields (`bicycles.status`, `rentals.status`).
- Add foreign keys for relationships (bicycle → category/template; rentals → bicycle).
- Index date ranges on `rentals` to speed up overlap queries (`bicycle_id`, `from_datetime`, `to_datetime`).
- `opening_hours.weekday` and `service_capacity.weekday` both use `0 = Monday` convention.

## Backend starter tips

- Laravel: implement `api.php` routes using controllers per entity; employ middleware for `/api/admin/*` JWT guard. Use request validation for dates and statuses.
- NestJS: group controllers under `public` and `admin` modules; use Passport JWT for protected routes; Prisma or TypeORM for persistence.

## Localization & UI

- Set up Transloco with namespaces for `public`, `admin`, and `shared` texts.
- Use PrimeNG components for forms, tables, calendars, and dialogs to minimize custom CSS during initial implementation.
- Gradually add store slices for rentals, bicycles, and categories as API clients mature.
