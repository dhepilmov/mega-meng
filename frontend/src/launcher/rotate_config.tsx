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
  timezone?: TimezoneConfig;
  
  // ROTATION CONFIGURATION
  rotation1: RotationConfig;
  rotation2: RotationConfig;
}

export const rotateConfig: RotateItemConfig[] = [
  // LAYER 1 - Clock Background
  {
    itemCode: 'item_1',
    itemName: 'clockBG',
    itemPath: 'res/clockBG.png',
    itemLayer: 1,
    itemSize: 80,
    itemDisplay: 'yes',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 60,
      rotationWay: 'no',
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
    itemName: 'minutes_circle',
    itemPath: 'res/minutes_circle.png',
    itemLayer: 5,
    itemSize: 70,
    itemDisplay: 'yes',
    
    // CLOCK HAND CONFIGURATION
    handType: 'minute',
    handRotation: 'ROTATION1',
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 3600, // Overridden by clock logic
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

  // LAYER 3 - Hour Hand with Timezone
  {
    itemCode: 'item_3',
    itemName: 'outer_circle',
    itemPath: 'res/outer_circle.png',
    itemLayer: 4,
    itemSize: 70,
    itemDisplay: 'yes',
    
    // CLOCK HAND CONFIGURATION
    handType: 'hour',
    handRotation: 'ROTATION1',
    
    // TIMEZONE
    timezone: {
      enabled: 'yes',
      utcOffset: 0, // UTC+0 (London time)
      use24Hour: 'yes', // 1 rotation per 24 hours
    },
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 86400, // Overridden by clock logic 
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

  // LAYER 4 - Second Hand (Hidden)
  {
    itemCode: 'item_4',
    itemName: 'dummy (4)',
    itemPath: 'res/dummy (4).png',
    itemLayer: 6,
    itemSize: 25,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: 'second',
    handRotation: 'ROTATION1',
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 60, // Overridden by clock logic
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

  // LAYER 5 to 20 - Available for more layers
  {
    itemCode: 'item_5',
    itemName: 'dummy (5)',
    itemPath: 'res/dummy (5).png',
    itemLayer: 7,
    itemSize: 60,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 15,
      itemPositionY: 0,
      rotationSpeed: 20,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 75,
      itemAxisY: 25,
      itemPositionX: 20,
      itemPositionY: -10,
      rotationSpeed: 45,
      rotationWay: '-',
    },
  },

  {
    itemCode: 'item_6',
    itemName: 'dummy (6)',
    itemPath: 'res/dummy (6).png',
    itemLayer: 8,
    itemSize: 40,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 45,
      itemAxisX: 25,
      itemAxisY: 75,
      itemPositionX: -20,
      itemPositionY: 15,
      rotationSpeed: 35,
      rotationWay: '-',
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

  {
    itemCode: 'item_7',
    itemName: 'dummy (7)',
    itemPath: 'res/dummy (7).png',
    itemLayer: 9,
    itemSize: 55,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: -25,
      rotationSpeed: 50,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'no',
      itemTiltPosition: 90,
      itemAxisX: 0,
      itemAxisY: 100,
      itemPositionX: 25,
      itemPositionY: 0,
      rotationSpeed: 30,
      rotationWay: '+',
    },
  },

  {
    itemCode: 'item_8',
    itemName: 'dummy (8)',
    itemPath: 'res/dummy (8).png',
    itemLayer: 10,
    itemSize: 45,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 30,
      itemPositionY: 20,
      rotationSpeed: 40,
      rotationWay: '-',
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

  {
    itemCode: 'item_9',
    itemName: 'dummy (9)',
    itemPath: 'res/dummy (9).png',
    itemLayer: 11,
    itemSize: 35,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 180,
      itemAxisX: 100,
      itemAxisY: 50,
      itemPositionX: -15,
      itemPositionY: -15,
      rotationSpeed: 25,
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

  {
    itemCode: 'item_10',
    itemName: 'dummy (10)',
    itemPath: 'res/dummy (10).png',
    itemLayer: 12,
    itemSize: 65,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 30,
      rotationSpeed: 60,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'no',
      itemTiltPosition: 270,
      itemAxisX: 50,
      itemAxisY: 0,
      itemPositionX: -30,
      itemPositionY: 0,
      rotationSpeed: 45,
      rotationWay: '-',
    },
  },

  {
    itemCode: 'item_11',
    itemName: 'dummy (11)',
    itemPath: 'res/dummy (11).png',
    itemLayer: 13,
    itemSize: 50,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 35,
      itemPositionY: -25,
      rotationSpeed: 15,
      rotationWay: '-',
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

  {
    itemCode: 'item_12',
    itemName: 'dummy (12)',
    itemPath: 'res/dummy (12).png',
    itemLayer: 14,
    itemSize: 30,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 45,
      itemAxisX: 0,
      itemAxisY: 0,
      itemPositionX: 40,
      itemPositionY: 40,
      rotationSpeed: 12,
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

  {
    itemCode: 'item_13',
    itemName: 'dummy (13)',
    itemPath: 'res/dummy (13).png',
    itemLayer: 15,
    itemSize: 70,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: -40,
      itemPositionY: 0,
      rotationSpeed: 80,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'no',
      itemTiltPosition: 135,
      itemAxisX: 25,
      itemAxisY: 25,
      itemPositionX: 10,
      itemPositionY: -35,
      rotationSpeed: 55,
      rotationWay: '+',
    },
  },

  {
    itemCode: 'item_14',
    itemName: 'dummy (14)',
    itemPath: 'res/dummy (14).png',
    itemLayer: 16,
    itemSize: 40,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: -40,
      rotationSpeed: 30,
      rotationWay: '-',
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

  {
    itemCode: 'item_15',
    itemName: 'dummy (15)',
    itemPath: 'res/dummy (15).png',
    itemLayer: 17,
    itemSize: 55,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 90,
      itemAxisX: 100,
      itemAxisY: 50,
      itemPositionX: 25,
      itemPositionY: 35,
      rotationSpeed: 70,
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

  {
    itemCode: 'item_16',
    itemName: 'dummy (16)',
    itemPath: 'res/dummy (16).png',
    itemLayer: 18,
    itemSize: 45,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: -25,
      itemPositionY: 25,
      rotationSpeed: 18,
      rotationWay: '-',
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

  {
    itemCode: 'item_17',
    itemName: 'dummy (17)',
    itemPath: 'res/dummy (17).png',
    itemLayer: 19,
    itemSize: 35,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 45,
      itemPositionY: 0,
      rotationSpeed: 90,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'no',
      itemTiltPosition: 180,
      itemAxisX: 0,
      itemAxisY: 50,
      itemPositionX: -10,
      itemPositionY: -40,
      rotationSpeed: 25,
      rotationWay: '-',
    },
  },

  {
    itemCode: 'item_18',
    itemName: 'dummy (18)',
    itemPath: 'res/dummy (18).png',
    itemLayer: 20,
    itemSize: 60,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 45,
      rotationSpeed: 35,
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

  {
    itemCode: 'item_19',
    itemName: 'dummy (19)',
    itemPath: 'res/dummy (19).png',
    itemLayer: 21,
    itemSize: 25,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 270,
      itemAxisX: 50,
      itemAxisY: 100,
      itemPositionX: -35,
      itemPositionY: -30,
      rotationSpeed: 22,
      rotationWay: '-',
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

  {
    itemCode: 'item_20',
    itemName: 'dummy (20)',
    itemPath: 'res/dummy (20).png',
    itemLayer: 22,
    itemSize: 80,
    itemDisplay: 'no',
    
    // CLOCK HAND CONFIGURATION
    handType: null,
    handRotation: null,
    
    // ROTATION CONFIGURATION
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 100,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'no',
      itemTiltPosition: 45,
      itemAxisX: 75,
      itemAxisY: 75,
      itemPositionX: 30,
      itemPositionY: -20,
      rotationSpeed: 65,
      rotationWay: '+',
    },
  },
];