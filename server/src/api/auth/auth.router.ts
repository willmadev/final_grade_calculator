import { Router } from "express";
import {
  changeEmail,
  login,
  refreshTokens,
  register,
  resetPassword,
} from "./auth.controller";

const authRouter = Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh-tokens", refreshTokens);
// authRouter.post("/reset-password", resetPassword);
// authRouter.post("/change-email", changeEmail);

export default authRouter;
