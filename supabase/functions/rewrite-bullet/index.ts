import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bulletPoint, jobDescription } = await req.json();

    if (!bulletPoint || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Bullet point and job description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    const prompt = `You are an expert resume writer and ATS optimization specialist.

Rewrite the following resume bullet point to be stronger, more impactful, and optimized for the given job description.

Rules:
- Preserve truthfulness — never add skills or achievements the candidate didn't have
- Start with a strong action verb
- Add measurable outcomes or quantifiable results where the original implies them
- Incorporate relevant keywords from the job description naturally
- Keep it concise (1-2 lines max)
- Do NOT invent specific numbers if none are implied

=== ORIGINAL BULLET POINT ===
${bulletPoint}

=== JOB DESCRIPTION (for keyword context) ===
${jobDescription.substring(0, 1500)}

Return ONLY valid JSON with this exact structure, no markdown:
{
  "improved": "the rewritten bullet point",
  "explanation": "2-3 sentence explanation of what changed and why it's stronger",
  "keywordsAdded": ["keyword1", "keyword2"]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 500,
            candidateCount: 1,
            stopSequences: ["```"],
          },
        }),
      }
    );

    if (!response.ok) {
      const t = await response.text();
      console.error("Google AI error:", response.status, t);
      throw new Error("AI rewrite failed");
    }

    const aiResponse = await response.json();
    const content = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("No content in AI response");
    }

    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("rewrite-bullet error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
