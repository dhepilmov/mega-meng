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
  {
    itemCode: 'item_1',
    itemName: 'clockBG',
    itemPath: 'res/clockBG.png',
    itemLayer: 2,
    itemSize: 80,
    itemDisplay: 'yes',
    // Clock background - decorative only
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'no',
      itemTiltPosition: 0,
      itemAxisX: 50, // center of its own image
      itemAxisY: 50, // center of its own image
      itemPositionX: 0, // centered on dot mark
      itemPositionY: 0, // centered on dot mark
      rotationSpeed: 60,
      rotationWay: '+', // clockwise
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
    itemCode: 'item_2',
    itemName: 'minutes_circle',
    itemPath: 'res/minutes_circle.png',
    itemLayer: 1,
    itemSize: 70,
    itemDisplay: 'yes',
    // This will act as minute hand using ROTATION1
    handType: 'minute',
    handRotation: 'ROTATION1',
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 60, // This will be overridden by clock logic
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
    itemCode: 'item_3',
    itemName: 'outer_circle',
    itemPath: 'res/outer_circle.png',
    itemLayer: 3,
    itemSize: 90,
    itemDisplay: 'yes',
    // Decorative item - keeps original rotation behavior
    handType: null,
    handRotation: null,
    rotation1: {
      enabled: 'yes',
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 45,
      rotationWay: '-', // anti-clockwise
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
  // Placeholder items 4-20
  ...Array.from({ length: 17 }, (_, index) => ({
    itemCode: `item_${index + 4}`,
    itemName: '',
    itemPath: 'res/',
    itemLayer: index + 4,
    itemSize: 50,
    itemDisplay: 'no' as const, // Hidden by default
    rotation1: {
      enabled: 'no' as const,
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 20,
      rotationWay: '+' as const,
    },
    rotation2: {
      enabled: 'no' as const,
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 30,
      rotationWay: '+' as const,
    },
  })),
];