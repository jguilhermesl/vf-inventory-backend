import prismaClient from "@/services/prisma";
import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import { NextFunction, Request, Response } from "express";

export const getAllInventoryItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const inventoryItems = await prismaClient.inventory.findMany();
    console.log("Inventory Items:", inventoryItems);

    return res.json({ inventoryItems }).status(HttpsCode.Success);
  } catch (err) {
    console.error(err);
    next(err);
    throw new InternalServerError();
  }
};
