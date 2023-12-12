export interface Env {
  GIFT: R2Bucket;
}

interface Report {
  [key: string]: number;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PUT'
};
const allowedOrigins = ['http://localhost:4321'];

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      // Handle CORS preflight requests
      return handleOptions(request);
    }
    if (request.method === 'PUT') {
      const body = await request.json() as { id: string, reason: string };
      const reported: Report = await env.GIFT.get(body.id).then(obj => obj?.json() || {});
      reported[body.reason] = (reported[body.reason] || 0) + 1;
      await env.GIFT.put(body.id, JSON.stringify(reported));
      return new Response(null, {status: 204, headers});
    }
    return new Response(null, {status: 400});
  }
};

async function handleOptions(request: Request) {
  const origin = request.headers.get('Origin') || '';
  if (
      allowedOrigins.includes(origin) &&
      request.headers.get('Access-Control-Request-Method') !== null
  ) {

    const corsHeaders = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Max-Age': '86400',
    };

    // Handle CORS preflight requests.
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Headers': request.headers.get(
            'Access-Control-Request-Headers'
        ),
      },
    });
  } else {
    return new Response(null, {
      status: 400
    });
  }
}
