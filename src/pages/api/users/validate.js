// src/pages/api/users/validate.js
export default async function handler(req, res) {
  const body = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('error', reject);
    req.on('end', () => resolve(data));
  }).then(data => JSON.parse(data));

  const { 'cf-turnstile-response': token } = body;

  try {
    const verificationResponse = await new Promise((resolve, reject) => {
      const request = https.request({
        hostname: 'challenges.cloudflare.com',
        path: '/turnstile/v0/siteverify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      }, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => resolve(JSON.parse(data)));
      });
      request.write(JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token
      }));
      request.end();
    });

    res.json({ success: verificationResponse.success });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({ success: false });
  }
}

