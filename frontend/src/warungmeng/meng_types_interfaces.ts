// 🏗️ TypeScript interfaces for Warung Meng cafe website
// Following meng_types_* naming convention

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: 'main' | 'beverages' | 'snacks' | 'desserts';
  spicy?: boolean;
  vegetarian?: boolean;
  popular?: boolean;
}

export interface ContactInfo {
  name: string;
  address: string;
  phone: string;
  whatsapp?: string;
  instagram?: string;
  email?: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface CafeInfo {
  name: string;
  tagline: string;
  description: string;
  established?: string;
  specialty: string[];
}

export interface LayoutConfig {
  showHero: boolean;
  showMenu: boolean;
  showAbout: boolean;
  showContact: boolean;
  heroHeight: string;
  sectionSpacing: string;
  containerMaxWidth: string;
}

export interface CafeData {
  info: CafeInfo;
  menu: MenuItem[];
  contact: ContactInfo;
  hours: BusinessHours[];
  layout: LayoutConfig;
}