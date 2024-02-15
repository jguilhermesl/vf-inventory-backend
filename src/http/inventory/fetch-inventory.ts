import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const fetchInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;

    const inventory = await prismaClient.inventory.findMany({
      ...(search && {
        where: {
          OR: [
            {
              product: {
                OR: [
                  { name: { contains: search.toString(), mode: "insensitive" } },
                  { sigla: { contains: search.toString(), mode: "insensitive" } },
                  { code: { contains: search.toString(), mode: "insensitive" } },
                ]
              }
            },
            { lot: { contains: search.toString(), mode: "insensitive" } }
          ]
        }
      }),
      select: {
        product: true,
        lot: true,
        price: true,
        createdBy: true,
        quantity: true,
        validity: true,
        id: true
      }
    });

    return res.json({ inventory }).status(HttpsCode.Success);
  } catch (err) {
    next(err)
    throw new InternalServerError();
  }
};
