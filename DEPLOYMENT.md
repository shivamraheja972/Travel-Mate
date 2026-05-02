# 🌐 Production Deployment Guide

Deploy your TravelMate platform to production in minutes!

---

## Option 1: Deploy to Heroku (Easiest)

### Prerequisites
```bash
npm install -g heroku
heroku login
```

### Create Backend App
```bash
# Navigate to server directory
cd server

# Create Heroku app
heroku create travelmate-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your-super-secret-key
heroku config:set STRIPE_SECRET_KEY=sk_live_xxxx
heroku config:set STRIPE_PUBLIC_KEY=pk_live_xxxx
heroku config:set RAZORPAY_KEY_ID=xxxx
heroku config:set RAZORPAY_KEY_SECRET=xxxx
heroku config:set TWILIO_ACCOUNT_SID=xxxx
heroku config:set TWILIO_AUTH_TOKEN=xxxx
heroku config:set TWILIO_WHATSAPP_NUMBER=whatsapp:+xxxx

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

### Create Frontend App
```bash
cd ../client

# Create app
heroku create travelmate-web

# Set environment variable
heroku config:set REACT_APP_API_URL=https://travelmate-api.herokuapp.com/api

# Add Procfile
echo "web: serve -s build -l $PORT" > Procfile

# Deploy
git push heroku main
```

### Access Your App
```
Frontend: https://travelmate-web.herokuapp.com
Backend: https://travelmate-api.herokuapp.com
```

**Pros:** Easy, free tier available, auto-scaling
**Cons:** Heroku is now paid ($7/month minimum)

---

## Option 2: Deploy to DigitalOcean (Recommended - $5/month)

### Step 1: Create Droplet
1. Go to https://digitalocean.com
2. Create → Droplets
3. Choose:
   - OS: Ubuntu 22.04
   - Size: $5/month (1GB RAM)
   - Region: Closest to users

### Step 2: SSH & Setup
```bash
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB
apt install -y mongodb

# Start MongoDB
systemctl start mongodb
systemctl enable mongodb

# Install Nginx (reverse proxy)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2
```

### Step 3: Deploy Code
```bash
# Clone repository
git clone https://github.com/yourusername/travelmate.git
cd travelmate

# Copy environment file
cp server/.env.example server/.env

# Edit with your keys
nano server/.env

# Install dependencies
cd server
npm install --production
npm run build

cd ../client
npm install
npm run build
```

### Step 4: Configure PM2
```bash
# Create ecosystem.config.js in root directory
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'travelmate-api',
    script: 'server/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 5: Configure Nginx
```bash
# Create Nginx config
cat > /etc/nginx/sites-available/travelmate << EOF
upstream api {
    server localhost:5000;
}

server {
    listen 80;
    server_name travelmate.com www.travelmate.com;

    # Frontend
    location / {
        root /root/travelmate/client/build;
        try_files \$uri /index.html;
        expires 1d;
    }

    # API
    location /api {
        proxy_pass http://api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/travelmate /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test and restart
nginx -t
systemctl restart nginx
```

### Step 6: Add SSL Certificate (Free with Let's Encrypt)
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d travelmate.com -d www.travelmate.com

# Auto-renew
systemctl enable certbot.timer
systemctl start certbot.timer
```

### Step 7: Setup Monitoring
```bash
# Install monitoring
npm install -g forever
forever start server/server.js

# Or use PM2 monitoring
pm2 monit
```

**Your app is now live at https://travelmate.com** 🎉

---

## Option 3: Deploy to Vercel (Frontend) + Render (Backend)

### Vercel Frontend
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd client
vercel

# Follow prompts
# Add environment variable:
# REACT_APP_API_URL=https://your-backend.onrender.com/api
```

### Render Backend
1. Go to https://render.com
2. Sign up → Dashboard
3. New Web Service
4. Connect GitHub repo
5. Select server directory
6. Set environment variables
7. Deploy

**Pros:** Easy, no credit card needed
**Cons:** May have cold starts

---

## Option 4: Deploy with Docker & AWS ECS

### Build Docker Images
```bash
# Build backend
docker build -t travelmate-api ./server

# Build frontend
docker build -t travelmate-web ./client

# Tag for AWS
docker tag travelmate-api:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/travelmate-api:latest
docker tag travelmate-web:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/travelmate-web:latest

# Push to ECR
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/travelmate-api:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/travelmate-web:latest
```

### Setup ECS Cluster
1. AWS Console → ECS
2. Create Cluster → EC2
3. Create Task Definition
4. Create Service with Load Balancer
5. Set environment variables

---

## Option 5: Deploy with Railway.app

### Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

**Pros:** Very easy, GitHub sync, $5 credit
**Cons:** Limited free tier

---

## Database Migration

### MongoDB Atlas to Production
```javascript
// Install dump tools
npm install -g mongodb-mongoexport

// Export from local
mongoexport --db travelmate --collection bookings --out bookings.json

// Import to Atlas
mongoimport --uri "mongodb+srv://user:pass@cluster.mongodb.net/travelmate" \
            --collection bookings \
            --file bookings.json
```

---

## CI/CD Pipeline Setup

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "travelmate-api"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          
      - name: Deploy Frontend
        run: |
          npm install
          npm run build
          npx vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## Domain Setup

### Using GoDaddy/Namecheap
```bash
# 1. Buy domain: travelmate.com

# 2. Update nameservers to your host
# For DigitalOcean:
#   ns1.digitalocean.com
#   ns2.digitalocean.com
#   ns3.digitalocean.com

# 3. In DigitalOcean, add domain
# Domain → Add Domain → travelmate.com

# 4. Add A records
# A Record: @ → your-droplet-ip
# A Record: www → your-droplet-ip
```

### Using Cloudflare (Recommended)
```bash
# 1. Go to cloudflare.com
# 2. Add domain
# 3. Update nameservers at registrar
# 4. Setup A records
# 5. Enable SSL: Flexible or Full
# 6. Enable Caching
```

---

## Performance Optimization

### Enable CDN
```bash
# Use Cloudflare for:
# - Static asset caching
# - DDoS protection
# - Free SSL
# - Image optimization
```

### Database Optimization
```javascript
// Add indexes
db.bookings.createIndex({ userId: 1, createdAt: -1 });
db.users.createIndex({ email: 1 });
db.flights.createIndex({ departure: 1, arrival: 1 });
```

### Image Optimization
```bash
# Already using Cloudinary
# Images automatically optimized
# Responsive sizing
# WebP format conversion
```

---

## Monitoring & Logging

### Setup Error Tracking
```bash
# Use Sentry for error tracking
npm install @sentry/node

# Configure in server.js
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Setup Uptime Monitoring
1. Go to https://uptimerobot.com
2. Create monitor for: https://travelmate.com/api/health
3. Alert if down

### Check Logs
```bash
# DigitalOcean
pm2 logs

# Heroku
heroku logs --tail

# Vercel
vercel logs
```

---

## Backup Strategy

### Database Backup
```bash
# Automated backups with MongoDB Atlas
# Enable automatic backups
# Set retention: 35 days
# Test restore monthly
```

### Code Backup
```bash
# GitHub as backup
git push
git push --all
```

---

## Cost Breakdown (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| **Domain** | $10-15 | .com domain |
| **Server** | $5 | DigitalOcean $5 droplet |
| **Database** | FREE | MongoDB Atlas free tier |
| **CDN** | FREE | Cloudflare free |
| **SSL** | FREE | Let's Encrypt |
| **Email** | FREE | Up to 200/day with Gmail |
| **APIs** | ~$5-10 | Beyond free tiers |
| **Monitoring** | FREE | Uptimerobot free |
| **TOTAL** | **~$30-40/month** | **Including all paid tiers** |

---

## Checklist Before Launch

- [ ] Domain registered
- [ ] SSL certificate installed
- [ ] All environment variables set
- [ ] Database backups configured
- [ ] Error tracking setup
- [ ] Monitoring configured
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Payment gateway in production mode
- [ ] WhatsApp webhook verified
- [ ] SEO sitemaps submitted
- [ ] Analytics configured
- [ ] Backup strategy tested
- [ ] Load testing completed
- [ ] Security headers configured

---

## Go Live! 🚀

Once everything is deployed:
1. Test from production URL
2. Process a test booking
3. Test payment flow
4. Verify WhatsApp integration
5. Monitor for 24 hours
6. Start marketing

**You're live! Start accepting bookings!**

---

For questions: support@travelmate.com
