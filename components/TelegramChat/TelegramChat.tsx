'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Telegramchat.module.css';

const TelegramChat = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ оголошено до використання

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setSent(false);
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return; // ✅ перевіряємо loading
    setLoading(true);

    try {
      const res = await fetch('/api/telegram', { // ✅ правильний шлях
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          name: name.trim(),
        }),
      });

      if (!res.ok) throw new Error('Failed to send');

      setSent(true);
      setName('');
      setMessage('');
    } catch (err) {
      console.error('Telegram send error:', err);
      alert(language === 'uk'
        ? 'Помилка відправки. Спробуйте ще раз.'
        : 'Send error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const texts = {
    uk: {
      title: 'Написати нам',
      subtitle: 'Відповімо в Telegram',
      namePlaceholder: "Ваше ім'я (необов'язково)",
      messagePlaceholder: 'Ваше питання або повідомлення...',
      sendButton: loading ? 'Відправляємо...' : 'Надіслати повідомлення',
      sentTitle: 'Повідомлення надіслано!',
      sentText: 'Ми отримали ваше повідомлення і відповімо найближчим часом.',
      sendAnother: 'Написати ще',
      ariaOpen: 'Написати нам у Telegram',
      ariaClose: 'Закрити чат',
    },
    en: {
      title: 'Contact Us',
      subtitle: 'We reply via Telegram',
      namePlaceholder: 'Your name (optional)',
      messagePlaceholder: 'Your question or message...',
      sendButton: loading ? 'Sending...' : 'Send Message',
      sentTitle: 'Message sent!',
      sentText: 'We received your message and will reply shortly.',
      sendAnother: 'Send another',
      ariaOpen: 'Contact us on Telegram',
      ariaClose: 'Close chat',
    },
  };

  const t = texts[language] ?? texts.uk;

  return (
    <>
      {!isOpen && (
        <button onClick={handleOpen} className={styles.chatButton} aria-label={t.ariaOpen}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.avatarContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div>
                <div className={styles.headerTitle}>{t.title}</div>
                <div className={styles.headerStatus}>{t.subtitle}</div>
              </div>
            </div>
            <button onClick={handleClose} className={styles.closeButton} aria-label={t.ariaClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className={styles.chatBody}>
            {!sent ? (
              <>
                <div className={styles.welcomeBubble}>
                  <div className={styles.bubbleAvatar}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div className={styles.bubbleText}>
                    {language === 'uk'
                      ? '👋 Вітаємо! Напишіть ваше питання, і ми відповімо якнайшвидше.'
                      : '👋 Hello! Write your question and we will reply as soon as possible.'}
                  </div>
                </div>

                <div className={styles.form}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={styles.input}
                    disabled={loading}
                  />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={t.messagePlaceholder}
                    className={styles.textarea}
                    rows={4}
                    disabled={loading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || loading}
                    className={styles.sendButton}
                  >
                    {loading ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    )}
                    {t.sendButton}
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h3 className={styles.successTitle}>{t.sentTitle}</h3>
                <p className={styles.successText}>{t.sentText}</p>
                <div className={styles.successButtons}>
                  <button onClick={() => setSent(false)} className={styles.secondaryButton}>
                    {t.sendAnother}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default TelegramChat;