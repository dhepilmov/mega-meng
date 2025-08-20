# 📱 Capacitor APK Build Guide

## 🚀 Quick Commands

### **Build and Test APK:**
```bash
cd /app/frontend

# Method 1: Build APK using Gradle (Recommended)
yarn cap:build-apk

# Method 2: Open Android Studio
yarn cap:open

# Method 3: Run on connected device
yarn cap:run
```

### **Development Workflow:**
```bash
# 1. Make changes to your React app
# 2. Build and sync
yarn cap:build

# 3. Open in Android Studio for APK build
yarn cap:open
```

## 🔧 Configuration Files

### **Backend URL Configuration:**
- **File**: `/app/frontend/.env`
- **Current**: `REACT_APP_BACKEND_URL=https://magical-robinson.preview.emergentagent.com`
- **Local Testing**: Change to `http://localhost:8001`
- **Production**: Change to your deployed backend URL

### **Capacitor Configuration:**
- **File**: `/app/frontend/capacitor.config.ts`
- Pre-configured for Android with proper settings

## 📋 Android Permissions (Pre-configured)

✅ **Internet Access** - For API calls  
✅ **Print API** - For future printing functionality  
✅ **Network State** - For connectivity checking  

### **Optional Permissions (Commented Out):**
- Camera access
- File storage access  
- Location access
- (Uncomment in AndroidManifest.xml when needed)

## 🏗️ Build APK Steps

### **Method 1: Using Gradle (Command Line)**
```bash
cd /app/frontend
yarn cap:build-apk
```
APK will be located at: `android/app/build/outputs/apk/debug/app-debug.apk`

### **Method 2: Using Android Studio**
1. `yarn cap:open` - Opens Android Studio
2. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
3. Wait for build completion
4. APK location will be shown in notification

## 🔄 Web vs Mobile Deployment

### **✅ Web Browser Deployment (Unchanged):**
- Your React app works exactly the same in browsers
- No code changes needed
- Deploy as usual to any hosting service

### **📱 Mobile APK:**
- Same codebase, different build target
- Uses production backend URL from `.env`
- All mobile-specific features available

## 🛠️ Troubleshooting

### **Common Issues:**

1. **Build Fails:**
   ```bash
   # Clean and rebuild
   yarn cap:build
   cd android && ./gradlew clean
   yarn cap:build-apk
   ```

2. **Backend Connection Issues:**
   - Check backend URL in `.env` file
   - Ensure backend allows CORS from app domain
   - Test backend endpoint manually

3. **Android Studio Issues:**
   - Ensure Android Studio and SDK are updated
   - Check Java/Kotlin versions compatibility

## 📁 Project Structure After Capacitor

```
/app/frontend/
├── android/                 # Generated Android project
├── src/config/             
│   └── backend_config.tsx   # Backend URL configuration
├── capacitor.config.ts      # Capacitor settings
├── package.json            # Updated with Capacitor scripts
└── .env                    # Backend URL configuration
```

## 🚀 Deployment Workflow

### **For Web:**
1. Update `.env` with production backend URL
2. `yarn build`
3. Deploy `build/` folder to hosting service

### **For Mobile:**
1. Update `.env` with production backend URL  
2. `yarn cap:build-apk`
3. Distribute APK or upload to Play Store

## 💡 Pro Tips

1. **Always test locally** before building APK
2. **Use development backend** URL for local APK testing
3. **Update .env file** instead of hardcoding URLs
4. **Test on physical device** for best results
5. **Check Android logs** if app crashes: `adb logcat`

## 🔗 Next Steps

- Test the APK on a physical Android device
- Set up automated APK builds (CI/CD)
- Add mobile-specific features (push notifications, etc.)
- Prepare for Play Store deployment (signing, optimization)