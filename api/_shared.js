export function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export function cors(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function toClientMeme(row) {
  if (!row) return row;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    emoji: row.emoji,
    category: row.category,
    sourcePlatform: row.source_platform,
    sourceUrl: row.source_url,
    sourceName: row.source_name,
    heatValue: row.heat_value,
    heatStatus: row.heat_status,
    origin: row.origin,
    examples: row.examples || [],
    tags: row.tags || [],
    status: row.status,
    submitter: row.submitter,
    submittedAt: row.submitted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastRefreshedAt: row.last_refreshed_at,
    rejectReason: row.reject_reason,
    crossPlatform: row.cross_platform,
    crossPlatformList: row.cross_platform_list,
    rawStats: row.raw_stats
  };
}

export function toDbMeme(body = {}, defaults = {}) {
  return {
    title: body.title || defaults.title || '',
    description: body.description || defaults.description || '',
    emoji: body.emoji || defaults.emoji || '??',
    category: body.category || defaults.category || '????',
    source_platform: body.sourcePlatform || defaults.source_platform || '????',
    source_url: body.sourceUrl || defaults.source_url || '',
    source_name: body.sourceName || defaults.source_name || '',
    heat_value: body.heatValue ?? defaults.heat_value ?? 0,
    heat_status: body.heatStatus || defaults.heat_status || 'new',
    origin: body.origin || defaults.origin || '',
    examples: body.examples || defaults.examples || [],
    tags: body.tags || defaults.tags || [],
    status: body.status || defaults.status || 'approved',
    submitter: body.submitter || defaults.submitter || '',
    submitted_at: body.submittedAt || defaults.submitted_at || null,
    created_at: body.createdAt || defaults.created_at || new Date().toISOString(),
    updated_at: body.updatedAt || defaults.updated_at || new Date().toISOString(),
    last_refreshed_at: body.lastRefreshedAt || defaults.last_refreshed_at || null,
    reject_reason: body.rejectReason || defaults.reject_reason || '',
    cross_platform: body.crossPlatform || defaults.cross_platform || null,
    cross_platform_list: body.crossPlatformList || defaults.cross_platform_list || null,
    raw_stats: body.rawStats || defaults.raw_stats || null
  };
}
