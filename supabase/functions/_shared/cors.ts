const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, ApiKey, Content-Type, X-client-info',
};

/**
 * Higher order function to automatically handle preflight requests, specifying what methods this function
 * is intended to handle, and automatically setting CORS headers for every output response.
 * appending.
 *
 * @example
 * ```ts
 *  Deno.serve(
 *    browserEndpoint({ allowMethods: 'OPTIONS, POST, GET' }, async (request) => {
 *      // The rest of your code goes here.
 *    })
 *  )
 *
 * ```
 *
 * @param { allowMethods } - String specifying the methods this edge function is allowed to receieve (i.e., 'OPTIONS, POST, GET')
 * @param callback - The original request reaching the edge function.
 * @returns - The original response with cors headers attached.
 */
export const browserEndpoint = (
  { allowMethods }: { allowMethods: string },
  callback: (request: Request) => Promise<Response>
) => {
  const headers = {
    ...corsHeaders,
    'Access-Control-Allow-Methods': allowMethods,
  };

  const allowedMethodsSet = new Set(
    allowMethods.split(',').map((method) => method.trim().toUpperCase())
  );

  return async (request: Request) => {
    if (request.method === 'OPTIONS') {
      return new Response('ok', { headers });
    }

    if (!allowedMethodsSet.has(request.method)) {
      return new Response('Method not allowed', {
        status: 405,
        headers,
      });
    }

    const response = await callback(request);

    Object.entries(headers).forEach(([header, value]) => {
      response.headers.set(header, value);
    });

    return response;
  };
};
