//==============================================
// DOT MARK COMPONENT
//==============================================
// DETAILED DESCRIPTION:
// Central reference dot component that serves as the center point for all rotating items.
// Extracted from launcher_screen.tsx for better modularity and reusability.
// TWEAK:
// Change size, color, and opacity through props.
// Modify z-index for different layering needs.
// Add animation effects for enhanced visibility during development.

import React from 'react';
import { dotMarkStyles, getDotMarkStyles } from '../styles/layer.styles';
import { DotMarkProps } from '../types/launcher.types';

export const DotMark: React.FC<DotMarkProps> = ({
  visible = false,
  size = 8,
  color = '#666666',
  opacity = 0,
}) => {
  const styles = getDotMarkStyles({
    visible,
    size,
    color,
    opacity,
  });

  return (
    <div 
      style={styles}
      className="dot-mark"
      data-testid="dot-mark"
      aria-label="Center reference point"
    />
  );
};

export default DotMark;