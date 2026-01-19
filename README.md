# QA Automation Demo Site

This is a simple React + Python (FastAPI) application designed for QA automation practice.

## Project Structure
- `frontend/`: React application (Vite)
- `backend/`: FastAPI application

## Prerequisites
- Node.js (v18+)
- Python (v3.8+)

## How to Run Locally

### 1. Backend
Navigate to the `backend` directory and run:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
The API will be available at `http://localhost:8001`.

### 2. Frontend
Navigate to the `frontend` directory and run:

```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## Features
- **Customer Verification Form**: Name, Email, DOB, ID Upload.
- **Validation**:
  - Client-side: Required fields, Email format, Age check (18+).
  - Backend: Mock verification check.
- **Mock API**:
  - `GET /api/validation-rules`: Returns validation constraints.
  - `GET /api/user-verification?email=...`: Returns status.
  - `POST /api/submit`: Accepts form submission.

## QA Task Instructions
This site is the "Target Application" for the automated tests.
Your goal is to write automation scripts (e.g., Python + Selenium) to:
1. Validate form constraints (try submitting invalid data).
2. Upload a file.
3. Verify successful submission.
4. Verify API responses directly.
