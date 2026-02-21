import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message, name } = await request.json();

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // ✅ Перевірка наявності env змінних
    if (!token || !chatId) {
      console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
      return NextResponse.json(
        { error: 'Telegram not configured' },
        { status: 500 }
      );
    }

    const text = name?.trim()
      ? `👤 *${name.trim()}*\n\n${message}`
      : message;

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    const data = await res.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      return NextResponse.json({ error: 'Telegram API error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}