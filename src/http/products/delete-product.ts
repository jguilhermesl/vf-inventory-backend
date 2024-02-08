import prismaClient from "@/services/prisma";
import { Request, Response } from "express";

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;

    await prismaClient.product.delete({
      where: {
        id: productId,
      },
    });

    return res.json({ message: "Product deletado com sucesso." }).status(201);
  } catch (err) {
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
  }
};
