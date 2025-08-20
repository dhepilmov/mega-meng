# Backend Deployment

## Current Setup
Clean FastAPI backend with two deployment options:

### Option 1: PythonAnywhere (Chosen - Free, No Credit Card)
- **Files**: `server_pythonanywhere.py`, `requirements_pythonanywhere.txt`
- **Deployment**: See `PYTHONANYWHERE_DEPLOYMENT.md`
- **URL**: `https://yourusername.pythonanywhere.com`

### Option 2: Local Development
- **Files**: `server.py`, `requirements.txt` 
- **MongoDB**: Required for full functionality
- **URL**: `http://localhost:8001`

## Files Explanation
- `server.py` - Full FastAPI app with MongoDB (local development)
- `server_pythonanywhere.py` - Simplified FastAPI app for PythonAnywhere
- `requirements.txt` - Full dependencies with MongoDB
- `requirements_pythonanywhere.txt` - Minimal dependencies for free hosting
- `PYTHONANYWHERE_DEPLOYMENT.md` - Step-by-step deployment guide