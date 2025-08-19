//==============================================
// LAUNCHER CORE MODULE EXPORTS
//==============================================
// Central export point for all launcher core modules

// Core managers
export { LauncherConfigManager } from './launcher_core_config_manager';
export { LauncherDataProcessor } from './launcher_core_data_processor';

// User input system
export { useGestures, useBackupClick } from './launcher_core_user_input';
export type { 
  GestureState, 
  GestureConfig, 
  GestureControls,
  UseGesturesReturn,
  UseBackupClickReturn 
} from './launcher_core_user_input';

// Clock system
export { useClockOrchestrator } from './clock/clock_orchestrator';
export { ClockLayer01 } from './clock/layers/clock_layer_01';
export { 
  createSafeLayerConfig,
  createDefaultLayerSet,
  LAYER_TEMPLATES,
  DEFAULT_LAYER_CONFIG 
} from './clock/clock_defaults';

// Re-export types for convenience
export type { 
  RotateItemConfig, 
  ClockState, 
  ExtendedClockState 
} from '../types/launcher.types';