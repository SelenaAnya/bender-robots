// app/api/telegram/test/route.ts
import { NextResponse } from 'next/server';
import {
  saveMessage,
  getLastSessionId,
  getNewOperatorMessages,
  StoredMessage,
} from '@/lib/telegramStore';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = process.env.TELEGRAM_BOT_TOKEN;

  // inject test operator message
  if (searchParams.get('inject') === '1') {
    const sessionId = searchParams.get('session') || getLastSessionId();
    const text      = searchParams.get('msg') || 'Тестова відповідь від оператора';
    if (!sessionId) return NextResponse.json({ error: 'No session found' });
    const msg: StoredMessage = {
      id: `op_test_${Date.now()}`,
      sessionId,
      role: 'operator',
      text,
      timestamp: Date.now(),
      name: 'Тест-оператор',
    };
    saveMessage(msg);
    return NextResponse.json({ ok: true, action: 'injected', message: msg });
  }

  // delete webhook
  if (searchParams.get('delete') === '1' && token) {
    const res  = await fetch(`https://api.telegram.org/bot${token}/deleteWebhook`, { method: 'POST' });
    const data = await res.json();
    return NextResponse.json({ action: 'deleted', result: data });
  }

  // register webhook — uses ?url=https://your-ngrok.io param if provided
  if (searchParams.get('register') === '1' && token) {
    // Priority: explicit ?url param > x-forwarded-proto+host
    const explicitUrl = searchParams.get('url');
    let webhookUrl: string;

    if (explicitUrl) {
      // Use the URL passed explicitly, strip any accidental quotes
      webhookUrl = explicitUrl.replace(/['"\\]/g, '').trim();
    } else {
      const host  = request.headers.get('host') || '';
      const proto = request.headers.get('x-forwarded-proto') || 'https';
      webhookUrl  = `${proto}://${host}/api/telegram/webhook`;
    }

    console.log('[register] webhook URL:', webhookUrl);

    const res  = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        url:                  webhookUrl,
        allowed_updates:      ['message'],
        drop_pending_updates: true,
      }),
    });
    const data = await res.json();
    return NextResponse.json({ action: 'registered', webhookUrl, result: data });
  }

  // check webhook info
  if (searchParams.get('webhook') === '1' && token) {
    const res  = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const data = await res.json();
    return NextResponse.json(data);
  }

  // status
  const STORE_FILE = path.join(process.cwd(), 'data', 'tg-sessions.json');
  let storeData: Record<string, unknown> | null = null;
  try {
    if (fs.existsSync(STORE_FILE))
      storeData = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
  } catch { /* ignore */ }

  const lastSession = getLastSessionId();
  const newMsgs     = lastSession ? getNewOperatorMessages(lastSession, 0) : [];

  let webhookInfo = null;
  if (token) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
      webhookInfo = (await r.json()).result;
    } catch { /* ignore */ }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    webhook: {
      url:             webhookInfo?.url || 'NOT SET',
      last_error:      webhookInfo?.last_error_message || null,
      pending_updates: webhookInfo?.pending_update_count ?? 0,
    },
    store: {
      last_session:      lastSession || null,
      operator_messages: newMsgs.length,
      all_sessions:      storeData
        ? Object.keys((storeData as { messages: Record<string, unknown> }).messages || {})
        : [],
    },
    HOW_TO_REGISTER: 'GET /api/telegram/test?register=1&url=https://polite-suits-smash.loca.lt',
  });
}