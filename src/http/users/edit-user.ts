import prismaClient from "@/services/prisma";
import { Request, Response } from "express";
import { z } from "zod";
import { hash } from "bcryptjs"

export const editUser = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;

    const editUserBodySchema = z.object({
      name: z.string().optional(),
      role: z.enum(["admin", "member"]).optional(),
      email: z.string().email().optional(),
      password: z.string().optional()
    });

    const { name, role, email, password } = editUserBodySchema.parse(req.body);

    await prismaClient.user.update({
      where: {
        id: userId
      },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(email && { email }),
        ...(password && { password: await hash(password, 6) }),
        updatedAt: new Date()
      }
    })

    return res.json({ message: "Usuário editado com sucesso." }).status(201);
  } catch (err) {
    console.log(err)
    return res.json({ message: "Algo aconteceu de errado." }).status(500)
  }
};