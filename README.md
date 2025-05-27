# CRM Tracker

A modern Customer Relationship Management (CRM) system built with React, FastAPI, and Firebase. It features secure authentication, and a clean, responsive UI for managing leads and orders.

## Features
- **Authentication:** Firebase Auth, JWT-secured API, protected routes
- **Lead Management:** Create, update, delete, and track leads with status, source, and notes
- **Order Management:** Orders linked to leads, status and payment tracking, analytics
- **Dashboard:** Visual analytics with Chart.js, conversion metrics, and performance tracking
- **Responsive UI:** Modern design, mobile-friendly, toast notifications, loading states

## Tech Stack
- **Frontend:** React 19, Vite, Firebase Auth, Chart.js, React Router, Axios
- **Backend:** FastAPI, Firebase Admin SDK, Python 3.12+, Pydantic, Uvicorn
- **Database:** Firestore (hierarchical: users → leads/orders)

## Project Structure
```
backend/
  models/        # Pydantic models (user, lead, order)
  routers/       # FastAPI route handlers (auth, leads, orders)
  firebase.py    # Firebase utilities
  main.py        # FastAPI app entry
frontend/
  src/
    components/  # React components (Dashboard, Navbar, leads, orders)
    context/     # Auth context/provider
    hooks/       # Custom hooks
    App.jsx      # Main app
  public/        # Static assets
```

## Quick Start
### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# Add Firebase cred.json
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
# Configure Firebase in src/firebase/config.js
npm run dev
```

## Data Model (Firestore)
```
users/{user_id}/
  leads/{lead_id}   # Lead data
  orders/{order_id} # Order data (with lead_id reference)
```

## Key API Endpoints
- `POST /auth/register` – Register user
- `POST /auth/login` – Login
- `GET /leads` – List leads
- `POST /leads` – Create lead
- `GET /orders` – List orders
- `POST /orders` – Create order

## Environment
- Backend: `.env` with Firebase and JWT config
- Frontend: `.env.local` with API and Firebase config

