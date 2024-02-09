import { env } from "@/env";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization;
  if (!authToken)
    return res.status(401).json({
      error: "Unauthorized.",
    });

  const [, token] = authToken.split(" ");

  verify(token, env.JWT_SECRET, (error, decoded) => {
    if (error) return res.status(401).json({ error });
    console.log("é aqui:", decoded);
    req.userState = decoded as any;
    return next();
  });
}
