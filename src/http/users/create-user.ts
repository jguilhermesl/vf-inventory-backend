import { HttpsCode } from './../../constants/errors';
import prismaClient from "@/services/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { hash } from "bcryptjs";
import { EmailAlreadyExistsError } from "@/errors/email-already-exists-error";
import { InternalServerError } from "@/errors/internal-server-error";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createUserBodySchema = z.object({
      name: z.string(),
      role: z.enum(["admin", "member"]),
      email: z.string().email(),
      password: z.string(),
    });

    const { name, role, email, password } = createUserBodySchema.parse(
      req.body
    );

    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return res.json({ error: "Email já existente." }).status(HttpsCode.Conflict)
    }

    await prismaClient.user.create({
      data: {
        name,
        role,
        email,
        passwordHash: await hash(password, 6),
      },
    });

    return res.json({ message: "Usuário criado com sucesso." }).status(201);
  } catch (err) {
    return res.status(500).send({ error: "Algo aconteceu de errado", message: err })
  }
};
