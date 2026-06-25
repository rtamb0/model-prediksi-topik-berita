import os
from fastapi import FastAPI
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

classifier = pipeline(
    "text-classification",
    model="./model",
    tokenizer="./model",
    top_k=5,
    device="cpu",
)

class PredictRequest(BaseModel):
    # Enforce a 2500 character limit at the API level (returns a 422 error if exceeded)
    text: str = Field(..., max_length=2500)

@app.post("/predict")
def predict(data: PredictRequest):
    # truncation=True ensures the model safely cuts off text beyond 512 tokens without crashing!
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