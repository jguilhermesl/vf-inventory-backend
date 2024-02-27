import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import { ProductAlreadyExistsError } from "@/errors/product-already-exists-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createProductBodySchema = z.object({
      sigla: z.string(),
      name: z.string(),
    });

    const { sigla, name } = createProductBodySchema.parse(req.body);

    const existingProduct = await prismaClient.product.findUnique({
      where: { name, sigla },
    });

    if (existingProduct) {
      return res.json({ error: "Produto já existente." }).status(HttpsCode.Conflict)
    }

    const code = name.slice(0, 3).toUpperCase() + name.slice(name.length - 3, name.length).toUpperCase()

    await prismaClient.product.create({
      data: { code, name, sigla },
    });

    return res
      .json({ message: "Produto cadastrado com sucesso." })
      .status(HttpsCode.Created);

  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err })
  }
};
