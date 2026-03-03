import { NextResponse } from 'next/server';
import { saveMessage, mapMessageToSession, StoredMessage } from '@/lib/telegramStore';

export async function POST(request: Request) {
  try {
    const { message, name, sessionId } = await request.json();
    const token  = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: 'Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID' }, { status: 500 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Build message text for operator
    const lines: string[] = [];
    if (name?.trim())  lines.push(`👤 *${name.trim()}*`);
    if (sessionId)     lines.push(`🔑 \`${String(sessionId).slice(0, 14)}\``);
    lines.push('');
    lines.push(message.trim());

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join('\n'),
        parse_mode: 'Markdown',
      }),
    });

    const data = await res.json();

    if (!data.ok) {
      console.error('[telegram] API error:', data);
      return NextResponse.json({ error: 'Telegram error', details: data }, { status: 500 });
    }

    // ✅ Persist: map telegram message_id → sessionId in file
    if (sessionId && data.result?.message_id) {
      mapMessageToSession(data.result.message_id, String(sessionId));
    }

    // ✅ Persist: save user message to file store
    if (sessionId) {
      const userMsg: StoredMessage = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        sessionId: String(sessionId),
        role: 'user',
        text: message.trim(),
        timestamp: Date.now(),
        name: name?.trim() || undefined,
      };
      saveMessage(userMsg);
    }

    return NextResponse.json({ ok: true, messageId: data.result?.message_id });
  } catch (err) {
    console.error('[telegram] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    token:  process.env.TELEGRAM_BOT_TOKEN  ? '✅ set' : '❌ missing',
    chatId: process.env.TELEGRAM_CHAT_ID    ? '✅ set' : '❌ missing',
  });
}