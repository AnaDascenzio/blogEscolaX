import { Request, Response } from "express";
import { update } from "./update";
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

describe("User Controller - update", () => {
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

  it("deve atualizar o usuário com sucesso", async () => {
    mockReq = {
      params: { id: "1" },
      body: { name: "John Doe Updated" },
    };

    const mockUpdatedUser: IUser = {
      id: 1,
      name: "John Doe Updated",
      email: "john@escola.com",
      password: "hashed_password",
      role: UserRole.TEACHER,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(UserService.prototype, "update").mockResolvedValue(mockUpdatedUser);

    await update(mockReq as Request, mockRes as Response, mockNext);

    expect(UserService.prototype.update).toHaveBeenCalledWith(1, { name: "John Doe Updated" });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 1,
      name: "John Doe Updated",
      email: "john@escola.com",
      role: UserRole.TEACHER,
      status: true,
      posts: [],
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve normalizar o e-mail para minúsculas na atualização", async () => {
    mockReq = {
      params: { id: "1" },
      body: { email: "JoAo@Escola.COM" },
    };

    const mockUpdatedUser: IUser = {
      id: 1,
      name: "John Doe",
      email: "joao@escola.com",
      password: "hashed_password",
      role: UserRole.TEACHER,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(UserService.prototype, "update").mockResolvedValue(mockUpdatedUser);

    await update(mockReq as Request, mockRes as Response, mockNext);

    expect(UserService.prototype.update).toHaveBeenCalledWith(1, { email: "joao@escola.com" });
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it("deve chamar next com erro quando o e-mail já estiver em uso", async () => {
    mockReq = {
      params: { id: "1" },
      body: { email: "duplicado@escola.com" },
    };

    const duplicateError = new Error("E-mail já cadastrado.");
    jest.spyOn(UserService.prototype, "update").mockRejectedValue(duplicateError);

    await update(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(duplicateError);
  });

  it("deve retornar 404 se o usuário a ser atualizado não for encontrado", async () => {
    mockReq = {
      params: { id: "99" },
      body: { name: "Jane" },
    };

    jest.spyOn(UserService.prototype, "update").mockResolvedValue(null);

    await update(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Usuário não encontrado." });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
