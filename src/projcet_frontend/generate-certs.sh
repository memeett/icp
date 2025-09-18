#!/bin/bash

# Generate self-signed SSL certificates for local development
# This script creates certificates in the certs/ directory

CERT_DIR="./certs"
KEY_FILE="$CERT_DIR/localhost-key.pem"
CERT_FILE="$CERT_DIR/localhost-cert.pem"

# Create certs directory if it doesn't exist
mkdir -p "$CERT_DIR"

echo "Generating self-signed SSL certificates for localhost..."

# Generate private key
openssl genrsa -out "$KEY_FILE" 2048

# Generate certificate
openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days 365 -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "Certificates generated successfully!"
echo "Key: $KEY_FILE"
echo "Cert: $CERT_FILE"
echo ""
echo "Note: These are self-signed certificates. For production, use proper SSL certificates from a trusted CA."
