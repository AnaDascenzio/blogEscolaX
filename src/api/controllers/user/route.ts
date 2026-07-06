import { Router } from "express";
import { create } from "./create";
import { findById } from "./find-by-id";
import { findByEmail } from "./find-by-email";
import { findByName } from "./find-by-name";
import { update } from "./update";

const userRouter = Router();

userRouter.post("/", create);
userRouter.get("/email/:email", findByEmail);
userRouter.get("/name/:name", findByName);
userRouter.get("/:id", findById);
userRouter.put("/:id", update);

export default userRouter;
