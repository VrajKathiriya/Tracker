import { createClient, SupabaseClient } from '@supabase/supabase-js';

let runtimeUrl: string | null = null;
let runtimeKey: string | null = null;
let cachedClient: SupabaseClient | null = null;
let lastUrl: string | null = null;
let lastKey: string | null = null;

export function setRuntimeCredentials(url: string | null, key: string | null) {
  runtimeUrl = url;
  runtimeKey = key;
  cachedClient = null;
}

// Retrieve credentials from runtime, process.env, or browser localStorage
export function getSupabaseCredentials(): { url: string | null; key: string | null } {
  if (runtimeUrl && runtimeKey) {
    return { url: runtimeUrl, key: runtimeKey };
  }

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

export async function ensureSupabaseConfig(): Promise<void> {
  const current = getSupabaseCredentials();
  if (current.url && current.key) return;

  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data.url && data.key) {
          setRuntimeCredentials(data.url, data.key);
        }
      }
    } catch (err) {
      console.warn('Could not fetch server config from /api/config:', err);
    }
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}

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

export type SupabaseHealthStatus = 'connected' | 'permission_denied' | 'not_configured' | 'error';

export interface HealthCheckResult {
  status: SupabaseHealthStatus;
  message?: string;
  hint?: string;
}

export async function checkSupabaseHealth(): Promise<HealthCheckResult> {
  if (!isSupabaseConfigured()) {
    return { status: 'not_configured', message: 'Supabase credentials not configured' };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { status: 'error', message: 'Failed to create Supabase client' };
  }

  try {
    const { data, error } = await client
      .from('study_sessions')
      .select('id')
      .limit(1);

    if (!error) {
      return { status: 'connected', message: 'Connected to Supabase PostgreSQL database' };
    }

    if (error.code === '42501' || error.message?.toLowerCase().includes('permission denied')) {
      return {
        status: 'permission_denied',
        message: 'Permission denied (42501): PostgreSQL table privileges not granted to anon role.',
        hint: error.hint || 'GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;'
      };
    }

    return { status: 'error', message: error.message };
  } catch (err: any) {
    return { status: 'error', message: err?.message || 'Unexpected connection error' };
  }
}

