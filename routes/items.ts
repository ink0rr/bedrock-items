import { Router } from "oak";
import itemsJson from "../dist/items.json" assert { type: "json" };

export const items = new Router();
const itemMap = new Map(Object.entries(itemsJson));

items.get("/", (ctx) => {
  ctx.response.body = itemsJson;
});

items.get("/:id", (ctx) => {
  const { id } = ctx.params;

  const item = itemMap.get(id);
  if (!item) {
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = item;
});

items.get("/:id/texture", async (ctx) => {
  const { id } = ctx.params;

  const item = itemMap.get(id);
  if (!item) {
    ctx.response.status = 404;
    return;
  }

  ctx.response.headers.set("Cache-Control", "max-age=2592000");
  ctx.response.body = await Deno.readFile(`./dist/textures/${id}.png`);
});
