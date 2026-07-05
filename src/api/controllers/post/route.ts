import { Router } from "express";
import { create } from "./create";
import { findById } from "./find-by-id";
import { ensureAuthenticated } from "../../middlewares/ensure-authenticated";
import { authorizeRoles } from "../../middlewares/authorize-roles";
import { UserRole } from "../../entities/enums/user-roles.enum";

const postRouter = Router();

postRouter.post("/", ensureAuthenticated, authorizeRoles(UserRole.TEACHER), create);
postRouter.get("/:id", findById);

export default postRouter;
