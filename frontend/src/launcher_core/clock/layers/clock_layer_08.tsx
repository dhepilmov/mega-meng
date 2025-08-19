//==============================================
// CLOCK LAYER 08 COMPONENT
//==============================================
// DETAILED DESCRIPTION:
// Individual clock layer component with independent configuration, effects, rotations,
// and clock functionality. Each layer operates independently with its own settings.
// TWEAK: Modify for layer-specific behaviors by adjusting the layerId constant.

import React from 'react';
import { ClockLayerProps, ClockLayer01 } from './clock_layer_01';

const LAYER_ID = 8;

export const ClockLayer08: React.FC<ClockLayerProps> = (props) => {
  return <ClockLayer01 {...props} />;
};

export default ClockLayer08;