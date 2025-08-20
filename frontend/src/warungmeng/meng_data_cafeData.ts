// 📝 EASY EDIT FILE - All Warung Meng content here
// Edit this file to change menu, contact info, and business details
// Following meng_data_* naming convention

import { CafeData } from './meng_types_interfaces';

export const cafeData: CafeData = {
  // 🏪 Cafe Basic Information
  info: {
    name: "Warung Meng",
    tagline: "Cita Rasa Tradisional Indonesia",
    description: "Menyajikan hidangan tradisional Indonesia dengan cita rasa autentik dan harga terjangkau. Tempat yang nyaman untuk menikmati makanan rumahan.",
    established: "2020",
    specialty: ["Nasi Gudeg", "Rendang", "Gado-gado", "Kopi Tubruk"]
  },

  // 🍛 Menu Items (EDIT PRICES AND ITEMS HERE)
  menu: [
    // Main Dishes
    {
      id: "main1",
      name: "Nasi Gudeg Jogja",
      description: "Nasi putih dengan gudeg khas Jogja, ayam, telur, dan sambal",
      price: 25000,
      category: "main",
      popular: true
    },
    {
      id: "main2", 
      name: "Rendang Daging",
      description: "Rendang daging sapi empuk dengan bumbu rempah tradisional",
      price: 35000,
      category: "main",
      spicy: true,
      popular: true
    },
    {
      id: "main3",
      name: "Gado-gado Jakarta",
      description: "Sayuran segar dengan bumbu kacang khas Jakarta",
      price: 20000,
      category: "main",
      vegetarian: true
    },
    {
      id: "main4",
      name: "Soto Ayam",
      description: "Sup ayam kuning dengan mie, telur, dan kerupuk",
      price: 22000,
      category: "main"
    },
    {
      id: "main5",
      name: "Nasi Rawon",
      description: "Nasi dengan rawon daging sapi dan kerupuk",
      price: 28000,
      category: "main",
      spicy: true
    },

    // Beverages  
    {
      id: "drink1",
      name: "Es Teh Manis",
      description: "Teh manis dingin segar",
      price: 8000,
      category: "beverages"
    },
    {
      id: "drink2",
      name: "Kopi Tubruk",
      description: "Kopi hitam tradisional dengan gula aren",
      price: 12000,
      category: "beverages",
      popular: true
    },
    {
      id: "drink3",
      name: "Es Jeruk",
      description: "Jus jeruk segar dengan es batu",
      price: 10000,
      category: "beverages"
    },
    {
      id: "drink4",
      name: "Es Alpukat",
      description: "Jus alpukat dengan susu kental manis",
      price: 15000,
      category: "beverages"
    },
    {
      id: "drink5",
      name: "Wedang Jahe",
      description: "Minuman jahe hangat dengan gula aren",
      price: 10000,
      category: "beverages"
    },

    // Snacks
    {
      id: "snack1",
      name: "Kerupuk Udang",
      description: "Kerupuk udang renyah",
      price: 5000,
      category: "snacks"
    },
    {
      id: "snack2",
      name: "Rempeyek Kacang",
      description: "Rempeyek kacang tanah tradisional",
      price: 8000,
      category: "snacks"
    },

    // Desserts
    {
      id: "dessert1",
      name: "Es Cendol",
      description: "Cendol dengan santan dan gula merah",
      price: 12000,
      category: "desserts"
    },
    {
      id: "dessert2",
      name: "Klepon",
      description: "Kue klepon isi gula merah dengan kelapa parut",
      price: 10000,
      category: "desserts"
    }
  ],

  // 📞 Contact Information (EDIT YOUR REAL INFO HERE)
  contact: {
    name: "Warung Meng",
    address: "Jl. Malioboro No. 123, Yogyakarta 55271", 
    phone: "+62 274 123456",
    whatsapp: "+62 812 3456 7890",
    instagram: "@warungmeng",
    email: "info@warungmeng.com"
  },

  // 🕐 Business Hours (EDIT YOUR REAL HOURS HERE)
  hours: [
    { day: "Senin", open: "08:00", close: "21:00" },
    { day: "Selasa", open: "08:00", close: "21:00" },
    { day: "Rabu", open: "08:00", close: "21:00" },
    { day: "Kamis", open: "08:00", close: "21:00" },
    { day: "Jumat", open: "08:00", close: "21:00" },
    { day: "Sabtu", open: "08:00", close: "22:00" },
    { day: "Minggu", open: "08:00", close: "22:00" }
  ],

  // 🎛️ Layout Configuration
  layout: {
    showHero: true,
    showMenu: true,
    showAbout: true,
    showContact: true,
    heroHeight: "60vh",
    sectionSpacing: "py-16",
    containerMaxWidth: "max-w-6xl"
  }
};