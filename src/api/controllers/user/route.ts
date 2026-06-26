import { Router } from "express";
import { create } from "./create";
import { findById } from "./find-by-id";

const userRouter = Router();

userRouter.post("/", create);
userRouter.get("/:id", findById);

export default userRouter;
