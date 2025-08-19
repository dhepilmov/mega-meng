//==============================================
// LAUNCHER SETTINGS MANAGER
//==============================================
// DETAILED DESCRIPTION:
// Comprehensive settings management system with persistence, backup, and recovery.
// Handles per-user configurations, preset management, and data integrity.
// TWEAK:
// Modify storage strategies for different persistence backends.
// Adjust backup frequency and retention policies.
// Change validation levels for stricter or looser settings control.

import { RotateItemConfig, LauncherSettings } from '../../types/launcher.types';
import { STORAGE_KEYS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/launcher.constants';
import { LauncherConfigManager } from '../launcher_core_config_manager';
import { SmartValidator } from './launcher_settings_validator';
import { PresetManager } from './launcher_settings_presets';

// ===== SETTINGS INTERFACES =====

export interface UserSettings extends LauncherSettings {
  userId?: string;
  userName?: string;
  lastModified: number;
  version: string;
  
  // Advanced settings
  advanced: {
    developerMode: boolean;
    performanceMode: 'high' | 'balanced' | 'battery';
    debugLevel: 'none' | 'basic' | 'detailed' | 'verbose';
    experimentalFeatures: boolean;
  };
  
  // UI preferences
  ui: {
    showLayerNumbers: boolean;
    showPerformanceMetrics: boolean;
    enableTooltips: boolean;
    animationQuality: 'low' | 'medium' | 'high' | 'ultra';
    colorScheme: 'auto' | 'light' | 'dark' | 'custom';
  };
  
  // Clock preferences
  clock: {
    defaultTimezone: string;
    showSecondHand: boolean;
    smoothSecondHand: boolean;
    timeFormat: '12h' | '24h';
    dateFormat: string;
  };
}

export interface SettingsBackup {
  id: string;
  timestamp: number;
  settings: UserSettings;
  layerConfigs: RotateItemConfig[];
  metadata: {
    reason: 'manual' | 'auto' | 'preset_change' | 'reset';
    version: string;
    size: number;
  };
}

export interface SettingsOperationResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
  warnings?: string[];
}

// ===== SETTINGS MANAGER CLASS =====

export class LauncherSettingsManager {
  private static instance: LauncherSettingsManager | null = null;
  private currentSettings: UserSettings | null = null;
  private autoSaveEnabled: boolean = true;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  private changeListeners: Set<(settings: UserSettings) => void> = new Set();

  // ===== SINGLETON PATTERN =====

  static getInstance(): LauncherSettingsManager {
    if (!this.instance) {
      this.instance = new LauncherSettingsManager();
    }
    return this.instance;
  }

  private constructor() {
    this.initializeSettings();
    this.setupAutoSave();
  }

  // ===== INITIALIZATION =====

  private initializeSettings(): void {
    try {
      const stored = this.loadSettingsFromStorage();
      if (stored) {
        const validation = SmartValidator.validateUserSettings(stored);
        this.currentSettings = validation.isValid ? stored : this.createDefaultSettings();
        
        if (!validation.isValid) {
          console.warn('Settings validation failed, using defaults:', validation.errors);
          this.saveSettingsToStorage(this.currentSettings);
        }
      } else {
        this.currentSettings = this.createDefaultSettings();
        this.saveSettingsToStorage(this.currentSettings);
      }
    } catch (error) {
      console.error('Settings initialization failed:', error);
      this.currentSettings = this.createDefaultSettings();
    }
  }

  private createDefaultSettings(): UserSettings {
    const now = Date.now();
    return {
      // Base settings
      theme: 'auto',
      showDebugInfo: false,
      enableAnimations: true,
      clockUpdateRate: 60,
      autoSave: true,
      
      // User info
      lastModified: now,
      version: '2.0.0',
      
      // Advanced settings
      advanced: {
        developerMode: false,
        performanceMode: 'balanced',
        debugLevel: 'none',
        experimentalFeatures: false,
      },
      
      // UI preferences
      ui: {
        showLayerNumbers: false,
        showPerformanceMetrics: false,
        enableTooltips: true,
        animationQuality: 'high',
        colorScheme: 'auto',
      },
      
      // Clock preferences
      clock: {
        defaultTimezone: 'auto',
        showSecondHand: true,
        smoothSecondHand: true,
        timeFormat: '24h',
        dateFormat: 'YYYY-MM-DD',
      },
    };
  }

  // ===== CORE OPERATIONS =====

  /**
   * Get current settings (read-only copy)
   */
  getSettings(): UserSettings {
    return this.currentSettings ? { ...this.currentSettings } : this.createDefaultSettings();
  }

  /**
   * Update settings with validation
   */
  updateSettings(updates: Partial<UserSettings>): SettingsOperationResult {
    try {
      if (!this.currentSettings) {
        return {
          success: false,
          message: 'Settings not initialized',
          errors: ['Settings system not ready'],
        };
      }

      // Create updated settings
      const newSettings: UserSettings = {
        ...this.currentSettings,
        ...updates,
        lastModified: Date.now(),
      };

      // Validate new settings
      const validation = SmartValidator.validateUserSettings(newSettings);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Settings validation failed',
          errors: validation.errors.map(e => e.message),
          warnings: validation.warnings.map(w => w.message),
        };
      }

      // Apply auto-fixes if needed
      const fixedSettings = validation.fixedSettings || newSettings;

      // Create backup before updating
      if (this.isDifferent(this.currentSettings, fixedSettings)) {
        this.createAutoBackup('manual');
      }

      // Update current settings
      this.currentSettings = fixedSettings;

      // Save to storage
      if (this.autoSaveEnabled) {
        this.saveSettingsToStorage(this.currentSettings);
      }

      // Notify listeners
      this.notifyChangeListeners();

      return {
        success: true,
        message: SUCCESS_MESSAGES.CONFIG_SAVED,
        data: this.currentSettings,
        warnings: validation.warnings.map(w => w.message),
      };
    } catch (error) {
      return {
        success: false,
        message: ERROR_MESSAGES.STORAGE_ERROR,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Reset settings to defaults
   */
  resetToDefaults(): SettingsOperationResult {
    try {
      // Create backup before reset
      if (this.currentSettings) {
        this.createAutoBackup('reset');
      }

      this.currentSettings = this.createDefaultSettings();
      this.saveSettingsToStorage(this.currentSettings);
      this.notifyChangeListeners();

      return {
        success: true,
        message: SUCCESS_MESSAGES.RESET_COMPLETE,
        data: this.currentSettings,
      };
    } catch (error) {
      return {
        success: false,
        message: ERROR_MESSAGES.STORAGE_ERROR,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  // ===== STORAGE OPERATIONS =====

  private loadSettingsFromStorage(): UserSettings | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load settings from storage:', error);
      return null;
    }
  }

  private saveSettingsToStorage(settings: UserSettings): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Failed to save settings to storage:', error);
      return false;
    }
  }

  // ===== BACKUP SYSTEM =====

  /**
   * Create manual backup
   */
  createBackup(reason: string = 'manual'): SettingsOperationResult {
    try {
      if (!this.currentSettings) {
        return {
          success: false,
          message: 'No settings to backup',
          errors: ['Settings not initialized'],
        };
      }

      const layerConfigs = LauncherConfigManager.loadConfig();
      const backup = this.createBackupObject(this.currentSettings, layerConfigs, reason as any);
      
      this.saveBackupToStorage(backup);

      return {
        success: true,
        message: 'Backup created successfully',
        data: { backupId: backup.id },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create backup',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  private createAutoBackup(reason: 'auto' | 'preset_change' | 'reset'): void {
    if (!this.currentSettings) return;

    try {
      const layerConfigs = LauncherConfigManager.loadConfig();
      const backup = this.createBackupObject(this.currentSettings, layerConfigs, reason);
      this.saveBackupToStorage(backup);
      this.cleanOldBackups();
    } catch (error) {
      console.error('Auto backup failed:', error);
    }
  }

  private createBackupObject(
    settings: UserSettings,
    layerConfigs: RotateItemConfig[],
    reason: SettingsBackup['metadata']['reason']
  ): SettingsBackup {
    const id = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const settingsJson = JSON.stringify(settings);
    const configsJson = JSON.stringify(layerConfigs);
    
    return {
      id,
      timestamp: Date.now(),
      settings,
      layerConfigs,
      metadata: {
        reason,
        version: settings.version || '1.0.0',
        size: settingsJson.length + configsJson.length,
      },
    };
  }

  private saveBackupToStorage(backup: SettingsBackup): void {
    const backupKey = `${STORAGE_KEYS.SETTINGS}_backup_${backup.id}`;
    localStorage.setItem(backupKey, JSON.stringify(backup));
  }

  /**
   * Get available backups
   */
  getAvailableBackups(): SettingsBackup[] {
    const backups: SettingsBackup[] = [];
    const prefix = `${STORAGE_KEYS.SETTINGS}_backup_`;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          const backup = JSON.parse(localStorage.getItem(key)!);
          backups.push(backup);
        }
      }

      // Sort by timestamp, newest first
      return backups.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to load backups:', error);
      return [];
    }
  }

  /**
   * Restore from backup
   */
  restoreFromBackup(backupId: string): SettingsOperationResult {
    try {
      const backupKey = `${STORAGE_KEYS.SETTINGS}_backup_${backupId}`;
      const stored = localStorage.getItem(backupKey);
      
      if (!stored) {
        return {
          success: false,
          message: 'Backup not found',
          errors: [`Backup ${backupId} does not exist`],
        };
      }

      const backup: SettingsBackup = JSON.parse(stored);

      // Validate backup data
      const validation = SmartValidator.validateUserSettings(backup.settings);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Backup data is invalid',
          errors: validation.errors.map(e => e.message),
          warnings: validation.warnings.map(w => w.message),
        };
      }

      // Create current state backup before restore
      this.createAutoBackup('auto');

      // Restore settings
      this.currentSettings = validation.fixedSettings || backup.settings;
      this.saveSettingsToStorage(this.currentSettings);

      // Restore layer configs
      LauncherConfigManager.saveConfig(backup.layerConfigs);

      // Notify listeners
      this.notifyChangeListeners();

      return {
        success: true,
        message: 'Settings restored successfully',
        data: { 
          restoredFrom: backup.timestamp,
          reason: backup.metadata.reason,
        },
        warnings: validation.warnings,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to restore backup',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  private cleanOldBackups(): void {
    const maxBackups = 10; // Keep last 10 backups
    const backups = this.getAvailableBackups();
    
    if (backups.length > maxBackups) {
      const toDelete = backups.slice(maxBackups);
      toDelete.forEach(backup => {
        const backupKey = `${STORAGE_KEYS.SETTINGS}_backup_${backup.id}`;
        localStorage.removeItem(backupKey);
      });
    }
  }

  // ===== AUTO-SAVE SYSTEM =====

  private setupAutoSave(): void {
    // Auto-save every 30 seconds if changes detected
    this.autoSaveTimer = setInterval(() => {
      if (this.currentSettings && this.autoSaveEnabled) {
        this.saveSettingsToStorage(this.currentSettings);
      }
    }, 30000);
  }

  setAutoSave(enabled: boolean): void {
    this.autoSaveEnabled = enabled;
    
    if (enabled && !this.autoSaveTimer) {
      this.setupAutoSave();
    } else if (!enabled && this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  // ===== UTILITIES =====

  private isDifferent(a: UserSettings, b: UserSettings): boolean {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  /**
   * Add change listener
   */
  addChangeListener(callback: (settings: UserSettings) => void): () => void {
    this.changeListeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.changeListeners.delete(callback);
    };
  }

  private notifyChangeListeners(): void {
    if (this.currentSettings) {
      this.changeListeners.forEach(listener => {
        try {
          listener(this.currentSettings!);
        } catch (error) {
          console.error('Settings change listener error:', error);
        }
      });
    }
  }

  /**
   * Export settings as JSON
   */
  exportSettings(): string {
    if (!this.currentSettings) {
      throw new Error('No settings to export');
    }

    const exportData = {
      settings: this.currentSettings,
      layerConfigs: LauncherConfigManager.loadConfig(),
      exportedAt: Date.now(),
      version: this.currentSettings.version,
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import settings from JSON
   */
  importSettings(jsonString: string): SettingsOperationResult {
    try {
      const importData = JSON.parse(jsonString);
      
      if (!importData.settings) {
        return {
          success: false,
          message: 'Invalid import data format',
          errors: ['Missing settings data'],
        };
      }

      // Validate imported settings
      const validation = SmartValidator.validateUserSettings(importData.settings);
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Imported settings are invalid',
          errors: validation.errors.map(e => e.message),
          warnings: validation.warnings.map(w => w.message),
        };
      }

      // Create backup before import
      this.createAutoBackup('auto');

      // Apply imported settings
      this.currentSettings = validation.fixedSettings || importData.settings;
      if (!this.currentSettings) {
        return {
          success: false,
          message: 'Failed to apply imported settings',
          errors: ['Invalid settings data after validation'],
        };
      }
      this.currentSettings.lastModified = Date.now();
      
      // Save settings
      this.saveSettingsToStorage(this.currentSettings);

      // Import layer configs if present
      if (importData.layerConfigs && Array.isArray(importData.layerConfigs)) {
        LauncherConfigManager.saveConfig(importData.layerConfigs);
      }

      // Notify listeners
      this.notifyChangeListeners();

      return {
        success: true,
        message: 'Settings imported successfully',
        data: this.currentSettings,
        warnings: validation.warnings.map(w => w.message),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import settings',
        errors: [error instanceof Error ? error.message : 'Invalid JSON format'],
      };
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    
    this.changeListeners.clear();
    this.currentSettings = null;
  }
}

// ===== SINGLETON EXPORT =====
export const settingsManager = LauncherSettingsManager.getInstance();