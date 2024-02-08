// Importações dos módulos
import prismaClient from "@/services/prisma";
import { Request, Response } from "express";
import { z } from "zod";

export const createProduct = async (req: Request, res: Response) => {
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
      return res.json({ message: "Produto já existente." }).status(409); // Código 409 para conflito
    }

    await prismaClient.product.create({
      data: { code, name, sigla },
    });

    return res.json({ message: "Produto cadastrado com sucesso." }).status(201);
  } catch (err) {
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
  }
};
