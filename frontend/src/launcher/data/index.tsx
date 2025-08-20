//==============================================
// LAUNCHER DATA - CENTRAL EXPORTS
//==============================================
// PHASE 6: Unified launcher module structure - data exports
// Central export point for all launcher data sources

// ===== CONFIGURATION DATA =====
export * from './launcher_config_data';

// ===== DATA SYSTEM INFO =====
export const LauncherData = {
  version: '6.0.0',
  modules: ['launcher_config_data'],
  features: {
    defaultConfiguration: true,
    layerDefinitions: true,
    presetConfigurations: true,
  },
};