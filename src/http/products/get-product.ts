import prismaClient from "@/services/prisma";
import { Request, Response } from "express";

export const getProductProfile = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;

    const user = await prismaClient.product.findUnique({
      where: {
        id: userId,
      },
    });

    return res.json({ user }).status(201);
  } catch (err) {
    return res.json({ message: "Algo aconteceu de errado." }).status(500);
  }
};
