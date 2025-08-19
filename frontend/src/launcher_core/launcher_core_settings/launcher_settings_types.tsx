//==============================================
// SETTINGS SYSTEM TYPES
//==============================================
// DETAILED DESCRIPTION:
// Comprehensive type definitions for the settings system including
// user preferences, validation results, preset management, and UI components.
// TWEAK:
// Add new setting categories to extend configuration capabilities.
// Modify validation severity levels for different error handling approaches.
// Change preset categories for different organization schemes.

import { RotateItemConfig, LauncherSettings } from '../../types/launcher.types';

// ===== EXTENDED USER SETTINGS =====

export interface ExtendedUserSettings extends LauncherSettings {
  // User identification
  userId?: string;
  userName?: string;
  userEmail?: string;
  
  // Timestamps
  lastModified: number;
  lastLogin?: number;
  createdAt?: number;
  
  // Version tracking
  version: string;
  settingsVersion: string;
  
  // Advanced configuration
  advanced: AdvancedSettings;
  
  // UI preferences
  ui: UIPreferences;
  
  // Clock configuration
  clock: ClockPreferences;
  
  // Performance settings
  performance: PerformanceSettings;
  
  // Accessibility options
  accessibility: AccessibilitySettings;
  
  // Privacy settings
  privacy: PrivacySettings;
}

// ===== SETTINGS CATEGORIES =====

export interface AdvancedSettings {
  developerMode: boolean;
  performanceMode: 'high' | 'balanced' | 'battery' | 'custom';
  debugLevel: 'none' | 'basic' | 'detailed' | 'verbose';
  experimentalFeatures: boolean;
  
  // Developer features
  enableHotReload: boolean;
  showInternalMetrics: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug' | 'trace';
  
  // Custom performance settings (when performanceMode is 'custom')
  customPerformance?: {
    targetFPS: number;
    memoryLimit: number;
    cpuThrottling: boolean;
    backgroundProcessing: boolean;
  };
}

export interface UIPreferences {
  // Visual settings
  showLayerNumbers: boolean;
  showPerformanceMetrics: boolean;
  showFPSCounter: boolean;
  enableTooltips: boolean;
  tooltipDelay: number;
  
  // Animation settings
  animationQuality: 'low' | 'medium' | 'high' | 'ultra';
  animationSpeed: number; // 0.5x to 2x multiplier
  enableTransitions: boolean;
  transitionDuration: number;
  
  // Color and theming
  colorScheme: 'auto' | 'light' | 'dark' | 'custom';
  accentColor: string;
  customTheme?: CustomTheme;
  
  // Layout preferences
  compactMode: boolean;
  sidebarPosition: 'left' | 'right' | 'hidden';
  toolbarPosition: 'top' | 'bottom' | 'floating';
  
  // Language and localization
  language: string;
  region: string;
  dateFormat: string;
  numberFormat: string;
}

export interface ClockPreferences {
  // Default settings
  defaultTimezone: string;
  timezoneDisplay: 'local' | 'utc' | 'custom' | 'multiple';
  customTimezones?: TimezoneSettings[];
  
  // Hand configuration
  showSecondHand: boolean;
  smoothSecondHand: boolean;
  handStyles: {
    hour: HandStyle;
    minute: HandStyle;
    second: HandStyle;
  };
  
  // Time format
  timeFormat: '12h' | '24h' | 'mixed';
  showAMPM: boolean;
  showTimezone: boolean;
  showDate: boolean;
  
  // Visual enhancements
  glowEffect: boolean;
  shadowEffect: boolean;
  backgroundBlur: boolean;
  particleEffects: boolean;
}

export interface PerformanceSettings {
  // Frame rate management
  targetFPS: number;
  adaptiveFPS: boolean;
  batteryOptimization: boolean;
  
  // Memory management
  memoryLimit: number;
  garbageCollectionMode: 'auto' | 'aggressive' | 'conservative';
  textureCompression: boolean;
  
  // Rendering options
  hardwareAcceleration: boolean;
  webGLEnabled: boolean;
  antiAliasing: boolean;
  mipmapping: boolean;
  
  // Background processing
  backgroundUpdates: boolean;
  pauseWhenHidden: boolean;
  reduceMotion: boolean;
}

export interface AccessibilitySettings {
  // Visual accessibility
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderSupport: boolean;
  
  // Motor accessibility
  largerClickTargets: boolean;
  stickyKeys: boolean;
  mouseKeys: boolean;
  
  // Cognitive accessibility
  simplifiedInterface: boolean;
  confirmationDialogs: boolean;
  timeoutWarnings: boolean;
  
  // Audio accessibility
  audioFeedback: boolean;
  soundVolume: number;
  muteOnFocus: boolean;
}

export interface PrivacySettings {
  // Data collection
  analyticsEnabled: boolean;
  errorReporting: boolean;
  usageStatistics: boolean;
  
  // Storage preferences
  localStorageEnabled: boolean;
  cloudSyncEnabled: boolean;
  encryptLocalData: boolean;
  
  // Sharing preferences
  allowPresetSharing: boolean;
  anonymizeSharedData: boolean;
}

// ===== HELPER TYPES =====

export interface CustomTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export interface TimezoneSettings {
  name: string;
  offset: number;
  abbreviation: string;
  location: string;
  enabled: boolean;
}

export interface HandStyle {
  color: string;
  width: number;
  length: number;
  style: 'solid' | 'outline' | 'gradient' | 'textured';
  cap: 'round' | 'square' | 'pointed';
  shadow: boolean;
  glow: boolean;
}

// ===== VALIDATION TYPES =====

export interface SettingsValidationError {
  field: string;
  path: string[];
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  code: string;
  
  // Auto-fix information
  canAutoFix: boolean;
  autoFixDescription?: string;
  
  // Context
  currentValue: any;
  suggestedValue?: any;
  validRange?: [any, any];
  validOptions?: any[];
}

export interface SettingsValidationResult {
  isValid: boolean;
  hasAutoFixes: boolean;
  
  errors: SettingsValidationError[];
  warnings: SettingsValidationError[];
  suggestions: SettingsValidationError[];
  
  // Performance impact assessment
  performanceImpact: {
    level: 'minimal' | 'low' | 'moderate' | 'high' | 'extreme';
    score: number; // 0-100
    factors: {
      frameRate: number;
      memoryUsage: number;
      batteryUsage: number;
      networkUsage: number;
    };
    recommendations: string[];
  };
  
  // Compatibility assessment
  compatibility: {
    browserSupport: 'full' | 'partial' | 'limited' | 'none';
    deviceSupport: 'all' | 'modern' | 'high-end' | 'none';
    featureRequirements: string[];
    fallbacksAvailable: boolean;
  };
}

// ===== PRESET SYSTEM TYPES =====

export interface PresetMetadata {
  id: string;
  name: string;
  description: string;
  
  // Categorization
  category: PresetCategory;
  subcategory?: string;
  tags: string[];
  
  // Authorship
  author: string;
  authorId?: string;
  collaborative?: boolean;
  contributors?: string[];
  
  // Versioning
  version: string;
  compatibility: string[];
  minVersion: string;
  maxVersion?: string;
  
  // Timestamps
  created: number;
  updated: number;
  lastTested?: number;
  
  // Usage statistics
  usageCount: number;
  rating?: number;
  downloads?: number;
  likes?: number;
  
  // Status
  status: 'draft' | 'published' | 'archived' | 'deprecated';
  isPublic: boolean;
  isFeatured: boolean;
  
  // Technical details
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedPerformance: 'excellent' | 'good' | 'fair' | 'poor';
  requiredFeatures: string[];
  
  // Media
  thumbnail?: string;
  screenshots?: string[];
  video?: string;
}

export type PresetCategory = 
  | 'clock_faces'
  | 'hands'
  | 'decorations' 
  | 'animations'
  | 'themes'
  | 'performance'
  | 'accessibility'
  | 'experimental'
  | 'seasonal'
  | 'branded'
  | 'artistic'
  | 'minimalist'
  | 'vintage'
  | 'futuristic'
  | 'gaming'
  | 'professional'
  | 'fun'
  | 'educational'
  | 'user_created'
  | 'community'
  | 'favorites'
  | 'recent';

export interface PresetData {
  metadata: PresetMetadata;
  
  // Content based on preset type
  settings?: Partial<ExtendedUserSettings>;
  layers?: RotateItemConfig[];
  
  // Additional data
  customAssets?: PresetAsset[];
  dependencies?: PresetDependency[];
  
  // Validation results
  validationResults?: SettingsValidationResult;
  lastValidated?: number;
}

export interface PresetAsset {
  id: string;
  type: 'image' | 'font' | 'animation' | 'sound';
  name: string;
  url: string;
  localPath?: string;
  size: number;
  hash: string;
  required: boolean;
}

export interface PresetDependency {
  id: string;
  name: string;
  version: string;
  optional: boolean;
  fallback?: string;
}

// ===== SETTINGS UI TYPES =====

export interface SettingsUIState {
  activeTab: string;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  isSaving: boolean;
  
  // Validation state
  validationResults?: SettingsValidationResult;
  showValidation: boolean;
  
  // Preview state
  previewMode: boolean;
  previewDelay: number;
  
  // Search and filtering
  searchQuery: string;
  activeFilters: Record<string, any>;
  
  // Modal states
  showImportDialog: boolean;
  showExportDialog: boolean;
  showResetDialog: boolean;
}

export interface SettingsControlDefinition {
  id: string;
  type: SettingsControlType;
  label: string;
  description?: string;
  tooltip?: string;
  
  // Value management
  path: string; // Dot notation path to setting
  defaultValue: any;
  currentValue: any;
  
  // Validation
  required: boolean;
  validation?: SettingsValidationRule[];
  
  // UI configuration
  options?: SettingsControlOptions;
  disabled?: boolean;
  hidden?: boolean;
  
  // Dependencies
  dependsOn?: string[]; // Other control IDs
  affects?: string[]; // Other control IDs
  
  // Change handling
  onChange?: (value: any, control: SettingsControlDefinition) => void;
  onValidate?: (value: any) => SettingsValidationError | null;
}

export type SettingsControlType = 
  | 'toggle'
  | 'select'
  | 'multiselect'
  | 'slider'
  | 'input'
  | 'textarea'
  | 'number'
  | 'color'
  | 'file'
  | 'range'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'keycode'
  | 'custom';

export interface SettingsControlOptions {
  // Select/MultiSelect options
  options?: Array<{ value: any; label: string; description?: string; icon?: string }>;
  
  // Slider/Range options
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  
  // Input options
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
  
  // File options
  accept?: string;
  multiple?: boolean;
  
  // Custom options
  customComponent?: React.ComponentType<any>;
  customProps?: Record<string, any>;
}

export interface SettingsValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom' | 'range';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// ===== SETTINGS HOOKS =====

export interface UseSettingsReturn {
  // Current state
  settings: ExtendedUserSettings;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  
  // Validation
  validationResults?: SettingsValidationResult;
  isValid: boolean;
  
  // Actions
  updateSettings: (updates: Partial<ExtendedUserSettings>) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  saveSettings: () => Promise<boolean>;
  
  // Validation
  validateSettings: (settings?: Partial<ExtendedUserSettings>) => SettingsValidationResult;
  
  // Change tracking
  addChangeListener: (callback: (settings: ExtendedUserSettings) => void) => () => void;
  
  // Import/Export
  exportSettings: () => string;
  importSettings: (data: string) => Promise<boolean>;
}

export interface UsePresetManagerReturn {
  // Preset data
  presets: PresetData[];
  favorites: PresetData[];
  recentlyUsed: PresetData[];
  
  // Loading state
  isLoading: boolean;
  
  // Actions
  savePreset: (preset: Omit<PresetData, 'metadata'> & { name: string; description: string }) => Promise<string>;
  loadPreset: (id: string) => Promise<boolean>;
  deletePreset: (id: string) => Promise<boolean>;
  
  // Favorites
  addToFavorites: (id: string) => Promise<boolean>;
  removeFromFavorites: (id: string) => Promise<boolean>;
  isFavorite: (id: string) => boolean;
  
  // Search and filter
  searchPresets: (query: string, filters?: Record<string, any>) => PresetData[];
  
  // Categories
  getCategories: () => Array<{ category: PresetCategory; count: number }>;
  
  // Import/Export
  exportPreset: (id: string) => string;
  importPreset: (data: string) => Promise<string>;
}

// ===== DEFAULT VALUES =====

export const DEFAULT_EXTENDED_USER_SETTINGS: ExtendedUserSettings = {
  // Base settings
  theme: 'auto',
  showDebugInfo: false,
  enableAnimations: true,
  clockUpdateRate: 60,
  autoSave: true,
  
  // Metadata
  lastModified: Date.now(),
  version: '2.0.0',
  settingsVersion: '2.0.0',
  
  // Advanced settings
  advanced: {
    developerMode: false,
    performanceMode: 'balanced',
    debugLevel: 'none',
    experimentalFeatures: false,
    enableHotReload: false,
    showInternalMetrics: false,
    logLevel: 'warn',
  },
  
  // UI preferences
  ui: {
    showLayerNumbers: false,
    showPerformanceMetrics: false,
    showFPSCounter: false,
    enableTooltips: true,
    tooltipDelay: 500,
    animationQuality: 'high',
    animationSpeed: 1,
    enableTransitions: true,
    transitionDuration: 300,
    colorScheme: 'auto',
    accentColor: '#3b82f6',
    compactMode: false,
    sidebarPosition: 'right',
    toolbarPosition: 'top',
    language: 'en',
    region: 'US',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: 'en-US',
  },
  
  // Clock preferences
  clock: {
    defaultTimezone: 'auto',
    timezoneDisplay: 'local',
    showSecondHand: true,
    smoothSecondHand: true,
    handStyles: {
      hour: { color: '#000000', width: 6, length: 50, style: 'solid', cap: 'round', shadow: true, glow: false },
      minute: { color: '#000000', width: 4, length: 70, style: 'solid', cap: 'round', shadow: true, glow: false },
      second: { color: '#ff0000', width: 2, length: 80, style: 'solid', cap: 'pointed', shadow: false, glow: false },
    },
    timeFormat: '24h',
    showAMPM: true,
    showTimezone: false,
    showDate: true,
    glowEffect: false,
    shadowEffect: true,
    backgroundBlur: false,
    particleEffects: false,
  },
  
  // Performance settings
  performance: {
    targetFPS: 60,
    adaptiveFPS: true,
    batteryOptimization: false,
    memoryLimit: 128,
    garbageCollectionMode: 'auto',
    textureCompression: true,
    hardwareAcceleration: true,
    webGLEnabled: true,
    antiAliasing: true,
    mipmapping: true,
    backgroundUpdates: true,
    pauseWhenHidden: true,
    reduceMotion: false,
  },
  
  // Accessibility settings
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReaderSupport: false,
    largerClickTargets: false,
    stickyKeys: false,
    mouseKeys: false,
    simplifiedInterface: false,
    confirmationDialogs: true,
    timeoutWarnings: true,
    audioFeedback: false,
    soundVolume: 50,
    muteOnFocus: false,
  },
  
  // Privacy settings
  privacy: {
    analyticsEnabled: false,
    errorReporting: true,
    usageStatistics: false,
    localStorageEnabled: true,
    cloudSyncEnabled: false,
    encryptLocalData: false,
    allowPresetSharing: true,
    anonymizeSharedData: true,
  },
};