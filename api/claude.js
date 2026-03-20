import { buildClaudeRequest, createClaudeMessage } from './_lib/claude.js';

export const config = { runtime: 'edge' };

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed.' }, 405);
  }

  try {
    const body = await request.json();
    const payload = buildClaudeRequest(body);
    const result = await createClaudeMessage(payload);
    return json(result, 200);
  } catch (error) {
    const status = typeof error?.status === 'number' ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Claude request failed.';
    return json({ error: message }, status);
  }
}
