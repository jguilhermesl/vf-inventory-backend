import { IFetchQueryProps } from "@/@types/fetchQueryProps";
import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const fetchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemsPerPage = 20
    const { search, page = 1 } = req.query as IFetchQueryProps;

    const quantityItems = await prismaClient.product.count({
      where: {
        deletedAt: { equals: null }
      }
    });

    const products = await prismaClient.product.findMany({
      where: {
        deletedAt: { equals: null },
        ...(search && {
          OR: [
            { name: { contains: search.toString(), mode: "insensitive" } },
            { code: { contains: search.toString(), mode: "insensitive" } },
            { sigla: { contains: search.toString(), mode: "insensitive" } },
          ]
        })
      },
      skip: itemsPerPage * (page - 1),
      take: itemsPerPage,
      select: {
        id: true,
        name: true,
        sigla: true
      }
    });

    const totalItemsPerPageSize = quantityItems / 20
    const totalPages = totalItemsPerPageSize < 1 ? 1 : Math.ceil(totalItemsPerPageSize);

    return res.json({ products, page, totalItems: quantityItems, totalPages }).status(HttpsCode.Success);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err })
  }
};
