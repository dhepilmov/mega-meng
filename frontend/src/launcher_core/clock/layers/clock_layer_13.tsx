//==============================================
// CLOCK LAYER 13 COMPONENT - PHASE 3 ENHANCED
//==============================================
// DETAILED DESCRIPTION:
// Top-tier layer with Phase 3 dual rotation system. Positioned above
// clock hands for decorative elements and advanced visual effects.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 13;

export const ClockLayer13: React.FC<ClockLayerProps> = (props) => {
  
  const enhancedConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Top-layer enhancements
    if (config.transparent === 'no') {
      // For top layers, consider transparency for layering effects
      console.log(`Layer 13: Consider transparency for ${config.itemCode}`);
    }
    
    return config;
  }, [props.config]);
  
  return <ClockLayer01 {...props} config={enhancedConfig} />;
};

export default ClockLayer13;