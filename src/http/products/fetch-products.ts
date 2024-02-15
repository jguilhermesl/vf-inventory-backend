import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const fetchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;

    const products = await prismaClient.product.findMany({
      ...(search && {
        where: {
          OR: [
            { name: { contains: search.toString(), mode: "insensitive" } },
            { code: { contains: search.toString(), mode: "insensitive" } },
            { sigla: { contains: search.toString(), mode: "insensitive" } },
          ]
        }
      }),
    });

    return res.json({ products }).status(HttpsCode.Success);
  } catch (err) {
    next(err)
    throw new InternalServerError();
  }
};
