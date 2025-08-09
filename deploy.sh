#!/bin/bash

# Script untuk deploy setelah perbaikan error Motoko
echo "🔧 Deploying canisters after fixing isProfileCompleted field..."
echo ""

# Navigate to project directory
cd /home/memet/hakaton/icp

# Start dfx if not running
echo "Starting dfx..."
dfx start --clean --background

# Deploy all canisters
echo "Deploying canisters..."
dfx deploy --network local

echo ""
echo "✅ Deployment completed!"
echo ""
echo "🎯 Test the system:"
echo "1. Visit: http://localhost:4943?canisterId=x3gbg-37777-77774-qaakq-cai"
echo "2. Or visit: http://localhost:3000 (if frontend is running separately)"
echo "3. Click login and test Internet Identity authentication"
echo "4. Complete profile setup after login"
echo ""
