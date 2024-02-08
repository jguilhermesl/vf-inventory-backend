import prismaClient from "@/services/prisma";
import { Request, Response } from "express";

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;

    await prismaClient.user.delete({
      where: {
        id: userId,
      },
    });

    return res.json({ message: "Usuário deletado com sucesso." }).status(201);
  } catch (err) {
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
  }
};
