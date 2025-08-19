//==============================================
// CLOCK LAYER 10 COMPONENT - HOUR HAND SPECIALIST  
//==============================================
// DETAILED DESCRIPTION:
// Specialized for hour hand mechanics with timezone support, smooth 24-hour
// rotation, and enhanced clock hand positioning. Optimized for accurate
// timekeeping and visual precision.
// TWEAK: Modify HOUR_HAND_SETTINGS for different time display behaviors.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 10;

// Hour hand specific optimizations
const HOUR_HAND_SETTINGS = {
  // Smooth hour progression
  smoothProgression: true,
  
  // Enhanced timezone handling
  timezoneAware: true,
  defaultTimezone: 0, // UTC
  
  // Visual enhancements for clock hands
  handEffects: {
    shadow: true,       // Enhanced readability
    glow: false,        // Keep clean for time reading
    pulse: false,       // No distracting animations
  },
  
  // Positioning optimizations
  positioning: {
    // Optimal pivot point for hour hands
    pivotX: 50,         // Center horizontally
    pivotY: 85,         // Near bottom for traditional clock hands
    centerOffset: 0,    // No offset from clock center
  },
  
  // Performance settings
  updateFrequency: 'clock-sync', // Sync with clock updates
};

export const ClockLayer10: React.FC<ClockLayerProps> = (props) => {
  
  // Optimize configuration for hour hand functionality
  const hourHandConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Layer 10: Hour Hand Optimization
    console.log(`Layer 10: Configuring hour hand for ${config.itemCode}`);
    
    // Force hour hand configuration
    config.handType = 'hour';
    config.handRotation = 'ROTATION1'; // Hour hands always use rotation1
    
    // Configure timezone if not set
    if (!config.timezone || config.timezone.enabled === 'no') {
      config.timezone = {
        enabled: HOUR_HAND_SETTINGS.timezoneAware ? 'yes' : 'no',
        utcOffset: HOUR_HAND_SETTINGS.defaultTimezone,
        use24Hour: 'yes', // Default to 24-hour mode
      };
    }
    
    // Optimize rotation1 for hour hand mechanics
    if (config.rotation1) {
      config.rotation1.enabled = 'yes';
      config.rotation1.itemAxisX = HOUR_HAND_SETTINGS.positioning.pivotX;
      config.rotation1.itemAxisY = HOUR_HAND_SETTINGS.positioning.pivotY;
      config.rotation1.itemPositionX = HOUR_HAND_SETTINGS.positioning.centerOffset;
      config.rotation1.itemPositionY = HOUR_HAND_SETTINGS.positioning.centerOffset;
      // rotationSpeed and rotationWay are handled by clock system
    }
    
    // Disable rotation2 for pure clock hand functionality
    if (config.rotation2) {
      config.rotation2.enabled = 'no';
    }
    
    // Apply hour hand visual effects
    Object.entries(HOUR_HAND_SETTINGS.handEffects).forEach(([effect, enabled]) => {
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
    
    return config;
  }, [props.config]);
  
  return (
    <ClockLayer01
      {...props}
      config={hourHandConfig}
      
      // Hour hand specific error handling
      onError={(error) => {
        console.error(`Layer 10 (Hour Hand) error: ${error}`);
        props.onError?.(error);
      }}
    />
  );
};

export default ClockLayer10;