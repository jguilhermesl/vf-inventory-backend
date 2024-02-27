import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userState.sub;

    const createInventoryBodySchema = z.object({
      lot: z.string(),
      price: z.number(),
      quantity: z.number(),
      validity: z.string(),
      productId: z.string(),
    });

    const { lot, price, quantity, validity, productId } =
      createInventoryBodySchema.parse(req.body);

    const inventory = await prismaClient.inventory.create({
      data: {
        lot,
        price,
        quantity,
        validity: new Date(validity),
        product: { connect: { id: productId } },
        createdBy: { connect: { id: userId } },
      },
    });

    await prismaClient.history.create({
      data: {
        quantity,
        type: "input",
        createdBy: {
          connect: {
            id: userId
          }
        },
        inventory: {
          connect: {
            id: inventory.id
          }
        }
      },
    });

    return res.json({ message: "Estoque criado com sucesso." }).status(201);
  } catch (err) {
    return res.status(500).send({ error: err })
  }
};
