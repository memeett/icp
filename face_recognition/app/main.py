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
    principal_id: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        # debug embed
        # print("All stored embeddings:", face_embeddings.keys())
        # print("Requested principal_id:", principal_id)
        
        stored_data = face_embeddings.get(principal_id)
        if stored_data is None:
            raise HTTPException(status_code=404, detail="Face not registered for this principal_id")
        
        stored_embedding = stored_data['embedding']
        # print("Stored embedding found:", stored_embedding is not None)
        
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise HTTPException(status_code=422, detail="Invalid image data")
        
        is_live = check_liveness(img)
        if not is_live:
            return {"status": "error", "message": "Liveness check failed - eyes not detected"}


        # print("Image shape:", img.shape)
        
        current_embedding = DeepFace.represent(img, model_name="Facenet")[0]
        # print("Current embedding:", current_embedding)  # Log the current embedding
        # print("Current embedding type:", type(current_embedding))  # Log the type
        # print("Current embedding shape:", np.shape(current_embedding))  # Log the shape
        
        if isinstance(current_embedding, dict):
            current_embedding = np.array(current_embedding['embedding']) 

        similarity = cosine_similarity(np.array(stored_embedding), np.array(current_embedding))
        print("Calculated similarity:", similarity)
        
        threshold = 0.7 
        if similarity >= threshold:
            return {"status": "success", "message": "Face verified successfully", "similarity": float(similarity)}
        else:
            return {"status": "failed", "message": "Face verification failed", "similarity": float(similarity)}
            
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
