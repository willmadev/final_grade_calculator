import { Router } from "express";
import {
  changeEmail,
  getUserInfo,
  login,
  logout,
  register,
  changePassword,
  verifyEmail,
} from "./auth.controller";
import { authorize } from "../middleware/authorize";

const authRouter = Router();
authRouter.get("/user-info", authorize, getUserInfo);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", authorize, logout);
// authRouter.get("/verify-email/:verifyId", verifyEmail);
authRouter.post("/change-password", authorize, changePassword);
authRouter.post("/change-email", authorize, changeEmail);

export default authRouter;
