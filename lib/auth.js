export async function requireAdmin(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Unauthorized');
  return token;
}
