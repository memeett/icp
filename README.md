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
- Plug Wallet Extension ([Chrome](https://chromewebstore.google.com/detail/plug/dfjmiogamkkfklemondpoohhiknbiami) / [Firefox](https://addons.mozilla.org/en-US/firefox/addon/plug-wallet/))  

### Backend Setup
```bash
# Install DFX
sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Start local replica
dfx start --background

# Deploy canisters
dfx deploy
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start the development server
npm start
```

### Plug Wallet Installation & Setup

Plug Wallet is required for managing payments on the ERGASIA platform. Follow the steps below to install and set up your Plug Wallet.

#### **1. Install Plug Wallet Extension**  
Download and install the Plug Wallet extension for your browser:
- **[Chrome](https://chromewebstore.google.com/detail/plug/dfjmiogamkkfklemondpoohhiknbiami)**  
- **[Firefox](https://addons.mozilla.org/en-US/firefox/addon/plug-wallet/)**  

#### **2. Create a New Wallet**  
1. Open the Plug Wallet extension.  
2. Click **"Create Wallet"**.  
3. Save your **12-word recovery phrase** in a secure location.  
4. Set up a strong password and confirm it.  
5. Click **"Create"** to finalize your wallet setup.  

#### **3. Fund Your Wallet (Optional)**  
To make transactions on ERGASIA, you may need to fund your Plug Wallet with **ICP tokens** or **Ergasia tokens**.  
- You can obtain ICP from exchanges like Binance, Coinbase, or through the **Plug Wallet Swap** feature.  
- Add custom tokens by going to **Assets → Add Token**, then enter the token ID if needed.  

#### **4. Connect Plug Wallet to ERGASIA**  
1. Open the ERGASIA platform.  
2. Click **"Connect Wallet"** on the login page.  
3. Select **Plug Wallet** from the options.  
4. Approve the connection request.  

Your Plug Wallet is now linked to ERGASIA, and you can start making transactions. 🚀

