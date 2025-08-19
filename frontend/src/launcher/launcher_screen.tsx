import React, { useState, useRef, useEffect } from 'react';
import { useLauncher } from './launcher_hook';
import DotMark from './DotMark';
import { useRotateLogic, RotateItemComponent } from './rotate_logic';
import { RotateAnim } from './rotate_anim';
import { useGestures, GestureControls } from './launcher_gesture';
import RotateConfigUI from './launcher_config';
import { MarkerButton, TopButtonContainer } from './marker';
import './launcher_effect.css';

interface LauncherScreenProps {}

const LauncherScreen: React.FC<LauncherScreenProps> = () => {
  
  //LAUNCHER SCREEN STATE MANAGEMENT
  const { settings, updateSettings } = useLauncher();
  const {
    loading,
    clockState,
    getDisplayableItems,
    calculateBasePosition,
    calculateItemTransform,
    calculateTransformOrigin,
  } = useRotateLogic();
  //DETAILED DESCRIPTION: 
  //This code manages the core launcher state using custom hooks from launcher_hook.tsx and rotate_logic.tsx. 
  //The useLauncher hook handles user settings, file management, and localStorage persistence.
  //The useRotateLogic hook manages rotation items, clock calculations, image loading, and transform calculations.
  //TWEAK: 
  //Adjust useLauncher settings in launcher_logic.tsx to change default theme, animations, autoSave behavior.
  //Modify useRotateLogic parameters in rotate_config.tsx to change item configurations and display settings.

  //CONFIGURATION UI MODAL STATE  
  const [showConfigUI, setShowConfigUI] = useState(false);
  //DETAILED DESCRIPTION:
  //This state controls the visibility of the configuration modal overlay that opens via 6-tap/6-click gesture.
  //The modal displays RotateConfigUI component for editing launcher item settings.
  //Related to rotate_configUI.tsx (now launcher_config.tsx) for the UI content.
  //TWEAK:
  //Change initial value to true for development to keep config UI always open.
  //Add animation states by expanding this to an object with { isOpen: boolean, isAnimating: boolean }.

  //BACKUP 6-CLICK SYSTEM (MOUSE SUPPORT)
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);
  const clickResetTimeout = useRef<NodeJS.Timeout | null>(null);
  //DETAILED DESCRIPTION:
  //This code provides mouse click detection as backup for touch gestures. It counts rapid clicks within time window.
  //Works alongside gesture system from launcher_gesture.tsx to provide configuration access on desktop.
  //Triggers same result as 6-tap gesture - opens configuration UI modal.
  //TWEAK:
  //Change clickCount comparison (>= 6) to different number for easier/harder access.
  //Adjust maxClickInterval (500ms) to make timing more/less strict.
  //Modify reset timeout (1000ms) to change how long sequence remembers clicks.

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
  //DETAILED DESCRIPTION:
  //This function handles rapid mouse click detection for desktop users without touch capability.
  //Implements timing-based click sequence detection with automatic reset on timeout or completion.
  //Integrates with gesture system from launcher_gesture.tsx for unified configuration access.
  //TWEAK:
  //Change maxClickInterval value to adjust timing sensitivity (100-1000ms recommended).
  //Modify reset timeout duration to change memory span of click sequence.
  //Adjust click threshold (>= 6) to require more/fewer clicks.

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickResetTimeout.current) {
        clearTimeout(clickResetTimeout.current);
      }
    };
  }, []);
  //DETAILED DESCRIPTION:
  //This cleanup effect prevents memory leaks by clearing timeouts when component unmounts.
  //Essential for proper resource management when navigating away from launcher screen.
  //Related to handleBackupSixClick timeout management system.
  //TWEAK:
  //Add additional cleanup for other refs or intervals if more timers are added.
  //Extend cleanup to reset other state values on unmount if needed.

  //MODAL OVERLAY COMPONENT
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
          
          {/* Simple, Accessible Close Button */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10002,
              padding: '10px'
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Simple close button clicked');
                onClose();
              }}
              style={{
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
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ef4444';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Close (ESC)"
            >
              ✕
            </button>
          </div>

          {/* Config Button - Left side */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '60px', // 40px width + 10px gap + 10px = 60px from right
              zIndex: 10002,
              padding: '10px'
            }}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Simple config button clicked');
              }}
              style={{
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
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2563eb';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#3b82f6';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Configuration"
            >
              ⚙️
            </button>
          </div>
        </div>
      </div>
    );
  };
  //DETAILED DESCRIPTION:
  //This component creates a full-screen modal overlay with backdrop blur and close controls.
  //Handles ESC key detection, body scroll prevention, and backdrop click-to-close functionality.
  //Contains close button (✕) and config button (⚙️) with hover animations and proper z-indexing.
  //Used to display RotateConfigUI component when triggered by gestures or clicks.
  //TWEAK:
  //Change backgroundColor opacity (0.8) to make backdrop lighter/darker.
  //Adjust blur value (10px) in backdropFilter for more/less background blur.
  //Modify modal size (90vw, 90vh) to change overlay dimensions.
  //Change button positions by adjusting top/right values.
  //Adjust button sizes by changing width/height values (40px).

  //GESTURE SYSTEM INITIALIZATION
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
  //DETAILED DESCRIPTION:
  //This initializes the gesture control system from launcher_gesture.tsx with specific configuration.
  //Handles pinch zoom, double-tap zoom, multi-tap detection, and 6-tap configuration access.
  //Pan and rotation are disabled to avoid conflicts with launcher item rotations.
  //The onSixTap callback opens the configuration UI modal when gesture is detected.
  //TWEAK:
  //Change minScale/maxScale to adjust zoom limits (0.1-5.0 range recommended).
  //Modify scaleStep for different zoom increment/decrement amounts.
  //Adjust multiTapWindow (600ms) to make tap detection easier/harder.
  //Change doubleTapZoomScale for different zoom level on double-tap.
  //Enable enablePan/enableRotation if launcher item interference is resolved.

  // Debug: Log tap count changes
  useEffect(() => {
    if (tapCount > 0) {
      console.log(`Tap count: ${tapCount}/6`);
    }
  }, [tapCount]);
  //DETAILED DESCRIPTION:
  //This effect provides debug logging for gesture system tap count monitoring.
  //Helps developers see tap detection progress in browser console during testing.
  //Related to gesture system from launcher_gesture.tsx multi-tap detection.
  //TWEAK:
  //Remove or comment out for production to reduce console noise.
  //Add visual feedback by updating state instead of just console logging.
  //Change threshold number (6) to match gesture system requirements.

  //GET DISPLAYABLE ITEMS
  const displayableItems = getDisplayableItems();
  //DETAILED DESCRIPTION:
  //This gets filtered list of rotation items that should be displayed on screen.
  //Filters based on image existence, item names, and itemDisplay: 'yes' setting.
  //Sorted by itemLayer for proper z-index layering. From rotate_logic.tsx.
  //TWEAK:
  //Modify filtering logic in getDisplayableItems() function in rotate_logic.tsx.
  //Add additional filters for categories, effects, or other item properties.

  //LOADING STATE RENDERING
  if (loading) {
    return (
      <div className="launcher-container">
        <div className="launcher-content">
          <div className="loading-text">Loading launcher...</div>
        </div>
      </div>
    );
  }
  //DETAILED DESCRIPTION:
  //This renders a loading state while images and configuration are being loaded.
  //Uses CSS classes from launcher_effect.css for styling and positioning.
  //Prevents rendering of launcher items until everything is ready.
  //TWEAK:
  //Change loading text content or add loading animation/spinner.
  //Modify CSS classes in launcher_effect.css for different loading appearance.
  //Add progress indicator or percentage if needed.

  //MAIN LAUNCHER SCREEN RENDERING
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
  //DETAILED DESCRIPTION:
  //This is the main launcher screen rendering with gesture handling, item display, and modal overlay.
  //The launcher-content div has gesture transform applied and handles touch events.
  //RotateAnim manages CSS animations for rotating items from rotate_anim.tsx.
  //RotateItemComponent renders individual items using calculations from rotate_logic.tsx.
  //DotMark provides center reference point with highest z-index.
  //GestureControls shows zoom controls from launcher_gesture.tsx.
  //Tap counter shows debug feedback during gesture detection.
  //ModalOverlay displays configuration UI when triggered.
  //TWEAK:
  //Change scale transform limits by modifying gestureState configuration.
  //Adjust tap counter position by changing top/left values (20px).
  //Modify tap counter styling colors, padding, or border-radius.
  //Add additional controls or indicators as needed.
  //Change modal trigger conditions or add multiple modal types.
};

export default LauncherScreen;