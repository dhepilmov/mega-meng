//==============================================
// PRESET MANAGEMENT SYSTEM
//==============================================
// DETAILED DESCRIPTION:
// Comprehensive preset management for clock configurations and settings.
// Supports save/load/delete operations, preset categories, and sharing.
// TWEAK:
// Modify preset categories for different organization schemes.
// Adjust validation levels for preset data integrity.
// Change sharing mechanisms for different distribution methods.

import { RotateItemConfig, LauncherSettings } from '../../types/launcher.types';
import { UserSettings } from './launcher_settings_manager';
import { SmartValidator } from './launcher_settings_validator';
import { STORAGE_KEYS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/launcher.constants';
import { LauncherConfigManager } from '../launcher_core_config_manager';

// ===== PRESET INTERFACES =====

export interface PresetInfo {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  tags: string[];
  
  // Metadata
  created: number;
  updated: number;
  version: string;
  author?: string;
  
  // Usage stats
  usageCount: number;
  lastUsed: number;
  
  // Validation
  isValid: boolean;
  compatibility: 'all' | 'modern' | 'legacy';
}

export interface LayerPreset extends PresetInfo {
  type: 'layer';
  layerConfig: RotateItemConfig;
  targetLayer?: number; // Specific layer this preset is for
}

export interface SystemPreset extends PresetInfo {
  type: 'system';
  layerConfigs: RotateItemConfig[];
  settings?: Partial<UserSettings>;
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
}

export interface SettingsPreset extends PresetInfo {
  type: 'settings';
  settings: UserSettings;
  scope: 'ui' | 'performance' | 'advanced' | 'complete';
}

export type PresetCategory = 
  | 'clock_faces'      // Complete clock designs
  | 'hands'           // Clock hand styles
  | 'decorations'     // Decorative elements
  | 'animations'      // Animation presets
  | 'themes'          // Visual themes
  | 'performance'     // Performance optimizations
  | 'experimental'    // Experimental features
  | 'user_created'    // User-made presets
  | 'favorites';      // Favorited presets

export type AnyPreset = LayerPreset | SystemPreset | SettingsPreset;

export interface PresetOperationResult {
  success: boolean;
  message: string;
  preset?: AnyPreset;
  errors?: string[];
  warnings?: string[];
}

export interface PresetSearchOptions {
  category?: PresetCategory;
  tags?: string[];
  type?: 'layer' | 'system' | 'settings';
  compatibility?: 'all' | 'modern' | 'legacy';
  query?: string; // Text search
  sortBy?: 'name' | 'created' | 'updated' | 'usage' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

// ===== PRESET MANAGER CLASS =====

export class PresetManager {
  private static instance: PresetManager | null = null;
  private presets: Map<string, AnyPreset> = new Map();
  private favorites: Set<string> = new Set();
  private recentlyUsed: string[] = [];

  // ===== SINGLETON PATTERN =====

  static getInstance(): PresetManager {
    if (!this.instance) {
      this.instance = new PresetManager();
    }
    return this.instance;
  }

  private constructor() {
    this.loadPresetsFromStorage();
    this.loadBuiltInPresets();
  }

  // ===== PRESET OPERATIONS =====

  /**
   * Save layer preset
   */
  saveLayerPreset(
    name: string,
    description: string,
    layerConfig: RotateItemConfig,
    options?: {
      category?: PresetCategory;
      tags?: string[];
      targetLayer?: number;
      author?: string;
    }
  ): PresetOperationResult {
    try {
      // Validate layer configuration
      const validation = SmartValidator.validateLayerConfiguration([layerConfig]);
      if (!validation.isValid && validation.errors.some(e => e.severity === 'critical')) {
        return {
          success: false,
          message: 'Layer configuration is invalid',
          errors: validation.errors.map(e => e.message),
        };
      }

      const preset: LayerPreset = {
        id: this.generatePresetId(),
        name: name.trim(),
        description: description.trim(),
        type: 'layer',
        category: options?.category || 'user_created',
        tags: options?.tags || [],
        
        created: Date.now(),
        updated: Date.now(),
        version: '2.0.0',
        author: options?.author,
        
        usageCount: 0,
        lastUsed: 0,
        
        isValid: validation.isValid,
        compatibility: 'all',
        
        layerConfig,
        targetLayer: options?.targetLayer,
      };

      this.presets.set(preset.id, preset);
      this.savePresetsToStorage();

      return {
        success: true,
        message: SUCCESS_MESSAGES.PRESET_CREATED,
        preset,
        warnings: validation.warnings?.map(w => w.message),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to save layer preset',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Save system preset (complete clock configuration)
   */
  saveSystemPreset(
    name: string,
    description: string,
    layerConfigs: RotateItemConfig[],
    options?: {
      category?: PresetCategory;
      tags?: string[];
      settings?: Partial<UserSettings>;
      author?: string;
    }
  ): PresetOperationResult {
    try {
      // Validate system configuration
      const validation = SmartValidator.validateLayerConfiguration(layerConfigs);
      if (!validation.isValid && validation.errors.some(e => e.severity === 'critical')) {
        return {
          success: false,
          message: 'System configuration is invalid',
          errors: validation.errors.map(e => e.message),
        };
      }

      // Determine complexity
      const activeLayerCount = layerConfigs.filter(c => c.itemDisplay === 'yes').length;
      const animationCount = layerConfigs.filter(c => 
        c.rotation1?.enabled === 'yes' || c.rotation2?.enabled === 'yes'
      ).length;
      
      let complexity: SystemPreset['complexity'] = 'simple';
      if (activeLayerCount > 15 || animationCount > 10) complexity = 'expert';
      else if (activeLayerCount > 10 || animationCount > 5) complexity = 'complex';
      else if (activeLayerCount > 5 || animationCount > 2) complexity = 'moderate';

      const preset: SystemPreset = {
        id: this.generatePresetId(),
        name: name.trim(),
        description: description.trim(),
        type: 'system',
        category: options?.category || 'user_created',
        tags: options?.tags || [],
        
        created: Date.now(),
        updated: Date.now(),
        version: '2.0.0',
        author: options?.author,
        
        usageCount: 0,
        lastUsed: 0,
        
        isValid: validation.isValid,
        compatibility: validation.performance.score > 30 ? 'all' : 'modern',
        
        layerConfigs,
        settings: options?.settings,
        complexity,
      };

      this.presets.set(preset.id, preset);
      this.savePresetsToStorage();

      return {
        success: true,
        message: SUCCESS_MESSAGES.PRESET_CREATED,
        preset,
        warnings: validation.warnings?.map(w => w.message),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to save system preset',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Save settings preset
   */
  saveSettingsPreset(
    name: string,
    description: string,
    settings: UserSettings,
    options?: {
      category?: PresetCategory;
      tags?: string[];
      scope?: SettingsPreset['scope'];
      author?: string;
    }
  ): PresetOperationResult {
    try {
      // Validate settings
      const validation = SmartValidator.validateUserSettings(settings);
      if (!validation.isValid && validation.errors.some(e => e.severity === 'critical')) {
        return {
          success: false,
          message: 'Settings configuration is invalid',
          errors: validation.errors.map(e => e.message),
        };
      }

      const preset: SettingsPreset = {
        id: this.generatePresetId(),
        name: name.trim(),
        description: description.trim(),
        type: 'settings',
        category: options?.category || 'user_created',
        tags: options?.tags || [],
        
        created: Date.now(),
        updated: Date.now(),
        version: '2.0.0',
        author: options?.author,
        
        usageCount: 0,
        lastUsed: 0,
        
        isValid: validation.isValid,
        compatibility: 'all',
        
        settings,
        scope: options?.scope || 'complete',
      };

      this.presets.set(preset.id, preset);
      this.savePresetsToStorage();

      return {
        success: true,
        message: SUCCESS_MESSAGES.PRESET_CREATED,
        preset,
        warnings: validation.warnings?.map(w => w.message),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to save settings preset',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Load preset by ID
   */
  loadPreset(presetId: string): PresetOperationResult {
    try {
      const preset = this.presets.get(presetId);
      if (!preset) {
        return {
          success: false,
          message: 'Preset not found',
          errors: [`Preset ${presetId} does not exist`],
        };
      }

      // Update usage statistics
      preset.usageCount++;
      preset.lastUsed = Date.now();
      this.updateRecentlyUsed(presetId);

      // Apply preset based on type
      let applyResult: any = { success: true };
      
      if (preset.type === 'layer') {
        // Layer presets don't auto-apply, just return the config
      } else if (preset.type === 'system') {
        LauncherConfigManager.saveConfig(preset.layerConfigs);
        // Apply settings if included
        if (preset.settings) {
          // Settings would be applied by the settings manager
        }
      } else if (preset.type === 'settings') {
        // Settings would be applied by the settings manager
      }

      this.savePresetsToStorage();

      return {
        success: true,
        message: 'Preset loaded successfully',
        preset,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to load preset',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Delete preset
   */
  deletePreset(presetId: string): PresetOperationResult {
    try {
      const preset = this.presets.get(presetId);
      if (!preset) {
        return {
          success: false,
          message: 'Preset not found',
          errors: [`Preset ${presetId} does not exist`],
        };
      }

      // Don't allow deletion of built-in presets
      if (preset.category !== 'user_created' && preset.category !== 'favorites') {
        return {
          success: false,
          message: 'Cannot delete built-in preset',
          errors: ['Built-in presets cannot be deleted'],
        };
      }

      this.presets.delete(presetId);
      this.favorites.delete(presetId);
      this.recentlyUsed = this.recentlyUsed.filter(id => id !== presetId);
      
      this.savePresetsToStorage();

      return {
        success: true,
        message: 'Preset deleted successfully',
        preset,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete preset',
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  // ===== SEARCH AND FILTER =====

  /**
   * Search presets with advanced filtering
   */
  searchPresets(options: PresetSearchOptions = {}): AnyPreset[] {
    let results = Array.from(this.presets.values());

    // Filter by type
    if (options.type) {
      results = results.filter(p => p.type === options.type);
    }

    // Filter by category
    if (options.category) {
      results = results.filter(p => p.category === options.category);
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter(p => 
        options.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Filter by compatibility
    if (options.compatibility) {
      results = results.filter(p => 
        p.compatibility === 'all' || p.compatibility === options.compatibility
      );
    }

    // Text search
    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort results
    const sortBy = options.sortBy || 'updated';
    const sortOrder = options.sortOrder || 'desc';
    
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = a.created - b.created;
          break;
        case 'updated':
          comparison = a.updated - b.updated;
          break;
        case 'usage':
          comparison = a.usageCount - b.usageCount;
          break;
        case 'popularity':
          comparison = (a.usageCount + (this.favorites.has(a.id) ? 100 : 0)) - 
                      (b.usageCount + (this.favorites.has(b.id) ? 100 : 0));
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Limit results
    if (options.limit && options.limit > 0) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  /**
   * Get presets by category
   */
  getPresetsByCategory(category: PresetCategory): AnyPreset[] {
    return this.searchPresets({ category, sortBy: 'name' });
  }

  /**
   * Get recently used presets
   */
  getRecentlyUsed(limit: number = 10): AnyPreset[] {
    return this.recentlyUsed
      .slice(0, limit)
      .map(id => this.presets.get(id))
      .filter((preset): preset is AnyPreset => preset !== undefined);
  }

  /**
   * Get favorite presets
   */
  getFavorites(): AnyPreset[] {
    return Array.from(this.favorites)
      .map(id => this.presets.get(id))
      .filter((preset): preset is AnyPreset => preset !== undefined)
      .sort((a, b) => b.updated - a.updated);
  }

  // ===== FAVORITES MANAGEMENT =====

  /**
   * Add preset to favorites
   */
  addToFavorites(presetId: string): boolean {
    if (this.presets.has(presetId)) {
      this.favorites.add(presetId);
      this.saveFavoritesToStorage();
      return true;
    }
    return false;
  }

  /**
   * Remove preset from favorites
   */
  removeFromFavorites(presetId: string): boolean {
    const removed = this.favorites.delete(presetId);
    if (removed) {
      this.saveFavoritesToStorage();
    }
    return removed;
  }

  /**
   * Check if preset is favorite
   */
  isFavorite(presetId: string): boolean {
    return this.favorites.has(presetId);
  }

  // ===== IMPORT/EXPORT =====

  /**
   * Export preset as JSON
   */
  exportPreset(presetId: string): string | null {
    const preset = this.presets.get(presetId);
    if (!preset) return null;

    const exportData = {
      ...preset,
      exportedAt: Date.now(),
      exportVersion: '2.0.0',
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import preset from JSON
   */
  importPreset(jsonString: string): PresetOperationResult {
    try {
      const importData = JSON.parse(jsonString);
      
      // Basic validation
      if (!importData.id || !importData.name || !importData.type) {
        return {
          success: false,
          message: 'Invalid preset format',
          errors: ['Missing required fields: id, name, type'],
        };
      }

      // Generate new ID to avoid conflicts
      const newId = this.generatePresetId();
      const preset: AnyPreset = {
        ...importData,
        id: newId,
        created: Date.now(),
        updated: Date.now(),
        usageCount: 0,
        lastUsed: 0,
        category: 'user_created', // Force user category for imported presets
      };

      // Validate based on type
      let validation: any = { isValid: true, warnings: [] };
      
      if (preset.type === 'layer') {
        validation = SmartValidator.validateLayerConfiguration([(preset as LayerPreset).layerConfig]);
      } else if (preset.type === 'system') {
        validation = SmartValidator.validateLayerConfiguration((preset as SystemPreset).layerConfigs);
      } else if (preset.type === 'settings') {
        validation = SmartValidator.validateUserSettings((preset as SettingsPreset).settings);
      }

      preset.isValid = validation.isValid;
      this.presets.set(preset.id, preset);
      this.savePresetsToStorage();

      return {
        success: true,
        message: 'Preset imported successfully',
        preset,
        warnings: validation.warnings?.map((w: any) => w.message),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import preset',
        errors: [error instanceof Error ? error.message : 'Invalid JSON format'],
      };
    }
  }

  // ===== BUILT-IN PRESETS =====

  private loadBuiltInPresets(): void {
    // Add some default presets if none exist
    if (this.presets.size === 0) {
      this.createDefaultPresets();
    }
  }

  private createDefaultPresets(): void {
    // Simple analog clock preset
    const simpleAnalogLayers: RotateItemConfig[] = [
      {
        itemCode: 'clock_bg',
        itemName: 'Clock Background',
        itemPath: 'launcher_core/clock/layers_res/clockBG.png',
        itemLayer: 1,
        itemSize: 100,
        itemDisplay: 'yes',
        handType: null,
        handRotation: null,
        shadow: 'no',
        glow: 'no',
        transparent: 'no',
        pulse: 'no',
        render: 'yes',
        rotation1: { enabled: 'no', itemTiltPosition: 0, itemAxisX: 50, itemAxisY: 50, itemPositionX: 0, itemPositionY: 0, rotationSpeed: 86400, rotationWay: '+' },
        rotation2: { enabled: 'no', itemTiltPosition: 0, itemAxisX: 50, itemAxisY: 50, itemPositionX: 0, itemPositionY: 0, rotationSpeed: 86400, rotationWay: '+' },
      },
      {
        itemCode: 'hour_hand',
        itemName: 'Hour Hand',
        itemPath: 'launcher_core/clock/layers_res/hourHand.png',
        itemLayer: 2,
        itemSize: 100,
        itemDisplay: 'yes',
        handType: 'hour',
        handRotation: 'ROTATION1',
        shadow: 'yes',
        glow: 'no',
        transparent: 'no',
        pulse: 'no',
        render: 'yes',
        rotation1: { enabled: 'yes', itemTiltPosition: 0, itemAxisX: 50, itemAxisY: 80, itemPositionX: 0, itemPositionY: 0, rotationSpeed: 43200, rotationWay: '+' },
        rotation2: { enabled: 'no', itemTiltPosition: 0, itemAxisX: 50, itemAxisY: 50, itemPositionX: 0, itemPositionY: 0, rotationSpeed: 86400, rotationWay: '+' },
      },
      {
        itemCode: 'minute_hand',
        itemName: 'Minute Hand',
        itemPath: 'launcher_core/clock/layers_res/minuteHand.png',
        itemLayer: 3,
        itemSize: 100,
        itemDisplay: 'yes',
        handType: 'minute',
        handRotation: 'ROTATION1',
        shadow: 'yes',
        glow: 'no',
        transparent: 'no',
        pulse: 'no',
        render: 'yes',
        rotation1: { enabled: 'yes', itemTiltPosition: 0, itemAxisX: 50, itemAxisY: 80, itemPositionX: 0, itemPositionY: 0, rotationSpeed: 3600, rotationWay: '+' },
        rotation2: { enabled: 'no', itemTiltPosition: 0, itemAxisX: 50, itemAxisY: 50, itemPositionX: 0, itemPositionY: 0, rotationSpeed: 86400, rotationWay: '+' },
      },
    ];

    const simpleAnalogPreset: SystemPreset = {
      id: 'preset_simple_analog',
      name: 'Simple Analog Clock',
      description: 'Clean analog clock with hour and minute hands',
      type: 'system',
      category: 'clock_faces',
      tags: ['analog', 'simple', 'classic'],
      created: Date.now(),
      updated: Date.now(),
      version: '2.0.0',
      author: 'System',
      usageCount: 0,
      lastUsed: 0,
      isValid: true,
      compatibility: 'all',
      layerConfigs: simpleAnalogLayers,
      complexity: 'simple',
    };

    this.presets.set(simpleAnalogPreset.id, simpleAnalogPreset);
    
    // Performance optimized preset
    const performanceSettings: UserSettings = {
      theme: 'auto',
      showDebugInfo: false,
      enableAnimations: true,
      clockUpdateRate: 30,
      autoSave: true,
      lastModified: Date.now(),
      version: '2.0.0',
      advanced: {
        developerMode: false,
        performanceMode: 'battery',
        debugLevel: 'none',
        experimentalFeatures: false,
      },
      ui: {
        showLayerNumbers: false,
        showPerformanceMetrics: false,
        enableTooltips: true,
        animationQuality: 'medium',
        colorScheme: 'auto',
      },
      clock: {
        defaultTimezone: 'auto',
        showSecondHand: false,
        smoothSecondHand: false,
        timeFormat: '24h',
        dateFormat: 'YYYY-MM-DD',
      },
    };

    const performancePreset: SettingsPreset = {
      id: 'preset_performance',
      name: 'Battery Optimized',
      description: 'Settings optimized for battery life and performance',
      type: 'settings',
      category: 'performance',
      tags: ['battery', 'performance', 'optimized'],
      created: Date.now(),
      updated: Date.now(),
      version: '2.0.0',
      author: 'System',
      usageCount: 0,
      lastUsed: 0,
      isValid: true,
      compatibility: 'all',
      settings: performanceSettings,
      scope: 'performance',
    };

    this.presets.set(performancePreset.id, performancePreset);
  }

  // ===== STORAGE OPERATIONS =====

  private loadPresetsFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRESETS);
      if (stored) {
        const data = JSON.parse(stored);
        
        if (data.presets) {
          data.presets.forEach((preset: AnyPreset) => {
            this.presets.set(preset.id, preset);
          });
        }
        
        if (data.favorites) {
          this.favorites = new Set(data.favorites);
        }
        
        if (data.recentlyUsed) {
          this.recentlyUsed = data.recentlyUsed;
        }
      }
    } catch (error) {
      console.error('Failed to load presets from storage:', error);
    }
  }

  private savePresetsToStorage(): void {
    try {
      const data = {
        presets: Array.from(this.presets.values()),
        favorites: Array.from(this.favorites),
        recentlyUsed: this.recentlyUsed,
        lastUpdated: Date.now(),
      };
      
      localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save presets to storage:', error);
    }
  }

  private saveFavoritesToStorage(): void {
    // Favorites are saved as part of savePresetsToStorage
    this.savePresetsToStorage();
  }

  // ===== UTILITIES =====

  private generatePresetId(): string {
    return `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateRecentlyUsed(presetId: string): void {
    // Remove if already exists
    this.recentlyUsed = this.recentlyUsed.filter(id => id !== presetId);
    
    // Add to beginning
    this.recentlyUsed.unshift(presetId);
    
    // Keep only last 20
    if (this.recentlyUsed.length > 20) {
      this.recentlyUsed = this.recentlyUsed.slice(0, 20);
    }
  }

  /**
   * Get preset statistics
   */
  getStatistics(): {
    totalPresets: number;
    presetsByType: Record<string, number>;
    presetsByCategory: Record<string, number>;
    totalFavorites: number;
    totalUsage: number;
  } {
    const presetArray = Array.from(this.presets.values());
    
    const byType: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    let totalUsage = 0;

    presetArray.forEach(preset => {
      byType[preset.type] = (byType[preset.type] || 0) + 1;
      byCategory[preset.category] = (byCategory[preset.category] || 0) + 1;
      totalUsage += preset.usageCount;
    });

    return {
      totalPresets: presetArray.length,
      presetsByType: byType,
      presetsByCategory: byCategory,
      totalFavorites: this.favorites.size,
      totalUsage,
    };
  }

  /**
   * Clear all user-created presets
   */
  clearUserPresets(): void {
    const userPresets = Array.from(this.presets.entries()).filter(
      ([_, preset]) => preset.category === 'user_created' || preset.category === 'favorites'
    );

    userPresets.forEach(([id, _]) => {
      this.presets.delete(id);
      this.favorites.delete(id);
    });

    this.recentlyUsed = this.recentlyUsed.filter(id => this.presets.has(id));
    this.savePresetsToStorage();
  }
}

// ===== SINGLETON EXPORT =====
export const presetManager = PresetManager.getInstance();