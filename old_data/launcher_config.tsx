//==============================================
// IMPORT SECTION
//==============================================
//DETAILED DESCRIPTION:
//This section contains all imports and type definitions needed for launcher configuration.
//Defines interfaces for rotation settings, timezone configurations, and item properties.
//Used throughout the launcher system for type safety and configuration validation.
//TWEAK:
//Add new import statements here when extending configuration capabilities.
//Modify interface properties to add new configuration options.
//Change default values in interfaces to adjust fallback behavior.

// No external imports needed - this is a pure configuration file

//==============================================
// DEFAULT CONFIG SECTION  
//==============================================
//DETAILED DESCRIPTION:
//Core configuration interfaces and default values for the launcher system.
//RotationConfig defines individual rotation behavior (speed, direction, positioning).
//TimezoneConfig handles timezone-aware clock hands with UTC offset support.
//RotateItemConfig represents complete item configuration including effects and clock integration.
//TWEAK:
//Modify interface properties to add new configuration capabilities.
//Change default values to adjust system-wide fallback behavior.
//Add new effect types by extending effect property unions.
//Adjust rotation speed ranges or add new rotation modes.

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

export interface TimezoneConfig {
  enabled: 'yes' | 'no';            // Enable timezone offset calculation
  utcOffset: number;                // UTC offset in hours (e.g., +9, -5, +0)
  use24Hour: 'yes' | 'no';         // 1 rotation per 24 hours or 2 rotations per 24 hours
}

export interface RotateItemConfig {
  // BASIC PROPERTIES
  itemCode: string;                  // Unique identifier for the item (item_1 to item_20)
  itemName: string;                  // PNG filename without extension
  itemPath: string;                  // File path relative to res/ folder
  itemLayer: number;                 // Z-index layer position (1-20 sequential numbers)
  itemSize: number;                  // Size percentage from its own center (1-100)
  itemDisplay: 'yes' | 'no' | '';   // Controls whether PNG is displayed or hidden
  
  // CLOCK HAND CONFIGURATION
  handType?: 'hour' | 'minute' | 'second' | null;     // Type of clock hand
  handRotation?: 'ROTATION1' | 'ROTATION2' | null;    // Which rotation to use for clock
  // When handType is set, clock logic overrides the specified rotation
  
  // TIMEZONE (only for hour hands)
  timezone?: TimezoneConfig | null;
  
  // VISUAL EFFECTS
  shadow: 'yes' | 'no';             // Drop shadow effect around item
  glow: 'yes' | 'no';               // Glow effect around item
  transparent: 'yes' | 'no';        // Transparency/opacity effect
  pulse: 'yes' | 'no';              // Pulsing animation effect
  render: 'yes' | 'no';             // Enable/disable rendering of effects
  
  // ROTATION CONFIGURATION
  rotation1: RotationConfig;         // Primary rotation settings
  rotation2: RotationConfig;         // Secondary rotation settings
}

// Default rotation configuration template
const defaultRotationConfig: RotationConfig = {
  enabled: 'no',
  itemTiltPosition: 0,
  itemAxisX: 50,
  itemAxisY: 50,
  itemPositionX: 0,
  itemPositionY: 0,
  rotationSpeed: 0,
  rotationWay: '',
};

// Default timezone configuration template
const defaultTimezoneConfig: TimezoneConfig = {
  enabled: 'yes',
  utcOffset: 0,
  use24Hour: 'yes',
};

// Default item configuration template
const defaultItemConfig: Partial<RotateItemConfig> = {
  itemLayer: 1,
  itemSize: 20,
  itemDisplay: 'no',
  handType: null,
  handRotation: null,
  timezone: null,
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
};

//==============================================
// LAYERS CONFIG SECTION
//==============================================
//DETAILED DESCRIPTION:
//Individual configuration for each launcher layer (1-20). Each layer can contain rotating items,
//clock hands with timezone support, visual effects, and custom positioning. Layers are rendered
//in order with higher numbers appearing on top. Clock hands use real-time calculations while
//decorative items use CSS animations. Items with itemDisplay: 'yes' are visible and active.
//TWEAK:
//Change itemDisplay from 'no' to 'yes' to make layers visible.
//Modify itemSize (20 = 20% of screen) to adjust item scaling.
//Adjust itemLayer numbers to change rendering order and z-index.
//Change handType to 'hour'/'minute'/'second' to make items clock hands.
//Modify timezone utcOffset to display different time zones (-12 to +12 hours).
//Adjust rotationSpeed (86400 = 24 hours) for different rotation timing.

// LAYER 1 - Background Clock Face
const layer1Config: RotateItemConfig = {
  itemCode: 'item_1',
  itemName: 'clockBG',
  itemPath: 'res/clockBG.png',
  itemLayer: 1,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - UTC (London/Greenwich)
  timezone: {
    enabled: 'yes',
    utcOffset: 0,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
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
};

// LAYER 2 - Minutes Circle (Berlin Time)
const layer2Config: RotateItemConfig = {
  itemCode: 'item_2',
  itemName: 'minutes_circle',
  itemPath: 'res/minutes_circle.png',
  itemLayer: 2,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - CET/CEST (Berlin/Paris)
  timezone: {
    enabled: 'yes',
    utcOffset: 1,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
    rotationWay: '+',
  },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 3 - Hours Circle (Moscow Time)
const layer3Config: RotateItemConfig = {
  itemCode: 'item_3',
  itemName: 'hours_circle',
  itemPath: 'res/hours_circle.png',
  itemLayer: 3,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - MSK (Moscow)
  timezone: {
    enabled: 'yes',
    utcOffset: 3,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
    rotationWay: '+',
  },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 4 - Dubai Time
const layer4Config: RotateItemConfig = {
  itemCode: 'item_4',
  itemName: 'dummy (4)',
  itemPath: 'res/dummy (4).png',
  itemLayer: 4,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - GST (Dubai/UAE)
  timezone: {
    enabled: 'yes',
    utcOffset: 4,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
    rotationWay: '+',
  },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 5 - India Time
const layer5Config: RotateItemConfig = {
  itemCode: 'item_5',
  itemName: 'dummy (5)',
  itemPath: 'res/dummy (5).png',
  itemLayer: 5,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - IST (India Standard Time)
  timezone: {
    enabled: 'yes',
    utcOffset: 5.5,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
    rotationWay: '+',
  },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 6 - Bangladesh Time
const layer6Config: RotateItemConfig = {
  itemCode: 'item_6',
  itemName: 'dummy (6)',
  itemPath: 'res/dummy (6).png',
  itemLayer: 6,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - BST (Bangladesh Standard Time)
  timezone: {
    enabled: 'yes',
    utcOffset: 6,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
    rotationWay: '+',
  },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 7 - Thailand Time
const layer7Config: RotateItemConfig = {
  itemCode: 'item_7',
  itemName: 'dummy (7)',
  itemPath: 'res/dummy (7).png',
  itemLayer: 7,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - ICT (Indochina Time - Thailand/Vietnam)
  timezone: {
    enabled: 'yes',
    utcOffset: 7,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
    rotationWay: '+',
  },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 8 - China Time  
const layer8Config: RotateItemConfig = {
  itemCode: 'item_8',
  itemName: 'dummy (8)',
  itemPath: 'res/dummy (8).png',
  itemLayer: 8,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - CST (China Standard Time)
  timezone: {
    enabled: 'yes',
    utcOffset: 8,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
    rotationWay: '+',
  },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 9 - Japan Time
const layer9Config: RotateItemConfig = {
  itemCode: 'item_9',
  itemName: 'dummy (9)',
  itemPath: 'res/dummy (9).png',
  itemLayer: 9,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - JST (Japan Standard Time)
  timezone: {
    enabled: 'yes',
    utcOffset: 9,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
    rotationWay: '+',
  },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 10 - Australia Time
const layer10Config: RotateItemConfig = {
  itemCode: 'item_10',
  itemName: 'dummy (10)',
  itemPath: 'res/dummy (10).png',
  itemLayer: 10,
  itemSize: 20,
  itemDisplay: 'yes',
  
  // CLOCK HAND CONFIGURATION
  handType: 'hour',
  handRotation: 'ROTATION1',
  
  // TIMEZONE - AEST (Australian Eastern Standard Time)
  timezone: {
    enabled: 'yes',
    utcOffset: 10,
    use24Hour: 'yes',
  },
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: {
    enabled: 'yes',
    itemTiltPosition: 0,
    itemAxisX: 50,
    itemAxisY: 50,
    itemPositionX: 0,
    itemPositionY: 0,
    rotationSpeed: 86400, // 24 hours per rotation
    rotationWay: '+',
  },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 11 - Reserved Layer (Hidden)
const layer11Config: RotateItemConfig = {
  itemCode: 'item_11',
  itemName: 'dummy (11)',
  itemPath: 'res/dummy (11).png',
  itemLayer: 11,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 12 - Reserved Layer (Hidden)
const layer12Config: RotateItemConfig = {
  itemCode: 'item_12',
  itemName: 'dummy (12)',
  itemPath: 'res/dummy (12).png',
  itemLayer: 12,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 13 - Reserved Layer (Hidden)
const layer13Config: RotateItemConfig = {
  itemCode: 'item_13',
  itemName: 'dummy (13)',
  itemPath: 'res/dummy (13).png',
  itemLayer: 13,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 14 - Reserved Layer (Hidden)
const layer14Config: RotateItemConfig = {
  itemCode: 'item_14',
  itemName: 'dummy (14)',
  itemPath: 'res/dummy (14).png',
  itemLayer: 14,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 15 - Reserved Layer (Hidden)
const layer15Config: RotateItemConfig = {
  itemCode: 'item_15',
  itemName: 'dummy (15)',
  itemPath: 'res/dummy (15).png',
  itemLayer: 15,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 16 - Reserved Layer (Hidden)
const layer16Config: RotateItemConfig = {
  itemCode: 'item_16',
  itemName: 'dummy (16)',
  itemPath: 'res/dummy (16).png',
  itemLayer: 16,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 17 - Reserved Layer (Hidden)
const layer17Config: RotateItemConfig = {
  itemCode: 'item_17',
  itemName: 'dummy (17)',
  itemPath: 'res/dummy (17).png',
  itemLayer: 17,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 18 - Reserved Layer (Hidden)
const layer18Config: RotateItemConfig = {
  itemCode: 'item_18',
  itemName: 'dummy (18)',
  itemPath: 'res/dummy (18).png',
  itemLayer: 18,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 19 - Reserved Layer (Hidden)
const layer19Config: RotateItemConfig = {
  itemCode: 'item_19',
  itemName: 'dummy (19)',
  itemPath: 'res/dummy (19).png',
  itemLayer: 19,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

// LAYER 20 - Reserved Layer (Hidden)
const layer20Config: RotateItemConfig = {
  itemCode: 'item_20',
  itemName: 'dummy (20)',
  itemPath: 'res/dummy (20).png',
  itemLayer: 20,
  itemSize: 20,
  itemDisplay: 'no', // Hidden by default
  
  // CLOCK HAND CONFIGURATION
  handType: null,
  handRotation: null,
  
  // TIMEZONE
  timezone: null,
  
  // VISUAL EFFECTS
  shadow: 'no',
  glow: 'no',
  transparent: 'no',
  pulse: 'no',
  render: 'yes',
  
  // ROTATION CONFIGURATION
  rotation1: { ...defaultRotationConfig },
  rotation2: { ...defaultRotationConfig },
};

//==============================================
// LAUNCHER CONFIG LOGIC SECTION
//==============================================
//DETAILED DESCRIPTION:
//Configuration management logic including the main rotateConfig array, utility functions,
//and helper methods for config manipulation. The rotateConfig array contains all 20 layers
//in order and is used by the rotation logic system for item management and rendering.
//Utility functions provide config validation, layer management, and bulk operations.
//TWEAK:
//Add new layers by extending the rotateConfig array and creating new layer configurations.
//Modify getLayerConfig to add custom layer retrieval logic.
//Change enableAllLayers/disableAllLayers to affect different layer ranges.
//Add new utility functions for specific configuration operations.
//Extend validateConfig to add new validation rules.

// Main configuration array - contains all 20 layers
export const rotateConfig: RotateItemConfig[] = [
  layer1Config,   // Layer 1 - Background Clock (UTC)
  layer2Config,   // Layer 2 - Minutes Circle (Berlin)
  layer3Config,   // Layer 3 - Hours Circle (Moscow)
  layer4Config,   // Layer 4 - Dubai Time
  layer5Config,   // Layer 5 - India Time
  layer6Config,   // Layer 6 - Bangladesh Time
  layer7Config,   // Layer 7 - Thailand Time
  layer8Config,   // Layer 8 - China Time
  layer9Config,   // Layer 9 - Japan Time
  layer10Config,  // Layer 10 - Australia Time
  layer11Config,  // Layer 11 - Reserved (Hidden)
  layer12Config,  // Layer 12 - Reserved (Hidden)
  layer13Config,  // Layer 13 - Reserved (Hidden)
  layer14Config,  // Layer 14 - Reserved (Hidden)
  layer15Config,  // Layer 15 - Reserved (Hidden)
  layer16Config,  // Layer 16 - Reserved (Hidden)
  layer17Config,  // Layer 17 - Reserved (Hidden)
  layer18Config,  // Layer 18 - Reserved (Hidden)
  layer19Config,  // Layer 19 - Reserved (Hidden)
  layer20Config,  // Layer 20 - Reserved (Hidden)
];

// Configuration utility functions
export class LauncherConfigLogic {
  
  // Get configuration for specific layer
  static getLayerConfig(layerNumber: number): RotateItemConfig | null {
    const config = rotateConfig.find(item => item.itemLayer === layerNumber);
    return config || null;
  }
  
  // Get all visible layers
  static getVisibleLayers(): RotateItemConfig[] {
    return rotateConfig.filter(item => item.itemDisplay === 'yes');
  }
  
  // Get all clock hand layers
  static getClockLayers(): RotateItemConfig[] {
    return rotateConfig.filter(item => item.handType !== null);
  }
  
  // Get layers by timezone offset
  static getLayersByTimezone(utcOffset: number): RotateItemConfig[] {
    return rotateConfig.filter(item => 
      item.timezone && 
      item.timezone.enabled === 'yes' && 
      item.timezone.utcOffset === utcOffset
    );
  }
  
  // Enable all layers (make visible)
  static enableAllLayers(): RotateItemConfig[] {
    return rotateConfig.map(item => ({
      ...item,
      itemDisplay: 'yes'
    }));
  }
  
  // Disable all layers (make hidden)
  static disableAllLayers(): RotateItemConfig[] {
    return rotateConfig.map(item => ({
      ...item,
      itemDisplay: 'no'
    }));
  }
  
  // Enable specific layer range
  static enableLayerRange(startLayer: number, endLayer: number): RotateItemConfig[] {
    return rotateConfig.map(item => ({
      ...item,
      itemDisplay: (item.itemLayer >= startLayer && item.itemLayer <= endLayer) ? 'yes' : item.itemDisplay
    }));
  }
  
  // Get configuration statistics
  static getConfigStats() {
    const visible = rotateConfig.filter(item => item.itemDisplay === 'yes').length;
    const clockHands = rotateConfig.filter(item => item.handType !== null).length;
    const withTimezone = rotateConfig.filter(item => item.timezone?.enabled === 'yes').length;
    const withEffects = rotateConfig.filter(item => 
      item.shadow === 'yes' || item.glow === 'yes' || 
      item.transparent === 'yes' || item.pulse === 'yes'
    ).length;
    
    return {
      totalLayers: rotateConfig.length,
      visibleLayers: visible,
      clockHandLayers: clockHands,
      timezoneEnabledLayers: withTimezone,
      layersWithEffects: withEffects,
    };
  }
  
  // Validate configuration
  static validateConfig(config: RotateItemConfig[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check for unique item codes
    const itemCodes = config.map(item => item.itemCode);
    const duplicateCodes = itemCodes.filter((code, index) => itemCodes.indexOf(code) !== index);
    if (duplicateCodes.length > 0) {
      errors.push(`Duplicate item codes found: ${duplicateCodes.join(', ')}`);
    }
    
    // Check for unique layer numbers
    const layers = config.map(item => item.itemLayer);
    const duplicateLayers = layers.filter((layer, index) => layers.indexOf(layer) !== index);
    if (duplicateLayers.length > 0) {
      errors.push(`Duplicate layer numbers found: ${duplicateLayers.join(', ')}`);
    }
    
    // Check for valid layer range
    const invalidLayers = config.filter(item => item.itemLayer < 1 || item.itemLayer > 20);
    if (invalidLayers.length > 0) {
      errors.push(`Invalid layer numbers (must be 1-20): ${invalidLayers.map(item => item.itemLayer).join(', ')}`);
    }
    
    // Check timezone configurations
    config.forEach(item => {
      if (item.timezone && item.timezone.enabled === 'yes') {
        if (item.timezone.utcOffset < -12 || item.timezone.utcOffset > 12) {
          errors.push(`Invalid timezone offset for ${item.itemCode}: ${item.timezone.utcOffset} (must be -12 to +12)`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  // Create new layer configuration
  static createLayer(layerNumber: number, itemName: string, options: Partial<RotateItemConfig> = {}): RotateItemConfig {
    return {
      ...defaultItemConfig,
      itemCode: `item_${layerNumber}`,
      itemName,
      itemPath: `res/${itemName}.png`,
      itemLayer: layerNumber,
      rotation1: { ...defaultRotationConfig },
      rotation2: { ...defaultRotationConfig },
      timezone: null,
      ...options,
    } as RotateItemConfig;
  }
  
  // Clone configuration with modifications
  static cloneConfig(baseConfig: RotateItemConfig, modifications: Partial<RotateItemConfig>): RotateItemConfig {
    return {
      ...baseConfig,
      ...modifications,
      rotation1: {
        ...baseConfig.rotation1,
        ...(modifications.rotation1 || {}),
      },
      rotation2: {
        ...baseConfig.rotation2,
        ...(modifications.rotation2 || {}),
      },
      timezone: modifications.timezone !== undefined 
        ? modifications.timezone 
        : baseConfig.timezone,
    };
  }
}

// Export default configuration
export default rotateConfig;