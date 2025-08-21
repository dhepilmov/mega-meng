# Routing Architecture - Separate Independent Applications

## Overview
This application implements a **dual-application architecture** with completely separate routing systems for:
1. **WarungMeng** - Website/business application
2. **Yuzha** - Personal application launcher

Both applications work **simultaneously and independently** with their own routing namespaces.

## Current Route Structure

### Main Routes
```
🚀 PRIMARY APP
/ → YuzhaLauncherScreen (Yuzha Launcher - Main app on Netlify)

🔧 DEVELOPMENT
/welcome → Foundation/Development page
```

### WarungMeng Website Routes (Namespace: /warungmeng/*)
```
/warungmeng → MaintenanceScreen (WarungMeng maintenance page) 
/warungmeng/ → WarungMengApp (main cafe website)
/warungmeng/home → WarungMengApp (alternative)
/warungmeng/maintenance → MaintenanceScreen (for website maintenance)
```

### Yuzha Personal App Routes (Namespace: /yuzha/*)
```
/yuzha/ → YuzhaLauncherScreen (main launcher)
/yuzha/launcher → YuzhaLauncherScreen (alternative)
/yuzha/home → YuzhaLauncherScreen (alternative)
```

### Legacy Compatibility Routes
```
/launcher → YuzhaLauncherScreen (direct access, backward compatibility)
```

## 🚀 **UPDATED ROUTING STRUCTURE (Latest)**

### **Current Implementation (January 2025)**
```
App.tsx (Main Router)
├── / → YuzhaLauncherScreen (🚀 PRIMARY APP)
├── /welcome → HomePage (🔧 Development)
├── /warungmeng → MaintenanceScreen (🏪 WarungMeng landing)
├── /warungmeng/* → WarungMengRouter (🏪 WarungMeng website)
├── /yuzha/* → YuzhaRouter (🎯 Yuzha extended)
└── /launcher → YuzhaLauncherScreen (🔄 Legacy compatibility)
```

## Architecture Benefits

### 1. Complete Independence
- **WarungMeng** can have unlimited sub-routes under `/warungmeng/*`
- **Yuzha** can have unlimited sub-routes under `/yuzha/*`
- No naming conflicts between applications
- Each app can be developed separately

### 2. Scalability
Each application can expand with its own routing system:

**WarungMeng Future Routes:**
```
/warungmeng/menu
/warungmeng/about
/warungmeng/contact
/warungmeng/gallery
/warungmeng/admin
```

**Yuzha Future Routes:**
```
/yuzha/dashboard
/yuzha/apps
/yuzha/settings
/yuzha/profile
/yuzha/tools
```

### 3. Separation of Concerns
- Different development teams can work on each application
- Different styling and component libraries if needed
- Different state management systems
- Independent deployment strategies

## Technical Implementation

### Router Structure
```
App.tsx (Main Router)
├── / → MaintenanceScreen
├── /welcome → HomePage
├── /warungmeng/* → WarungMengRouter
│   └── Handles all WarungMeng routes
├── /yuzha/* → YuzhaRouter
│   └── Handles all Yuzha routes
└── /launcher → YuzhaLauncherScreen (legacy)
```

### File Organization
```
src/
├── warungmeng/
│   ├── WarungMengRouter.tsx (routing logic)
│   ├── WarungMengApp.tsx (main app)
│   ├── MaintenanceScreen.tsx (maintenance)
│   └── index.ts (exports)
├── Yuzha/
│   ├── YuzhaRouter.tsx (routing logic)
│   ├── Launcher/
│   │   └── YuzhaLauncherScreen.tsx
│   └── index.ts (exports)
└── App.tsx (main routing)
```

## Usage Examples

### Adding New WarungMeng Routes
```typescript
// In warungmeng/WarungMengRouter.tsx
<Routes>
  <Route path="/" element={<WarungMengApp />} />
  <Route path="/menu" element={<MenuPage />} />
  <Route path="/admin" element={<AdminPanel />} />
</Routes>
```

### Adding New Yuzha Routes
```typescript
// In Yuzha/YuzhaRouter.tsx
<Routes>
  <Route path="/" element={<YuzhaLauncherScreen />} />
  <Route path="/dashboard" element={<YuzhaDashboard />} />
  <Route path="/apps" element={<YuzhaApps />} />
</Routes>
```

## Testing URLs

### WarungMeng Website
- `https://domain.com/warungmeng` → Cafe website
- `https://domain.com/warungmeng/maintenance` → Website maintenance
- `https://domain.com/warungmeng/home` → Alternative home

### Yuzha Personal App  
- `https://domain.com/yuzha` → Personal launcher
- `https://domain.com/yuzha/launcher` → Launcher interface
- `https://domain.com/yuzha/home` → Alternative home

### System Routes
- `https://domain.com/` → Public maintenance screen
- `https://domain.com/welcome` → Development foundation
- `https://domain.com/launcher` → Direct launcher access (legacy)

## Development Guidelines

1. **Always use nested routes** within each application namespace
2. **Never cross-reference** between WarungMeng and Yuzha components
3. **Maintain independence** - each app should work standalone
4. **Use proper imports** from each application's index files
5. **Follow naming conventions** established in each namespace

This architecture provides maximum flexibility for concurrent development of two completely different applications while maintaining clean separation and scalability.