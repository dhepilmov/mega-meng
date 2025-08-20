from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
import os

# Simple in-memory storage for demo (no MongoDB on free plan)
app = FastAPI(title="Mega Meng API", version="1.0.0")

# Create a router with the /api prefix  
api_router = APIRouter(prefix="/api")

# Basic route
@api_router.get("/")
async def root():
    return {"message": "Hello from Mega Meng!", "status": "PythonAnywhere ready"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "platform": "PythonAnywhere"}

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Configure with your domain later
    allow_methods=["*"],
    allow_headers=["*"],
)

# PythonAnywhere WSGI compatibility
from fastapi import FastAPI
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)