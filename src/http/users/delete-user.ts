import { InternalServerError } from '@/errors/internal-server-error';
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: userId } = req.params;

    await prismaClient.user.delete({
      where: {
        id: userId,
      },
    });

    return res.json({ message: "Usuário deletado com sucesso." }).status(201);
  } catch (err) {
    next(err)
    throw new InternalServerError();
  }
};