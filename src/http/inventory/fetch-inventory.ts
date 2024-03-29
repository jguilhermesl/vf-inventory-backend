import { IFetchQueryProps } from "@/@types/fetchQueryProps";
import { HttpsCode } from "@/constants/errors";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const fetchInventory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemsPerPage = 20
    const { search, page = 1 } = req.query as IFetchQueryProps;

    const quantityItems = await prismaClient.inventory.count({
      where: {
        deletedAt: { equals: null }
      }
    });

    const data = await prismaClient.inventory.findMany({
      where: {
        deletedAt: { equals: null },
        ...(search && {
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
            { lot: { contains: search.toString(), mode: "insensitive" } },
          ],
        })
      },
      skip: itemsPerPage * (page - 1),
      take: itemsPerPage,
      select: {
        product: true,
        lot: true,
        price: true,
        createdBy: true,
        quantity: true,
        validity: true,
        id: true,
        deletedAt: true
      },
    });

    const inventory = data.map((item) => {
      return {
        id: item.id,
        lot: item.lot,
        price: item.price,
        quantity: item.quantity,
        validity: item.validity,
        productName: item.product.name
      }
    })

    const totalItemsPerPageSize = quantityItems / 20
    const totalPages = totalItemsPerPageSize < 1 ? 1 : Math.ceil(totalItemsPerPageSize);

    return res.json({ inventory, page, totalItems: quantityItems, totalPages }).status(HttpsCode.Success);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err })
  }
};
