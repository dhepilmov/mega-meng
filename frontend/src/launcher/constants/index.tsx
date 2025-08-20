//==============================================
// LAUNCHER CONSTANTS - CENTRAL EXPORTS
//==============================================
// PHASE 6: Unified launcher module structure - constants exports
// Central export point for all launcher constants

// ===== LAUNCHER CONSTANTS =====
export * from './launcher.constants';

// ===== CONSTANTS SYSTEM INFO =====
export const LauncherConstants = {
  version: '6.0.0',
  modules: ['launcher.constants'],
  features: {
    animationConstants: true,
    validationLimits: true,
    layerProperties: true,
    storageKeys: true,
  },
};