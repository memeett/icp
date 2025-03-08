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
- Install [Miniconda](https://docs.conda.io/en/latest/miniconda.html) or Anaconda. 

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

#### 1. Create requirements.txt
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

#### 2.Set Up Virtual Enviroment
# Create and activate virtual environment
python -m venv ergasia-ai
source ergasia-ai/bin/activate  # Linux/Mac
ergasia-ai\Scripts\activate     # Windows

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

#### 3. Run the Recommendation System
# Change the directory to projcet_backend/AI
cd ./project_backend/AI
# Run the python file
python main.py


### Face Recognition System Setup
Install [enviroment.yml](name: face-auth
channels:
  - defaults
  - https://repo.anaconda.com/pkgs/main
  - https://repo.anaconda.com/pkgs/r
  - https://repo.anaconda.com/pkgs/msys2
dependencies:
  - ca-certificates=2024.12.31=haa95532_0
  - openssl=3.0.15=h827c3e9_0
  - pip=25.0=py39haa95532_0
  - python=3.9.21=h8205438_1
  - setuptools=75.8.0=py39haa95532_0
  - sqlite=3.45.3=h2bbff1b_0
  - vc=14.42=haa95532_4
  - vs2015_runtime=14.42.34433=he0abc0d_4
  - wheel=0.45.1=py39haa95532_0
  - pip:
      - absl-py==2.1.0
      - aiohappyeyeballs==2.4.6
      - aiohttp==3.11.12
      - aiosignal==1.3.2
      - annotated-types==0.7.0
      - anyio==4.8.0
      - astunparse==1.6.3
      - async-timeout==5.0.1
      - attrs==25.1.0
      - beautifulsoup4==4.13.3
      - blinker==1.9.0
      - certifi==2025.1.31
      - charset-normalizer==3.4.1
      - click==8.1.8
      - colorama==0.4.6
      - deepface==0.0.93
      - deprecation==2.1.0
      - dlib==19.24.6
      - exceptiongroup==1.2.2
      - fastapi==0.115.8
      - filelock==3.17.0
      - fire==0.7.0
      - flask==3.1.0
      - flask-cors==5.0.0
      - flatbuffers==25.2.10
      - frozenlist==1.5.0
      - gast==0.6.0
      - gdown==5.2.0
      - google-pasta==0.2.0
      - gotrue==2.11.4
      - grpcio==1.70.0
      - gunicorn==23.0.0
      - h11==0.14.0
      - h2==4.2.0
      - h5py==3.13.0
      - hpack==4.1.0
      - httpcore==1.0.7
      - httpx==0.28.1
      - hyperframe==6.1.0
      - idna==3.10
      - importlib-metadata==8.6.1
      - itsdangerous==2.2.0
      - jinja2==3.1.5
      - keras==3.8.0
      - keras-facenet==0.3.2
      - libclang==18.1.1
      - markdown==3.7
      - markdown-it-py==3.0.0
      - markupsafe==3.0.2
      - mdurl==0.1.2
      - ml-dtypes==0.4.1
      - mtcnn==0.1.1
      - multidict==6.1.0
      - namex==0.0.8
      - numpy==2.0.2
      - opencv-python==4.11.0.86
      - opt-einsum==3.4.0
      - optree==0.14.0
      - packaging==24.2
      - pandas==2.2.3
      - pillow==11.1.0
      - postgrest==0.19.3
      - propcache==0.3.0
      - protobuf==5.29.3
      - psycopg2==2.9.10
      - pydantic==2.10.6
      - pydantic-core==2.27.2
      - pygments==2.19.1
      - pysocks==1.7.1
      - python-dateutil==2.9.0.post0
      - python-multipart==0.0.20
      - pytz==2025.1
      - realtime==2.4.0
      - requests==2.32.3
      - retina-face==0.0.17
      - rich==13.9.4
      - scipy==1.13.1
      - six==1.17.0
      - sniffio==1.3.1
      - soupsieve==2.6
      - starlette==0.45.3
      - storage3==0.11.3
      - strenum==0.4.15
      - supabase==2.13.0
      - supafunc==0.9.3
      - tensorboard==2.18.0
      - tensorboard-data-server==0.7.2
      - tensorflow==2.18.0
      - tensorflow-intel==2.18.0
      - tensorflow-io-gcs-filesystem==0.31.0
      - termcolor==2.5.0
      - tf-keras==2.18.0
      - tqdm==4.67.1
      - typing-extensions==4.12.2
      - tzdata==2025.1
      - urllib3==2.3.0
      - uvicorn==0.34.0
      - websockets==14.2
      - werkzeug==3.1.3
      - wrapt==1.17.2
      - yarl==1.18.3
      - zipp==3.21.0
prefix: C:\Users\user\anaconda3\envs\face-auth
)

