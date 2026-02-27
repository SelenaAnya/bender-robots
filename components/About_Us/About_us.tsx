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
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/5fH3LJ62wo4?si=UU1ABZHumSnpxiwQ"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
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