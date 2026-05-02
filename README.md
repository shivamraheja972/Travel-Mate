# TravelMate - Full Stack Travel Booking Platform

A production-ready travel booking platform with flights, hotels, WhatsApp integration, payment processing, and automatic booking capabilities.

## 🚀 Features

- ✈️ **Flight Booking** - Search and book flights from multiple airlines
- 🏨 **Hotel Booking** - Browse and reserve hotels worldwide
- 💳 **Payment Integration** - Stripe, Razorpay, UPI support
- 💬 **WhatsApp Integration** - Real-time booking notifications and support
- 🤖 **Automatic Booking** - WhatsApp-based booking system
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔐 **User Authentication** - Secure JWT-based auth
- 👨‍💼 **Admin Dashboard** - Manage bookings and users
- 📊 **Real-time Updates** - Socket.IO for live notifications
- 🔍 **SEO Optimized** - Google-friendly sitemap and meta tags

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Docker** (Optional, for containerized deployment)
- **Git** ([Download](https://git-scm.com/))

## 🔑 Free API Keys & Services

Get these free accounts and API keys:

### 1. **Stripe** (Payment Processing)
- Go to [stripe.com](https://stripe.com)
- Create free account → Dashboard → Get test API keys
- Keys: `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`

### 2. **Razorpay** (Payment Processing)
- Go to [razorpay.com](https://razorpay.com)
- Create free account → Settings → API Keys
- Keys: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

### 3. **Twilio** (WhatsApp Integration)
- Go to [twilio.com](https://twilio.com)
- Free trial: $20 credits
- Phone: +1 415-523-8886 (sandbox)
- Keys: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`

### 4. **Amadeus API** (Flight Data)
- Go to [amadeus.com/developers](https://developers.amadeus.com)
- Free tier: 2,000 API calls/month
- Key: `AMADEUS_API_KEY`

### 5. **RapidAPI** (Hotel Data)
- Go to [rapidapi.com](https://rapidapi.com)
- Subscribe to free hotel APIs
- Key: `RAPIDAPI_KEY`

### 6. **MongoDB Atlas** (Database)
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create free cluster
- URI: `MONGODB_URI`

## 📦 Installation

### Option 1: Local Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/travelmate.git
cd travelmate

# Backend Setup
cd server
npm install
cp .env.example .env
# Edit .env with your API keys
node server.js

# Frontend Setup (in new terminal)
cd client
npm install
npm start
```

### Option 2: Docker Deployment (Recommended)

```bash
# Create .env file in root directory
cp server/.env.example .env

# Edit .env with your API keys
nano .env

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

## 📝 Environment Variables

Create `.env` file in server directory:

```bash
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/travelmate
JWT_SECRET=your-super-secret-key

# Stripe
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# Razorpay
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Flight APIs
AMADEUS_API_KEY=xxx
SKYSCANNER_API_KEY=xxx

# Hotel APIs
RAPIDAPI_KEY=xxx

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary (Image Hosting)
CLOUDINARY_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "securepassword",
  "confirmPassword": "securepassword"
}

Response: { token, user }
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: { token, user }
```

### Flights Endpoints

#### Search Flights
```bash
POST /flights/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "from": "DEL",
  "to": "BOM",
  "departDate": "2024-03-15",
  "passengers": 1,
  "class": "economy"
}

Response: { flights[] }
```

#### Get Flight Details
```bash
GET /flights/{flightId}
Authorization: Bearer {token}

Response: { flight }
```

### Hotels Endpoints

#### Search Hotels
```bash
POST /hotels/search
Authorization: Bearer {token}
Content-Type: application/json

{
  "city": "Mumbai",
  "checkIn": "2024-03-15",
  "checkOut": "2024-03-17",
  "guests": 2,
  "rooms": 1
}

Response: { hotels[] }
```

### Bookings Endpoints

#### Create Booking
```bash
POST /bookings/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_id",
  "bookingType": "flight",
  "flightDetails": {...},
  "totalPrice": 5000
}

Response: { booking, bookingId }
```

#### Get User Bookings
```bash
GET /bookings/user/{userId}
Authorization: Bearer {token}

Response: { bookings[] }
```

### Payments Endpoints

#### Create Stripe Payment Intent
```bash
POST /payments/create-payment-intent
Authorization: Bearer {token}
Content-Type: application/json

{
  "bookingId": "booking_id",
  "amount": 5000,
  "currency": "usd"
}

Response: { clientSecret, paymentIntentId }
```

#### Confirm Payment
```bash
POST /payments/confirm
Authorization: Bearer {token}
Content-Type: application/json

{
  "paymentIntentId": "pi_xxx",
  "bookingId": "booking_id"
}

Response: { success, booking }
```

### WhatsApp Integration

#### Send WhatsApp Message
The system automatically sends messages when:
- User makes a booking
- Payment is confirmed
- Booking status changes

#### Webhook Endpoint
```bash
POST /whatsapp/webhook

# Receives incoming WhatsApp messages
# Automatically processes booking requests
```

## 🛣️ SEO & Google Visibility

### 1. Sitemap
- Automatically generated at `/sitemap.xml`
- Updated on every deployment

### 2. robots.txt
- Located at `/robots.txt`
- Allows search engines to crawl public pages

### 3. Meta Tags
- All pages have proper meta descriptions
- Open Graph tags for social sharing
- Structured data (JSON-LD) for rich snippets

### 4. Google Analytics
- Add your Google Analytics ID to `.env`
- Automatically tracks user behavior

### 5. Submit to Google
```bash
# Go to Google Search Console
https://search.google.com/search-console

# Add your domain
# Submit sitemap.xml
# Monitor indexing and search performance
```

## 🚀 Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create travelmate-api
heroku create travelmate-client

# Set environment variables
heroku config:set -a travelmate-api NODE_ENV=production
heroku config:set -a travelmate-api MONGODB_URI=your_mongodb_uri
# ... set all other variables

# Deploy
git push heroku main
```

### AWS Deployment with EC2

```bash
# SSH into EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install MongoDB
sudo yum install -y mongodb-server

# Clone and setup
git clone your-repo
cd travelmate
npm install
npm start
```

### DigitalOcean App Platform

```bash
# Install DigitalOcean CLI
doctl auth init

# Create app
doctl apps create --spec app.yaml

# Deploy
doctl apps update <app-id> --spec app.yaml
```

## 📱 WhatsApp Integration Guide

### Setup WhatsApp Webhook

1. Go to Twilio Console
2. Create Messaging Service
3. Set Webhook URL: `https://yourdomain.com/api/whatsapp/webhook`
4. Enable HTTP webhooks
5. Users can now message your WhatsApp number to book

### Booking via WhatsApp

User texts:
```
"Book flight from Delhi to Mumbai on March 15"
```

Bot responds:
```
"✈️ Found 4 flights!
1. Air India - ₹4,500 - 08:00 AM
2. SpiceJet - ₹3,800 - 12:00 PM
...
Reply with number to select!"
```

## 🧪 Testing

### Test Payment Cards

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Requires Authentication: `4000 0025 0000 3155`
- Declined: `4000 0000 0000 0002`

**Razorpay Test Cards:**
- Success: `5111 1111 1111 1111`
- Declined: `5105 1051 0510 5100`

## 📊 Admin Dashboard

Access at: `http://localhost:3000/admin`

Features:
- View all bookings
- Manage users
- Revenue analytics
- Send promotions
- Booking status management

## 🔒 Security Best Practices

- ✅ JWT tokens expire in 7 days
- ✅ Passwords hashed with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ CORS configured
- ✅ Helmet.js for security headers
- ✅ Input validation with Joi
- ✅ SQL injection prevention (using Mongoose)

## 📈 Performance Optimization

- Caching with Node-Cache (1 hour TTL)
- Database indexes on frequently queried fields
- Image optimization with Cloudinary
- Lazy loading on frontend
- Code splitting with React Router

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# For MongoDB Atlas, verify connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelmate
```

### Stripe/Razorpay Not Working
```bash
# Verify API keys in .env
# Check if test mode is enabled
# Verify webhook endpoints
```

### WhatsApp Messages Not Sending
```bash
# Verify Twilio credentials
# Check WhatsApp number formatting
# Review Twilio logs in console
```

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

For support, email: support@travelmate.com
Or visit: https://travelmate.com/support

## 🎉 Ready to Deploy!

You now have a complete, production-ready travel booking platform!

1. Get free API keys (5-10 minutes)
2. Setup environment variables (5 minutes)
3. Run with Docker Compose (2 minutes)
4. Start accepting bookings! 🚀

---

**Made with ❤️ for travelers**
