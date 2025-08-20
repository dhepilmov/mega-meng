//==============================================
// LAUNCHER COMPONENTS - CENTRAL EXPORTS
//==============================================
// PHASE 6: Unified launcher module structure - components exports
// Central export point for all launcher components

// ===== UI COMPONENTS =====
export { default as DotMark } from './DotMark';
export { default as ModalOverlay } from './ModalOverlay';
export { default as GestureControls } from './GestureControls';
export { default as TopButtonContainer } from './TopButtonContainer';
export { default as MarkerButton } from './MarkerButton';

// ===== COMPONENTS SYSTEM INFO =====
export const LauncherComponents = {
  version: '6.0.0',
  components: [
    'DotMark',
    'ModalOverlay', 
    'GestureControls',
    'TopButtonContainer',
    'MarkerButton'
  ],
  features: {
    gestureSupport: true,
    modalSystem: true,
    referencePoints: true,
    userInterface: true,
  },
};