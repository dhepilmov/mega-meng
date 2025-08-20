//==============================================
// LAUNCHER TYPES - CENTRAL EXPORTS
//==============================================
// PHASE 6: Unified launcher module structure - type exports
// Central export point for all launcher type definitions

// ===== CORE LAUNCHER TYPES =====
export * from './launcher.types';

// ===== ROTATION SYSTEM TYPES =====
export * from './rotation.types';

// ===== TYPE SYSTEM INFO =====
export const LauncherTypes = {
  version: '6.0.0',
  modules: ['launcher.types', 'rotation.types'],
  features: {
    coreInterfaces: true,
    rotationTypes: true,
    clockTypes: true,
    settingsTypes: true,
  },
};