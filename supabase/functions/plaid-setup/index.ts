// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import type { Database } from "../../../src/supabase.d.ts";

const PLAID_BASE_URL = "https://development.plaid.com";

const PLAID_CLIENT_ID = Deno.env.get("PLAID_CLIENT_ID") || "";
const PLAID_SECRET = Deno.env.get("PLAID_SECRET") || "";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
  "";

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  throw new Error("Required Plaid credentials are not set.");
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Required Supabase credentials are not set.");
}

const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
);

// deno-lint-ignore no-explicit-any
const plaidRequest = async (endpoint: string, body: Record<string, any>) => {
  const response = await fetch(`${PLAID_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: PLAID_CLIENT_ID,
      secret: PLAID_SECRET,
      ...body,
    }),
  });

  if (!response.ok) {
    const error = await response.json();

    console.error("Plaid API request failed: ", error);
    throw new Error("Plaid API request failed: ", error);
  }

  return await response.json();
};

const getUserIdFromRequest = async (request: Request) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    throw new Error("Error fetching user credentials: ", error ?? undefined);
  }

  return data.user.id;
};

Deno.serve(async (request) => {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const userId = await getUserIdFromRequest(request);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    if (pathname === "/create-link-token" && method === "GET") {
      const linkTokenResponse = await plaidRequest("/link/token/create", {
        user: { client_user_id: userId },
        client_name: "ezpz",
        products: ["auth", "transactions"],
        country_codes: ["US"],
        language: "en",
      });

      return new Response(JSON.stringify(linkTokenResponse), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    if (pathname === "exchange-public-token" && method === "POST") {
      const requestBody = await request.json();
      const { public_token: publicToken } = requestBody;

      if (!publicToken) {
        return new Response(
          JSON.stringify({ error: "Missing public_token in request body." }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const exchangeTokenResponse = await plaidRequest(
        "/item/public_token/exchange",
        {
          public_token: publicToken,
        },
      );

      const accessToken = exchangeTokenResponse.access_token;
      const itemId = exchangeTokenResponse.item_id;

      const { error } = await supabase.from("plaid_tokens").insert({
        user_id: userId,
        access_token: accessToken,
        item_id: itemId,
      });

      if (error) {
        console.error("Database Insert Error:", error);
        return new Response(
          JSON.stringify({ error: "Failed to store tokens in database." }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          },
        );
      }

      return new Response(JSON.stringify({ status: "success" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/plaid-setup' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
