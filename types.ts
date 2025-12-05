
export interface Product {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  salePrice?: number; // Optional discounted price
  category: 'Floral' | 'Luxury' | 'Gift Set' | 'Seasonal';
  images: string[];
  scentNotes: string[];
  burnTime: string;
  size: string;
  inStock: boolean;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
  };
  isBestSeller?: boolean;
  isNew?: boolean;
}

export interface ContactOption {
  type: 'whatsapp' | 'email' | 'phone';
  value: string;
  label: string;
}

export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleAccent: string;
  description: string;
  backgroundImageUrl: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

export interface HeroSection extends HeroContent {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: number;
}
