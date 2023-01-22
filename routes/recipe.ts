import { Image } from "imagescript";
import { Router } from "oak";
import itemsJson from "../dist/items.json" assert { type: "json" };
import { decodeBase64Image } from "../utils/image.ts";

export const recipe = new Router();
const items = new Map(Object.entries(itemsJson));

recipe.get("/", async (ctx) => {
  const params = ctx.request.url.searchParams;

  const input = atob(params.get("input") ?? "").split(",");
  const output = atob(params.get("output") ?? "");
  const customItems = parseCustomItems(params.get("customItems") ?? "");

  const image = await createRecipeImage(input, output, customItems);

  ctx.response.headers.set("Cache-Control", "max-age=2592000");
  ctx.response.headers.set("Content-Type", "image/png");

  ctx.response.body = await image.encode();
});

function parseCustomItems(stringParam: string) {
  const params = new URLSearchParams(stringParam);
  const customItems: Record<string, string> = {};
  params.forEach((value, key) => {
    customItems[atob(key)] = value;
  });
  return customItems;
}

async function loadImage(image: string | Uint8Array) {
  if (typeof image === "string") {
    return Image.decode(await Deno.readFile(image));
  }
  return Image.decode(image);
}

async function createRecipeImage(
  inputs: string[],
  output: string,
  customItems: Record<string, string>,
) {
  const base = await loadImage("./data/base.png");

  let x = 0;
  let y = 0;
  for (const input of inputs) {
    let image: Image;
    if (input) {
      if (items.get(input)) {
        image = await loadImage(`./dist/textures/${input}.png`);
      } else if (customItems[input]) {
        image = await loadImage(decodeBase64Image(customItems[input]));
      } else {
        image = await loadImage(`./data/missing.png`);
      }

      image.fit(48, 48);
      base.composite(image, 6 + x * 54, 6 + y * 54);
    }
    if (++x % 3 === 0) {
      x = 0;
      y++;
    }
  }

  if (items.get(output)) {
    const image = await loadImage(`./dist/textures/${output}.png`);
    image.fit(48, 48);
    base.composite(image, 300, 72);
  }

  return base;
}
