//==============================================
// LAUNCHER CONSTANTS
//==============================================
// DETAILED DESCRIPTION:
// Core constants for the launcher system including timing, layout, z-index values,
// and magic numbers extracted from the original code. Centralizes configuration
// for easy maintenance and consistent behavior across components.
// TWEAK:
// Adjust timing values to change animation speeds and clock update rates.
// Modify layout constants to change button sizes and positioning.
// Change z-index values to adjust layer stacking order.
// Update validation limits to change acceptable value ranges.

// ===== ANIMATION TIMING =====
export const ANIMATION_CONSTANTS = {
  // Clock update frequency
  CLOCK_UPDATE_RATE: 16.67, // 60fps (1000ms / 60)
  
  // Animation durations (milliseconds)
  SMOOTH_TRANSITION: 300,
  FAST_TRANSITION: 150,
  SLOW_TRANSITION: 600,
  
  // Rotation speeds (seconds per full rotation)
  DEFAULT_ROTATION_SPEED: 86400, // 24 hours
  FAST_ROTATION_SPEED: 3600,     // 1 hour
  SLOW_ROTATION_SPEED: 604800,   // 1 week
} as const;

// ===== LAYOUT CONSTANTS =====
export const LAYOUT_CONSTANTS = {
  // Button dimensions (pixels)
  BUTTON_SIZE: 48,
  BUTTON_PADDING: 12,
  BUTTON_FONT_SIZE: 24,
  
  // Button spacing
  BUTTON_GAP: 12,
  MARGIN_FROM_EDGE: 20,
  
  // Dot mark (center reference point)
  DOT_MARK_SIZE: 8,
  DOT_MARK_OPACITY: 0, // Hidden in production
  
  // Container dimensions
  CONTAINER_MIN_WIDTH: 320,
  CONTAINER_MIN_HEIGHT: 240,
} as const;

// ===== Z-INDEX LAYERS =====
export const Z_INDEX = {
  // Background layers (lowest)
  BACKGROUND: 1,
  CLOCK_LAYERS_START: 10,
  CLOCK_LAYERS_END: 30,
  
  // UI Elements
  DOT_MARK: 1000,
  BUTTONS: 9999,
  MODAL_BACKDROP: 10000,
  MODAL_CONTENT: 10001,
  
  // Overlays (highest)
  DEVELOPMENT_OVERLAY: 99999,
} as const;

// ===== VALIDATION LIMITS =====
export const VALIDATION_LIMITS = {
  // Rotation speeds (seconds)
  ROTATION_SPEED: {
    MIN: 1,        // 1 second minimum
    MAX: 604800,   // 1 week maximum
  },
  
  // Position values (percentage)
  POSITION: {
    MIN: -200,     // Allow positions outside viewport
    MAX: 200,
  },
  
  // Angles (degrees)
  ANGLE: {
    MIN: 0,
    MAX: 360,
  },
  
  // Size scaling (percentage)
  SIZE: {
    MIN: 1,        // Minimum 1% size
    MAX: 1000,     // Maximum 1000% size
  },
  
  // Layer count
  LAYER_COUNT: {
    MIN: 1,
    MAX: 20,
  },
  
  // Timezone offset (hours)
  TIMEZONE_OFFSET: {
    MIN: -12,      // UTC-12
    MAX: 14,       // UTC+14
  },
} as const;

// ===== STORAGE KEYS =====
export const STORAGE_KEYS = {
  LAUNCHER_CONFIG: 'launcher_config_v2',
  SETTINGS: 'launcher_settings_v2',
  PRESETS: 'launcher_presets_v2',
  BACKUPS: 'launcher_backups_v2',
  CACHE: 'launcher_cache_v2',
  USER_PREFERENCES: 'launcher_user_prefs_v2',
} as const;

// ===== SUCCESS/ERROR MESSAGES =====
export const SUCCESS_MESSAGES = {
  CONFIG_SAVED: 'Configuration saved successfully',
  PRESET_CREATED: 'Preset created successfully',
  PRESET_LOADED: 'Preset loaded successfully',
  SETTINGS_UPDATED: 'Settings updated successfully',
  BACKUP_CREATED: 'Backup created successfully',
  IMPORT_SUCCESS: 'Import completed successfully',
  RESET_COMPLETE: 'Settings reset to defaults',
} as const;

export const ERROR_MESSAGES = {
  CONFIG_LOAD_FAILED: 'Failed to load configuration',
  STORAGE_ERROR: 'Storage operation failed',
  VALIDATION_ERROR: 'Validation failed',
  PRESET_NOT_FOUND: 'Preset not found',
  BACKUP_FAILED: 'Backup operation failed',
  IMPORT_FAILED: 'Import operation failed',
  INVALID_DATA: 'Invalid data format',
} as const;

// ===== DEFAULT VALUES =====
export const DEFAULT_VALUES = {
  // Rotation configuration
  ROTATION_SPEED: 86400,     // 24 hours
  ROTATION_DIRECTION: '+',    // Clockwise
  TILT_POSITION: 0,          // No initial tilt
  AXIS_CENTER: 50,           // Center axis (50% from edge)
  
  // Position
  POSITION_X: 0,             // Center position
  POSITION_Y: 0,             // Center position
  
  // Size and effects
  ITEM_SIZE: 100,            // 100% size
  OPACITY: 1,                // Fully opaque
  
  // Timezone
  UTC_OFFSET: 0,             // UTC timezone
  USE_24_HOUR: true,         // 24-hour mode
} as const;

// ===== EFFECT TYPES =====
export const EFFECT_TYPES = {
  SHADOW: 'shadow',
  GLOW: 'glow',
  TRANSPARENT: 'transparent',
  PULSE: 'pulse',
  RENDER: 'render',
} as const;

// ===== HAND TYPES =====
export const HAND_TYPES = {
  HOUR: 'hour',
  MINUTE: 'minute',
  SECOND: 'second',
  NONE: null,
} as const;

// ===== ROTATION TYPES =====
export const ROTATION_TYPES = {
  ROTATION1: 'ROTATION1',    // Spin + positioning
  ROTATION2: 'ROTATION2',    // Orbital system
} as const;

// ===== LAYER PROPERTIES =====
export const LAYER_PROPERTIES = {
  // Item code prefix
  ITEM_CODE_PREFIX: 'item_',
  
  // Default layer names
  DEFAULT_LAYER_NAME: 'Layer',
  
  // Asset path prefix
  ASSET_PATH_PREFIX: 'res/',
  
  // File extensions
  IMAGE_EXTENSIONS: ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
} as const;

// ===== DEVELOPMENT FLAGS =====
export const DEV_FLAGS = {
  // Visual development aids
  SHOW_STROKES: true,        // Show button outlines
  SHOW_DOT_MARK: false,      // Show center reference point
  SHOW_DEBUG_INFO: false,    // Show debug information
  
  // Console logging
  ENABLE_CONSOLE_LOGS: true,
  LOG_ROTATION_CALCS: false,
  LOG_POSITION_CALCS: false,
  
  // Performance monitoring
  MONITOR_PERFORMANCE: false,
  LOG_FRAME_RATES: false,
} as const;

// ===== ERROR MESSAGES =====
export const ERROR_MESSAGES = {
  INVALID_CONFIG: 'Invalid configuration provided',
  MISSING_ASSET: 'Asset file not found',
  STORAGE_ERROR: 'Error accessing local storage',
  CALCULATION_ERROR: 'Error in mathematical calculation',
  RENDER_ERROR: 'Error rendering component',
} as const;

// ===== SUCCESS MESSAGES =====
export const SUCCESS_MESSAGES = {
  CONFIG_SAVED: 'Configuration saved successfully',
  PRESET_CREATED: 'Preset created successfully',
  LAYER_COPIED: 'Layer configuration copied',
  RESET_COMPLETE: 'Reset to defaults complete',
} as const;