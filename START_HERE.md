# Start Here

This repo currently contains a React frontend and Supabase schema/migrations.

## Do This First

1. Configure Supabase and apply `supabase/migrations/0000_schema.sql`.
2. Create `client/.env` from `../.env.example`.
3. Set:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
4. Run:
```bash
cd client
npm install
npm start
```

## Main Routes

- Public: `/`, `/flights`, `/hotels`, `/deals`, `/blog`, `/about`, `/contact`, `/partnership`
- Auth: `/checkout`, `/booking/:id`, `/dashboard`
- Admin-only: `/admin`

## Source of Truth

Use `client/` and `supabase/migrations/` as current architecture references.
