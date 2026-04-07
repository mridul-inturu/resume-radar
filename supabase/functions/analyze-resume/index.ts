import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. You provide highly specific, actionable resume feedback based on a given job description.

You MUST return valid JSON matching this exact schema:

{
  "resumeKeywords": {
    "technicalSkills": ["string"],
    "softSkills": ["string"],
    "tools": ["string"],
    "roleKeywords": ["string"]
  },
  "jdKeywords": {
    "technicalSkills": ["string"],
    "softSkills": ["string"],
    "tools": ["string"],
    "roleKeywords": ["string"]
  },
  "matchScore": {
    "score": number (0-100),
    "keywordOverlap": "specific explanation",
    "skillRelevance": "specific explanation",
    "experienceAlignment": "specific explanation"
  },
  "gaps": [
    { "keyword": "string", "reason": "why this matters for the JD" }
  ],
  "sectionFeedback": [
    {
      "section": "Summary|Skills|Experience|Projects|Education",
      "strength": "specific strength found",
      "weakness": "specific weakness found",
      "action": "exact action to take with example"
    }
  ],
  "atsSimulation": {
    "detectedKeywords": ["keywords ATS would find"],
    "missedKeywords": [
      { "keyword": "string", "reason": "why ATS missed it - phrasing, placement, or synonym issue" }
    ]
  },
  "rewriteSuggestions": [
    {
      "original": "exact bullet from resume",
      "improved": "ATS-optimized rewrite preserving truthfulness",
      "explanation": "what changed and why"
    }
  ]
}

Rules:
- Score must reflect genuine keyword match and relevance, not be generous
- Feedback must reference SPECIFIC content from the resume, never be generic
- Rewrite suggestions must preserve truth - never add skills the candidate doesn't have
- Use action verbs and measurable outcomes in rewrites
- Identify at least 3 gaps and 3 rewrite suggestions
- Analyze all resume sections present (Summary, Skills, Experience, Projects, Education)
- For ATS simulation, explain WHY keywords might be missed (synonyms, phrasing, placement)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return new Response(
        JSON.stringify({ error: "Resume text and job description are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    const userPrompt = `Analyze this resume against the job description.

=== RESUME ===
${resumeText}

=== JOB DESCRIPTION ===
${jobDescription}

Return ONLY valid JSON matching the schema. No markdown, no code blocks, just raw JSON.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              { text: userPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 4000,
          candidateCount: 1,
          stopSequences: ["```"]
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 403) {
        return new Response(
          JSON.stringify({ error: "API key invalid or quota exceeded. Check your Google AI API key." }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("Google AI error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const aiResponse = await response.json();
    const content = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("Invalid Google AI response:", aiResponse);
      throw new Error("No content in AI response");
    }

    // Parse JSON from response, handling potential markdown wrapping
    let parsed;
    try {
      // Google AI might return JSON directly or wrapped in markdown
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (error) {
      console.error("Failed to parse AI response:", content);
      console.error("Parse error:", error);
      throw new Error("Failed to parse analysis results: " + error.message);
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
