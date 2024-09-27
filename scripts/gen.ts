// Generator script for dist/

import { emptyDir } from "jsr:@std/fs";
import { formatItems } from "./formatItems.ts";

await emptyDir("./dist");

const itemJson = await fetch(
  "https://unpkg.com/minecraft-textures@1.21.0/dist/textures/json/1.21.json",
).then((res) => res.json());

const items = await formatItems(itemJson);

Deno.writeTextFile("./dist/items.json", JSON.stringify(items));
