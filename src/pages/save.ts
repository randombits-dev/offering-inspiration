import type {APIRoute} from "astro";

export const prerender = false;
export async const POST: APIRoute = ({request}) => {
  const body = request.json();
  if (body.buyable) {

  }
  return new Response(JSON.stringify({
        message: "This was a POST!"
      })
  );
};
