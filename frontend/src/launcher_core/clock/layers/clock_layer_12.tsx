//==============================================
// CLOCK LAYER 12 COMPONENT - SECOND HAND SPECIALIST
//==============================================
// DETAILED DESCRIPTION:
// High-precision second hand with smooth sweeping motion, enhanced visual
// feedback, and performance optimization for 60fps updates. Top layer
// for maximum visibility and precision timing display.
// TWEAK: Modify SECOND_HAND_SETTINGS for different second display behaviors.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 12;

// Second hand specific optimizations
const SECOND_HAND_SETTINGS = {
  // Ultra-smooth second progression
  ultraSmoothProgression: true,
  millisecondPrecision: true,
  
  // Enhanced visual feedback for seconds
  handEffects: {
    shadow: false,      // Lighter appearance for quick movement
    glow: true,         // Enhanced visibility for thin second hand
    pulse: false,       // No pulse to avoid motion blur
  },
  
  // Positioning for second hands (typically thinnest/longest)
  positioning: {
    pivotX: 50,         // Perfect center
    pivotY: 95,         // Very close to bottom
    centerOffset: 0,    // No offset from center
  },
  
  // Performance optimization for high-frequency updates
  performance: {
    updateMode: 'high-frequency',
    smoothingEnabled: true,
    motionBlurPrevention: true,
  },
  
  // Layer priority (top-most for visibility)
  layerPriority: 'topmost',
};

export const ClockLayer12: React.FC<ClockLayerProps> = (props) => {
  
  // Optimize configuration for second hand functionality
  const secondHandConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Layer 12: Second Hand Optimization
    console.log(`Layer 12: Configuring second hand for ${config.itemCode}`);
    
    // Force second hand configuration
    config.handType = 'second';
    config.handRotation = 'ROTATION1'; // Second hands always use rotation1
    
    // Second hands use system time directly (no timezone needed)
    if (config.timezone) {
      config.timezone.enabled = 'no';
    }
    
    // Optimize rotation1 for second hand mechanics
    if (config.rotation1) {
      config.rotation1.enabled = 'yes';
      config.rotation1.itemAxisX = SECOND_HAND_SETTINGS.positioning.pivotX;
      config.rotation1.itemAxisY = SECOND_HAND_SETTINGS.positioning.pivotY;
      config.rotation1.itemPositionX = SECOND_HAND_SETTINGS.positioning.centerOffset;
      config.rotation1.itemPositionY = SECOND_HAND_SETTINGS.positioning.centerOffset;
    }
    
    // Disable rotation2 for pure clock hand functionality
    if (config.rotation2) {
      config.rotation2.enabled = 'no';
    }
    
    // Apply second hand visual effects
    Object.entries(SECOND_HAND_SETTINGS.handEffects).forEach(([effect, enabled]) => {
      switch (effect) {
        case 'shadow':
          config.shadow = enabled ? 'yes' : 'no';
          break;
        case 'glow':
          config.glow = enabled ? 'yes' : 'no';
          break;
        case 'pulse':
          config.pulse = enabled ? 'yes' : 'no';
          break;
      }
    });
    
    // Ensure top layer positioning
    if (config.itemLayer <= 11) {
      console.warn(`Layer 12: Adjusting layer order to be topmost`);
      config.itemLayer = 12;
    }
    
    return config;
  }, [props.config]);
  
  return (
    <ClockLayer01
      {...props}
      config={secondHandConfig}
      
      // Second hand specific error handling
      onError={(error) => {
        console.error(`Layer 12 (Second Hand) error: ${error}`);
        props.onError?.(error);
      }}
    />
  );
};

export default ClockLayer12;