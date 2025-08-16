import React, { useState, useEffect } from 'react';
import { rotateConfig, RotateItemConfig } from './rotate_config';

export interface RotateItem extends RotateItemConfig {
  exists: boolean;
  imageSrc?: string;
}

export const useRotateLogic = () => {
  const [rotateItems, setRotateItems] = useState<RotateItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if image files exist and load them
  useEffect(() => {
    const checkAndLoadImages = async () => {
      const itemsWithImages: RotateItem[] = [];

      for (const config of rotateConfig) {
        let exists = false;
        let imageSrc = '';

        if (config.display === 'yes' && config.itemName) {
          try {
            // Try to import the image dynamically
            const imageModule = await import(`./res/${config.itemName}.png`);
            imageSrc = imageModule.default;
            exists = true;
          } catch (error) {
            console.warn(`Image not found: ${config.path}${config.itemName}.png`);
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

  // Get items filtered by display and existence
  const getDisplayableItems = (): RotateItem[] => {
    return rotateItems
      .filter(item => item.display === 'yes' && item.exists)
      .sort((a, b) => a.layer - b.layer); // Sort by layer (bottom to top)
  };

  // Get item by code
  const getItemByCode = (code: string): RotateItem | undefined => {
    return rotateItems.find(item => item.code === code);
  };

  // Calculate position based on center reference (dot mark position)
  const calculatePosition = (item: RotateItem) => {
    // Position relative to center (50%, 50%) with offsets
    const centerX = 50 + item.itemPositionX;
    const centerY = 50 + item.itemPositionY;
    
    return {
      left: `${centerX}%`,
      top: `${centerY}%`,
      transform: `translate(-50%, -50%) rotate(${item.tiltPosition}deg)`,
      width: `${item.itemSize}%`,
      height: 'auto',
      zIndex: item.layer,
    };
  };

  // Generate animation keyframes for rotation
  const getRotationKeyframes = (item: RotateItem) => {
    const direction = item.rotation === 'clockwise' ? '360deg' : '-360deg';
    return `
      @keyframes rotate-${item.code} {
        from {
          transform: translate(-50%, -50%) rotate(${item.tiltPosition}deg);
        }
        to {
          transform: translate(-50%, -50%) rotate(calc(${item.tiltPosition}deg + ${direction}));
        }
      }
    `;
  };

  // Get animation style for item
  const getAnimationStyle = (item: RotateItem) => {
    return {
      animation: `rotate-${item.code} ${item.rotationSpeed}s linear infinite`,
    };
  };

  return {
    rotateItems,
    loading,
    getDisplayableItems,
    getItemByCode,
    calculatePosition,
    getRotationKeyframes,
    getAnimationStyle,
  };
};

// Component to render a single rotate item
interface RotateItemProps {
  item: RotateItem;
  calculatePosition: (item: RotateItem) => any;
  getAnimationStyle: (item: RotateItem) => any;
}

export const RotateItemComponent: React.FC<RotateItemProps> = ({
  item,
  calculatePosition,
  getAnimationStyle,
}) => {
  if (!item.exists || !item.imageSrc) return null;

  const positionStyle = calculatePosition(item);
  const animationStyle = getAnimationStyle(item);

  return (
    <div
      className={`rotate-item rotate-item-${item.code}`}
      style={{
        position: 'absolute',
        ...positionStyle,
        ...animationStyle,
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