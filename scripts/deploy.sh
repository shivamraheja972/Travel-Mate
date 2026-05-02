#!/bin/bash
set -e

echo "🚀 TravelMate Production Deployment"
echo "===================================="

# Pull latest
git pull origin main

# Build & restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Health check
sleep 10
echo "🔍 Checking health..."
curl -f http://localhost:5000/api/health && echo " ✅ API is healthy!" || echo " ❌ API health check failed"

echo ""
echo "✅ Deployment complete!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
docker-compose ps
