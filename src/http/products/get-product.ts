import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;

    const user = await prismaClient.product.findUnique({
      where: {
        id: userId,
      },
    });

    return res.json({ user }).status(HttpsCode.Success);
  } catch (err) {
    return res.json({ error: "Algo aconteceu de errado", message: err }).status(500)
  }
};
