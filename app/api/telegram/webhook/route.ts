import { NextResponse } from 'next/server';
import {
  saveMessage,
  getSessionForMessage,
  getLastSessionId,
  getNewOperatorMessages,
  StoredMessage,
} from '@/lib/telegramStore';

// ── POST — Telegram sends ALL updates here ──────────────────────
export async function POST(request: Request) {
  try {
    const update = await request.json();
    console.log('[webhook] update:', JSON.stringify(update));

    const message = update.message || update.edited_message;
    if (!message) return NextResponse.json({ ok: true });

    const text: string = (message.text || '').trim();
    if (!text || text.startsWith('/')) return NextResponse.json({ ok: true });

    // Skip messages that look like the bot's own forwarded user messages
    // (they contain the 🔑 session prefix we add when sending)
    if (text.includes('🔑') && text.includes('`')) {
      console.log('[webhook] skipping own forwarded message');
      return NextResponse.json({ ok: true });
    }

    const replyToId: number | undefined = message.reply_to_message?.message_id;
    const operatorName: string = message.from?.first_name || 'Оператор';

    // 1️⃣ Try to find session via Reply mapping
    let sessionId: string | undefined = replyToId
      ? getSessionForMessage(replyToId)
      : undefined;

    // 2️⃣ Fallback: use the last active session
    //    (works when operator just sends a message without Reply)
    if (!sessionId) {
      sessionId = getLastSessionId() || undefined;
      console.log(`[webhook] no reply mapping, using lastSession: ${sessionId}`);
    }

    if (!sessionId) {
      console.log('[webhook] ⚠️ no session found, ignoring message');
      return NextResponse.json({ ok: true });
    }

    const msg: StoredMessage = {
      id: `op_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      sessionId,
      role: 'operator',
      text,
      timestamp: Date.now(),
      name: operatorName,
    };

    saveMessage(msg);
    console.log(`[webhook] ✅ saved operator reply "${text}" for session ${sessionId}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[webhook] error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// ── GET — Frontend polls for new operator messages ──────────────
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const since     = parseInt(searchParams.get('since') || '0');

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
    }

    const messages = getNewOperatorMessages(sessionId, since);
    return NextResponse.json({ messages, ok: true });
  } catch (err) {
    console.error('[webhook] poll error:', err);
    return NextResponse.json({ messages: [], ok: false });
  }
}