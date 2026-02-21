// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { useLanguage } from '@/contexts/LanguageContext';
// import styles from './AIAssistant.module.css';

// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
// }

// const AIAssistant = () => {
//   const { language } = useLanguage();
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const inputRef = useRef<HTMLInputElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     if (isOpen && inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, [isOpen]);

//   const handleSendMessage = async () => {
//     if (!inputValue.trim() || isLoading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content: inputValue.trim(),
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       // Використовуємо server-side API endpoint
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           messages: messages.map((msg) => ({
//             role: msg.role,
//             content: msg.content,
//           })).concat([{
//             role: 'user',
//             content: userMessage.content,
//           }]),
//           language: language,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('API request failed');
//       }

//       const data = await response.json();
      
//       if (data.content && data.content[0]?.text) {
//         const assistantMessage: Message = {
//           id: (Date.now() + 1).toString(),
//           role: 'assistant',
//           content: data.content[0].text,
//           timestamp: new Date(),
//         };
//         setMessages((prev) => [...prev, assistantMessage]);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       const errorMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: language === 'uk' 
//           ? 'Вибачте, сталася помилка. Спробуйте ще раз або зв\'яжіться з нами безпосередньо за адресою post@gmail.com' 
//           : 'Sorry, an error occurred. Please try again or contact us directly at post@gmail.com',
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleClose = () => {
//     setIsOpen(false);
//   };

//   const handleOpen = () => {
//     setIsOpen(true);
//     if (messages.length === 0) {
//       const welcomeMessage: Message = {
//         id: 'welcome',
//         role: 'assistant',
//         content: language === 'uk'
//           ? 'Вітаю! Я - AI помічник BENDER ROBOTS. Можу відповісти на питання про наші роботи, їх характеристики та застосування. Чим можу допомогти?'
//           : 'Hello! I am the BENDER ROBOTS AI assistant. I can answer questions about our robots, their specifications and applications. How can I help you?',
//         timestamp: new Date(),
//       };
//       setMessages([welcomeMessage]);
//     }
//   };

//   // Quick replies
//   const quickReplies = [
//     {
//       uk: 'Характеристики Bender-2.0',
//       en: 'Bender-2.0 specifications',
//     },
//     {
//       uk: 'Порівняння моделей',
//       en: 'Compare models',
//     },
//     {
//       uk: 'Як замовити?',
//       en: 'How to order?',
//     },
//   ];

//   return (
//     <>
//       {/* Chat Button */}
//       {!isOpen && (
//         <button
//           onClick={handleOpen}
//           className={styles.chatButton}
//           aria-label={language === 'uk' ? 'Відкрити чат' : 'Open chat'}
//         >
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           >
//             <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//           </svg>
//         </button>
//       )}

//       {/* Chat Window */}
//       {isOpen && (
//         <div className={styles.chatWindow}>
//           {/* Header */}
//           <div className={styles.chatHeader}>
//             <div className={styles.headerInfo}>
//               <div className={styles.avatarContainer}>
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                 >
//                   <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
//                 </svg>
//               </div>
//               <div>
//                 <div className={styles.headerTitle}>BENDER AI</div>
//                 <div className={styles.headerStatus}>
//                   {language === 'uk' ? 'Онлайн' : 'Online'}
//                 </div>
//               </div>
//             </div>
//             <button
//               onClick={handleClose}
//               className={styles.closeButton}
//               aria-label={language === 'uk' ? 'Закрити чат' : 'Close chat'}
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <line x1="18" y1="6" x2="6" y2="18" />
//                 <line x1="6" y1="6" x2="18" y2="18" />
//               </svg>
//             </button>
//           </div>

//           {/* Messages */}
//           <div className={styles.messagesContainer}>
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`${styles.message} ${
//                   message.role === 'user' ? styles.userMessage : styles.assistantMessage
//                 }`}
//               >
//                 <div className={styles.messageContent}>{message.content}</div>
//                 <div className={styles.messageTime}>
//                   {message.timestamp.toLocaleTimeString(language === 'uk' ? 'uk-UA' : 'en-US', {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}
//                 </div>
//               </div>
//             ))}
//             {isLoading && (
//               <div className={`${styles.message} ${styles.assistantMessage}`}>
//                 <div className={styles.messageContent}>
//                   <div className={styles.typingIndicator}>
//                     <span></span>
//                     <span></span>
//                     <span></span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Quick Replies */}
//           {messages.length === 1 && !isLoading && (
//             <div className={styles.quickRepliesContainer}>
//               {quickReplies.map((reply, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setInputValue(language === 'uk' ? reply.uk : reply.en)}
//                   className={styles.quickReply}
//                 >
//                   {language === 'uk' ? reply.uk : reply.en}
//                 </button>
//               ))}
//             </div>
//           )}

//           {/* Input */}
//           <div className={styles.inputContainer}>
//             <input
//               ref={inputRef}
//               type="text"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder={
//                 language === 'uk'
//                   ? 'Напишіть ваше питання...'
//                   : 'Type your question...'
//               }
//               className={styles.input}
//               disabled={isLoading}
//             />
//             <button
//               onClick={handleSendMessage}
//               disabled={!inputValue.trim() || isLoading}
//               className={styles.sendButton}
//               aria-label={language === 'uk' ? 'Надіслати' : 'Send'}
//             >
//               <svg
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <line x1="22" y1="2" x2="11" y2="13" />
//                 <polygon points="22 2 15 22 11 13 2 9 22 2" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AIAssistant;