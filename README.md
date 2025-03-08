# ERGASIA

## About
ERGASIA is a decentralized platform connecting clients and freelancers, developed for Hackatan 11 by Codefeast. The platform enables clients to post and manage jobs, while freelancers can search and apply for jobs that match their skills.

## Features

### Client Features
- Post new jobs
- Job management
- Review work submissions
- Messaging system with freelancers
- Accept/reject submissions
- Payment using Ergasia token via Plug wallet

### Freelancer Features
- Apply for jobs
- Submit work
- Job search
- AI-based job recommendation system

## Technology Stack
- **Backend**: Motoko (Internet Computer)
- **Frontend**: React (TypeScript)
- **AI Components**: 
  - Python DeepFace for face recognition
  - Scikit-learn for job recommendation system
- **Wallet Integration**: Plug Wallet Extension
- **Authentication**: Internet Identity

## Installation & Setup

### Prerequisites
- Node.js
- DFX (Internet Computer SDK)
- Python 3.x
- Plug Wallet Extension

### Backend Setup
```bash
# Install DFX
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Start local replica
dfx start --background

# Deploy canisters
dfx deploy
