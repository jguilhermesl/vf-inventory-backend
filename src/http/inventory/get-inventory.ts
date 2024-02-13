import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const getInventoryProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: id } = req.params;

    const user = await prismaClient.inventory.findUnique({
      where: {
        id: id,
      },
    });

    return res.json({ user }).status(HttpsCode.Success);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};
