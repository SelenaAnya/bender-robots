'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Our_steps.module.css';

const OurSteps = () => {
    const { t } = useLanguage();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const steps = [
        {
            number: '01',
            titleKey: 'ourSteps.step1',
        },
        {
            number: '02',
            titleKey: 'ourSteps.step2',
        },
        {
            number: '03',
            titleKey: 'ourSteps.step3',
        },
        {
            number: '04',
            titleKey: 'ourSteps.step4',
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h3 className={styles.heading}>{t('ourSteps.heading')}</h3>
                </div>

                <div className={styles.grid}>
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`${styles.card} ${hoveredCard === index ? styles.cardHover : ''}`}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={styles.number}>{step.number}</div>
                            <h4 className={styles.cardTitle}>{t(step.titleKey)}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurSteps;