import { Router } from "oak";
import { Item } from "../types/Item.ts";

export const items = new Router();

items.get("/", async (ctx) => {
  ctx.response.body = await getItems();
});

items.get("/:id", async (ctx) => {
  const { id } = ctx.params;
  const items = await getItems();

  const item = items.find((item) => item._id === id);
  if (!item) {
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = item;
});

items.get("/:id/texture", async (ctx) => {
  const { id } = ctx.params;
  const items = await getItems();

  const item = items.find((item) => item._id === id);
  if (!item) {
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = await Deno.readFile(`./dist/textures/${id}.png`);
});

async function getItems(): Promise<Item[]> {
  const json = await import("../dist/items.json", {
    assert: { type: "json" },
  });
  return json.default;
}
