import { cors, json, toClientMeme, toDbMeme } from './_shared.js';
import { getSupabase } from '../lib/supabase.js';
import { requireAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.statusCode = 204, res.end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method Not Allowed' });

  await requireAdmin(req);
  const supabase = getSupabase();
  const id = req.query.id;
  const { data, error } = await supabase.from('memes').select('*').eq('id', id).single();
  if (error) return json(res, 404, { error: error.message });

  const { data: updated, error: updateError } = await supabase.from('memes').update({
    heat_value: Number(data.heat_value || 0),
    last_refreshed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }).eq('id', id).select().single();
  if (updateError) return json(res, 500, { error: updateError.message });
  return json(res, 200, { success: true, data: updated, refreshed: false, refreshInfo: 'Vercel版不执行本地爬虫刷新' });
}
