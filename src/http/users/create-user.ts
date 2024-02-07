import prismaClient from "@/services/prisma";
import { Request, Response } from "express";
import { z } from "zod";
import { hash } from "bcryptjs"

export const createUser = async (req: Request, res: Response) => {
  try {
    const createUserBodySchema = z.object({
      name: z.string(),
      role: z.enum(["admin", "member"]),
      email: z.string().email(),
      password: z.string()
    });

    const { name, role, email, password } = createUserBodySchema.parse(req.body);

    const user = await prismaClient.user.findUnique({
      where: {
        email
      }
    })

    if (user) {
      return res.json({ message: "Email já existente." }).status(408)
    }

    await prismaClient.user.create({
      data: {
        name,
        role,
        email,
        passwordHash: await hash(password, 6)
      }
    });

    return res.json({ message: "Usuário criado com sucesso." }).status(201);
  } catch (err) {
    return res.json({ message: "Algo aconteceu de errado." }).status(500)
  }
};