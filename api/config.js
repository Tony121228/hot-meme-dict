import { cors, json } from './_shared.js';

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.statusCode = 204, res.end();
  if (req.method !== 'GET') return json(res, 405, { error: 'Method Not Allowed' });
  return json(res, 200, {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
  });
}
