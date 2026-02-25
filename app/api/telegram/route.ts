// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const { message, name } = await request.json();

//     const token = process.env.TELEGRAM_BOT_TOKEN;
//     const chatId = process.env.TELEGRAM_CHAT_ID;

//     // Детальне логування для дебагу
//     console.log('=== TELEGRAM DEBUG ===');
//     console.log('TOKEN exists:', !!token);
//     console.log('TOKEN value:', token ? `${token.substring(0, 10)}...` : 'MISSING');
//     console.log('CHAT_ID:', chatId || 'MISSING');
//     console.log('Message:', message);
//     console.log('Name:', name);
//     console.log('======================');

//     if (!token || !chatId) {
//       console.error('❌ Missing env variables!');
//       return NextResponse.json(
//         { error: 'Telegram not configured', details: { token: !!token, chatId: !!chatId } },
//         { status: 500 }
//       );
//     }

//     const text = name?.trim()
//       ? `👤 *${name.trim()}*\n\n${message}`
//       : message;

//     const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
//     console.log('Calling Telegram URL:', telegramUrl.replace(token, 'TOKEN_HIDDEN'));

//     const res = await fetch(telegramUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         chat_id: chatId,
//         text,
//         parse_mode: 'Markdown',
//       }),
//     });

//     const data = await res.json();
//     console.log('Telegram API response:', JSON.stringify(data, null, 2));

//     if (!data.ok) {
//       console.error('❌ Telegram API error:', data);
//       return NextResponse.json(
//         { error: 'Telegram API error', details: data },
//         { status: 500 }
//       );
//     }

//     console.log('✅ Message sent successfully!');
//     return NextResponse.json({ success: true });

//   } catch (error) {
//     console.error('❌ Route error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error', details: String(error) },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    token: process.env.TELEGRAM_BOT_TOKEN ? 
      process.env.TELEGRAM_BOT_TOKEN.substring(0, 15) + '...' : 
      'MISSING',
    chatId: process.env.TELEGRAM_CHAT_ID || 'MISSING',
  });
}

export async function POST(request: Request) {
  const { message, name } = await request.json();
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ error: 'Missing env', token: !!token, chatId: !!chatId }, { status: 500 });
  }

  const text = name?.trim() ? `👤 *${name.trim()}*\n\n${message}` : message;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });

  const data = await res.json();
  
  // Повертаємо повну відповідь від Telegram для дебагу
  return NextResponse.json(data, { status: data.ok ? 200 : 500 });
}