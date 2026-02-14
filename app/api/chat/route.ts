import { NextResponse } from 'next/server';

// Rate limiting (простий варіант для прикладу)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + 60000, // 1 хвилина
    });
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // Отримуємо IP для rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';

    // Перевіряємо rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { messages, language } = await request.json();

    // Валідація
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // Обмеження на кількість повідомлень
    if (messages.length > 50) {
      return NextResponse.json(
        { error: 'Too many messages in history' },
        { status: 400 }
      );
    }

    // Системний промпт
    const systemPrompt = language === 'uk'
      ? `Ти - AI помічник компанії BENDER ROBOTS. Компанія розробляє автономні наземні роботи для військових потреб України.

**Основна інформація про компанію:**
- BENDER ROBOTS - українська компанія інженерів
- Спеціалізація: автономні платформи для логістики, евакуації та розвідки
- Робота з початку повномасштабного вторгнення
- Мета: зробити ЗСУ технологічно сильнішими

**Продукція:**

1. **Bender-2.0**
   - Завантаження: до 250 кг
   - Дальність дії: 5-15 км (радіоканал/LTE)
   - Автономна робота: до 60 км
   - Особливості: можливість тягнути причіп, LTE та радіоканал
   - Призначення: доставка вантажів у зону бойових дій

2. **Bender-M**
   - Завантаження: до 400 кг
   - Дальність дії: 10-20 км
   - Автономна робота: до 80 км
   - Особливості: модульна конструкція

3. **Bender-L**
   - Завантаження: до 600 кг
   - Дальність дії: 15-25 км
   - Автономна робота: до 100 км
   - Особливості: повний набір сенсорів

**Переваги:**
- Розробка на основі зворотного зв'язку від фронту
- Власні технології навігації, модульності, безпеки
- Максимальна прохідність у будь-якій місцевості
- Повністю українська команда та виробництво

**Для кого:**
- Підрозділи ЗСУ
- Тактичні групи ТРО
- Волонтерські фонди
- Військові медики
- Логістичні команди на фронті

**Важливо:**
- Відповідай коротко, професійно, по суті
- Якщо не знаєш точної інформації - запропонуй зв'язатися з командою через форму на сайті
- Email для зв'язку: post@gmail.com
- Не вигадуй інформації, яка не вказана вище`
      : `You are an AI assistant for BENDER ROBOTS. The company develops autonomous ground robots for Ukrainian military needs.

**Company Information:**
- BENDER ROBOTS - Ukrainian engineering company
- Specialization: autonomous platforms for logistics, evacuation, and reconnaissance
- Operating since the beginning of the full-scale invasion
- Goal: make the Armed Forces of Ukraine technologically stronger

**Products:**

1. **Bender-2.0**
   - Load capacity: up to 250 kg
   - Range: 5-15 km (radio/LTE)
   - Autonomous operation: up to 60 km
   - Features: trailer towing capability, LTE and radio channel
   - Purpose: cargo delivery to combat zones

2. **Bender-M**
   - Load capacity: up to 400 kg
   - Range: 10-20 km
   - Autonomous operation: up to 80 km
   - Features: modular construction

3. **Bender-L**
   - Load capacity: up to 600 kg
   - Range: 15-25 km
   - Autonomous operation: up to 100 km
   - Features: full sensor suite

**Advantages:**
- Development based on frontline feedback
- Proprietary navigation, modularity, and security technologies
- Maximum cross-country capability in any terrain
- Fully Ukrainian team and production

**Target Audience:**
- Armed Forces Units
- Tactical Defense Groups
- Volunteer Funds
- Military Medics
- Frontline Logistics Teams

**Important:**
- Answer briefly, professionally, to the point
- If you don't know exact information - suggest contacting the team through the website form
- Contact email: post@gmail.com
- Don't make up information not mentioned above`;

    // Викликаємо Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Очищення старих записів rate limit
setInterval(() => {
  const now = Date.now();
  for (const [ip, limit] of rateLimitMap.entries()) {
    if (now > limit.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60000); // Кожну хвилину