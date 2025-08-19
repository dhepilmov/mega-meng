//==============================================
// MODAL STYLES
//==============================================
// DETAILED DESCRIPTION:
// Style definitions for modal components, backdrops, and overlays.
// Extracted from launcher_screen.tsx to improve maintainability.
// Includes responsive modal sizing, backdrop effects, and button styles.
// TWEAK:
// Adjust modal dimensions by modifying MODAL_SIZES constants.
// Change backdrop blur and opacity values in backdropStyles.
// Modify button styles for different hover effects and colors.
// Update transition timings for smoother animations.

import React from 'react';

// ===== MODAL SIZE CONFIGURATIONS =====

export const MODAL_SIZES = {
  small: {
    width: '60vw',
    height: '60vh',
    borderRadius: '12px',
  },
  medium: {
    width: '80vw',
    height: '80vh',
    borderRadius: '14px',
  },
  large: {
    width: '90vw',
    height: '90vh',
    borderRadius: '16px',
  },
  fullscreen: {
    width: '100vw',
    height: '100vh',
    borderRadius: '0px',
  },
} as const;

// ===== BACKDROP STYLES =====

export const backdropStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  zIndex: 10000,
  transition: 'all 0.3s ease-in-out',
};

// ===== MODAL CONTAINER STYLES =====

export const getModalContainerStyles = (
  size: keyof typeof MODAL_SIZES = 'large'
): React.CSSProperties => ({
  position: 'relative',
  width: MODAL_SIZES[size].width,
  height: MODAL_SIZES[size].height,
  transform: 'scale(0.9)',
  transformOrigin: 'center center',
  borderRadius: MODAL_SIZES[size].borderRadius,
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
});

// ===== MODAL BUTTON STYLES =====

export const modalButtonBaseStyles: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  zIndex: 10002,
  padding: '10px',
};

export const closeButtonStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '20px',
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.2s ease',
};

export const configButtonStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '20px',
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.2s ease',
};

// ===== BUTTON HOVER EFFECTS =====

export const handleCloseButtonHover = (element: HTMLButtonElement, isEntering: boolean) => {
  if (isEntering) {
    element.style.backgroundColor = '#dc2626';
    element.style.transform = 'scale(1.1)';
  } else {
    element.style.backgroundColor = '#ef4444';
    element.style.transform = 'scale(1)';
  }
};

export const handleConfigButtonHover = (element: HTMLButtonElement, isEntering: boolean) => {
  if (isEntering) {
    element.style.backgroundColor = '#2563eb';
    element.style.transform = 'scale(1.1)';
  } else {
    element.style.backgroundColor = '#3b82f6';
    element.style.transform = 'scale(1)';
  }
};

// ===== POSITION HELPERS =====

export const getCloseButtonPosition = (): React.CSSProperties => ({
  ...modalButtonBaseStyles,
  right: '10px',
});

export const getConfigButtonPosition = (): React.CSSProperties => ({
  ...modalButtonBaseStyles,
  right: '60px', // 40px width + 10px gap + 10px = 60px from right
});

// ===== MODAL ANIMATION STATES =====

export const getBackdropAnimationStyle = (isOpen: boolean): React.CSSProperties => ({
  ...backdropStyles,
  opacity: isOpen ? 1 : 0,
  pointerEvents: isOpen ? 'auto' : 'none',
});

export const getModalContentAnimationStyle = (isOpen: boolean): React.CSSProperties => ({
  transform: isOpen ? 'scale(1)' : 'scale(0.9)',
  opacity: isOpen ? 1 : 0,
  transition: 'all 0.3s ease-in-out',
});

// ===== UTILITY FUNCTIONS =====

/**
 * Create a complete modal backdrop with all styles applied
 */
export const createModalBackdrop = (
  isOpen: boolean,
  onClose: () => void,
  onClick?: (e: React.MouseEvent) => void
): React.CSSProperties => ({
  ...getBackdropAnimationStyle(isOpen),
  cursor: 'pointer',
});

/**
 * Get responsive modal size based on viewport
 */
export const getResponsiveModalSize = (): keyof typeof MODAL_SIZES => {
  if (typeof window === 'undefined') return 'large';
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  if (width < 640 || height < 480) return 'small';
  if (width < 1024 || height < 768) return 'medium';
  return 'large';
};

// ===== PRESET MODAL CONFIGURATIONS =====

export const MODAL_PRESETS = {
  settings: {
    size: 'large' as const,
    backdrop: {
      blur: true,
      clickToClose: true,
    },
    buttons: {
      showClose: true,
      showConfig: false,
    },
  },
  
  config: {
    size: 'large' as const,
    backdrop: {
      blur: true,
      clickToClose: false, // Prevent accidental closure
    },
    buttons: {
      showClose: true,
      showConfig: true,
    },
  },
  
  preview: {
    size: 'medium' as const,
    backdrop: {
      blur: false,
      clickToClose: true,
    },
    buttons: {
      showClose: true,
      showConfig: false,
    },
  },
  
  fullscreen: {
    size: 'fullscreen' as const,
    backdrop: {
      blur: false,
      clickToClose: false,
    },
    buttons: {
      showClose: true,
      showConfig: true,
    },
  },
} as const;