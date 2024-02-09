import prismaClient from "@/services/prisma";
import { Request, Response } from "express";
import { z } from "zod";

export const editInventory = async (req: Request, res: Response) => {
  try {
    const { id: productId } = req.params;

    const createInventoryBodySchema = z.object({
      lot: z.string(),
      price: z.number(),
      quantity: z.number(),
      validty: z.string(),
    });

    const { lot, price, quantity, validty } = createInventoryBodySchema.parse(
      req.body
    );

    await prismaClient.inventory.update({
      where: {
        id: productId,
      },
      data: {
        ...(lot && { lot }),
        ...(price && { price }),
        ...(quantity && { quantity }),
        ...(validty && { validty }),
        updatedAt: new Date(),
      },
    });

    return res.json({ message: "Estoque editado com sucesso." }).status(201);
  } catch (err) {
    console.log(err);
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
  }
};
