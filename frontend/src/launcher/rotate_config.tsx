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

export interface RotateItemConfig {
  itemCode: string;
  itemName: string;
  itemPath: string;
  itemLayer: number;
  itemSize: number; // percentage from its own center
  itemDisplay: 'yes' | 'no' | ''; // Controls whether PNG is displayed or hidden
  
  // NEW: Clock hand configuration
  handType?: 'hour' | 'minute' | 'second' | null;
  handRotation?: 'ROTATION1' | 'ROTATION2' | null;
  // When handType is set, clock logic overrides the specified rotation
  
  rotation1: RotationConfig;
  rotation2: RotationConfig;
}

export const rotateConfig: RotateItemConfig[] = [
  // Clock Background - Static
  {
    itemCode: 'item_1',
    itemName: 'clockBG',
    itemPath: 'res/clockBG.png',
    itemLayer: 1,
    itemSize: 80,
    itemDisplay: 'yes',
    // Clock background - decorative only
    handType: null,
    handRotation: null,
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

  // Minute Hand - Blue ring
  {
    itemCode: 'item_2',
    itemName: 'minutes_circle',
    itemPath: 'res/minutes_circle.png',
    itemLayer: 5,
    itemSize: 70,
    itemDisplay: 'yes',
    // Minute hand using ROTATION1
    handType: 'minute',
    handRotation: 'ROTATION1',
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

  // Hour Hand - Outer ring  
  {
    itemCode: 'item_3',
    itemName: 'outer_circle',
    itemPath: 'res/outer_circle.png',
    itemLayer: 4,
    itemSize: 90,
    itemDisplay: 'yes',
    // Hour hand using ROTATION1
    handType: 'hour',
    handRotation: 'ROTATION1',
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

  // Second Hand - Small fast element
  {
    itemCode: 'item_4',
    itemName: 'dummy (4)',
    itemPath: 'res/dummy (4).png',
    itemLayer: 6,
    itemSize: 25,
    itemDisplay: 'yes',
    // Second hand using ROTATION1
    handType: 'second',
    handRotation: 'ROTATION1',
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

  // Decorative Elements - Various ornamental items that rotate independently
  {
    itemCode: 'item_5',
    itemName: 'dummy (5)',
    itemPath: 'res/dummy (5).png',
    itemLayer: 2,
    itemSize: 35,
    itemDisplay: 'yes',
    // Decorative - slow clockwise rotation
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 45,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 120,
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
    itemCode: 'item_6',
    itemName: 'dummy (6)',
    itemPath: 'res/dummy (6).png',
    itemLayer: 3,
    itemSize: 40,
    itemDisplay: 'yes',
    // Decorative - counter-clockwise rotation
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 90,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 80,
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
    itemLayer: 7,
    itemSize: 30,
    itemDisplay: 'yes',
    // Decorative - fast rotation
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 30,
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
    itemCode: 'item_8',
    itemName: 'dummy (8)',
    itemPath: 'res/dummy (8).png',
    itemLayer: 8,
    itemSize: 45,
    itemDisplay: 'yes',
    // Decorative - dual rotation system
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 15,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 60,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 30,
      itemAxisY: 30,
      itemPositionX: 10,
      itemPositionY: -10,
      rotationSpeed: 90,
      rotationWay: '-',
    },
  },

  {
    itemCode: 'item_9',
    itemName: 'dummy (9)',
    itemPath: 'res/dummy (9).png',
    itemLayer: 9,
    itemSize: 20,
    itemDisplay: 'yes',
    // Decorative - positioned and rotating
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 15,
      itemPositionY: 15,
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
    itemLayer: 10,
    itemSize: 35,
    itemDisplay: 'yes',
    // Changed from static to slow rotating decorative element
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes', // Changed from 'no' to 'yes'
      itemTiltPosition: 30,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: -20,
      itemPositionY: 20,
      rotationSpeed: 180, // Added slow rotation
      rotationWay: '+', // Changed from 'no' to '+'
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
    itemCode: 'item_11',
    itemName: 'dummy (11)',
    itemPath: 'res/dummy (11).png',
    itemLayer: 11,
    itemSize: 28,
    itemDisplay: 'yes',
    // Additional second hand option (can be disabled)
    handType: 'second',
    handRotation: 'ROTATION1',
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 90,
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

  {
    itemCode: 'item_12',
    itemName: 'dummy (12)',
    itemPath: 'res/dummy (12).png',
    itemLayer: 12,
    itemSize: 50,
    itemDisplay: 'yes',
    // Decorative - medium speed
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 100,
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
    itemCode: 'item_13',
    itemName: 'dummy (13)',
    itemPath: 'res/dummy (13).png',
    itemLayer: 13,
    itemSize: 15,
    itemDisplay: 'yes',
    // Small decorative orbiting element
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 25,
      itemPositionY: -25,
      rotationSpeed: 40,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 20,
      rotationWay: '-',
    },
  },

  {
    itemCode: 'item_14',
    itemName: 'dummy (14)',
    itemPath: 'res/dummy (14).png',
    itemLayer: 14,
    itemSize: 32,
    itemDisplay: 'yes',
    // Alternative minute hand (can be toggled)
    handType: 'minute',
    handRotation: 'ROTATION2',
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 0,
      rotationWay: '',
    },
    rotation2: {
      enabled: 'yes',
      itemTiltPosition: 45,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 3600, // Overridden by clock logic
      rotationWay: '+',
    },
  },

  {
    itemCode: 'item_15',
    itemName: 'dummy (15)',
    itemPath: 'res/dummy (15).png',
    itemLayer: 15,
    itemSize: 38,
    itemDisplay: 'yes',
    // Decorative with complex dual rotation
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 60,
      itemAxisX: 70,
      itemAxisY: 30,
      itemPositionX: 10,
      itemPositionY: 10,
      rotationSpeed: 75,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 150,
      rotationWay: '-',
    },
  },

  {
    itemCode: 'item_16',
    itemName: 'dummy (16)',
    itemPath: 'res/dummy (16).png',
    itemLayer: 16,
    itemSize: 22,
    itemDisplay: 'yes',
    // High-speed decorative spinner - made faster
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: -30,
      itemPositionY: 0,
      rotationSpeed: 8, // Made much faster (was 15)
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
    itemCode: 'item_17',
    itemName: 'dummy (17)',
    itemPath: 'res/dummy (17).png',
    itemLayer: 17,
    itemSize: 26,
    itemDisplay: 'yes',
    // Alternative hour hand (can be enabled)
    handType: 'hour',
    handRotation: 'ROTATION2',
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 0,
      rotationWay: '',
    },
    rotation2: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 86400, // Overridden by clock logic
      rotationWay: '+',
    },
  },

  {
    itemCode: 'item_18',
    itemName: 'dummy (18)',
    itemPath: 'res/dummy (18).png',
    itemLayer: 18,
    itemSize: 42,
    itemDisplay: 'yes',
    // Large decorative element - made faster and more visible
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 135,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 60, // Made faster (was 200)
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
    itemCode: 'item_19',
    itemName: 'dummy (19)',
    itemPath: 'res/dummy (19).png',
    itemLayer: 19,
    itemSize: 18,
    itemDisplay: 'yes',
    // Small orbiting element
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 35,
      itemPositionY: 35,
      rotationSpeed: 50,
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
    itemCode: 'item_20',
    itemName: 'dummy (20)',
    itemPath: 'res/dummy (20).png',
    itemLayer: 20,
    itemSize: 55,
    itemDisplay: 'yes',
    // Static large background element
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 180,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 0,
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
];