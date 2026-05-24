import { cors, json } from './_shared.js';
import { getSupabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.statusCode = 204, res.end();
  if (req.method !== 'GET') return json(res, 405, { error: 'Method Not Allowed' });

  const supabase = getSupabase();
  const [{ count: total }, { count: pending }, { data: categories }] = await Promise.all([
    supabase.from('memes').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('memes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('memes').select('category').eq('status', 'approved')
  ]);

  return json(res, 200, {
    total: total || 0,
    active: total || 0,
    filtered_out: 0,
    pending: pending || 0,
    last_crawl: null,
    categories: new Set((categories || []).map(x => x.category).filter(Boolean)).size
  });
}
