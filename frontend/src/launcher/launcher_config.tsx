import React, { useState, useCallback, useEffect } from 'react';
import { rotateConfig, RotateItemConfig, RotationConfig, TimezoneConfig } from './rotate_config';

interface RotateConfigUIProps {
  onConfigChange?: (config: RotateItemConfig[]) => void;
  initialConfig?: RotateItemConfig[];
}

const LauncherConfig: React.FC<RotateConfigUIProps> = ({
  onConfigChange,
  initialConfig = rotateConfig
}) => {
  const [config, setConfig] = useState<RotateItemConfig[]>(initialConfig);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'rotation1' | 'rotation2' | 'clock'>('general');

  // Notify parent component of config changes
  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  const updateItemConfig = useCallback((itemCode: string, updates: Partial<RotateItemConfig>) => {
    setConfig(prevConfig => 
      prevConfig.map(item => 
        item.itemCode === itemCode 
          ? { ...item, ...updates }
          : item
      )
    );
  }, []);

  const updateRotationConfig = useCallback((
    itemCode: string, 
    rotationType: 'rotation1' | 'rotation2', 
    updates: Partial<RotationConfig>
  ) => {
    setConfig(prevConfig => 
      prevConfig.map(item => 
        item.itemCode === itemCode 
          ? { 
              ...item, 
              [rotationType]: { ...item[rotationType], ...updates }
            }
          : item
      )
    );
  }, []);

  const updateTimezoneConfig = useCallback((itemCode: string, updates: Partial<TimezoneConfig>) => {
    setConfig(prevConfig => 
      prevConfig.map(item => 
        item.itemCode === itemCode 
          ? { 
              ...item, 
              timezone: item.timezone ? { ...item.timezone, ...updates } : undefined
            }
          : item
      )
    );
  }, []);

  const selectedItemConfig = config.find(item => item.itemCode === selectedItem);
  const enabledItems = config.filter(item => item.itemDisplay === 'yes');
  const clockItems = config.filter(item => item.handType);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Rotation Configuration Manager
        </h1>
        <p className="text-gray-400">
          Configure rotation settings for launcher items, clock hands, and animations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Item List */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Items</h2>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{enabledItems.length}</div>
                <div className="text-sm text-gray-300">Enabled</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-400">{clockItems.length}</div>
                <div className="text-sm text-gray-300">Clock Items</div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                onClick={() => setSelectedItem(null)}
                className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded-full transition-colors"
              >
                All ({config.length})
              </button>
              <button 
                onClick={() => {
                  const firstEnabled = enabledItems[0];
                  setSelectedItem(firstEnabled?.itemCode || null);
                }}
                className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 rounded-full transition-colors"
              >
                Enabled ({enabledItems.length})
              </button>
              <button 
                onClick={() => {
                  const firstClock = clockItems[0];
                  setSelectedItem(firstClock?.itemCode || null);
                }}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
              >
                Clock ({clockItems.length})
              </button>
            </div>

            {/* Item List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {config.map((item) => (
                <div
                  key={item.itemCode}
                  onClick={() => setSelectedItem(item.itemCode)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedItem === item.itemCode
                      ? 'bg-blue-600 border-blue-400'
                      : 'bg-gray-700 hover:bg-gray-600 border-transparent'
                  } border`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        item.itemDisplay === 'yes' ? 'bg-green-400' : 'bg-gray-500'
                      }`} />
                      <span className="font-medium">{item.itemName}</span>
                      {item.handType && (
                        <span className="text-xs bg-blue-500 px-2 py-1 rounded-full">
                          {item.handType}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-400">L{item.itemLayer}</span>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {item.itemCode} • Size: {item.itemSize}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="lg:col-span-2">
          {selectedItemConfig ? (
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-blue-400">
                  {selectedItemConfig.itemName}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateItemConfig(selectedItem!, {
                      itemDisplay: selectedItemConfig.itemDisplay === 'yes' ? 'no' : 'yes'
                    })}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedItemConfig.itemDisplay === 'yes'
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-green-600 hover:bg-green-500 text-white'
                    }`}
                  >
                    {selectedItemConfig.itemDisplay === 'yes' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-700 rounded-lg p-1">
                {['general', 'rotation1', 'rotation2', 'clock'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors capitalize ${
                      activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Item Name</label>
                      <input
                        type="text"
                        value={selectedItemConfig.itemName}
                        onChange={(e) => updateItemConfig(selectedItem!, { itemName: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Item Path</label>
                      <input
                        type="text"
                        value={selectedItemConfig.itemPath}
                        onChange={(e) => updateItemConfig(selectedItem!, { itemPath: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Layer ({selectedItemConfig.itemLayer})</label>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={selectedItemConfig.itemLayer}
                        onChange={(e) => updateItemConfig(selectedItem!, { itemLayer: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Size ({selectedItemConfig.itemSize}%)</label>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={selectedItemConfig.itemSize}
                        onChange={(e) => updateItemConfig(selectedItem!, { itemSize: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Rotation 1 Settings */}
              {activeTab === 'rotation1' && (
                <RotationPanel
                  rotation={selectedItemConfig.rotation1}
                  onUpdate={(updates) => updateRotationConfig(selectedItem!, 'rotation1', updates)}
                  title="Primary Rotation"
                />
              )}

              {/* Rotation 2 Settings */}
              {activeTab === 'rotation2' && (
                <RotationPanel
                  rotation={selectedItemConfig.rotation2}
                  onUpdate={(updates) => updateRotationConfig(selectedItem!, 'rotation2', updates)}
                  title="Secondary Rotation"
                />
              )}

              {/* Clock Settings */}
              {activeTab === 'clock' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hand Type</label>
                      <select
                        value={selectedItemConfig.handType || 'null'}
                        onChange={(e) => updateItemConfig(selectedItem!, { 
                          handType: e.target.value === 'null' ? null : e.target.value as any 
                        })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="null">None</option>
                        <option value="hour">Hour Hand</option>
                        <option value="minute">Minute Hand</option>
                        <option value="second">Second Hand</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Hand Rotation</label>
                      <select
                        value={selectedItemConfig.handRotation || 'null'}
                        onChange={(e) => updateItemConfig(selectedItem!, { 
                          handRotation: e.target.value === 'null' ? null : e.target.value as any 
                        })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="null">None</option>
                        <option value="ROTATION1">Rotation 1</option>
                        <option value="ROTATION2">Rotation 2</option>
                      </select>
                    </div>
                  </div>

                  {/* Timezone Settings */}
                  {selectedItemConfig.handType === 'hour' && (
                    <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                      <h4 className="text-lg font-medium mb-4">Timezone Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Enabled</label>
                          <select
                            value={selectedItemConfig.timezone?.enabled || 'no'}
                            onChange={(e) => updateTimezoneConfig(selectedItem!, { 
                              enabled: e.target.value as 'yes' | 'no' 
                            })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">UTC Offset</label>
                          <input
                            type="number"
                            min="-12"
                            max="12"
                            step="0.5"
                            value={selectedItemConfig.timezone?.utcOffset || 0}
                            onChange={(e) => updateTimezoneConfig(selectedItem!, { 
                              utcOffset: parseFloat(e.target.value) 
                            })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">24 Hour Format</label>
                          <select
                            value={selectedItemConfig.timezone?.use24Hour || 'yes'}
                            onChange={(e) => updateTimezoneConfig(selectedItem!, { 
                              use24Hour: e.target.value as 'yes' | 'no' 
                            })}
                            className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="yes">Yes (1 rotation/day)</option>
                            <option value="no">No (2 rotations/day)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-400 mb-2">
                Select an Item to Configure
              </h2>
              <p className="text-gray-500">
                Choose an item from the list on the left to view and edit its rotation settings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Rotation Panel Component
interface RotationPanelProps {
  rotation: RotationConfig;
  onUpdate: (updates: Partial<RotationConfig>) => void;
  title: string;
}

const RotationPanel: React.FC<RotationPanelProps> = ({ rotation, onUpdate, title }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-blue-400">{title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Enabled</label>
          <select
            value={rotation.enabled || 'no'}
            onChange={(e) => onUpdate({ enabled: e.target.value as 'yes' | 'no' })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Rotation Way</label>
          <select
            value={rotation.rotationWay || 'no'}
            onChange={(e) => onUpdate({ rotationWay: e.target.value as '+' | '-' | 'no' | '' })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="+">Clockwise (+)</option>
            <option value="-">Counter-Clockwise (-)</option>
            <option value="no">No Rotation</option>
            <option value="">Default</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Rotation Speed ({rotation.rotationSpeed}s)
          </label>
          <input
            type="range"
            min="1"
            max="300"
            value={rotation.rotationSpeed}
            onChange={(e) => onUpdate({ rotationSpeed: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Tilt Position ({rotation.itemTiltPosition}°)
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation.itemTiltPosition}
            onChange={(e) => onUpdate({ itemTiltPosition: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Axis X ({rotation.itemAxisX}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={rotation.itemAxisX}
            onChange={(e) => onUpdate({ itemAxisX: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Axis Y ({rotation.itemAxisY}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={rotation.itemAxisY}
            onChange={(e) => onUpdate({ itemAxisY: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Position X ({rotation.itemPositionX > 0 ? '+' : ''}{rotation.itemPositionX})
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            value={rotation.itemPositionX}
            onChange={(e) => onUpdate({ itemPositionX: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Position Y ({rotation.itemPositionY > 0 ? '+' : ''}{rotation.itemPositionY})
          </label>
          <input
            type="range"
            min="-50"
            max="50"
            value={rotation.itemPositionY}
            onChange={(e) => onUpdate({ itemPositionY: parseInt(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default LauncherConfig;