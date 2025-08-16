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
  rotation1: RotationConfig;
  rotation2: RotationConfig;
}

export const rotateConfig: RotateItemConfig[] = [
  {
    itemCode: 'item_1',
    itemName: 'clockBG',
    itemPath: 'res/clockBG.png',
    itemLayer: 1,
    itemSize: 80,
    itemDisplay: 'yes',
    rotation1: {
      enabled: 'yes',
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
    itemLayer: 2,
    itemSize: 70,
    itemDisplay: 'yes',
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
    itemCode: 'item_3',
    itemName: 'outer_circle',
    itemPath: 'res/outer_circle.png',
    itemLayer: 3,
    itemSize: 90,
    itemDisplay: 'yes',
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
  // Example: Static image (no animation) using item_4
  {
    itemCode: 'item_4',
    itemName: 'minutes_circle',
    itemPath: 'res/minutes_circle.png',
    itemLayer: 4,
    itemSize: 30,
    itemDisplay: 'yes', // Show the PNG
    rotation1: {
      enabled: 'no', // No animation - static display
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 30, // Offset position to the right
      itemPositionY: 0,
      rotationSpeed: 20,
      rotationWay: '+',
    },
    rotation2: {
      enabled: 'no', // No second rotation
      itemTiltPosition: 0,
      itemAxisX: 50,
      itemAxisY: 50,
      itemPositionX: 0,
      itemPositionY: 0,
      rotationSpeed: 30,
      rotationWay: '+',
    },
  },
  // Placeholder items 5-20
  ...Array.from({ length: 16 }, (_, index) => ({
    itemCode: `item_${index + 5}`,
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