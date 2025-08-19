//==============================================
// LAUNCHER TYPE DEFINITIONS
//==============================================
// DETAILED DESCRIPTION:
// Core interfaces and type definitions for the launcher system.
// Includes configuration interfaces, state management types, and component props.
// Central location for type safety across the entire launcher application.
// TWEAK:
// Add new interface properties to extend configuration capabilities.
// Modify union types to add new valid values.
// Change optional properties (?) to required or vice versa.
// Add generic types for enhanced type safety.

// ===== ROTATION SYSTEM TYPES =====

export interface RotationConfig {
  enabled: 'yes' | 'no' | null;
  itemTiltPosition: number;          // Initial rotation angle in degrees (0-359)
  itemAxisX: number;                 // Rotation axis X position from image center (0-100%)
  itemAxisY: number;                 // Rotation axis Y position from image center (0-100%)
  itemPositionX: number;             // Horizontal offset from dot mark center (-100 to +100%)
  itemPositionY: number;             // Vertical offset from dot mark center (-100 to +100%)
  rotationSpeed: number;             // Seconds for one complete rotation (> 0)
  rotationWay: '+' | '-' | 'no' | '' | null; // + clockwise, - anti-clockwise, no/empty = no rotate
}

// ===== TIMEZONE CONFIGURATION =====

export interface TimezoneConfig {
  enabled: 'yes' | 'no';            // Enable timezone offset calculation
  utcOffset: number;                // UTC offset in hours (e.g., +9, -5, +0)
  use24Hour: 'yes' | 'no';         // 1 rotation per 24 hours or 2 rotations per 24 hours
}

// ===== ITEM CONFIGURATION =====

export interface RotateItemConfig {
  // Basic Properties
  itemCode: string;                  // Unique identifier for the item (item_1 to item_20)
  itemName: string;                  // Display name or PNG filename without extension
  itemPath: string;                  // File path relative to res/ folder
  itemLayer: number;                 // Layer order (1-20, higher = on top)
  itemSize: number;                  // Scale percentage (1-1000%)
  itemDisplay: 'yes' | 'no' | '';    // Controls whether PNG is displayed or hidden
  
  // Clock Hand Configuration
  handType?: 'hour' | 'minute' | 'second' | null;
  handRotation?: 'ROTATION1' | 'ROTATION2' | null;
  timezone?: TimezoneConfig | null;
  
  // Visual Effects
  shadow: 'yes' | 'no';              // Drop shadow effect
  glow: 'yes' | 'no';                // Glow/halo effect
  transparent: 'yes' | 'no';         // Transparency effect
  pulse: 'yes' | 'no';               // Pulse animation effect
  render: 'yes' | 'no';              // Final render toggle
  
  // Dual Rotation System
  rotation1: RotationConfig;          // Spin rotation + positioning
  rotation2: RotationConfig;          // Orbital rotation system
}

// ===== CLOCK STATE =====

export interface ClockState {
  /** 24-hour hand angle (noon = 0°, clockwise) */
  hourAngle: number;
  /** Minute hand angle (0-360°) */
  minuteAngle: number;  
  /** Second hand angle (0-360°) */
  secondAngle: number;
  /** Current timestamp for calculations */
  timestamp?: number;
}

// ===== LAUNCHER STATE MANAGEMENT =====

export interface LauncherSettings {
  theme: 'light' | 'dark' | 'auto';
  showDebugInfo: boolean;
  enableAnimations: boolean;
  clockUpdateRate: number;
  autoSave: boolean;
}

export interface LauncherFile {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  data?: any;
}

export interface LauncherState {
  isLoading: boolean;
  settings: LauncherSettings;
  files: LauncherFile[];
  currentConfig?: RotateItemConfig[];
  error?: string;
}

// ===== PRESET MANAGEMENT =====

export interface PresetInfo {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  isDefault?: boolean;
}

export interface LayerPreset extends PresetInfo {
  config: RotateItemConfig;
}

export interface SystemPreset extends PresetInfo {
  config: RotateItemConfig[];
}

// ===== COMPONENT PROPS =====

export interface DotMarkProps {
  visible?: boolean;
  size?: number;
  color?: string;
  opacity?: number;
}

export interface MarkerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'close' | 'new' | 'default';
  showStroke?: boolean;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export interface TopButtonContainerProps {
  children: React.ReactNode;
  showStroke?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export interface LayerComponentProps {
  config: RotateItemConfig;
  clockState: ClockState;
  containerSize: { width: number; height: number };
  onConfigChange?: (config: RotateItemConfig) => void;
  debugMode?: boolean;
}

// ===== SETTINGS & MODAL TYPES =====

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnEscKey?: boolean;
  closeOnOverlayClick?: boolean;
}

export interface SettingsModalProps extends ModalProps {
  currentConfig: RotateItemConfig[];
  onConfigSave: (config: RotateItemConfig[]) => void;
  onPresetSave?: (preset: SystemPreset) => void;
  onPresetLoad?: (presetId: string) => void;
}

export interface LayerSettingsProps {
  layer: RotateItemConfig;
  onUpdate: (layer: RotateItemConfig) => void;
  onCopy?: (layer: RotateItemConfig) => void;
  onReset?: () => void;
  availableLayers?: RotateItemConfig[];
}

// ===== VALIDATION & ERROR HANDLING =====

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConfigValidation extends ValidationResult {
  config?: RotateItemConfig;
}

export interface SystemValidation extends ValidationResult {
  configs?: RotateItemConfig[];
}

// ===== HOOK RETURN TYPES =====

export interface UseClockReturn extends ClockState {
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export interface UseLauncherReturn extends LauncherState {
  updateSettings: (settings: Partial<LauncherSettings>) => void;
  addFile: (file: LauncherFile) => void;
  removeFile: (fileId: string) => void;
  clearAllData: () => void;
  saveConfig: (config: RotateItemConfig[]) => void;
  loadConfig: () => RotateItemConfig[] | null;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  remove: () => void;
  clear: () => void;
}

// ===== UTILITY TYPES =====

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ===== EVENT HANDLERS =====

export type ConfigChangeHandler = (config: RotateItemConfig) => void;
export type LayerChangeHandler = (layerId: number, config: RotateItemConfig) => void;
export type PresetHandler = (preset: LayerPreset | SystemPreset) => void;
export type ErrorHandler = (error: string | Error) => void;

// ===== ANIMATION TYPES =====

export interface AnimationState {
  isAnimating: boolean;
  progress: number;
  startTime: number;
  duration: number;
}

export interface TransformState {
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  opacity: number;
}

// ===== DEFAULT VALUES =====

export const DEFAULT_ROTATION_CONFIG: RotationConfig = {
  enabled: 'no',
  itemTiltPosition: 0,
  itemAxisX: 50,
  itemAxisY: 50,
  itemPositionX: 0,
  itemPositionY: 0,
  rotationSpeed: 86400, // 24 hours
  rotationWay: '+',
};

export const DEFAULT_TIMEZONE_CONFIG: TimezoneConfig = {
  enabled: 'no',
  utcOffset: 0,
  use24Hour: 'yes',
};

export const DEFAULT_LAUNCHER_SETTINGS: LauncherSettings = {
  theme: 'auto',
  showDebugInfo: false,
  enableAnimations: true,
  clockUpdateRate: 60, // FPS
  autoSave: true,
};