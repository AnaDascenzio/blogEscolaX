import { Router } from "express";
import { create } from "./create";
import { findById } from "./find-by-id";
import { findAll } from "./find-all";
import { search } from "./search";
import { update } from "./update";
import { remove } from "./delete";
import { checkRole } from "../../middlewares/auth.middleware";
import { UserRole } from "../../entities/enums/user-roles.enum";

const postRouter = Router();

postRouter.get("/search", search);
postRouter.get("/", findAll);
postRouter.get("/:id", findById);
postRouter.post("/", checkRole([UserRole.TEACHER]), create);
postRouter.put("/:id", checkRole([UserRole.TEACHER]), update);
postRouter.delete("/:id", checkRole([UserRole.TEACHER]), remove);

export default postRouter;
