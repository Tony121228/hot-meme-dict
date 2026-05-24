import { cors, json, toClientMeme, toDbMeme } from './_shared.js';
import { getSupabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.statusCode = 204, res.end();
  if (req.method !== 'POST') return json(res, 405, { error: 'Method Not Allowed' });

  const supabase = getSupabase();
  const id = req.query.id;
  const { data, error } = await supabase.from('memes').update({
    status: 'approved',
    updated_at: new Date().toISOString()
  }).eq('id', id).select().single();
  if (error) return json(res, 500, { error: error.message });
  return json(res, 200, { success: true, data: toClientMeme(data) });
}
