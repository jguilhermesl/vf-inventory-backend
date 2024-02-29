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
      validity: z.string(),
    });

    const { lot, price, quantity, validity } = createInventoryBodySchema.parse(
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
        ...(validity && { validity: new Date(validity) }),
        updatedAt: new Date(),
      },
    });

    return res.json({ message: "Estoque editado com sucesso." }).status(201);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err })
  }
};
