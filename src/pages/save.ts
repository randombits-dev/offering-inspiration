import type {APIRoute} from "astro";
import fs from "fs-extra";

export const prerender = false;

interface Body {
    buyable?: string[];
    non?: string[];
    bad?: string[];
}

export const POST: APIRoute = async ({request}) => {
  const body: Body = await request.json();
  if (body.buyable && body.buyable.length > 0) {
    const existing = JSON.parse(fs.readFileSync('src/data/buyable.json', 'utf8'));
    const newBuyable = [...existing, ...body.buyable];
    fs.writeFileSync('src/data/buyable.json', JSON.stringify(newBuyable));
  }
  if (body.non && body.non.length > 0) {
    const existing = JSON.parse(fs.readFileSync('src/data/not.json', 'utf8'));
    const newNon = [...existing, ...body.non];
    fs.writeFileSync('src/data/not.json', JSON.stringify(newNon));
  }
    if (body.bad && body.bad.length > 0) {
        const existing = JSON.parse(fs.readFileSync('src/data/bad.json', 'utf8'));
        const newBad = [...existing, ...body.bad];
        fs.writeFileSync('src/data/bad.json', JSON.stringify(newBad));
    }
  return new Response(null, {status: 204});
};
