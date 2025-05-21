import { Hono } from "jsr:@hono/hono";
import { cors } from "jsr:@hono/hono/cors";
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
