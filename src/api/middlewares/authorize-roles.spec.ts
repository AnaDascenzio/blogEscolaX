import { Request, Response } from "express";
import { authorizeRoles } from "./authorize-roles";
import { UserRole } from "../entities/enums/user-roles.enum";

describe("authorizeRoles", () => {
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna 401 quando não há usuário autenticado", () => {
    const next = jest.fn();

    authorizeRoles(UserRole.TEACHER)({} as Request, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 403 para papel sem permissão", () => {
    const next = jest.fn();

    authorizeRoles(UserRole.TEACHER)(
      { user: { id: 1, role: UserRole.STUDENT } } as Request,
      mockRes,
      next,
    );

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});
