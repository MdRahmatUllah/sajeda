
import { Product } from './types';

export const CONTACT_PHONE = "+447448478361";
export const CONTACT_EMAIL = "hello@shazedacandles.com"; // Placeholder based on brand name
export const INSTAGRAM_HANDLE = "@shazedacandles";
export const INSTAGRAM_LINK = "https://www.instagram.com/shazedacandles?igsh=N255czZ6eWQxazRv&utm_source=qr";
export const TIKTOK_LINK = "https://www.tiktok.com/@shazedaa?_r=1&_t=ZN-91wIegJ3Fri";
export const VINTED_LINK = "https://www.vinted.co.uk/member/315210775-crazycandles";

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: "Midnight Rose",
    category: 'Floral',
    shortDescription: "A romantic blend of velvet rose and oud wood.",
    fullDescription: "Experience the allure of a secret garden at midnight. This hand-poured soy wax candle features deep notes of velvet rose, wrapped in smoky oud wood and a hint of clove. Perfect for romantic evenings or a luxurious bath.",
    price: 35,
    salePrice: 29.99,
    images: [
      "https://picsum.photos/id/106/800/800",
      "https://picsum.photos/id/111/800/800",
      "https://picsum.photos/id/112/800/800"
    ],
    scentNotes: ["Damask Rose", "Oud", "Clove", "Praline"],
    burnTime: "40-50 hours",
    size: "8 oz",
    inStock: true,
    isBestSeller: true
  },
  {
    id: '2',
    name: "Lavender Dreams",
    category: 'Floral',
    shortDescription: "Calming French lavender with a touch of vanilla.",
    fullDescription: "Drift away to the fields of Provence. Our Lavender Dreams candle uses pure essential oils to create a serene atmosphere. The sweetness of vanilla bean balances the herbal lavender for a truly relaxing experience.",
    price: 28,
    images: [
      "https://picsum.photos/id/203/800/800",
      "https://picsum.photos/id/204/800/800"
    ],
    scentNotes: ["French Lavender", "Vanilla Bean", "White Sage"],
    burnTime: "35-40 hours",
    size: "8 oz",
    inStock: true,
    isNew: true
  },
  {
    id: '3',
    name: "Golden Amber & Teak",
    category: 'Luxury',
    shortDescription: "Warm, woody, and sophisticated.",
    fullDescription: "A sophisticated masculine blend that appeals to everyone. Rich teakwood and earthy amber create a warm, cozy environment. Ideal for living rooms and reading nooks.",
    price: 42,
    images: [
      "https://picsum.photos/id/319/800/800",
      "https://picsum.photos/id/320/800/800"
    ],
    scentNotes: ["Amber", "Teakwood", "Leather", "Patchouli"],
    burnTime: "60 hours",
    size: "12 oz",
    inStock: true
  },
  {
    id: '4',
    name: "Holiday Hearth Gift Set",
    category: 'Gift Set',
    shortDescription: "A trio of our favorite winter scents.",
    fullDescription: "The perfect gift for the holiday season. This set includes three 4oz votives: Spiced Cider, Evergreen Forest, and Fireside Ember. Beautifully packaged in a reusable box.",
    price: 65,
    salePrice: 55,
    images: [
      "https://picsum.photos/id/401/800/800",
      "https://picsum.photos/id/402/800/800"
    ],
    scentNotes: ["Cinnamon", "Pine", "Smoke", "Apple"],
    burnTime: "15 hours each",
    size: "3 x 4 oz",
    inStock: true,
    isBestSeller: true
  },
  {
    id: '5',
    name: "Citrus Basil",
    category: 'Seasonal',
    shortDescription: "Fresh, zesty, and uplifting.",
    fullDescription: "Wake up your senses with this bright blend of lime, mandarin, and fresh basil leaves. A kitchen essential that eliminates odors and brings sunshine indoors.",
    price: 30,
    images: [
      "https://picsum.photos/id/500/800/800"
    ],
    scentNotes: ["Lime", "Mandarin", "Basil", "Thyme"],
    burnTime: "40 hours",
    size: "8 oz",
    inStock: false
  },
  {
    id: '6',
    name: "Vanilla Silk",
    category: 'Luxury',
    shortDescription: "Classic, creamy, and undeniably elegant.",
    fullDescription: "Not your average vanilla. We use Tahitian vanilla beans blended with a touch of buttercream and musk for a scent that is rich, not sugary. A timeless classic.",
    price: 38,
    images: [
      "https://picsum.photos/id/600/800/800",
      "https://picsum.photos/id/602/800/800"
    ],
    scentNotes: ["Tahitian Vanilla", "Buttercream", "White Musk"],
    burnTime: "50 hours",
    size: "10 oz",
    inStock: true
  }
];