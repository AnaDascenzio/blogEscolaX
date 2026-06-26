import { Router } from "express";
import { create } from "./create";
import { findById } from "./find-by-id";

const postRouter = Router();

postRouter.post("/", create);
postRouter.get("/:id", findById);

export default postRouter;
