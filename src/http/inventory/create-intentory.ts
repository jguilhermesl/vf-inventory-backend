// Importações dos módulos
import prismaClient from "@/services/prisma";
import { Request, Response } from "express";
import { z } from "zod";

export const createInventory = async (req: Request, res: Response) => {
  try {
    const userId = req.userState.sub;
    const createInventoryBodySchema = z.object({
      lot: z.string(),
      price: z.number(),
      quantity: z.number(),
      validty: z.string(),
      productId: z.string(),
    });

    const { lot, price, quantity, validty, productId } =
      createInventoryBodySchema.parse(req.body);

    await prismaClient.inventory.create({
      data: {
        lot,
        price,
        quantity,
        validty,
        product: { connect: { id: productId } },
        createdBy: { connect: { id: userId } },
      },
    });

    return res.json({ message: "Estoque cadastrado com sucesso." }).status(201);
  } catch (err) {
    console.log(err);
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
  }
};
