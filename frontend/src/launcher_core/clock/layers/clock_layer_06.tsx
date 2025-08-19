//==============================================
// CLOCK LAYER 06 COMPONENT - PHASE 3 ENHANCED
//==============================================
// DETAILED DESCRIPTION:
// Phase 3 enhanced layer with dual rotation system support, independent
// configuration, and optimized performance. Features advanced orbital
// mechanics and smooth animation capabilities.

import React, { useMemo } from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';
import { RotateItemConfig } from '../../../types/launcher.types';

const LAYER_ID = 6;

export const ClockLayer06: React.FC<ClockLayerProps> = (props) => {
  
  const enhancedConfig = useMemo((): RotateItemConfig => {
    const config = { ...props.config };
    
    // Layer 06 optimizations
    if (config.rotation2?.enabled === 'yes') {
      // Optimize orbital radius for smooth motion
      if (config.rotation2.itemPositionX && config.rotation2.itemPositionX < 30) {
        config.rotation2.itemPositionX = 60; // Minimum effective orbital radius
      }
    }
    
    return config;
  }, [props.config]);
  
  return <ClockLayer01 {...props} config={enhancedConfig} />;
};

export default ClockLayer06;