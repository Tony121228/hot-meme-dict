import { cors, json, readBody, toClientMeme, toDbMeme } from './_shared.js';
import { getSupabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.statusCode = 204, res.end();

  const supabase = getSupabase();

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('memes').select('*').eq('status', 'pending').order('submitted_at', { ascending: false });
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { total: data.length, data: data.map(toClientMeme) });
  }

  if (req.method === 'POST') {
    const body = await readBody(req);
    const payload = {
      title: body.title,
      description: body.description,
      emoji: body.emoji || '🔥',
      category: body.category || '网络流行',
      source_platform: body.sourcePlatform || "????",
      source_url: body.sourceUrl || '',
      source_name: body.sourceName || '',
      heat_value: body.heatValue || 0,
      heat_status: body.heatStatus || 'new',
      origin: body.origin || '',
      examples: body.examples || [],
      tags: body.tags || [],
      status: 'pending',
      submitter: body.submitter || '匿名用户',
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('memes').insert(payload).select().single();
    if (error) return json(res, 500, { error: error.message });
    return json(res, 201, { success: true, data: toClientMeme(data) });
  }

  return json(res, 405, { error: 'Method Not Allowed' });
}
