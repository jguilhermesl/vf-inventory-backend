import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const createActionInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createActionInventoryBodySchema = z.object({
      type: z.enum(["input", "output"]),
      inventoryId: z.any(),
      quantity: z.number(),
      customerName: z.string().optional(),
      customerPaymentType: z.enum(["pix", "cash", "credit-card", "deb"]),
      productId: z.string(),
    });

    const {
      type,
      inventoryId,
      quantity,
      customerName,
      customerPaymentType,
      productId,
    } = createActionInventoryBodySchema.parse(req.body);

    await prismaClient.history.create({
      data: {
        type,
        inventory: {
          connect: {
            id: inventoryId,
          },
        },
        quantity,
        customerName,
        customerPaymentType,
        product: { connect: { id: productId } },
      },
    });

    const updateData = {
      ...(type === "input"
        ? { quantity: { increment: quantity } }
        : type === "output"
        ? { quantity: { decrement: quantity } }
        : {}),
      updatedAt: new Date(),
    };
    await prismaClient.inventory.update({
      where: {
        id: inventoryId,
      },

      data: updateData,
    });
    return res
      .status(HttpsCode.Created)
      .json({ message: "Ação enviada com sucesso e estoque atualizado." });
  } catch (err) {
    console.error(err);
    next(err);
    throw new InternalServerError();
  }
};
