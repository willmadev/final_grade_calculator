import { Router } from "express";
import { changeEmail, login, register, resetPassword } from "./auth.controller";

const authRouter = Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
// authRouter.post("/reset-password", resetPassword);
// authRouter.post("/change-email", changeEmail);

export default authRouter;
