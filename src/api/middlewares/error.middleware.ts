import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Erro de validação",
      details: error.format(),
    });
  }

  if (error?.message === "E-mail já cadastrado.") {
    return res.status(400).json({
      message: "E-mail já cadastrado.",
    });
  }

  // Erro de violação de chave única do PostgreSQL (código 23505) ou mensagem de unique constraint
  if (
    error?.code === "23505" ||
    (typeof error?.message === "string" &&
      (error.message.includes("unique constraint") ||
       error.message.includes("duplicate key") ||
       error.message.includes("users_email_key")))
  ) {
    return res.status(400).json({
      message: "E-mail já cadastrado.",
    });
  }

  console.error(error);

  return res.status(500).json({
    message: error?.message || "Erro interno do servidor",
  });
}
