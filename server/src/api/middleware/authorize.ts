import { NextFunction, Request, Response } from "express";
import prisma from "../../config/prisma";

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.cookies);
  if (
    !req.cookies ||
    !req.cookies.session ||
    typeof req.cookies.session !== "string"
  )
    return res.status(401).send();
  const session = await prisma.session.findUnique({
    where: { id: req.cookies.session },
    select: { User: true },
  });
  if (!session) return res.status(401).send();
  req.user = session.User;
  return next();
};
