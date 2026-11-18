// Netlify Serverless Function for Portfolio Chatbot
// Proxies AI chat completions without requiring visitors to create accounts or sign in.
// Supports Groq (Free), Gemini (Free), OpenAI, or Puter.

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const { messages } = await req.json();

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const puterToken = process.env.PUTER_AUTH_TOKEN || process.env.VITE_PUTER_AUTH_TOKEN;

    let endpoint = "";
    let headers = { "Content-Type": "application/json" };
    let body = {};

    if (groqKey) {
      // Groq: Generous free tier, ultra-fast responses
      endpoint = "https://api.groq.com/openai/v1/chat/completions";
      headers["Authorization"] = `Bearer ${groqKey}`;
      body = {
        model: "openai/gpt-oss-120b",
        messages
      };
    } else if (geminiKey) {
      // Google Gemini: Generous free tier
      endpoint = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
      headers["Authorization"] = `Bearer ${geminiKey}`;
      body = {
        model: "gemini-1.5-flash",
        messages
      };
    } else if (openaiKey) {
      // OpenAI
      endpoint = "https://api.openai.com/v1/chat/completions";
      headers["Authorization"] = `Bearer ${openaiKey}`;
      body = {
        model: "gpt-4o-mini",
        messages
      };
    } else if (puterToken) {
      // Puter (requires paid subscription for server-side API access)
      endpoint = "https://api.puter.com/puterai/openai/v1/chat/completions";
      headers["Authorization"] = `Bearer ${puterToken}`;
      body = {
        model: "gpt-4o-mini",
        messages
      };
    } else {
      return new Response(
        JSON.stringify({
          error: "No AI API key found. Please set GROQ_API_KEY or GEMINI_API_KEY in environment variables."
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI provider error:", response.status, errText);
      return new Response(
        JSON.stringify({ error: "AI provider error", status: response.status, details: errText }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const config = {
  path: "/api/chat"
};
