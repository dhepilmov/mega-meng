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

// SAFE PROPERTY ACCESS UTILITIES for animation
const safeString = (value: any, defaultValue: string = 'no'): string => {
  return value !== undefined && value !== null ? String(value) : defaultValue;
};

const safeNumber = (value: any, defaultValue: number = 0): number => {
  return value !== undefined && value !== null && !isNaN(Number(value)) ? Number(value) : defaultValue;
};

const safeObject = <T>(value: any, defaultValue: T | null = null): T | null => {
  return value !== undefined && value !== null ? value : defaultValue;
};

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

    // Helper function to check if item is a clock hand (with safe property access)
    const isClockHand = (item: RotateItem): boolean => {
      const handType = safeObject(item.handType, null);
      const handRotation = safeObject(item.handRotation, null);
      return handType !== null && handType !== undefined && handRotation !== null;
    };

    // Generate CSS keyframes for all items
    let cssContent = '';
    
    items.forEach(item => {
      const itemExists = Boolean(item.exists);
      const itemName = safeString(item.itemName, '');
      const itemCode = safeString(item.itemCode, '');
      
      if (itemExists && itemName) {
        
        // Skip CSS animations for clock hands - they're controlled by real-time transforms
        if (isClockHand(item)) {
          // Clock hands get smooth real-time updates via transform in rotate_logic
          // No CSS animation needed - requestAnimationFrame handles it
          cssContent += `
            .rotate-item-${itemCode} {
              /* Clock hand - no CSS animation, controlled by real-time transforms */
              transition: none;
            }
          `;
          return;
        }

        // Generate animation for non-hand items (decorative elements)
        // Generate animation for rotation1 with safe property access
        const rotation1Enabled = safeString(item.rotation1?.enabled, 'no');
        const rotation1Way = safeString(item.rotation1?.rotationWay, 'no');
        
        if (rotation1Enabled === 'yes' && rotation1Way && rotation1Way !== 'no') {
          const direction1 = rotation1Way === '+' ? '360deg' : '-360deg';
          const animationName1 = `rotate1-${itemCode}`;
          const posX1 = safeNumber(item.rotation1?.itemPositionX, 0);
          const posY1 = safeNumber(item.rotation1?.itemPositionY, 0);
          const tilt1 = safeNumber(item.rotation1?.itemTiltPosition, 0);
          
          cssContent += `
            @keyframes ${animationName1} {
              from {
                transform: translate(-50%, -50%) 
                          translate(${posX1}%, ${posY1}%) 
                          rotate(${tilt1}deg);
              }
              to {
                transform: translate(-50%, -50%) 
                          translate(${posX1}%, ${posY1}%) 
                          rotate(calc(${tilt1}deg + ${direction1}));
              }
            }
          `;
        }

        // Generate animation for rotation2 with safe property access
        const rotation2Enabled = safeString(item.rotation2?.enabled, 'no');
        const rotation2Way = safeString(item.rotation2?.rotationWay, 'no');
        
        if (rotation2Enabled === 'yes' && rotation2Way && rotation2Way !== 'no') {
          const direction2 = rotation2Way === '+' ? '360deg' : '-360deg';
          const animationName2 = `rotate2-${itemCode}`;
          const posX2 = safeNumber(item.rotation2?.itemPositionX, 0);
          const posY2 = safeNumber(item.rotation2?.itemPositionY, 0);
          const tilt2 = safeNumber(item.rotation2?.itemTiltPosition, 0);
          
          cssContent += `
            @keyframes ${animationName2} {
              from {
                transform: translate(-50%, -50%) 
                          translate(${posX2}%, ${posY2}%) 
                          rotate(${tilt2}deg);
              }
              to {
                transform: translate(-50%, -50%) 
                          translate(${posX2}%, ${posY2}%) 
                          rotate(calc(${tilt2}deg + ${direction2}));
              }
            }
          `;
        }

        // Apply animations to the element (only for non-hand items)
        let animations: string[] = [];
        
        if (rotation1Enabled === 'yes' && rotation1Way && rotation1Way !== 'no') {
          const speed1 = safeNumber(item.rotation1?.rotationSpeed, 1);
          animations.push(`rotate1-${itemCode} ${speed1}s linear infinite`);
        }
        
        if (rotation2Enabled === 'yes' && rotation2Way && rotation2Way !== 'no') {
          const speed2 = safeNumber(item.rotation2?.rotationSpeed, 1);
          animations.push(`rotate2-${itemCode} ${speed2}s linear infinite`);
        }

        if (animations.length > 0) {
          const axisX = rotation1Enabled === 'yes' ? 
            safeNumber(item.rotation1?.itemAxisX, 50) : 
            safeNumber(item.rotation2?.itemAxisX, 50);
          const axisY = rotation1Enabled === 'yes' ? 
            safeNumber(item.rotation1?.itemAxisY, 50) : 
            safeNumber(item.rotation2?.itemAxisY, 50);
            
          cssContent += `
            .rotate-item-${itemCode} {
              animation: ${animations.join(', ')};
              transform-origin: ${axisX}% ${axisY}%;
            }
          `;
        }
      }
    });

    // Add global styles for rotate items with EFFECT support
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
      
      /* EFFECT animations */
      @keyframes pulse {
        0%, 100% { 
          opacity: 1; 
          transform: scale(1); 
        }
        50% { 
          opacity: 0.7; 
          transform: scale(1.05); 
        }
      }
      
      /* Apply EFFECT styles to items that have render: 'yes' */
      ${items.map(item => {
        const itemCode = safeString(item.itemCode, '');
        const renderEnabled = safeString(item.render, 'no') === 'yes';
        
        if (!renderEnabled) return '';
        
        let effectStyles = '';
        
        // Shadow effect
        if (safeString(item.shadow, 'no') === 'yes') {
          effectStyles += 'filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));';
        }
        
        // Glow effect
        if (safeString(item.glow, 'no') === 'yes') {
          effectStyles += effectStyles ? 
            'filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));' :
            'filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));';
        }
        
        // Transparency effect
        if (safeString(item.transparent, 'no') === 'yes') {
          effectStyles += 'opacity: 0.7;';
        }
        
        // Pulse effect
        if (safeString(item.pulse, 'no') === 'yes') {
          effectStyles += 'animation: pulse 2s ease-in-out infinite;';
        }
        
        return effectStyles ? `
          .rotate-item-${itemCode} {
            ${effectStyles}
          }
        ` : '';
      }).join('')}
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