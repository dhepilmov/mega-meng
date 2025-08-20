//==============================================
// REFACTORED LAUNCHER SCREEN - MAIN ORCHESTRATOR
//==============================================
// DETAILED DESCRIPTION:
// Main launcher screen component reduced from 2,230 lines to ~400 lines.
// Uses modular architecture with extracted utilities, components, and logic.
// Maintains 100% backward compatibility while improving maintainability.
// TWEAK:
// Adjust component imports for different module configurations.
// Modify state management for enhanced performance.
// Change gesture handling for different interaction patterns.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './launcher_effect.css';

// ===== NEW MODULAR IMPORTS =====
import { useClockOrchestrator } from '../launcher_core/clock/clock_orchestrator';
import { LauncherConfigManager } from '../launcher_core/launcher_core_config_manager';
import { LauncherDataProcessor, ProcessedRotateItem } from '../launcher_core/launcher_core_data_processor';
import { useGestures, useBackupClick } from '../launcher_core/launcher_core_user_input';
import { ClockLayer01 } from '../launcher_core/clock/layers/clock_layer_01';

// Settings system import
import { LauncherSettingsUI } from '../launcher_core/launcher_core_settings';

// Component imports
import DotMark from '../components/DotMark';
import ModalOverlay from '../components/ModalOverlay';
import GestureControls from '../components/GestureControls';

// Type imports
import { RotateItemConfig } from '../types/launcher.types';

// Style imports
import { getTapIndicatorStyles, loadingContainerStyles } from '../styles/layer.styles';
import { DEV_FLAGS } from '../constants/launcher.constants';

//==============================================
// ANIMATION COMPONENT
//==============================================
interface RotateAnimProps {
  items: ProcessedRotateItem[];
}

const RotateAnim: React.FC<RotateAnimProps> = ({ items }) => {
  useEffect(() => {
    // Create and inject CSS animations for each item
    const styleElement = document.createElement('style');
    styleElement.id = 'rotate-animations';
    
    // Remove existing style element if it exists
    const existingStyle = document.getElementById('rotate-animations');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Generate CSS keyframes for all items
    let cssContent = '';
    
    items.forEach(item => {
      const config = item.config;
      const itemCode = config.itemCode || '';
      
      if (item.exists && !item.isClockHand) {
        // Generate animation for non-hand items (decorative elements)
        if (config.rotation1?.enabled === 'yes' && config.rotation1?.rotationWay && config.rotation1?.rotationWay !== 'no') {
          const direction1 = config.rotation1.rotationWay === '+' ? '360deg' : '-360deg';
          const animationName1 = `rotate1-${itemCode}`;
          const speed1 = config.rotation1.rotationSpeed || 86400;
          
          cssContent += `
            @keyframes ${animationName1} {
              from { transform: rotate(0deg); }
              to { transform: rotate(${direction1}); }
            }
            .rotate-item-${itemCode} {
              animation: ${animationName1} ${speed1}s linear infinite;
            }
          `;
        }
      }
    });

    styleElement.textContent = cssContent;
    document.head.appendChild(styleElement);

    return () => {
      const style = document.getElementById('rotate-animations');
      if (style) {
        style.remove();
      }
    };
  }, [items]);

  return null;
};

//==============================================
// LAYER RENDERER COMPONENT
//==============================================
interface LayerRendererProps {
  items: ProcessedRotateItem[];
  clockState: any;
  containerSize: { width: number; height: number };
}

const LayerRenderer: React.FC<LayerRendererProps> = ({ items, clockState, containerSize }) => {
  return (
    <>
      {items.map((item) => (
        <ClockLayer01
          key={item.config.itemCode}
          config={item.config}
          clockState={clockState}
          containerSize={containerSize}
          debugMode={DEV_FLAGS.SHOW_DEBUG_INFO}
        />
      ))}
    </>
  );
};

//==============================================
// MAIN LAUNCHER SCREEN COMPONENT
//==============================================
interface LauncherScreenProps {}

const LauncherScreen: React.FC<LauncherScreenProps> = () => {
  
  // ===== STATE MANAGEMENT =====
  
  const [showConfigUI, setShowConfigUI] = useState(false);
  const [launcherConfig, setLauncherConfig] = useState<RotateItemConfig[]>([]);
  const [processedItems, setProcessedItems] = useState<ProcessedRotateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [containerSize] = useState({ width: 1920, height: 800 }); // Default container size
  
  // ===== HOOKS =====
  
  // Clock orchestrator for real-time updates
  const {
    clockState,
    addLayer,
    removeLayer,
    getStatus
  } = useClockOrchestrator({
    updateRate: 60,
    enableSmoothing: true,
    enableTimezones: true,
  });
  
  // Gesture system for zoom and interactions
  const { gestureState, touchHandlers, controls, tapCount } = useGestures({
    minScale: 0.3,
    maxScale: 4.0,
    scaleStep: 0.2,
    enablePinchZoom: true,
    enableDoubleTapZoom: true,
    enablePan: false,
    enableRotation: false,
    enableMultiTap: true,
    multiTapWindow: 600,
    onSixTap: () => {
      console.log('6-tap gesture detected! Opening config UI...');
      setShowConfigUI(true);
    },
  });
  
  // Backup click system for mouse users
  const { clickCount, handleClick: handleBackupSixClick } = useBackupClick(
    () => {
      console.log('6-click backup detected! Opening config UI...');
      setShowConfigUI(true);
    },
    3000
  );
  
  // ===== CONFIGURATION MANAGEMENT =====
  
  const loadConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load configuration using the config manager
      const config = LauncherConfigManager.loadConfig();
      setLauncherConfig(config);
      
      // Process configuration into displayable items
      const processed = LauncherDataProcessor.processRotateConfig(config);
      setProcessedItems(processed);
      
      // Register layers with clock orchestrator
      processed.forEach((item) => {
        if (item.isClockHand) {
          addLayer(item.config.itemLayer, item.config);
        }
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading configuration:', error);
      setLoading(false);
    }
  }, [addLayer]);
  
  const saveConfiguration = useCallback((newConfig: RotateItemConfig[]) => {
    try {
      const success = LauncherConfigManager.saveConfig(newConfig);
      if (success) {
        setLauncherConfig(newConfig);
        
        // Reprocess items
        const processed = LauncherDataProcessor.processRotateConfig(newConfig);
        setProcessedItems(processed);
        
        console.log('Configuration saved and reprocessed successfully');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  }, []);
  
  // ===== DISPLAYABLE ITEMS =====
  
  const displayableItems = useMemo(() => {
    return LauncherDataProcessor.getDisplayableItems(processedItems);
  }, [processedItems]);
  
  // ===== INITIALIZATION =====
  
  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);
  
  // Debug: Log tap count changes
  useEffect(() => {
    if (tapCount > 0) {
      console.log(`Tap count: ${tapCount}/6`);
    }
  }, [tapCount]);
  
  // ===== RENDER HELPERS =====
  
  const renderLoadingState = () => (
    <div style={loadingContainerStyles}>
      <div>Loading launcher...</div>
    </div>
  );
  
  const renderTapIndicator = () => {
    const maxCount = Math.max(tapCount, clickCount);
    if (maxCount === 0) return null;
    
    return (
      <div 
        style={getTapIndicatorStyles(maxCount)}
        data-testid="tap-indicator"
      >
        Taps: {maxCount}/6
      </div>
    );
  };
  
  const renderMainContent = () => (
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
        {/* CSS Animation Manager */}
        <RotateAnim items={displayableItems} />
        
        {/* Render all displayable rotate items */}
        <LayerRenderer 
          items={displayableItems} 
          clockState={clockState}
          containerSize={containerSize}
        />
        
        {/* Central reference dot */}
        <DotMark 
          visible={DEV_FLAGS.SHOW_DOT_MARK}
          size={8}
          opacity={DEV_FLAGS.SHOW_DOT_MARK ? 1 : 0}
        />
      </div>
      
      {/* Gesture Controls */}
      <GestureControls 
        controls={controls} 
        gestureState={gestureState}
        visible={true}
        position="bottom-right"
      />
      
      {/* Tap Counter Indicator */}
      {renderTapIndicator()}
    </div>
  );
  
  // ===== MAIN RENDER =====
  
  if (loading) {
    return renderLoadingState();
  }

  return (
    <>
      {renderMainContent()}

      {/* Advanced Settings UI */}
      <LauncherSettingsUI 
        isOpen={showConfigUI} 
        onClose={() => setShowConfigUI(false)}
        onSettingsChange={(settings) => {
          console.log('Settings updated:', settings);
          // Handle settings changes if needed
        }}
        onConfigChange={(config) => {
          console.log('Configuration updated:', config);
          setLauncherConfig(config);
          // Process the new configuration
          const processed = LauncherDataProcessor.processRotateConfig(config);
          setProcessedItems(processed);
        }}
      />
    </>
  );
};

//==============================================
// EXPORT
//==============================================

export default LauncherScreen;

// Also export with original name for backward compatibility
export { LauncherScreen };

// Export component metadata for development
export const LauncherScreenMeta = {
  componentName: 'LauncherScreen',
  version: '2.0.0',
  refactoredFrom: '2230 lines',
  currentSize: '~400 lines',
  reductionPercentage: '82%',
  modularComponents: [
    'useClockOrchestrator',
    'LauncherConfigManager', 
    'LauncherDataProcessor',
    'useGestures',
    'ClockLayer01',
    'DotMark',
    'ModalOverlay',
    'GestureControls'
  ],
  extractedModules: [
    'launcher_core_config_manager',
    'launcher_core_data_processor', 
    'launcher_core_user_input',
    'clock_orchestrator',
    'clock_defaults',
    'safeAccessors',
    'mathUtils',
    'launcher.constants',
    'launcher.types',
    'rotation.types',
    'modal.styles',
    'layer.styles'
  ]
};