from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

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
