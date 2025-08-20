// ℹ️ About Section Component
// Following meng_component_* naming convention  
// Displays additional information about the cafe

import React from 'react';
import { CafeInfo, LayoutConfig } from './meng_types_interfaces';
import { LayoutManager } from './meng_layout_LayoutConfig';
import { SectionWrapper } from './meng_layout_ResponsiveWrapper';

interface AboutProps {
  cafeInfo: CafeInfo;
  layoutConfig: LayoutConfig;
}

export const About: React.FC<AboutProps> = ({ cafeInfo, layoutConfig }) => {
  const layoutManager = new LayoutManager(layoutConfig);

  if (!layoutManager.shouldShowSection('showAbout')) {
    return null;
  }

  return (
    <SectionWrapper 
      id="about" 
      layoutManager={layoutManager}
      className="bg-white"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Tentang {cafeInfo.name}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Cafe Story */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Cerita Kami</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {cafeInfo.description}
          </p>
          
          {cafeInfo.established && (
            <p className="text-gray-600 mb-6 leading-relaxed">
              Didirikan sejak tahun {cafeInfo.established}, kami berkomitmen untuk menyajikan 
              hidangan tradisional Indonesia yang autentik dengan bahan-bahan berkualitas 
              dan resep turun temurun.
            </p>
          )}

          <div className="bg-orange-50 p-6 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-3">🍽️ Mengapa Memilih Kami?</h4>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span>✅</span> Cita rasa autentik tradisional Indonesia
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span> Bahan-bahan segar dan berkualitas
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span> Harga terjangkau untuk semua kalangan
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span> Suasana hangat dan ramah keluarga
              </li>
              <li className="flex items-start gap-2">
                <span>✅</span> Pelayanan cepat dan memuaskan
              </li>
            </ul>
          </div>
        </div>

        {/* Specialties */}
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Menu Andalan Kami</h3>
          
          <div className="grid gap-4">
            {cafeInfo.specialty.map((item, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-100 to-yellow-100 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h4 className="font-bold text-gray-800">{item}</h4>
                    <p className="text-sm text-gray-600">Menu favorit pelanggan</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-brown-50 p-6 rounded-lg text-center">
            <h4 className="font-bold text-gray-800 mb-3">🎯 Misi Kami</h4>
            <p className="text-gray-600 italic">
              "Melestarikan cita rasa tradisional Indonesia dan menghadirkan kehangatan 
              rumah dalam setiap hidangan yang kami sajikan."
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Kunjungi Warung Meng Hari Ini!</h3>
          <p className="text-lg mb-6 opacity-90">
            Rasakan sendiri kelezatan makanan tradisional Indonesia yang autentik
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#contact" 
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
              📍 Lihat Lokasi
            </a>
            <a 
              href="#menu" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-orange-600 transition-colors"
            >
              🍛 Lihat Menu
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};