# TravelMate

TravelMate is a React travel booking app powered by Supabase auth and database.

## Current Stack

- React app in `client/`
- Zustand for client state
- Supabase for auth + data
- SQL migrations in `supabase/migrations/`
- Optional Nginx/Docker deployment files

## Features

- Flights and hotels browsing flows
- Checkout and booking confirmation
- Auth (register/login/logout)
- User dashboard and role-based admin route
- Deals, blog, partnership, about, contact pages
- Live nearby flights tracker on Home

## Quick Start

```bash
cd client
cp ../.env.example .env
# set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
npm install
npm start
```

Open `http://localhost:3000`.

## Supabase

Apply migration:
- `supabase/migrations/0000_schema.sql`

It creates `profiles` and `bookings` plus RLS policies.

## Note

Older docs that referenced Node/MongoDB/Stripe/Twilio were from a previous stack and are no longer the source of truth.
