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
    expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedUser);
    expect(mockNext).not.toHaveBeenCalled();
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
