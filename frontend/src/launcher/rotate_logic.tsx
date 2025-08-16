import React, { useState, useEffect } from 'react';
import { rotateConfig, RotateItemConfig, RotationConfig } from './rotate_config';
import { useClock, ClockState } from './clock_logic';

export interface RotateItem extends RotateItemConfig {
  exists: boolean;
  imageSrc?: string;
}

export const useRotateLogic = () => {
  const [rotateItems, setRotateItems] = useState<RotateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const clockState = useClock(); // Get real-time clock angles

  // Check if image files exist and load them
  useEffect(() => {
    const checkAndLoadImages = async () => {
      const itemsWithImages: RotateItem[] = [];

      for (const config of rotateConfig) {
        let exists = false;
        let imageSrc = '';

        if (config.itemName) {
          try {
            // Try to import the image dynamically
            const imageModule = await import(`./res/${config.itemName}.png`);
            imageSrc = imageModule.default;
            exists = true;
          } catch (error) {
            console.warn(`Image not found: ${config.itemPath}${config.itemName}.png`);
            exists = false;
          }
        }

        itemsWithImages.push({
          ...config,
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
        item.itemName && 
        item.itemDisplay === 'yes' // Use itemDisplay instead of rotation enabled
      )
      .sort((a, b) => a.itemLayer - b.itemLayer); // Sort by layer (bottom to top)
  };

  // Get clock angle for hand type
  const getClockAngle = (handType: 'hour' | 'minute' | 'second'): number => {
    switch (handType) {
      case 'hour': return clockState.hourAngle;
      case 'minute': return clockState.minuteAngle;
      case 'second': return clockState.secondAngle;
      default: return 0;
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

  // Calculate combined transform for item (with clock integration)
  const calculateItemTransform = (item: RotateItem): string => {
    let transform = 'translate(-50%, -50%)';
    
    // For clock hands, use clock angles
    if (isClockHand(item) && item.handType) {
      const activeRotation = getActiveRotationConfig(item);
      if (activeRotation) {
        const clockAngle = getClockAngle(item.handType);
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

  // Calculate transform origin for rotations
  const calculateTransformOrigin = (item: RotateItem): string => {
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
    getDisplayableItems,
    getItemByCode,
    calculateBasePosition,
    calculateItemTransform,
    calculateTransformOrigin,
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