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
    const { id: inventoryId } = req.params
    const userId = req.userState.sub

    const createActionInventoryBodySchema = z.object({
      type: z.enum(["input", "output"]),
      quantity: z.number(),
      price: z.number().nullable().optional(),
      customerName: z.string().optional().nullable(),
      customerPaymentType: z.enum(["pix", "cash", "credit-card", "deb"]).optional().nullable(),
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
    next(err);
    throw new InternalServerError();
  }
};
