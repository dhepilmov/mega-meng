import React from 'react';

// ========================================
// BUTTON STROKE STYLES FOR SIZE ADJUSTMENT
// ========================================

// Use these stroke styles to visually adjust button sizes during development
export const buttonStrokeStyles = {
  // Default stroke for buttons - adjust strokeWidth to change visibility
  defaultStroke: {
    stroke: '#ff0000', // Red stroke for visibility - change color as needed
    strokeWidth: 2, // ADJUST THIS VALUE to change stroke thickness (1-5 recommended)
    strokeDasharray: '4,2', // Dashed line pattern - remove for solid line
    strokeOpacity: 0.8 // ADJUST THIS VALUE for stroke transparency (0-1)
  },
  
  // Close button specific stroke
  closeButtonStroke: {
    stroke: '#ff4444', // Light red for close button
    strokeWidth: 2, // ADJUST CLOSE BUTTON STROKE WIDTH HERE
    strokeDasharray: '2,2',
    strokeOpacity: 0.7
  },
  
  // New button (left of close) specific stroke
  newButtonStroke: {
    stroke: '#44ff44', // Green for new button
    strokeWidth: 2, // ADJUST NEW BUTTON STROKE WIDTH HERE
    strokeDasharray: '3,1',
    strokeOpacity: 0.7
  },
  
  // Hover state stroke
  hoverStroke: {
    stroke: '#ffff44', // Yellow for hover state
    strokeWidth: 3, // ADJUST HOVER STROKE WIDTH HERE
    strokeOpacity: 1
  }
};

// ========================================
// BUTTON SIZE ADJUSTMENT CONSTANTS
// ========================================

export const buttonSizes = {
  // Close button dimensions - ADJUST THESE VALUES TO CHANGE CLOSE BUTTON SIZE
  closeButton: {
    width: 48, // ADJUST WIDTH HERE (pixels)
    height: 48, // ADJUST HEIGHT HERE (pixels) 
    padding: 12, // ADJUST INTERNAL PADDING HERE
    fontSize: 24 // ADJUST ICON/TEXT SIZE HERE
  },
  
  // New button dimensions - ADJUST THESE VALUES TO CHANGE NEW BUTTON SIZE
  newButton: {
    width: 48, // ADJUST WIDTH HERE (pixels)
    height: 48, // ADJUST HEIGHT HERE (pixels)
    padding: 12, // ADJUST INTERNAL PADDING HERE
    fontSize: 20 // ADJUST ICON/TEXT SIZE HERE
  },
  
  // Button spacing - ADJUST SPACING BETWEEN BUTTONS
  spacing: {
    gap: 12, // ADJUST GAP BETWEEN BUTTONS HERE (pixels)
    marginFromEdge: 20 // ADJUST DISTANCE FROM SCREEN EDGE HERE (pixels)
  }
};

// ========================================
// BUTTON COMPONENT WITH ADJUSTABLE STROKE
// ========================================

interface MarkerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'close' | 'new' | 'default';
  showStroke?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const MarkerButton: React.FC<MarkerButtonProps> = ({
  children,
  onClick,
  type = 'default',
  showStroke = true, // SET TO FALSE TO HIDE STROKE IN PRODUCTION
  className = '',
  style = {}
}) => {
  const sizeConfig = type === 'close' ? buttonSizes.closeButton : 
                    type === 'new' ? buttonSizes.newButton : 
                    buttonSizes.closeButton;
                    
  const strokeConfig = type === 'close' ? buttonStrokeStyles.closeButtonStroke :
                      type === 'new' ? buttonStrokeStyles.newButtonStroke :
                      buttonStrokeStyles.defaultStroke;

  const buttonStyle: React.CSSProperties = {
    // SIZE CONFIGURATION - ADJUST THESE IN buttonSizes OBJECT ABOVE
    width: sizeConfig.width,
    height: sizeConfig.height,
    padding: sizeConfig.padding,
    fontSize: sizeConfig.fontSize,
    
    // BASE STYLING
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    
    // STROKE STYLING - TOGGLE WITH showStroke PROP
    ...(showStroke && {
      border: `${strokeConfig.strokeWidth}px ${strokeConfig.strokeDasharray ? 'dashed' : 'solid'} ${strokeConfig.stroke}`,
      opacity: strokeConfig.strokeOpacity
    }),
    
    // MERGE WITH PASSED STYLE
    ...style
  };

  return (
    <button
      onClick={onClick}
      className={`hover:bg-opacity-90 hover:scale-105 active:scale-95 ${className}`}
      style={buttonStyle}
    >
      {children}
      
      {/* SIZE INDICATOR OVERLAY - REMOVE IN PRODUCTION */}
      {showStroke && (
        <div 
          style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            color: strokeConfig.stroke,
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '2px 4px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
          }}
        >
          {sizeConfig.width}×{sizeConfig.height}
        </div>
      )}
    </button>
  );
};

// ========================================
// TOP BUTTON CONTAINER COMPONENT
// ========================================

interface TopButtonContainerProps {
  children: React.ReactNode;
  showStroke?: boolean;
}

export const TopButtonContainer: React.FC<TopButtonContainerProps> = ({ 
  children, 
  showStroke = true 
}) => {
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: buttonSizes.spacing.marginFromEdge, // ADJUST TOP MARGIN HERE
    right: buttonSizes.spacing.marginFromEdge, // ADJUST RIGHT MARGIN HERE
    display: 'flex',
    alignItems: 'center',
    gap: buttonSizes.spacing.gap, // ADJUST GAP BETWEEN BUTTONS HERE
    zIndex: 9999,
    
    // CONTAINER STROKE FOR VISUAL ADJUSTMENT
    ...(showStroke && {
      border: '1px dashed #888',
      padding: '8px',
      borderRadius: '8px',
      backgroundColor: 'rgba(128,128,128,0.2)'
    })
  };

  return (
    <div style={containerStyle}>
      {children}
      
      {/* CONTAINER SIZE INDICATOR */}
      {showStroke && (
        <div 
          style={{
            position: 'absolute',
            top: '-25px',
            left: '0',
            fontSize: '10px',
            color: '#888',
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '2px 6px',
            borderRadius: '4px',
            whiteSpace: 'nowrap'
          }}
        >
          Button Container
        </div>
      )}
    </div>
  );
};

// ========================================
// USAGE EXAMPLE
// ========================================

export const TopButtonsExample: React.FC = () => {
  return (
    <TopButtonContainer showStroke={true}>
      {/* New Button - Left side */}
      <MarkerButton 
        type="new" 
        showStroke={true}
        onClick={() => console.log('New button clicked')}
      >
        ⚙️
      </MarkerButton>
      
      {/* Close Button - Right side */}
      <MarkerButton 
        type="close" 
        showStroke={true}
        onClick={() => console.log('Close button clicked')}
      >
        ✕
      </MarkerButton>
    </TopButtonContainer>
  );
};

export default MarkerButton;