//==============================================
// CLOCK LAYER 09 COMPONENT - PHASE 3 ENHANCED
//==============================================
// DETAILED DESCRIPTION:
// Phase 3 enhanced layer positioned just before clock hands.
// Features optimized performance for smooth background animations.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 9;

export const ClockLayer09: React.FC<ClockLayerProps> = (props) => {
  
  const enhancedConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Pre-clock-hand layer optimizations
    if (config.rotation1?.enabled === 'yes' && config.rotation1?.rotationSpeed) {
      // Ensure smooth motion that doesn't interfere with clock hands
      if (config.rotation1.rotationSpeed < 60) {
        config.rotation1.rotationSpeed = 60; // Minimum 1 minute per rotation
      }
    }
    
    return config;
  }, [props.config]);
  
  return <ClockLayer01 {...props} config={enhancedConfig} />;
};

export default ClockLayer09;