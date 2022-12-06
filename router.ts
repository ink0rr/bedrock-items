import { Router } from "oak";
import { items } from "./routes/items.ts";

export const router = new Router();

router.use("/items", items.routes());
