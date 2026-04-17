export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const N8N_URL = 'https://n8n.srv1451390.hstgr.cloud/webhook/digitalpeak-quiz-submit';

  try {
    // Read raw body from stream (Vercel doesn't auto-parse body)
    const rawBody = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => { data += chunk.toString(); });
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });

    console.log('[submit] body preview:', rawBody.substring(0, 80));

    const response = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: rawBody,
    });

    console.log('[submit] n8n status:', response.status);

    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }

    return res.status(200).json({ ok: true, n8n: json });
  } catch (err) {
    console.error('[submit] error:', err.message);
    return res.status(200).json({ ok: false, error: err.message });
  }
}
