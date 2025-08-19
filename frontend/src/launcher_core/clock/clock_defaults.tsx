//==============================================
// CLOCK DEFAULTS
//==============================================
// DETAILED DESCRIPTION:
// Default configurations and fallback systems for the clock layers.
// Provides safe defaults for all layer properties and error recovery.
// Serves as the foundation for layer initialization and validation.
// TWEAK:
// Modify DEFAULT_LAYER_CONFIG for different default behaviors.
// Adjust fallback values in createSafeLayerConfig function.
// Change error recovery patterns for different resilience strategies.
// Update validation rules for stricter or more lenient validation.

import { RotateItemConfig, RotationConfig, TimezoneConfig, ClockState } from '../../types/launcher.types';
import { VALIDATION_LIMITS, DEFAULT_VALUES, LAYER_PROPERTIES } from '../../constants/launcher.constants';
import { safeNumber, safeString, isValidRotateItemConfig } from '../../utils/safeAccessors';

// ===== DEFAULT CONFIGURATIONS =====

export const DEFAULT_ROTATION_CONFIG: RotationConfig = {
  enabled: 'no',
  itemTiltPosition: DEFAULT_VALUES.TILT_POSITION,
  itemAxisX: DEFAULT_VALUES.AXIS_CENTER,
  itemAxisY: DEFAULT_VALUES.AXIS_CENTER,
  itemPositionX: DEFAULT_VALUES.POSITION_X,
  itemPositionY: DEFAULT_VALUES.POSITION_Y,
  rotationSpeed: DEFAULT_VALUES.ROTATION_SPEED,
  rotationWay: DEFAULT_VALUES.ROTATION_DIRECTION as any,
};

export const DEFAULT_TIMEZONE_CONFIG: TimezoneConfig = {
  enabled: 'no',
  utcOffset: DEFAULT_VALUES.UTC_OFFSET,
  use24Hour: DEFAULT_VALUES.USE_24_HOUR ? 'yes' : 'no',
};

export const DEFAULT_LAYER_CONFIG: RotateItemConfig = {
  // Basic properties
  itemCode: 'default_layer',
  itemName: 'Default Layer',
  itemPath: `${LAYER_PROPERTIES.ASSET_PATH_PREFIX}default.png`,
  itemLayer: 1,
  itemSize: DEFAULT_VALUES.ITEM_SIZE,
  itemDisplay: 'yes',
  
  // Clock configuration
  handType: null,
  handRotation: null,
  timezone: DEFAULT_TIMEZONE_CONFIG,
  
  // Effects
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // Rotations
  rotation1: { ...DEFAULT_ROTATION_CONFIG },
  rotation2: { ...DEFAULT_ROTATION_CONFIG },
};

// ===== LAYER TEMPLATES =====

export const LAYER_TEMPLATES = {
  // Background layer template
  background: {
    ...DEFAULT_LAYER_CONFIG,
    itemCode: 'background',
    itemName: 'Background',
    itemPath: `${LAYER_PROPERTIES.ASSET_PATH_PREFIX}clockBG.png`,
    itemLayer: 1,
    itemSize: 120,
    shadow: 'no',
    glow: 'no',
  },
  
  // Hour hand template
  hourHand: {
    ...DEFAULT_LAYER_CONFIG,
    itemCode: 'hour_hand',
    itemName: 'Hour Hand',
    itemPath: `${LAYER_PROPERTIES.ASSET_PATH_PREFIX}hour_hand.png`,
    itemLayer: 10,
    itemSize: 80,
    handType: 'hour' as const,
    handRotation: 'ROTATION1' as const,
    timezone: { ...DEFAULT_TIMEZONE_CONFIG, enabled: 'yes' as const },
    rotation1: {
      ...DEFAULT_ROTATION_CONFIG,
      enabled: 'yes',
      itemAxisX: 50,
      itemAxisY: 90, // Pivot near bottom of hand
    },
  },
  
  // Minute hand template
  minuteHand: {
    ...DEFAULT_LAYER_CONFIG,
    itemCode: 'minute_hand',
    itemName: 'Minute Hand',
    itemPath: `${LAYER_PROPERTIES.ASSET_PATH_PREFIX}minute_hand.png`,
    itemLayer: 11,
    itemSize: 85,
    handType: 'minute' as const,
    handRotation: 'ROTATION1' as const,
    rotation1: {
      ...DEFAULT_ROTATION_CONFIG,
      enabled: 'yes',
      itemAxisX: 50,
      itemAxisY: 95, // Pivot near bottom of hand
    },
  },
  
  // Second hand template
  secondHand: {
    ...DEFAULT_LAYER_CONFIG,
    itemCode: 'second_hand',
    itemName: 'Second Hand',
    itemPath: `${LAYER_PROPERTIES.ASSET_PATH_PREFIX}second_hand.png`,
    itemLayer: 12,
    itemSize: 90,
    handType: 'second' as const,
    handRotation: 'ROTATION1' as const,
    rotation1: {
      ...DEFAULT_ROTATION_CONFIG,
      enabled: 'yes',
      itemAxisX: 50,
      itemAxisY: 95, // Pivot near bottom of hand
    },
  },
  
  // Decorative orbiting element template
  orbiting: {
    ...DEFAULT_LAYER_CONFIG,
    itemCode: 'orbiting_element',
    itemName: 'Orbiting Element',
    itemPath: `${LAYER_PROPERTIES.ASSET_PATH_PREFIX}decoration.png`,
    itemLayer: 5,
    itemSize: 40,
    glow: 'yes',
    pulse: 'yes',
    rotation1: { ...DEFAULT_ROTATION_CONFIG }, // No spin
    rotation2: {
      ...DEFAULT_ROTATION_CONFIG,
      enabled: 'yes',
      rotationSpeed: 120, // 2 minutes per orbit
      itemPositionX: 80, // Orbital radius
      itemPositionY: 0,  // Starting position
    },
  },
} as const;

// ===== VALIDATION AND SANITIZATION =====

/**
 * Create a safe layer configuration with validated values
 */
export const createSafeLayerConfig = (
  input: Partial<RotateItemConfig>,
  layerId?: number
): RotateItemConfig => {
  const safe: RotateItemConfig = {
    // Basic properties with validation
    itemCode: safeString(input.itemCode, `${LAYER_PROPERTIES.ITEM_CODE_PREFIX}${layerId || 1}`),
    itemName: safeString(input.itemName, `${LAYER_PROPERTIES.DEFAULT_LAYER_NAME} ${layerId || 1}`),
    itemPath: safeString(input.itemPath, `${LAYER_PROPERTIES.ASSET_PATH_PREFIX}default.png`),
    itemLayer: safeNumber(input.itemLayer, layerId || 1, VALIDATION_LIMITS.LAYER_COUNT.MIN, VALIDATION_LIMITS.LAYER_COUNT.MAX),
    itemSize: safeNumber(input.itemSize, DEFAULT_VALUES.ITEM_SIZE, VALIDATION_LIMITS.SIZE.MIN, VALIDATION_LIMITS.SIZE.MAX),
    itemDisplay: input.itemDisplay === 'yes' || input.itemDisplay === 'no' ? input.itemDisplay : 'yes',
    
    // Clock configuration
    handType: input.handType || null,
    handRotation: input.handRotation || null,
    timezone: input.timezone ? sanitizeTimezoneConfig(input.timezone) : { ...DEFAULT_TIMEZONE_CONFIG },
    
    // Effects
    shadow: input.shadow === 'yes' || input.shadow === 'no' ? input.shadow : 'no',
    glow: input.glow === 'yes' || input.glow === 'no' ? input.glow : 'no',
    transparent: input.transparent === 'yes' || input.transparent === 'no' ? input.transparent : 'no',
    pulse: input.pulse === 'yes' || input.pulse === 'no' ? input.pulse : 'no',
    render: input.render === 'yes' || input.render === 'no' ? input.render : 'yes',
    
    // Rotations
    rotation1: input.rotation1 ? sanitizeRotationConfig(input.rotation1) : { ...DEFAULT_ROTATION_CONFIG },
    rotation2: input.rotation2 ? sanitizeRotationConfig(input.rotation2) : { ...DEFAULT_ROTATION_CONFIG },
  };
  
  return safe;
};

/**
 * Sanitize rotation configuration
 */
export const sanitizeRotationConfig = (input: Partial<RotationConfig>): RotationConfig => ({
  enabled: input.enabled === 'yes' || input.enabled === 'no' ? input.enabled : 'no',
  itemTiltPosition: safeNumber(input.itemTiltPosition, 0, VALIDATION_LIMITS.ANGLE.MIN, VALIDATION_LIMITS.ANGLE.MAX),
  itemAxisX: safeNumber(input.itemAxisX, 50, 0, 100),
  itemAxisY: safeNumber(input.itemAxisY, 50, 0, 100),
  itemPositionX: safeNumber(input.itemPositionX, 0, VALIDATION_LIMITS.POSITION.MIN, VALIDATION_LIMITS.POSITION.MAX),
  itemPositionY: safeNumber(input.itemPositionY, 0, VALIDATION_LIMITS.POSITION.MIN, VALIDATION_LIMITS.POSITION.MAX),
  rotationSpeed: safeNumber(input.rotationSpeed, DEFAULT_VALUES.ROTATION_SPEED, VALIDATION_LIMITS.ROTATION_SPEED.MIN, VALIDATION_LIMITS.ROTATION_SPEED.MAX),
  rotationWay: input.rotationWay === '+' || input.rotationWay === '-' || input.rotationWay === 'no' || input.rotationWay === '' ? 
    input.rotationWay : 'no',
});

/**
 * Sanitize timezone configuration
 */
export const sanitizeTimezoneConfig = (input: Partial<TimezoneConfig>): TimezoneConfig => ({
  enabled: input.enabled === 'yes' || input.enabled === 'no' ? input.enabled : 'no',
  utcOffset: safeNumber(input.utcOffset, 0, VALIDATION_LIMITS.TIMEZONE_OFFSET.MIN, VALIDATION_LIMITS.TIMEZONE_OFFSET.MAX),
  use24Hour: input.use24Hour === 'yes' || input.use24Hour === 'no' ? input.use24Hour : 'yes',
});

// ===== LAYER FACTORY FUNCTIONS =====

/**
 * Create a complete set of 20 default layers
 */
export const createDefaultLayerSet = (): RotateItemConfig[] => {
  const layers: RotateItemConfig[] = [];
  
  for (let i = 1; i <= VALIDATION_LIMITS.LAYER_COUNT.MAX; i++) {
    let template: RotateItemConfig;
    
    // Assign templates based on layer number
    switch (i) {
      case 1:
        template = LAYER_TEMPLATES.background;
        break;
      case 10:
        template = LAYER_TEMPLATES.hourHand;
        break;
      case 11:
        template = LAYER_TEMPLATES.minuteHand;
        break;
      case 12:
        template = LAYER_TEMPLATES.secondHand;
        break;
      case 5:
        template = LAYER_TEMPLATES.orbiting;
        break;
      default:
        template = DEFAULT_LAYER_CONFIG;
    }
    
    layers.push(createSafeLayerConfig({
      ...template,
      itemCode: `${LAYER_PROPERTIES.ITEM_CODE_PREFIX}${i}`,
      itemName: `${LAYER_PROPERTIES.DEFAULT_LAYER_NAME} ${i}`,
      itemLayer: i,
      itemDisplay: i <= 5 ? 'yes' : 'no', // Only first 5 layers visible by default
    }, i));
  }
  
  return layers;
};

/**
 * Get layer configuration by layer ID
 */
export const getLayerById = (layers: RotateItemConfig[], layerId: number): RotateItemConfig | null => {
  return layers.find(layer => layer.itemLayer === layerId) || null;
};

/**
 * Get layer configuration by item code
 */
export const getLayerByCode = (layers: RotateItemConfig[], itemCode: string): RotateItemConfig | null => {
  return layers.find(layer => layer.itemCode === itemCode) || null;
};

/**
 * Validate a complete layer configuration
 */
export const validateLayerConfig = (config: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!isValidRotateItemConfig(config)) {
    errors.push('Invalid layer configuration structure');
  }
  
  // Additional validation rules can be added here
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ===== DEFAULT CLOCK STATE =====

export const DEFAULT_CLOCK_STATE: ClockState = {
  hourAngle: 0,
  minuteAngle: 0,
  secondAngle: 0,
  timestamp: Date.now(),
};

// ===== EMERGENCY FALLBACK =====

/**
 * Emergency fallback configuration when all else fails
 */
export const EMERGENCY_FALLBACK_CONFIG: RotateItemConfig = {
  itemCode: 'emergency_fallback',
  itemName: 'Emergency Fallback',
  itemPath: '', // Empty path prevents rendering
  itemLayer: 1,
  itemSize: 100,
  itemDisplay: 'no', // Disabled by default
  handType: null,
  handRotation: null,
  timezone: { ...DEFAULT_TIMEZONE_CONFIG },
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'no',
  rotation1: { ...DEFAULT_ROTATION_CONFIG },
  rotation2: { ...DEFAULT_ROTATION_CONFIG },
};