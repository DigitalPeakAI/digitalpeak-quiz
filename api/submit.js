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

  console.log('[submit] received POST request');

  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    console.log('[submit] forwarding to n8n:', N8N_URL);

    const response = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
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
