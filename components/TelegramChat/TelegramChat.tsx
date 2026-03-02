'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Telegramchat.module.css';

const TelegramChat = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && !sent && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen, sent]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSent(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/telegram', {
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
      buttonLabel: 'Написати нам',
      headerTitle: 'BENDER ROBOTS',
      headerSub: 'Зв\'язок з командою',
      online: 'онлайн',
      namePlaceholder: "Ім'я (необов'язково)",
      messagePlaceholder: 'Ваше питання...',
      sendButton: 'Надіслати',
      sending: 'Відправка...',
      sentTitle: 'Повідомлення надіслано',
      sentText: 'Команда відповість найближчим часом.',
      sendAnother: '← Написати ще',
      hint: 'Enter — надіслати, Shift+Enter — новий рядок',
    },
    en: {
      buttonLabel: 'Contact us',
      headerTitle: 'BENDER ROBOTS',
      headerSub: 'Team Contact',
      online: 'online',
      namePlaceholder: 'Name (optional)',
      messagePlaceholder: 'Your question...',
      sendButton: 'Send',
      sending: 'Sending...',
      sentTitle: 'Message sent',
      sentText: 'The team will respond shortly.',
      sendAnother: '← Send another',
      hint: 'Enter — send, Shift+Enter — new line',
    },
  };

  const t = texts[language] ?? texts.uk;

  const TelegramIcon = ({ size = 22 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );

  return (
    <>
      {/* ── Floating Button ── */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={styles.chatButton}
          aria-label={t.buttonLabel}
          title={t.buttonLabel}
        >
          <span className={styles.buttonPulse} />
          <TelegramIcon size={24} />
          <span className={styles.buttonTooltip}>{t.buttonLabel}</span>
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className={`${styles.chatWindow} ${isMinimized ? styles.minimized : ''}`}>

          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.headerAvatar}>
                <TelegramIcon size={16} />
              </div>
              <div className={styles.headerText}>
                <span className={styles.headerTitle}>{t.headerTitle}</span>
                <span className={styles.headerSub}>
                  <span className={styles.onlineDot} />
                  {t.headerSub}
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                onClick={handleMinimize}
                className={styles.iconBtn}
                aria-label="Minimize"
                title="Згорнути"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <button
                onClick={handleClose}
                className={styles.iconBtn}
                aria-label="Close"
                title="Закрити"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <div className={styles.chatBody}>
              {!sent ? (
                <>
                  {/* Welcome message */}
                  <div className={styles.messageRow}>
                    <div className={styles.msgAvatar}><TelegramIcon size={12} /></div>
                    <div className={styles.msgBubble}>
                      {language === 'uk'
                        ? 'Вітаємо. Опишіть ваш запит — відповімо якнайшвидше.'
                        : 'Hello. Describe your request — we will reply as soon as possible.'}
                    </div>
                  </div>

                  {/* Form */}
                  <div className={styles.form}>
                    <div className={`${styles.fieldWrap} ${focused === 'name' ? styles.fieldFocused : ''}`}>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        placeholder={t.namePlaceholder}
                        className={styles.input}
                        disabled={loading}
                        maxLength={60}
                      />
                    </div>

                    <div className={`${styles.fieldWrap} ${styles.textareaWrap} ${focused === 'msg' ? styles.fieldFocused : ''}`}>
                      <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onFocus={() => setFocused('msg')}
                        onBlur={() => setFocused(null)}
                        placeholder={t.messagePlaceholder}
                        className={styles.textarea}
                        rows={3}
                        disabled={loading}
                        maxLength={1000}
                      />
                      {message.length > 0 && (
                        <span className={styles.charCount}>{message.length}/1000</span>
                      )}
                    </div>

                    <div className={styles.formBottom}>
                      <span className={styles.hint}>{t.hint}</span>
                      <button
                        onClick={handleSend}
                        disabled={!message.trim() || loading}
                        className={styles.sendButton}
                      >
                        {loading ? (
                          <span className={styles.spinner} />
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        )}
                        {loading ? t.sending : t.sendButton}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Success state */
                <div className={styles.successState}>
                  <div className={styles.successIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className={styles.successTitle}>{t.sentTitle}</p>
                  <p className={styles.successText}>{t.sentText}</p>
                  <button onClick={() => setSent(false)} className={styles.resetBtn}>
                    {t.sendAnother}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TelegramChat;