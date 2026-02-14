# AI Помічник - Інструкція по інтеграції

## 📋 Що створено

Створено AI помічника для сайту BENDER ROBOTS з наступними можливостями:

- ✅ Інтеграція з Claude API (Anthropic)
- ✅ Підтримка української та англійської мов
- ✅ Адаптивний дизайн (мобільний, планшет, десктоп)
- ✅ Контекстні відповіді про продукцію компанії
- ✅ Професійний військовий стиль дизайну

## 🚀 Інтеграція в проект

### Крок 1: Скопіюйте файли

```bash
# Створіть директорію для компонента
mkdir -p components/AIAssistant

# Скопіюйте файли
cp AIAssistant.tsx components/AIAssistant/
cp AIAssistant.module.css components/AIAssistant/
```

### Крок 2: Додайте компонент в Layout

Відкрийте `app/layout.tsx` і додайте AI помічника:

```typescript
import AIAssistant from '@/components/AIAssistant/AIAssistant';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          {children}
          <AIAssistant />  {/* ← Додайте цей рядок */}
        </LanguageProvider>
      </body>
    </html>
  );
}
```

### Крок 3: Налаштування API

Компонент використовує прямий доступ до Anthropic API без необхідності backend proxy.

**ВАЖЛИВО:** Для production використання необхідно:

1. Створити server-side API endpoint для безпеки ключа
2. Або використати rate limiting на клієнті

#### Варіант 1: Server-side API (Рекомендовано)

Створіть `app/api/chat/route.ts`:

```typescript
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: messages,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}
```

Потім змініть в `AIAssistant.tsx`:

```typescript
// Замість прямого виклику API
const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [
      // ... ваші повідомлення
    ],
  }),
});
```

### Крок 4: Додайте змінну оточення

Створіть `.env.local`:

```
ANTHROPIC_API_KEY=your_api_key_here
```

## 🎨 Кастомізація

### Зміна кольорів

Відредагуйте `AIAssistant.module.css`:

```css
/* Головний колір кнопки */
.chatButton {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  /* Змініть на ваш колір, наприклад: */
  background: linear-gradient(135deg, #ff6b35 0%, #e55a24 100%);
}

/* Колір повідомлень користувача */
.userMessage .messageContent {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
}
```

### Зміна позиції

```css
.chatButton {
  bottom: 2rem; /* Відстань знизу */
  right: 2rem; /* Відстань справа */

  /* Для позиції зліва змініть на: */
  /* left: 2rem; */
}
```

### Зміна привітального повідомлення

В `AIAssistant.tsx`, функція `handleOpen()`:

```typescript
const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content:
    language === "uk"
      ? "Ваше власне привітання українською"
      : "Your custom greeting in English",
  timestamp: new Date(),
};
```

### Зміна системного промпту

В функції `handleSendMessage()`:

```typescript
{
  role: 'system',
  content: 'Ваш власний системний промпт тут...'
}
```

## 📱 Адаптивність

Компонент автоматично адаптується:

- **Мобільні (<768px):** Повноекранний чат
- **Планшети (768-1023px):** Вікно 360x580px
- **Десктоп (>1024px):** Вікно 380x600px
- **Великі екрани (>1366px):** Вікно 400x640px

## 🔧 Налаштування функціоналу

### Обмеження довжини повідомлень

```typescript
const handleSendMessage = async () => {
  const maxLength = 500; // символів
  if (inputValue.length > maxLength) {
    alert("Повідомлення занадто довге");
    return;
  }
  // ... решта коду
};
```

### Обмеження історії повідомлень

```typescript
const maxMessages = 20; // Максимум повідомлень

setMessages((prev) => {
  const newMessages = [...prev, userMessage];
  if (newMessages.length > maxMessages) {
    return newMessages.slice(-maxMessages);
  }
  return newMessages;
});
```

### Збереження історії в localStorage

```typescript
// При завантаженні
useEffect(() => {
  const savedMessages = localStorage.getItem("chatHistory");
  if (savedMessages) {
    setMessages(JSON.parse(savedMessages));
  }
}, []);

// При зміні повідомлень
useEffect(() => {
  if (messages.length > 0) {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }
}, [messages]);
```

## 🎯 Можливі покращення

1. **Додати typing indicator для користувача**
2. **Додати можливість завантаження файлів**
3. **Додати історію чатів (multiple sessions)**
4. **Додати експорт розмови**
5. **Додати звукові сповіщення**
6. **Додати попередньо задані питання (Quick replies)**
7. **Інтеграція з системою аналітики**

## 📊 Приклад Quick Replies

Додайте швидкі відповіді:

```typescript
const quickReplies = [
  {
    uk: 'Характеристики Bender-2.0',
    en: 'Bender-2.0 specifications'
  },
  {
    uk: 'Ціна та постачання',
    en: 'Price and delivery'
  },
  {
    uk: 'Технічна підтримка',
    en: 'Technical support'
  },
];

// Додайте в JSX після inputContainer
<div className={styles.quickReplies}>
  {quickReplies.map((reply, index) => (
    <button
      key={index}
      onClick={() => setInputValue(language === 'uk' ? reply.uk : reply.en)}
      className={styles.quickReply}
    >
      {language === 'uk' ? reply.uk : reply.en}
    </button>
  ))}
</div>
```

## 🛡️ Безпека

**Важливі рекомендації:**

1. ❌ **Ніколи** не зберігайте API ключі в клієнтському коді
2. ✅ Використовуйте server-side API route
3. ✅ Додайте rate limiting (наприклад, max 10 запитів/хвилину)
4. ✅ Валідуйте всі input дані
5. ✅ Додайте CORS захист на API endpoints

## 📞 Підтримка

При виникненні проблем:

1. Перевірте консоль браузера на помилки
2. Переконайтесь що API ключ валідний
3. Перевірте мережеві запити в DevTools
4. Перевірте правильність імпортів та шляхів

## 🎉 Готово!

Тепер на вашому сайті працює повнофункціональний AI помічник!
