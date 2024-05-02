import { Router } from "express";

import authRouter from "./auth/auth.router";
import courseRouter from "./course/course.router";

const router = Router();
router.use("/auth", authRouter);
router.use("/course", courseRouter);

export default router;
