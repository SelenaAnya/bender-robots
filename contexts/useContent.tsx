'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import type { ContentData } from '@/types/content-full';

type TranslatableKey<T> = {
  [K in keyof T]: K extends `${string}_uk` 
    ? K extends `${infer Base}_uk` 
      ? `${Base}_en` extends keyof T 
        ? Base 
        : never 
      : never 
    : never;
}[keyof T];

export function useContent() {
  const { language } = useLanguage();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content');
      
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }

      const data = await response.json();
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  // Спеціалізовані функції для кожної секції
  const footer = {
    get: (key: TranslatableKey<ContentData['footer']>): string => {
      if (!content?.footer) return '';
      const fullKey = `${key}_${language}` as keyof ContentData['footer'];
      const value = content.footer[fullKey];
      return typeof value === 'string' ? value : '';
    },
    getEmail: () => content?.footer.email || '',
  };

  const aboutUs = {
    get: (key: TranslatableKey<ContentData['aboutUs']>): string => {
      if (!content?.aboutUs) return '';
      const fullKey = `${key}_${language}` as keyof ContentData['aboutUs'];
      const value = content.aboutUs[fullKey];
      return typeof value === 'string' ? value : '';
    },
    getVideo: () => content?.aboutUs.video || '',
  };

  const support = {
    get: (key: TranslatableKey<ContentData['support']>): string => {
      if (!content?.support) return '';
      const fullKey = `${key}_${language}` as keyof ContentData['support'];
      const value = content.support[fullKey];
      return typeof value === 'string' ? value : '';
    },
    getUnits: () => content?.support.units || [],
  };

  const products = {
    getAll: () => content?.products || [],
    getName: (index: number): string => {
      const product = content?.products[index];
      if (!product) return '';
      const key = `name_${language}` as keyof typeof product;
      const value = product[key];
      return typeof value === 'string' ? value : '';
    },
    getDescription: (index: number): string => {
      const product = content?.products[index];
      if (!product) return '';
      const key = `description_${language}` as keyof typeof product;
      const value = product[key];
      return typeof value === 'string' ? value : '';
    },
    getFeatures: (index: number): string[] => {
      const product = content?.products[index];
      if (!product) return [];
      const key = `features_${language}` as keyof typeof product;
      const value = product[key];
      return Array.isArray(value) ? value : [];
    },
  };

  const forWhom = {
    getAll: () => content?.forWhom || [],
    getTitle: (index: number): string => {
      const item = content?.forWhom[index];
      if (!item) return '';
      const key = `title_${language}` as keyof typeof item;
      const value = item[key];
      return typeof value === 'string' ? value : '';
    },
  };

  return {
    content,
    loading,
    error,
    footer,
    aboutUs,
    support,
    products,
    forWhom,
    refetch: fetchContent,
  };
}