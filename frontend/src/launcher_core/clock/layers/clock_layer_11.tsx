//==============================================
// CLOCK LAYER 11 COMPONENT - MINUTE HAND SPECIALIST
//==============================================
// DETAILED DESCRIPTION:
// Optimized for minute hand mechanics with smooth minute progression,
// enhanced precision, and visual clarity. Complements hour hand functionality
// while maintaining independent operation.
// TWEAK: Modify MINUTE_HAND_SETTINGS for different minute display behaviors.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 11;

// Minute hand specific optimizations  
const MINUTE_HAND_SETTINGS = {
  // Smooth minute progression with second integration
  smoothProgression: true,
  secondIntegration: true,
  
  // Visual distinction from hour hand
  handEffects: {
    shadow: true,       // Consistent with hour hand
    glow: false,        // Keep clean for readability
    pulse: false,       // No animations for precision
  },
  
  // Positioning for minute hands (typically longer than hour)
  positioning: {
    pivotX: 50,         // Center horizontally  
    pivotY: 90,         // Closer to bottom than hour hand
    centerOffset: 0,    // No offset from clock center
  },
  
  // Layer ordering
  layerPriority: 'above-hour', // Should render above hour hand
};

export const ClockLayer11: React.FC<ClockLayerProps> = (props) => {
  
  // Optimize configuration for minute hand functionality
  const minuteHandConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Layer 11: Minute Hand Optimization
    console.log(`Layer 11: Configuring minute hand for ${config.itemCode}`);
    
    // Force minute hand configuration
    config.handType = 'minute';
    config.handRotation = 'ROTATION1'; // Minute hands always use rotation1
    
    // Minute hands don't need timezone (inherit from system time)
    if (config.timezone) {
      config.timezone.enabled = 'no'; // Use system time directly
    }
    
    // Optimize rotation1 for minute hand mechanics
    if (config.rotation1) {
      config.rotation1.enabled = 'yes';
      config.rotation1.itemAxisX = MINUTE_HAND_SETTINGS.positioning.pivotX;
      config.rotation1.itemAxisY = MINUTE_HAND_SETTINGS.positioning.pivotY;
      config.rotation1.itemPositionX = MINUTE_HAND_SETTINGS.positioning.centerOffset;
      config.rotation1.itemPositionY = MINUTE_HAND_SETTINGS.positioning.centerOffset;
    }
    
    // Disable rotation2 for pure clock hand functionality
    if (config.rotation2) {
      config.rotation2.enabled = 'no';
    }
    
    // Apply minute hand visual effects
    Object.entries(MINUTE_HAND_SETTINGS.handEffects).forEach(([effect, enabled]) => {
      switch (effect) {
        case 'shadow':
          if (enabled) config.shadow = 'yes';
          break;
        case 'glow':
          if (!enabled) config.glow = 'no';
          break;
        case 'pulse':  
          if (!enabled) config.pulse = 'no';
          break;
      }
    });
    
    // Ensure proper layer ordering
    if (config.itemLayer <= 10) {
      console.warn(`Layer 11: Adjusting layer order to be above hour hand`);
      config.itemLayer = 11;
    }
    
    return config;
  }, [props.config]);
  
  return (
    <ClockLayer01
      {...props}
      config={minuteHandConfig}
      
      // Minute hand specific error handling
      onError={(error) => {
        console.error(`Layer 11 (Minute Hand) error: ${error}`);
        props.onError?.(error);
      }}
    />
  );
};

export default ClockLayer11;