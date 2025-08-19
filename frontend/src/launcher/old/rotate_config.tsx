export interface RotationConfig {
  enabled: 'yes' | 'no' | null;
  itemTiltPosition: number;
  itemAxisX: number; // percentage from its own center
  itemAxisY: number; // percentage from its own center
  itemPositionX: number; // percentage from center/dot mark
  itemPositionY: number; // percentage from center/dot mark
  rotationSpeed: number; // seconds per full rotate
  rotationWay: '+' | '-' | 'no' | '' | null; // + clockwise, - anti-clockwise, no/empty = no rotate
}

export interface TimezoneConfig {
  enabled: 'yes' | 'no';
  utcOffset: number; // UTC offset in hours (e.g., +9, -5, +0)
  use24Hour: 'yes' | 'no'; // 1 rotation per 24 hours or 2 rotations per 24 hours
}

export interface RotateItemConfig {
  itemCode: string;
  itemName: string;
  itemPath: string;
  itemLayer: number;
  itemSize: number; // percentage from its own center
  itemDisplay: 'yes' | 'no' | ''; // Controls whether PNG is displayed or hidden
  
  // CLOCK HAND CONFIGURATION
  handType?: 'hour' | 'minute' | 'second' | null;
  handRotation?: 'ROTATION1' | 'ROTATION2' | null;
  // When handType is set, clock logic overrides the specified rotation
  
  // TIMEZONE (only for hour hands)
  timezone?: TimezoneConfig | null;
  
  // EFFECT
  shadow: 'yes' | 'no';
  glow: 'yes' | 'no';
  transparent: 'yes' | 'no';
  pulse: 'yes' | 'no';
  render: 'yes' | 'no';
  
  // ROTATION CONFIGURATION
  rotation1: RotationConfig;
  rotation2: RotationConfig;
}

export const rotateConfig: RotateItemConfig[] = [
  // LAYER 1
  {
    itemCode: 'item_1',               // Unique identifier for the item (item_1 to item_20)
    itemName: 'clockBG',              // PNG filename without extension (string)
    itemPath: 'res/clockBG.png',      // File path relative to res/ folder (string)
    itemLayer: 1,                     // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 0,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 2
  {
    itemCode: 'item_2',               // Unique identifier for the item (item_1 to item_20)
    itemName: 'minutes_circle',       // PNG filename without extension (string)
    itemPath: 'res/minutes_circle.png', // File path relative to res/ folder (string)
    itemLayer: 2,                     // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 1,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 3
  {
    itemCode: 'item_3',               // Unique identifier for the item (item_1 to item_20)
    itemName: 'outer_circle',         // PNG filename without extension (string)
    itemPath: 'res/outer_circle.png', // File path relative to res/ folder (string)
    itemLayer: 3,                     // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 2,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 4
  {
    itemCode: 'item_4',               // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (4)',            // PNG filename without extension (string)
    itemPath: 'res/dummy (4).png',   // File path relative to res/ folder (string)
    itemLayer: 4,                     // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 3,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 5
  {
    itemCode: 'item_5',               // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (5)',            // PNG filename without extension (string)
    itemPath: 'res/dummy (5).png',   // File path relative to res/ folder (string)
    itemLayer: 5,                     // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 4,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 6
  {
    itemCode: 'item_6',               // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (6)',            // PNG filename without extension (string)
    itemPath: 'res/dummy (6).png',   // File path relative to res/ folder (string)
    itemLayer: 6,                     // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 5,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 7
  {
    itemCode: 'item_7',               // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (7)',            // PNG filename without extension (string)
    itemPath: 'res/dummy (7).png',   // File path relative to res/ folder (string)
    itemLayer: 7,                     // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 6,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 8
  {
    itemCode: 'item_8',               // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (8)',            // PNG filename without extension (string)
    itemPath: 'res/dummy (8).png',   // File path relative to res/ folder (string)
    itemLayer: 8,                     // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 7,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 9
  {
    itemCode: 'item_9',               // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (9)',            // PNG filename without extension (string)
    itemPath: 'res/dummy (9).png',   // File path relative to res/ folder (string)
    itemLayer: 9,                     // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 8,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 10
  {
    itemCode: 'item_10',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (10)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (10).png',  // File path relative to res/ folder (string)
    itemLayer: 10,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'yes',               // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: {                       // Timezone configuration (object/null for items 11-20)
      enabled: 'yes',                 // Enable timezone offset (yes/no)
      utcOffset: 9,                   // UTC offset in hours (number -12 to +12)
      use24Hour: 'yes',               // 1 rotation per 24 hours vs 12 hours (yes/no)
    },
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 11
  {
    itemCode: 'item_11',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (11)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (11).png',  // File path relative to res/ folder (string)
    itemLayer: 11,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 12
  {
    itemCode: 'item_12',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (12)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (12).png',  // File path relative to res/ folder (string)
    itemLayer: 12,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 13
  {
    itemCode: 'item_13',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (13)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (13).png',  // File path relative to res/ folder (string)
    itemLayer: 13,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 14
  {
    itemCode: 'item_14',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (14)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (14).png',  // File path relative to res/ folder (string)
    itemLayer: 14,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 15
  {
    itemCode: 'item_15',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (15)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (15).png',  // File path relative to res/ folder (string)
    itemLayer: 15,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 16
  {
    itemCode: 'item_16',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (16)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (16).png',  // File path relative to res/ folder (string)
    itemLayer: 16,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 17
  {
    itemCode: 'item_17',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (17)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (17).png',  // File path relative to res/ folder (string)
    itemLayer: 17,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 18
  {
    itemCode: 'item_18',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (18)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (18).png',  // File path relative to res/ folder (string)
    itemLayer: 18,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 19
  {
    itemCode: 'item_19',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (19)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (19).png',  // File path relative to res/ folder (string)
    itemLayer: 19,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },

  // LAYER 20
  {
    itemCode: 'item_20',              // Unique identifier for the item (item_1 to item_20)
    itemName: 'dummy (20)',           // PNG filename without extension (string)
    itemPath: 'res/dummy (20).png',  // File path relative to res/ folder (string)
    itemLayer: 20,                    // Z-index layer position (1-20 sequential numbers)
    itemSize: 20,                     // Size percentage from its own center (number 1-100)
    itemDisplay: 'no',                // Show/hide PNG (yes/no)
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',                 // Type of clock hand (hour/minute/second/null)
    handRotation: 'ROTATION1',        // Which rotation to use for clock (ROTATION1/ROTATION2/null)
    
    // TIMEZONE
    timezone: null,                   // Timezone configuration (object/null for items 11-20)
    
    // EFFECT
    shadow: 'no',                     // Drop shadow effect around item (yes/no)
    glow: 'no',                       // Glow effect around item (yes/no)
    transparent: 'no',                // Transparency/opacity effect (yes/no)
    pulse: 'no',                      // Pulsing animation effect (yes/no)
    render: 'yes',                    // Enable/disable rendering of effects (yes/no)
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',                 // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 86400,           // Seconds for one complete rotation (number > 0)
      rotationWay: '+',               // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
    rotation2: {
      enabled: 'no',                  // Enable this rotation animation (yes/no)
      itemTiltPosition: 0,            // Initial rotation angle in degrees (number 0-359)
      itemAxisX: 50,                  // Rotation axis X position from image center (number 0-100%)
      itemAxisY: 50,                  // Rotation axis Y position from image center (number 0-100%)
      itemPositionX: 0,               // Horizontal offset from dot mark center (number -100 to +100%)
      itemPositionY: 0,               // Vertical offset from dot mark center (number -100 to +100%)
      rotationSpeed: 0,               // Seconds for one complete rotation (number > 0)
      rotationWay: '',                // Rotation direction (+/- for clockwise/counter-clockwise, no/'' for none)
    },
  },
];