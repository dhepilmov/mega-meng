//==============================================
// SETTINGS SYSTEM EXPORTS
//==============================================
// DETAILED DESCRIPTION:
// Central export point for all settings system modules including
// manager, validator, presets, UI, and types.

// Core settings management
export { LauncherSettingsManager, settingsManager } from './launcher_settings_manager';
export type { UserSettings, SettingsBackup, SettingsOperationResult } from './launcher_settings_manager';

// Smart validation system
export { SmartValidator } from './launcher_settings_validator';
export type { 
  ValidationResult, 
  ValidationError, 
  ValidationWarning, 
  PerformanceAssessment 
} from './launcher_settings_validator';

// Preset management
export { PresetManager, presetManager } from './launcher_settings_presets';
export type { 
  PresetInfo, 
  LayerPreset, 
  SystemPreset, 
  SettingsPreset, 
  AnyPreset,
  PresetCategory,
  PresetOperationResult,
  PresetSearchOptions
} from './launcher_settings_presets';

// Settings UI
export { LauncherSettingsUI } from './launcher_settings_ui';
export type { SettingsUIProps } from './launcher_settings_ui';

// Extended types
export type {
  ExtendedUserSettings,
  AdvancedSettings,
  UIPreferences,
  ClockPreferences,
  PerformanceSettings,
  AccessibilitySettings,
  PrivacySettings,
  CustomTheme,
  TimezoneSettings,
  HandStyle,
  SettingsValidationError,
  SettingsValidationResult,
  PresetMetadata,
  PresetData,
  PresetAsset,
  PresetDependency,
  SettingsUIState,
  SettingsControlDefinition,
  SettingsControlType,
  SettingsControlOptions,
  SettingsValidationRule,
  UseSettingsReturn,
  UsePresetManagerReturn,
  DEFAULT_EXTENDED_USER_SETTINGS
} from './launcher_settings_types';