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
  const items = itemsJson.items
    .filter((item) => !bedrock.ignore.includes(item.id))
    .map(({ id, readable, texture }): Item => {
      const _id = id.split(":")[1];
      textures[_id] = texture;

      return {
        _id,
        readable,
        identifier: bedrock.conversions[id]?.id ?? id,
        data: bedrock.conversions[id]?.data,
      };
    });

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

for (const { _id } of items) {
  Deno.writeFile(
    `./dist/textures/${_id}.png`,
    decode(textures[_id].split(",")[1]),
  );
}

Deno.writeTextFile("./dist/items.json", JSON.stringify(items));
