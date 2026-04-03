import { Anthropic } from '@anthropic-ai/sdk';
import { cacheService } from '../../../lib/cache';
import { SEC_RESEARCH_SYSTEM_PROMPT } from '../../../lib/systemPrompts';
import crypto from 'crypto';


const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, messages = [], maxTokens = 4096, temperature = 0.2, frameworks = [] } = body;

    if (!prompt && (!messages || messages.length === 0)) {
      return new Response(JSON.stringify({ error: 'Missing prompt or messages' }), { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({
        text: 'API Key not configured. This is a fallback response from the local development server simulating the Copilot.'
      }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    }

    // 1. Generate Cache Key based on the exact payload and configuration
    const payloadSignature = JSON.stringify({ prompt, messages });
    const hash = crypto.createHash('sha256').update(`${payloadSignature}-${maxTokens}-${temperature}`).digest('hex');
    const cacheKey = `ai-cache:${hash}`;

    // 2. Check Vercel KV Cache
    const cachedResponse = await cacheService.get<string>(cacheKey);
    if (cachedResponse) {
      return new Response(JSON.stringify({ text: cachedResponse, cached: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let kbContext = '';
    if (frameworks.includes('IFRS')) {
      try { kbContext += '\nIFRS Context: ' + require('../../../data/standards/ifrs-kb.json').standards.map((s:any)=>`${s.id}: ${s.keyDifferences.join(' ')}`).join('\n'); } catch (e) {}
    }
    if (frameworks.includes('Ind AS')) {
      try { kbContext += '\nInd AS Context: ' + require('../../../data/standards/ind-as-kb.json').standards.map((s:any)=>`${s.id}: ${s.keyDifferences.join(' ')}`).join('\n'); } catch (e) {}
    }

    const apiMessages = messages.length > 0 ? messages : [{ role: 'user', content: prompt }];
    if (kbContext && apiMessages.length > 0) {
      apiMessages[apiMessages.length - 1].content += `\n\nCross-Framework Considerations:${kbContext}`;
    }

    const isComplex = frameworks.length > 0;
    const modelTemperature = isComplex ? 1 : temperature;

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: isComplex ? 8192 : maxTokens,
      ...(isComplex ? { thinking: { type: 'enabled', budget_tokens: 4000 } } : {}),
      temperature: modelTemperature,
      // Prompt caching: system prompt cached at Anthropic for 90% input token discount
      system: [{
        type: 'text',
        text: SEC_RESEARCH_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      }],
      messages: apiMessages,
    });

    const textPayload = msg.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // 4. Save to Cache (store text for 7 days if deterministic enough)
    const ttlSeconds = temperature < 0.3 ? 604800 : 3600; // 7 days for temp < 0.3, else 1 hour
    await cacheService.set(cacheKey, textPayload, { ex: ttlSeconds });

    return new Response(JSON.stringify({ text: textPayload, cached: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Claude API Route Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
