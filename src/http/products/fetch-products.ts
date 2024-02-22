import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const fetchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;

    const products = await prismaClient.product.findMany({
      where: {
        deletedAt: { equals: null },
        ...(search && {
          OR: [
            { name: { contains: search.toString(), mode: "insensitive" } },
            { code: { contains: search.toString(), mode: "insensitive" } },
            { sigla: { contains: search.toString(), mode: "insensitive" } },
          ]
        })
      },
      select: {
        id: true,
        name: true,
        code: true,
        sigla: true
      }
    });

    return res.json({ products }).status(HttpsCode.Success);
  } catch (err) {
    next(err)
    throw new InternalServerError();
  }
};
