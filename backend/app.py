import os
from fastapi import FastAPI
from pydantic import BaseModel
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
    text: str


@app.post("/predict")
def predict(data: PredictRequest):
    predictions = classifier(data.text)[0]

    return {
        "predictions": [
            {
                "label": pred["label"],
                "score": round(pred["score"], 4),
            }
            for pred in predictions
        ]
    }
