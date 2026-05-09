# Project Structure (Current)

```text
travelmate/
├── README.md
├── START_HERE.md
├── QUICK_START.md
├── API_SETUP_GUIDE.md
├── DEPLOYMENT.md
├── COMPLETE_SUMMARY.md
├── .env.example
├── client/
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── config/supabase.js
│   │   ├── store/store.js
│   │   ├── pages/
│   │   ├── components/
│   │   ├── lib/
│   │   └── styles/
│   └── public/
├── supabase/
│   └── migrations/
│       └── 0000_schema.sql
├── nginx/
├── scripts/
└── docker-compose.yml
```

## Data Layer

- `supabase/migrations/0000_schema.sql`
  - `public.profiles`
  - `public.bookings`
  - trigger `handle_new_user`
  - helper `is_admin()`
  - RLS policies for user/admin access

## Frontend Highlights

- Routing and guards in `client/src/App.js`
- Supabase client in `client/src/config/supabase.js`
- Auth/search/booking state in `client/src/store/store.js`
- Pages include flights, hotels, checkout, dashboard, admin, blog, deals, and more
