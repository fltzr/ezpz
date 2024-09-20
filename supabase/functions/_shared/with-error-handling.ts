export const withErrorHandling = (handler: (request: Request) => Promise<Response>) => {
  return async (request: Request) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  };
};
