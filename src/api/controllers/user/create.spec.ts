import { Request, Response } from "express";
import { create } from "./create";
import { UserService } from "../../services/user.service";
import { UserRole } from "../../entities/enums/user-roles.enum";
import { IUser } from "../../entities/models/user.interface";

jest.mock("../../services/user.service");
jest.mock("../../../lib/typeorm/typeorm", () => ({
  appDataSource: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
  }
}));
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password"),
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

  it("deve criar um usuário com sucesso", async () => {
    const requestBody = {
      name: "John Doe",
      email: "john@escola.com",
      password: "password123",
      role: UserRole.TEACHER,
    };

    mockReq = {
      body: requestBody,
    };

    const mockCreatedUser: IUser = {
      id: 1,
      name: requestBody.name,
      email: requestBody.email,
      password: "hashed_password",
      role: requestBody.role,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(UserService.prototype, "create").mockResolvedValue(mockCreatedUser);

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 1,
      name: "John Doe",
      email: "john@escola.com",
      role: UserRole.TEACHER,
      status: true,
      posts: [],
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando a validação falhar", async () => {
    mockReq = {
      body: {
        name: "John Doe",
        // email inválido ou faltando
        password: "123",
      },
    };

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando o serviço falhar", async () => {
    const requestBody = {
      name: "John Doe",
      email: "john@escola.com",
      password: "password123",
      role: UserRole.TEACHER,
    };

    mockReq = {
      body: requestBody,
    };

    const serviceError = new Error("E-mail já cadastrado.");
    jest.spyOn(UserService.prototype, "create").mockRejectedValue(serviceError);

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(serviceError);
  });
});
