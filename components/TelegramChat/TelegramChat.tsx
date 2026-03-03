'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import styles from './Telegramchat.module.css';

// ── Types ──────────────────────────────────────────────────────
interface ChatMessage {
  id: string;
  role: 'user' | 'operator' | 'system';
  text: string;
  timestamp: number;
  name?: string;
}

// ── Helpers ────────────────────────────────────────────────────
function generateSessionId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateSession(): string {
  if (typeof window === 'undefined') return generateSessionId();
  let id = sessionStorage.getItem('tg_session_id');
  if (!id) {
    id = generateSessionId();
    sessionStorage.setItem('tg_session_id', id);
  }
  return id;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Icons ──────────────────────────────────────────────────────
const TelegramIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const SendIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ── Component ──────────────────────────────────────────────────
const TelegramChat = () => {
  const { language } = useLanguage();

  const [isOpen, setIsOpen]               = useState(false);
  const [isMinimized, setIsMinimized]     = useState(false);
  const [name, setName]                   = useState('');
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [inputText, setInputText]         = useState('');
  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [loading, setLoading]             = useState(false);
  const [focused, setFocused]             = useState<string | null>(null);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [lastPollTime, setLastPollTime]   = useState(0);
  const [isTyping, setIsTyping]           = useState(false);

  const sessionId      = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);
  const nameInputRef   = useRef<HTMLInputElement>(null);
  const pollIntervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimeoutRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPollTimeRef   = useRef<number>(0);

  // Keep ref in sync with state
  useEffect(() => { lastPollTimeRef.current = lastPollTime; }, [lastPollTime]);

  // Init session
  useEffect(() => {
    sessionId.current = getOrCreateSession();
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60);
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) scrollToBottom();
  }, [messages, isTyping, isOpen, isMinimized, scrollToBottom]);

  // Focus textarea
  useEffect(() => {
    if (isOpen && nameConfirmed && !isMinimized) {
      setTimeout(() => textareaRef.current?.focus(), 300);
    }
  }, [isOpen, nameConfirmed, isMinimized]);

  // Focus name input
  useEffect(() => {
    if (isOpen && !nameConfirmed && !isMinimized) {
      setTimeout(() => nameInputRef.current?.focus(), 300);
    }
  }, [isOpen, nameConfirmed, isMinimized]);

  // ── Polling ──────────────────────────────────────────────────
  const pollMessages = useCallback(async () => {
    if (!sessionId.current) return;
    try {
      const res = await fetch(
        `/api/telegram/webhook?sessionId=${encodeURIComponent(sessionId.current)}&since=${lastPollTimeRef.current}`
      );
      if (!res.ok) return;
      const data = await res.json();

      if (!data.messages?.length) return;

      const newMsgs: ChatMessage[] = data.messages.map((m: {
        id: string; text: string; timestamp: number; name?: string;
      }) => ({
        id: m.id,
        role: 'operator' as const,
        text: m.text,
        timestamp: m.timestamp,
        name: m.name,
      }));

      // Show typing indicator then reveal messages
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const unique = newMsgs.filter((m) => !existingIds.has(m.id));
          if (!unique.length) return prev;
          return [...prev, ...unique];
        });
        if (!isOpen || isMinimized) {
          setUnreadCount((c) => c + newMsgs.length);
        }
      }, 900 + Math.random() * 500);

      const maxTs = Math.max(...newMsgs.map((m) => m.timestamp));
      setLastPollTime(maxTs);
    } catch {
      // silent
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && nameConfirmed) {
      pollIntervalRef.current = setInterval(pollMessages, 3000);
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }
    return () => { if (pollIntervalRef.current) clearInterval(pollIntervalRef.current); };
  }, [isOpen, nameConfirmed, pollMessages]);

  // ── i18n ─────────────────────────────────────────────────────
  const T = {
    uk: {
      buttonLabel: 'Написати нам',
      headerSub: "Зв'язок з командою",
      namePlaceholder: "Введіть ваше ім'я...",
      namePrompt: "Як вас звати? (необов'язково)",
      nameSkip: 'Пропустити',
      messagePlaceholder: 'Напишіть повідомлення...',
      sendButton: 'Надіслати',
      sending: 'Відправка...',
      welcome: 'Вітаємо! Задайте будь-яке питання — оператор відповість найближчим часом.',
      typing: 'Оператор друкує...',
      hint: 'Enter — надіслати · Shift+Enter — новий рядок',
      operatorLabel: 'Оператор',
    },
    en: {
      buttonLabel: 'Contact us',
      headerSub: 'Team Contact',
      namePlaceholder: 'Enter your name...',
      namePrompt: 'Your name? (optional)',
      nameSkip: 'Skip',
      messagePlaceholder: 'Write a message...',
      sendButton: 'Send',
      sending: 'Sending...',
      welcome: 'Hello! Ask any question — an operator will reply shortly.',
      typing: 'Operator is typing...',
      hint: 'Enter — send · Shift+Enter — new line',
      operatorLabel: 'Operator',
    },
  };

  const t = T[language] ?? T.uk;

  // ── Handlers ─────────────────────────────────────────────────
  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'system',
        text: t.welcome,
        timestamp: Date.now(),
      }]);
    }
  };

  const handleClose = () => setIsOpen(false);

  const handleMinimize = () => {
    setIsMinimized((v) => !v);
    if (isMinimized) setUnreadCount(0);
  };

  const handleConfirmName = () => {
    setNameConfirmed(true);
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || loading) return;

    setInputText('');
    setLoading(true);

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
      name: name.trim() || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          name: name.trim(),
          sessionId: sessionId.current,
        }),
      });
      if (!res.ok) throw new Error('Failed');
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'system',
          text: language === 'uk'
            ? '⚠️ Помилка відправки. Спробуйте ще раз.'
            : '⚠️ Send error. Please try again.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleConfirmName();
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      {/* ── Floating Button ── */}
      {!isOpen && (
        <button onClick={handleOpen} className={styles.chatButton} aria-label={t.buttonLabel}>
          <span className={styles.buttonPulse} />
          <TelegramIcon size={26} />
          {unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount}</span>}
          <span className={styles.buttonTooltip}>{t.buttonLabel}</span>
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className={`${styles.chatWindow} ${isMinimized ? styles.minimized : ''}`}>

          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.headerAvatar}><TelegramIcon size={18} /></div>
              <div className={styles.headerText}>
                <span className={styles.headerTitle}>BENDER ROBOTS</span>
                <span className={styles.headerSub}>
                  <span className={styles.onlineDot} />
                  {t.headerSub}
                </span>
              </div>
            </div>
            <div className={styles.headerActions}>
              {unreadCount > 0 && !isMinimized && (
                <span className={styles.headerBadge}>{unreadCount}</span>
              )}
              <button onClick={handleMinimize} className={styles.iconBtn} title="Згорнути">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button onClick={handleClose} className={styles.iconBtn} title="Закрити">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          {!isMinimized && (
            <div className={styles.chatBody}>

              {/* Messages */}
              <div className={styles.messagesArea}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`${styles.messageRow} ${
                      msg.role === 'user'     ? styles.messageRowUser :
                      msg.role === 'operator' ? styles.messageRowOperator :
                                                styles.messageRowSystem
                    }`}
                  >
                    {msg.role === 'operator' && (
                      <div className={styles.msgAvatar}><TelegramIcon size={13} /></div>
                    )}
                    <div className={styles.msgBubbleWrap}>
                      {msg.role === 'operator' && (
                        <span className={styles.msgSenderLabel}>{msg.name || t.operatorLabel}</span>
                      )}
                      <div className={`${styles.msgBubble} ${
                        msg.role === 'user'     ? styles.msgBubbleUser :
                        msg.role === 'operator' ? styles.msgBubbleOperator :
                                                  styles.msgBubbleSystem
                      }`}>
                        {msg.text}
                      </div>
                      {msg.role !== 'system' && (
                        <span className={styles.msgTime}>{formatTime(msg.timestamp)}</span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className={`${styles.messageRow} ${styles.messageRowOperator}`}>
                    <div className={styles.msgAvatar}><TelegramIcon size={13} /></div>
                    <div className={styles.msgBubbleWrap}>
                      <div className={`${styles.msgBubble} ${styles.msgBubbleOperator} ${styles.typingBubble}`}>
                        <span className={styles.typingDot} />
                        <span className={styles.typingDot} />
                        <span className={styles.typingDot} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Name step */}
              {!nameConfirmed && (
                <div className={styles.nameStep}>
                  <p className={styles.namePrompt}>{t.namePrompt}</p>
                  <div className={styles.nameInputRow}>
                    <div className={`${styles.fieldWrap} ${focused === 'name' ? styles.fieldFocused : ''}`} style={{ flex: 1 }}>
                      <input
                        ref={nameInputRef}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleNameKeyDown}
                        onFocus={() => setFocused('name')}
                        onBlur={() => setFocused(null)}
                        placeholder={t.namePlaceholder}
                        className={styles.input}
                        maxLength={60}
                      />
                    </div>
                    <button onClick={handleConfirmName} className={styles.sendButton}>
                      →
                    </button>
                  </div>
                  <button onClick={handleConfirmName} className={styles.skipBtn}>
                    {t.nameSkip}
                  </button>
                </div>
              )}

              {/* Message input */}
              {nameConfirmed && (
                <div className={styles.inputArea}>
                  <div className={`${styles.fieldWrap} ${styles.textareaWrap} ${focused === 'msg' ? styles.fieldFocused : ''}`}>
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setFocused('msg')}
                      onBlur={() => setFocused(null)}
                      placeholder={t.messagePlaceholder}
                      className={styles.textarea}
                      rows={3}
                      disabled={loading}
                      maxLength={1000}
                    />
                    {inputText.length > 0 && (
                      <span className={styles.charCount}>{inputText.length}/1000</span>
                    )}
                  </div>
                  <div className={styles.formBottom}>
                    <span className={styles.hint}>{t.hint}</span>
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim() || loading}
                      className={styles.sendButton}
                    >
                      {loading ? <span className={styles.spinner} /> : <SendIcon />}
                      {loading ? t.sending : t.sendButton}
                    </button>
                  </div>
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