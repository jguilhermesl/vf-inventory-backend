import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createProductBodySchema = z.object({
      code: z.string(),
      sigla: z.string(),
      name: z.string(),
    });

    const { code, sigla, name } = createProductBodySchema.parse(req.body);

    const existingProduct = await prismaClient.product.findUnique({
      where: { name, sigla },
    });

    if (existingProduct) {
      return res.json({ message: "Produto já existente." }).status(HttpsCode.Conflict);
    }

    await prismaClient.product.create({
      data: { code, name, sigla },
    });

    return res.json({ message: "Produto cadastrado com sucesso." }).status(HttpsCode.Created);
  } catch (err) {
    next(err)
    throw new InternalServerError();
  }
};
