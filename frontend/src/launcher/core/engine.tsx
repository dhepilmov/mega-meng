//==============================================
// LAUNCHER ENGINE - MAIN ORCHESTRATOR
//==============================================
// DETAILED DESCRIPTION:
// Main launcher screen component reduced from 2,230 lines to ~400 lines.
// Uses modular architecture with extracted utilities, components, and logic.
// Maintains 100% backward compatibility while improving maintainability.
// PHASE 6: Consolidated into unified launcher module structure.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './launcher_effect.css';

// ===== MODULAR IMPORTS - PHASE 6 STRUCTURE =====
import { useClockOrchestrator } from '../clock/orchestrator';
import { LauncherConfigManager } from './config-manager';
import { LauncherDataProcessor, ProcessedRotateItem } from './data-processor';
import { useGestures, useBackupClick } from './user-input';
import { ClockLayer01 } from '../clock/layers/layer-01';

// Settings system import
import { LauncherSettingsUI } from '../settings';

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
    
    let cssContent = '';
    
    items.forEach((item) => {
      if (!item.config) return;
      
      const config = item.config;
      
      // Generate rotation CSS for each enabled rotation
      if (config.rotation1?.enabled === 'yes') {
        const animName1 = `rotate1_${config.itemCode}`;
        const speed1 = config.rotation1.rotationSpeed;
        const direction1 = config.rotation1.rotationWay === '+' ? 'normal' : 'reverse';
        
        cssContent += `
          @keyframes ${animName1} {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .${animName1} {
            animation: ${animName1} ${speed1}s linear infinite ${direction1};
          }
        `;
      }
      
      if (config.rotation2?.enabled === 'yes') {
        const animName2 = `rotate2_${config.itemCode}`;
        const speed2 = config.rotation2.rotationSpeed;
        const direction2 = config.rotation2.rotationWay === '+' ? 'normal' : 'reverse';
        
        cssContent += `
          @keyframes ${animName2} {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .${animName2} {
            animation: ${animName2} ${speed2}s linear infinite ${direction2};
          }
        `;
      }
    });
    
    styleElement.textContent = cssContent;
    
    // Remove existing style element
    const existingStyle = document.getElementById('rotate-animations');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(styleElement);
    
    return () => {
      const styleToRemove = document.getElementById('rotate-animations');
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [items]);
  
  return null;
};

//==============================================
// LAUNCHER SCREEN - MAIN COMPONENT
//==============================================
const LauncherEngine: React.FC = () => {
  // ===== STATE MANAGEMENT =====
  const [launcherConfig, setLauncherConfig] = useState<RotateItemConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfigUI, setShowConfigUI] = useState(false);
  const [lastTapTime, setLastTapTime] = useState<number>(0);
  const [tapCount, setTapCount] = useState<number>(0);
  
  // ===== CONFIGURATION MANAGEMENT =====
  const configManager = useMemo(() => new LauncherConfigManager(), []);
  const dataProcessor = useMemo(() => new LauncherDataProcessor(), []);
  
  // ===== CLOCK ORCHESTRATOR =====
  const { updateClockLayers, clockState } = useClockOrchestrator(launcherConfig);
  
  // ===== PROCESSED DATA =====
  const processedItems = useMemo(() => {
    if (!launcherConfig.length) return [];
    
    try {
      return dataProcessor.processRotateItems(launcherConfig);
    } catch (err) {
      console.error('Error processing rotate items:', err);
      return [];
    }
  }, [launcherConfig, dataProcessor]);
  
  // ===== GESTURE HANDLING =====
  const handleGestureDetected = useCallback((gestureType: string) => {
    if (gestureType === '6-tap') {
      setShowConfigUI(true);
    }
  }, []);
  
  // Use the modular gesture system
  useGestures({ 
    onGestureDetected: handleGestureDetected,
    tapCount, 
    setTapCount, 
    lastTapTime, 
    setLastTapTime 
  });
  
  // Backup click handler for desktop/mouse users
  useBackupClick({ 
    onGestureDetected: handleGestureDetected,
    requiredClickCount: 6 
  });
  
  // ===== CONFIGURATION LOADING =====
  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const config = await configManager.loadConfiguration();
        setLauncherConfig(config);
        
        // Update clock layers when configuration changes
        updateClockLayers(config);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error loading configuration';
        setError(errorMessage);
        console.error('Failed to load launcher configuration:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfiguration();
  }, [configManager, updateClockLayers]);
  
  // ===== CONFIGURATION UPDATE HANDLER =====
  const handleConfigurationChange = useCallback((newConfig: RotateItemConfig[]) => {
    setLauncherConfig(newConfig);
    updateClockLayers(newConfig);
    
    // Save configuration
    configManager.saveConfiguration(newConfig).catch(err => {
      console.error('Failed to save configuration:', err);
    });
  }, [configManager, updateClockLayers]);
  
  // ===== ERROR RECOVERY =====
  const handleErrorRecovery = useCallback(() => {
    setError(null);
    setIsLoading(true);
    
    // Attempt to reload with default configuration
    configManager.resetToDefault()
      .then(defaultConfig => {
        setLauncherConfig(defaultConfig);
        updateClockLayers(defaultConfig);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error recovery failed:', err);
        setError('Failed to recover. Please refresh the page.');
        setIsLoading(false);
      });
  }, [configManager, updateClockLayers]);
  
  // ===== RENDER HELPERS =====
  const renderLoadingState = () => (
    <div style={loadingContainerStyles}>
      <div style={{ color: '#fff', fontSize: '18px' }}>Loading Launcher...</div>
    </div>
  );
  
  const renderErrorState = () => (
    <div style={loadingContainerStyles}>
      <div style={{ color: '#ff4444', fontSize: '16px', textAlign: 'center' }}>
        <div style={{ marginBottom: '16px' }}>Error: {error}</div>
        <button 
          onClick={handleErrorRecovery}
          style={{
            padding: '8px 16px',
            backgroundColor: '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    </div>
  );
  
  const renderTapIndicator = () => {
    if (tapCount === 0) return null;
    
    return (
      <div style={getTapIndicatorStyles(tapCount)}>
        {tapCount}/6 taps
      </div>
    );
  };
  
  // ===== MAIN RENDER =====
  if (isLoading) {
    return renderLoadingState();
  }
  
  if (error) {
    return renderErrorState();
  }
  
  return (
    <div id="main-launcher-container" style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#000'
    }}>
      {/* Animations System */}
      <RotateAnim items={processedItems} />
      
      {/* Clock Layers - Using Layer 01 as orchestrator */}
      <ClockLayer01 
        configs={launcherConfig} 
        clockState={clockState}
      />
      
      {/* Dot Mark - Central Reference Point */}
      <DotMark />
      
      {/* Gesture Controls */}
      <GestureControls />
      
      {/* Tap Indicator */}
      {renderTapIndicator()}
      
      {/* Settings Modal */}
      {showConfigUI && (
        <ModalOverlay onClose={() => setShowConfigUI(false)}>
          <LauncherSettingsUI 
            currentConfig={launcherConfig}
            onConfigChange={handleConfigurationChange}
            onClose={() => setShowConfigUI(false)}
          />
        </ModalOverlay>
      )}
      
      {/* Debug Information */}
      {DEV_FLAGS.SHOW_DEBUG_INFO && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          color: '#fff',
          fontSize: '12px',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '8px',
          borderRadius: '4px',
          zIndex: 9999
        }}>
          <div>Items: {processedItems.length}</div>
          <div>Clock State: {clockState ? 'Active' : 'Inactive'}</div>
          <div>Tap Count: {tapCount}</div>
        </div>
      )}
    </div>
  );
};

export default LauncherEngine;