# Deployment (Current)

TravelMate is currently deployed as a frontend React SPA backed by Supabase.

## Option 1: Static Frontend Hosting

Deploy `client/` to platforms like Vercel, Netlify, or any static host.

Required environment variables:

- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

## Option 2: Docker + Nginx (Frontend)

You can use the included Docker/Nginx setup for containerized static hosting.

## Supabase Production Checklist

1. Apply migrations in production Supabase project.
2. Verify RLS policies are enabled.
3. Set correct site URL/redirect URLs in Supabase Auth settings.
4. Rotate anon/service keys as needed.
5. Enable backups and monitoring in Supabase.

## Validate After Deploy

1. Register/login works.
2. Dashboard data is scoped by user.
3. Admin role can access `/admin`.
4. Booking creation and retrieval works end-to-end.
