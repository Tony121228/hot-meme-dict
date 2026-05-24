import { cors, json } from './_shared.js';
export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.statusCode = 204, res.end();
  if (req.method === 'GET') return json(res, 200, { filtered: [] });
  if (req.method === 'DELETE') return json(res, 200, { success: true });
  return json(res, 405, { error: 'Method Not Allowed' });
}
