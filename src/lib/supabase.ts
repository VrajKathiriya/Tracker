import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve credentials from process.env or browser localStorage
export function getSupabaseCredentials(): { url: string | null; key: string | null } {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (envUrl && envKey && !envUrl.includes('your-project')) {
    return { url: envUrl, key: envKey };
  }

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem('tracker_supabase_url');
    const localKey = localStorage.getItem('tracker_supabase_key');
    if (localUrl && localKey) {
      return { url: localUrl, key: localKey };
    }
  }

  return { url: null, key: null };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}

let cachedClient: SupabaseClient | null = null;
let lastUrl: string | null = null;
let lastKey: string | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key) return null;

  if (cachedClient && lastUrl === url && lastKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key);
    lastUrl = url;
    lastKey = key;
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}
