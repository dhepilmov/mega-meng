//==============================================
// CLOCK LAYER 03 COMPONENT - SPIN MECHANICS SPECIALIST
//==============================================
// DETAILED DESCRIPTION:
// Specialized layer for rotation1 (spin) mechanics with enhanced performance
// and visual effects. Optimized for fast spinning elements and decorative
// components that require smooth rotation animations.
// TWEAK: Modify SPIN_ENHANCEMENTS for different spin behaviors.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 3;

// Spin-specific enhancements for Layer 03
const SPIN_ENHANCEMENTS = {
  // Smooth rotation optimizations
  spinSmoothing: true,
  
  // Preferred rotation speeds (in seconds)
  fastSpin: 5,      // 5 seconds per rotation
  mediumSpin: 15,   // 15 seconds per rotation
  slowSpin: 60,     // 1 minute per rotation
  
  // Enhanced effects for spinning elements
  spinEffects: {
    glow: true,
    shadow: true,
    pulse: false, // Disable pulse for spin elements to avoid conflicts
  },
  
  // Transform origin optimizations
  centerSpinOrigin: '50% 50%',
  offsetSpinOrigin: '30% 70%', // For interesting off-center spins
};

export const ClockLayer03: React.FC<ClockLayerProps> = (props) => {
  
  // Apply spin-specific configuration enhancements
  const spinOptimizedConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Layer 03: Enhanced spin mechanics
    if (config.rotation1?.enabled === 'yes') {
      // Optimize rotation speed for smooth spinning
      if (config.rotation1.rotationSpeed) {
        // Quantize to optimal spin speeds
        const speed = config.rotation1.rotationSpeed;
        if (speed <= 8) {
          config.rotation1.rotationSpeed = SPIN_ENHANCEMENTS.fastSpin;
        } else if (speed <= 30) {
          config.rotation1.rotationSpeed = SPIN_ENHANCEMENTS.mediumSpin;
        } else {
          config.rotation1.rotationSpeed = SPIN_ENHANCEMENTS.slowSpin;
        }
      }
      
      // Optimize transform origin for better spin appearance
      if (config.rotation1.itemAxisX === 50 && config.rotation1.itemAxisY === 50) {
        // For center spinning, keep center origin
      } else {
        // For offset spinning, ensure transform origin is properly calculated
        config.rotation1.itemAxisX = Math.max(0, Math.min(100, config.rotation1.itemAxisX || 50));
        config.rotation1.itemAxisY = Math.max(0, Math.min(100, config.rotation1.itemAxisY || 50));
      }
    }
    
    // Apply spin-specific effects
    if (config.rotation1?.enabled === 'yes') {
      if (SPIN_ENHANCEMENTS.spinEffects.glow && config.glow !== 'yes') {
        config.glow = 'yes';
      }
      if (SPIN_ENHANCEMENTS.spinEffects.shadow && config.shadow !== 'yes') {
        config.shadow = 'yes';
      }
      if (!SPIN_ENHANCEMENTS.spinEffects.pulse && config.pulse === 'yes') {
        config.pulse = 'no'; // Disable conflicting effects
      }
    }
    
    // Disable rotation2 if rotation1 is active (pure spin mode)
    if (config.rotation1?.enabled === 'yes' && config.rotation2?.enabled === 'yes') {
      console.log(`Layer 03: Disabling rotation2 for pure spin mode (${config.itemCode})`);
      config.rotation2.enabled = 'no';
    }
    
    return config;
  }, [props.config]);
  
  return (
    <ClockLayer01
      {...props}
      config={spinOptimizedConfig}
      
      // Enhanced error handling for spin mechanics
      onError={(error) => {
        console.warn(`Layer 03 (Spin Specialist) error: ${error}`);
        props.onError?.(error);
      }}
    />
  );
};

export default ClockLayer03;