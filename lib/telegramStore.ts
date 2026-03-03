// lib/telegramStore.ts
// Shared in-memory store for Telegram chat sessions
// In production: replace with Redis or a database

export interface StoredMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'operator';
  text: string;
  timestamp: number;
  name?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __tgMsgStore: Map<string, StoredMessage[]> | undefined;
  // eslint-disable-next-line no-var
  var __tgSessionMap: Map<number, string> | undefined;
}

/** sessionId → messages */
export function getMsgStore(): Map<string, StoredMessage[]> {
  if (!global.__tgMsgStore) global.__tgMsgStore = new Map();
  return global.__tgMsgStore;
}

/** telegram message_id → sessionId  (for routing operator replies) */
export function getSessionMap(): Map<number, string> {
  if (!global.__tgSessionMap) global.__tgSessionMap = new Map();
  return global.__tgSessionMap;
}