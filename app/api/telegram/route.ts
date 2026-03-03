import { NextResponse } from 'next/server';
import { getMsgStore, getSessionMap, StoredMessage } from '@/lib/telegramStore';

export async function POST(request: Request) {
  try {
    const { message, name, sessionId } = await request.json();
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error('[telegram] Missing env vars');
      return NextResponse.json({ error: 'Missing env vars' }, { status: 500 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // Format for operator in Telegram
    const parts: string[] = [];
    if (name?.trim()) parts.push(`👤 *${name.trim()}*`);
    if (sessionId)     parts.push(`🔑 \`${String(sessionId).slice(0, 12)}\``);
    parts.push('');
    parts.push(message.trim());

    const text = parts.join('\n');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });

    const data = await res.json();

    if (!data.ok) {
      console.error('[telegram] API error:', data);
      return NextResponse.json({ error: 'Telegram error', details: data }, { status: 500 });
    }

    // Map sent message_id → sessionId so webhook can route replies back
    if (sessionId && data.result?.message_id) {
      getSessionMap().set(data.result.message_id, String(sessionId));
      console.log(`[telegram] ✅ mapped msg_id ${data.result.message_id} → session ${sessionId}`);
    }

    // Save user message to store
    if (sessionId) {
      const userMsg: StoredMessage = {
        id: `usr_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        sessionId: String(sessionId),
        role: 'user',
        text: message.trim(),
        timestamp: Date.now(),
        name: name?.trim() || undefined,
      };
      const store = getMsgStore();
      store.set(String(sessionId), [...(store.get(String(sessionId)) || []), userMsg]);
    }

    return NextResponse.json({ ok: true, messageId: data.result?.message_id });
  } catch (err) {
    console.error('[telegram] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    token: process.env.TELEGRAM_BOT_TOKEN ? '✅ set' : '❌ missing',
    chatId: process.env.TELEGRAM_CHAT_ID ? '✅ set' : '❌ missing',
  });
}