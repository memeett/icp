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
2. Click **"Connect Wallet"** on the profile page.  
3. Select **Plug Wallet** from the options.  
4. Approve the connection request.  

Your Plug Wallet is now linked to ERGASIA, and you can start making transactions. 🚀

## Python Installation & Setup

### AI Recommendation System Setup

#### **1. Create requirements.txt**
Create a file named `requirements.txt` with the following content:
```txt
absl-py==2.1.0
astunparse==1.6.3
Flask==3.1.0
flask-cors==5.0.1
scikit-learn==1.6.1
pandas==2.2.3
numpy==2.0.2
tensorflow==2.18.0
keras==3.8.0
joblib==1.4.2
requests==2.32.3
deepface==0.0.89
```

#### **2. Set Up Virtual Environment**
```bash
# Create and activate virtual environment
python -m venv recommendation_venv
source recommendation_venv/bin/activate  # Linux/Mac
recommendation_venv\Scripts\activate     # Windows

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

#### **3. Run the Recommendation System**
```bash
# Change the directory to project_backend/AI
cd ./src/project_backend/AI

# Run the Python file
python main.py
```

### Face Recognition System Setup

#### **1. Install Dependencies from environment.yml**
#### Download environment.yml (if not already available)
- [environment.yml](https://github.com/memeett/icp/blob/master/environment.yml)

Ensure you have Conda installed, then run:
```bash

# Create a Conda environment from environment.yml
conda env create -f environment.yml -n fr_venv python=3.9.10

# Activate the environment
conda activate fr_venv

#### **2. Run the Face Recognition System**
```bash
# Change the directory to project_backend/face_recognition
cd ./../face_recognition/app

# Run the Python file
python main.py
```
