//==============================================
// LAUNCHER STYLES - CENTRAL EXPORTS
//==============================================
// PHASE 6: Unified launcher module structure - styles exports
// Central export point for all launcher styles

// ===== MODAL STYLES =====
export * from './modal.styles';

// ===== LAYER STYLES =====
export * from './layer.styles';

// ===== STYLES SYSTEM INFO =====
export const LauncherStyles = {
  version: '6.0.0',
  modules: ['modal.styles', 'layer.styles'],
  features: {
    modalStyling: true,
    layerStyling: true,
    responsiveDesign: true,
    themeSupport: true,
  },
};