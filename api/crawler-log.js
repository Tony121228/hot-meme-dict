import { cors, json } from './_shared.js';
export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.statusCode = 204, res.end();
  return json(res, 200, { data: [] });
}
