// 🍛 Warung Meng Main Application
// Main entry point for the cafe website
// Lightweight and optimized for old devices

import React from 'react';
import { Hero } from './meng_component_Hero';
import { Menu } from './meng_component_Menu';
import { About } from './meng_component_About';
import { Contact } from './meng_component_Contact';
import { cafeData } from './meng_data_cafeData';
import './meng_styles_main.css';

const WarungMengApp: React.FC = () => {
  return (
    <div className="warung-meng-app min-h-screen">
      {/* Hero Section */}
      <Hero 
        cafeInfo={cafeData.info}
        layoutConfig={cafeData.layout}
      />

      {/* Menu Section */}
      <Menu 
        menuItems={cafeData.menu}
        layoutConfig={cafeData.layout}
      />

      {/* About Section */}
      <About 
        cafeInfo={cafeData.info}
        layoutConfig={cafeData.layout}
      />

      {/* Contact Section */}
      <Contact 
        contactInfo={cafeData.contact}
        businessHours={cafeData.hours}
        layoutConfig={cafeData.layout}
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="mb-2">
            © 2024 {cafeData.info.name}. Semua hak cipta dilindungi.
          </p>
          <p className="text-gray-400 text-sm">
            {cafeData.info.tagline} • {cafeData.contact.address}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Dibuat dengan ❤️ untuk melestarikan cita rasa tradisional Indonesia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WarungMengApp;