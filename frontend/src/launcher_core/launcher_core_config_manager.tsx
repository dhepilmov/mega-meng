//==============================================
// LAUNCHER CORE CONFIG MANAGER
//==============================================
// DETAILED DESCRIPTION:
// Configuration management for the launcher system. Handles config validation,
// user settings persistence, and configuration updates. Extracted from launcher_screen.tsx
// for better modularity and testability.
// TWEAK:
// Modify validation rules for stricter/looser config validation.
// Adjust storage behavior for different persistence strategies.
// Change error handling for better user feedback.

import { RotateItemConfig } from '../types/launcher.types';
import { STORAGE_KEYS } from '../constants/launcher.constants';
import { createSafeLayerConfig, createDefaultLayerSet } from './clock/clock_defaults';
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
      const stored = localStorage.getItem(STORAGE_KEYS.USER_CONFIG);
      
      if (!stored) {
        console.log('No stored config found, creating default configuration');
        return createDefaultLayerSet();
      }

      const parsed = JSON.parse(stored);
      
      if (!Array.isArray(parsed)) {
        console.warn('Invalid config format, creating default configuration');
        return createDefaultLayerSet();
      }

      if (this.options.validateOnLoad) {
        const validation = this.validateConfig(parsed);
        if (!validation.isValid) {
          console.warn('Config validation failed:', validation.errors);
          if (validation.fixedConfig) {
            console.log('Using auto-fixed configuration');
            return validation.fixedConfig;
          }
          return createDefaultLayerSet();
        }
      }

      return parsed.map((config, index) => createSafeLayerConfig(config, index + 1));
    } catch (error) {
      console.error('Error loading configuration:', error);
      return createDefaultLayerSet();
    }
  }

  /**
   * Save configuration to storage
   */
  static saveConfig(config: RotateItemConfig[]): boolean {
    try {
      if (this.options.createBackups) {
        this.createBackup();
      }

      const validation = this.validateConfig(config);
      if (!validation.isValid) {
        console.error('Cannot save invalid configuration:', validation.errors);
        return false;
      }

      localStorage.setItem(STORAGE_KEYS.USER_CONFIG, JSON.stringify(config));
      console.log('Configuration saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving configuration:', error);
      return false;
    }
  }

  /**
   * Validate configuration array
   */
  static validateConfig(config: any[]): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const fixedConfig: RotateItemConfig[] = [];

    if (!Array.isArray(config)) {
      return {
        isValid: false,
        errors: ['Configuration must be an array'],
        warnings: [],
      };
    }

    if (config.length === 0) {
      return {
        isValid: false,
        errors: ['Configuration cannot be empty'],
        warnings: [],
      };
    }

    if (config.length > 20) {
      warnings.push(`Configuration has ${config.length} layers, maximum is 20`);
      config = config.slice(0, 20);
    }

    // Validate each layer
    config.forEach((layer, index) => {
      try {
        const safeLayer = createSafeLayerConfig(layer, index + 1);
        fixedConfig.push(safeLayer);
        
        // Check for common issues
        if (!layer.itemPath) {
          warnings.push(`Layer ${index + 1} has no image path`);
        }
        
        if (layer.itemLayer !== index + 1) {
          warnings.push(`Layer ${index + 1} has incorrect layer number (${layer.itemLayer})`);
        }
      } catch (error) {
        errors.push(`Layer ${index + 1} validation failed: ${error}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      fixedConfig: fixedConfig.length > 0 ? fixedConfig : undefined,
    };
  }

  /**
   * Create backup of current configuration
   */
  private static createBackup(): void {
    try {
      const current = localStorage.getItem(STORAGE_KEYS.USER_CONFIG);
      if (!current) return;

      const timestamp = new Date().toISOString();
      const backupKey = `${STORAGE_KEYS.USER_CONFIG}_backup_${timestamp}`;
      
      localStorage.setItem(backupKey, current);

      // Clean old backups
      this.cleanOldBackups();
    } catch (error) {
      console.error('Error creating configuration backup:', error);
    }
  }

  /**
   * Clean old backups keeping only the most recent ones
   */
  private static cleanOldBackups(): void {
    try {
      const backupKeys: string[] = [];
      const prefix = `${STORAGE_KEYS.USER_CONFIG}_backup_`;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          backupKeys.push(key);
        }
      }

      backupKeys.sort().reverse(); // Sort by timestamp, newest first

      // Remove excess backups
      if (backupKeys.length > this.options.maxBackups) {
        for (let i = this.options.maxBackups; i < backupKeys.length; i++) {
          localStorage.removeItem(backupKeys[i]);
        }
      }
    } catch (error) {
      console.error('Error cleaning old backups:', error);
    }
  }

  /**
   * Reset configuration to defaults
   */
  static resetToDefaults(): RotateItemConfig[] {
    try {
      const defaultConfig = createDefaultLayerSet();
      this.saveConfig(defaultConfig);
      return defaultConfig;
    } catch (error) {
      console.error('Error resetting to defaults:', error);
      return createDefaultLayerSet();
    }
  }

  /**
   * Update specific layer configuration
   */
  static updateLayer(
    currentConfig: RotateItemConfig[], 
    layerId: number, 
    updates: Partial<RotateItemConfig>
  ): RotateItemConfig[] {
    try {
      const newConfig = [...currentConfig];
      const layerIndex = newConfig.findIndex(layer => layer.itemLayer === layerId);
      
      if (layerIndex === -1) {
        console.error(`Layer ${layerId} not found`);
        return currentConfig;
      }

      // Merge updates with existing config
      const updatedLayer = createSafeLayerConfig({
        ...newConfig[layerIndex],
        ...updates,
      }, layerId);

      newConfig[layerIndex] = updatedLayer;

      if (this.options.autoSave) {
        this.saveConfig(newConfig);
      }

      return newConfig;
    } catch (error) {
      console.error(`Error updating layer ${layerId}:`, error);
      return currentConfig;
    }
  }

  /**
   * Get available backups
   */
  static getAvailableBackups(): Array<{ key: string; timestamp: string }> {
    try {
      const backups: Array<{ key: string; timestamp: string }> = [];
      const prefix = `${STORAGE_KEYS.USER_CONFIG}_backup_`;

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const timestamp = key.replace(prefix, '');
          backups.push({ key, timestamp });
        }
      }

      return backups.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    } catch (error) {
      console.error('Error getting available backups:', error);
      return [];
    }
  }

  /**
   * Restore from backup
   */
  static restoreFromBackup(backupKey: string): RotateItemConfig[] | null {
    try {
      const backup = localStorage.getItem(backupKey);
      if (!backup) {
        console.error('Backup not found:', backupKey);
        return null;
      }

      const config = JSON.parse(backup);
      const validation = this.validateConfig(config);
      
      if (!validation.isValid) {
        console.error('Backup configuration is invalid:', validation.errors);
        return null;
      }

      this.saveConfig(validation.fixedConfig || config);
      return validation.fixedConfig || config;
    } catch (error) {
      console.error('Error restoring from backup:', error);
      return null;
    }
  }

  /**
   * Update manager options
   */
  static updateOptions(newOptions: Partial<ConfigManagerOptions>): void {
    this.options = { ...this.options, ...newOptions };
  }

  /**
   * Export configuration as JSON
   */
  static exportConfig(config: RotateItemConfig[]): string {
    try {
      return JSON.stringify(config, null, 2);
    } catch (error) {
      console.error('Error exporting configuration:', error);
      return '';
    }
  }

  /**
   * Import configuration from JSON
   */
  static importConfig(jsonString: string): RotateItemConfig[] | null {
    try {
      const config = JSON.parse(jsonString);
      const validation = this.validateConfig(config);
      
      if (!validation.isValid) {
        console.error('Imported configuration is invalid:', validation.errors);
        return null;
      }

      return validation.fixedConfig || config;
    } catch (error) {
      console.error('Error importing configuration:', error);
      return null;
    }
  }
}