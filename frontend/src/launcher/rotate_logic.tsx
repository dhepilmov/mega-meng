import React, { useState, useEffect } from 'react';
import { rotateConfig, RotateItemConfig, RotationConfig } from './rotate_config';
import { useClock, ClockState, getTimezoneHourAngle } from './clock_logic';

// SAFE PROPERTY ACCESS UTILITIES - Default to 'no'/null if undefined
const safeString = (value: any, defaultValue: string = 'no'): string => {
  return value !== undefined && value !== null ? String(value) : defaultValue;
};

const safeNumber = (value: any, defaultValue: number = 0): number => {
  return value !== undefined && value !== null && !isNaN(Number(value)) ? Number(value) : defaultValue;
};

const safeObject = <T>(value: any, defaultValue: T | null = null): T | null => {
  return value !== undefined && value !== null ? value : defaultValue;
};

export interface RotateItem extends RotateItemConfig {
  exists: boolean;
  imageSrc?: string;
}

// Safe property normalizer for RotateItem
const normalizeRotateItem = (item: any): RotateItem => {
  return {
    // Basic properties with safe defaults
    itemCode: safeString(item.itemCode, ''),
    itemName: safeString(item.itemName, ''),
    itemPath: safeString(item.itemPath, ''),
    itemLayer: safeNumber(item.itemLayer, 1),
    itemSize: safeNumber(item.itemSize, 20),
    itemDisplay: safeString(item.itemDisplay, 'no') as 'yes' | 'no' | '',
    
    // Clock hand configuration with safe defaults
    handType: safeObject(item.handType, null) as 'hour' | 'minute' | 'second' | null,
    handRotation: safeObject(item.handRotation, null) as 'ROTATION1' | 'ROTATION2' | null,
    
    // Timezone with safe defaults
    timezone: safeObject(item.timezone, null),
    
    // Effect properties with safe defaults
    shadow: safeString(item.shadow, 'no') as 'yes' | 'no',
    glow: safeString(item.glow, 'no') as 'yes' | 'no',
    transparent: safeString(item.transparent, 'no') as 'yes' | 'no',
    pulse: safeString(item.pulse, 'no') as 'yes' | 'no',
    render: safeString(item.render, 'no') as 'yes' | 'no',
    
    // Rotation configurations with safe defaults
    rotation1: {
      enabled: safeString(item.rotation1?.enabled, 'no') as 'yes' | 'no' | null,
      itemTiltPosition: safeNumber(item.rotation1?.itemTiltPosition, 0),
      itemAxisX: safeNumber(item.rotation1?.itemAxisX, 50),
      itemAxisY: safeNumber(item.rotation1?.itemAxisY, 50),
      itemPositionX: safeNumber(item.rotation1?.itemPositionX, 0),
      itemPositionY: safeNumber(item.rotation1?.itemPositionY, 0),
      rotationSpeed: safeNumber(item.rotation1?.rotationSpeed, 0),
      rotationWay: safeString(item.rotation1?.rotationWay, 'no') as '+' | '-' | 'no' | '' | null,
    },
    rotation2: {
      enabled: safeString(item.rotation2?.enabled, 'no') as 'yes' | 'no' | null,
      itemTiltPosition: safeNumber(item.rotation2?.itemTiltPosition, 0),
      itemAxisX: safeNumber(item.rotation2?.itemAxisX, 50),
      itemAxisY: safeNumber(item.rotation2?.itemAxisY, 50),
      itemPositionX: safeNumber(item.rotation2?.itemPositionX, 0),
      itemPositionY: safeNumber(item.rotation2?.itemPositionY, 0),
      rotationSpeed: safeNumber(item.rotation2?.rotationSpeed, 0),
      rotationWay: safeString(item.rotation2?.rotationWay, 'no') as '+' | '-' | 'no' | '' | null,
    },
    
    // Extended properties
    exists: Boolean(item.exists),
    imageSrc: item.imageSrc || '',
  };
};

export const useRotateLogic = () => {
  const [rotateItems, setRotateItems] = useState<RotateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const clockState = useClock(); // Get real-time clock angles

  // Check if image files exist and load them
  useEffect(() => {
    const checkAndLoadImages = async () => {
      const itemsWithImages: RotateItem[] = [];

      for (const config of rotateConfig) {
        // Normalize the config with safe defaults
        const normalizedConfig = normalizeRotateItem(config);
        
        let exists = false;
        let imageSrc = '';

        if (normalizedConfig.itemName) {
          try {
            // Try to import the image dynamically
            const imageModule = await import(`./res/${normalizedConfig.itemName}.png`);
            imageSrc = imageModule.default;
            exists = true;
          } catch (error) {
            console.warn(`Image not found: ${normalizedConfig.itemPath}${normalizedConfig.itemName}.png`);
            exists = false;
          }
        }

        itemsWithImages.push({
          ...normalizedConfig,
          exists,
          imageSrc,
        });
      }

      setRotateItems(itemsWithImages);
      setLoading(false);
    };

    checkAndLoadImages();
  }, []);

  // Get items filtered by existence and display setting
  const getDisplayableItems = (): RotateItem[] => {
    return rotateItems
      .filter(item => 
        item.exists && 
        safeString(item.itemName) && 
        safeString(item.itemDisplay, 'no') === 'yes' // Safe check for display
      )
      .sort((a, b) => safeNumber(a.itemLayer, 1) - safeNumber(b.itemLayer, 1)); // Safe layer sorting
  };

  // Get clock angle for hand type (with timezone support for hour hands)
  const getClockAngle = (handType: 'hour' | 'minute' | 'second', item: RotateItem): number => {
    switch (handType) {
      case 'hour': 
        // Use timezone-aware hour angle if configured
        return getTimezoneHourAngle(item.timezone);
      case 'minute': 
        // Minutes are the same worldwide
        return clockState.minuteAngle;
      case 'second': 
        // Seconds are the same worldwide
        return clockState.secondAngle;
      default: 
        return 0;
    }
  };

  // Check if item is a clock hand
  const isClockHand = (item: RotateItem): boolean => {
    return item.handType !== null && item.handType !== undefined && item.handRotation !== null;
  };

  // Get active rotation config for hand items
  const getActiveRotationConfig = (item: RotateItem): RotationConfig | null => {
    if (!isClockHand(item)) return null;
    
    return item.handRotation === 'ROTATION1' ? item.rotation1 : 
           item.handRotation === 'ROTATION2' ? item.rotation2 : null;
  };

  const getItemByCode = (code: string): RotateItem | undefined => {
    return rotateItems.find(item => item.itemCode === code);
  };

  // Calculate base position based on center reference (dot mark position)
  const calculateBasePosition = (item: RotateItem) => {
    return {
      position: 'absolute' as const,
      left: '50%',
      top: '50%',
      width: `${item.itemSize}%`,
      height: 'auto',
      zIndex: item.itemLayer,
    };
  };

  // Calculate transform for a single rotation
  const calculateRotationTransform = (
    rotation: RotationConfig, 
    rotationIndex: number,
    baseTransform: string = ''
  ): string => {
    if (rotation.enabled !== 'yes' || !rotation.rotationWay || rotation.rotationWay === 'no') {
      return baseTransform;
    }

    // Position offset from center
    const translateX = rotation.itemPositionX;
    const translateY = rotation.itemPositionY;
    
    // Transform origin based on axis within the image
    const originX = rotation.itemAxisX;
    const originY = rotation.itemAxisY;

    // Combine transforms
    const transforms = [
      `translate(-50%, -50%)`, // Center the element
      `translate(${translateX}%, ${translateY}%)`, // Move to position
      `rotate(${rotation.itemTiltPosition}deg)`, // Initial tilt
    ];

    return transforms.join(' ');
  };

  // Calculate combined transform for item (with enhanced clock integration)
  const calculateItemTransform = (item: RotateItem): string => {
    let transform = 'translate(-50%, -50%)';
    
    // For clock hands, use clock angles (with timezone support for hour hands)
    if (isClockHand(item) && item.handType) {
      const activeRotation = getActiveRotationConfig(item);
      if (activeRotation) {
        const clockAngle = getClockAngle(item.handType, item);
        // Apply position offset
        transform += ` translate(${activeRotation.itemPositionX}%, ${activeRotation.itemPositionY}%)`;
        // Apply clock rotation with initial tilt
        transform += ` rotate(${activeRotation.itemTiltPosition + clockAngle}deg)`;
        return transform;
      }
    }

    // For non-hand items, use original logic
    // Apply rotation 1 positioning
    if (item.rotation1.enabled === 'yes') {
      transform += ` translate(${item.rotation1.itemPositionX}%, ${item.rotation1.itemPositionY}%)`;
    }
    
    // Apply rotation 2 positioning if enabled
    if (item.rotation2.enabled === 'yes') {
      transform += ` translate(${item.rotation2.itemPositionX}%, ${item.rotation2.itemPositionY}%)`;
    }

    return transform;
  };

  // Calculate transform origin for rotations (with enhanced clock integration)
  const calculateTransformOrigin = (item: RotateItem): string => {
    // For clock hands, use the active rotation's origin
    if (isClockHand(item)) {
      const activeRotation = getActiveRotationConfig(item);
      if (activeRotation) {
        return `${activeRotation.itemAxisX}% ${activeRotation.itemAxisY}%`;
      }
    }

    // For non-hand items, use original logic
    // Use rotation1 axis as primary, fallback to rotation2, then center
    if (item.rotation1.enabled === 'yes') {
      return `${item.rotation1.itemAxisX}% ${item.rotation1.itemAxisY}%`;
    } else if (item.rotation2.enabled === 'yes') {
      return `${item.rotation2.itemAxisX}% ${item.rotation2.itemAxisY}%`;
    }
    return '50% 50%';
  };

  return {
    rotateItems,
    loading,
    clockState, // Expose clock state for animation layer
    getDisplayableItems,
    getItemByCode,
    calculateBasePosition,
    calculateItemTransform,
    calculateTransformOrigin,
    isClockHand, // Expose for animation layer
    getClockAngle, // Enhanced with timezone support
    getActiveRotationConfig, // Expose for animation layer
  };
};

// Component to render a single rotate item
interface RotateItemProps {
  item: RotateItem;
  calculateBasePosition: (item: RotateItem) => any;
  calculateItemTransform: (item: RotateItem) => string;
  calculateTransformOrigin: (item: RotateItem) => string;
}

export const RotateItemComponent: React.FC<RotateItemProps> = ({
  item,
  calculateBasePosition,
  calculateItemTransform,
  calculateTransformOrigin,
}) => {
  if (!item.exists || !item.imageSrc) return null;

  const baseStyle = calculateBasePosition(item);
  const transform = calculateItemTransform(item);
  const transformOrigin = calculateTransformOrigin(item);

  return (
    <div
      className={`rotate-item rotate-item-${item.itemCode}`}
      style={{
        ...baseStyle,
        transform,
        transformOrigin,
      }}
    >
      <img
        src={item.imageSrc}
        alt={item.itemName}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
        draggable={false}
      />
    </div>
  );
};