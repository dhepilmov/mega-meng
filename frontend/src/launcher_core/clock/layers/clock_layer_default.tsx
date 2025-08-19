//==============================================
// DEFAULT CLOCK LAYER COMPONENT
//==============================================
// DETAILED DESCRIPTION:
// Fallback layer component used when specific layer components fail to load
// or when handling invalid layer configurations. Provides error recovery.
// TWEAK: Modify error handling and fallback behaviors.

import React from 'react';
import { ClockLayerProps } from './clock_layer_01';
import { safeString, safeNumber } from '../../../utils/safeAccessors';
import { Z_INDEX } from '../../../constants/launcher.constants';

export const ClockLayerDefault: React.FC<ClockLayerProps> = ({
  config,
  clockState,
  containerSize,
  onConfigChange,
  onError,
  debugMode = false,
  isPaused = false,
}) => {
  
  // Basic visibility check
  const isVisible = safeString(config.itemDisplay) === 'yes' && 
                   safeString(config.render) === 'yes';
  
  if (!isVisible) {
    return null;
  }

  // Error fallback styling
  const fallbackStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50px',
    height: '50px',
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    border: '2px dashed #ff0000',
    borderRadius: '50%',
    zIndex: Z_INDEX.CLOCK_LAYERS_START + config.itemLayer,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: 'white',
    fontFamily: 'monospace',
    pointerEvents: 'none',
  };

  const handleImageError = () => {
    const errorMsg = `Default layer fallback for ${config.itemCode} (Layer ${config.itemLayer})`;
    onError?.(errorMsg);
  };

  React.useEffect(() => {
    if (debugMode) {
      console.warn(`Using default fallback for layer ${config.itemLayer} (${config.itemCode})`);
    }
    handleImageError();
  }, [config.itemCode, config.itemLayer, debugMode]);

  return (
    <div
      className={`clock-layer clock-layer-default clock-layer-${config.itemCode}`}
      style={fallbackStyle}
      data-layer-id={config.itemLayer}
      data-layer-code={config.itemCode}
      data-fallback="true"
    >
      {config.itemPath ? (
        <img
          src={config.itemPath}
          alt={config.itemName}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
          draggable={false}
          onError={handleImageError}
          onLoad={() => {
            if (debugMode) {
              console.log(`Default layer ${config.itemCode} image loaded successfully`);
            }
          }}
        />
      ) : (
        <span>L{config.itemLayer}</span>
      )}
      
      {debugMode && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            fontSize: '8px',
            color: '#ff0000',
            backgroundColor: 'rgba(0,0,0,0.9)',
            padding: '1px 2px',
            borderRadius: '1px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          FALLBACK: {config.itemCode}
        </div>
      )}
    </div>
  );
};

export default ClockLayerDefault;