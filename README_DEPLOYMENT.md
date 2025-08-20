# Deployment Guide

## Backend Deployment to Render

### Files Created for Render:
- `render.yaml` - Render deployment configuration
- `Dockerfile` - Docker container configuration
- `runtime.txt` - Python version specification
- `.env.example` - Environment variables template

### Steps:
1. Create GitHub repository
2. Push backend folder to GitHub
3. Connect GitHub to Render
4. Deploy using render.yaml
5. Set environment variables in Render dashboard

### Environment Variables to Set in Render:
- `MONGO_URL` - MongoDB connection string (Render will provide)
- `DB_NAME` - Database name (test_database)
- `CORS_ORIGINS` - Allowed origins (your Hostinger domain)

## Frontend Deployment to Hostinger

### Build Command:
```bash
cd frontend
yarn build
```

### Upload to Hostinger:
1. Upload all files from `build/` folder to `public_html/`
2. Update `REACT_APP_BACKEND_URL` to Render backend URL

### Files Structure after Build:
```
public_html/
├── index.html
├── static/
│   ├── css/
│   ├── js/
│   └── media/
└── manifest.json
```