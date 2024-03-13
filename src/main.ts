import { cors } from "https://deno.land/x/hono@v4.1.0/middleware.ts";
import { Hono } from "https://deno.land/x/hono@v4.1.0/mod.ts";
import items from "../dist/items.json" with { type: "json" };

const app = new Hono();

app.use("/", cors());

app.get("/", (ctx) => {
  return ctx.json(items);
});

app.get("/:id", (ctx) => {
  const { id } = ctx.req.param();
  // @ts-ignore: indexable by string
  const item = items[id];
  if (!item) {
    return ctx.notFound();
  }

  return ctx.json(item);
});

Deno.serve(app.fetch);
