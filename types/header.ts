export type Language = 'Укр' | 'En';

export interface NavigationItem {
    label: string;
    href: string;
    ariaLabel?: string;
}

export interface HeaderProps {
    defaultLanguage?: Language;
    onLanguageChange?: (language: Language) => void;
    onCtaClick?: () => void;
    className?: string;
}

export interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navigationItems: NavigationItem[];
    activeLanguage: Language;
    onLanguageChange: (language: Language) => void;
}

// Константи для навігації
export const NAVIGATION_ITEMS: NavigationItem[] = [
    {
        label: 'Bender 2.0',
        href: '#bender-2',
        ariaLabel: 'Navigate to Bender 2.0 section',
    },
    {
        label: 'Bender-M',
        href: '#bender-m',
        ariaLabel: 'Navigate to Bender-M section',
    },
    {
        label: 'Bender-L',
        href: '#bender-l',
        ariaLabel: 'Navigate to Bender-L section',
    },
];

// Константи для мов
export const LANGUAGES: Language[] = ['Укр', 'En'];

// Переклади
export const TRANSLATIONS = {
    Укр: {
        cta: 'Отримати презентацію',
        menuAriaLabel: 'Головне меню навігації',
        toggleMenu: 'Перемкнути меню',
    },
    En: {
        cta: 'Get Presentation',
        menuAriaLabel: 'Main navigation menu',
        toggleMenu: 'Toggle menu',
    },
};

