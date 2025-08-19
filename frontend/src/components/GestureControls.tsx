//==============================================
// GESTURE CONTROLS COMPONENT
//==============================================
// DETAILED DESCRIPTION:
// UI controls for gesture operations like zoom in/out and reset.
// Provides accessible button alternatives to touch gestures.
// TWEAK:
// Modify control button styles and positioning.
// Add new gesture control operations.
// Change visibility and animation behavior.

import React from 'react';
import { GestureControls as GestureControlsType, GestureState } from '../launcher_core/launcher_core_user_input';

interface GestureControlsProps {
  controls: GestureControlsType;
  gestureState: GestureState;
  visible?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

export const GestureControls: React.FC<GestureControlsProps> = ({
  controls,
  gestureState,
  visible = true,
  position = 'bottom-right',
}) => {
  if (!visible) return null;

  const getPositionStyles = () => {
    const base = {
      position: 'fixed' as const,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      padding: '16px',
    };

    switch (position) {
      case 'bottom-right':
        return { ...base, bottom: '20px', right: '20px' };
      case 'bottom-left':
        return { ...base, bottom: '20px', left: '20px' };
      case 'top-left':
        return { ...base, top: '20px', left: '20px' };
      case 'top-right':
        return { ...base, top: '20px', right: '20px' };
      default:
        return { ...base, bottom: '20px', right: '20px' };
    }
  };

  const buttonStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  };

  const scaleDisplayStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    textAlign: 'center',
    fontWeight: 'bold',
    minWidth: '60px',
  };

  return (
    <div 
      style={getPositionStyles()}
      data-testid="gesture-controls"
      data-position={position}
    >
      {/* Scale Display */}
      <div style={scaleDisplayStyle}>
        {Math.round(gestureState.scale * 100)}%
      </div>

      {/* Zoom In Button */}
      <button
        onClick={controls.zoomIn}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Zoom In"
        data-testid="zoom-in-button"
        aria-label="Zoom in"
      >
        +
      </button>

      {/* Zoom Out Button */}
      <button
        onClick={controls.zoomOut}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Zoom Out"
        data-testid="zoom-out-button"
        aria-label="Zoom out"
      >
        −
      </button>

      {/* Reset Zoom Button */}
      <button
        onClick={controls.resetZoom}
        style={{
          ...buttonStyle,
          fontSize: '12px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Reset Zoom"
        data-testid="reset-zoom-button"
        aria-label="Reset zoom to 100%"
      >
        1:1
      </button>

      {/* Reset All Button */}
      <button
        onClick={controls.resetAll}
        style={{
          ...buttonStyle,
          fontSize: '14px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
        title="Reset All"
        data-testid="reset-all-button"
        aria-label="Reset all gestures"
      >
        ⟲
      </button>
    </div>
  );
};

export default GestureControls;