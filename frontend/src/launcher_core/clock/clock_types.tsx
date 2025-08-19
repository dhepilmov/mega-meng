//==============================================
// CLOCK-SPECIFIC TYPES
//==============================================
// DETAILED DESCRIPTION:
// Type definitions specific to the clock system including extended clock states,
// layer management types, and animation interfaces.
// TWEAK:
// Add new clock hand types for specialized clock variants.
// Modify animation types for enhanced animation capabilities.
// Extend layer types for additional clock features.

import { ClockState, RotateItemConfig, TimezoneConfig } from '../../types/launcher.types';

// ===== EXTENDED CLOCK INTERFACES =====

export interface ExtendedClockState extends ClockState {
  // Performance metrics
  frameRate?: number;
  deltaTime?: number;
  lastUpdate?: number;
  
  // Animation state
  isAnimating?: boolean;
  animationProgress?: number;
  
  // Error tracking
  errors?: string[];
  lastError?: string;
}

// ===== CLOCK ORCHESTRATOR TYPES =====

export interface ClockOrchestratorConfig {
  updateRate: number;        // Target FPS
  enableSmoothing: boolean;  // Smooth animations
  enableTimezones: boolean;  // Multi-timezone support
  maxLayers: number;         // Maximum layer count
  errorRecovery: boolean;    // Auto error recovery
  performanceMode: 'high' | 'balanced' | 'battery'; // Performance profile
}

export interface LayerClockState {
  layerId: number;
  clockState: ClockState;
  isActive: boolean;
  lastUpdate: number;
  timezone?: TimezoneConfig;
  errors: string[];
  performance: {
    averageFrameTime: number;
    totalFrames: number;
    errorCount: number;
  };
}

// ===== CLOCK LAYER INTERFACES =====

export interface ClockLayerConfig extends RotateItemConfig {
  // Enhanced clock properties
  clockPriority?: number;     // Update priority (1 = highest)
  clockSmoothing?: boolean;   // Enable smooth transitions
  clockAnimation?: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
}

export interface LayerRenderState {
  transform: string;
  opacity: number;
  zIndex: number;
  filters: string[];
  animations: string[];
  isVisible: boolean;
  lastRender: number;
}

// ===== CLOCK ANIMATION TYPES =====

export interface ClockAnimationFrame {
  timestamp: number;
  clockState: ClockState;
  layerStates: Map<number, LayerRenderState>;
  performance: {
    frameTime: number;
    renderTime: number;
    calculationTime: number;
  };
}

export interface AnimationSequence {
  id: string;
  frames: ClockAnimationFrame[];
  duration: number;
  loop: boolean;
  currentFrame: number;
  isPlaying: boolean;
}

// ===== CLOCK HAND EXTENDED TYPES =====

export type ExtendedHandType = 
  | 'hour' 
  | 'minute' 
  | 'second' 
  | 'subsecond'     // Millisecond precision
  | 'day'           // Day of year indicator
  | 'month'         // Month indicator
  | 'year'          // Year indicator (very slow)
  | 'timezone'      // Timezone offset indicator
  | 'custom'        // Custom time-based rotation
  | null;

export interface HandConfiguration {
  type: ExtendedHandType;
  rotation: 'ROTATION1' | 'ROTATION2';
  timezone?: TimezoneConfig;
  customFormula?: string; // For 'custom' type
  precision: 'low' | 'medium' | 'high' | 'ultra';
  smoothing: boolean;
}

// ===== PERFORMANCE TRACKING =====

export interface ClockPerformanceMetrics {
  // Frame rate tracking
  currentFPS: number;
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  
  // Timing measurements
  frameTime: number;
  renderTime: number;
  calculationTime: number;
  
  // Resource usage
  memoryUsage: number;
  activeAnimations: number;
  activeLayers: number;
  
  // Error tracking
  errorRate: number;
  totalErrors: number;
  recoveryCount: number;
  
  // Update statistics
  totalFrames: number;
  skippedFrames: number;
  lastUpdateTime: number;
}

export interface PerformanceThresholds {
  minAcceptableFPS: number;
  maxAcceptableFrameTime: number;
  maxMemoryUsage: number;
  maxErrorRate: number;
}

// ===== CLOCK VALIDATION =====

export interface ClockValidationResult {
  isValid: boolean;
  errors: ClockValidationError[];
  warnings: ClockValidationWarning[];
  performance: {
    estimatedFPS: number;
    memoryEstimate: number;
    complexity: 'low' | 'medium' | 'high' | 'extreme';
  };
}

export interface ClockValidationError {
  type: 'config' | 'performance' | 'compatibility' | 'resource';
  message: string;
  layerId?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestion?: string;
}

export interface ClockValidationWarning {
  type: 'performance' | 'compatibility' | 'deprecation';
  message: string;
  layerId?: number;
  impact: 'minimal' | 'moderate' | 'significant';
  recommendation?: string;
}

// ===== EVENT INTERFACES =====

export interface ClockEvent {
  type: ClockEventType;
  timestamp: number;
  data?: any;
}

export type ClockEventType = 
  | 'stateUpdate'
  | 'layerAdded'
  | 'layerRemoved'
  | 'layerUpdated'
  | 'animationStart'
  | 'animationEnd'
  | 'error'
  | 'performanceWarning'
  | 'timezoneChange'
  | 'configChange';

export interface ClockEventListener {
  type: ClockEventType | 'all';
  callback: (event: ClockEvent) => void;
  once?: boolean;
}

// ===== CLOCK PRESETS =====

export interface ClockPresetDefinition {
  id: string;
  name: string;
  description: string;
  layers: ClockLayerConfig[];
  orchestratorConfig: Partial<ClockOrchestratorConfig>;
  metadata: {
    author?: string;
    version: string;
    created: number;
    updated: number;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  };
}

// ===== TIMEZONE EXTENDED TYPES =====

export interface ExtendedTimezoneConfig extends TimezoneConfig {
  name?: string;              // Timezone name (e.g., "America/New_York")
  abbreviation?: string;      // Timezone abbreviation (e.g., "EST")
  isDST?: boolean;           // Daylight saving time active
  dstOffset?: number;        // Additional DST offset
  autoDetect?: boolean;      // Auto-detect from system
}

// ===== LAYER COMMUNICATION =====

export interface LayerMessage {
  fromLayer: number;
  toLayer: number | 'broadcast';
  type: 'sync' | 'data' | 'command';
  payload: any;
  timestamp: number;
}

export interface LayerSyncState {
  masterLayer?: number;      // Layer that controls sync
  syncEnabled: boolean;
  syncMode: 'time' | 'rotation' | 'position' | 'all';
  participants: number[];    // Layer IDs participating in sync
}

// ===== DEBUGGING AND DEVELOPMENT =====

export interface ClockDebugInfo {
  orchestrator: {
    isRunning: boolean;
    frameRate: number;
    activeLayerCount: number;
    performanceMode: string;
  };
  layers: Array<{
    id: number;
    isActive: boolean;
    handType?: ExtendedHandType;
    currentAngle: number;
    lastUpdate: number;
    errors: number;
  }>;
  performance: ClockPerformanceMetrics;
  system: {
    userAgent: string;
    devicePixelRatio: number;
    hardwareConcurrency: number;
    memory?: any;
  };
}

export interface ClockDiagnostics {
  timestamp: number;
  performance: ClockPerformanceMetrics;
  errors: ClockValidationError[];
  warnings: ClockValidationWarning[];
  suggestions: string[];
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
}

// ===== UTILITY TYPES =====

export type ClockStateProperty = keyof ClockState;
export type OptionalClockState = Partial<ClockState>;
export type RequiredClockState = Required<ClockState>;

export type LayerUpdateCallback = (layerId: number, state: LayerClockState) => void;
export type PerformanceCallback = (metrics: ClockPerformanceMetrics) => void;
export type ErrorCallback = (error: ClockValidationError) => void;

// ===== DEFAULT VALUES =====

export const DEFAULT_CLOCK_ORCHESTRATOR_CONFIG: ClockOrchestratorConfig = {
  updateRate: 60,
  enableSmoothing: true,
  enableTimezones: true,
  maxLayers: 20,
  errorRecovery: true,
  performanceMode: 'balanced',
};

export const DEFAULT_PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  minAcceptableFPS: 30,
  maxAcceptableFrameTime: 33.33, // ~30fps
  maxMemoryUsage: 100 * 1024 * 1024, // 100MB
  maxErrorRate: 0.01, // 1% error rate
};

export const DEFAULT_EXTENDED_TIMEZONE: ExtendedTimezoneConfig = {
  enabled: 'no',
  utcOffset: 0,
  use24Hour: 'yes',
  name: 'UTC',
  abbreviation: 'UTC',
  isDST: false,
  dstOffset: 0,
  autoDetect: false,
};