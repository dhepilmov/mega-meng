# 🚀 Mega Meng - Local Development Setup Guide

**Modern Vite-powered Full-Stack Application**

---

## 📖 Overview

This guide helps you set up **Mega Meng** on your local machine. Mega Meng is a modern web application featuring:

- **WarungMeng**: Business website (maintenance mode)
- **Yuzha**: Personal application launcher
- **Modern Tech Stack**: React 19 + TypeScript + Vite + FastAPI + MongoDB

---

## ✅ Prerequisites

Before starting, ensure you have these installed:

### **Required Software:**
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Python** (3.8 or higher) - [Download here](https://python.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download here](https://code.visualstudio.com/)

### **Verify Installation:**
```bash
node --version    # Should show v18+ 
python --version  # Should show 3.8+
git --version     # Should show installed version
yarn --version    # Should show yarn version
```

---

## 📥 Download Project

### **Option 1: GitHub ZIP Download (Recommended for Beginners)**

1. **Visit Repository**: Go to your Mega Meng GitHub repository
2. **Download ZIP**: Click green **"Code"** button → **"Download ZIP"**
3. **Extract Files**: Extract ZIP to desired folder (e.g., `C:\Projects\mega-meng`)
4. **Open Terminal**: Open Command Prompt/PowerShell in extracted folder

### **Option 2: Git Clone (For Developers)**

```bash
git clone https://github.com/YOUR_USERNAME/mega-meng.git
cd mega-meng
```

---

## 🛠️ Project Setup

### **Step 1: Install Dependencies**

**Frontend Setup:**
```bash
cd frontend
yarn install
```

**Backend Setup:**
```bash
cd ../backend  
pip install -r requirements.txt
```

### **Step 2: Environment Configuration**

The `.env` files are pre-configured for local development. No changes needed!

- **Frontend**: Uses `VITE_BACKEND_URL` for API connection
- **Backend**: Uses `MONGO_URL` for database connection

---

## 🚀 Running the Application

### **Start Backend Server (Terminal 1):**
```bash
cd backend
python server.py
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8001
Database connected successfully
```

### **Start Frontend Server (Terminal 2):**
```bash
cd frontend
yarn dev
```

**Expected Output:**
```
VITE v5.4.19  ready in 342 ms
➜  Local:   http://localhost:3000/
```

---

## 🔍 Verification Checklist

### **✅ Backend Health Check:**
- Open: http://localhost:8001/api/health
- Should show: `{"status":"healthy","database":"connected"}`

### **✅ Frontend Application:**
- **Root Page**: http://localhost:3000/ → Redirects to WarungMeng
- **WarungMeng**: http://localhost:3000/warungmeng → Maintenance page
- **Yuzha Launcher**: http://localhost:3000/yuzha → Application launcher

### **✅ Development Features:**
- **Hot Reload**: Edit any component file, see instant changes
- **Fast Builds**: Production build in ~4-5 seconds
- **Clean Console**: No errors in browser console (F12)

---

## 🏗️ Building for Production

### **Create Production Build:**
```bash
cd frontend
yarn build
```

**Expected Output:**
```
✓ built in 4.46s
build/index.html                   7.49 kB │ gzip:  2.28 kB
build/assets/index-C5RNtlwl.css   19.28 kB │ gzip:  4.55 kB
build/assets/vendor-BeLYVh7p.js   11.68 kB │ gzip:  4.11 kB
build/assets/router-DjIjB-w1.js   32.37 kB │ gzip: 11.97 kB
build/assets/index-qAU6GYAr.js   194.62 kB │ gzip: 60.83 kB
```

**Generated Files**: Optimized production files in `/frontend/build/` folder

---

## 🚨 Troubleshooting

### **Common Issues & Solutions:**

#### **Port Already in Use**
```
Error: Port 3000 is already in use
```
**Solution**: Vite automatically tries the next available port (3001, 3002, etc.)

#### **Backend Connection Failed**
```
Error: Failed to fetch from backend
```
**Solutions**:
- Ensure backend server is running on port 8001
- Check: http://localhost:8001/api/health
- Restart backend server if needed

#### **Dependencies Installation Failed**
```
Error: Failed to install dependencies
```
**Solutions**:
- Ensure Node.js v18+ and Python 3.8+ are installed
- Delete `node_modules` folder, run `yarn install` again
- For backend: `pip install -r requirements.txt --upgrade`

#### **Database Connection Issues**
```
Error: Database connection failed
```
**Solution**: The app uses a pre-configured MongoDB connection. If issues persist, check backend logs for details.

---

## 📝 Development Workflow

### **Making Changes:**

1. **Frontend Changes**: Edit files in `/frontend/src/` → Hot reload shows changes instantly
2. **Backend Changes**: Edit `/backend/server.py` → Restart server to apply changes
3. **Styling**: Modify Tailwind CSS classes → Changes appear immediately
4. **New Components**: Add to appropriate folders (warungmeng/ or Yuzha/)

### **File Structure:**
```
mega-meng/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── warungmeng/ # Business website components
│   │   └── Yuzha/      # Personal launcher components
│   └── package.json    # Frontend dependencies
├── backend/            # FastAPI server
│   ├── server.py       # Main API server
│   └── requirements.txt # Python dependencies
└── README.md           # Project documentation
```

---

## 🎓 Next Steps

### **For Developers:**
- **Add Features**: Extend WarungMeng or Yuzha functionality
- **API Integration**: Connect external services via backend
- **Database**: Add new models and endpoints
- **Deployment**: Use build files for production deployment

### **For Users:**
- **WarungMeng**: Business features (currently in maintenance)
- **Yuzha Launcher**: Personal application tools
- **Settings**: Customize application preferences

---

## 📞 Support

### **Need Help?**
- **Documentation**: Check AI agent documentation files in project root
- **Logs**: Check browser console (F12) for frontend issues
- **Backend**: Check terminal output for server issues
- **GitHub**: Review repository issues and documentation

### **Performance Notes:**
- **Build Speed**: ~4.5 seconds (vs 30+ seconds with older systems)
- **Hot Reload**: Instant component updates during development
- **Bundle Size**: Optimized ~265 kB total (gzipped ~83 kB)

---

**🚀 Happy Coding with Mega Meng!**

*Last Updated: January 21, 2025 - Vite Migration Complete*