#!/bin/bash

# Setup HTTPS untuk advisor_agent menggunakan nginx reverse proxy
# Script ini akan setup nginx untuk proxy HTTPS ke HTTP local server

echo "🚀 Setting up HTTPS for advisor_agent..."

# Install nginx jika belum ada
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing nginx..."
    sudo apt update
    sudo apt install -y nginx
fi

# Install certbot untuk SSL certificates
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing certbot..."
    sudo apt install -y certbot python3-certbot-nginx
fi

# Backup konfigurasi nginx yang ada
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Create nginx configuration untuk advisor_agent
cat << EOF | sudo tee /etc/nginx/sites-available/advisor_agent
server {
    listen 80;
    server_name 34.122.202.222;

    location / {
        proxy_pass http://127.0.0.1:8002;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name 34.122.202.222;

    ssl_certificate /etc/letsencrypt/live/34.122.202.222/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/34.122.202.222/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8002;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/advisor_agent /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"

    # Reload nginx
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded"

    # Get SSL certificate menggunakan certbot
    echo "🔐 Getting SSL certificate..."
    sudo certbot --nginx -d 34.122.202.222 --non-interactive --agree-tos --email your-email@example.com

    echo "🎉 HTTPS setup completed!"
    echo "📡 Your API is now available at:"
    echo "   HTTP:  http://34.122.202.222/api/chat"
    echo "   HTTPS: https://34.122.202.222/api/chat"
    echo ""
    echo "🔄 Don't forget to update your frontend to use HTTPS endpoint:"
    echo '   const ADVISOR_API_URL = "https://34.122.202.222/api/chat";'

else
    echo "❌ Nginx configuration error"
    exit 1
fi
