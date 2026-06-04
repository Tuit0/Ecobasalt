// API helper — backend bilan ishlash uchun

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const fetcher = (url: string) => fetch(url).then(r => r.json());

// Lang helpers
export type Lang = 'uz' | 'ru' | 'en';

export function pickLang<T extends Record<string, any>>(obj: T | undefined | null, lang: Lang, prefix = 'name'): string {
  if (!obj) return '';
  return obj[`${prefix}_${lang}`] || obj[`${prefix}_uz`] || obj[`${prefix}_en`] || '';
}

// ContentBlocks → key->value mapga aylantirish
export function blocksToMap(blocks: any[]): Record<string, any> {
  return Object.fromEntries(blocks.map((b) => [b.key, b.value]));
}

// Tracking
export function generateSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sid = localStorage.getItem('basalt_sid');
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem('basalt_sid', sid);
  }
  return sid;
}

export function detectDevice(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone/.test(ua)) return 'mobile';
  if (/tablet|ipad/.test(ua)) return 'tablet';
  return 'desktop';
}

export async function trackPageView(path: string) {
  if (typeof window === 'undefined') return;
  const session_id = generateSessionId();
  try {
    await fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id,
        path,
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        device: detectDevice(),
        duration_sec: 0,
        utm: extractUtm(),
      }),
    });
  } catch {}
}

export async function sendHeartbeat(path: string) {
  if (typeof window === 'undefined') return;
  const session_id = generateSessionId();
  try {
    await fetch(`${API_BASE}/analytics/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id, path, device: detectDevice() }),
    });
  } catch {}
}

function extractUtm(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const [k, v] of params.entries()) {
    if (k.startsWith('utm_')) utm[k] = v;
  }
  return utm;
}
