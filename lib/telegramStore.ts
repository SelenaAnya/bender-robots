// lib/telegramStore.ts
// File-based store — survives Next.js hot-reloads and module resets
// Stores data in /data/tg-sessions.json (same folder as content.json)

import fs from 'fs';
import path from 'path';

export interface StoredMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'operator';
  text: string;
  timestamp: number;
  name?: string;
}

interface StoreData {
  // sessionId → messages
  messages: Record<string, StoredMessage[]>;
  // telegram message_id (string key for JSON) → sessionId
  sessionMap: Record<string, string>;
  // last active sessionId — fallback when no reply mapping exists
  lastSessionId: string;
}

const DATA_DIR  = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'tg-sessions.json');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readStore(): StoreData {
  ensureDir();
  try {
    if (fs.existsSync(STORE_FILE)) {
      return JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));
    }
  } catch {
    // corrupted file — start fresh
  }
  return { messages: {}, sessionMap: {}, lastSessionId: '' };
}

function writeStore(data: StoreData) {
  ensureDir();
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
}

// ── Public API ──────────────────────────────────────────────────

/** Save a new message for a session */
export function saveMessage(msg: StoredMessage) {
  const store = readStore();
  if (!store.messages[msg.sessionId]) store.messages[msg.sessionId] = [];
  store.messages[msg.sessionId].push(msg);
  // track last active user session
  if (msg.role === 'user') store.lastSessionId = msg.sessionId;
  writeStore(store);
}

/** Map a Telegram message_id to a sessionId so we can route replies */
export function mapMessageToSession(telegramMsgId: number, sessionId: string) {
  const store = readStore();
  store.sessionMap[String(telegramMsgId)] = sessionId;
  store.lastSessionId = sessionId;
  writeStore(store);
  console.log(`[store] mapped msg_id ${telegramMsgId} → session ${sessionId}`);
}

/** Get sessionId for a Telegram message_id (from operator reply) */
export function getSessionForMessage(telegramMsgId: number): string | undefined {
  const store = readStore();
  return store.sessionMap[String(telegramMsgId)];
}

/** Get the last active sessionId (fallback for non-reply messages) */
export function getLastSessionId(): string {
  return readStore().lastSessionId;
}

/** Get new operator messages for a session since a timestamp */
export function getNewOperatorMessages(sessionId: string, since: number): StoredMessage[] {
  const store = readStore();
  const all = store.messages[sessionId] || [];
  return all.filter((m) => m.role === 'operator' && m.timestamp > since);
}