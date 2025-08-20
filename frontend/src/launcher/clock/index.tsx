//==============================================
// CLOCK SYSTEM - CENTRAL EXPORTS
//==============================================
// PHASE 6: Unified launcher module structure - clock system exports
// Central export point for all clock system functionality

// ===== MAIN ORCHESTRATOR =====
export { 
  useClockOrchestrator,
  default as ClockOrchestrator 
} from './orchestrator';
export type { ExtendedClockState } from './orchestrator';

// ===== CLOCK UTILITIES =====
export * from './utils';
export * from './animations';
export * from './defaults';
export * from './types';
export * from './config-processor';

// ===== ALL LAYER EXPORTS =====
export { default as ClockLayer01 } from './layers/layer-01';
export { default as ClockLayer02 } from './layers/layer-02';
export { default as ClockLayer03 } from './layers/layer-03';
export { default as ClockLayer04 } from './layers/layer-04';
export { default as ClockLayer05 } from './layers/layer-05';
export { default as ClockLayer06 } from './layers/layer-06';
export { default as ClockLayer07 } from './layers/layer-07';
export { default as ClockLayer08 } from './layers/layer-08';
export { default as ClockLayer09 } from './layers/layer-09';
export { default as ClockLayer10 } from './layers/layer-10';
export { default as ClockLayer11 } from './layers/layer-11';
export { default as ClockLayer12 } from './layers/layer-12';
export { default as ClockLayer13 } from './layers/layer-13';
export { default as ClockLayer14 } from './layers/layer-14';
export { default as ClockLayer15 } from './layers/layer-15';
export { default as ClockLayer16 } from './layers/layer-16';
export { default as ClockLayer17 } from './layers/layer-17';
export { default as ClockLayer18 } from './layers/layer-18';
export { default as ClockLayer19 } from './layers/layer-19';
export { default as ClockLayer20 } from './layers/layer-20';
export { default as ClockLayerDefault } from './layers/layer-default';

// ===== CLOCK SYSTEM UTILITIES =====
export const ClockSystem = {
  // Version info
  version: '6.0.0',
  layerCount: 20,
  
  // Available layers
  layers: Array.from({ length: 20 }, (_, i) => `layer-${String(i + 1).padStart(2, '0')}`),
  
  // System capabilities
  features: {
    dualRotation: true,
    clockHands: true,
    timezones: true,
    orbitalMechanics: true,
    visualEffects: true,
    performanceMonitoring: true,
  },
};