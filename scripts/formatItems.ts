import { readJson } from "../utils/json.ts";

// Format for the fetched items data
interface ItemsJson {
  items: {
    readable: string;
    id: string;
    texture: string;
  }[];
}

interface BedrockConversion {
  conversions: {
    [key: string]: {
      id: string;
      data?: number;
    };
  };
  ignore: string[];
}

interface Item {
  name: string;
  identifier: string;
  data?: number;
  texture: string;
}

export async function formatItems(itemsJson: ItemsJson) {
  const bedrock = await readJson<BedrockConversion>("./data/bedrockConversion.json");
  const items: Record<string, Item> = {};

  for (const item of itemsJson.items) {
    if (bedrock.ignore.includes(item.id)) continue;

    const id = item.id.split(":")[1];
    items[id] = {
      name: item.readable,
      identifier: bedrock.conversions[item.id]?.id ?? item.id,
      data: bedrock.conversions[item.id]?.data,
      texture: item.texture,
    };
  }

  return items;
}
