import React, { useState, useRef, useEffect } from 'react';
import { useLauncher } from './launcher_hook';
import DotMark from './DotMark';
import { useRotateLogic, RotateItemComponent } from './rotate_logic';
import { RotateAnim } from './rotate_anim';
import { useGestures, GestureControls } from './launcher_gesture';
import RotateConfigUI from './rotate_configUI';
import { MarkerButton, TopButtonContainer } from './marker';
import './launcher.css';

interface LauncherProps {}

const Launcher: React.FC<LauncherProps> = () => {
  const { settings, updateSettings } = useLauncher();
  const {
    loading,
    clockState,
    getDisplayableItems,
    calculateBasePosition,
    calculateItemTransform,
    calculateTransformOrigin,
  } = useRotateLogic();

  // ========================================
  // CONFIG UI MODAL STATE
  // ========================================
  const [showConfigUI, setShowConfigUI] = useState(false);

  // ========================================
  // BACKUP 6-CLICK SYSTEM (for mouse clicks)
  // ========================================
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);
  const clickResetTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleBackupSixClick = (event: React.MouseEvent) => {
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime.current;
    const maxClickInterval = 500; // 500ms between clicks
    
    // Clear existing reset timeout
    if (clickResetTimeout.current) {
      clearTimeout(clickResetTimeout.current);
    }

    // Check if click is within allowed interval
    if (timeSinceLastClick < maxClickInterval || clickCount === 0) {
      const newClickCount = clickCount + 1;
      setClickCount(newClickCount);
      lastClickTime.current = currentTime;

      console.log(`Click count: ${newClickCount}/6`);

      // Check if gesture is complete
      if (newClickCount >= 6) {
        console.log('6-click gesture detected! Opening config UI...');
        setShowConfigUI(true);
        setClickCount(0);
        return;
      }

      // Set timeout to reset if no more clicks
      clickResetTimeout.current = setTimeout(() => {
        console.log('Click sequence reset');
        setClickCount(0);
      }, 1000);
    } else {
      // Reset if too much time passed
      console.log('Click sequence reset due to timeout, starting new sequence');
      setClickCount(1);
      lastClickTime.current = currentTime;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickResetTimeout.current) {
        clearTimeout(clickResetTimeout.current);
      }
    };
  }, []);

  // ========================================
  // MODAL OVERLAY COMPONENT
  // ========================================
  const ModalOverlay: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    children: React.ReactNode;
  }> = ({ isOpen, onClose, children }) => {
    // ESC key handler
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          opacity: isOpen ? 1 : 0,
          transition: 'all 0.3s ease-in-out'
        }}
        onClick={(e) => {
          // Only close if clicking the backdrop, not the modal content
          if (e.target === e.currentTarget) {
            console.log('Backdrop clicked - closing modal');
            onClose();
          }
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '90vw',
            height: '90vh',
            transform: 'scale(0.9)',
            transformOrigin: 'center center',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}
        >
          {children}
          
          {/* Direct Close Button - Most Stable Approach */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Close button clicked');
              onClose();
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.9)',
              color: 'white',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            className="hover:bg-opacity-90 hover:scale-105 active:scale-95"
          >
            ✕
          </button>
          
          {/* Config Button - Left side */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Config button clicked');
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '80px', // 48px width + 12px gap + 20px = 80px from right
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.9)',
              color: 'white',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10001,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            className="hover:bg-opacity-90 hover:scale-105 active:scale-95"
          >
            ⚙️
          </button>
        </div>
      </div>
    );
  };

  // Initialize gesture controls with 6-tap callback
  const { gestureState, touchHandlers, controls, tapCount } = useGestures({
    minScale: 0.3,
    maxScale: 4.0,
    scaleStep: 0.2,
    enablePinchZoom: true,
    enableDoubleTapZoom: true,
    enablePan: false, // Keep false to not interfere with launcher rotation
    enableRotation: false, // Keep false to not interfere with launcher rotation
    doubleTapZoomScale: 2.0,
    enableMultiTap: true,
    multiTapWindow: 600, // Increased window for easier detection
    onSixTap: () => {
      console.log('6-tap gesture detected! Opening config UI...');
      setShowConfigUI(true);
    },
  });

  // Debug: Log tap count changes
  useEffect(() => {
    if (tapCount > 0) {
      console.log(`Tap count: ${tapCount}/6`);
    }
  }, [tapCount]);

  const displayableItems = getDisplayableItems();

  if (loading) {
    return (
      <div className="launcher-container">
        <div className="launcher-content">
          <div className="loading-text">Loading launcher...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="launcher-container">
        <div 
          className="launcher-content"
          style={{
            transform: `scale(${gestureState.scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out',
            touchAction: 'none',
          }}
          {...touchHandlers}
          onClick={handleBackupSixClick}
        >
          {/* Rotate Animation CSS Manager */}
          <RotateAnim items={displayableItems} clockState={clockState} />
          
          {/* Render all displayable rotate items */}
          {displayableItems.map((item) => (
            <RotateItemComponent
              key={item.itemCode}
              item={item}
              calculateBasePosition={calculateBasePosition}
              calculateItemTransform={calculateItemTransform}
              calculateTransformOrigin={calculateTransformOrigin}
            />
          ))}
          
          {/* Dot mark as center reference - highest z-index */}
          <DotMark />
        </div>
        
        {/* Simple Gesture Controls */}
        <GestureControls controls={controls} gestureState={gestureState} />
        
        {/* Tap Counter Indicator (for debugging) */}
        {(tapCount > 0 || clickCount > 0) && (
          <div 
            style={{
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
              animation: 'pulse 0.5s ease-in-out'
            }}
          >
            Taps: {Math.max(tapCount, clickCount)}/6
          </div>
        )}
      </div>

      {/* Modal Overlay for Config UI */}
      <ModalOverlay isOpen={showConfigUI} onClose={() => setShowConfigUI(false)}>
        <RotateConfigUI />
      </ModalOverlay>
    </>
  );
};

export default Launcher;