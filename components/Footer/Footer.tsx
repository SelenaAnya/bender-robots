'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Footer.module.css';


const Footer = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });
    const [copied, setCopied] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
        
        // TODO: Add actual form submission logic
        // For example: send to API endpoint or email service
    };

    const handleCopyEmail = () => {
        const email = 'post@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Main Content */}
                <div className={styles.content}>
                    {/* Left Section - Info */}
                    <div className={styles.leftSection}>
                        <h2 className={styles.heading}>
                            {t('footer.heading')}
                        </h2>
                        <p className={styles.description}>
                            {t('footer.description')}
                        </p>

                        {/* Email Display */}
                        <div className={styles.emailWrapper}>
                            <svg
                                className={styles.emailIcon}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                            <span className={styles.emailText}>
                                {t('footer.email')}:
                            </span>
                            <a 
                                href="mailto:post@gmail.com" 
                                className={styles.emailLink}
                            >
                                post@gmail.com
                            </a>
                            <button
                                className={styles.copyButton}
                                onClick={handleCopyEmail}
                                aria-label={t('footer.copyEmail')}
                                title={copied ? 'Скопійовано!' : t('footer.copyEmail')}
                            >
                                {copied ? (
                                    <svg
                                        className={styles.copyIcon}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className={styles.copyIcon}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Section - Contact Form */}
                    <div className={styles.rightSection}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name" className={styles.label}>
                                    {t('footer.nameLabel')}
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder={t('footer.nameLabel')}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    {t('footer.emailLabel')}
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={styles.input}
                                    placeholder={t('footer.emailLabel')}
                                    required
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="phone" className={styles.label}>
                                    {t('footer.phoneLabel')}
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="38 (0__) ___-__-__"
                                    className={styles.input}
                                    required
                                />
                            </div>

                            <button type="submit" className={styles.submitButton}>
                                {t('footer.submitButton')}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        {t('footer.copyright')}
                    </p>
                    <div className={styles.links}>
                        <a href="#privacy" className={styles.link}>
                            {t('footer.privacyLink')}
                        </a>
                        <a href="#terms" className={styles.link}>
                            {t('footer.termsLink')}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;