//==============================================
// CLOCK CONFIG PROCESSOR
//==============================================
// DETAILED DESCRIPTION:
// Processes and transforms launcher_config data specifically for clock system.
// Handles configuration validation, conversion, and optimization for clock rendering.
// TWEAK:
// Modify validation rules for different configuration requirements.
// Adjust optimization logic for performance vs accuracy trade-offs.
// Change transformation logic for different clock behaviors.

import { RotateItemConfig, ClockState, TimezoneConfig } from '../../types/launcher.types';
import { ClockLayerConfig, ExtendedHandType, HandConfiguration, ClockValidationResult } from './clock_types';
import { safeGet, safeNumber, safeString, safeBoolean } from '../../utils/safeAccessors';
import { VALIDATION_LIMITS, DEFAULT_VALUES, HAND_TYPES, ROTATION_TYPES } from '../../constants/launcher.constants';
import { validateTimezone, isValidClockState } from './clock_utils';

// ===== CONFIGURATION PROCESSOR CLASS =====

export class ClockConfigProcessor {
  /**
   * Process raw launcher config into clock-optimized configuration
   */
  static processLauncherConfig(launcherConfig: RotateItemConfig[]): ClockLayerConfig[] {
    return launcherConfig.map((config, index) => this.processLayerConfig(config, index));
  }

  /**
   * Process individual layer configuration
   */
  static processLayerConfig(config: RotateItemConfig, index: number): ClockLayerConfig {
    const processed: ClockLayerConfig = {
      ...config,
      
      // Ensure valid layer properties
      itemLayer: safeNumber(config.itemLayer, 1, 20, index + 1),
      itemSize: safeNumber(config.itemSize, 1, 1000, 100),
      
      // Process clock-specific properties
      clockPriority: this.calculateClockPriority(config),
      clockSmoothing: this.shouldEnableSmoothing(config),
      clockAnimation: this.processAnimationConfig(config),
      
      // Validate and process timezone
      timezone: this.processTimezoneConfig(config.timezone),
      
      // Ensure rotation configs are valid
      rotation1: this.validateRotationConfig(config.rotation1),
      rotation2: this.validateRotationConfig(config.rotation2),
    };

    return processed;
  }

  /**
   * Calculate clock priority based on hand type and configuration
   */
  private static calculateClockPriority(config: RotateItemConfig): number {
    // Clock hands get higher priority
    if (config.handType) {
      switch (config.handType) {
        case 'second': return 1; // Highest priority - needs smooth updates
        case 'minute': return 2;
        case 'hour': return 3;
        default: return 5;
      }
    }
    
    // Rotating elements get medium priority
    if (safeString(config.rotation1?.enabled) === 'yes' || 
        safeString(config.rotation2?.enabled) === 'yes') {
      return 7;
    }
    
    // Static elements get lowest priority
    return 10;
  }

  /**
   * Determine if layer should use smooth animations
   */
  private static shouldEnableSmoothing(config: RotateItemConfig): boolean {
    // Always smooth for second hands
    if (config.handType === 'second') return true;
    
    // Smooth for fast rotations
    const rotation1Speed = safeNumber(config.rotation1?.rotationSpeed, 86400);
    const rotation2Speed = safeNumber(config.rotation2?.rotationSpeed, 86400);
    const minSpeed = Math.min(rotation1Speed, rotation2Speed);
    
    // If rotation is faster than 1 hour, enable smoothing
    if (minSpeed < 3600) return true;
    
    // Smooth for visible, active layers
    if (safeString(config.itemDisplay) === 'yes' && 
        safeString(config.render) === 'yes') {
      return true;
    }
    
    return false;
  }

  /**
   * Process animation configuration for layer
   */
  private static processAnimationConfig(config: RotateItemConfig): {
    enabled: boolean;
    duration: number;
    easing: string;
  } {
    const isClockHand = !!config.handType;
    const hasRotation = safeString(config.rotation1?.enabled) === 'yes' || 
                       safeString(config.rotation2?.enabled) === 'yes';
    
    return {
      enabled: isClockHand || hasRotation,
      duration: isClockHand ? 100 : 300, // Faster for clock hands
      easing: isClockHand ? 'linear' : 'easeOutQuad',
    };
  }

  /**
   * Process and validate timezone configuration
   */
  private static processTimezoneConfig(timezone: any): TimezoneConfig | null {
    if (!timezone) return null;
    
    return validateTimezone(timezone);
  }

  /**
   * Validate and sanitize rotation configuration
   */
  private static validateRotationConfig(rotation: any): any {
    if (!rotation || typeof rotation !== 'object') {
      return {
        enabled: 'no',
        itemTiltPosition: 0,
        itemAxisX: 50,
        itemAxisY: 50,
        itemPositionX: 0,
        itemPositionY: 0,
        rotationSpeed: 86400,
        rotationWay: '+',
      };
    }

    return {
      enabled: rotation.enabled === 'yes' ? 'yes' : 'no',
      itemTiltPosition: safeNumber(rotation.itemTiltPosition, 0, 359, 0),
      itemAxisX: safeNumber(rotation.itemAxisX, 0, 100, 50),
      itemAxisY: safeNumber(rotation.itemAxisY, 0, 100, 50),
      itemPositionX: safeNumber(
        rotation.itemPositionX, 
        VALIDATION_LIMITS.POSITION.MIN, 
        VALIDATION_LIMITS.POSITION.MAX, 
        0
      ),
      itemPositionY: safeNumber(
        rotation.itemPositionY, 
        VALIDATION_LIMITS.POSITION.MIN, 
        VALIDATION_LIMITS.POSITION.MAX, 
        0
      ),
      rotationSpeed: safeNumber(
        rotation.rotationSpeed,
        VALIDATION_LIMITS.ROTATION_SPEED.MIN,
        VALIDATION_LIMITS.ROTATION_SPEED.MAX,
        86400
      ),
      rotationWay: ['+', '-'].includes(rotation.rotationWay) ? rotation.rotationWay : '+',
    };
  }

  /**
   * Extract clock hands from configuration
   */
  static extractClockHands(configs: ClockLayerConfig[]): ClockLayerConfig[] {
    return configs.filter(config => 
      config.handType && 
      config.handType !== null && 
      ['hour', 'minute', 'second'].includes(config.handType)
    );
  }

  /**
   * Extract decorative elements from configuration
   */
  static extractDecorativeElements(configs: ClockLayerConfig[]): ClockLayerConfig[] {
    return configs.filter(config => 
      !config.handType || 
      config.handType === null || 
      !['hour', 'minute', 'second'].includes(config.handType)
    );
  }

  /**
   * Group layers by rotation type
   */
  static groupByRotationType(configs: ClockLayerConfig[]): {
    rotation1: ClockLayerConfig[];
    rotation2: ClockLayerConfig[];
    staticLayers: ClockLayerConfig[];
  } {
    const rotation1: ClockLayerConfig[] = [];
    const rotation2: ClockLayerConfig[] = [];
    const staticLayers: ClockLayerConfig[] = [];

    configs.forEach(config => {
      const hasRotation1 = safeString(config.rotation1?.enabled) === 'yes';
      const hasRotation2 = safeString(config.rotation2?.enabled) === 'yes';

      if (hasRotation1) {
        rotation1.push(config);
      } else if (hasRotation2) {
        rotation2.push(config);
      } else {
        staticLayers.push(config);
      }
    });

    return { rotation1, rotation2, staticLayers };
  }

  /**
   * Sort layers by render priority
   */
  static sortByPriority(configs: ClockLayerConfig[]): ClockLayerConfig[] {
    return [...configs].sort((a, b) => {
      // First by layer number (z-index)
      if (a.itemLayer !== b.itemLayer) {
        return a.itemLayer - b.itemLayer;
      }
      
      // Then by clock priority
      const aPriority = a.clockPriority || 10;
      const bPriority = b.clockPriority || 10;
      return aPriority - bPriority;
    });
  }

  /**
   * Optimize configuration for performance
   */
  static optimizeForPerformance(configs: ClockLayerConfig[]): ClockLayerConfig[] {
    return configs.map(config => {
      const optimized = { ...config };

      // Disable smoothing for hidden layers
      if (safeString(config.itemDisplay) !== 'yes' || 
          safeString(config.render) !== 'yes') {
        optimized.clockSmoothing = false;
      }

      // Reduce animation complexity for low-priority layers
      if ((optimized.clockPriority || 10) > 7) {
        optimized.clockAnimation = {
          enabled: false,
          duration: 0,
          easing: 'linear',
        };
      }

      // Disable effects for high-frequency updates
      if (config.handType === 'second') {
        optimized.pulse = 'no';
        optimized.glow = 'no';
        optimized.transparent = 'no';
      }

      return optimized;
    });
  }

  /**
   * Validate entire clock configuration
   */
  static validateClockConfiguration(configs: ClockLayerConfig[]): ClockValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];
    let complexity = 'low' as 'low' | 'medium' | 'high' | 'extreme';
    let estimatedFPS = 60;
    let memoryEstimate = 0;

    // Check layer count
    if (configs.length > 20) {
      errors.push({
        type: 'config',
        message: `Too many layers: ${configs.length}. Maximum is 20.`,
        severity: 'high',
        suggestion: 'Remove unnecessary layers or combine similar elements.',
      });
    }

    // Analyze each layer
    configs.forEach((config, index) => {
      // Check for missing assets
      if (!config.itemPath) {
        errors.push({
          type: 'config',
          message: `Layer ${index + 1} has no image path.`,
          layerId: config.itemLayer,
          severity: 'medium',
          suggestion: 'Add a valid image path or disable the layer.',
        });
      }

      // Performance analysis
      const hasEffects = config.shadow === 'yes' || config.glow === 'yes' || 
                        config.pulse === 'yes' || config.transparent === 'yes';
      const hasRotation = safeString(config.rotation1?.enabled) === 'yes' || 
                         safeString(config.rotation2?.enabled) === 'yes';

      if (hasEffects && hasRotation) {
        memoryEstimate += 2; // MB estimate
        estimatedFPS -= 2;
      } else if (hasRotation) {
        memoryEstimate += 1;
        estimatedFPS -= 1;
      }

      // Check for potential performance issues
      if (config.handType === 'second' && hasEffects) {
        warnings.push({
          type: 'performance',
          message: `Second hand on layer ${config.itemLayer} has visual effects that may impact performance.`,
          layerId: config.itemLayer,
          impact: 'moderate',
          recommendation: 'Consider disabling effects on second hand for better performance.',
        });
      }
    });

    // Determine complexity
    const activeLayerCount = configs.filter(c => 
      safeString(c.itemDisplay) === 'yes' && safeString(c.render) === 'yes'
    ).length;
    
    if (activeLayerCount > 15) complexity = 'extreme';
    else if (activeLayerCount > 10) complexity = 'high';
    else if (activeLayerCount > 5) complexity = 'medium';

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      performance: {
        estimatedFPS: Math.max(estimatedFPS, 15), // Minimum 15fps
        memoryEstimate,
        complexity,
      },
    };
  }

  /**
   * Create default clock configuration for a layer
   */
  static createDefaultClockLayer(layerNumber: number): ClockLayerConfig {
    return {
      itemCode: `item_${layerNumber}`,
      itemName: `Layer ${layerNumber}`,
      itemPath: '',
      itemLayer: layerNumber,
      itemSize: 100,
      itemDisplay: 'no',
      
      handType: null,
      handRotation: null,
      timezone: null,
      
      shadow: 'no',
      glow: 'no',
      transparent: 'no',
      pulse: 'no',
      render: 'no',
      
      rotation1: this.validateRotationConfig(null),
      rotation2: this.validateRotationConfig(null),
      
      clockPriority: 10,
      clockSmoothing: false,
      clockAnimation: {
        enabled: false,
        duration: 300,
        easing: 'easeOutQuad',
      },
    };
  }

  /**
   * Convert clock configuration back to launcher format
   */
  static convertToLauncherFormat(config: ClockLayerConfig): RotateItemConfig {
    // Remove clock-specific properties and return base configuration
    const { clockPriority, clockSmoothing, clockAnimation, ...launcherConfig } = config;
    return launcherConfig as RotateItemConfig;
  }
}