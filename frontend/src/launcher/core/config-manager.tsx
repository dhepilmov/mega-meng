//==============================================
// LAUNCHER CONFIG MANAGER
//==============================================
// DETAILED DESCRIPTION:
// Configuration management for the launcher system. Handles config validation,
// user settings persistence, and configuration updates. Extracted from launcher_screen.tsx
// for better modularity and testability.
// PHASE 6: Consolidated into unified launcher module structure.

import { RotateItemConfig } from '../types/launcher.types';
import { STORAGE_KEYS } from '../constants/launcher.constants';
import { createSafeLayerConfig, createDefaultLayerSet } from '../clock/defaults';
import { safeGet } from '../utils/safeAccessors';

// ===== CONFIGURATION INTERFACES =====

export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fixedConfig?: RotateItemConfig[];
}

export interface ConfigManagerOptions {
  autoSave: boolean;
  validateOnLoad: boolean;
  createBackups: boolean;
  maxBackups: number;
}

// ===== CONFIG MANAGER CLASS =====

export class LauncherConfigManager {
  private static options: ConfigManagerOptions = {
    autoSave: true,
    validateOnLoad: true,
    createBackups: true,
    maxBackups: 5,
  };

  /**
   * Load configuration from storage with validation
   */
  static loadConfig(): RotateItemConfig[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAUNCHER_CONFIG);
      
      if (!stored) {
        console.log('No stored config found, using defaults');
        return this.getDefaultConfig();
      }

      const parsed = JSON.parse(stored);
      
      if (this.options.validateOnLoad) {
        const validation = this.validateConfig(parsed);
        if (!validation.isValid && validation.fixedConfig) {
          console.warn('Config validation issues found, using fixed version:', validation.errors);
          this.saveConfig(validation.fixedConfig);
          return validation.fixedConfig;
        }
      }

      return parsed;
    } catch (error) {
      console.error('Error loading config:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Save configuration to storage
   */
  static saveConfig(config: RotateItemConfig[]): void {
    try {
      if (this.options.createBackups) {
        this.createBackup();
      }

      const configJson = JSON.stringify(config, null, 2);
      localStorage.setItem(STORAGE_KEYS.LAUNCHER_CONFIG, configJson);
      
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      throw new Error('Failed to save configuration');
    }
  }

  /**
   * Get default configuration
   */
  static getDefaultConfig(): RotateItemConfig[] {
    try {
      return createDefaultLayerSet();
    } catch (error) {
      console.error('Error creating default config:', error);
      
      // Fallback to minimal safe config
      return [createSafeLayerConfig(1)];
    }
  }

  /**
   * Validate configuration
   */
  static validateConfig(config: any): ConfigValidationResult {
    const result: ConfigValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
    };

    if (!Array.isArray(config)) {
      result.isValid = false;
      result.errors.push('Configuration must be an array');
      result.fixedConfig = this.getDefaultConfig();
      return result;
    }

    const fixedItems: RotateItemConfig[] = [];

    config.forEach((item: any, index: number) => {
      try {
        const fixedItem = this.validateAndFixItem(item, index);
        fixedItems.push(fixedItem);
      } catch (error) {
        result.warnings.push(`Item ${index}: ${error.message}`);
        // Use default config for broken items
        fixedItems.push(createSafeLayerConfig(index + 1));
      }
    });

    if (result.warnings.length > 0) {
      result.fixedConfig = fixedItems;
    }

    return result;
  }

  /**
   * Validate and fix individual item
   */
  private static validateAndFixItem(item: any, index: number): RotateItemConfig {
    const defaultItem = createSafeLayerConfig(index + 1);

    // Ensure all required properties exist
    const fixedItem: RotateItemConfig = {
      itemCode: safeGet(item, 'itemCode', defaultItem.itemCode),
      itemName: safeGet(item, 'itemName', defaultItem.itemName),
      itemPath: safeGet(item, 'itemPath', defaultItem.itemPath),
      itemLayer: safeGet(item, 'itemLayer', defaultItem.itemLayer),
      itemSize: this.validateNumber(safeGet(item, 'itemSize', defaultItem.itemSize), 1, 1000),
      itemDisplay: this.validateYesNo(safeGet(item, 'itemDisplay', defaultItem.itemDisplay)),
      
      // Clock configuration
      handType: this.validateHandType(safeGet(item, 'handType', defaultItem.handType)),
      handRotation: this.validateHandRotation(safeGet(item, 'handRotation', defaultItem.handRotation)),
      timezone: {
        enabled: this.validateYesNo(safeGet(item, 'timezone.enabled', defaultItem.timezone.enabled)),
        utcOffset: this.validateNumber(safeGet(item, 'timezone.utcOffset', defaultItem.timezone.utcOffset), -12, 14),
        use24Hour: this.validateYesNo(safeGet(item, 'timezone.use24Hour', defaultItem.timezone.use24Hour)),
      },
      
      // Visual effects
      shadow: this.validateYesNo(safeGet(item, 'shadow', defaultItem.shadow)),
      glow: this.validateYesNo(safeGet(item, 'glow', defaultItem.glow)),
      transparent: this.validateYesNo(safeGet(item, 'transparent', defaultItem.transparent)),
      pulse: this.validateYesNo(safeGet(item, 'pulse', defaultItem.pulse)),
      render: this.validateYesNo(safeGet(item, 'render', defaultItem.render)),
      
      // Rotation systems
      rotation1: this.validateRotationConfig(safeGet(item, 'rotation1', {}), defaultItem.rotation1),
      rotation2: this.validateRotationConfig(safeGet(item, 'rotation2', {}), defaultItem.rotation2),
    };

    return fixedItem;
  }

  /**
   * Validate rotation configuration
   */
  private static validateRotationConfig(rotation: any, defaultRotation: any): any {
    return {
      enabled: this.validateYesNo(safeGet(rotation, 'enabled', defaultRotation.enabled)),
      rotationSpeed: this.validateNumber(safeGet(rotation, 'rotationSpeed', defaultRotation.rotationSpeed), 0, 604800),
      rotationWay: this.validateRotationWay(safeGet(rotation, 'rotationWay', defaultRotation.rotationWay)),
      itemAxisX: this.validateNumber(safeGet(rotation, 'itemAxisX', defaultRotation.itemAxisX), -2000, 2000),
      itemAxisY: this.validateNumber(safeGet(rotation, 'itemAxisY', defaultRotation.itemAxisY), -2000, 2000),
      itemPositionX: this.validateNumber(safeGet(rotation, 'itemPositionX', defaultRotation.itemPositionX), -2000, 2000),
      itemPositionY: this.validateNumber(safeGet(rotation, 'itemPositionY', defaultRotation.itemPositionY), -2000, 2000),
      itemStaticDisplay: this.validateNumber(safeGet(rotation, 'itemStaticDisplay', defaultRotation.itemStaticDisplay), 0, 360),
    };
  }

  /**
   * Validation helpers
   */
  private static validateNumber(value: any, min: number, max: number): number {
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) return min;
    return Math.min(Math.max(num, min), max);
  }

  private static validateYesNo(value: any): 'yes' | 'no' {
    return value === 'yes' || value === 'no' ? value : 'no';
  }

  private static validateHandType(value: any): 'hour' | 'minute' | 'second' | 'none' {
    const validTypes = ['hour', 'minute', 'second', 'none'];
    return validTypes.includes(value) ? value : 'none';
  }

  private static validateHandRotation(value: any): 'ROTATION1' | 'ROTATION2' {
    return value === 'ROTATION1' || value === 'ROTATION2' ? value : 'ROTATION1';
  }

  private static validateRotationWay(value: any): '+' | '-' {
    return value === '+' || value === '-' ? value : '+';
  }

  /**
   * Create backup of current configuration
   */
  private static createBackup(): void {
    try {
      const current = localStorage.getItem(STORAGE_KEYS.LAUNCHER_CONFIG);
      if (!current) return;

      const timestamp = Date.now();
      const backupKey = `${STORAGE_KEYS.LAUNCHER_CONFIG}_backup_${timestamp}`;
      localStorage.setItem(backupKey, current);

      // Clean up old backups
      this.cleanupOldBackups();
    } catch (error) {
      console.warn('Failed to create backup:', error);
    }
  }

  /**
   * Clean up old backups
   */
  private static cleanupOldBackups(): void {
    try {
      const backupKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`${STORAGE_KEYS.LAUNCHER_CONFIG}_backup_`)) {
          const timestamp = parseInt(key.split('_').pop() || '0');
          backupKeys.push({ key, timestamp });
        }
      }

      // Sort by timestamp and remove old ones
      backupKeys.sort((a, b) => b.timestamp - a.timestamp);
      const toDelete = backupKeys.slice(this.options.maxBackups);
      
      toDelete.forEach(backup => {
        localStorage.removeItem(backup.key);
      });
    } catch (error) {
      console.warn('Failed to cleanup old backups:', error);
    }
  }

  /**
   * Reset to default configuration
   */
  static resetToDefault(): RotateItemConfig[] {
    try {
      const defaultConfig = this.getDefaultConfig();
      this.saveConfig(defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error('Error resetting to default:', error);
      throw new Error('Failed to reset to default configuration');
    }
  }

  /**
   * Update manager options
   */
  static updateOptions(newOptions: Partial<ConfigManagerOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Get current options
   */
  static getOptions(): ConfigManagerOptions {
    return { ...this.options };
  }

  // ===== INSTANCE METHODS FOR COMPATIBILITY =====

  constructor() {
    // Instance wrapper for static methods to maintain compatibility
  }

  async loadConfiguration(): Promise<RotateItemConfig[]> {
    return LauncherConfigManager.loadConfig();
  }

  async saveConfiguration(config: RotateItemConfig[]): Promise<void> {
    return LauncherConfigManager.saveConfig(config);
  }

  async resetToDefault(): Promise<RotateItemConfig[]> {
    return LauncherConfigManager.resetToDefault();
  }

  async validateConfiguration(config: RotateItemConfig[]): Promise<ConfigValidationResult> {
    return LauncherConfigManager.validateConfig(config);
  }
}

export default LauncherConfigManager;