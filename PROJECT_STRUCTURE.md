# 📁 TravelMate - Complete Project Structure

```
travelmate/
├── 📄 README.md                     # Complete documentation
├── 📄 QUICK_START.md                # 30-minute setup guide
├── 📄 API_SETUP_GUIDE.md            # Free API keys setup
├── 📄 DEPLOYMENT.md                 # Production deployment guide
├── 📄 docker-compose.yml            # Full stack Docker config
│
├── 📁 server/                       # Backend (Node.js + Express)
│   ├── 📄 server.js                 # Main entry point
│   ├── 📄 package.json              # Dependencies
│   ├── 📄 .env.example              # Environment variables template
│   ├── 📄 Dockerfile                # Container config
│   │
│   ├── 📁 config/
│   │   └── 📄 database.js           # MongoDB connection
│   │
│   ├── 📁 middleware/
│   │   ├── 📄 rateLimiter.js        # API rate limiting
│   │   └── 📄 errorHandler.js       # Global error handler
│   │
│   ├── 📁 models/
│   │   ├── 📄 User.js               # User schema
│   │   └── 📄 Booking.js            # Booking schema
│   │
│   ├── 📁 routes/
│   │   ├── 📄 auth.js               # Authentication routes
│   │   ├── 📄 flights.js            # Flight search & booking
│   │   ├── 📄 hotels.js             # Hotel search & booking
│   │   ├── 📄 bookings.js           # Booking management
│   │   ├── 📄 payments.js           # Payment integration
│   │   ├── 📄 whatsapp.js           # WhatsApp integration
│   │   ├── 📄 users.js              # User profile
│   │   └── 📄 admin.js              # Admin dashboard
│   │
│   └── 📁 utils/
│       ├── 📄 emails.js             # Email notifications
│       └── 📄 notifications.js      # SMS/Push notifications
│
├── 📁 client/                       # Frontend (React)
│   ├── 📄 package.json              # Dependencies
│   ├── 📄 Dockerfile                # Container config
│   │
│   ├── 📁 src/
│   │   ├── 📄 App.js                # Main component
│   │   ├── 📄 index.js              # Entry point
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── 📄 Home.js           # Homepage
│   │   │   ├── 📄 Flights.js        # Flight search page
│   │   │   ├── 📄 Hotels.js         # Hotel search page
│   │   │   ├── 📄 FlightDetails.js  # Flight details
│   │   │   ├── 📄 HotelDetails.js   # Hotel details
│   │   │   ├── 📄 Checkout.js       # Checkout page
│   │   │   ├── 📄 BookingConfirmation.js
│   │   │   ├── 📄 UserDashboard.js  # User bookings
│   │   │   ├── 📄 AdminDashboard.js # Admin panel
│   │   │   ├── 📄 Login.js          # Login page
│   │   │   ├── 📄 Register.js       # Registration page
│   │   │   └── 📄 NotFound.js       # 404 page
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── 📄 Navbar.js         # Navigation bar
│   │   │   ├── 📄 Footer.js         # Footer
│   │   │   ├── 📄 SearchBar.js      # Search component
│   │   │   ├── 📄 FlightCard.js     # Flight card
│   │   │   ├── 📄 HotelCard.js      # Hotel card
│   │   │   ├── 📄 BookingSummary.js # Booking summary
│   │   │   ├── 📄 PaymentForm.js    # Payment form
│   │   │   ├── 📄 ProtectedRoute.js # Auth guard
│   │   │   └── 📄 Loading.js        # Loading spinner
│   │   │
│   │   ├── 📁 hooks/
│   │   │   └── 📄 api.js            # Custom API hooks
│   │   │
│   │   ├── 📁 config/
│   │   │   └── 📄 api.js            # API client config
│   │   │
│   │   ├── 📁 styles/
│   │   │   ├── 📄 tailwind.css      # Tailwind config
│   │   │   └── 📄 globals.css       # Global styles
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── 📄 formatters.js     # Date/currency formatting
│   │   │   └── 📄 validators.js     # Input validation
│   │   │
│   │   └── 📁 store/
│   │       └── 📄 store.js          # Zustand state management
│   │
│   └── 📁 public/
│       ├── 📄 index.html            # HTML template
│       ├── 📄 favicon.ico
│       └── 📄 robots.txt
│
├── 📁 nginx/                        # Nginx config (optional)
│   └── 📄 nginx.conf                # Reverse proxy config
│
├── 📁 scripts/                      # Deployment scripts
│   ├── 📄 setup.sh                  # Initial setup
│   ├── 📄 deploy.sh                 # Deployment script
│   └── 📄 backup.sh                 # Backup script
│
└── 📄 .gitignore                    # Git ignore rules
```

---

## 🔑 API Routes Summary

### Authentication
```
POST   /api/auth/register           # Register user
POST   /api/auth/login              # Login
POST   /api/auth/logout             # Logout
POST   /api/auth/verify             # Verify token
POST   /api/auth/forgot-password    # Request password reset
POST   /api/auth/reset-password     # Reset password
```

### Flights
```
POST   /api/flights/search          # Search flights
GET    /api/flights/:id             # Get flight details
GET    /api/flights/popular/routes  # Popular routes
POST   /api/flights/price-alerts    # Create price alert
```

### Hotels
```
POST   /api/hotels/search           # Search hotels
GET    /api/hotels/:id              # Get hotel details
GET    /api/hotels/:id/reviews      # Get reviews
GET    /api/hotels/popular/destinations
```

### Bookings
```
POST   /api/bookings/create         # Create booking
GET    /api/bookings/user/:id       # Get user bookings
GET    /api/bookings/:id            # Get booking details
PATCH  /api/bookings/:id/cancel     # Cancel booking
PATCH  /api/bookings/:id/requests   # Update special requests
GET    /api/bookings/:id/timeline   # Get booking timeline
```

### Payments
```
POST   /api/payments/create-payment-intent     # Create Stripe intent
POST   /api/payments/confirm                   # Confirm payment
POST   /api/payments/razorpay/order           # Create Razorpay order
POST   /api/payments/razorpay/verify          # Verify Razorpay payment
POST   /api/payments/refund                    # Process refund
GET    /api/payments/history/:userId          # Payment history
```

### WhatsApp
```
POST   /api/whatsapp/webhook                  # Receive WhatsApp messages
POST   /api/whatsapp/send-confirmation/:id    # Send confirmation
POST   /api/whatsapp/send-promo               # Send promotion
```

### Users
```
GET    /api/users/:id                         # Get profile
PATCH  /api/users/:id                         # Update profile
PATCH  /api/users/:id/notifications           # Notification settings
PATCH  /api/users/:id/whatsapp                # Add WhatsApp number
GET    /api/users/:id/wallet                  # Get wallet balance
```

### Admin
```
GET    /api/admin/dashboard/stats             # Dashboard stats
GET    /api/admin/bookings/all                # All bookings
GET    /api/admin/users/all                   # All users
PATCH  /api/admin/bookings/:id/status         # Update booking status
POST   /api/admin/promotions/send             # Send promotions
GET    /api/admin/reports/revenue             # Revenue report
```

---

## 🗂️ Database Collections

### Users
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  profileImage: String,
  gender: String,
  dateOfBirth: Date,
  address: Object,
  passportNumber: String,
  passportExpiry: Date,
  preferredCurrency: String,
  whatsappNumber: String,
  whatsappOptIn: Boolean,
  notifications: Object,
  role: String (user|admin|partner),
  bookings: [ObjectId],
  savedItineraries: [ObjectId],
  wallet: Object,
  isActive: Boolean,
  isEmailVerified: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Bookings
```javascript
{
  _id: ObjectId,
  bookingId: String (unique),
  bookingType: String (flight|hotel|flight+hotel),
  user: ObjectId,
  flightDetails: Object,
  hotelDetails: Object,
  price: Object,
  payment: Object,
  status: String,
  specialRequests: String,
  insurance: Object,
  contactInfo: Object,
  documents: Array,
  timeline: Array,
  notes: String,
  partner: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Data Flow

### Booking Flow
```
User Login
  ↓
Search Flights/Hotels
  ↓
Select Option
  ↓
Review Booking
  ↓
Enter Passenger Details
  ↓
Choose Payment Method
  ↓
Payment Processing (Stripe/Razorpay)
  ↓
Booking Confirmed
  ↓
WhatsApp Notification
  ↓
Booking Tracking Available
```

### Real-time Updates (Socket.IO)
```
Payment Confirmation
  ↓
Socket emit to client
  ↓
UI updates in real-time
  ↓
WhatsApp notification sent
  ↓
Email confirmation
```

---

## 🔐 Security Implementation

1. **Authentication**
   - JWT tokens (7-day expiry)
   - Password hashing with bcrypt
   - Email verification
   - Password reset flow

2. **Authorization**
   - Role-based access control
   - Protected routes
   - Admin-only endpoints

3. **Data Protection**
   - Encrypted sensitive fields
   - HTTPS in production
   - CORS configuration
   - Rate limiting

4. **API Security**
   - Input validation with Joi
   - Helmet.js headers
   - SQL injection prevention (Mongoose)
   - XSS protection

---

## 📊 Performance Features

1. **Caching**
   - Node-Cache for API responses
   - 1-hour TTL for search results
   - Browser caching for static assets

2. **Database Optimization**
   - Indexes on frequently queried fields
   - Connection pooling
   - Query optimization

3. **Frontend Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization (Cloudinary)
   - Minification & compression

4. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

---

## 🧪 Testing

### Backend Testing
```bash
npm test                  # Run all tests
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:coverage    # Coverage report
```

### Frontend Testing
```bash
npm test                  # Run tests
npm run test:coverage    # Coverage report
```

---

## 📝 Configuration Files

### .env
- Database connection
- API keys and secrets
- Payment gateway credentials
- WhatsApp integration
- Email settings
- Analytics

### docker-compose.yml
- MongoDB service
- Backend service
- Frontend service
- Nginx reverse proxy
- Health checks

### package.json
- All dependencies
- Build scripts
- Dev dependencies
- Version info

---

## 🚀 Deployment Files

- **Dockerfile** - Container images
- **docker-compose.yml** - Orchestration
- **.github/workflows** - CI/CD
- **nginx.conf** - Reverse proxy
- **ecosystem.config.js** - PM2 config

---

## 📚 Documentation Files

- **README.md** - Complete guide
- **QUICK_START.md** - 30-minute setup
- **API_SETUP_GUIDE.md** - Free API keys
- **DEPLOYMENT.md** - Production deployment
- **API_DOCS.md** - API reference (auto-generated)

---

## 💾 Backup & Recovery

```bash
# Database backup
mongodump --uri="mongodb://..." --out=backup/

# Database restore
mongorestore --uri="mongodb://..." backup/

# Code backup
git clone (full history)

# Environment backup
cp .env .env.backup
```

---

## ✅ Project Ready!

This structure provides:
- ✅ Scalable architecture
- ✅ Clean code organization
- ✅ Easy maintenance
- ✅ Production-ready
- ✅ Full documentation
- ✅ Easy deployment

**All files are in `/home/claude/` - Ready to download!**
