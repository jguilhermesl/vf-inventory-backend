import prismaClient from "@/services/prisma";
import { Request, Response } from "express";
import { z } from "zod";

export const editInventory = async (req: Request, res: Response) => {
  try {
    const { id: id } = req.params;

    const createInventoryBodySchema = z.object({
      lot: z.string().optional(),
      price: z.number().optional(),
      quantity: z.number().optional(),
      validty: z.string().optional(),
      productId: z.string().optional(),
      userId: z.string().optional(),
    });

    const { lot, price, quantity, validty, productId, userId } =
      createInventoryBodySchema.parse(req.body);

    await prismaClient.inventory.update({
      where: {
        id: id,
      },
      data: {
        ...(lot && { lot }),
        ...(price && { price }),
        ...(quantity && { quantity }),
        ...(validty && { validty }),
        ...(productId && { productId }),
        ...(userId && { userId }),

        updatedAt: new Date(),
      },
    });

    return res.json({ message: "Estoque editado com sucesso." }).status(201);
  } catch (err) {
    console.log(err);
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
  }
};
