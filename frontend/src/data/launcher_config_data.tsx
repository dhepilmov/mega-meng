//==============================================
// LAUNCHER CONFIG DATA
//==============================================
// DETAILED DESCRIPTION:
// Default read-only configuration data for the launcher system.
// Contains the initial layer configurations extracted from launcher_screen.tsx.
// This serves as the base configuration that users can modify through the UI.
// TWEAK:
// Modify layer configurations to change default appearance and behavior.
// Add new layers by extending the rotateConfig array.
// Adjust default values for different initial states.

import { RotateItemConfig } from '../types/launcher.types';
import { DEFAULT_ROTATION_CONFIG, DEFAULT_TIMEZONE_CONFIG } from '../launcher_core/clock/clock_defaults';

// ===== BASE ROTATE CONFIG DATA =====

export const rotateConfig: RotateItemConfig[] = [
  // LAYER 1 - Clock Background
  {
    itemCode: 'item_1',
    itemName: 'clockBG',
    itemPath: 'launcher_core/clock/layers_res/clockBG.png',
    itemLayer: 1,
    itemSize: 20,
    itemDisplay: 'yes',
    handType: 'hour',
    handRotation: 'ROTATION1',
    timezone: {
      enabled: 'yes',
      utcOffset: 0,
      use24Hour: 'yes',
    },
    shadow: 'no',
    glow: 'no',
    transparent: 'no',
    pulse: 'no',
    render: 'yes',
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 86400,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 0,
      rotationWay: '',
    },
  },
  
  // LAYER 2 - Minute Hand
  {
    itemCode: 'item_2',
    itemName: 'minuteHand',
    itemPath: 'launcher_core/clock/layers_res/minute_hand.png',
    itemLayer: 2,
    itemSize: 85,
    itemDisplay: 'yes',
    handType: 'minute',
    handRotation: 'ROTATION1',
    timezone: DEFAULT_TIMEZONE_CONFIG,
    shadow: 'no',
    glow: 'no',
    transparent: 'no',
    pulse: 'no',
    render: 'yes',
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 90, // Pivot near bottom
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 3600, // 1 hour
      rotationWay: '+',
    },
    rotation2: DEFAULT_ROTATION_CONFIG,
  },
  
  // LAYER 3 - Hour Hand  
  {
    itemCode: 'item_3',
    itemName: 'hourHand',
    itemPath: 'launcher_core/clock/layers_res/hour_hand.png',
    itemLayer: 3,
    itemSize: 80,
    itemDisplay: 'yes',
    handType: 'hour',
    handRotation: 'ROTATION1',
    timezone: {
      enabled: 'yes',
      utcOffset: 0,
      use24Hour: 'no', // 12-hour mode for traditional hour hand
    },
    shadow: 'no',
    glow: 'no',
    transparent: 'no',
    pulse: 'no',
    render: 'yes',
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 85, // Pivot near bottom
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 43200, // 12 hours
      rotationWay: '+',
    },
    rotation2: DEFAULT_ROTATION_CONFIG,
  },
  
  // LAYER 4 - Second Hand
  {
    itemCode: 'item_4',
    itemName: 'secondHand',
    itemPath: 'launcher_core/clock/layers_res/second_hand.png',
    itemLayer: 4,
    itemSize: 90,
    itemDisplay: 'yes',
    handType: 'second',
    handRotation: 'ROTATION1',
    timezone: DEFAULT_TIMEZONE_CONFIG,
    shadow: 'no',
    glow: 'yes', // Slight glow for second hand
    transparent: 'no',
    pulse: 'no',
    render: 'yes',
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 95, // Pivot at very bottom
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 60, // 1 minute
      rotationWay: '+',
    },
    rotation2: DEFAULT_ROTATION_CONFIG,
  },
  
  // LAYER 5 - Decorative Orbiting Element
  {
    itemCode: 'item_5',
    itemName: 'orbitingDecoration',
    itemPath: 'launcher_core/clock/layers_res/decoration.png',
    itemLayer: 5,
    itemSize: 40,
    itemDisplay: 'no', // Disabled by default
    handType: null,
    handRotation: null,
    timezone: DEFAULT_TIMEZONE_CONFIG,
    shadow: 'no',
    glow: 'yes',
    transparent: 'no',
    pulse: 'yes',
    render: 'yes',
    rotation1: DEFAULT_ROTATION_CONFIG, // No spin
    rotation2: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 0, // Orbit around center (dotmark)
      itemAxisY: 0,
      itemPositionX: 100, // Orbital radius
      itemPositionY: 0,   // Starting at 3 o'clock
      rotationSpeed: 120, // 2 minutes per orbit
      rotationWay: '+',
    },
  },
];

// ===== HELPER FUNCTIONS =====

/**
 * Get default configuration for a specific layer
 */
export const getDefaultLayerConfig = (layerId: number): RotateItemConfig | null => {
  return rotateConfig.find(config => config.itemLayer === layerId) || null;
};

/**
 * Get all default layer configurations
 */
export const getAllDefaultConfigs = (): RotateItemConfig[] => {
  return [...rotateConfig];
};

/**
 * Create expanded configuration with all 20 layers
 */
export const createExpandedConfig = (): RotateItemConfig[] => {
  const expanded: RotateItemConfig[] = [...rotateConfig];
  
  // Add empty layers 6-20 if not present
  for (let i = 6; i <= 20; i++) {
    const existingLayer = expanded.find(config => config.itemLayer === i);
    if (!existingLayer) {
      expanded.push({
        itemCode: `item_${i}`,
        itemName: `Layer ${i}`,
        itemPath: `res/layer_${i}.png`,
        itemLayer: i,
        itemSize: 100,
        itemDisplay: 'no', // Disabled by default
        handType: null,
        handRotation: null,
        timezone: DEFAULT_TIMEZONE_CONFIG,
        shadow: 'no',
        glow: 'no',
        transparent: 'no',
        pulse: 'no',
        render: 'yes',
        rotation1: DEFAULT_ROTATION_CONFIG,
        rotation2: DEFAULT_ROTATION_CONFIG,
      });
    }
  }
  
  // Sort by layer number
  return expanded.sort((a, b) => a.itemLayer - b.itemLayer);
};

/**
 * Get clock hands configuration
 */
export const getClockHandsConfig = (): RotateItemConfig[] => {
  return rotateConfig.filter(config => 
    config.handType && config.handType !== null
  );
};

/**
 * Get decorative elements configuration  
 */
export const getDecorativeConfig = (): RotateItemConfig[] => {
  return rotateConfig.filter(config => 
    !config.handType || config.handType === null
  );
};

/**
 * Validate configuration data integrity
 */
export const validateConfigData = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for duplicate item codes
  const itemCodes = rotateConfig.map(config => config.itemCode);
  const duplicateCodes = itemCodes.filter((code, index) => itemCodes.indexOf(code) !== index);
  if (duplicateCodes.length > 0) {
    errors.push(`Duplicate item codes found: ${duplicateCodes.join(', ')}`);
  }
  
  // Check for duplicate layer numbers
  const layerNumbers = rotateConfig.map(config => config.itemLayer);
  const duplicateNumbers = layerNumbers.filter((num, index) => layerNumbers.indexOf(num) !== index);
  if (duplicateNumbers.length > 0) {
    errors.push(`Duplicate layer numbers found: ${duplicateNumbers.join(', ')}`);
  }
  
  // Check for required fields
  rotateConfig.forEach((config, index) => {
    if (!config.itemCode) {
      errors.push(`Layer ${index + 1} missing item code`);
    }
    if (!config.itemName) {
      errors.push(`Layer ${index + 1} missing item name`);
    }
    if (!config.itemPath) {
      errors.push(`Layer ${index + 1} missing item path`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ===== CONFIGURATION METADATA =====

export const CONFIG_METADATA = {
  version: '1.0.0',
  layerCount: rotateConfig.length,
  maxLayers: 20,
  clockHandCount: getClockHandsConfig().length,
  decorativeCount: getDecorativeConfig().length,
  lastUpdated: new Date().toISOString(),
};

// ===== EXPORT DEFAULT =====

export default rotateConfig;