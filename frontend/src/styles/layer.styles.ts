//==============================================
// LAYER STYLES
//==============================================
// DETAILED DESCRIPTION:
// Style definitions for launcher layers, buttons, and UI components.
// Extracted from launcher_screen.tsx for better organization and reusability.
// Includes dot mark styles, button configurations, and layer effects.
// TWEAK:
// Modify button dimensions in BUTTON_CONFIGS for different sizes.
// Adjust stroke styles in STROKE_STYLES for development visibility.
// Change effect styles in LAYER_EFFECTS for visual enhancements.
// Update positioning constants for different layouts.

import React from 'react';

// ===== DOT MARK STYLES =====

export const dotMarkStyles: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#666666',
  zIndex: 1000,
  opacity: 0, // Hidden in production
  pointerEvents: 'none',
};

export const getDotMarkStyles = (options?: {
  visible?: boolean;
  size?: number;
  color?: string;
  opacity?: number;
}): React.CSSProperties => ({
  ...dotMarkStyles,
  width: `${options?.size || 8}px`,
  height: `${options?.size || 8}px`,
  backgroundColor: options?.color || '#666666',
  opacity: options?.visible ? (options?.opacity ?? 1) : 0,
});

// ===== BUTTON CONFIGURATIONS =====

export const BUTTON_CONFIGS = {
  close: {
    width: 48,
    height: 48,
    padding: 12,
    fontSize: 24,
  },
  new: {
    width: 48,
    height: 48,
    padding: 12,
    fontSize: 20,
  },
  default: {
    width: 48,
    height: 48,
    padding: 12,
    fontSize: 18,
  },
} as const;

export const BUTTON_SPACING = {
  gap: 12,
  marginFromEdge: 20,
} as const;

// ===== STROKE STYLES FOR DEVELOPMENT =====

export const STROKE_STYLES = {
  default: {
    stroke: '#ff0000',
    strokeWidth: 2,
    strokeDasharray: '4,2',
    strokeOpacity: 0.8,
  },
  close: {
    stroke: '#ff4444',
    strokeWidth: 2,
    strokeDasharray: '2,2',
    strokeOpacity: 0.7,
  },
  new: {
    stroke: '#44ff44',
    strokeWidth: 2,
    strokeDasharray: '3,1',
    strokeOpacity: 0.7,
  },
  hover: {
    stroke: '#ffff44',
    strokeWidth: 3,
    strokeOpacity: 1,
  },
} as const;

// ===== BUTTON BASE STYLES =====

export const getButtonBaseStyles = (
  type: keyof typeof BUTTON_CONFIGS = 'default'
): React.CSSProperties => {
  const config = BUTTON_CONFIGS[type];
  
  return {
    width: config.width,
    height: config.height,
    padding: config.padding,
    fontSize: config.fontSize,
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
  };
};

export const getButtonWithStroke = (
  type: keyof typeof BUTTON_CONFIGS = 'default',
  showStroke: boolean = false
): React.CSSProperties => {
  const baseStyles = getButtonBaseStyles(type);
  const strokeConfig = STROKE_STYLES[type] || STROKE_STYLES.default;
  
  if (!showStroke) return baseStyles;
  
  return {
    ...baseStyles,
    border: `${strokeConfig.strokeWidth}px ${strokeConfig.strokeDasharray ? 'dashed' : 'solid'} ${strokeConfig.stroke}`,
    opacity: strokeConfig.strokeOpacity,
  };
};

// ===== SIZE INDICATOR OVERLAY =====

export const getSizeIndicatorStyles = (
  strokeColor: string,
  width: number,
  height: number
): React.CSSProperties => ({
  position: 'absolute',
  top: '-20px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '10px',
  color: strokeColor,
  backgroundColor: 'rgba(0,0,0,0.8)',
  padding: '2px 4px',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
});

// ===== CONTAINER STYLES =====

export const getTopButtonContainerStyles = (showStroke: boolean = false): React.CSSProperties => ({
  position: 'absolute',
  top: BUTTON_SPACING.marginFromEdge,
  right: BUTTON_SPACING.marginFromEdge,
  display: 'flex',
  alignItems: 'center',
  gap: BUTTON_SPACING.gap,
  zIndex: 9999,
  
  // Development stroke
  ...(showStroke && {
    border: '1px dashed #888',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: 'rgba(128,128,128,0.2)',
  }),
});

export const getContainerIndicatorStyles = (): React.CSSProperties => ({
  position: 'absolute',
  top: '-25px',
  left: '0',
  fontSize: '10px',
  color: '#888',
  backgroundColor: 'rgba(0,0,0,0.8)',
  padding: '2px 6px',
  borderRadius: '4px',
  whiteSpace: 'nowrap',
});

// ===== LAYER EFFECTS =====

export const LAYER_EFFECTS = {
  shadow: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
  glow: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))',
  transparency: { opacity: 0.7 },
  pulse: 'pulse 2s ease-in-out infinite',
} as const;

export const applyLayerEffects = (
  baseStyle: React.CSSProperties,
  effects: {
    shadow?: boolean;
    glow?: boolean;
    transparent?: boolean;
    pulse?: boolean;
    render?: boolean;
  }
): React.CSSProperties => {
  if (!effects.render) return baseStyle;
  
  const style = { ...baseStyle };
  const filters: string[] = [];
  const animations: string[] = [];
  
  if (effects.shadow) {
    filters.push(LAYER_EFFECTS.shadow);
  }
  
  if (effects.glow) {
    filters.push(LAYER_EFFECTS.glow);
  }
  
  if (effects.transparent) {
    style.opacity = LAYER_EFFECTS.transparency.opacity;
  }
  
  if (effects.pulse) {
    animations.push(LAYER_EFFECTS.pulse);
  }
  
  if (filters.length > 0) {
    style.filter = filters.join(' ');
  }
  
  if (animations.length > 0) {
    style.animation = animations.join(', ');
  }
  
  return style;
};

// ===== IMAGE STYLES =====

export const layerImageStyles: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  display: 'block',
};

// ===== GESTURE AND INTERACTION STYLES =====

export const gestureContainerStyles: React.CSSProperties = {
  touchAction: 'none',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  msUserSelect: 'none',
};

export const getGestureTransformStyle = (scale: number): React.CSSProperties => ({
  transform: `scale(${scale})`,
  transformOrigin: 'center center',
  transition: 'transform 0.1s ease-out',
});

// ===== TAP INDICATOR STYLES =====

export const getTapIndicatorStyles = (tapCount: number): React.CSSProperties => ({
  position: 'absolute',
  top: '20px',
  left: '20px',
  backgroundColor: 'rgba(59, 130, 246, 0.9)',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '14px',
  fontWeight: 'bold',
  zIndex: 1000,
  animation: 'pulse 0.5s ease-in-out',
});

// ===== LOADING STYLES =====

export const loadingContainerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw',
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  color: 'white',
  fontSize: '18px',
};

// ===== ANIMATION KEYFRAMES =====

export const KEYFRAME_ANIMATIONS = {
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  
  scaleIn: `
    @keyframes scaleIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,
  
  scaleOut: `
    @keyframes scaleOut {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(0.8); opacity: 0; }
    }
  `,
} as const;

// ===== RESPONSIVE BREAKPOINTS =====

export const BREAKPOINTS = {
  mobile: '(max-width: 640px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)',
} as const;

// ===== Z-INDEX LAYERS =====

export const Z_INDICES = {
  background: 1,
  layers: 10,
  dotMark: 1000,
  ui: 9999,
  modal: 10000,
  modalContent: 10001,
  modalButtons: 10002,
} as const;