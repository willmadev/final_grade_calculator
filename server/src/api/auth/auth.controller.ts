import { Request, Response } from "express";
import { ZodError, z } from "zod";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import { config } from "../../config/env";
import SendgridMailer from "../../services/mail/SendgridMailer";
import { emailVerificationTemplate } from "../../services/mail/templates";

const saltRounds = 10;

const createSession = async (user: User) => {
  const session = await prisma.session.create({ data: { userId: user.id } });
  return session.id;
};

const initiateEmailVerification = async (user: User) => {
  const verifyId = jwt.sign({ uid: user.id }, config.secrets.verifyId, {
    expiresIn: "1 hour",
  });
  const mailer = new SendgridMailer();
  mailer.send(
    user.email,
    "FGC - Verify Email",
    emailVerificationTemplate(
      `${config.serverUrl}/api/verify-email/${verifyId}`
    )
  );
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
    data: { email: reqBody.email, password: hash, emailVerified: false },
  });

  // await initiateEmailVerification(user);

  res.cookie("session", await createSession(user), {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
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
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).send();
};

export const logout = async (req: Request, res: Response) => {
  await prisma.session.delete({ where: { id: req.cookies.session } });
  res.clearCookie("session");
  return res.status(204).send();
};

export const verifyEmail = async (req: Request, res: Response) => {};

const changePasswordSchema = z.object({
  password: z.string(),
  newPassword: z.string(),
});

export const changePassword = async (req: Request, res: Response) => {
  let reqBody;
  try {
    reqBody = changePasswordSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).send(e.message);
    }
    return res.status(500).send("An error occured");
  }

  if (!(await bcrypt.compare(reqBody.password, req.user.password))) {
    return res.status(400).send("Incorrect password");
  }

  const hash = await bcrypt.hash(reqBody.newPassword, saltRounds);
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hash },
  });

  // invalidate previous sessions
  await prisma.session.deleteMany({ where: { userId: req.user.id } });

  // create new session
  res.cookie("session", await createSession(user), {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000,
  });

  return res.status(204).send();
};

const changeEmailSchema = z.object({
  email: z.string().email(),
});
export const changeEmail = async (req: Request, res: Response) => {
  let reqBody;
  try {
    reqBody = changeEmailSchema.parse(req.body);
  } catch (e) {
    if (e instanceof ZodError) {
      return res.status(400).send("Invalid email");
    }
    return res.status(500).send("An error occured");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: reqBody.email },
  });
  if (existingUser)
    return res.status(400).send("An account already exists with this email");

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { email: reqBody.email },
  });
  return res.status(200).send({ email: user.email });
};
