import { InternalServerError } from "@/errors/internal-server-error";
import { ItemNotFoundError } from "@/errors/item-not-found-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = "73165e76-1f9a-4843-aef9-63e5e4fa0a7e";

    const createInventoryBodySchema = z.object({
      lot: z.string(),
      price: z.number(),
      quantity: z.number(),
      validity: z.string(),
      productId: z.string(),
    });

    const { lot, price, quantity, validity, productId } =
      createInventoryBodySchema.parse(req.body);

    await prismaClient.inventory.create({
      data: {
        lot,
        price,
        quantity,
        validity: new Date(validity),
        product: { connect: { id: productId } },
        createdBy: { connect: { id: userId } },
      },
    });

    return res.json({ message: "Estoque cadastrado com sucesso." }).status(201);
  } catch (err) {
    next(err);
    throw new InternalServerError();
  }
};
