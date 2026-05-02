# 🆓 Complete Free API & Services Setup

## 1. STRIPE (Payment Processing)

### Get Free Account
- Website: https://stripe.com
- Click "Sign up" → Choose "Build a SaaS"
- Email verification → Dashboard

### Get API Keys
1. Login to Stripe Dashboard
2. Click "Developers" → "API keys"
3. You'll see:
   - **Publishable Key** (pk_test_xxx) → Frontend
   - **Secret Key** (sk_test_xxx) → Backend
4. Test cards available: 4242 4242 4242 4242

### .env Configuration
```
STRIPE_PUBLIC_KEY=pk_test_123456789abcdef
STRIPE_SECRET_KEY=sk_test_123456789abcdef
```

### Webhook Setup
1. Developers → Webhooks
2. Add endpoint: https://yourdomain.com/api/payments/webhook
3. Events: payment_intent.succeeded

---

## 2. RAZORPAY (Indian UPI/Card Payments)

### Get Free Account
- Website: https://razorpay.com
- Sign up → Email verification → Dashboard

### Get API Keys
1. Settings → API Keys
2. You'll see:
   - **Key ID** → Frontend
   - **Key Secret** → Backend
3. Test cards: 5111 1111 1111 1111

### .env Configuration
```
RAZORPAY_KEY_ID=rzp_test_XYZ123
RAZORPAY_KEY_SECRET=test_secret_XYZ123
```

### Test Orders
```javascript
// Test amount: ₹100 (1000 paise)
const order = await razorpay.orders.create({
  amount: 1000,
  currency: "INR",
  receipt: "receipt_123"
});
```

---

## 3. TWILIO (WhatsApp + SMS)

### Get Free Account
- Website: https://twilio.com
- Sign up → Phone verification → $20 free trial credit
- Never expires (can keep using free tier)

### Get Credentials
1. Console → Account SID (top left)
2. Auth Token (next to SID)
3. Phone Numbers → Get WhatsApp Sandbox Number

### Credentials
```
TWILIO_ACCOUNT_SID=ACb1234567890abcdef1234567890ab
TWILIO_AUTH_TOKEN=your_auth_token_here_12chars
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Test WhatsApp Messaging
```javascript
const client = require('twilio')(accountSid, authToken);

// Send message
await client.messages.create({
  from: 'whatsapp:+14155238886',
  to: 'whatsapp:+919876543210',
  body: 'Hello from TravelMate!'
});
```

### WhatsApp Sandbox Setup
1. Login to Twilio → WhatsApp → Sandbox
2. Follow: "To get started, send a WhatsApp message..."
3. Send message from your phone to number shown
4. Save number for testing

---

## 4. MONGODB (Database)

### Get Free Account
- Website: https://mongodb.com/cloud/atlas
- Sign up → Email verification
- Create Organization → Create Project → Create Cluster (M0 - Free)

### Get Connection String
1. Clusters → Connect
2. Choose "Drivers" → Node.js
3. Copy connection string
4. Replace username and password

### Connection String Format
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelmate?retryWrites=true&w=majority
```

### Example
```
MONGODB_URI=mongodb+srv://travelmateuser:MySecurePass123@travelmate.mongodb.net/travelmate?retryWrites=true&w=majority
```

### IP Whitelist
1. Network Access → Add IP Address
2. Add: 0.0.0.0/0 (allows all)
3. Or: Add your specific IP

---

## 5. AMADEUS API (Flight Data)

### Get Free Account
- Website: https://developers.amadeus.com
- Register as developer
- Create app/project

### Get API Keys
1. Dashboard → My Apps
2. Create New App
3. Copy:
   - **Client ID** (API Key)
   - **Client Secret**

### .env Configuration
```
AMADEUS_API_KEY=your_client_id_here
AMADEUS_CLIENT_SECRET=your_client_secret_here
```

### Free Tier Limits
- 2,000 API calls per month
- Production environment

### Test Request
```bash
curl -X POST https://test.api.amadeus.com/v1/security/oauth2/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_KEY&client_secret=YOUR_SECRET"
```

---

## 6. RAPIDAPI (Hotel & Travel Data)

### Get Free Account
- Website: https://rapidapi.com
- Sign up → Email verification

### Browse Free APIs
1. Search "hotel booking api"
2. Filter by "Free"
3. Subscribe to free plan

### Get API Key
1. Dashboard → My Apps → Rapid API
2. Copy API key
3. Add to .env

### .env Configuration
```
RAPIDAPI_KEY=your_api_key_here
RAPIDAPI_HOST=booking-com.p.rapidapi.com
```

---

## 7. CLOUDINARY (Image Hosting)

### Get Free Account
- Website: https://cloudinary.com
- Sign up → Email verification

### Get Credentials
1. Dashboard → Settings
2. Cloud Name, API Key, API Secret

### .env Configuration
```
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 8. GOOGLE ANALYTICS (Traffic Tracking)

### Setup
1. Go to https://analytics.google.com
2. Sign in with Google account
3. Create Property
4. Get Tracking ID (G-XXXXXXXXXX)

### .env Configuration
```
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## Complete .env File (Ready to Use)

```bash
# ==================== SERVER ====================
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# ==================== DATABASE ====================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelmate?retryWrites=true&w=majority

# ==================== SECURITY ====================
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-change-in-production!!!

# ==================== STRIPE ====================
STRIPE_PUBLIC_KEY=pk_test_51234567890
STRIPE_SECRET_KEY=sk_test_51234567890

# ==================== RAZORPAY ====================
RAZORPAY_KEY_ID=rzp_test_1234567890
RAZORPAY_KEY_SECRET=test_secret_1234567890

# ==================== TWILIO (WhatsApp) ====================
TWILIO_ACCOUNT_SID=ACb1234567890abcdef1234567890ab
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# ==================== FLIGHT APIS ====================
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_CLIENT_SECRET=your_amadeus_secret
SKYSCANNER_API_KEY=your_skyscanner_key

# ==================== HOTEL APIs ====================
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=booking-com.p.rapidapi.com

# ==================== EMAIL ====================
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password

# ==================== IMAGE HOSTING ====================
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ==================== ANALYTICS ====================
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# ==================== ADMIN ====================
ADMIN_EMAIL=admin@travelmate.com
ADMIN_PASSWORD=secure_password_123
```

---

## Quick Reference: Where to Get Each Key

| Service | Website | Time | Cost |
|---------|---------|------|------|
| **Stripe** | stripe.com | 2 min | FREE |
| **Razorpay** | razorpay.com | 2 min | FREE |
| **Twilio** | twilio.com | 3 min | $20 credit |
| **MongoDB** | mongodb.com/atlas | 3 min | FREE |
| **Amadeus** | developers.amadeus.com | 2 min | FREE |
| **RapidAPI** | rapidapi.com | 2 min | FREE |
| **Cloudinary** | cloudinary.com | 2 min | FREE |
| **Google Analytics** | analytics.google.com | 2 min | FREE |

**Total Time: 20 minutes**

---

## Testing API Keys

### Stripe Test
```bash
curl -X POST https://api.stripe.com/v1/payment_intents \
  -H "Authorization: Bearer sk_test_YOUR_KEY" \
  -d "amount=1000&currency=usd"
```

### Razorpay Test
```bash
curl -X POST https://api.razorpay.com/v1/orders \
  -u "KEY_ID:KEY_SECRET" \
  -d "amount=50000&currency=INR&receipt=receipt_id"
```

### Twilio Test
```bash
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json \
  -u "YOUR_SID:YOUR_TOKEN" \
  -d "From=whatsapp:+14155238886&To=whatsapp:+919876543210&Body=Test"
```

### MongoDB Test
```javascript
const mongoose = require('mongoose');
await mongoose.connect(process.env.MONGODB_URI);
console.log('MongoDB Connected!');
```

---

## Troubleshooting API Keys

### Issue: "Invalid API Key"
- ✅ Copy from console exactly (no extra spaces)
- ✅ Verify environment: test vs live
- ✅ Check if key is restricted to specific IPs
- ✅ Regenerate key if too old

### Issue: "Rate Limited"
- ✅ Check API quota in dashboard
- ✅ Upgrade to paid plan for more requests
- ✅ Implement caching on your end

### Issue: "Webhook Not Receiving"
- ✅ Verify webhook URL is HTTPS
- ✅ Verify IP whitelist settings
- ✅ Check firewall/security settings
- ✅ Test manually from dashboard

---

## Best Practices

1. ✅ Never commit .env file to git
2. ✅ Use test keys in development
3. ✅ Rotate keys every 3 months
4. ✅ Never share keys in code comments
5. ✅ Use environment variables for all secrets
6. ✅ Set up IP whitelisting when possible
7. ✅ Monitor API usage in dashboards
8. ✅ Set up billing alerts

---

## Next Steps

1. ✅ Get all 8 free API keys above
2. ✅ Create .env file from template
3. ✅ Run project with: `npm install && npm start`
4. ✅ Test each integration
5. ✅ Deploy to production

**You're now ready to launch your travel platform! 🚀**
