//==============================================
// LAUNCHER SETTINGS UI
//==============================================
// DETAILED DESCRIPTION:
// Comprehensive settings interface with tabbed organization, real-time preview,
// and advanced configuration options. Provides intuitive controls for all settings.
// TWEAK:
// Modify tab organization for different layout preferences.
// Adjust control types and validation for enhanced user experience.
// Change preview update frequency for performance tuning.

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RotateItemConfig } from '../../types/launcher.types';
import { UserSettings, settingsManager } from './launcher_settings_manager';
import { SmartValidator } from './launcher_settings_validator';
import { presetManager, AnyPreset, PresetCategory } from './launcher_settings_presets';
import { LauncherConfigManager } from '../launcher_core_config_manager';

// ===== SETTINGS UI INTERFACES =====

export interface SettingsUIProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: UserSettings) => void;
  onConfigChange?: (config: RotateItemConfig[]) => void;
}

interface TabDefinition {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
}

interface ControlGroup {
  title: string;
  description?: string;
  controls: ControlDefinition[];
}

interface ControlDefinition {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'slider' | 'input' | 'color' | 'custom';
  value: any;
  options?: any;
  validation?: (value: any) => string | null;
  onChange: (value: any) => void;
}

// ===== MAIN SETTINGS UI COMPONENT =====

export const LauncherSettingsUI: React.FC<SettingsUIProps> = ({
  isOpen,
  onClose,
  onSettingsChange,
  onConfigChange,
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [currentSettings, setCurrentSettings] = useState<UserSettings | null>(null);
  const [currentConfig, setCurrentConfig] = useState<RotateItemConfig[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // ===== INITIALIZATION =====

  useEffect(() => {
    if (isOpen) {
      const settings = settingsManager.getSettings();
      const config = LauncherConfigManager.loadConfig();
      
      setCurrentSettings(settings);
      setCurrentConfig(config);
      setHasUnsavedChanges(false);
      
      // Validate current settings
      const validation = SmartValidator.validateUserSettings(settings);
      setValidationResults(validation);
    }
  }, [isOpen]);

  // ===== SETTINGS HANDLERS =====

  const handleSettingsUpdate = useCallback((updates: Partial<UserSettings>) => {
    if (!currentSettings) return;

    const newSettings = { ...currentSettings, ...updates };
    setCurrentSettings(newSettings);
    setHasUnsavedChanges(true);

    // Validate in real-time
    const validation = SmartValidator.validateUserSettings(newSettings);
    setValidationResults(validation);

    // Live preview if enabled
    if (previewMode) {
      onSettingsChange?.(newSettings);
    }
  }, [currentSettings, previewMode, onSettingsChange]);

  const handleConfigUpdate = useCallback((newConfig: RotateItemConfig[]) => {
    setCurrentConfig(newConfig);
    setHasUnsavedChanges(true);

    if (previewMode) {
      onConfigChange?.(newConfig);
    }
  }, [previewMode, onConfigChange]);

  const handleSaveSettings = useCallback(async () => {
    if (!currentSettings) return;

    try {
      const result = await settingsManager.updateSettings(currentSettings);
      
      if (result.success) {
        LauncherConfigManager.saveConfig(currentConfig);
        setHasUnsavedChanges(false);
        
        onSettingsChange?.(currentSettings);
        onConfigChange?.(currentConfig);
        
        // Show success message
        console.log('Settings saved successfully');
      } else {
        console.error('Failed to save settings:', result.errors);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }, [currentSettings, currentConfig, onSettingsChange, onConfigChange]);

  const handleResetSettings = useCallback(() => {
    if (confirm('Reset all settings to defaults? This cannot be undone.')) {
      const result = settingsManager.resetToDefaults();
      
      if (result.success && result.data) {
        setCurrentSettings(result.data);
        setCurrentConfig(LauncherConfigManager.loadConfig());
        setHasUnsavedChanges(false);
        
        const validation = SmartValidator.validateUserSettings(result.data);
        setValidationResults(validation);
      }
    }
  }, []);

  // ===== TAB DEFINITIONS =====

  const tabs: TabDefinition[] = useMemo(() => [
    {
      id: 'general',
      label: 'General',
      icon: '⚙️',
      component: GeneralSettingsTab,
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: '🎨',
      component: AppearanceSettingsTab,
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: '⚡',
      component: PerformanceSettingsTab,
    },
    {
      id: 'clock',
      label: 'Clock',
      icon: '🕐',
      component: ClockSettingsTab,
    },
    {
      id: 'layers',
      label: 'Layers',
      icon: '📚',
      component: LayerSettingsTab,
    },
    {
      id: 'presets',
      label: 'Presets',
      icon: '💾',
      component: PresetSettingsTab,
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: '🔧',
      component: AdvancedSettingsTab,
    },
  ], []);

  // ===== RENDER HELPERS =====

  const renderTabNavigation = () => (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );

  const renderValidationPanel = () => {
    if (!validationResults || (validationResults.errors.length === 0 && validationResults.warnings.length === 0)) {
      return null;
    }

    return (
      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
        <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
          Validation Results
        </h4>
        
        {validationResults.errors.length > 0 && (
          <div className="mb-2">
            <h5 className="text-sm font-medium text-red-600 dark:text-red-400">Errors:</h5>
            <ul className="text-sm text-red-600 dark:text-red-400 ml-4">
              {validationResults.errors.map((error: any, index: number) => (
                <li key={index}>• {error.message}</li>
              ))}
            </ul>
          </div>
        )}
        
        {validationResults.warnings.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Warnings:</h5>
            <ul className="text-sm text-yellow-600 dark:text-yellow-400 ml-4">
              {validationResults.warnings.map((warning: any, index: number) => (
                <li key={index}>• {warning.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderActionBar = () => (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={previewMode}
            onChange={(e) => setPreviewMode(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">Live Preview</span>
        </label>
        
        {validationResults?.performance && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Performance: <span className={`font-medium ${
              validationResults.performance.level === 'excellent' ? 'text-green-600' :
              validationResults.performance.level === 'good' ? 'text-blue-600' :
              validationResults.performance.level === 'fair' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {validationResults.performance.level} ({validationResults.performance.score}/100)
            </span>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleResetSettings}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Reset to Defaults
        </button>
        
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSaveSettings}
          disabled={!hasUnsavedChanges}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            hasUnsavedChanges
              ? 'text-white bg-blue-600 hover:bg-blue-700'
              : 'text-gray-400 bg-gray-300 cursor-not-allowed'
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  // ===== MAIN RENDER =====

  if (!isOpen || !currentSettings) {
    return null;
  }

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Launcher Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        {renderTabNavigation()}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Validation Panel */}
          <div className="p-4">
            {renderValidationPanel()}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {ActiveTabComponent && (
              <ActiveTabComponent
                settings={currentSettings}
                config={currentConfig}
                onSettingsUpdate={handleSettingsUpdate}
                onConfigUpdate={handleConfigUpdate}
                validationResults={validationResults}
              />
            )}
          </div>
        </div>

        {/* Action Bar */}
        {renderActionBar()}
      </div>
    </div>
  );
};

// ===== TAB COMPONENTS (Placeholder) =====
// These would be implemented as separate components

const GeneralSettingsTab: React.FC<any> = ({ settings, onSettingsUpdate }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">General Settings</h3>
    <p className="text-gray-600 dark:text-gray-400">Basic application settings and preferences.</p>
    
    {/* Theme Selection */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Theme
      </label>
      <select
        value={settings.theme}
        onChange={(e) => onSettingsUpdate({ theme: e.target.value as any })}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="auto">Auto (System)</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>

    {/* Auto-save Toggle */}
    <div className="flex items-center">
      <input
        type="checkbox"
        id="autoSave"
        checked={settings.autoSave}
        onChange={(e) => onSettingsUpdate({ autoSave: e.target.checked })}
        className="mr-3"
      />
      <label htmlFor="autoSave" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Auto-save settings
      </label>
    </div>

    {/* Debug Info Toggle */}
    <div className="flex items-center">
      <input
        type="checkbox"
        id="showDebugInfo"
        checked={settings.showDebugInfo}
        onChange={(e) => onSettingsUpdate({ showDebugInfo: e.target.checked })}
        className="mr-3"
      />
      <label htmlFor="showDebugInfo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Show debug information
      </label>
    </div>
  </div>
);

const AppearanceSettingsTab: React.FC<any> = ({ settings, onSettingsUpdate }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h3>
    <p className="text-gray-600 dark:text-gray-400">Customize the visual appearance of the launcher.</p>
    
    {/* Animation Quality */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Animation Quality
      </label>
      <select
        value={settings.ui?.animationQuality || 'high'}
        onChange={(e) => onSettingsUpdate({ 
          ui: { ...settings.ui, animationQuality: e.target.value as any }
        })}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="ultra">Ultra</option>
      </select>
    </div>

    {/* Show Layer Numbers */}
    <div className="flex items-center">
      <input
        type="checkbox"
        id="showLayerNumbers"
        checked={settings.ui?.showLayerNumbers || false}
        onChange={(e) => onSettingsUpdate({ 
          ui: { ...settings.ui, showLayerNumbers: e.target.checked }
        })}
        className="mr-3"
      />
      <label htmlFor="showLayerNumbers" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Show layer numbers in debug mode
      </label>
    </div>
  </div>
);

const PerformanceSettingsTab: React.FC<any> = ({ settings, onSettingsUpdate }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Performance Settings</h3>
    <p className="text-gray-600 dark:text-gray-400">Optimize performance and resource usage.</p>
    
    {/* Performance Mode */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Performance Mode
      </label>
      <select
        value={settings.advanced?.performanceMode || 'balanced'}
        onChange={(e) => onSettingsUpdate({ 
          advanced: { ...settings.advanced, performanceMode: e.target.value as any }
        })}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="high">High Performance</option>
        <option value="balanced">Balanced</option>
        <option value="battery">Battery Saver</option>
      </select>
    </div>

    {/* Clock Update Rate */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Clock Update Rate: {settings.clockUpdateRate} FPS
      </label>
      <input
        type="range"
        min="15"
        max="120"
        value={settings.clockUpdateRate}
        onChange={(e) => onSettingsUpdate({ clockUpdateRate: parseInt(e.target.value) })}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>15 FPS</span>
        <span>60 FPS</span>
        <span>120 FPS</span>
      </div>
    </div>
  </div>
);

const ClockSettingsTab: React.FC<any> = ({ settings, onSettingsUpdate }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Clock Settings</h3>
    <p className="text-gray-600 dark:text-gray-400">Configure clock display and behavior.</p>
    
    {/* Time Format */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Time Format
      </label>
      <select
        value={settings.clock?.timeFormat || '24h'}
        onChange={(e) => onSettingsUpdate({ 
          clock: { ...settings.clock, timeFormat: e.target.value as any }
        })}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
      >
        <option value="12h">12 Hour</option>
        <option value="24h">24 Hour</option>
      </select>
    </div>

    {/* Show Second Hand */}
    <div className="flex items-center">
      <input
        type="checkbox"
        id="showSecondHand"
        checked={settings.clock?.showSecondHand !== false}
        onChange={(e) => onSettingsUpdate({ 
          clock: { ...settings.clock, showSecondHand: e.target.checked }
        })}
        className="mr-3"
      />
      <label htmlFor="showSecondHand" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Show second hand
      </label>
    </div>

    {/* Smooth Second Hand */}
    <div className="flex items-center">
      <input
        type="checkbox"
        id="smoothSecondHand"
        checked={settings.clock?.smoothSecondHand !== false}
        onChange={(e) => onSettingsUpdate({ 
          clock: { ...settings.clock, smoothSecondHand: e.target.checked }
        })}
        className="mr-3"
      />
      <label htmlFor="smoothSecondHand" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Smooth second hand animation
      </label>
    </div>
  </div>
);

const LayerSettingsTab: React.FC<any> = ({ config, onConfigUpdate }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Layer Configuration</h3>
    <p className="text-gray-600 dark:text-gray-400">Configure individual clock layers.</p>
    <p className="text-sm text-gray-500">Layer configuration interface would be implemented here.</p>
  </div>
);

const PresetSettingsTab: React.FC<any> = () => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preset Management</h3>
    <p className="text-gray-600 dark:text-gray-400">Save, load, and manage configuration presets.</p>
    <p className="text-sm text-gray-500">Preset management interface would be implemented here.</p>
  </div>
);

const AdvancedSettingsTab: React.FC<any> = ({ settings, onSettingsUpdate }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Advanced Settings</h3>
    <p className="text-gray-600 dark:text-gray-400">Advanced configuration options for power users.</p>
    
    {/* Developer Mode */}
    <div className="flex items-center">
      <input
        type="checkbox"
        id="developerMode"
        checked={settings.advanced?.developerMode || false}
        onChange={(e) => onSettingsUpdate({ 
          advanced: { ...settings.advanced, developerMode: e.target.checked }
        })}
        className="mr-3"
      />
      <label htmlFor="developerMode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Enable developer mode
      </label>
    </div>

    {/* Experimental Features */}
    <div className="flex items-center">
      <input
        type="checkbox"
        id="experimentalFeatures"
        checked={settings.advanced?.experimentalFeatures || false}
        onChange={(e) => onSettingsUpdate({ 
          advanced: { ...settings.advanced, experimentalFeatures: e.target.checked }
        })}
        className="mr-3"
      />
      <label htmlFor="experimentalFeatures" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Enable experimental features
      </label>
    </div>
  </div>
);

export default LauncherSettingsUI;