// 📞 Contact Section Component  
// Following meng_component_* naming convention
// Displays contact information, location, and business hours

import React from 'react';
import { ContactInfo, BusinessHours, LayoutConfig } from './meng_types_interfaces';
import { LayoutManager } from './meng_layout_LayoutConfig';
import { SectionWrapper } from './meng_layout_ResponsiveWrapper';

interface ContactProps {
  contactInfo: ContactInfo;
  businessHours: BusinessHours[];
  layoutConfig: LayoutConfig;
}

export const Contact: React.FC<ContactProps> = ({ 
  contactInfo, 
  businessHours, 
  layoutConfig 
}) => {
  const layoutManager = new LayoutManager(layoutConfig);

  if (!layoutManager.shouldShowSection('showContact')) {
    return null;
  }

  const getCurrentDay = (): string => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date().getDay()];
  };

  const isCurrentDay = (day: string): boolean => {
    return day === getCurrentDay();
  };

  const formatPhoneForWhatsApp = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  return (
    <SectionWrapper 
      id="contact" 
      layoutManager={layoutManager}
      className="warung-contact"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Hubungi Kami</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Kunjungi warung kami atau hubungi untuk informasi lebih lanjut
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="warung-contact-card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>📍</span> Lokasi & Kontak
          </h3>
          
          <div className="space-y-3">
            <div>
              <p className="font-semibold">Alamat:</p>
              <p className="text-gray-600">{contactInfo.address}</p>
            </div>
            
            <div>
              <p className="font-semibold">Telepon:</p>
              <a 
                href={`tel:${contactInfo.phone}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {contactInfo.phone}
              </a>
            </div>
            
            {contactInfo.whatsapp && (
              <div>
                <p className="font-semibold">WhatsApp:</p>
                <a 
                  href={`https://wa.me/${formatPhoneForWhatsApp(contactInfo.whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="warung-btn inline-flex items-center gap-2"
                >
                  <span>💬</span> Chat WhatsApp
                </a>
              </div>
            )}
            
            {contactInfo.instagram && (
              <div>
                <p className="font-semibold">Instagram:</p>
                <a 
                  href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800"
                >
                  {contactInfo.instagram}
                </a>
              </div>
            )}
            
            {contactInfo.email && (
              <div>
                <p className="font-semibold">Email:</p>
                <a 
                  href={`mailto:${contactInfo.email}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {contactInfo.email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Business Hours */}
        <div className="warung-contact-card">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🕐</span> Jam Buka
          </h3>
          
          <div className="space-y-2">
            {businessHours.map((hours, index) => (
              <div 
                key={index}
                className={`flex justify-between items-center p-2 rounded ${
                  isCurrentDay(hours.day) ? 'bg-yellow-100 font-bold' : ''
                }`}
              >
                <span>{hours.day}</span>
                <span>
                  {hours.closed ? 'Tutup' : `${hours.open} - ${hours.close}`}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-700">
              💡 Hari ini: <strong>{getCurrentDay()}</strong>
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="warung-contact-card md:col-span-2 lg:col-span-1">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🚀</span> Aksi Cepat
          </h3>
          
          <div className="space-y-3">
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="warung-btn w-full text-center block"
            >
              📍 Buka di Google Maps
            </a>
            
            {contactInfo.whatsapp && (
              <a 
                href={`https://wa.me/${formatPhoneForWhatsApp(contactInfo.whatsapp)}?text=Halo, saya ingin tanya tentang menu di Warung Meng`}
                target="_blank"
                rel="noopener noreferrer"
                className="warung-btn w-full text-center block bg-green-600 hover:bg-green-700"
              >
                💬 Order via WhatsApp
              </a>
            )}
            
            <a 
              href={`tel:${contactInfo.phone}`}
              className="warung-btn w-full text-center block bg-blue-600 hover:bg-blue-700"
            >
              📞 Telepon Langsung
            </a>
          </div>
          
          <div className="mt-6 p-3 bg-green-50 rounded text-center">
            <p className="text-sm text-green-700">
              🎯 <strong>Delivery Available!</strong><br/>
              Pesan melalui WhatsApp untuk layanan antar
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};