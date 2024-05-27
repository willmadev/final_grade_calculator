import { Router } from "express";
import {
  changeEmail,
  getUserInfo,
  login,
  register,
  resetPassword,
} from "./auth.controller";
import { authorize } from "../middleware/authorize";

const authRouter = Router();
authRouter.get("/user-info", authorize, getUserInfo);
authRouter.post("/register", register);
authRouter.post("/login", login);
// authRouter.post("/reset-password", resetPassword);
// authRouter.post("/change-email", changeEmail);

export default authRouter;
