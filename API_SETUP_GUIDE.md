# API Setup Guide (Current)

TravelMate currently requires Supabase credentials for frontend auth/data access.

## Required

Add to `client/.env`:

```bash
REACT_APP_SUPABASE_URL=https://<your-project>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>
```

## Supabase Steps

1. Create a Supabase project.
2. Open SQL editor.
3. Apply `supabase/migrations/0000_schema.sql`.
4. Confirm `profiles` and `bookings` tables exist.
5. Run the React app and validate auth/booking flow.

## Notes

- This repository does not currently include an active custom backend API service.
- Legacy references to Stripe/Razorpay/Twilio/MongoDB APIs are deprecated in this repo state.
