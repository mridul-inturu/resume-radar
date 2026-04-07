/**
 * AI client — Gemini 2.0 Flash (primary) with Groq LLaMA-3 (fallback on 429).
 * Both calls are made entirely in the browser via their respective REST APIs.
 */

const GEMINI_MODEL = 'gemini-2.0-flash';
const GROQ_MODEL   = 'llama-3.3-70b-versatile';

/* ── Gemini ──────────────────────────────────────────────────── */

async function callGeminiRaw(prompt: string, maxTokens: number): Promise<string> {
  const key = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  if (!key) throw Object.assign(new Error('VITE_GOOGLE_AI_API_KEY is not set in .env'), { status: 0 });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens, candidateCount: 1 },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw Object.assign(new Error(`Gemini API error ${res.status}: ${body}`), { status: res.status });
  }

  const json = await res.json();
  const text: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) throw Object.assign(new Error('Empty response from Gemini'), { status: 0 });
  return text;
}

/* ── Groq (OpenAI-compatible) ────────────────────────────────── */

async function callGroqRaw(prompt: string, maxTokens: number): Promise<string> {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new Error('Gemini quota exceeded and VITE_GROQ_API_KEY is not configured in .env');

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model:       GROQ_MODEL,
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens:  maxTokens,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new Error(`Groq API error ${res.status}: ${body}`);
  }

  const json = await res.json();
  const text: string = json.choices?.[0]?.message?.content ?? '';
  if (!text) throw new Error('Empty response from Groq');
  return text;
}

/* ── Public API ──────────────────────────────────────────────── */

/**
 * Call Gemini. On 429 / quota exhaustion automatically retries with Groq.
 */
export async function callGemini(prompt: string, maxTokens = 800): Promise<string> {
  try {
    return await callGeminiRaw(prompt, maxTokens);
  } catch (err: any) {
    const isRateLimited =
      err.status === 429 || /429|RESOURCE_EXHAUSTED|quota/i.test(String(err.message));
    if (isRateLimited) {
      console.warn('[AI] Gemini rate-limited → falling back to Groq');
      return callGroqRaw(prompt, maxTokens);
    }
    throw err;
  }
}

export async function callGeminiJSON<T>(prompt: string, maxTokens = 800): Promise<T> {
  const raw     = await callGemini(prompt, maxTokens);
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned) as T;
}
