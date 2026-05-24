import { cors, json, readBody, toClientMeme, toDbMeme } from './_shared.js';
import { getSupabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.statusCode = 204, res.end();

  const supabase = getSupabase();
  const { q, category, minHeat, sort, id } = req.query;

  if (req.method === 'GET') {
    let query = supabase.from('memes').select('*').eq('status', 'approved');
    if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    if (category) query = query.eq('category', category);
    if (minHeat) query = query.gte('heat_value', Number(minHeat));
    if (sort === 'new') query = query.order('created_at', { ascending: false });
    else query = query.order('heat_value', { ascending: false });
    const { data, error, count } = await query;
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
      status: "approved",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from('memes').insert(payload).select().single();
    if (error) return json(res, 500, { error: error.message });
    return json(res, 201, { success: true, data: toClientMeme(data) });
  }

  if (req.method === 'PUT') {
    const body = await readBody(req);
    const memeId = req.query.id;
    const { data, error } = await supabase.from('memes').update({
      title: body.title,
      description: body.description,
      emoji: body.emoji,
      category: body.category,
      source_platform: body.sourcePlatform,
      source_url: body.sourceUrl,
      source_name: body.sourceName,
      heat_value: body.heatValue,
      heat_status: body.heatStatus,
      origin: body.origin,
      examples: body.examples,
      tags: body.tags,
      updated_at: new Date().toISOString()
    }).eq('id', memeId).select().single();
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { success: true, data: toClientMeme(data) });
  }

  if (req.method === 'DELETE') {
    const memeId = req.query.id;
    const { error } = await supabase.from('memes').delete().eq('id', memeId);
    if (error) return json(res, 500, { error: error.message });
    return json(res, 200, { success: true });
  }

  return json(res, 405, { error: 'Method Not Allowed' });
}
