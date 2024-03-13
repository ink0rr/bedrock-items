// Generator script for dist/

import { formatItems } from "./formatItems.ts";

await Deno.remove("./dist", { recursive: true }).catch(() => {});
await Deno.mkdir("./dist/textures", { recursive: true });

const itemJson = await fetch(
  "https://unpkg.com/minecraft-textures@1.20.0/dist/textures/json/1.20.json",
).then((res) => res.json());

const items = await formatItems(itemJson);

Deno.writeTextFile("./dist/items.json", JSON.stringify(items));
