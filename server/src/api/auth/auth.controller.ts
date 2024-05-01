import { CookieOptions, Request, Response } from "express";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import prisma from "../../config/prisma";
import { config } from "../../config/env";

const saltRounds = 10;

const generateTokens = (userId: number) => {
  const accessToken = jwt.sign({ userId }, config.accessTokenSecret, {
    expiresIn: "1 hour",
  });
  const refreshToken = jwt.sign({ userId }, config.refreshTokenSecret, {
    expiresIn: "1 week",
  });
  return { accessToken, refreshToken };
};

const refreshTokenOptions: CookieOptions = {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth/refresh-tokens",
};

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  let reqBody;
  try {
    reqBody = registerSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).send(e.message);
    }
    return res.status(500).send("An error occured");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: reqBody.email },
  });
  if (existingUser)
    return res.status(400).send("An account already exists with this email");

  const hash = await bcrypt.hash(reqBody.password, saltRounds);

  const user = await prisma.user.create({
    data: { email: reqBody.email, password: hash },
  });

  const { accessToken, refreshToken } = generateTokens(user.id);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);

  return res.status(200).send({ accessToken });
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const login = async (req: Request, res: Response) => {
  let reqBody;
  try {
    reqBody = loginSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).send(e.message);
    }
    return res.status(500).send("An error occured");
  }

  const user = await prisma.user.findUnique({
    where: { email: reqBody.email },
  });
  if (!user) {
    return res.status(400).send("User not found");
  }
  if (!(await bcrypt.compare(reqBody.password, user.password))) {
    return res.status(400).send("Incorrect password");
  }

  const { accessToken, refreshToken } = generateTokens(user.id);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
  return res.status(200).send({ accessToken });
};

export const refreshTokens = (req: Request, res: Response) => {
  if (!req.cookies || !req.cookies.refreshToken) {
    return res.status(401).send("Invalid refresh token");
  }
  const jwtPayload = jwt.verify(
    req.cookies.refreshToken,
    config.refreshTokenSecret
  );
  if (!jwtPayload || typeof jwtPayload === "string" || !jwtPayload.userId) {
    return res.status(401).send("Invalid refresh token");
  }
  const { accessToken, refreshToken } = generateTokens(jwtPayload.userId);
  res.cookie("refreshToken", refreshToken, refreshTokenOptions);
  return res.status(200).send({ accessToken });
};

export const resetPassword = (req: Request, res: Response) => {};
export const changeEmail = (req: Request, res: Response) => {};
