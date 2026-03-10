// lib/telegramStore.ts
// ── In-memory store with file fallback for local dev ──────────
// On Vercel: uses global variables (survives warm invocations)
// On local:  also uses global variables (survives hot reloads)

export interface StoredMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'operator' | 'system';
  text: string;
  timestamp: number;
  name?: string;
}

interface StoreShape {
  messages: Record<string, StoredMessage[]>;   // sessionId → messages
  sessionMap: Record<string, string>;          // telegramMsgId → sessionId
  lastSessionId: string;
}

// ── Global singleton ───────────────────────────────────────────
declare global {
  // eslint-disable-next-line no-var
  var __tgStore: StoreShape | undefined;
}

function getStore(): StoreShape {
  if (!global.__tgStore) {
    global.__tgStore = {
      messages:      {},
      sessionMap:    {},
      lastSessionId: '',
    };

    // Try to seed from file on local dev (best-effort)
    try {
      const fs   = require('fs')   as typeof import('fs');
      const path = require('path') as typeof import('path');
      const file = path.join(process.cwd(), 'data', 'tg-sessions.json');
      if (fs.existsSync(file)) {
        const raw = JSON.parse(fs.readFileSync(file, 'utf-8'));
        if (raw.messages)      global.__tgStore.messages      = raw.messages;
        if (raw.sessionMap)    global.__tgStore.sessionMap    = raw.sessionMap;
        if (raw.lastSessionId) global.__tgStore.lastSessionId = raw.lastSessionId;
      }
    } catch { /* not available on Vercel — fine */ }
  }
  return global.__tgStore;
}

// Best-effort persist to file (local dev only)
function tryPersist(store: StoreShape) {
  try {
    const fs   = require('fs')   as typeof import('fs');
    const path = require('path') as typeof import('path');
    const dir  = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'tg-sessions.json'),
      JSON.stringify(store, null, 2),
    );
  } catch { /* Vercel read-only fs — ignore */ }
}

// ── Public API ─────────────────────────────────────────────────

export function saveMessage(msg: StoredMessage): void {
  const store = getStore();
  if (!store.messages[msg.sessionId]) store.messages[msg.sessionId] = [];
  if (!store.messages[msg.sessionId].find(m => m.id === msg.id)) {
    store.messages[msg.sessionId].push(msg);
  }
  if (msg.role === 'user') {
    store.lastSessionId = msg.sessionId;
  }
  tryPersist(store);
}

export function mapMessageToSession(telegramMsgId: number, sessionId: string): void {
  const store = getStore();
  store.sessionMap[String(telegramMsgId)] = sessionId;
  store.lastSessionId = sessionId;
  tryPersist(store);
}

export function getSessionForMessage(telegramMsgId: number): string | undefined {
  return getStore().sessionMap[String(telegramMsgId)];
}

export function getLastSessionId(): string {
  return getStore().lastSessionId;
}

export function getNewOperatorMessages(sessionId: string, since: number): StoredMessage[] {
  const store = getStore();
  const msgs  = store.messages[sessionId] || [];
  return msgs.filter(m => m.role === 'operator' && m.timestamp > since);
}

export function getStoreSnapshot(): StoreShape {
  return getStore();
}