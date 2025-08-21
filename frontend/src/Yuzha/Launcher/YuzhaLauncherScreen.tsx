import React from 'react';

const YuzhaLauncherScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center text-6xl text-blue-600 shadow-2xl mb-8">
            🚀
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Yuzha Launcher
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-200 mb-8 leading-relaxed">
            Welcome to the Yuzha Application Launcher
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm border border-white border-opacity-20">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Fast Launch</h3>
            <p className="text-blue-200">Quick application startup and navigation</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm border border-white border-opacity-20">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Smart Control</h3>
            <p className="text-blue-200">Intelligent application management</p>
          </div>
          
          <div className="bg-white bg-opacity-10 rounded-lg p-6 backdrop-blur-sm border border-white border-opacity-20">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold text-white mb-2">Easy Setup</h3>
            <p className="text-blue-200">Simple configuration and customization</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center">
          <button className="w-full md:w-auto bg-white text-blue-900 font-semibold py-4 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg">
            Launch Application
          </button>
          
          <button className="w-full md:w-auto bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-900 transition-colors duration-200">
            View Settings
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-12">
          <div className="inline-flex items-center bg-green-500 bg-opacity-20 rounded-full px-6 py-2 border border-green-400 border-opacity-30">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-green-300 font-medium">System Ready</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-blue-300 text-sm">
          <p>Yuzha Launcher v1.0 • Ready to Launch</p>
        </div>
      </div>
    </div>
  );
};

export default YuzhaLauncherScreen;