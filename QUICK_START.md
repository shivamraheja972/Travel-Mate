# Quick Start

## Prerequisites

- Node.js 18+
- Supabase project

## Setup

```bash
cd client
cp ../.env.example .env
```

Add:

```bash
REACT_APP_SUPABASE_URL=https://<project>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<anon-key>
```

Apply SQL migration in Supabase:
- `supabase/migrations/0000_schema.sql`

Run app:

```bash
npm install
npm start
```

Visit `http://localhost:3000`.

## Verify

1. Register user.
2. Login.
3. Complete booking flow.
4. Check dashboard bookings.
