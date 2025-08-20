// 🍛 Menu Section Component
// Following meng_component_* naming convention
// Displays categorized menu items with prices and descriptions

import React from 'react';
import { MenuItem, LayoutConfig } from './meng_types_interfaces';
import { LayoutManager } from './meng_layout_LayoutConfig';
import { SectionWrapper } from './meng_layout_ResponsiveWrapper';

interface MenuProps {
  menuItems: MenuItem[];
  layoutConfig: LayoutConfig;
}

export const Menu: React.FC<MenuProps> = ({ menuItems, layoutConfig }) => {
  const layoutManager = new LayoutManager(layoutConfig);

  if (!layoutManager.shouldShowSection('showMenu')) {
    return null;
  }

  // Group menu items by category
  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  // Category display names in Indonesian
  const categoryNames = {
    main: 'Makanan Utama',
    beverages: 'Minuman',
    snacks: 'Cemilan',
    desserts: 'Penutup'
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderMenuItem = (item: MenuItem) => (
    <div key={item.id} className="warung-menu-item">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-lg">{item.name}</h4>
            
            {/* Popular badge */}
            {item.popular && (
              <span className="warung-popular">POPULER</span>
            )}
            
            {/* Spicy indicator */}
            {item.spicy && (
              <span className="warung-spicy text-xl" title="Pedas">🌶️</span>
            )}
            
            {/* Vegetarian indicator */}
            {item.vegetarian && (
              <span className="warung-vegetarian text-xl" title="Vegetarian">🥬</span>
            )}
          </div>
          
          {item.description && (
            <p className="text-gray-600 text-sm">{item.description}</p>
          )}
        </div>
        
        <div className="warung-price shrink-0">
          {formatPrice(item.price)}
        </div>
      </div>
    </div>
  );

  const renderCategory = (category: string, items: MenuItem[]) => (
    <div key={category} className="warung-menu-category">
      <h3 className="text-2xl font-bold mb-4 text-center">
        {categoryNames[category as keyof typeof categoryNames] || category}
      </h3>
      <div className="space-y-0">
        {items.map(renderMenuItem)}
      </div>
    </div>
  );

  return (
    <SectionWrapper 
      id="menu" 
      layoutManager={layoutManager}
      className="bg-gray-50"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">Menu Warung Meng</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Pilihan makanan dan minuman tradisional Indonesia dengan cita rasa autentik
        </p>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedMenu).map(([category, items]) =>
          renderCategory(category, items)
        )}
      </div>

      {/* Menu note */}
      <div className="mt-8 text-center text-sm text-gray-500 bg-white p-4 rounded-lg">
        <p>💡 Harga dapat berubah sewaktu-waktu. Untuk informasi terbaru, silakan hubungi kami.</p>
        <p className="mt-2">🌶️ Pedas | 🥬 Vegetarian | ⭐ Populer</p>
      </div>
    </SectionWrapper>
  );
};