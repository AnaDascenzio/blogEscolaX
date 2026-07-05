import { Router } from "express";
import { create } from "./create";
import { findById } from "./find-by-id";
import { findByEmail } from "./find-by-email";
import { findByName } from "./find-by-name";

const userRouter = Router();

userRouter.post("/", create);
userRouter.get("/email/:email", findByEmail);
userRouter.get("/name/:name", findByName);
userRouter.get("/:id", findById);

export default userRouter;
