import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;

    const editProductBodySchema = z.object({
      sigla: z.string().optional(),
      name: z.string().optional(),
    });

    const { sigla, name } = editProductBodySchema.parse(req.body);

    await prismaClient.product.update({
      where: {
        id: userId,
      },
      data: {
        ...(name && { name }),
        ...(sigla && { sigla }),
        updatedAt: new Date(),
      },
    });

    return res.json({ message: "Produto editado com sucesso." }).status(HttpsCode.Success);
  } catch (err) {
    return res.json({ error: "Algo aconteceu de errado", message: err }).status(500)
  }
};
