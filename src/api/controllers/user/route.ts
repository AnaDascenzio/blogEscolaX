import { Router } from "express";
import { create } from "./create";
import { findById } from "./find-by-id";
import { findByEmail } from "./find-by-email";
import { findByName } from "./find-by-name";
import { update } from "./update";
import { signin } from "./signin";
import { findAll } from "./find-all";
import { remove } from "./delete";
import { ensureAuthenticated } from "../../middlewares/ensure-authenticated";
import { authorizeRoles } from "../../middlewares/authorize-roles";
import { UserRole } from "../../entities/enums/user-roles.enum";

const userRouter = Router();

userRouter.post("/signin", signin);
userRouter.get("/email/:email", findByEmail);
userRouter.get("/name/:name", findByName);
userRouter.get("/", ensureAuthenticated, authorizeRoles(UserRole.TEACHER), findAll);
userRouter.post("/", ensureAuthenticated, authorizeRoles(UserRole.TEACHER), create);
userRouter.get("/:id", findById);
userRouter.put("/:id", ensureAuthenticated, authorizeRoles(UserRole.TEACHER), update);
userRouter.delete("/:id", ensureAuthenticated, authorizeRoles(UserRole.TEACHER), remove);

export default userRouter;
