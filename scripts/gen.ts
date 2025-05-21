// Generator script for dist/

import { formatItems } from "./formatItems.ts";
import { decodeBase64Image } from "./image.ts";

await Deno.remove("./dist", { recursive: true }).catch(() => {});
await Deno.mkdir("./dist/textures", { recursive: true });

const itemJson = await fetch(
  "https://unpkg.com/minecraft-textures@1.21.4/dist/textures/json/1.21.4.json",
).then((res) => res.json());

const { items, textures } = await formatItems(itemJson);

for (const id in items) {
  Deno.writeFile(`./dist/textures/${id}.png`, decodeBase64Image(textures[id]));
}

Deno.writeTextFile("./dist/items.json", JSON.stringify(items));
