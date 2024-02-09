import { InternalServerError } from "@/errors/internal-server-error";
import { ItemNotFoundError } from "@/errors/item-not-found-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const createInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userState.sub;

    const createInventoryBodySchema = z.object({
      lot: z.string(),
      price: z.number(),
      quantity: z.number(),
      validity: z.date(),
      productId: z.string(),
    });

    const { lot, price, quantity, validity, productId } =
      createInventoryBodySchema.parse(req.body);

    const product = await prismaClient.product.findUnique({
      where: {
        id: productId
      }
    })

    if (!product) {
      throw new ItemNotFoundError()
    }

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
    throw new InternalServerError()
  }
};
