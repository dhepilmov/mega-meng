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
  // 6-TAP GESTURE DETECTION
  // ========================================
  const [tapCount, setTapCount] = useState(0);
  const lastTapTime = useRef<number>(0);
  const resetTimeout = useRef<NodeJS.Timeout>();

  const handleSixTapGesture = () => {
    const currentTime = Date.now();
    const timeSinceLastTap = currentTime - lastTapTime.current;
    const maxTapInterval = 500; // 500ms between taps
    const requiredTaps = 6;
    
    // Clear existing reset timeout
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
    }

    // Check if tap is within allowed interval
    if (timeSinceLastTap < maxTapInterval || tapCount === 0) {
      const newTapCount = tapCount + 1;
      setTapCount(newTapCount);
      lastTapTime.current = currentTime;

      // Check if gesture is complete
      if (newTapCount >= requiredTaps) {
        setShowConfigUI(true);
        setTapCount(0);
        return;
      }

      // Set timeout to reset if no more taps
      resetTimeout.current = setTimeout(() => {
        setTapCount(0);
      }, 1000);
    } else {
      // Reset if too much time passed
      setTapCount(1);
      lastTapTime.current = currentTime;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current);
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
        onClick={onClose}
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
          
          {/* Top Button Container with Close and Config Buttons */}
          <TopButtonContainer showStroke={false}>
            {/* Config Button - Left side */}
            <MarkerButton 
              type="new" 
              showStroke={false}
              onClick={() => console.log('Config button clicked')}
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.8)' }}
            >
              ⚙️
            </MarkerButton>
            
            {/* Close Button - Right side */}
            <MarkerButton 
              type="close" 
              showStroke={false}
              onClick={onClose}
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
            >
              ✕
            </MarkerButton>
          </TopButtonContainer>
        </div>
      </div>
    );
  };

  // Initialize gesture controls
  const { gestureState, touchHandlers, controls } = useGestures({
    minScale: 0.3,
    maxScale: 4.0,
    scaleStep: 0.2,
    enablePinchZoom: true,
    enableDoubleTapZoom: true,
    enablePan: false, // Keep false to not interfere with launcher rotation
    enableRotation: false, // Keep false to not interfere with launcher rotation
    doubleTapZoomScale: 2.0,
  });

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
          onClick={handleSixTapGesture}
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
        {tapCount > 0 && (
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
            Taps: {tapCount}/6
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