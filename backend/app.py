import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:8080").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    classifier = pipeline(
        "text-classification",
        model="./model",
        tokenizer="./model",
        top_k=5,
        device="cpu",
    )
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load model: {e}")
    classifier = None  # We handle this inside the route

class PredictRequest(BaseModel):
    text: str = Field(..., max_length=2500)

@app.post("/predict")
def predict(data: PredictRequest):
    if classifier is None:
        raise HTTPException(
            status_code=503, 
            detail="Model AI sedang tidak tersedia (Gagal memuat). Coba lagi nanti."
        )
    
    try:
        predictions = classifier(data.text, truncation=True, max_length=512)[0]
        return {
            "predictions": [
                {
                    "label": pred["label"],
                    "score": round(pred["score"], 4),
                }
                for pred in predictions
            ]
        }
    except Exception as e:
        logging.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500, 
            detail="Terjadi kesalahan pada server saat memproses teks Anda."
        )