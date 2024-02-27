import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.userState.sub;

    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    });

    return res.json({ user }).status(201);
  } catch (err) {
    return res.json({ error: "Algo aconteceu de errado", message: err }).status(500)
  }
};
