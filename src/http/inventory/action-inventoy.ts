import { HttpsCode } from "@/constants/errors";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const createActionInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: inventoryId } = req.params
    const userId = req.userState.sub

    const createActionInventoryBodySchema = z.object({
      type: z.enum(["input", "output"]),
      quantity: z.number(),
      price: z.number().nullable().optional(),
      customerName: z.string().optional().nullable(),
      customerPaymentType: z.enum(["pix", "money", "credit-card", "debit-card", "prazo"]).optional().nullable(),
    });

    const {
      type,
      quantity,
      price,
      customerName,
      customerPaymentType,
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
        price,
        customerName,
        customerPaymentType,
        createdBy: {
          connect: {
            id: userId
          }
        }
      },
    });

    const inventory = await prismaClient.inventory.findUnique({
      where: {
        id: inventoryId
      }
    })

    if (type === "output") {
      const finalValue = inventory.quantity - quantity

      if (finalValue < 0) {
        return res.status(HttpsCode.Conflict).send({ error: "Estoque não pode ficar negativo." })
      }
    }

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
    return res.status(500).send({ error: "Algo aconteceu de errado.", message: err })
  }
};
