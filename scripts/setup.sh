#!/bin/bash
set -e

echo "🚀 TravelMate Setup Script"
echo "=========================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
  exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"

# Create frontend env if it doesn't exist
if [ ! -f client/.env ]; then
  cp client/.env.example client/.env
  echo -e "${YELLOW}⚠️  Created client/.env from template. Please add Supabase keys.${NC}"
fi

# Install frontend
echo "📦 Installing frontend dependencies..."
cd client && npm install && cd ..

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit client/.env with Supabase keys"
echo "2. Run: cd client && npm start"
echo ""
echo "Or with Docker:"
echo "  docker-compose up -d"
echo ""
echo "Access your app:"
echo "  Frontend: http://localhost:3000"
echo "  Health:   http://localhost/health"
