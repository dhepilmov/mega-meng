//==============================================
// SMART SETTINGS VALIDATOR
//==============================================
// DETAILED DESCRIPTION:
// Advanced validation system with auto-recovery, performance protection,
// and intelligent error correction. Prevents crashes and data loss.
// TWEAK:
// Adjust validation thresholds for stricter or more lenient validation.
// Modify auto-recovery strategies for different error handling approaches.
// Change performance limits based on target device capabilities.

import { RotateItemConfig } from '../../types/launcher.types';
import { UserSettings } from './launcher_settings_manager';
import { VALIDATION_LIMITS, DEFAULT_VALUES, ERROR_MESSAGES } from '../../constants/launcher.constants';
import { safeNumber, safeString, safeBoolean } from '../../utils/safeAccessors';

// ===== VALIDATION INTERFACES =====

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  fixedSettings?: UserSettings;
  performance: PerformanceAssessment;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoFixed: boolean;
  originalValue?: any;
  fixedValue?: any;
}

export interface ValidationWarning {
  field: string;
  message: string;
  impact: 'minimal' | 'moderate' | 'significant';
  recommendation: string;
}

export interface PerformanceAssessment {
  level: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  score: number; // 0-100
  factors: {
    animationLoad: number;
    updateFrequency: number;
    memoryUsage: number;
    complexity: number;
  };
  recommendations: string[];
}

// ===== VALIDATION RULES =====

interface ValidationRule<T = any> {
  field: string;
  validator: (value: T, settings: UserSettings) => ValidationError | null;
  autoFix?: (value: T, settings: UserSettings) => T;
}

// ===== SMART VALIDATOR CLASS =====

export class SmartValidator {
  private static validationRules: ValidationRule[] = [
    // Theme validation
    {
      field: 'theme',
      validator: (value) => {
        const validThemes = ['auto', 'light', 'dark'];
        if (!validThemes.includes(value)) {
          return {
            field: 'theme',
            message: `Invalid theme "${value}". Must be: ${validThemes.join(', ')}`,
            severity: 'medium',
            autoFixed: false,
            originalValue: value,
          };
        }
        return null;
      },
      autoFix: (value) => ['auto', 'light', 'dark'].includes(value) ? value : 'auto',
    },

    // Clock update rate validation
    {
      field: 'clockUpdateRate',
      validator: (value) => {
        const rate = safeNumber(value, 15, 120, 60);
        if (rate !== value) {
          return {
            field: 'clockUpdateRate',
            message: `Invalid update rate ${value}. Must be between 15-120 FPS`,
            severity: rate < 30 ? 'high' : 'medium',
            autoFixed: true,
            originalValue: value,
            fixedValue: rate,
          };
        }
        return null;
      },
      autoFix: (value) => safeNumber(value, 15, 120, 60),
    },

    // Performance mode validation
    {
      field: 'advanced.performanceMode',
      validator: (value, settings) => {
        const validModes = ['high', 'balanced', 'battery'];
        if (!validModes.includes(value)) {
          return {
            field: 'advanced.performanceMode',
            message: `Invalid performance mode "${value}". Must be: ${validModes.join(', ')}`,
            severity: 'medium',
            autoFixed: false,
            originalValue: value,
          };
        }
        return null;
      },
      autoFix: (value) => ['high', 'balanced', 'battery'].includes(value) ? value : 'balanced',
    },

    // Animation quality validation
    {
      field: 'ui.animationQuality',
      validator: (value) => {
        const validQualities = ['low', 'medium', 'high', 'ultra'];
        if (!validQualities.includes(value)) {
          return {
            field: 'ui.animationQuality',
            message: `Invalid animation quality "${value}". Must be: ${validQualities.join(', ')}`,
            severity: 'low',
            autoFixed: false,
            originalValue: value,
          };
        }
        return null;
      },
      autoFix: (value) => ['low', 'medium', 'high', 'ultra'].includes(value) ? value : 'high',
    },

    // Time format validation
    {
      field: 'clock.timeFormat',
      validator: (value) => {
        const validFormats = ['12h', '24h'];
        if (!validFormats.includes(value)) {
          return {
            field: 'clock.timeFormat',
            message: `Invalid time format "${value}". Must be: ${validFormats.join(', ')}`,
            severity: 'low',
            autoFixed: false,
            originalValue: value,
          };
        }
        return null;
      },
      autoFix: (value) => ['12h', '24h'].includes(value) ? value : '24h',
    },
  ];

  /**
   * Validate complete user settings
   */
  static validateUserSettings(settings: UserSettings): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    let fixedSettings = { ...settings };

    try {
      // Run all validation rules
      this.validationRules.forEach(rule => {
        const fieldValue = this.getNestedValue(settings, rule.field);
        const error = rule.validator(fieldValue, settings);
        
        if (error) {
          errors.push(error);
          
          // Apply auto-fix if available
          if (rule.autoFix) {
            const fixedValue = rule.autoFix(fieldValue, settings);
            this.setNestedValue(fixedSettings, rule.field, fixedValue);
            error.autoFixed = true;
            error.fixedValue = fixedValue;
          }
        }
      });

      // Perform cross-field validation
      const crossValidation = this.validateCrossFieldConstraints(fixedSettings);
      errors.push(...crossValidation.errors);
      warnings.push(...crossValidation.warnings);
      
      if (crossValidation.fixes) {
        fixedSettings = { ...fixedSettings, ...crossValidation.fixes };
      }

      // Performance assessment
      const performance = this.assessPerformance(fixedSettings);
      warnings.push(...this.generatePerformanceWarnings(performance));

      // Compatibility checks
      const compatibility = this.checkCompatibility(fixedSettings);
      warnings.push(...compatibility);

      return {
        isValid: errors.filter(e => e.severity === 'critical').length === 0,
        errors,
        warnings,
        fixedSettings: errors.length > 0 ? fixedSettings : undefined,
        performance,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          field: 'validation',
          message: `Validation system error: ${error}`,
          severity: 'critical',
          autoFixed: false,
        }],
        warnings: [],
        performance: {
          level: 'critical',
          score: 0,
          factors: { animationLoad: 0, updateFrequency: 0, memoryUsage: 0, complexity: 0 },
          recommendations: ['Fix validation errors before proceeding'],
        },
      };
    }
  }

  /**
   * Validate layer configuration for performance
   */
  static validateLayerConfiguration(configs: RotateItemConfig[]): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check layer count
    if (configs.length > 20) {
      errors.push({
        field: 'layerCount',
        message: `Too many layers: ${configs.length}. Maximum is 20`,
        severity: 'high',
        autoFixed: false,
        originalValue: configs.length,
      });
    }

    // Analyze performance impact
    let animationLoad = 0;
    let complexityScore = 0;

    configs.forEach((config, index) => {
      // Check for performance-heavy configurations
      const hasRotation = config.rotation1?.enabled === 'yes' || config.rotation2?.enabled === 'yes';
      const hasEffects = config.shadow === 'yes' || config.glow === 'yes' || 
                        config.pulse === 'yes' || config.transparent === 'yes';
      
      if (hasRotation) animationLoad += 1;
      if (hasEffects) complexityScore += hasRotation ? 3 : 1;
      
      // Check for second hand with effects (performance killer)
      if (config.handType === 'second' && hasEffects) {
        warnings.push({
          field: `layer_${index + 1}`,
          message: `Layer ${index + 1}: Second hand with visual effects may impact performance`,
          impact: 'significant',
          recommendation: 'Consider disabling effects on second hand or reducing update frequency',
        });
      }

      // Validate rotation speeds
      if (config.rotation1?.enabled === 'yes') {
        const speed = safeNumber(config.rotation1.rotationSpeed, 1, 604800, 86400);
        if (speed < 60 && hasEffects) {
          warnings.push({
            field: `layer_${index + 1}_rotation1`,
            message: `Layer ${index + 1}: Very fast rotation (${speed}s) with effects`,
            impact: 'moderate',
            recommendation: 'Consider reducing effects or increasing rotation time',
          });
        }
      }
    });

    // Generate performance assessment
    const performanceScore = Math.max(0, 100 - (animationLoad * 5) - (complexityScore * 2));
    let performanceLevel: PerformanceAssessment['level'] = 'excellent';
    
    if (performanceScore < 30) performanceLevel = 'critical';
    else if (performanceScore < 50) performanceLevel = 'poor';
    else if (performanceScore < 70) performanceLevel = 'fair';
    else if (performanceScore < 90) performanceLevel = 'good';

    const performance: PerformanceAssessment = {
      level: performanceLevel,
      score: performanceScore,
      factors: {
        animationLoad: Math.min(100, animationLoad * 5),
        updateFrequency: 0, // Will be calculated based on settings
        memoryUsage: Math.min(100, complexityScore * 2),
        complexity: Math.min(100, configs.length * 5),
      },
      recommendations: this.generateLayerRecommendations(animationLoad, complexityScore),
    };

    return {
      isValid: errors.filter(e => e.severity === 'critical').length === 0,
      errors,
      warnings,
      performance,
    };
  }

  // ===== PRIVATE VALIDATION METHODS =====

  private static validateCrossFieldConstraints(settings: UserSettings): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
    fixes?: Partial<UserSettings>;
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const fixes: any = {};

    // Performance mode vs animation quality consistency
    if (settings.advanced?.performanceMode === 'battery' && 
        settings.ui?.animationQuality === 'ultra') {
      warnings.push({
        field: 'performance_consistency',
        message: 'Battery mode with ultra animations may drain battery faster',
        impact: 'moderate',
        recommendation: 'Consider reducing animation quality to "medium" for better battery life',
      });
    }

    // High update rate with low-end performance mode
    if (settings.clockUpdateRate > 60 && settings.advanced?.performanceMode === 'battery') {
      warnings.push({
        field: 'update_rate_performance',
        message: 'High update rate (>60fps) conflicts with battery performance mode',
        impact: 'significant',
        recommendation: 'Reduce update rate to 30fps for battery mode or switch to balanced mode',
      });
      
      // Auto-fix: reduce update rate
      fixes.clockUpdateRate = 30;
    }

    // Developer mode warnings
    if (settings.advanced?.developerMode && !settings.showDebugInfo) {
      warnings.push({
        field: 'developer_mode_consistency',
        message: 'Developer mode is enabled but debug info is hidden',
        impact: 'minimal',
        recommendation: 'Enable "showDebugInfo" to see developer information',
      });
    }

    return { errors, warnings, fixes: Object.keys(fixes).length > 0 ? fixes : undefined };
  }

  private static assessPerformance(settings: UserSettings): PerformanceAssessment {
    let score = 100;
    const factors = {
      animationLoad: 0,
      updateFrequency: 0,
      memoryUsage: 0,
      complexity: 0,
    };

    // Update frequency impact
    const updateRate = settings.clockUpdateRate || 60;
    if (updateRate > 60) {
      factors.updateFrequency = Math.min(50, (updateRate - 60) * 2);
      score -= factors.updateFrequency;
    }

    // Animation quality impact
    const animationQuality = settings.ui?.animationQuality || 'high';
    const qualityScores = { low: 0, medium: 10, high: 20, ultra: 35 };
    factors.animationLoad = qualityScores[animationQuality] || 20;
    score -= factors.animationLoad;

    // Performance mode adjustments
    const performanceMode = settings.advanced?.performanceMode || 'balanced';
    if (performanceMode === 'high') score += 10;
    else if (performanceMode === 'battery') score -= 10;

    // Developer features impact
    if (settings.advanced?.developerMode) {
      factors.complexity += 15;
      score -= 15;
    }
    
    if (settings.showDebugInfo) {
      factors.complexity += 10;
      score -= 10;
    }

    // Final score clamping
    score = Math.max(0, Math.min(100, score));

    let level: PerformanceAssessment['level'] = 'excellent';
    if (score < 30) level = 'critical';
    else if (score < 50) level = 'poor';
    else if (score < 70) level = 'fair';
    else if (score < 90) level = 'good';

    return {
      level,
      score,
      factors,
      recommendations: this.generatePerformanceRecommendations(settings, score),
    };
  }

  private static generatePerformanceRecommendations(settings: UserSettings, score: number): string[] {
    const recommendations: string[] = [];

    if (score < 70) {
      if (settings.clockUpdateRate > 60) {
        recommendations.push('Reduce clock update rate to 60fps or lower');
      }
      
      if (settings.ui?.animationQuality === 'ultra') {
        recommendations.push('Consider reducing animation quality to "high" or "medium"');
      }
      
      if (settings.advanced?.performanceMode === 'high') {
        recommendations.push('Switch to "balanced" performance mode');
      }
    }

    if (score < 50) {
      recommendations.push('Enable battery performance mode for better efficiency');
      recommendations.push('Disable experimental features if not needed');
      recommendations.push('Reduce visual effects on clock layers');
    }

    return recommendations;
  }

  private static generatePerformanceWarnings(performance: PerformanceAssessment): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    if (performance.level === 'poor' || performance.level === 'critical') {
      warnings.push({
        field: 'performance',
        message: `Performance level is ${performance.level} (${performance.score}/100)`,
        impact: 'significant',
        recommendation: performance.recommendations.join('; '),
      });
    }

    return warnings;
  }

  private static generateLayerRecommendations(animationLoad: number, complexityScore: number): string[] {
    const recommendations: string[] = [];

    if (animationLoad > 10) {
      recommendations.push('Reduce number of animated layers for better performance');
    }
    
    if (complexityScore > 20) {
      recommendations.push('Simplify visual effects on layers');
      recommendations.push('Consider disabling effects on fast-rotating elements');
    }
    
    if (animationLoad > 15 && complexityScore > 15) {
      recommendations.push('Switch to battery performance mode');
      recommendations.push('Reduce animation quality to medium or low');
    }

    return recommendations;
  }

  private static checkCompatibility(settings: UserSettings): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];

    // Check for potentially unsupported features
    if (settings.ui?.animationQuality === 'ultra' && typeof window !== 'undefined') {
      // Check device capabilities
      const deviceMemory = (navigator as any).deviceMemory;
      const hardwareConcurrency = navigator.hardwareConcurrency || 1;
      
      if (deviceMemory && deviceMemory < 4) {
        warnings.push({
          field: 'device_compatibility',
          message: 'Ultra animation quality may not perform well on this device',
          impact: 'moderate',
          recommendation: 'Consider reducing to "high" quality for this device',
        });
      }
      
      if (hardwareConcurrency < 4) {
        warnings.push({
          field: 'cpu_compatibility',
          message: 'Limited CPU cores detected, consider lower animation settings',
          impact: 'moderate',
          recommendation: 'Use "medium" animation quality for better performance',
        });
      }
    }

    return warnings;
  }

  // ===== UTILITY METHODS =====

  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private static setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }

  /**
   * Emergency recovery - create minimal valid settings
   */
  static createEmergencySettings(): UserSettings {
    return {
      theme: 'auto',
      showDebugInfo: false,
      enableAnimations: true,
      clockUpdateRate: 30, // Conservative for stability
      autoSave: true,
      lastModified: Date.now(),
      version: '2.0.0',
      
      advanced: {
        developerMode: false,
        performanceMode: 'battery', // Safe mode
        debugLevel: 'none',
        experimentalFeatures: false,
      },
      
      ui: {
        showLayerNumbers: false,
        showPerformanceMetrics: false,
        enableTooltips: true,
        animationQuality: 'low', // Safe for all devices
        colorScheme: 'auto',
      },
      
      clock: {
        defaultTimezone: 'auto',
        showSecondHand: false, // Disable for performance
        smoothSecondHand: false,
        timeFormat: '24h',
        dateFormat: 'YYYY-MM-DD',
      },
    };
  }
}