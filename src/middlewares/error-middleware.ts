import { EmailAlreadyExistsError } from '@/errors/email-already-exists-error';
import { HttpsCode } from '@/constants/errors';
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("err ==> ", err)
  if (err instanceof EmailAlreadyExistsError) {
    return res.status(HttpsCode.InternalServerError).json({ err: err.message })
  }

  return res.status(HttpsCode.InternalServerError).json({ error: err.message })
};