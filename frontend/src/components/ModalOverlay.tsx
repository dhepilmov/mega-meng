//==============================================
// MODAL OVERLAY COMPONENT
//==============================================
// DETAILED DESCRIPTION:
// Modal overlay component with backdrop, close functionality, and animation.
// Extracted from launcher_screen.tsx main component section.
// TWEAK:
// Modify modal sizes and animations in modal.styles.ts.
// Adjust backdrop blur and click-to-close behavior.
// Change button positioning and styles.

import React, { useEffect } from 'react';
import { ModalProps } from '../types/launcher.types';
import {
  createModalBackdrop,
  getModalContainerStyles,
  getCloseButtonPosition,
  getConfigButtonPosition,
  closeButtonStyles,
  configButtonStyles,
  handleCloseButtonHover,
  handleConfigButtonHover,
  getResponsiveModalSize,
} from '../styles/modal.styles';

export const ModalOverlay: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  overlayClassName = '',
  closeOnEscKey = true,
  closeOnOverlayClick = true,
}) => {
  // ESC key handler
  useEffect(() => {
    if (!isOpen || !closeOnEscKey) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('ESC key pressed - closing modal');
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEscKey]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const responsiveSize = getResponsiveModalSize();
  const modalContainerStyle = getModalContainerStyles(responsiveSize);

  return (
    <div
      style={{
        ...createModalBackdrop(isOpen, onClose),
        opacity: isOpen ? 1 : 0,
        transition: 'all 0.3s ease-in-out'
      }}
      className={overlayClassName}
      onClick={(e) => {
        // Only close if clicking the backdrop and closeOnOverlayClick is enabled
        if (e.target === e.currentTarget && closeOnOverlayClick) {
          console.log('Backdrop clicked - closing modal');
          onClose();
        }
      }}
      data-testid="modal-overlay"
      aria-modal="true"
      role="dialog"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={modalContainerStyle}
        className={className}
        data-testid="modal-content"
      >
        {/* Modal Title */}
        {title && (
          <div
            id="modal-title"
            style={{
              position: 'absolute',
              top: '10px',
              left: '20px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              zIndex: 10002,
            }}
          >
            {title}
          </div>
        )}

        {/* Modal Content */}
        {children}
        
        {/* Close Button */}
        <div style={getCloseButtonPosition()}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Close button clicked');
              onClose();
            }}
            style={closeButtonStyles}
            onMouseEnter={(e) => handleCloseButtonHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleCloseButtonHover(e.currentTarget, false)}
            title="Close (ESC)"
            data-testid="modal-close-button"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Config Button - Optional */}
        <div style={getConfigButtonPosition()}>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Config button clicked');
              // Add config button functionality here
            }}
            style={configButtonStyles}
            onMouseEnter={(e) => handleConfigButtonHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleConfigButtonHover(e.currentTarget, false)}
            title="Configuration"
            data-testid="modal-config-button"
            aria-label="Open configuration"
          >
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalOverlay;