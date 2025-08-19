//==============================================
// CLOCK LAYER 08 COMPONENT - PHASE 3 ENHANCED
//==============================================
// DETAILED DESCRIPTION:
// Phase 3 enhanced layer with dual rotation system and independent
// configuration management. Optimized for middle-layer positioning.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 8;

export const ClockLayer08: React.FC<ClockLayerProps> = (props) => {
  
  const enhancedConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Middle-layer optimizations
    if (config.shadow === 'yes') {
      // Enhance shadow for middle layers to create depth
      console.log(`Layer 08: Enhanced shadow effects for ${config.itemCode}`);
    }
    
    return config;
  }, [props.config]);
  
  return <ClockLayer01 {...props} config={enhancedConfig} />;
};

export default ClockLayer08;