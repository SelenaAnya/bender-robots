'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Products.module.css';

const Products = () => {
    const { t } = useLanguage();

    const products = [
        {
            id: 1,
            nameKey: 'products.bender2.name',
            descriptionKey: 'products.bender2.description',
            features: [
                'products.bender2.feature1',
                'products.bender2.feature2',
                'products.bender2.feature3',
                'products.bender2.feature4',
            ],
            image: '/images/bender-2.png',
        },
        {
            id: 2,
            nameKey: 'products.bender2.name',
            descriptionKey: 'products.bender2.description',
            features: [
                'products.bender2.feature1',
                'products.bender2.feature2',
                'products.bender2.feature3',
                'products.bender2.feature4',
            ],
            image: '/images/bender-m.png',
        },
        {
            id: 3,
            nameKey: 'products.bender2.name',
            descriptionKey: 'products.bender2.description',
            features: [
                'products.bender2.feature1',
                'products.bender2.feature2',
                'products.bender2.feature3',
                'products.bender2.feature4',
            ],
            image: '/images/bender-l.png',
        },
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h3 className={styles.heading}>{t('products.heading')}</h3>
                </div>

                {/* Products List */}
                <div className={styles.productsList}>
                    {products.map((product) => (
                        <div key={product.id} className={styles.card}>
                            <div className={styles.cardContent}>
                                {/* Image Section */}
                                <div className={styles.imageSection}>
                                    <div className={styles.imageWrapper}>
                                        {product.image ? (
                                            <img
                                                src={product.image}
                                                alt={t(product.nameKey)}
                                                className={styles.productImage}
                                            />
                                        ) : (
                                            <div className={styles.imagePlaceholder}></div>
                                        )}
                                    </div>
                                </div>

                                {/* Text Section */}
                                <div className={styles.textSection}>
                                    <h4 className={styles.productName}>
                                        {t(product.nameKey)}
                                    </h4>
                                    <p className={styles.description}>
                                        {t(product.descriptionKey)}
                                    </p>

                                    {/* Features Grid */}
                                    <div className={styles.featuresGrid}>
                                        {product.features.map((featureKey, index) => (
                                            <div key={index} className={styles.featureItem}>
                                                <span className={styles.checkmark}>✓</span>
                                                <span>{t(featureKey)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Button */}
                                    <button className={styles.button}>
                                        <span>{t('products.button')}</span>
                                        <span className={styles.arrow}>→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;