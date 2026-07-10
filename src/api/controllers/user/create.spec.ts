import { Request, Response } from "express";
import { hash } from "bcryptjs";
import { create } from "./create";
import { UserRole } from "../../entities/enums/user-roles.enum";
import { IUser } from "../../entities/models/user.interface";

const mockUserService = {
  create: jest.fn(),
};

jest.mock("../../services/user.service", () => ({
  UserService: jest.fn().mockImplementation(() => mockUserService),
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

jest.mock("../../../lib/typeorm/typeorm", () => ({
  appDataSource: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
  }
}));

describe("User Controller - create", () => {
  let mockReq: Partial<Request>;
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

  it("deve criar um usuario com sucesso", async () => {
    const userData = {
      name: "Aluno Teste",
      email: "aluno@escola.com",
      password: "senha123",
      role: UserRole.STUDENT
    };

    mockReq = {
      body: userData
    };

    (hash as jest.Mock).mockResolvedValue("senha_hasheada");

    const mockCreatedUser: IUser = {
      id: 1,
      name: userData.name,
      email: userData.email,
      password: "senha_hasheada",
      role: userData.role,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUserService.create.mockResolvedValue(mockCreatedUser);

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(hash).toHaveBeenCalledWith(userData.password, 10);
    expect(mockUserService.create).toHaveBeenCalledWith({
      ...userData,
      password: "senha_hasheada"
    });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it("deve chamar next com erro quando o servico falhar", async () => {
    const userData = {
      name: "Aluno Teste",
      email: "aluno@escola.com",
      password: "senha123",
      role: UserRole.STUDENT
    };

    mockReq = {
      body: userData
    };

    (hash as jest.Mock).mockResolvedValue("senha_hasheada");

    const serviceError = new Error("Email already in use");
    mockUserService.create.mockRejectedValue(serviceError);

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(serviceError);
  });
});
