'use client';

import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.css';
import type { 
  ContentData, 
  FooterContent, 
  AboutUsContent,
  ProductContent, 
  TestimonialContent,
  SupportContent,
  SupportUnit,
  VideoBackgroundContent
} from '@/types/content-full';

type TabType = 'footer' | 'aboutUs' | 'products' | 'testimonials' | 'support' | 'videoBackground';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('footer');
  const [contentData, setContentData] = useState<ContentData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Завантаження даних
  useEffect(() => {
    if (isAuthenticated) {
      fetchContent();
    }
  }, [isAuthenticated]);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/content');
      const data = await response.json();
      setContentData(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2025') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
    } else {
      alert('Невірний пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentData),
      });

      if (response.ok) {
        setSaveMessage('✓ Збережено успішно!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('✗ Помилка збереження');
      }
    } catch (error) {
      console.error('Error saving:', error);
      setSaveMessage('✗ Помилка збереження');
    } finally {
      setIsSaving(false);
    }
  };

  // Форма логіну
  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h1 className={styles.loginTitle}>🔐 Адмін панель</h1>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="password"
              placeholder="Введіть пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.loginInput}
              required
            />
            <button type="submit" className={styles.loginButton}>
              Увійти
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!contentData) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Адміністративна панель</h1>
        <div className={styles.headerActions}>
          <button onClick={handleSave} className={styles.saveButton} disabled={isSaving}>
            {isSaving ? 'Збереження...' : '💾 Зберегти зміни'}
          </button>
          <button onClick={handleLogout} className={styles.logoutButton}>
            🚪 Вийти
          </button>
        </div>
      </header>

      {saveMessage && (
        <div className={`${styles.saveMessage} ${saveMessage.includes('✓') ? styles.success : styles.error}`}>
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'footer' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('footer')}
        >
          📧 Footer
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'aboutUs' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('aboutUs')}
        >
          ℹ️ About Us
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🤖 Products
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'testimonials' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('testimonials')}
        >
          💬 Testimonials
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'support' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('support')}
        >
          🤝 Support
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'videoBackground' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('videoBackground')}
        >
          🎥 Video Background
        </button>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {activeTab === 'footer' && (
          <FooterEditor data={contentData.footer} onChange={(data) => setContentData({ ...contentData, footer: data })} />
        )}
        {activeTab === 'aboutUs' && (
          <AboutUsEditor data={contentData.aboutUs} onChange={(data) => setContentData({ ...contentData, aboutUs: data })} />
        )}
        {activeTab === 'products' && (
          <ProductsEditor data={contentData.products} onChange={(data) => setContentData({ ...contentData, products: data })} />
        )}
        {activeTab === 'testimonials' && (
          <TestimonialsEditor data={contentData.testimonials} onChange={(data) => setContentData({ ...contentData, testimonials: data })} />
        )}
        {activeTab === 'support' && (
          <SupportEditor data={contentData.support} onChange={(data) => setContentData({ ...contentData, support: data })} />
        )}
        {activeTab === 'videoBackground' && (
          <VideoBackgroundEditor data={contentData.videoBackground} onChange={(data) => setContentData({ ...contentData, videoBackground: data })} />
        )}
      </div>
    </div>
  );
};

// ==================== EDITORS ====================

// Footer Editor
interface FooterEditorProps {
  data: FooterContent;
  onChange: (data: FooterContent) => void;
}

const FooterEditor = ({ data, onChange }: FooterEditorProps) => (
  <div className={styles.editor}>
    <h2>Редагування Footer</h2>
    
    <h3>Основна інформація</h3>
    
    <div className={styles.formGroup}>
      <label>Заголовок (UA):</label>
      <input
        type="text"
        value={data.heading_uk}
        onChange={(e) => onChange({ ...data, heading_uk: e.target.value })}
        className={styles.input}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Заголовок (EN):</label>
      <input
        type="text"
        value={data.heading_en}
        onChange={(e) => onChange({ ...data, heading_en: e.target.value })}
        className={styles.input}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Опис (UA):</label>
      <textarea
        value={data.description_uk}
        onChange={(e) => onChange({ ...data, description_uk: e.target.value })}
        className={styles.textarea}
        rows={3}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Опис (EN):</label>
      <textarea
        value={data.description_en}
        onChange={(e) => onChange({ ...data, description_en: e.target.value })}
        className={styles.textarea}
        rows={3}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Email:</label>
      <input
        type="email"
        value={data.email}
        onChange={(e) => onChange({ ...data, email: e.target.value })}
        className={styles.input}
      />
    </div>

    <h3>Форма контакту</h3>

    <div className={styles.formGroup}>
      <label>Мітка &quot;Ім&apos;я&quot; (UA):</label>
      <input
        type="text"
        value={data.nameLabel_uk}
        onChange={(e) => onChange({ ...data, nameLabel_uk: e.target.value })}
        className={styles.input}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Мітка &quot;Ім&apos;я&quot; (EN):</label>
      <input
        type="text"
        value={data.nameLabel_en}
        onChange={(e) => onChange({ ...data, nameLabel_en: e.target.value })}
        className={styles.input}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Кнопка відправки (UA):</label>
      <input
        type="text"
        value={data.submitButton_uk}
        onChange={(e) => onChange({ ...data, submitButton_uk: e.target.value })}
        className={styles.input}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Кнопка відправки (EN):</label>
      <input
        type="text"
        value={data.submitButton_en}
        onChange={(e) => onChange({ ...data, submitButton_en: e.target.value })}
        className={styles.input}
      />
    </div>

    <h3>Копірайт</h3>

    <div className={styles.formGroup}>
      <label>Копірайт (UA):</label>
      <input
        type="text"
        value={data.copyright_uk}
        onChange={(e) => onChange({ ...data, copyright_uk: e.target.value })}
        className={styles.input}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Копірайт (EN):</label>
      <input
        type="text"
        value={data.copyright_en}
        onChange={(e) => onChange({ ...data, copyright_en: e.target.value })}
        className={styles.input}
      />
    </div>
  </div>
);

// About Us Editor
interface AboutUsEditorProps {
  data: AboutUsContent;
  onChange: (data: AboutUsContent) => void;
}

const AboutUsEditor = ({ data, onChange }: AboutUsEditorProps) => (
  <div className={styles.editor}>
    <h2>Редагування &quot;Про нас&quot;</h2>
    
    <div className={styles.formGroup}>
      <label>Заголовок (UA):</label>
      <textarea
        value={data.heading_uk}
        onChange={(e) => onChange({ ...data, heading_uk: e.target.value })}
        className={styles.textarea}
        rows={2}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Заголовок (EN):</label>
      <textarea
        value={data.heading_en}
        onChange={(e) => onChange({ ...data, heading_en: e.target.value })}
        className={styles.textarea}
        rows={2}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Опис 1 (UA):</label>
      <textarea
        value={data.description1_uk}
        onChange={(e) => onChange({ ...data, description1_uk: e.target.value })}
        className={styles.textarea}
        rows={3}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Опис 1 (EN):</label>
      <textarea
        value={data.description1_en}
        onChange={(e) => onChange({ ...data, description1_en: e.target.value })}
        className={styles.textarea}
        rows={3}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Опис 2 (UA):</label>
      <textarea
        value={data.description2_uk}
        onChange={(e) => onChange({ ...data, description2_uk: e.target.value })}
        className={styles.textarea}
        rows={3}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Опис 2 (EN):</label>
      <textarea
        value={data.description2_en}
        onChange={(e) => onChange({ ...data, description2_en: e.target.value })}
        className={styles.textarea}
        rows={3}
      />
    </div>

    <div className={styles.formGroup}>
      <label>Відео (URL):</label>
      <input
        type="text"
        value={data.video}
        onChange={(e) => onChange({ ...data, video: e.target.value })}
        className={styles.input}
        placeholder="/videos/robot-demo.mp4"
      />
    </div>
  </div>
);

// Products Editor
interface ProductsEditorProps {
  data: ProductContent[];
  onChange: (data: ProductContent[]) => void;
}

const ProductsEditor = ({ data, onChange }: ProductsEditorProps) => {
  const addProduct = () => {
    const newProduct: ProductContent = {
      id: Date.now(),
      name_uk: 'Новий продукт',
      name_en: 'New Product',
      description_uk: '',
      description_en: '',
      features_uk: [],
      features_en: [],
      image: ''
    };
    onChange([...data, newProduct]);
  };

  const removeProduct = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const updateProduct = (index: number, field: keyof ProductContent, value: unknown) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  const addFeature = (index: number, lang: 'uk' | 'en') => {
    const newData = [...data];
    const field = `features_${lang}` as keyof ProductContent;
    const features = [...(newData[index][field] as string[])];
    features.push('Нова характеристика');
    newData[index] = { ...newData[index], [field]: features };
    onChange(newData);
  };

  const removeFeature = (productIndex: number, featureIndex: number, lang: 'uk' | 'en') => {
    const newData = [...data];
    const field = `features_${lang}` as keyof ProductContent;
    const features = [...(newData[productIndex][field] as string[])];
    features.splice(featureIndex, 1);
    newData[productIndex] = { ...newData[productIndex], [field]: features };
    onChange(newData);
  };

  const updateFeature = (productIndex: number, featureIndex: number, lang: 'uk' | 'en', value: string) => {
    const newData = [...data];
    const field = `features_${lang}` as keyof ProductContent;
    const features = [...(newData[productIndex][field] as string[])];
    features[featureIndex] = value;
    newData[productIndex] = { ...newData[productIndex], [field]: features };
    onChange(newData);
  };

  return (
    <div className={styles.editor}>
      <h2>Редагування Products</h2>
      
      <button onClick={addProduct} className={styles.addButton}>
        ➕ Додати продукт
      </button>
      
      {data.map((product, index) => (
        <div key={product.id} className={styles.productItem}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Продукт #{index + 1}</h3>
            <button onClick={() => removeProduct(index)} className={styles.removeButton}>
              🗑️ Видалити
            </button>
          </div>
          
          <div className={styles.formGroup}>
            <label>Назва (UA):</label>
            <input
              type="text"
              value={product.name_uk}
              onChange={(e) => updateProduct(index, 'name_uk', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Назва (EN):</label>
            <input
              type="text"
              value={product.name_en}
              onChange={(e) => updateProduct(index, 'name_en', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Опис (UA):</label>
            <textarea
              value={product.description_uk}
              onChange={(e) => updateProduct(index, 'description_uk', e.target.value)}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Опис (EN):</label>
            <textarea
              value={product.description_en}
              onChange={(e) => updateProduct(index, 'description_en', e.target.value)}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Зображення (URL):</label>
            <input
              type="text"
              value={product.image}
              onChange={(e) => updateProduct(index, 'image', e.target.value)}
              className={styles.input}
            />
          </div>

          <h4>Характеристики (UA)</h4>
          {product.features_uk.map((feature, fIndex) => (
            <div key={fIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, fIndex, 'uk', e.target.value)}
                className={styles.input}
              />
              <button onClick={() => removeFeature(index, fIndex, 'uk')} className={styles.smallRemoveButton}>
                ✕
              </button>
            </div>
          ))}
          <button onClick={() => addFeature(index, 'uk')} className={styles.smallAddButton}>
            + Додати характеристику (UA)
          </button>

          <h4>Характеристики (EN)</h4>
          {product.features_en.map((feature, fIndex) => (
            <div key={fIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, fIndex, 'en', e.target.value)}
                className={styles.input}
              />
              <button onClick={() => removeFeature(index, fIndex, 'en')} className={styles.smallRemoveButton}>
                ✕
              </button>
            </div>
          ))}
          <button onClick={() => addFeature(index, 'en')} className={styles.smallAddButton}>
            + Додати характеристику (EN)
          </button>
        </div>
      ))}
    </div>
  );
};

// Testimonials Editor
interface TestimonialsEditorProps {
  data: TestimonialContent[];
  onChange: (data: TestimonialContent[]) => void;
}

const TestimonialsEditor = ({ data, onChange }: TestimonialsEditorProps) => {
  const addTestimonial = () => {
    const newTestimonial: TestimonialContent = {
      id: Date.now(),
      quote_uk: '',
      quote_en: '',
      author_uk: '',
      author_en: '',
      role_uk: '',
      role_en: ''
    };
    onChange([...data, newTestimonial]);
  };

  const removeTestimonial = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  const updateTestimonial = (index: number, field: keyof TestimonialContent, value: string) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className={styles.editor}>
      <h2>Редагування Testimonials</h2>
      
      <button onClick={addTestimonial} className={styles.addButton}>
        ➕ Додати відгук
      </button>
      
      {data.map((testimonial, index) => (
        <div key={testimonial.id} className={styles.productItem}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Відгук #{index + 1}</h3>
            <button onClick={() => removeTestimonial(index)} className={styles.removeButton}>
              🗑️ Видалити
            </button>
          </div>
          
          <div className={styles.formGroup}>
            <label>Цитата (UA):</label>
            <textarea
              value={testimonial.quote_uk}
              onChange={(e) => updateTestimonial(index, 'quote_uk', e.target.value)}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Цитата (EN):</label>
            <textarea
              value={testimonial.quote_en}
              onChange={(e) => updateTestimonial(index, 'quote_en', e.target.value)}
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Автор (UA):</label>
            <input
              type="text"
              value={testimonial.author_uk}
              onChange={(e) => updateTestimonial(index, 'author_uk', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Автор (EN):</label>
            <input
              type="text"
              value={testimonial.author_en}
              onChange={(e) => updateTestimonial(index, 'author_en', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Посада/Роль (UA):</label>
            <input
              type="text"
              value={testimonial.role_uk}
              onChange={(e) => updateTestimonial(index, 'role_uk', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Посада/Роль (EN):</label>
            <input
              type="text"
              value={testimonial.role_en}
              onChange={(e) => updateTestimonial(index, 'role_en', e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Support Editor
interface SupportEditorProps {
  data: SupportContent;
  onChange: (data: SupportContent) => void;
}

const SupportEditor = ({ data, onChange }: SupportEditorProps) => {
  const addUnit = () => {
    const newUnit: SupportUnit = {
      id: Date.now(),
      name_uk: '',
      name_en: '',
      logo: ''
    };
    onChange({ ...data, units: [...data.units, newUnit] });
  };

  const removeUnit = (index: number) => {
    const newUnits = data.units.filter((_, i) => i !== index);
    onChange({ ...data, units: newUnits });
  };

  const updateUnit = (index: number, field: keyof SupportUnit, value: string) => {
    const newUnits = [...data.units];
    newUnits[index] = { ...newUnits[index], [field]: value };
    onChange({ ...data, units: newUnits });
  };

  return (
    <div className={styles.editor}>
      <h2>Редагування &quot;Підтримка&quot;</h2>
      
      <div className={styles.formGroup}>
        <label>Заголовок (UA):</label>
        <input
          type="text"
          value={data.heading_uk}
          onChange={(e) => onChange({ ...data, heading_uk: e.target.value })}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Заголовок (EN):</label>
        <input
          type="text"
          value={data.heading_en}
          onChange={(e) => onChange({ ...data, heading_en: e.target.value })}
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Опис (UA):</label>
        <textarea
          value={data.description_uk}
          onChange={(e) => onChange({ ...data, description_uk: e.target.value })}
          className={styles.textarea}
          rows={2}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Опис (EN):</label>
        <textarea
          value={data.description_en}
          onChange={(e) => onChange({ ...data, description_en: e.target.value })}
          className={styles.textarea}
          rows={2}
        />
      </div>

      <h3>Підрозділи</h3>
      <button onClick={addUnit} className={styles.addButton}>
        ➕ Додати підрозділ
      </button>
      
      {data.units.map((unit, index) => (
        <div key={unit.id} className={styles.unitItem}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Підрозділ #{index + 1}</h4>
            <button onClick={() => removeUnit(index)} className={styles.removeButton}>
              🗑️ Видалити
            </button>
          </div>
          
          <div className={styles.formGroup}>
            <label>Назва (UA):</label>
            <input
              type="text"
              value={unit.name_uk}
              onChange={(e) => updateUnit(index, 'name_uk', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Назва (EN):</label>
            <input
              type="text"
              value={unit.name_en}
              onChange={(e) => updateUnit(index, 'name_en', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Логотип (URL):</label>
            <input
              type="text"
              value={unit.logo}
              onChange={(e) => updateUnit(index, 'logo', e.target.value)}
              className={styles.input}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Video Background Editor
interface VideoBackgroundEditorProps {
  data: VideoBackgroundContent;
  onChange: (data: VideoBackgroundContent) => void;
}

const VideoBackgroundEditor = ({ data, onChange }: VideoBackgroundEditorProps) => (
  <div className={styles.editor}>
    <h2>Редагування Video Background</h2>
    
    <div className={styles.formGroup}>
      <label>Відео (URL):</label>
      <input
        type="text"
        value={data.videoSrc}
        onChange={(e) => onChange({ ...data, videoSrc: e.target.value })}
        className={styles.input}
        placeholder="/videos/background.mp4"
      />
    </div>

    <div className={styles.formGroup}>
      <label>Прозорість (0-1):</label>
      <input
        type="number"
        min="0"
        max="1"
        step="0.1"
        value={data.opacity}
        onChange={(e) => onChange({ ...data, opacity: parseFloat(e.target.value) })}
        className={styles.input}
      />
    </div>

    <div className={styles.formGroup}>
      <label>
        <input
          type="checkbox"
          checked={data.enabled}
          onChange={(e) => onChange({ ...data, enabled: e.target.checked })}
        />
        {' '}Увімкнути відео фон
      </label>
    </div>
  </div>
);

export default AdminDashboard;