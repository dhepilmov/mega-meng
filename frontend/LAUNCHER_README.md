# 🚀 Mega Meng Frontend Launchers

Easy-to-use development server launchers for the Mega Meng project.

## 🎯 Available Launchers

### **1. Cross-Platform Launcher (Recommended)**
```bash
npm run launcher
```
- **Node.js script** that works on Windows, macOS, and Linux
- Interactive menu with colored output
- Smart dependency management (skips installs when unchanged)
- Route picker for easy navigation

### **2. Windows Batch Launcher**
```bash
# Windows only - double-click or run from cmd
RUN.bat
```
- **Windows .bat file** for native Windows experience
- Same features as Node.js version
- Familiar Windows-style interface

### **3. Force Reinstall Dependencies**
```bash
npm run launcher:reinstall
```
- Forces fresh npm install even if dependencies haven't changed
- Useful for troubleshooting dependency issues

## 📋 Features

### **Smart Dependency Management**
- Automatically detects when `package.json` or `package-lock.json` changes
- Skips unnecessary `npm install` for faster startup
- Uses SHA256 hash caching in `.cache/deps.sha256`

### **Multiple Server Options**
1. **Dev Server** (`npm run dev`)
   - Hot reload development server
   - Runs on port 3000 (or next available)
   
2. **Netlify Dev** (Netlify CLI simulation)  
   - Tests deployment configuration locally
   - Runs on port 8888
   
3. **Static Preview** (serves built files)
   - Tests production build locally
   - Automatically builds if needed
   - Runs on port 5000

### **Route Picker Menu**
Quick access to Mega Meng's dual-application architecture:
- **W** - WarungMeng (`/warungmeng`)
- **Y** - Yuzha Launcher (`/yuzha`) 
- **R** - Root (`/`) - redirects to WarungMeng
- **B** - Both (opens WarungMeng + Yuzha)
- **N** - None (server only, no browser)

## 🔧 Configuration

### **Default Ports**
- Dev Server: `3000`
- Static Preview: `5000` 
- Netlify Dev: `8888`

### **Backend Integration**
- Production Backend: `https://yuzhayo.pythonanywhere.com/api/`
- Configured in `/frontend/.env`

### **Build Output**
- Vite outputs to `./build/` directory
- Static preview serves from `./build/`

## 🚨 Troubleshooting

### **Dependencies Issues**
```bash
npm run launcher:reinstall
```
Forces fresh install of all dependencies.

### **Port Conflicts**
Launchers automatically try next available ports:
- Dev: 3000 → 3001 → 3002...
- Static: 5000 → 5001 → 5002...

### **Build Fails**
1. Check Node.js version: `node --version` (need 18+)
2. Clear cache: `rm -rf node_modules package-lock.json && npm install`
3. Check console for specific error messages

### **Browser Doesn't Open**
- **Windows**: Uses `start` command
- **macOS**: Uses `open` command  
- **Linux**: Uses `xdg-open` command
- **Fallback**: Manual URL shown in console

## 💻 Usage Examples

### **Quick Development Start**
```bash
cd frontend
npm run launcher
# Choose 1 (Dev server)
# Choose W (WarungMeng) or Y (Yuzha)
```

### **Test Production Build**
```bash
cd frontend  
npm run launcher
# Choose 3 (Static Preview)
# Choose B (Both routes)
```

### **Netlify Deployment Testing**
```bash
cd frontend
npm run launcher  
# Choose 2 (Netlify Dev)
# Choose N (No browser, check console)
```

## 🏗️ Architecture Integration

### **Mega Meng Routes**
- `/` → Redirects to `/warungmeng`
- `/warungmeng` → Business website (maintenance mode)
- `/yuzha` → Personal application launcher

### **Backend API**
- Local: `http://localhost:8001/api/` (when backend running)
- Production: `https://yuzhayo.pythonanywhere.com/api/`

### **Tech Stack**
- **Frontend**: React 19 + TypeScript + Vite 7.x + Tailwind CSS
- **Package Manager**: npm (converted from yarn)
- **Build System**: Vite with optimized configuration

---

**🎯 These launchers provide the fastest way to start developing the Mega Meng frontend with proper route navigation and backend integration.**