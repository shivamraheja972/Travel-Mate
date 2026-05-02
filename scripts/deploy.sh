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
curl -f http://localhost/health && echo " ✅ Frontend is healthy!" || echo " ❌ Health check failed"

echo ""
echo "✅ Deployment complete!"
echo "  Frontend: http://localhost:3000"
docker-compose ps
