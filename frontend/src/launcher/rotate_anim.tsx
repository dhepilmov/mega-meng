import React, { useEffect } from 'react';
import { RotateItem } from './rotate_logic';

interface RotateAnimProps {
  items: RotateItem[];
}

export const RotateAnim: React.FC<RotateAnimProps> = ({ items }) => {
  useEffect(() => {
    // Create and inject CSS animations for each item
    const styleElement = document.createElement('style');
    styleElement.id = 'rotate-animations';
    
    // Remove existing style element if it exists
    const existingStyle = document.getElementById('rotate-animations');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Generate CSS keyframes for all items
    let cssContent = '';
    
    items.forEach(item => {
      if (item.display === 'yes' && item.exists) {
        const direction = item.rotation === 'clockwise' ? '360deg' : '-360deg';
        
        cssContent += `
          @keyframes rotate-${item.code} {
            from {
              transform: translate(-50%, -50%) rotate(${item.tiltPosition}deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(calc(${item.tiltPosition}deg + ${direction}));
            }
          }
          
          .rotate-item-${item.code} {
            animation: rotate-${item.code} ${item.rotationSpeed}s linear infinite;
          }
          
          .rotate-item-${item.code}:hover {
            animation-play-state: paused;
          }
        `;
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
  }, [items]);

  return null; // This component only manages CSS, doesn't render anything
};

// Hook for controlling animation state
export const useRotateAnimation = () => {
  const [isPaused, setIsPaused] = React.useState(false);
  const [globalSpeed, setGlobalSpeed] = React.useState(1);

  const pauseAllAnimations = () => {
    setIsPaused(true);
    const rotateItems = document.querySelectorAll('.rotate-item');
    rotateItems.forEach(item => {
      (item as HTMLElement).style.animationPlayState = 'paused';
    });
  };

  const resumeAllAnimations = () => {
    setIsPaused(false);
    const rotateItems = document.querySelectorAll('.rotate-item');
    rotateItems.forEach(item => {
      (item as HTMLElement).style.animationPlayState = 'running';
    });
  };

  const toggleAnimations = () => {
    if (isPaused) {
      resumeAllAnimations();
    } else {
      pauseAllAnimations();
    }
  };

  const setAnimationSpeed = (speed: number) => {
    setGlobalSpeed(speed);
    const rotateItems = document.querySelectorAll('.rotate-item');
    rotateItems.forEach(item => {
      (item as HTMLElement).style.animationDuration = `${speed}s`;
    });
  };

  return {
    isPaused,
    globalSpeed,
    pauseAllAnimations,
    resumeAllAnimations,
    toggleAnimations,
    setAnimationSpeed,
  };
};