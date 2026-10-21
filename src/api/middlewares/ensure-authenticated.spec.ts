import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ensureAuthenticated } from "./ensure-authenticated";
import { UserRole } from "../entities/enums/user-roles.enum";

const mockFindById = jest.fn();

jest.mock("../repositories/user.repository", () => ({
  UserRepository: jest.fn().mockImplementation(() => ({
    findById: mockFindById,
  })),
}));
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

describe("ensureAuthenticated", () => {
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("retorna 401 para token inválido", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("invalid token");
    });

    await ensureAuthenticated({
      header: () => "Bearer invalid-token",
    } as unknown as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("retorna 401 para usuário inexistente ou inativo", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1, role: UserRole.TEACHER });
    mockFindById.mockResolvedValue(null);

    await ensureAuthenticated({
      header: () => "Bearer valid-token",
    } as unknown as Request, mockRes as Response, mockNext);

    expect(mockFindById).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("usa o papel ativo do cadastro, não o papel declarado no JWT", async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 1, role: UserRole.TEACHER });
    mockFindById.mockResolvedValue({ id: 1, role: UserRole.STUDENT, status: true });
    const req = {
      header: () => "Bearer valid-token",
    } as unknown as Request;

    await ensureAuthenticated(req, mockRes as Response, mockNext);

    expect(req.user).toEqual({ id: 1, role: UserRole.STUDENT });
    expect(mockNext).toHaveBeenCalled();
  });
});
