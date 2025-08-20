//==============================================
// LAUNCHER SETTINGS - CENTRAL EXPORTS
//==============================================
// PHASE 6: Unified launcher module structure - settings system exports
// Central export point for all settings functionality

// ===== SETTINGS MANAGEMENT =====
export { 
  SettingsManager,
  default as Manager 
} from './manager';

// ===== SETTINGS VALIDATION =====
export { 
  SmartValidator,
  default as Validator 
} from './validator';

// ===== PRESETS SYSTEM =====
export { 
  PresetManager,
  default as Presets 
} from './presets';

// ===== SETTINGS UI =====
export { 
  LauncherSettingsUI,
  default as SettingsUI 
} from './ui';

// ===== TYPE DEFINITIONS =====
export * from './types';

// ===== SETTINGS SYSTEM UTILITIES =====
export const SettingsSystem = {
  // Version info
  version: '6.0.0',
  buildDate: '2025-01-20',
  
  // Available tabs
  tabs: [
    'general',
    'appearance', 
    'performance',
    'clock',
    'layers',
    'presets',
    'advanced'
  ],
  
  // System capabilities
  features: {
    persistence: true,
    validation: true,
    presets: true,
    realTimePreview: true,
    importExport: true,
    autoSave: true,
    backups: true,
    recovery: true,
  },
};