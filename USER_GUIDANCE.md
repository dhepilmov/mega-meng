# 🚀 USER GUIDE: Setting Up Mega Meng Locally

**For Beginners**: Complete step-by-step guide to run Mega Meng on your Windows 10 64-bit computer

---

## 📖 What You'll Learn

This guide will help you:
- Download the Mega Meng project from GitHub
- Install required software on your computer  
- Set up and run both frontend and backend services
- Access the beautiful Mega Meng application in your browser
- Troubleshoot common issues

**Time Required**: 30-45 minutes (first time setup)

---

## 🎯 What Is Mega Meng?

Mega Meng is a modern web application with two parts:
- **WarungMeng**: Business website (currently in maintenance mode)
- **Yuzha**: Personal application launcher with beautiful interface

**Live Version**: https://mega-meng.netlify.app
**Your Local Version**: Will run at http://localhost:3000

---

## ✅ Prerequisites - Install These First

### 1. Node.js (Required for Frontend)

**What it is**: JavaScript runtime needed to run the React frontend

**Download & Install**:
1. Go to https://nodejs.org/en/download/
2. Click "Windows Installer" (.msi file)
3. Choose "LTS" (Long Term Support) version
4. Run the downloaded file and follow installation wizard
5. **Important**: Check "Add to PATH" option during installation

**Verify Installation**:
- Open Command Prompt (Press `Windows + R`, type `cmd`, press Enter)
- Type: `node --version`
- Should show something like: `v20.11.0`
- Type: `npm --version` 
- Should show something like: `10.2.4`

### 2. Python (Required for Backend)

**What it is**: Programming language needed to run the FastAPI backend

**Download & Install**:
1. Go to https://www.python.org/downloads/
2. Click "Download Python 3.11.x" (latest 3.11 version)
3. Run the downloaded file
4. **CRITICAL**: Check "Add Python to PATH" checkbox
5. Click "Install Now"

**Verify Installation**:
- Open Command Prompt
- Type: `python --version`
- Should show something like: `Python 3.11.7`
- Type: `pip --version`
- Should show pip information

### 3. Git (Optional but Recommended)

**What it is**: Version control system (makes updates easier later)

**Download & Install**:
1. Go to https://git-scm.com/download/win
2. Download and run the installer
3. Use default settings during installation

### 4. Code Editor (Recommended)

**Visual Studio Code** (Free, beginner-friendly):
1. Go to https://code.visualstudio.com/
2. Download and install for Windows
3. Useful for viewing and editing code files

---

## 📥 Download Mega Meng Project

### Method 1: ZIP Download (Easiest for Beginners)

1. **Go to GitHub Repository**:
   - Visit: https://github.com/yuzhayo/mega-meng
   
2. **Download ZIP File**:
   - Click the green "Code" button
   - Select "Download ZIP" 
   - Save the file to your Desktop or Downloads folder

3. **Extract the ZIP**:
   - Right-click the downloaded `mega-meng-main.zip` file
   - Select "Extract All..."
   - Choose a location (recommend: `C:\Users\YourName\Desktop\mega-meng`)
   - Click "Extract"

4. **Navigate to Project**:
   - Open the extracted folder
   - You should see folders like: `frontend`, `backend`, `AI_AGENT_MUST_READ_*` files

### Method 2: Git Clone (If you installed Git)

1. **Open Command Prompt**
2. **Navigate to desired folder**:
   ```bash
   cd C:\Users\YourName\Desktop
   ```
3. **Clone repository**:
   ```bash
   git clone https://github.com/yuzhayo/mega-meng.git
   cd mega-meng
   ```

---

## 🛠️ Project Setup

### Step 1: Install Yarn (Package Manager)

**Why Yarn**: This project uses Yarn instead of npm for better dependency management.

**Install Yarn Globally**:
1. Open Command Prompt as Administrator (Right-click → "Run as administrator")
2. Type: `npm install -g yarn`
3. Wait for installation to complete
4. Verify: `yarn --version` (should show version number)

### Step 2: Setup Frontend Dependencies

1. **Navigate to Frontend Folder**:
   - Open Command Prompt
   - Navigate to your project: `cd C:\Path\To\Your\mega-meng`
   - Enter frontend folder: `cd frontend`

2. **Install Dependencies**:
   ```bash
   yarn install
   ```
   - This will take 2-5 minutes
   - You'll see downloading progress
   - Wait until it says "Done" with green checkmark

3. **Verify Frontend Setup**:
   - You should see a `node_modules` folder created
   - No error messages should appear

### Step 3: Setup Backend Dependencies

1. **Navigate to Backend Folder**:
   - From the main project folder: `cd backend`
   - Or directly: `cd C:\Path\To\Your\mega-meng\backend`

2. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
   - This will download and install required Python packages
   - Wait for completion (1-3 minutes)

3. **Verify Backend Setup**:
   - Should see "Successfully installed..." messages
   - No error messages about missing packages

---

## 🚀 Running the Application

### Step 1: Start Backend Server

1. **Open Command Prompt** (keep this window open)
2. **Navigate to backend folder**:
   ```bash
   cd C:\Path\To\Your\mega-meng\backend
   ```
3. **Start the backend server**:
   ```bash
   python server.py
   ```
4. **Look for success message**:
   - Should see: "Uvicorn running on http://0.0.0.0:8001"
   - Or similar message about server starting
   - **Keep this window open** - closing it stops the backend

### Step 2: Start Frontend Server

1. **Open a NEW Command Prompt window** (second window)
2. **Navigate to frontend folder**:
   ```bash
   cd C:\Path\To\Your\mega-meng\frontend
   ```
3. **Start the frontend server**:
   ```bash
   yarn start
   ```
4. **Wait for startup**:
   - You'll see "Starting the development server..."
   - Takes 30-60 seconds
   - Should automatically open browser to http://localhost:3000
   - **Keep this window open** - closing it stops the frontend

### Step 3: Access the Application

1. **Automatic Browser Opening**:
   - Browser should automatically open to http://localhost:3000
   - If not, manually visit: http://localhost:3000

2. **What You Should See**:
   - **Root page**: Redirects to WarungMeng maintenance screen
   - **WarungMeng**: Professional "UNDER MAINTENANCE" page
   - **Yuzha Launcher**: Visit http://localhost:3000/yuzha for beautiful personal app

3. **Test Both Applications**:
   - Main site: http://localhost:3000 (shows maintenance)
   - WarungMeng: http://localhost:3000/warungmeng (business site)  
   - Yuzha: http://localhost:3000/yuzha (personal launcher)

---

## 🔍 Verification Checklist

### ✅ Backend is Working:
- [ ] Command prompt shows "Uvicorn running on http://0.0.0.0:8001"
- [ ] Visit http://localhost:8001/api/health - should show JSON response
- [ ] No error messages in backend command prompt

### ✅ Frontend is Working:
- [ ] Command prompt shows "webpack compiled successfully"
- [ ] Browser opens to http://localhost:3000
- [ ] Page loads without errors (may show maintenance screen)
- [ ] No red error messages in browser console (F12 to check)

### ✅ Both Apps Accessible:
- [ ] http://localhost:3000 → Shows maintenance or redirects to WarungMeng
- [ ] http://localhost:3000/warungmeng → Business website
- [ ] http://localhost:3000/yuzha → Personal launcher with beautiful UI

### ✅ Development Ready:
- [ ] Both command prompt windows remain open and running
- [ ] Changes to files automatically reload in browser
- [ ] No "connection refused" or similar errors

---

## 🚨 Troubleshooting Common Issues

### Problem: "Command not found" errors

**Symptoms**: 
- `node` command not recognized
- `python` command not recognized  
- `yarn` command not recognized

**Solutions**:
1. **Restart Command Prompt** after installing software
2. **Check PATH environment**:
   - Windows + R → type `sysdm.cpl` → Enter
   - Advanced → Environment Variables
   - Ensure Node.js and Python paths are in System PATH
3. **Reinstall with "Add to PATH" option checked**

### Problem: Port already in use

**Symptoms**:
- "Port 3000 is already in use"
- "Port 8001 is already in use"

**Solutions**:
1. **Kill existing processes**:
   - Press Ctrl+C in command prompts running servers
   - Close all command prompt windows
   - Restart both servers
2. **Use different ports** (advanced):
   - Frontend: `yarn start` and choose 'Y' for different port
   - Backend: Edit server.py to use different port

### Problem: Installation errors

**Symptoms**:
- "Failed to install dependencies"
- "Permission denied" errors
- "Network timeout" errors

**Solutions**:
1. **Run as Administrator**:
   - Right-click Command Prompt → "Run as administrator"
   - Retry installation commands
2. **Clear caches**:
   - `yarn cache clean` (for frontend)
   - `pip cache purge` (for backend)
3. **Check internet connection** - installations download from internet

### Problem: Blank page or connection errors

**Symptoms**:
- Browser shows "This site can't be reached"
- Blank page at localhost:3000
- "Failed to fetch" errors

**Solutions**:
1. **Verify both servers are running**:
   - Backend: Check command prompt shows "Uvicorn running"
   - Frontend: Check command prompt shows "webpack compiled"
2. **Check URLs**:
   - Frontend: http://localhost:3000 (not https)
   - Backend API: http://localhost:8001/api/health
3. **Disable antivirus/firewall temporarily** to test

### Problem: Frontend builds but shows errors

**Symptoms**:
- Page loads but shows JavaScript errors
- Missing components or broken styling
- Console shows red error messages

**Solutions**:
1. **Check dependencies are installed**:
   - Navigate to frontend folder
   - Run `yarn install` again
2. **Clear browser cache**:
   - Press Ctrl+F5 to hard refresh
   - Or use Incognito/Private browsing mode
3. **Restart development server**:
   - Ctrl+C in frontend command prompt
   - Run `yarn start` again

---

## 📝 Development Workflow

### Daily Usage (After Initial Setup):

1. **Start Development Session**:
   ```bash
   # Terminal 1: Backend
   cd C:\Path\To\mega-meng\backend
   python server.py
   
   # Terminal 2: Frontend  
   cd C:\Path\To\mega-meng\frontend
   yarn start
   ```

2. **Access Applications**:
   - Main site: http://localhost:3000
   - Yuzha launcher: http://localhost:3000/yuzha
   - WarungMeng business: http://localhost:3000/warungmeng
   - Backend API: http://localhost:8001/api/

3. **Stop Development Session**:
   - Press `Ctrl+C` in both command prompt windows
   - Close command prompt windows

### Making Changes:

- **Edit files** in your code editor (VS Code recommended)
- **Save changes** - browser automatically refreshes
- **Check browser** for updates (usually instant)
- **Check command prompts** for any error messages

### Project Structure Understanding:

```
mega-meng/
├── frontend/          # React application (what users see)
│   ├── src/           # Your code goes here
│   ├── public/        # Static files (images, etc.)
│   └── package.json   # Dependencies list
├── backend/           # FastAPI server (handles data)
│   ├── server.py      # Main server file
│   └── requirements.txt # Python dependencies
└── AI_AGENT_MUST_READ_*.md # Documentation files
```

---

## 🎓 Next Steps

### Learning Resources:

1. **React Development**: 
   - Official docs: https://react.dev/
   - Tutorial: https://react.dev/learn

2. **FastAPI Backend**:
   - Official docs: https://fastapi.tiangolo.com/
   - Tutorial: https://fastapi.tiangolo.com/tutorial/

3. **JavaScript/TypeScript**:
   - MDN Web Docs: https://developer.mozilla.org/
   - TypeScript handbook: https://www.typescriptlang.org/docs/

### Customization Ideas:

- **Modify the Yuzha launcher** appearance in `/frontend/src/Yuzha/`
- **Add new routes** to WarungMeng in `/frontend/src/warungmeng/`  
- **Create new API endpoints** in `/backend/server.py`
- **Change styling** using Tailwind CSS classes

### Getting Help:

- **Check browser console** (F12) for frontend errors
- **Check command prompt** for backend errors
- **Read error messages carefully** - they usually explain the problem
- **Google specific error messages** for solutions
- **Use AI assistants** to debug issues with specific error details

---

## 🔗 Important URLs Reference

### Local Development:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001/api/
- **API Health Check**: http://localhost:8001/api/health

### Live Production (for comparison):
- **Live Site**: https://mega-meng.netlify.app
- **WarungMeng**: https://mega-meng.netlify.app/warungmeng  
- **Yuzha Launcher**: https://mega-meng.netlify.app/yuzha

### Development Tools:
- **GitHub Repository**: https://github.com/yuzhayo/mega-meng
- **Node.js Download**: https://nodejs.org/
- **Python Download**: https://www.python.org/
- **VS Code Download**: https://code.visualstudio.com/

---

**🎉 Congratulations!** You now have Mega Meng running locally on your computer. You can explore both the WarungMeng business website and the beautiful Yuzha personal launcher. 

**Happy coding!** 🚀

---

*This guide was created for Windows 10 64-bit users. For other operating systems or advanced setup options, refer to the AI_AGENT_MUST_READ_*.md files in the project root.*

*Last Updated: January 21, 2025*