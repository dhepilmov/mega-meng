import React, { useEffect } from 'react';
import { RotateItem } from './rotate_logic';
import { RotationConfig } from './rotate_config';

interface RotateAnimProps {
  items: RotateItem[];
  clockState?: {
    hourAngle: number;
    minuteAngle: number;
    secondAngle: number;
  };
}

export const RotateAnim: React.FC<RotateAnimProps> = ({ items, clockState }) => {
  useEffect(() => {
    // Create and inject CSS animations for each item
    const styleElement = document.createElement('style');
    styleElement.id = 'rotate-animations';
    
    // Remove existing style element if it exists
    const existingStyle = document.getElementById('rotate-animations');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Helper function to check if item is a clock hand
    const isClockHand = (item: RotateItem): boolean => {
      return item.handType !== null && item.handType !== undefined && item.handRotation !== null;
    };

    // Generate CSS keyframes for all items
    let cssContent = '';
    
    items.forEach(item => {
      if (item.exists && item.itemName) {
        
        // Skip CSS animations for clock hands - they're controlled by real-time transforms
        if (isClockHand(item)) {
          // Clock hands get smooth real-time updates via transform in rotate_logic
          // No CSS animation needed - requestAnimationFrame handles it
          cssContent += `
            .rotate-item-${item.itemCode} {
              /* Clock hand - no CSS animation, controlled by real-time transforms */
              transition: none;
            }
          `;
          return;
        }

        // Generate animation for non-hand items (decorative elements)
        // Generate animation for rotation1
        if (item.rotation1.enabled === 'yes' && item.rotation1.rotationWay && item.rotation1.rotationWay !== 'no') {
          const direction1 = item.rotation1.rotationWay === '+' ? '360deg' : '-360deg';
          const animationName1 = `rotate1-${item.itemCode}`;
          
          cssContent += `
            @keyframes ${animationName1} {
              from {
                transform: translate(-50%, -50%) 
                          translate(${item.rotation1.itemPositionX}%, ${item.rotation1.itemPositionY}%) 
                          rotate(${item.rotation1.itemTiltPosition}deg);
              }
              to {
                transform: translate(-50%, -50%) 
                          translate(${item.rotation1.itemPositionX}%, ${item.rotation1.itemPositionY}%) 
                          rotate(calc(${item.rotation1.itemTiltPosition}deg + ${direction1}));
              }
            }
          `;
        }

        // Generate animation for rotation2
        if (item.rotation2.enabled === 'yes' && item.rotation2.rotationWay && item.rotation2.rotationWay !== 'no') {
          const direction2 = item.rotation2.rotationWay === '+' ? '360deg' : '-360deg';
          const animationName2 = `rotate2-${item.itemCode}`;
          
          cssContent += `
            @keyframes ${animationName2} {
              from {
                transform: translate(-50%, -50%) 
                          translate(${item.rotation2.itemPositionX}%, ${item.rotation2.itemPositionY}%) 
                          rotate(${item.rotation2.itemTiltPosition}deg);
              }
              to {
                transform: translate(-50%, -50%) 
                          translate(${item.rotation2.itemPositionX}%, ${item.rotation2.itemPositionY}%) 
                          rotate(calc(${item.rotation2.itemTiltPosition}deg + ${direction2}));
              }
            }
          `;
        }

        // Apply animations to the element (only for non-hand items)
        let animations: string[] = [];
        
        if (item.rotation1.enabled === 'yes' && item.rotation1.rotationWay && item.rotation1.rotationWay !== 'no') {
          animations.push(`rotate1-${item.itemCode} ${item.rotation1.rotationSpeed}s linear infinite`);
        }
        
        if (item.rotation2.enabled === 'yes' && item.rotation2.rotationWay && item.rotation2.rotationWay !== 'no') {
          animations.push(`rotate2-${item.itemCode} ${item.rotation2.rotationSpeed}s linear infinite`);
        }

        if (animations.length > 0) {
          cssContent += `
            .rotate-item-${item.itemCode} {
              animation: ${animations.join(', ')};
              transform-origin: ${item.rotation1.enabled === 'yes' ? item.rotation1.itemAxisX : item.rotation2.itemAxisX}% ${item.rotation1.enabled === 'yes' ? item.rotation1.itemAxisY : item.rotation2.itemAxisY}%;
            }
          `;
        }
      }
    });

    // Add global styles for rotate items
    cssContent += `
      .rotate-item {
        pointer-events: auto;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      
      .rotate-item img {
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        pointer-events: none;
      }
      
      /* Smooth transitions for better performance */
      .rotate-item {
        will-change: transform;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
    `;

    styleElement.textContent = cssContent;
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      const styleToRemove = document.getElementById('rotate-animations');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [items, clockState]); // Include clockState in dependencies

  return null; // This component only manages CSS, doesn't render anything
};