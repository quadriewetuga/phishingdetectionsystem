from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from utils.feature_engineering import extract_features
from utils.history import save_detection_history
import joblib
import numpy as np

app = FastAPI()

# Allow extension to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now, restrict later in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model only once
model = joblib.load("models/random_forest_model.pkl")

def predict_url(url: str):
    print(f"🕵️‍♂️ Scanning URL: {url}")  # New line
    features = extract_features(url)
    print(f"✅ Extracted features: {features}")  # New line
    X = np.array([list(features.values())])
    print(f"📊 Features array: {X}")  # New line
    prediction = model.predict(X)[0]
    confidence = round(model.predict_proba(X)[0][prediction] * 100, 2)
    print(f"🎯 Prediction: {prediction}, Confidence: {confidence}%")  # New line
    return {"label": int(prediction), "confidence": confidence}

@app.post("/scan_and_save")
async def scan_and_save(request: Request):
    data = await request.json()
    url = data.get("url")
    username = data.get("username")

    if not url or not username:
        return {"error": "Missing url or username"}

    result = predict_url(url)

    # Save the scan to history
    save_detection_history(
        username=username,
        url=url,
        prediction_label="Phishing" if result["label"] == 1 else "Legitimate",
        confidence=result["confidence"]
    )

    return result
