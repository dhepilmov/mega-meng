//==============================================
// MARKER BUTTON COMPONENT
//==============================================
// DETAILED DESCRIPTION:
// Adjustable button component with visual development aids for sizing and positioning.
// Extracted from launcher_screen.tsx marker components section.
// TWEAK:
// Modify button configurations in layer.styles.ts for different sizes.
// Adjust stroke visibility and colors for development needs.
// Change hover effects and animations.

import React from 'react';
import { MarkerButtonProps } from '../types/launcher.types';
import { 
  getButtonWithStroke, 
  getSizeIndicatorStyles,
  BUTTON_CONFIGS,
  STROKE_STYLES
} from '../styles/layer.styles';

export const MarkerButton: React.FC<MarkerButtonProps> = ({
  children,
  onClick,
  type = 'default',
  showStroke = false,
  className = '',
  style = {},
  disabled = false,
}) => {
  const buttonStyle = {
    ...getButtonWithStroke(type, showStroke),
    ...style,
    opacity: disabled ? 0.5 : (showStroke ? STROKE_STYLES[type]?.strokeOpacity || 1 : 1),
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const config = BUTTON_CONFIGS[type] || BUTTON_CONFIGS.default;
  const strokeConfig = STROKE_STYLES[type] || STROKE_STYLES.default;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`hover:bg-opacity-90 hover:scale-105 active:scale-95 ${className}`}
      style={buttonStyle}
      disabled={disabled}
      data-button-type={type}
      aria-label={`${type} button`}
    >
      {children}
      
      {/* Size Indicator Overlay - Development Aid */}
      {showStroke && (
        <div 
          style={getSizeIndicatorStyles(strokeConfig.stroke, config.width, config.height)}
          data-testid="size-indicator"
        >
          {config.width}×{config.height}
        </div>
      )}
    </button>
  );
};

export default MarkerButton;