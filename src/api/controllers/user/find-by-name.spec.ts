import { Request, Response } from "express";
import { findByName } from "./find-by-name";
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

describe("User Controller - findByName", () => {
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

  it("deve retornar o usuário com sucesso se encontrado por nome", async () => {
    mockReq = {
      params: { name: "John" },
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

    jest.spyOn(UserService.prototype, "findByName").mockResolvedValue(mockUser);

    await findByName(mockReq as Request, mockRes as Response, mockNext);

    expect(UserService.prototype.findByName).toHaveBeenCalledWith("John");
    expect(mockRes.status).toHaveBeenCalledWith(201); // controller sets 201 status for name lookup
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

  it("deve retornar 404 se o usuário não for encontrado por nome", async () => {
    mockReq = {
      params: { name: "Nonexistent" },
    };

    jest.spyOn(UserService.prototype, "findByName").mockResolvedValue(null);

    await findByName(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
