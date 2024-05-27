import { Request, Response } from "express";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { User } from "@prisma/client";
import { config } from "../../config/env";

const saltRounds = 10;

const createSession = async (user: User) => {
  const session = await prisma.session.create({ data: { userId: user.id } });
  return session.id;
};

export const getUserInfo = async (req: Request, res: Response) => {
  return res.status(200).send({ email: req.user.email });
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

  res.cookie("session", await createSession(user), {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000,
  });
  return res.status(200).send();
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

  res.cookie("session", await createSession(user), {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000,
  });
  return res.status(200).send();
};

export const resetPassword = async (req: Request, res: Response) => {};
export const changeEmail = async (req: Request, res: Response) => {};
