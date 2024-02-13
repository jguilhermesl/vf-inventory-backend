import prismaClient from "@/services/prisma";
import { Request, Response } from "express";
import { z } from "zod";

export const createInventory = async (req: Request, res: Response) => {
  try {
    console.log("Corpo da requisição:", req.body);
    const userId = "32d1abac-b63d-49dc-aeeb-95c28a144cb9";
    const createInventoryBodySchema = z.object({
      lot: z.string(),
      price: z.number(),
      quantity: z.number(),
      validty: z.string(),
      productId: z.string(),
    });

    const { lot, price, quantity, validty, productId } =
      createInventoryBodySchema.parse(req.body);

    const validtyDate = new Date(validty);

    await prismaClient.inventory.create({
      data: {
        lot,
        price,
        quantity,
        validty: validtyDate,
        product: { connect: { id: productId } },
        createdBy: { connect: { id: userId } },
      },
    });

    return res.json({ message: "Estoque cadastrado com sucesso." }).status(201);
  } catch (err) {
    console.log("Aqui:", err);
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
  }
};
