# Baraka — Barbershop Management & Booking

Baraka is a demo barbershop management app built with Next.js. It includes an Arabic, right-to-left customer booking flow and a dashboard for managing appointments, barbers, services, customers, and salon settings.

> **Demo status:** This is a frontend MVP. It uses seeded salon data and browser `localStorage`; it does not connect to a backend, database, payment provider, or authentication service.

## Features

- Customer booking flow for choosing a service, barber, date, and available time slot
- Availability calculations based on service duration, barber schedules, and existing appointments
- Dashboard overview with daily appointment and revenue metrics
- Appointment list with date, barber, status, and search filters
- Barber and service management, including active status and working hours
- Customer directory and appointment history
- Salon profile and booking-link settings
- Arabic RTL user interface
- Demo data saved in the current browser and an option to reset the demo in the dashboard

## Tech stack

- Next.js 15 (App Router)
- React 19 and TypeScript
- Tailwind CSS 3
- Lucide React icons
- Browser `localStorage` for demo persistence

## Getting started

### Requirements

- Node.js 18.18 or newer
- npm

### Install and run locally

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To try the product demo, visit `/demo`. The customer booking page for the seeded salon is available at `/book/baraka-barbershop`.

## Available scripts

| Command         | Description                                             |
| --------------- | ------------------------------------------------------- |
| `npm run dev`   | Start the local development server                      |
| `npm run build` | Create an optimized production build                    |
| `npm run start` | Start the production server (run `npm run build` first) |
| `npm run lint`  | Run the configured Next.js lint command                 |

## Application routes

| Route                     | Description                     |
| ------------------------- | ------------------------------- |
| `/`                       | Product landing page            |
| `/demo`                   | Demo entry page                 |
| `/book/[salonSlug]`       | Public customer booking flow    |
| `/dashboard`              | Salon dashboard overview        |
| `/dashboard/appointments` | Appointment management          |
| `/dashboard/barbers`      | Barber management               |
| `/dashboard/services`     | Service catalog management      |
| `/dashboard/customers`    | Customer directory and history  |
| `/dashboard/settings`     | Salon and booking-link settings |

## Project structure

```text
src/
├── app/                 # App Router pages and global styles
├── components/          # Shared dashboard and UI components
├── context/             # Salon state and browser persistence
├── data/                # Seeded demo salon data
├── lib/                 # Scheduling and formatting helpers
└── types/               # Shared TypeScript data types
```

## Demo data and persistence

The initial salon, barbers, services, customers, and appointments are defined in `src/data/mockData.ts`. State changes are stored in the browser's `localStorage`, so they persist in that browser but are not shared with other devices or users. Use the dashboard's reset action to restore the seeded demo data.

## Notes

- The booking flow is a demonstration and does not send confirmations or collect payments.
- There is no sign-in or role-based access control; dashboard routes are not protected.
- Salon data and booking behavior are currently local to the browser session's stored demo state.
