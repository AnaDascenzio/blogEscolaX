import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorMiddleware(
  error: unknown,
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

  const err = error as { code?: string; message?: string } | undefined;

  if (err?.message === "E-mail já cadastrado.") {
    return res.status(400).json({
      message: "E-mail já cadastrado.",
    });
  }

  // Erro de violação de chave única do PostgreSQL (código 23505) ou mensagem de unique constraint
  if (
    err?.code === "23505" ||
    (typeof err?.message === "string" &&
      (err.message.includes("unique constraint") ||
       err.message.includes("duplicate key") ||
       err.message.includes("users_email_key")))
  ) {
    return res.status(400).json({
      message: "E-mail já cadastrado.",
    });
  }

  console.error(error);

  return res.status(500).json({
    message: err?.message || "Erro interno do servidor",
  });
}
