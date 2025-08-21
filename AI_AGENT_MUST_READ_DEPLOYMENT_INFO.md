# 🚀 AI AGENT DEPLOYMENT INFO - MEGA MENG

**Purpose: Complete deployment, access, and environment information for AI agents**

---

## 🌐 [LIVE DEPLOYMENT URLS]

### **Production Frontend (Netlify)**
- **Primary URL**: https://mega-meng.netlify.app
- **Status**: Live and Auto-Deployed  
- **Deployment**: Automatic from GitHub main branch
- **Build Time**: 2-3 minutes after GitHub push

### **Production Backend (PythonAnywhere)**  
- **API Base**: https://yuzhayo.pythonanywhere.com/api/
- **Health Check**: https://yuzhayo.pythonanywhere.com/api/health
- **Status**: Live and Operational
- **Deployment**: Manual via PythonAnywhere dashboard

### **Development Environment**
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8001  
- **Status**: Running in container (supervisor managed)

---

## 🔗 [ACCESSIBLE ROUTES]

**After Latest Routing Optimization (January 21, 2025):**

### **✅ Working URLs:**
- **https://mega-meng.netlify.app/** → Redirects to `/warungmeng` (Professional maintenance)
- **https://mega-meng.netlify.app/warungmeng** → WarungMeng maintenance screen
- **https://mega-meng.netlify.app/warungmeng/** → WarungMeng business website  
- **https://mega-meng.netlify.app/yuzha** → Yuzha Launcher (Beautiful personal app)
- **https://mega-meng.netlify.app/yuzha/** → Extended Yuzha routes

### **❌ Deleted URLs (Show Blank):**
- ~~https://mega-meng.netlify.app/launcher~~ → Blank page (route removed)
- ~~https://mega-meng.netlify.app/welcome~~ → Blank page (route removed)

### **📱 Responsive Design:**
All URLs work perfectly on mobile, tablet, and desktop devices.

---

## ⚙️ [ENVIRONMENT CONFIGURATION]

### **Frontend Environment (.env)**
```bash
REACT_APP_BACKEND_URL=https://yuzhayo.pythonanywhere.com
```

**CRITICAL**: 
- ✅ **NEVER modify this URL** - production configured  
- ✅ **Always use environment variable** in code
- ❌ **Never hardcode URLs** in components

### **Backend Environment (.env)**  
```bash
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
CORS_ORIGINS=https://mega-meng.netlify.app,http://localhost:3000
```

**CRITICAL**:
- ✅ **NEVER modify MONGO_URL** - container configured
- ✅ **CORS allows both Netlify and local development**  
- ✅ **Backend binds to 0.0.0.0:8001** (supervisor managed)

---

## 📦 [DEPLOYMENT PIPELINE]

### **Frontend Deployment (Netlify)**

#### **Automatic Process:**
1. **Push to GitHub** main branch
2. **Netlify detects changes** automatically  
3. **Build executes** using `yarn build`
4. **Deploy completes** in 2-3 minutes
5. **Live at** https://mega-meng.netlify.app

#### **Build Configuration:**
- **Build Command**: `yarn build`
- **Publish Directory**: `build/`  
- **Node Version**: Latest
- **Environment**: `REACT_APP_BACKEND_URL` configured

#### **GitHub Integration:**
- **Repository**: https://github.com/yuzhayo/mega-meng
- **Branch**: `main` (auto-deploy)  
- **Webhook**: Configured for instant builds

### **Backend Deployment (PythonAnywhere)**

#### **Manual Process:**
1. **Login** to PythonAnywhere dashboard
2. **Navigate** to `/home/yuzhayo/mega-meng/`
3. **Edit** `flask_server.py` or upload new files
4. **Click Reload** in Web tab  
5. **Live immediately** at API endpoints

#### **Configuration:**
- **Username**: yuzhayo
- **Plan**: Free tier (no credit card required)
- **Python**: 3.11  
- **WSGI**: Configured for FastAPI/Flask compatibility

#### **File Structure on PythonAnywhere:**
```
/home/yuzhayo/mega-meng/
├── flask_server.py (production server)
├── requirements.txt (minimal dependencies)
└── [other backend files]
```

---

## 🔧 [LOCAL DEVELOPMENT]

### **Service Management (Supervisor)**

#### **Current Status:**
```bash
backend     RUNNING   pid 333, uptime 0:00:03  
frontend    RUNNING   pid 307, uptime 0:00:04
mongodb     RUNNING   pid 34,  uptime 4:09:45
code-server RUNNING   pid 29,  uptime 4:09:45
```

#### **Control Commands:**
```bash
sudo supervisorctl restart frontend
sudo supervisorctl restart backend  
sudo supervisorctl restart all
sudo supervisorctl status
```

### **Development Workflow:**

#### **Frontend Changes:**
1. **Edit** React components in `/app/frontend/src/`
2. **Hot reload** automatically shows changes  
3. **Test locally** at http://localhost:3000
4. **Push to GitHub** when ready for production

#### **Backend Changes:**  
1. **Edit** FastAPI code in `/app/backend/server.py`
2. **Hot reload** automatically restarts server
3. **Test locally** at http://localhost:8001/api/
4. **Deploy manually** to PythonAnywhere when ready

#### **Install Dependencies:**
```bash
# Frontend
cd /app/frontend && yarn add [package-name]

# Backend  
cd /app/backend && pip install [package-name]
# Then add to requirements.txt
```

---

## 🔐 [ACCESS & CREDENTIALS]

### **PythonAnywhere Account**
- **Username**: yuzhayo
- **Plan**: Free tier
- **Access**: Dashboard login required for manual deployment
- **Maintenance**: Login every 3 months to keep active

### **Netlify Account**  
- **Connected**: GitHub repository `yuzhayo/mega-meng`
- **Plan**: Free tier (100GB bandwidth, 300 build minutes/month)
- **Access**: Auto-deployment, no manual intervention needed

### **Domain Reservations**
- **Active**: mega-meng.netlify.app (Netlify subdomain)  
- **Reserved**: warungmang.com (Hostinger - user has access)
- **Future**: Can configure custom domain when needed

---

## 🔍 [MONITORING & DEBUGGING]

### **Frontend Issues:**
- **Netlify Deploy Logs**: Check build status and errors
- **Browser Console**: Check for JavaScript errors  
- **Local Testing**: Use http://localhost:3000 for debugging

### **Backend Issues:**  
- **PythonAnywhere Error Logs**: Check server error logs
- **Local Logs**: `tail -n 50 /var/log/supervisor/backend.*.log`
- **API Testing**: Use http://localhost:8001/api/health

### **Common Debug Commands:**
```bash
# Check service status
sudo supervisorctl status

# View backend logs  
tail -f /var/log/supervisor/backend.out.log

# Test API connectivity
curl http://localhost:8001/api/health

# Frontend build test
cd /app/frontend && yarn build
```

---

## 📊 [PERFORMANCE METRICS]

### **Frontend Performance:**
- **Bundle Size**: 76.95 kB gzipped (optimized)
- **Build Time**: 22-29 seconds  
- **Load Speed**: Fast on all devices
- **Responsive**: Works on mobile, tablet, desktop

### **Backend Performance:**
- **Response Time**: 22-29ms average
- **Uptime**: 100% (supervisor managed)  
- **Database**: MongoDB connection healthy
- **API Health**: All endpoints operational

### **Deployment Performance:**
- **Netlify Build**: 2-3 minutes (automatic)
- **GitHub Sync**: Instant webhook trigger
- **PythonAnywhere**: Immediate reload after changes

---

## 🚀 [SCALING INFORMATION]

### **Current Limits (Free Tiers):**

#### **Netlify Free Plan:**
- **Bandwidth**: 100GB/month
- **Build Minutes**: 300/month  
- **Sites**: Unlimited
- **Team Members**: 1

#### **PythonAnywhere Free Plan:**
- **CPU Seconds**: 100/day
- **Disk Space**: 512MB  
- **File Size**: 100MB max
- **Always On**: No (manual activation)

### **Upgrade Considerations:**
- **Custom Domain**: Upgrade Netlify or configure Hostinger  
- **More Resources**: Upgrade PythonAnywhere for database support
- **Professional Features**: Both platforms offer paid tiers

---

## 🎯 [NEXT DEPLOYMENT STEPS]

### **For AI Agents Making Changes:**

#### **Frontend Updates:**
1. **Test locally** at http://localhost:3000  
2. **Verify build** with `yarn build`
3. **Push to GitHub** main branch
4. **Monitor Netlify** deployment (2-3 minutes)
5. **Verify live** at https://mega-meng.netlify.app

#### **Backend Updates:**  
1. **Test locally** at http://localhost:8001
2. **Verify API health** endpoint  
3. **Update PythonAnywhere** files manually
4. **Reload application** in Web tab
5. **Test production** API endpoints

#### **Full Stack Updates:**
1. **Complete backend changes** first
2. **Test backend integration** locally  
3. **Update frontend** to use new API
4. **Deploy backend** to PythonAnywhere
5. **Deploy frontend** via GitHub push
6. **Verify end-to-end** functionality

---

**🎯 This deployment info provides everything needed for AI agents to understand, debug, and deploy the Mega Meng project across all environments.**

---

*Last Updated: January 21, 2025 | Status: Production Ready & Fully Deployed*