import { NextResponse } from 'next/server';
import { getMsgStore, getSessionMap, StoredMessage } from '@/lib/telegramStore';

// POST — Telegram sends ALL bot updates here
export async function POST(request: Request) {
  try {
    const update = await request.json();
    console.log('[webhook] update:', JSON.stringify(update));

    const message = update.message || update.edited_message;
    if (!message) return NextResponse.json({ ok: true });

    const text: string = message.text || '';
    const replyToId: number | undefined = message.reply_to_message?.message_id;

    // Only process replies from operator (not commands)
    if (replyToId && text && !text.startsWith('/')) {
      const sessionId = getSessionMap().get(replyToId);
      console.log(`[webhook] reply to msg_id ${replyToId} → session: ${sessionId ?? 'NOT FOUND'}`);

      if (sessionId) {
        const msg: StoredMessage = {
          id: `op_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          sessionId,
          role: 'operator',
          text,
          timestamp: Date.now(),
          name: message.from?.first_name || 'Оператор',
        };
        const store = getMsgStore();
        store.set(sessionId, [...(store.get(sessionId) || []), msg]);
        console.log(`[webhook] ✅ saved reply for session ${sessionId}`);
      } else {
        console.log(`[webhook] ⚠️ no session mapped for msg_id ${replyToId}`);
        // Debug: show all known mappings
        console.log('[webhook] known mappings:', [...getSessionMap().entries()]);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[webhook] error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// GET — Frontend polls for new operator messages
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  const since = parseInt(searchParams.get('since') || '0');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }

  const all = getMsgStore().get(sessionId) || [];
  const messages = all.filter((m) => m.role === 'operator' && m.timestamp > since);

  return NextResponse.json({ messages, ok: true });
}