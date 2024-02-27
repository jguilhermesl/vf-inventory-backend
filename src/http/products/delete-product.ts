import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: productId } = req.params;

    console.log("productId ==> ", productId)

    await prismaClient.product.updateMany({
      where: {
        id: productId,
      },
      data: {
        deletedAt: new Date()
      }
    });

    return res.json({ message: "Produto deletado com sucesso." }).status(HttpsCode.Success);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err })
  }
};
