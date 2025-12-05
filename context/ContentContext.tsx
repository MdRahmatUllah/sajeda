import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { HeroContent, HeroSection } from '../types';
import { heroSectionsApi, seedApi } from '../utils/api';

// Default hero section (fallback)
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

interface ContentContextType {
  heroContent: HeroContent;
  heroSections: HeroSection[];
  activeHeroSection: HeroSection | null;
  isLoading: boolean;
  error: string | null;
  addHeroSection: (section: Omit<HeroSection, 'id' | 'createdAt' | 'isActive'>) => Promise<void>;
  updateHeroSection: (section: HeroSection) => Promise<void>;
  deleteHeroSection: (id: string) => Promise<boolean>;
  activateHeroSection: (id: string) => Promise<void>;
  updateHeroContent: (content: HeroContent) => Promise<void>;
  resetHeroContent: () => Promise<void>;
  refreshHeroSections: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [heroSections, setHeroSections] = useState<HeroSection[]>([DEFAULT_HERO_SECTION]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch hero sections from API
  const fetchHeroSections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await heroSectionsApi.getAll();
      if (data.length > 0) {
        setHeroSections(data);
      } else {
        setHeroSections([DEFAULT_HERO_SECTION]);
      }
    } catch (err) {
      console.error('Failed to fetch hero sections:', err);
      setError(err instanceof Error ? err.message : 'Failed to load hero sections');
      setHeroSections([DEFAULT_HERO_SECTION]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHeroSections();
  }, [fetchHeroSections]);

  const activeHeroSection = heroSections.find((s: HeroSection) => s.isActive) || heroSections[0] || null;

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

  const addHeroSection = async (section: Omit<HeroSection, 'id' | 'createdAt' | 'isActive'>) => {
    try {
      const newSection = await heroSectionsApi.create({
        ...section,
        createdAt: Date.now(),
        isActive: false
      });
      setHeroSections((prev: HeroSection[]) => [...prev, newSection]);
    } catch (err) {
      console.error('Failed to add hero section:', err);
      throw err;
    }
  };

  const updateHeroSection = async (section: HeroSection) => {
    try {
      const updated = await heroSectionsApi.update(section);
      setHeroSections((prev: HeroSection[]) => prev.map((s: HeroSection) => s.id === updated.id ? updated : s));
    } catch (err) {
      console.error('Failed to update hero section:', err);
      throw err;
    }
  };

  const deleteHeroSection = async (id: string): Promise<boolean> => {
    const section = heroSections.find((s: HeroSection) => s.id === id);
    if (!section || section.isActive) {
      return false;
    }
    try {
      await heroSectionsApi.delete(id);
      setHeroSections((prev: HeroSection[]) => prev.filter((s: HeroSection) => s.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete hero section:', err);
      throw err;
    }
  };

  const activateHeroSection = async (id: string) => {
    try {
      const result = await heroSectionsApi.activate(id);
      if (result.heroSections) {
        setHeroSections(result.heroSections);
      }
    } catch (err) {
      console.error('Failed to activate hero section:', err);
      throw err;
    }
  };

  const updateHeroContent = async (content: HeroContent) => {
    if (activeHeroSection) {
      await updateHeroSection({ ...activeHeroSection, ...content });
    }
  };

  const resetHeroContent = async () => {
    try {
      await seedApi.seed();
      await fetchHeroSections();
    } catch (err) {
      console.error('Failed to reset hero content:', err);
      throw err;
    }
  };

  const refreshHeroSections = async () => {
    await fetchHeroSections();
  };

  return (
    <ContentContext.Provider value={{
      heroContent,
      heroSections,
      activeHeroSection,
      isLoading,
      error,
      addHeroSection,
      updateHeroSection,
      deleteHeroSection,
      activateHeroSection,
      updateHeroContent,
      resetHeroContent,
      refreshHeroSections
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