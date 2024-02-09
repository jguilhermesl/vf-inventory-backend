import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    return res.json({ user }).status(201);
  } catch (err) {
    next(err)
    throw new InternalServerError();
  }
};
