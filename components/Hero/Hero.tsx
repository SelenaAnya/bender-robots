       
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Hero.module.css';

export default function Home() {
  const { t } = useLanguage();

  return (

<section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {t('hero.title')}
            </h1>
            <p className={styles.heroSubtitle}>
              {t('hero.subtitle')}
            </p>
            <p className={styles.heroDescription}>
              {t('hero.description')}
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.primaryButton}>
                {t('header.getPresentation')}
              </button>
              <button className={styles.secondaryButton}>
                {t('common.learnMore')} 
              </button>
            </div>
          </div>
          </section>
  );
}  