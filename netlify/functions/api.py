from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import random

app = FastAPI()

# CORS configuration
origins = [
    "*",  # Allow all for demo deployment
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ValidationRules(BaseModel):
    min_age: int
    required_fields: list[str]
    allowed_file_types: list[str]

@app.get("/api/validation-rules")
def get_validation_rules():
    return {
        "min_age": 18,
        "required_fields": ["name", "email", "dob"],
        "allowed_file_types": ["image/png", "image/jpeg", "application/pdf"]
    }

@app.get("/api/user-verification")
def verify_user(email: str):
    # Simulate a check. 
    # For demo purposes, we can deterministically return status based on email content
    # or just random. Let's do deterministic for testability if they figure it out,
    # but the prompt implies this is a "status check" endpoint.
    
    # If email contains "verified", return verified.
    # If "pending", return pending.
    # Otherwise, return "not_found"
    
    if "verified" in email.lower():
        return {"status": "Verified", "email": email}
    elif "pending" in email.lower():
         return {"status": "Pending", "email": email}
    else:
         return {"status": "Not Found", "email": email}

@app.post("/api/submit")
def submit_form(
    name: str = Form(...),
    email: str = Form(...),
    dob: str = Form(...),
    id_file: UploadFile = File(...)
):
    # Mock submission
    return {
        "message": "Submission successful",
        "data": {
            "name": name,
            "email": email,
            "dob": dob,
            "filename": id_file.filename
        }
    }

# Mangum Handler for Netlify/Lambda
from mangum import Mangum
handler = Mangum(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

