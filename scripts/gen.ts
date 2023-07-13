// Generator script for dist/

import { emptyDir } from "https://deno.land/std@0.194.0/fs/mod.ts";
import { formatItems } from "./formatItems.ts";

await emptyDir("./dist");

const itemJson = await fetch(
  "https://unpkg.com/minecraft-textures@1.20.0/dist/textures/json/1.20.json",
).then((res) => res.json());

const items = await formatItems(itemJson);

Deno.writeTextFile("./dist/items.json", JSON.stringify(items));
