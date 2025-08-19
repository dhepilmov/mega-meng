//==============================================
// CLOCK LAYER 07 COMPONENT - PHASE 3 ENHANCED
//==============================================
// DETAILED DESCRIPTION:
// Phase 3 enhanced layer with dual rotation system support and
// performance optimizations for complex animations.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 7;

export const ClockLayer07: React.FC<ClockLayerProps> = (props) => {
  
  const enhancedConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Apply layer-specific optimizations
    if (config.glow === 'yes' && config.pulse === 'yes') {
      // Optimize conflicting effects
      config.pulse = 'no'; // Prioritize glow over pulse for visual clarity
    }
    
    return config;
  }, [props.config]);
  
  return <ClockLayer01 {...props} config={enhancedConfig} />;
};

export default ClockLayer07;