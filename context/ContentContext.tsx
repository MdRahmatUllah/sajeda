import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HeroContent, HeroSection } from '../types';

// Default hero section that is always available
const DEFAULT_HERO_SECTION: HeroSection = {
  id: 'default-hero',
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

const STORAGE_KEY = 'shazeda_hero_sections';

interface ContentContextType {
  // Active hero content for the homepage
  heroContent: HeroContent;
  // All hero sections
  heroSections: HeroSection[];
  // Get the active hero section
  activeHeroSection: HeroSection | null;
  // CRUD operations
  addHeroSection: (section: Omit<HeroSection, 'id' | 'createdAt' | 'isActive'>) => void;
  updateHeroSection: (section: HeroSection) => void;
  deleteHeroSection: (id: string) => boolean;
  // Activation
  activateHeroSection: (id: string) => void;
  // Legacy support
  updateHeroContent: (content: HeroContent) => void;
  resetHeroContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [heroSections, setHeroSections] = useState<HeroSection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure at least one section is active
        if (!parsed.some((s: HeroSection) => s.isActive) && parsed.length > 0) {
          parsed[0].isActive = true;
        }
        return parsed;
      }
      return [DEFAULT_HERO_SECTION];
    } catch (e) {
      console.error("Failed to load hero sections from local storage", e);
      return [DEFAULT_HERO_SECTION];
    }
  });

  // Persist to localStorage whenever sections change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(heroSections));
  }, [heroSections]);

  // Get the active hero section
  const activeHeroSection = heroSections.find((s: HeroSection) => s.isActive) || heroSections[0] || null;

  // Get hero content (for backward compatibility with homepage)
  const heroContent: HeroContent = activeHeroSection ? {
    badge: activeHeroSection.badge,
    titleLine1: activeHeroSection.titleLine1,
    titleAccent: activeHeroSection.titleAccent,
    description: activeHeroSection.description,
    backgroundImageUrl: activeHeroSection.backgroundImageUrl,
    primaryCtaText: activeHeroSection.primaryCtaText,
    primaryCtaLink: activeHeroSection.primaryCtaLink,
    secondaryCtaText: activeHeroSection.secondaryCtaText,
    secondaryCtaLink: activeHeroSection.secondaryCtaLink,
  } : {
    badge: DEFAULT_HERO_SECTION.badge,
    titleLine1: DEFAULT_HERO_SECTION.titleLine1,
    titleAccent: DEFAULT_HERO_SECTION.titleAccent,
    description: DEFAULT_HERO_SECTION.description,
    backgroundImageUrl: DEFAULT_HERO_SECTION.backgroundImageUrl,
    primaryCtaText: DEFAULT_HERO_SECTION.primaryCtaText,
    primaryCtaLink: DEFAULT_HERO_SECTION.primaryCtaLink,
    secondaryCtaText: DEFAULT_HERO_SECTION.secondaryCtaText,
    secondaryCtaLink: DEFAULT_HERO_SECTION.secondaryCtaLink,
  };

  // Add a new hero section
  const addHeroSection = (section: Omit<HeroSection, 'id' | 'createdAt' | 'isActive'>) => {
    const newSection: HeroSection = {
      ...section,
      id: `hero-${Date.now()}`,
      createdAt: Date.now(),
      isActive: false,
    };
    setHeroSections(prev => [...prev, newSection]);
  };

  // Update an existing hero section
  const updateHeroSection = (section: HeroSection) => {
    setHeroSections(prev => prev.map(s => s.id === section.id ? section : s));
  };

  // Delete a hero section (cannot delete active section)
  const deleteHeroSection = (id: string): boolean => {
    const section = heroSections.find(s => s.id === id);
    if (!section || section.isActive) {
      return false; // Cannot delete active section
    }
    setHeroSections(prev => prev.filter(s => s.id !== id));
    return true;
  };

  // Activate a hero section (only one can be active at a time)
  const activateHeroSection = (id: string) => {
    setHeroSections(prev => prev.map(s => ({
      ...s,
      isActive: s.id === id
    })));
  };

  // Legacy: Update hero content (updates the active section)
  const updateHeroContent = (content: HeroContent) => {
    if (activeHeroSection) {
      updateHeroSection({
        ...activeHeroSection,
        ...content
      });
    }
  };

  // Reset to default hero section
  const resetHeroContent = () => {
    setHeroSections([{ ...DEFAULT_HERO_SECTION, createdAt: Date.now() }]);
  };

  return (
    <ContentContext.Provider value={{
      heroContent,
      heroSections,
      activeHeroSection,
      addHeroSection,
      updateHeroSection,
      deleteHeroSection,
      activateHeroSection,
      updateHeroContent,
      resetHeroContent
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within a ContentProvider');
  return context;
};