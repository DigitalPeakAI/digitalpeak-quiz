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
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    const response = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });

    const text = await response.text();
    let json;
    try { json = JSON.parse(text); } catch { json = { raw: text }; }

    return res.status(200).json({ ok: true, n8n: json });
  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
