'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Testimonials.module.css';

const Testimonials = () => {
    const { t } = useLanguage();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const testimonials = [
        {
            id: 1,
            quoteKey: 'testimonials.quote1',
            authorKey: 'testimonials.author1',
            roleKey: 'testimonials.role1',
        },
        {
            id: 2,
            quoteKey: 'testimonials.quote2',
            authorKey: 'testimonials.author2',
            roleKey: 'testimonials.role2',
        },
        {
            id: 3,
            quoteKey: 'testimonials.quote3',
            authorKey: 'testimonials.author3',
            roleKey: 'testimonials.role3',
        },
        {
            id: 4,
            quoteKey: 'testimonials.quote4',
            authorKey: 'testimonials.author4',
            roleKey: 'testimonials.role4',
        },
    ];

    // Дублюємо testimonials для безкінечної прокрутки
    const duplicatedTestimonials = [...testimonials, ...testimonials];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.heading}>{t('testimonials.heading')}</h2>
                </div>

                {/* Scrolling Container */}
                <div className={styles.scrollContainer}>
                    <div className={styles.scrollTrack}>
                        {duplicatedTestimonials.map((testimonial, index) => (
                            <div
                                key={`${testimonial.id}-${index}`}
                                className={`${styles.card} ${hoveredCard === index ? styles.cardHover : ''}`}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                {/* Quote */}
                                <p className={styles.quote}>
                                    «{t(testimonial.quoteKey)}»
                                </p>

                                {/* Author */}
                                <div className={styles.author}>
                                    <p className={styles.authorName}>
                                        — {t(testimonial.authorKey)}
                                    </p>
                                    <p className={styles.authorRole}>
                                        ({t(testimonial.roleKey)})
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;