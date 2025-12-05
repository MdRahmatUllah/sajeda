import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase, COLLECTIONS } from './lib/mongodb.js';
import { Product, HeroSection } from '../types.js';

// Simple auth check
function isAuthenticated(req: VercelRequest): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }
  
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');
  
  return (
    username === process.env.VITE_ADMIN_USERNAME &&
    password === process.env.VITE_ADMIN_PASSWORD
  );
}

// Sample products data
const SEED_PRODUCTS: Omit<Product, '_id'>[] = [
  {
    id: 'prod-1',
    name: "Midnight Rose",
    category: 'Floral',
    shortDescription: "A romantic blend of velvet rose and oud wood.",
    fullDescription: "Experience the allure of a secret garden at midnight. This hand-poured soy wax candle features deep notes of velvet rose, wrapped in smoky oud wood and a hint of clove. Perfect for romantic evenings or a luxurious bath.",
    price: 35,
    salePrice: 29.99,
    images: ["https://picsum.photos/id/106/800/800", "https://picsum.photos/id/111/800/800"],
    scentNotes: ["Damask Rose", "Oud", "Clove", "Praline"],
    burnTime: "40-50 hours",
    size: "8 oz",
    inStock: true,
    isBestSeller: true
  },
  {
    id: 'prod-2',
    name: "Lavender Dreams",
    category: 'Floral',
    shortDescription: "Calming French lavender with a touch of vanilla.",
    fullDescription: "Drift away to the fields of Provence. Our Lavender Dreams candle uses pure essential oils to create a serene atmosphere. The sweetness of vanilla bean balances the herbal lavender for a truly relaxing experience.",
    price: 28,
    images: ["https://picsum.photos/id/203/800/800", "https://picsum.photos/id/204/800/800"],
    scentNotes: ["French Lavender", "Vanilla Bean", "White Sage"],
    burnTime: "35-40 hours",
    size: "8 oz",
    inStock: true,
    isNew: true
  },
  {
    id: 'prod-3',
    name: "Golden Amber & Teak",
    category: 'Luxury',
    shortDescription: "Warm, woody, and sophisticated.",
    fullDescription: "A sophisticated masculine blend that appeals to everyone. Rich teakwood and earthy amber create a warm, cozy environment. Ideal for living rooms and reading nooks.",
    price: 42,
    images: ["https://picsum.photos/id/319/800/800", "https://picsum.photos/id/320/800/800"],
    scentNotes: ["Amber", "Teakwood", "Leather", "Patchouli"],
    burnTime: "60 hours",
    size: "12 oz",
    inStock: true
  },
  {
    id: 'prod-4',
    name: "Holiday Hearth Gift Set",
    category: 'Gift Set',
    shortDescription: "A trio of our favorite winter scents.",
    fullDescription: "The perfect gift for the holiday season. This set includes three 4oz votives: Spiced Cider, Evergreen Forest, and Fireside Ember. Beautifully packaged in a reusable box.",
    price: 65,
    salePrice: 55,
    images: ["https://picsum.photos/id/401/800/800", "https://picsum.photos/id/402/800/800"],
    scentNotes: ["Cinnamon", "Pine", "Smoke", "Apple"],
    burnTime: "15 hours each",
    size: "3 x 4 oz",
    inStock: true,
    isBestSeller: true
  },
  {
    id: 'prod-5',
    name: "Vanilla Silk",
    category: 'Luxury',
    shortDescription: "Classic, creamy, and undeniably elegant.",
    fullDescription: "Not your average vanilla. We use Tahitian vanilla beans blended with a touch of buttercream and musk for a scent that is rich, not sugary. A timeless classic.",
    price: 38,
    images: ["https://picsum.photos/id/600/800/800", "https://picsum.photos/id/602/800/800"],
    scentNotes: ["Tahitian Vanilla", "Buttercream", "White Musk"],
    burnTime: "50 hours",
    size: "10 oz",
    inStock: true
  }
];

// Default hero section
const SEED_HERO: Omit<HeroSection, '_id'> = {
  id: 'hero-default',
  name: 'Default Hero',
  isActive: true,
  createdAt: Date.now(),
  badge: "Handcrafted in small batches",
  titleLine1: "Light Up Your",
  titleAccent: "Moments",
  description: "Discover Shazeda's artisanal soy candles, poured with love and infused with premium fragrances to soothe your soul.",
  backgroundImageUrl: "https://www.hdwallpapers.in/download/christmas_decoration_balls_with_candles_hd_cute_christmas-HD.jpg",
  primaryCtaText: "Shop Collection",
  primaryCtaLink: "/shop",
  secondaryCtaText: "Our Story",
  secondaryCtaLink: "/about"
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAuthenticated(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const db = await getDatabase();
    const productsCol = db.collection(COLLECTIONS.PRODUCTS);
    const heroCol = db.collection(COLLECTIONS.HERO_SECTIONS);

    // Clear existing data
    await productsCol.deleteMany({});
    await heroCol.deleteMany({});

    // Insert seed data
    await productsCol.insertMany(SEED_PRODUCTS as any[]);
    await heroCol.insertOne(SEED_HERO as any);

    // Create index on isActive for hero sections
    await heroCol.createIndex({ isActive: 1 });

    return res.status(200).json({
      success: true,
      message: 'Database seeded successfully',
      products: SEED_PRODUCTS.length,
      heroSections: 1
    });
  } catch (error) {
    console.error('Seed API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

