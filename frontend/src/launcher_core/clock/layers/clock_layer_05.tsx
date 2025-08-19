//==============================================
// CLOCK LAYER 05 COMPONENT - DUAL ROTATION MASTER
//==============================================
// DETAILED DESCRIPTION:
// Master of dual rotation systems - combines rotation1 (spin) and rotation2 (orbital)
// for complex astronomical mechanics and sophisticated visual effects.
// Showcases the full power of Phase 3 dual rotation implementation.
// TWEAK: Modify DUAL_ROTATION_SETTINGS for different complex movement patterns.

import React, { useMemo, useCallback } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 5;

// Dual rotation configuration for sophisticated mechanics
const DUAL_ROTATION_SETTINGS = {
  // Orbital mechanics
  orbital: {
    preferredRadius: 120,    // Default orbital radius
    minRadius: 50,           // Minimum safe radius
    maxRadius: 300,          // Maximum effective radius
    optimalSpeed: 240,       // 4 minutes per orbit
    fastOrbit: 60,          // 1 minute per orbit
    slowOrbit: 600,         // 10 minutes per orbit
  },
  
  // Spin mechanics while orbiting
  spin: {
    counterRotate: true,     // Spin opposite to orbital direction
    syncRatio: 2,           // 2 spins per 1 orbit
    independence: false,     // Link spin to orbital motion
  },
  
  // Visual enhancements for complex motion
  effects: {
    motionBlur: false,      // Disable blur for dual rotation
    glow: true,             // Enhance visibility during complex motion
    shadow: true,           // Add depth perception
    pulse: false,           // Disable to avoid motion conflicts
    trailEffect: false,     // Future: add motion trails
  },
  
  // Performance optimizations
  performance: {
    complexityThreshold: 'high',
    smoothingFactor: 1.5,
    updateOptimization: true,
  },
};

export const ClockLayer05: React.FC<ClockLayerProps> = (props) => {
  
  // Generate optimized dual rotation configuration
  const dualRotationConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Layer 05: Dual Rotation Optimization
    const hasRotation1 = config.rotation1?.enabled === 'yes';
    const hasRotation2 = config.rotation2?.enabled === 'yes';
    
    if (hasRotation1 && hasRotation2) {
      console.log(`Layer 05: Optimizing dual rotation for ${config.itemCode}`);
      
      // Optimize rotation2 (orbital system)
      if (config.rotation2) {
        // Ensure orbital radius is within optimal range
        const radius = config.rotation2.itemPositionX || 0;
        if (radius < DUAL_ROTATION_SETTINGS.orbital.minRadius) {
          config.rotation2.itemPositionX = DUAL_ROTATION_SETTINGS.orbital.preferredRadius;
        } else if (radius > DUAL_ROTATION_SETTINGS.orbital.maxRadius) {
          config.rotation2.itemPositionX = DUAL_ROTATION_SETTINGS.orbital.maxRadius;
        }
        
        // Optimize orbital speed
        if (config.rotation2.rotationSpeed > DUAL_ROTATION_SETTINGS.orbital.slowOrbit) {
          config.rotation2.rotationSpeed = DUAL_ROTATION_SETTINGS.orbital.slowOrbit;
        } else if (config.rotation2.rotationSpeed < DUAL_ROTATION_SETTINGS.orbital.fastOrbit) {
          config.rotation2.rotationSpeed = DUAL_ROTATION_SETTINGS.orbital.fastOrbit;
        }
      }
      
      // Optimize rotation1 (spin system) to complement orbital motion
      if (config.rotation1 && DUAL_ROTATION_SETTINGS.spin.counterRotate) {
        // Set spin direction opposite to orbital direction
        if (config.rotation2?.rotationWay === '+') {
          config.rotation1.rotationWay = '-';
        } else if (config.rotation2?.rotationWay === '-') {
          config.rotation1.rotationWay = '+';
        }
        
        // Sync spin speed to orbital speed
        if (DUAL_ROTATION_SETTINGS.spin.syncRatio && config.rotation2?.rotationSpeed) {
          config.rotation1.rotationSpeed = config.rotation2.rotationSpeed / DUAL_ROTATION_SETTINGS.spin.syncRatio;
        }
      }
    } else if (hasRotation2 && !hasRotation1) {
      // Pure orbital mode - optimize for smooth orbital motion
      console.log(`Layer 05: Pure orbital mode for ${config.itemCode}`);
      if (config.rotation2 && !config.rotation2.itemPositionX) {
        config.rotation2.itemPositionX = DUAL_ROTATION_SETTINGS.orbital.preferredRadius;
      }
    } else if (hasRotation1 && !hasRotation2) {
      // Pure spin mode - optimize for smooth spinning
      console.log(`Layer 05: Pure spin mode for ${config.itemCode}`);
    }
    
    // Apply dual rotation visual effects
    Object.entries(DUAL_ROTATION_SETTINGS.effects).forEach(([effect, enabled]) => {
      switch (effect) {
        case 'glow':
          if (enabled && config.glow !== 'yes') config.glow = 'yes';
          break;
        case 'shadow':
          if (enabled && config.shadow !== 'yes') config.shadow = 'yes';
          break;
        case 'pulse':
          if (!enabled && config.pulse === 'yes') config.pulse = 'no';
          break;
      }
    });
    
    return config;
  }, [props.config]);
  
  // Enhanced error handling for complex dual rotation
  const handleDualRotationError = useCallback((error: string) => {
    console.error(`Layer 05 (Dual Rotation Master) critical error: ${error}`);
    
    // Performance degradation warning
    if (error.includes('performance') || error.includes('lag')) {
      console.warn('Layer 05: Consider simplifying rotation configuration for better performance');
    }
    
    props.onError?.(error);
  }, [props.onError]);
  
  // Enhanced container size for complex orbital mechanics
  const enhancedContainerSize = useMemo(() => {
    const maxRadius = Math.max(
      dualRotationConfig.rotation2?.itemPositionX || 0,
      DUAL_ROTATION_SETTINGS.orbital.preferredRadius
    );
    
    return {
      width: props.containerSize.width + (maxRadius * 2),
      height: props.containerSize.height + (maxRadius * 2),
    };
  }, [props.containerSize, dualRotationConfig.rotation2?.itemPositionX]);
  
  return (
    <ClockLayer01
      {...props}
      config={dualRotationConfig}
      containerSize={enhancedContainerSize}
      onError={handleDualRotationError}
      
      // Force update for complex animations
      forceUpdate={props.forceUpdate}
    />
  );
};

export default ClockLayer05;