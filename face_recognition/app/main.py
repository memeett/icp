from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
import numpy as np
import cv2
import uvicorn
from typing import Dict
import json
import numpy as np


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def numpy_to_list(embedding):
    if isinstance(embedding, dict):
        embedding = np.array(list(embedding.values()))
    elif isinstance(embedding, list):
        embedding = np.array(embedding)
    return embedding.tolist()

def list_to_numpy(embedding_list):
    return np.array(embedding_list)


def load_embeddings():
    try:
        with open('face_embeddings.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

face_embeddings = load_embeddings()

@app.post("/register-face")
async def register_face(
    principal_id: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        # ngcek principal_id

        print(f"Registering face for principal_id: {principal_id}")
        
        # cek tipe file 
        


        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=422, detail="File must be an image")
        
        contents = await file.read()
        nparr = np.fromstring(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=422, detail="Invalid image data")

        embedding = DeepFace.represent(img, model_name="Facenet")[0]
    
        face_embeddings[principal_id] = embedding
        
        
        with open('face_embeddings.json', 'w') as f:
            json.dump(face_embeddings, f)
        
        # debug keys
        # print(f"Current face_embeddings keys: {face_embeddings.keys()}")

        return {"status": "success", "message": "Face registered successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=422, detail=str(e))

@app.post("/verify-face")
async def verify_face(
    file: UploadFile = File(...)
):
    try:
        # Jika tidak ada embeddings yang tersimpan
        if not face_embeddings:
            raise HTTPException(status_code=404, detail="No faces registered in the system")
        
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=422, detail="Invalid image data")
        
        # Verifikasi liveness
        is_live = check_liveness(img)
        if not is_live:
            return {"status": "error", "message": "Liveness check failed - eyes not detected"}
        
        # Mendapatkan embedding dari wajah saat ini
        current_embedding = DeepFace.represent(img, model_name="Facenet")[0]
        if isinstance(current_embedding, dict):
            current_embedding = np.array(current_embedding['embedding'])
        
        # Mencari kecocokan terbaik dari semua embeddings yang tersimpan
        best_match = None
        highest_similarity = 0
        threshold = 0.7
        
        for principal_id, stored_data in face_embeddings.items():
            stored_embedding = stored_data['embedding']
            similarity = cosine_similarity(np.array(stored_embedding), np.array(current_embedding))
            
            print(f"Similarity with {principal_id}: {similarity}")
            
            if similarity > highest_similarity:
                highest_similarity = similarity
                best_match = principal_id
        
        # Jika ada kecocokan di atas threshold
        if highest_similarity >= threshold:
            return {
                "status": "success", 
                "message": "Face verified successfully", 
                "principal_id": best_match,
                "similarity": float(highest_similarity)
            }
        else:
            return {
                "status": "failed", 
                "message": "No matching face found", 
                "similarity": float(highest_similarity) if highest_similarity > 0 else 0
            }
            
    except Exception as e:
        print("Error in verify_face:", str(e))
        raise HTTPException(
            status_code=500,
            detail=f"Error verifying face: {str(e)}"
        )

        
def check_liveness(image):
    try:
        eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
        if eye_cascade.empty():
            raise Exception("Failed to load eye cascade classifier")
            
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        eyes = eye_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )
        return len(eyes) >= 1
    except Exception as e:
        raise Exception(f"Liveness check failed: {str(e)}")
    

def cosine_similarity(embedding1, embedding2):
    return np.dot(embedding1, embedding2) / (np.linalg.norm(embedding1) * np.linalg.norm(embedding2))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
