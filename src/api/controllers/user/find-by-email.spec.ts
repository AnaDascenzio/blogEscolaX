import { Request, Response } from "express";
import { findByEmail } from "./find-by-email";
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

describe("User Controller - findByEmail", () => {
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

  it("deve retornar o usuário com sucesso se encontrado por e-mail", async () => {
    mockReq = {
      params: { email: "john@escola.com" },
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

    jest.spyOn(UserService.prototype, "findByEmail").mockResolvedValue(mockUser);

    await findByEmail(mockReq as Request, mockRes as Response, mockNext);

    expect(UserService.prototype.findByEmail).toHaveBeenCalledWith("john@escola.com");
    expect(mockRes.status).toHaveBeenCalledWith(201); // controller sets 201 status for email lookup
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

  it("deve retornar 404 se o usuário não for encontrado por e-mail", async () => {
    mockReq = {
      params: { email: "nonexistent@escola.com" },
    };

    jest.spyOn(UserService.prototype, "findByEmail").mockResolvedValue(null);

    await findByEmail(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
