import { Router } from "express";
import { create } from "./create";
import { findById } from "./find-by-id";
import { findAll } from "./find-all";
import { search } from "./search";
import { update } from "./update";
import { remove } from "./delete";

const postRouter = Router();

postRouter.get("/search", search);
postRouter.get("/", findAll);
postRouter.get("/:id", findById);
postRouter.post("/", create);
postRouter.put("/:id", update);
postRouter.delete("/:id", remove);

export default postRouter;
