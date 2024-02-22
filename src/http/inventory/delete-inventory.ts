import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const deleteInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: inventoryId } = req.params;

    await prismaClient.inventory.updateMany({
      where: {
        id: inventoryId,
      },
      data: {
        deletedAt: new Date()
      }
    });

    return res.json({ message: "Estoque deletado com sucesso." }).status(HttpsCode.Success);
  } catch (err) {
    console.log(err)
    next(err)
    throw new InternalServerError();
  }
};
