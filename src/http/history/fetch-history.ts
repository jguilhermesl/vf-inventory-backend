import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const fetchHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;

    const data = await prismaClient.history.findMany({
      where: {
        AND: [
          { deletedAt: { equals: null } },
          search && {
            OR: [
              {
                inventory: {
                  OR: [
                    { lot: { contains: search.toString(), mode: "insensitive" } },
                    { product: { name: { contains: search.toString(), mode: "insensitive" } } }
                  ]
                },
              },
              { customerName: { contains: search.toString(), mode: "insensitive" } }
            ],
          }
        ]
      },
      select: {
        createdAt: true,
        type: true,
        inventory: {
          select: {
            lot: true,
            product: {
              select: {
                name: true
              }
            }
          }
        },
        customerName: true,
        customerPaymentType: true,
        createdBy: {
          select: {
            name: true
          }
        },
        quantity: true,
        id: true,
        deletedAt: true
      },
    });

    const history = data.map((item) => {
      return {
        inventoryLot: item.inventory.lot,
        inventoryProduct: item.inventory.product.name,
        quantity: item.quantity,
        type: item.type,
        customerName: item.customerName,
        customerPaymentType: item.customerPaymentType,
        createdBy: item.createdBy.name,
        createdAt: item.createdAt,
        id: item.id,
      }
    })

    return res.json({ history }).status(HttpsCode.Success);
  } catch (err) {
    next(err)
    throw new InternalServerError();
  }
};
