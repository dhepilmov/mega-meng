//==============================================
// LAUNCHER CORE - CENTRAL EXPORTS
//==============================================
// PHASE 6: Unified launcher module structure - core system exports
// Central export point for all core launcher functionality

// ===== CORE ENGINE =====
export { default as LauncherEngine } from './engine';

// ===== CONFIGURATION MANAGEMENT =====
export { 
  LauncherConfigManager,
  default as ConfigManager 
} from './config-manager';
export type { 
  ConfigValidationResult,
  ConfigManagerOptions 
} from './config-manager';

// ===== DATA PROCESSING =====
export { 
  LauncherDataProcessor,
  default as DataProcessor 
} from './data-processor';
export type { 
  ProcessedRotateItem,
  DataProcessorOptions 
} from './data-processor';

// ===== USER INPUT & GESTURES =====
export { 
  useGestures,
  useBackupClick,
  DEFAULT_GESTURE_CONFIG 
} from './user-input';
export type { 
  GestureState,
  TouchPoint,
  SwipeGesture,
  GestureConfig,
  UseGesturesProps,
  UseBackupClickProps 
} from './user-input';

// ===== CORE UTILITIES =====
export const LauncherCore = {
  // Version info
  version: '6.0.0',
  buildDate: '2025-01-20',
  
  // Module info
  modules: [
    'engine',
    'config-manager', 
    'data-processor',
    'user-input'
  ],
  
  // Feature flags
  features: {
    gestureSupport: true,
    configValidation: true,
    imagePreloading: true,
    performanceMonitoring: true,
    errorRecovery: true,
  },
};