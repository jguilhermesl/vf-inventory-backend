import { HttpsCode } from "@/constants/errors";
import prismaClient from "@/services/prisma";
import { Request, Response } from "express";
import { z } from "zod";

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const createProductBodySchema = z.object({
      sigla: z.string(),
      name: z.string(),
    });

    const { sigla, name } = createProductBodySchema.parse(req.body);

    const existingProduct = await prismaClient.product.findFirst({
      where: { name, sigla },
    });

    if (existingProduct) {
      return res.status(HttpsCode.Conflict).send({ error: "Produto já existente." })
    }

    await prismaClient.product.create({
      data: { name, sigla },
    });

    return res
      .status(HttpsCode.Created)
      .send({ message: "Produto cadastrado com sucesso." });

  } catch (err) {
    console.log(err)
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err })
  }
};
