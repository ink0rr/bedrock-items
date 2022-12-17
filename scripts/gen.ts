// Generator script for dist/

import { decode } from "std/encoding/base64.ts";
import { BedrockConversion } from "../types/BedrockConversion.ts";
import { Item } from "../types/Item.ts";

// Format for the fetched items data
interface ItemsJson {
  items: {
    readable: string;
    id: string;
    texture: string;
  }[];
}

async function formatItems(itemsJson: ItemsJson) {
  const json = await import("../data/bedrockConversion.json", {
    assert: { type: "json" },
  });
  const bedrock = json.default as BedrockConversion;

  const textures: Record<string, string> = {};
  const items: Record<string, Item> = {};

  for (const item of itemsJson.items) {
    if (bedrock.ignore.includes(item.id)) continue;

    const id = item.id.split(":")[1];
    textures[id] = item.texture;

    items[id] = {
      name: item.readable,
      identifier: bedrock.conversions[item.id]?.id ?? item.id,
      data: bedrock.conversions[item.id]?.data,
    };
  }

  return {
    items,
    textures,
  };
}

await Deno.remove("./dist", { recursive: true });
await Deno.mkdir("./dist/textures", { recursive: true });

const itemJson = await fetch(
  "https://unpkg.com/minecraft-textures@1.19.0/dist/textures/json/1.19.json",
).then((res) => res.json());

const { items, textures } = await formatItems(itemJson);

for (const id in items) {
  Deno.writeFile(
    `./dist/textures/${id}.png`,
    decode(textures[id].split(",")[1]),
  );
}

Deno.writeTextFile("./dist/items.json", JSON.stringify(items));
