import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Erro de validação",
      details: error.format(),
    });
  }


  console.error(error);

  return res.status(500).json({
    message: error.message || "Erro interno do servidor",
  });
}