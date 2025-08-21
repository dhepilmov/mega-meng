// MAINTENANCE SCREEN — IMPORT SECTION
import React from "react";
import { DummyButton } from "../dummy_button";

// MAINTENANCE SCREEN — LOGIC SECTION
const MaintenanceScreen: React.FC = () => {
  return (
    // MAINTENANCE SCREEN — UI SECTION
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Maintenance Icon */}
        <div className="mb-8">
          <DummyButton
            to="/yuzha"
            label="Open Yuzha"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
          />
        </div>

        {/* Main Message */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          UNDER MAINTENANCE
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          We're working hard to improve your experience.<br />
          Please check back soon!
        </p>

        {/* Details */}
        <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
          <p className="text-gray-400 mb-4">
            Our team is performing scheduled maintenance to serve you better.
          </p>
          <div className="flex items-center justify-center text-yellow-400">
            <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium">Maintenance in Progress...</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-gray-500 text-sm">
          <p>Thank you for your patience.</p>
          <p className="mt-1">- Warung Meng Team</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
