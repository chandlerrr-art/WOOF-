import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

function validateSupabaseConfig(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url && !key) return;
  if (!url || !key) {
    throw new Error('Set both VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, or leave both unset for local demo mode.');
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error('VITE_SUPABASE_URL must be the project API URL, not a dashboard URL.');
  }
  if (
    parsedUrl.protocol !== 'https:'
    || !/^[a-z0-9-]+\.supabase\.co$/i.test(parsedUrl.hostname)
    || !['', '/'].includes(parsedUrl.pathname)
    || parsedUrl.username
    || parsedUrl.password
    || parsedUrl.search
    || parsedUrl.hash
  ) {
    throw new Error('VITE_SUPABASE_URL must look like https://<project-ref>.supabase.co.');
  }

  if (key.startsWith('sb_secret_')) {
    throw new Error('VITE_SUPABASE_ANON_KEY must never contain a Supabase secret key. Use a publishable or anon key.');
  }

  if (key.startsWith('sb_publishable_')) return;

  const segments = key.split('.');
  if (segments.length === 3) {
    let payload;
    try {
      payload = JSON.parse(Buffer.from(segments[1], 'base64url').toString('utf8'));
    } catch {
      throw new Error('VITE_SUPABASE_ANON_KEY must be a valid Supabase publishable or anon key.');
    }
    if (payload.role === 'anon') return;
    if (payload.role === 'service_role') {
      throw new Error('VITE_SUPABASE_ANON_KEY must never contain a service-role key.');
    }
  }
  throw new Error('VITE_SUPABASE_ANON_KEY must be a Supabase publishable key or legacy anon key.');
}

export default defineConfig(({ mode }) => {
  validateSupabaseConfig(loadEnv(mode, process.cwd(), ''));
  return {
    base: '/WOOF-/',
    plugins: [react()],
  };
})
