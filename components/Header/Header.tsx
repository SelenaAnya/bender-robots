'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import css from './Header.module.css';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLanguageChange = (lang: 'uk' | 'en') => {
        setLanguage(lang);
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    const handleNavClick = () => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        <header className={css.header}>
            <div className={css.container}>
                <div className={css.headerContent}>
                    {/* Logo */}
                    <div className={css.logo}>
                        <Link href="/" aria-label="Bender Robots Home">
                            <Image
                                src="/svg/logo.svg"
                                alt="Bender Robots Logo"
                                width={150}
                                height={48}
                                className={css.logoImage}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav aria-label={t('common.menu')}>
                        <ul className={css.navigation}>
                            <li>
                                <Link href="#bender-2">{t('header.bender2')}</Link>
                            </li>
                            <li>
                                <Link href="#bender-m">{t('header.benderM')}</Link>
                            </li>
                            <li>
                                <Link href="#bender-l">{t('header.benderL')}</Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Desktop Right Section */}
                    <div className={css.rightSection}>
                        <button
                            onClick={() => handleLanguageChange('uk')}
                            className={`${css.langButton} ${language === 'uk' ? css.active : ''}`}
                            aria-label={t('header.ukrainianLang')}
                            aria-pressed={language === 'uk'}
                        >
                            Укр
                        </button>
                        <button
                            onClick={() => handleLanguageChange('en')}
                            className={`${css.langButton} ${language === 'en' ? css.active : ''}`}
                            aria-label={t('header.englishLang')}
                            aria-pressed={language === 'en'}
                        >
                            En
                        </button>
                        <button className={css.ctaButton} aria-label={t('header.getPresentation')}>
                            {t('header.getPresentation')}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className={css.menuButton}
                        aria-label={isMenuOpen ? t('common.close') : t('common.menu')}
                        aria-expanded={isMenuOpen}
                    >
                        <svg
                            className={css.menuIcon}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`${css.mobileMenu} ${isMenuOpen ? css.open : ''}`}>
                    <div className={css.mobileMenuContent}>
                        <nav aria-label={t('common.menu')}>
                            <ul className={css.mobileNavigation}>
                                <li>
                                    <Link href="#bender-2" onClick={handleNavClick}>
                                        {t('header.bender2')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#bender-m" onClick={handleNavClick}>
                                        {t('header.benderM')}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#bender-l" onClick={handleNavClick}>
                                        {t('header.benderL')}
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        <div className={css.mobileLangButtons}>
                            <button
                                onClick={() => handleLanguageChange('uk')}
                                className={`${css.langButton} ${language === 'uk' ? css.active : ''}`}
                                aria-label={t('header.ukrainianLang')}
                            >
                                Укр
                            </button>
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className={`${css.langButton} ${language === 'en' ? css.active : ''}`}
                                aria-label={t('header.englishLang')}
                            >
                                En
                            </button>
                        </div>

                        <button className={css.mobileCtaButton}>
                            {t('header.getPresentation')}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;