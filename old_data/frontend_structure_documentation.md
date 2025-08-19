# Frontend Directory Structure Documentation

## 📋 Complete Frontend File & Folder Structure

**Generated on:** 2025-01-19  
**Purpose:** Documentation for LAUNCHER CLOCK REFACTORING PROJECT  
**Project Phase:** Before refactoring the monolithic launcher_screen.tsx

---

## 🗂️ ROOT LEVEL FILES (/app/frontend/)

```
/app/frontend/
├── .env                          # Environment variables (protected)
├── .env.production               # Production environment config
├── .gitignore                    # Git ignore rules
├── README.md                     # Project documentation
├── capacitor.config.ts           # Capacitor mobile app config
├── netlify.toml                  # Netlify deployment config
├── package.json                  # NPM dependencies & scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── yarn.lock                     # Yarn dependency lock file
```

## 📱 ANDROID DIRECTORY (/app/frontend/android/)

**Note:** Full Android/Capacitor native app structure for mobile deployment

```
android/
├── .gitignore                    # Android-specific git ignore
├── build.gradle                  # Main Android build config
├── capacitor.settings.gradle     # Capacitor integration settings  
├── gradle.properties             # Gradle properties
├── gradlew                       # Gradle wrapper (executable)
├── gradlew.bat                   # Gradle wrapper (Windows)
├── settings.gradle               # Gradle settings
├── variables.gradle              # Android build variables
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties
└── app/
    ├── .gitignore
    ├── build.gradle              # App-level build config
    ├── capacitor.build.gradle    # Capacitor build integration
    ├── proguard-rules.pro        # Code obfuscation rules
    └── src/
        ├── androidTest/          # Android instrumented tests
        ├── main/                 # Main Android source
        │   ├── AndroidManifest.xml
        │   ├── java/com/example/launcher/
        │   │   └── MainActivity.java
        │   └── res/              # Android resources
        │       ├── drawable*/    # App icons & splash screens
        │       ├── layout/
        │       ├── mipmap*/      # Various resolution icons
        │       ├── values/       # Strings, styles, colors
        │       └── xml/
        └── test/                 # Unit tests
```

## 📁 PUBLIC DIRECTORY (/app/frontend/public/)

**Static assets and HTML template**

```
public/
├── index.html                    # Main HTML template
├── favicon.ico                   # Browser tab icon
├── manifest.json                 # PWA manifest
├── robots.txt                    # Search engine instructions
└── res/                          # Clock assets directory
    ├── clockBG.png              # Clock background image
    ├── hour_hand.png            # Hour hand asset
    ├── minute_hand.png          # Minute hand asset  
    ├── second_hand.png          # Second hand asset
    └── [additional clock assets] # Other layer assets
```

## 💻 SOURCE CODE (/app/frontend/src/)

**Main application source code**

```
src/
├── index.tsx                     # React app entry point
├── index.css                     # Global styles & Tailwind imports
├── App.tsx                       # Main App component
├── App.css                       # App-level styles
├── reportWebVitals.ts           # Performance monitoring
├── setupTests.ts                # Jest test configuration
├── react-app-env.d.ts          # React TypeScript definitions
├── launcher_screen.tsx          # 🚨 MONOLITHIC FILE (2,230 lines)
└── components/                   # Reusable React components
    ├── common/                   # Shared UI components
    │   ├── Button.tsx           # Generic button component
    │   ├── Modal.tsx            # Modal dialog component
    │   └── Loading.tsx          # Loading spinner component
    └── launcher/                 # Launcher-specific components
        ├── ClockLayer.tsx       # Individual clock layer component
        └── SettingsPanel.tsx    # Settings UI component
```

## 📦 NODE_MODULES (/app/frontend/node_modules/)

**Installed dependencies (excluded from documentation for brevity)**

```
node_modules/
├── .bin/                        # Executable binaries
├── .cache/                      # Build cache
├── @babel/                      # Babel compilation tools
├── @types/                      # TypeScript definitions
├── react/                       # React framework
├── react-dom/                   # React DOM renderer
├── typescript/                  # TypeScript compiler
├── tailwindcss/                 # Tailwind CSS framework
├── @capacitor/                  # Capacitor mobile framework
└── [1000+ other dependencies]   # Full dependency tree
```

---

## 🎯 KEY FILES FOR REFACTORING

### **CRITICAL MONOLITHIC FILE:**
- **`launcher_screen.tsx`** - 2,230 lines that need to be split

### **CONFIGURATION FILES:**
- **`package.json`** - Dependencies management
- **`tailwind.config.js`** - Styling framework config  
- **`tsconfig.json`** - TypeScript settings
- **`.env`** - Environment variables (protected)

### **MOBILE APP FILES:**
- **`capacitor.config.ts`** - Mobile app configuration
- **`android/`** - Complete Android native code structure

### **ASSETS:**
- **`public/res/`** - Clock layer images and assets

---

## 🔧 DEVELOPMENT INFRASTRUCTURE

### **BUILD TOOLS:**
- **Yarn** - Package manager (yarn.lock)
- **TypeScript** - Type safety (tsconfig.json)  
- **Babel** - JavaScript compilation
- **PostCSS** - CSS processing
- **Tailwind** - Utility-first CSS framework

### **DEPLOYMENT:**
- **Netlify** - Web deployment (netlify.toml)
- **Capacitor** - Mobile app deployment (android/)

### **TESTING:**
- **Jest** - Unit testing framework
- **Testing Library** - React component testing

---

## 📊 FILE STATISTICS

| Category | Count | Total Size |
|----------|--------|------------|
| Source Files (.tsx/.ts) | ~15 | ~50KB |
| Configuration Files | 8 | ~15KB |
| Android Files | 50+ | ~200KB |
| Assets (public/res/) | 20+ | ~2MB |
| Dependencies (node_modules) | 1000+ | ~500MB |

---

## 🚨 REFACTORING TARGET

**Primary Focus:** `launcher_screen.tsx` (2,230 lines)

**Goal:** Split into modular architecture:
- 20 independent layer components  
- Settings system modules
- Core utilities and types
- Reduce to ~400 lines maximum

---

## 📝 NOTES

1. **Protected Files:** Never modify .env files or port configurations
2. **Mobile Ready:** Full Android/Capacitor setup for mobile deployment
3. **Modern Stack:** TypeScript + React + Tailwind + Capacitor
4. **Asset Management:** Clock images stored in public/res/
5. **Hot Reload:** Development server with live updates

---

**Status:** ✅ Complete documentation  
**Next Step:** Begin Phase 1 refactoring of launcher_screen.tsx