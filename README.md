# ArtisanAI

ArtisanAI is a bilingual artisan marketplace and toolkit. It combines a Flask backend with a single-page frontend for product listings, OTP login, catalog generation, pricing suggestions, image enhancement demos, orders, reviews, and earnings.

## Project layout

- `backend/app.py` - Flask API and database setup
- `backend/requirments.txt` - Python dependencies used by the app
- `frontend/index.html` - application screens
- `frontend/script.js` - navigation and API interactions
- `frontend/style.css` - visual styling
- `render.yaml` - Render deployment configuration

The root `backend` and `frontend` folders are the canonical application. `ArtisanAI-extracted` and `ArtisanAI-ready` are archived copies kept for reference.

## Run locally

From the project root in PowerShell:

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirments.txt
.\.venv\Scripts\python.exe backend\app.py
```

Open http://127.0.0.1:5000 in a browser. The server also serves the frontend, so no separate frontend server is required.

Without Twilio credentials, login uses demo mode with OTP `1234`. To send real SMS messages, set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` before starting the server.

## Deploy on Render

1. Push the complete root `ArtisanAI` folder to GitHub.
2. In Render, choose **New +** then **Blueprint** and select that repository.
3. Render reads `render.yaml`, installs `backend/requirments.txt`, and starts Gunicorn.
4. Add the three Twilio environment variables in Render if real OTP delivery is needed.

SQLite is suitable for this demo, but hosted PostgreSQL or a persistent disk is recommended for production data.