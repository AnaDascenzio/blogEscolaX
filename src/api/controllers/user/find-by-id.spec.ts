import { Request, Response } from "express";
import { findById } from "./find-by-id";
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

describe("User Controller - findById", () => {
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

  it("deve retornar o usuário com sucesso se encontrado", async () => {
    mockReq = {
      params: { id: "1" },
    };

    const mockUser: IUser = {
      id: 1,
      name: "John Doe",
      email: "john@escola.com",
      password: "hashed_password",
      role: UserRole.TEACHER,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(UserService.prototype, "findById").mockResolvedValue(mockUser);

    await findById(mockReq as Request, mockRes as Response, mockNext);

    expect(UserService.prototype.findById).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
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

  it("deve retornar 404 se o usuário não for encontrado", async () => {
    mockReq = {
      params: { id: "99" },
    };

    jest.spyOn(UserService.prototype, "findById").mockResolvedValue(null);

    await findById(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
