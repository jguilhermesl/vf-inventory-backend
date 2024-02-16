import { env } from '@/env';
import { InternalServerError } from '@/errors/internal-server-error';
import { InvalidCredentialsError } from '@/errors/invalid-credentials-error';
import prismaClient from '@/services/prisma';
import { compare } from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { z } from 'zod';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginBodySchema = z.object({
      email: z.string().email(),
      password: z.string()
    });

    const { email, password } = loginBodySchema.parse(req.body);

    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
      select: {
        passwordHash: true,
        name: true,
        email: true,
        role: true,
        id: true
      }
    });

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new InvalidCredentialsError()
    }

    const token = sign(
      {
        name: user?.name,
        email: user?.email,
        role: user?.role
      },
      '' + env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '1d',
      }
    );

    const refreshToken = sign(
      {
        name: user?.name,
        email: user?.email,
      },
      '' + env.JWT_SECRET,
      {
        subject: user?.id,
        expiresIn: '7d',
      }
    );

    return res
      .cookie('refreshToken', refreshToken, {
        secure: true,  // HTTPs,
        sameSite: true,
        httpOnly: true,
        path: "/"
      })
      .status(201)
      .json({
        token,
        refreshToken
      })
  } catch (err) {
    const error = new InternalServerError();
    return next(err ?? error)
  }
}