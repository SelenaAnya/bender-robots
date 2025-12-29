'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import styles from './About_us.module.css';

const AboutUs = () => {
    const { t } = useLanguage();

    return (
        <section className={styles.aboutSection}>
            <div className={styles.container}>
                <div className={styles.videoGrid}>
                    {/* Video Section - Left column on desktop */}
                    <div className={styles.videoItem}>
                        <video
                            className={styles.video}
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/videos/robot-demo.mp4" type="video/mp4" />
                        </video>
                        <button className={styles.playButton} aria-label="Play video">
                            <svg
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                            >
                                <circle cx="24" cy="24" r="24" fill="rgba(255, 255, 255, 0.9)" />
                                <path
                                    d="M18 14L34 24L18 34V14Z"
                                    fill="#1a1a1a"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Text Content - Right column on desktop */}
                    <div className={styles.textContent}>
                        <h3 className={styles.heading}>{t('aboutUs.heading')}</h3>
                        <p className={styles.description}>{t('aboutUs.description1')}</p>
                        <p className={styles.description}>{t('aboutUs.description2')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;