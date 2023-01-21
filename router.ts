import { Router } from "oak";
import { items } from "./routes/items.ts";
import { recipe } from "./routes/recipe.ts";

export const router = new Router();

router.use("/items", items.routes());
router.use("/recipe", recipe.routes());
