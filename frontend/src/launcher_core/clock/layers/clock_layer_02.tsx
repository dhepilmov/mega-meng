//==============================================
// CLOCK LAYER 02 COMPONENT - ENHANCED FOR PHASE 3
//==============================================
// DETAILED DESCRIPTION:
// Independent clock layer component with its own dual rotation system,
// effects processing, and performance optimization. Demonstrates enhanced
// layer independence with custom behaviors and orbital mechanics.
// TWEAK: Modify LAYER_SPECIFIC_ENHANCEMENTS for layer 02 custom behaviors.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 2;

// Layer-specific enhancements for Layer 02
const LAYER_SPECIFIC_ENHANCEMENTS = {
  // Enhanced orbital mechanics for decorative elements
  orbitalBoost: 1.2,
  
  // Custom effects combinations
  preferredEffects: {
    glow: true,
    pulse: false,
    shadow: false,
  },
  
  // Performance optimizations
  updateFrequency: 'normal' as 'low' | 'normal' | 'high',
  
  // Custom transform origin preferences
  transformBehavior: 'orbital-optimized' as 'standard' | 'orbital-optimized' | 'spin-optimized',
};

export const ClockLayer02: React.FC<ClockLayerProps> = (props) => {
  
  // Apply layer-specific configuration enhancements
  const enhancedConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Layer 02: Enhanced orbital mechanics
    if (config.rotation2?.enabled === 'yes') {
      // Boost orbital radius for more dynamic movement
      if (config.rotation2.itemPositionX) {
        config.rotation2.itemPositionX *= LAYER_SPECIFIC_ENHANCEMENTS.orbitalBoost;
      }
      
      // Optimize rotation speed for smooth orbital motion
      if (config.rotation2.rotationSpeed > 0) {
        config.rotation2.rotationSpeed = Math.max(
          config.rotation2.rotationSpeed * 0.8, // Slightly faster orbital motion
          60 // Minimum 1 minute per orbit
        );
      }
    }
    
    // Apply preferred effects if not explicitly set
    if (config.glow === 'no' && LAYER_SPECIFIC_ENHANCEMENTS.preferredEffects.glow) {
      config.glow = 'yes';
    }
    
    return config;
  }, [props.config]);
  
  // Enhanced container size calculation for orbital mechanics
  const enhancedContainerSize = useMemo(() => {
    if (LAYER_SPECIFIC_ENHANCEMENTS.transformBehavior === 'orbital-optimized') {
      return {
        width: props.containerSize.width * 1.1,
        height: props.containerSize.height * 1.1,
      };
    }
    return props.containerSize;
  }, [props.containerSize]);
  
  return (
    <ClockLayer01
      {...props}
      config={enhancedConfig}
      containerSize={enhancedContainerSize}
      
      // Custom error handling for Layer 02
      onError={(error) => {
        console.warn(`Layer 02 specific error: ${error}`);
        props.onError?.(error);
      }}
    />
  );
};

export default ClockLayer02;