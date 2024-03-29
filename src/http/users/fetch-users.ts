import { IFetchQueryProps } from "@/@types/fetchQueryProps";
import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const fetchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemsPerPage = 20
    const { search, page = 1 } = req.query as IFetchQueryProps;

    const quantityItems = await prismaClient.user.count({
      where: {
        deletedAt: { equals: null }
      }
    });

    const users = await prismaClient.user.findMany({
      where: {
        deletedAt: { equals: null },
        ...(search && {
          OR: [
            { name: { contains: search.toString(), mode: "insensitive" } },
            { email: { contains: search.toString(), mode: "insensitive" } },
          ],
        })
      },
      skip: itemsPerPage * (page - 1),
      take: itemsPerPage,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: false
      }
    });

    const totalItemsPerPageSize = quantityItems / 20
    const totalPages = totalItemsPerPageSize < 1 ? 1 : Math.ceil(totalItemsPerPageSize);

    return res.json({ users, page, totalItems: quantityItems, totalPages }).status(HttpsCode.Success);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err })
  }
};
