const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const DEFAULT_MAX_TOKENS = 2048;
const DEFAULT_TEMPERATURE = 0.2;

function createHttpError(message, status = 500) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function clampNumber(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function clampInteger(value, fallback, min, max) {
  return Math.round(clampNumber(value, fallback, min, max));
}

export function buildClaudeRequest(body) {
  const payload = body && typeof body === 'object' ? body : {};
  const prompt = typeof payload.prompt === 'string' ? payload.prompt.trim() : '';

  if (!prompt) {
    throw createHttpError('A non-empty prompt is required.', 400);
  }

  return {
    prompt,
    system: typeof payload.system === 'string' && payload.system.trim() ? payload.system.trim() : undefined,
    maxTokens: clampInteger(payload.maxTokens, DEFAULT_MAX_TOKENS, 256, 4096),
    temperature: clampNumber(payload.temperature, DEFAULT_TEMPERATURE, 0, 1),
  };
}

export function getClaudeModel() {
  return process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
}

export function getClaudeApiKey() {
  return process.env.ANTHROPIC_API_KEY || '';
}

export async function createClaudeMessage({ prompt, system, maxTokens = DEFAULT_MAX_TOKENS, temperature = DEFAULT_TEMPERATURE }) {
  const apiKey = getClaudeApiKey();

  if (!apiKey) {
    throw createHttpError('Claude API unavailable. Add ANTHROPIC_API_KEY to your environment.', 500);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: getClaudeModel(),
      max_tokens: maxTokens,
      temperature,
      system,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || 'Claude request failed.';
    throw createHttpError(message, response.status || 500);
  }

  const text = Array.isArray(data?.content)
    ? data.content
        .filter(block => block?.type === 'text' && typeof block.text === 'string')
        .map(block => block.text.trim())
        .filter(Boolean)
        .join('\n\n')
        .trim()
    : '';

  if (!text) {
    throw createHttpError('Claude returned an empty response.', 502);
  }

  return {
    text,
    model: data?.model || getClaudeModel(),
  };
}
