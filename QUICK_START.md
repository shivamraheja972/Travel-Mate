# 🚀 TravelMate - Quick Start Guide

**Get your travel booking website live in 30 minutes!**

## Step 1: Get Free API Keys (10 minutes)

### 1️⃣ Stripe (Payment Processing)
```
Website: https://stripe.com
Steps:
  1. Click "Sign up" → Fill details
  2. Dashboard → Developers → API Keys
  3. Copy both test keys
  4. Add to .env:
     STRIPE_PUBLIC_KEY=pk_test_xxx
     STRIPE_SECRET_KEY=sk_test_xxx
```

### 2️⃣ Razorpay (Indian Payments)
```
Website: https://razorpay.com
Steps:
  1. Sign up with email
  2. Settings → API Keys
  3. Copy keys
  4. Add to .env:
     RAZORPAY_KEY_ID=xxx
     RAZORPAY_KEY_SECRET=xxx
```

### 3️⃣ Twilio (WhatsApp Integration)
```
Website: https://twilio.com
Steps:
  1. Create free account
  2. Console → Phone Numbers → WhatsApp Sandbox
  3. Get Account SID & Auth Token
  4. Add to .env:
     TWILIO_ACCOUNT_SID=ACxxx
     TWILIO_AUTH_TOKEN=xxx
     TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 4️⃣ MongoDB (Database)
```
Website: https://mongodb.com/cloud/atlas
Steps:
  1. Sign up free
  2. Create a cluster (M0 - free)
  3. Get connection string
  4. Add to .env:
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/travelmate
```

### 5️⃣ Amadeus API (Flight Data)
```
Website: https://developers.amadeus.com
Steps:
  1. Register as developer
  2. Create new app
  3. Copy API key
  4. Add to .env:
     AMADEUS_API_KEY=xxx
```

**✅ All APIs have FREE tiers - no credit card needed to start!**

---

## Step 2: Setup Project (10 minutes)

### Option A: Using Docker (Easiest)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/travelmate.git
cd travelmate

# 2. Copy environment file
cp server/.env.example .env

# 3. Edit .env with your API keys
nano .env
# Paste all your API keys here

# 4. Start everything
docker-compose up -d

# 5. Check if running
docker-compose ps
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api

---

### Option B: Local Development (No Docker)

```bash
# Install Node.js first from https://nodejs.org

# 1. Backend setup
cd server
npm install
cp .env.example .env
# Edit .env with API keys
npm start

# 2. Frontend setup (new terminal)
cd client
npm install
npm start
```

---

## Step 3: Test Everything (5 minutes)

### Test Login
```bash
# Register at http://localhost:3000/register
Email: test@example.com
Password: Test123!@

# Login with same credentials
```

### Test Flight Search
```bash
# Go to http://localhost:3000/flights
# Search: From (DEL) → To (BOM) → Date (any date)
```

### Test Hotel Search
```bash
# Go to http://localhost:3000/hotels
# Search: City (Mumbai) → Check-in/out → Guests
```

### Test Payment (Stripe)
```bash
# Complete a booking
# At checkout, use card: 4242 4242 4242 4242
# Expiry: 12/25, CVC: 123
```

### Test WhatsApp Integration
```bash
# Send WhatsApp message to: +1 415-523-8886
# Message: "Book flight from Delhi to Mumbai"
# Bot will respond with options
```

---

## Free API Limits & Pricing

| Service | Free Tier | Paid Start |
|---------|-----------|------------|
| **Stripe** | Unlimited | 2.9% + $0.30 |
| **Razorpay** | Unlimited | 1.5% + ₹0 |
| **Twilio** | $20 credits | $0.0079 per message |
| **MongoDB** | 512MB storage | $57/month |
| **Amadeus** | 2,000 calls/mo | $0.01 per call |

---

## Deployment (5 minutes)

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create apps
heroku create travelmate-api
heroku create travelmate-client

# Set environment variables
heroku config:set -a travelmate-api \
  MONGODB_URI=your_mongodb_uri \
  JWT_SECRET=your_secret \
  STRIPE_SECRET_KEY=your_key \
  ...

# Deploy
git push heroku main
```

### Deploy to DigitalOcean

```bash
# Create droplet ($5/month)
# SSH into it
ssh root@your_ip

# Run deployment script (in repo)
bash deploy/digitalocean.sh
```

### Deploy to Render.com

```bash
# Push to GitHub
git push

# Connect to Render
# Dashboard → New Web Service
# Select repo → Auto-deploy on push
```

---

## Make It Visible on Google

### 1. Google Search Console
```bash
# Go to: https://search.google.com/search-console
# Add your domain
# Submit sitemap: /sitemap.xml
# Verify ownership
# Monitor search performance
```

### 2. Google Analytics
```bash
# Go to: https://analytics.google.com
# Create property
# Add ID to .env:
  GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### 3. SEO Meta Tags
- Already configured in all pages ✅
- Automatic sitemap generation ✅
- robots.txt configured ✅

---

## Production Checklist

- [ ] All API keys added to .env
- [ ] MongoDB Atlas cluster created
- [ ] Stripe test mode verified
- [ ] Twilio WhatsApp configured
- [ ] JWT_SECRET changed
- [ ] Frontend URL updated
- [ ] Email service configured
- [ ] SSL certificate added (for HTTPS)
- [ ] Domain name configured
- [ ] Backup strategy planned

---

## Common Issues & Fixes

### "Cannot find module"
```bash
cd server
npm install
cd ../client
npm install
```

### "MongoDB connection failed"
```bash
# Check MongoDB URI in .env
# Verify IP whitelist in MongoDB Atlas
# Add 0.0.0.0/0 to allow all IPs
```

### "Stripe API key invalid"
```bash
# Verify you're using test keys (starts with pk_test_ or sk_test_)
# Check for extra spaces in .env
```

### "WhatsApp not responding"
```bash
# Verify Twilio credentials
# Check webhook URL is publicly accessible
# Review Twilio logs in console
```

---

## Next Steps

1. ✅ Get API keys (10 min)
2. ✅ Setup project (10 min)
3. ✅ Test functionality (5 min)
4. ✅ Deploy to production (5 min)
5. ✅ Setup Google indexing (5 min)
6. ✅ Start marketing (∞)

---

## Support & Resources

- **Documentation**: `/README.md`
- **API Docs**: `http://localhost:5000/api-docs`
- **Stripe Docs**: https://stripe.com/docs
- **Twilio Docs**: https://twilio.com/docs
- **MongoDB Docs**: https://docs.mongodb.com

---

## License
MIT - Use freely for personal and commercial projects

---

**🎉 Congratulations! Your travel booking platform is ready!**

Questions? Email: support@travelmate.com
