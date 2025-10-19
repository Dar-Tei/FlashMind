export default {
  async fetch(request, env) {
    // The API key is taken from Environment Variables
    const GEMINI_API_KEY = env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return new Response("API key not configured", { 
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      });
    }
    
    // Preflight processing (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Basic logic
    const url = new URL(request.url);
    const target = url.searchParams.get("quest");

    if (!target) {
      return new Response("Missing quest parameter", { status: 400 });
    }

    // Checking if this is a request to the Gemini API
    if (target.includes("generativelanguage.googleapis.com")) {
      // Додаємо API ключ до URL
      const targetUrl = new URL(target);
      targetUrl.searchParams.set("key", GEMINI_API_KEY);
      
      const init = {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
        },
        body:
          request.method !== "GET" && request.method !== "HEAD"
            ? await request.text()
            : undefined,
      };

      try {
        const response = await fetch(targetUrl.toString(), init);

        const headers = new Headers(response.headers);
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type");

        return new Response(await response.text(), {
          status: response.status,
          headers,
        });
      } catch (err) {
        return new Response("Proxy error: " + err.message, {
          status: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    // For other queries - old logic
    const init = {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
      },
      body:
        request.method !== "GET" && request.method !== "HEAD"
          ? await request.text()
          : undefined,
    };

    try {
      const response = await fetch(target, init);

      const headers = new Headers(response.headers);
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      headers.set("Access-Control-Allow-Headers", "Content-Type");

      return new Response(await response.text(), {
        status: response.status,
        headers,
      });
    } catch (err) {
      return new Response("Proxy error: " + err.message, {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  },
};