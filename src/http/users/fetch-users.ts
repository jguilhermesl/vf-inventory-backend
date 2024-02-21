import { HttpsCode } from "@/constants/errors";
import { InternalServerError } from "@/errors/internal-server-error";
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const fetchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search } = req.query;

    const users = await prismaClient.user.findMany({
      ...(search && {
        where: {
          OR: [
            { name: { contains: search.toString(), mode: "insensitive" } },
            { email: { contains: search.toString(), mode: "insensitive" } },
          ],
          deletedAt: { equals: null }
        }
      }),
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: false
      }
    });

    return res.json({ users }).status(HttpsCode.Success);
  } catch (err) {
    next(err)
    throw new InternalServerError();
  }
};
