//==============================================
// TOP BUTTON CONTAINER COMPONENT  
//==============================================
// DETAILED DESCRIPTION:
// Container component for top navigation buttons with development stroke indicators.
// Extracted from launcher_screen.tsx for better component organization.
// TWEAK:
// Adjust positioning and spacing in layer.styles.ts.
// Modify development indicators and stroke visibility.
// Change container layout and alignment.

import React from 'react';
import { TopButtonContainerProps } from '../types/launcher.types';
import { 
  getTopButtonContainerStyles,
  getContainerIndicatorStyles
} from '../styles/layer.styles';

export const TopButtonContainer: React.FC<TopButtonContainerProps> = ({ 
  children, 
  showStroke = false,
  position = 'top-right'
}) => {
  const containerStyle = {
    ...getTopButtonContainerStyles(showStroke),
    // Adjust positioning based on position prop
    ...(position === 'top-left' && { left: 20, right: 'auto' }),
    ...(position === 'bottom-right' && { top: 'auto', bottom: 20 }),
    ...(position === 'bottom-left' && { top: 'auto', bottom: 20, left: 20, right: 'auto' }),
  };

  return (
    <div 
      style={containerStyle}
      data-position={position}
      data-testid="top-button-container"
    >
      {children}
      
      {/* Container Size Indicator - Development Aid */}
      {showStroke && (
        <div 
          style={getContainerIndicatorStyles()}
          data-testid="container-indicator"
        >
          Button Container ({position})
        </div>
      )}
    </div>
  );
};

export default TopButtonContainer;