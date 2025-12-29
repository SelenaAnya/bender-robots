'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './We_already_have_support.module.css';

interface SupportUnit {
    id: number;
    nameKey: string;
    logo: string;
}

const WeAlreadyHaveSupport = () => {
    const { t } = useLanguage();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const supportUnits: SupportUnit[] = [
        {
            id: 1,
            nameKey: 'support.unit1',
            logo: '/svg/logo/rybij.svg',
        },
        {
            id: 2,
            nameKey: 'support.unit2',
            logo: '/svg/logo/3oshbr.svg',
        },
        {
            id: 3,
            nameKey: 'support.unit3',
            logo: '/svg/logo/6prikordonnyi.svg',
        },
        {
            id: 4,
            nameKey: 'support.unit4',
            logo: '/svg/logo/DaVinchi.svg',
        },
        {
            id: 5,
            nameKey: 'support.unit5',
            logo: '/svg/logo/dozor.svg',
        },
        {
            id: 6,
            nameKey: 'support.unit6',
            logo: '/svg/logo/Khartiya.svg',
        },
        {
            id: 7,
            nameKey: 'support.unit7',
            logo: '/svg/logo/pomsta.svg',
        },
        {
            id: 8,
            nameKey: 'support.unit8',
            logo: '/svg/logo/stricks.svg',
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.heading}>{t('support.heading')}</h2>
                    <p className={styles.description}>{t('support.description')}</p>
                </div>

                {/* First row - 5 units */}
                <div className={styles.grid}>
                    {supportUnits.slice(0, 5).map((unit, index) => (
                        <div
                            key={unit.id}
                            className={`${styles.logoCard} ${hoveredCard === index ? styles.logoCardHover : ''}`}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={styles.logoWrapper}>
                                <img
                                    src={unit.logo}
                                    alt={t(unit.nameKey)}
                                    className={styles.logo}
                                />
                            </div>
                            <span className={styles.unitName}>{t(unit.nameKey)}</span>
                        </div>
                    ))}
                </div>

                {/* Second row - 3 units */}
                <div className={styles.additionalRow}>
                    {supportUnits.slice(5, 8).map((unit, index) => (
                        <div
                            key={unit.id}
                            className={`${styles.logoCard} ${hoveredCard === index + 5 ? styles.logoCardHover : ''}`}
                            onMouseEnter={() => setHoveredCard(index + 5)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div className={styles.logoWrapper}>
                                <img
                                    src={unit.logo}
                                    alt={t(unit.nameKey)}
                                    className={styles.logo}
                                />
                            </div>
                            <div className={styles.unitName}>{t(unit.nameKey)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WeAlreadyHaveSupport;