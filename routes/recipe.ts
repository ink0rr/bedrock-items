import { Router } from "oak";
import { Image } from "imagescript";
import itemsJson from "../dist/items.json" assert { type: "json" };

export const recipe = new Router();
const items = new Map(Object.entries(itemsJson));

recipe.get("/", async (ctx) => {
  const params = ctx.request.url.searchParams;

  const input = atob(params.get("input") ?? "").split(",");
  const output = atob(params.get("output") ?? "");

  const image = await createRecipeImage(input, output);

  ctx.response.headers.set("Cache-Control", "max-age=2592000");
  ctx.response.headers.set("Content-Type", "image/png");

  ctx.response.body = await image.encode();
});

async function loadImage(path: string) {
  return Image.decode(await Deno.readFile(path));
}

async function createRecipeImage(inputs: string[], output: string) {
  const base = await loadImage("./data/base.png");

  let x = 0;
  let y = 0;
  for (const input of inputs) {
    if (items.get(input)) {
      const image = await loadImage(`./dist/textures/${input}.png`);
      image.scale(1.5);
      base.composite(image, 6 + x * 54, 6 + y * 54);
    }
    if (++x % 3 === 0) {
      x = 0;
      y++;
    }
  }

  if (items.get(output)) {
    const image = await loadImage(`./dist/textures/${output}.png`);
    image.scale(1.5);
    base.composite(image, 300, 72);
  }

  return base;
}
