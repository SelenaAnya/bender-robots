'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './For_whom.module.css';

const ForWhom = () => {
    const { t } = useLanguage();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const categories = [
        {
            titleKey: 'forWhom.category1',
            image: '/images/for-whom/zsu.jpg',
        },
        {
            titleKey: 'forWhom.category2',
            image: '/images/for-whom/tro.jpg',
        },
        {
            titleKey: 'forWhom.category3',
            image: '/images/for-whom/volunteers.jpg',
        },
        {
            titleKey: 'forWhom.category4',
            image: '/images/for-whom/medics.jpg',
        },
        {
            titleKey: 'forWhom.category5',
            image: '/images/for-whom/logistics.jpg',
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.heading}>{t('forWhom.heading')}</h3>
                </div>

                <div className={styles.grid}>
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className={`${styles.card} ${hoveredCard === index ? styles.cardHover : ''}`}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div
                                className={styles.cardImage}
                                style={{
                                    backgroundImage: category.image 
                                        ? `url(${category.image})`
                                        : `linear-gradient(135deg, #2a2a2a ${index * 15}%, #1a1a1a 100%)`,
                                }}
                            />
                            <div className={styles.cardOverlay}>
                                <h4 className={styles.cardTitle}>{t(category.titleKey)}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ForWhom;