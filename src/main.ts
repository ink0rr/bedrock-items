import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors";
import { readJson } from "../utils/json.ts";

const app = new Hono();
const items = await readJson<Record<string, unknown>>("./dist/items.json");

app.use("/", cors());

app.get("/", (ctx) => {
  return ctx.json(items);
});

app.get("/:id", (ctx) => {
  const { id } = ctx.req.param();
  const item = items[id];
  if (!item) {
    return ctx.notFound();
  }

  return ctx.json(item);
});

Deno.serve(app.fetch);
