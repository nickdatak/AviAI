"""
FastAPI server for flight delay prediction.
"""

from datetime import datetime
from pathlib import Path

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Load model and encoders on startup
MODEL_PATH = Path(__file__).parent / "model.pkl"
ENCODERS_PATH = Path(__file__).parent / "encoders.pkl"

model = joblib.load(MODEL_PATH)
encoders = joblib.load(ENCODERS_PATH)

FEATURE_ORDER = [
    "OP_UNIQUE_CARRIER",
    "ORIGIN",
    "DEST",
    "MONTH",
    "DAY_OF_WEEK",
    "DAY_OF_MONTH",
    "DepHour",
    "DISTANCE",
]

app = FastAPI(title="Flight Delay Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    airline: str = Field(..., description="Airline code (e.g. AA)")
    origin: str = Field(..., description="Origin airport (code or ID)")
    destination: str = Field(..., description="Destination airport (code or ID)")
    departure_date: str = Field(..., description="Date as YYYY-MM-DD")
    departure_hour: int = Field(..., ge=0, le=23, description="Hour of day 0-23")
    distance: float = Field(default=500.0, ge=1.0, description="Flight distance in miles (optional)")


class PredictResponse(BaseModel):
    delay_probability: float
    is_delayed: bool
    risk_level: str


def _encode_value(encoder, value: str, field_name: str) -> int:
    """Encode a value; raise HTTPException if unseen."""
    val_str = str(value).strip()
    classes = set(encoder.classes_)
    if val_str not in classes:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown {field_name}: '{value}'. Valid values: {sorted(classes)[:50]}{'...' if len(classes) > 50 else ''}",
        )
    return int(encoder.transform([val_str])[0])


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/metadata")
def metadata():
    """Return valid airlines, origins, and destinations for frontend dropdowns."""
    return {
        "airlines": sorted(encoders["OP_UNIQUE_CARRIER"].classes_.tolist()),
        "origins": sorted(encoders["ORIGIN"].classes_.tolist()),
        "destinations": sorted(encoders["DEST"].classes_.tolist()),
    }


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    # Parse departure_date
    try:
        dt = datetime.strptime(req.departure_date, "%Y-%m-%d")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid departure_date '{req.departure_date}'. Use YYYY-MM-DD format.")

    month = dt.month
    day_of_month = dt.day
    day_of_week = dt.isoweekday()  # Monday=1, Sunday=7

    # Encode categoricals
    try:
        airline_enc = _encode_value(encoders["OP_UNIQUE_CARRIER"], req.airline, "airline")
        origin_enc = _encode_value(encoders["ORIGIN"], req.origin, "origin")
        dest_enc = _encode_value(encoders["DEST"], req.destination, "destination")
    except HTTPException:
        raise

    # Build feature row [OP_UNIQUE_CARRIER, ORIGIN, DEST, MONTH, DAY_OF_WEEK, DAY_OF_MONTH, DepHour, DISTANCE]
    X = np.array(
        [
            [
                airline_enc,
                origin_enc,
                dest_enc,
                month,
                day_of_week,
                day_of_month,
                float(req.departure_hour),
                float(req.distance),
            ]
        ]
    )

    proba = float(model.predict_proba(X)[0, 1])
    is_delayed = proba > 0.45

    if proba < 0.35:
        risk_level = "Low"
    elif proba <= 0.55:
        risk_level = "Medium"
    else:
        risk_level = "High"

    return PredictResponse(
        delay_probability=round(proba, 4),
        is_delayed=is_delayed,
        risk_level=risk_level,
    )
