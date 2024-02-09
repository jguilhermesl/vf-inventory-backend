import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const editProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;

    const editProductBodySchema = z.object({
      code: z.string(),
      sigla: z.string(),
      name: z.string(),
    });

    const { code, sigla, name } = editProductBodySchema.parse(req.body);

    await prismaClient.product.update({
      where: {
        id: userId,
      },
      data: {
        ...(name && { name }),
        ...(sigla && { sigla }),
        ...(code && { code }),
        updatedAt: new Date(),
      },
    });

    return res.json({ message: "Produto editado com sucesso." }).status(HttpsCode.Success);
  } catch (err) {
    next(err)
    throw new InternalServerError();
  }
};
