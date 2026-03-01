# AviAI – Flight Delay Predictor

**AviAI** is a traveler-focused web app that answers questions: *“How likely is my flight to be delayed, and what should I know before I go?”* It combines a **machine-learning delay model** with **live flight data**, **weather**, and **AI-powered checks** so you get a single, clear dashboard for your upcoming trip.

---

## The idea behind AviAI

Flight delays are frustrating and often avoidable—if you know what to expect. Airlines and airports publish huge amounts of historical and real-time data, but most travelers never see it in one place. AviAI is built around a simple idea:

- **One flight number** → You enter it once (e.g. `AA123`, `UA456`).
- **One dashboard** → You see delay risk, route details, weather at origin and destination, and optional AI checks for disruptions and airport tips.
- **One place to decide** → You can plan buffer time, check the weather, or get practical suggestions without opening five different apps or tabs.

The app does not replace your airline’s official status or rebooking tools. It is meant to **inform you before you leave**: by giving a delay probability (from a model trained on historical data), showing real-time weather and local times, and letting you optionally ask an AI about current disruptions or airport tips. The goal is to reduce surprise and help you “relax and enjoy your flight” with a bit more confidence.

---

## What AviAI does

| Feature | Description |
|--------|-------------|
| **Flight lookup** | Enter airline + number (e.g. `UA 123`). The app fetches the flight for the chosen date via [FlightAPI.io](https://docs.flightapi.io), then shows route, departure/arrival times, and aircraft (e.g. Airbus A380). |
| **Delay probability** | A backend ML model (LightGBM) predicts the probability that your flight will be delayed. The dashboard shows a percentage, a short message (“likely delayed” / “looks on time”), and a risk level (Low / Medium / High). Predictions use airline, origin, destination, date, and departure hour. |
| **Origin & destination weather** | Current weather at both airports (from [Open-Meteo](https://open-meteo.com)) so you can dress and plan for conditions at each end. |
| **Local times** | Clocks for origin and destination so you keep time zones straight. |
| **AI News Check** | Optional button that uses [Mistral AI](https://mistral.ai) (with web search) to ask: *“Are there current disruptions, strikes, weather, or airspace issues on this route?”* Answer appears in a few sentences. |
| **AI Suggestion** | Optional button that uses Mistral to get 2–4 short, practical tips for the origin and destination airports (arrival times, terminals, security, parking, lounges, etc.). |

The **home screen** is a single field: enter your flight number and tap **Find Flight**. After that, the **dashboard** shows all of the above in a grid: delay card, weather, times, airline info, aircraft, hero section, and the two AI actions.

---

## Tech stack

- **Frontend:** Plain HTML, CSS, and JavaScript. No framework. Uses [Montserrat](https://fonts.google.com/specimen/Montserrat) and a responsive grid. The UI is in `docs/` (e.g. `docs/index.html`, `docs/script.js`, `docs/style.css`).
- **Backend:** [FastAPI](https://fastapi.tiangolo.com) (Python). Serves:
  - `GET /health` – health check
  - `GET /metadata` – list of valid airlines, origins, and destinations (for the delay model)
  - `POST /predict` – delay probability and risk level
- **ML:** Pre-trained [LightGBM](https://lightgbm.readthedocs.io) classifier plus scikit-learn label encoders. Features: airline, origin, destination, month, day of week, day of month, departure hour, distance. Model and encoders are loaded from `model.pkl` and `encoders.pkl`.
- **External APIs:**  
  - [FlightAPI.io](https://docs.flightapi.io) – flight data by airline, number, and date  
  - [Open-Meteo](https://open-meteo.com) – weather by lat/lon  
  - [Mistral AI](https://mistral.ai) – chat/completions and (for News Check) agents with web search  

Deployment is set up for [Railway](https://railway.app) (Nixpacks) with a small `railway.json` and `nixpacks.toml`; the frontend can be static hosting or the same server.

---

## Project structure

```text
AviAI/
├── main.py              # FastAPI app: /health, /metadata, /predict
├── model.pkl            # Trained LightGBM model (not in git if large)
├── encoders.pkl         # Label encoders for airline, origin, destination
├── requirements.txt     # Python dependencies
├── railway.json         # Railway build config
├── nixpacks.toml        # Nixpacks Python setup
├── docs/                # Frontend (static site)
│   ├── index.html       # Single-page app: home + dashboard
│   ├── script.js        # Flight lookup, API calls, UI logic
│   ├── style.css        # Layout, typography, cards
│   ├── assets/          # Images, logos, airline/aircraft assets
│   └── ...              # Video, airport background, etc.
└── README.md            # This file
```

---

## Setup

### Backend (delay prediction API)

1. **Python 3.10+** and a virtual environment recommended:
   ```bash
   python -m venv .venv
   source .venv/bin/activate   # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```
2. Ensure **`model.pkl`** and **`encoders.pkl`** are in the project root (they are produced by your training pipeline; the repo may or may not include them).
3. Run the API:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   Then open `http://localhost:8000/docs` for the OpenAPI docs.

### Frontend

1. Open `docs/index.html` in a browser, or serve the `docs/` folder with any static server (e.g. `npx serve docs` or your host’s static asset root).
2. Point the app at your backend by setting **`API_BASE`** in `docs/script.js`:
   - Local: `const API_BASE = 'http://localhost:8000';`
   - Production: `const API_BASE = 'https://aviai-production.up.railway.app';` (or your deployed URL).

### API keys (in `docs/script.js`)

| Key | Purpose | Where to get it |
|-----|--------|------------------|
| **FlightAPI** | Flight lookup by airline/number/date | [FlightAPI.io](https://docs.flightapi.io) – set `FLIGHTAPI_KEY`. |
| **Mistral** | AI News Check + Suggestion | [Mistral AI](https://mistral.ai) – set `MISTRAL_API_KEY`. |

If `FLIGHTAPI_KEY` is missing or placeholder, the app can still show demo flight data and call the delay API if you have a backend running. Weather and AI features need valid keys where indicated in the code.

---

## Backend API reference

- **`GET /health`**  
  Returns `{"status": "ok"}`.

- **`GET /metadata`**  
  Returns:
  ```json
  {
    "airlines": ["AA", "AS", ...],
    "origins": ["10135", "10136", ...],
    "destinations": ["10135", "10136", ...]
  }
  ```
  Origins and destinations are model-specific IDs (e.g. BTS codes). The frontend maps IATA codes (e.g. JFK, LAX) to these IDs using `metadata` and a built-in lookup.

- **`POST /predict`**  
  Body (JSON):
  ```json
  {
    "airline": "AA",
    "origin": "11278",
    "destination": "12892",
    "departure_date": "2025-03-15",
    "departure_hour": 14,
    "distance": 500
  }
  ```
  Returns:
  ```json
  {
    "delay_probability": 0.3241,
    "is_delayed": false,
    "risk_level": "Low"
  }
  ```
  `origin` and `destination` must be from the `/metadata` lists. The frontend resolves IATA → these IDs before calling `/predict`.

---

## Model and data

- The delay model is a **binary classifier** (on-time vs delayed). It uses **LightGBM** with features: airline, origin, destination, month, day of week, day of month, departure hour, and distance.
- Training data and training script are not in this repo; only the serialized **`model.pkl`** and **`encoders.pkl`** are used at runtime. The encoders define which airlines and airport IDs the model accepts.
- Risk levels are derived from the predicted probability (e.g. &lt; 0.35 Low, 0.35–0.55 Medium, &gt; 0.55 High); the exact thresholds are in `main.py`.

---

## Deployment (Railway)

- The repo is set up for **Railway** with **Nixpacks**. `railway.json` specifies the Nixpacks builder; `nixpacks.toml` pulls in Python and libgcc.
- The backend runs as a web process (e.g. `uvicorn main:app --host 0.0.0.0 --port $PORT`). Expose the root URL as `API_BASE` in the frontend.
- Serve the frontend from any static host (e.g. Railway static site, Vercel, Netlify, or the same server with a static mount). Ensure `API_BASE` points to the deployed backend URL.

---

## License and contributing

- This project does not ship a license file in the snippet above; add one (e.g. MIT) if you open-source it.
- For contributions: keep the single-entry, single-dashboard flow; keep the backend contract (`/health`, `/metadata`, `/predict`) so the frontend stays compatible.

---

**AviAI** – One flight number, one dashboard. Relax and enjoy your flight.
