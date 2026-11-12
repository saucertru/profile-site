// Profile view counter for Vercel. Uses an Upstash Redis database connected in the Vercel dashboard.
// GET  /api/views -> {views}
// POST /api/views -> adds one view, returns {views}
module.exports = async (req, res) => {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  res.setHeader('Cache-Control', 'no-store');
  if (!url || !token) return res.status(503).json({ error: 'View counter database is not connected' });
  try {
    const cmd = req.method === 'POST' ? 'incr' : 'get';
    const r = await fetch(`${url}/${cmd}/profile_views`, { headers: { Authorization: `Bearer ${token}` } });
    const j = await r.json();
    res.status(200).json({ views: Number(j.result || 0) });
  } catch (e) {
    res.status(500).json({ error: 'Could not reach the database' });
  }
};
