import { Request, Response } from "express";
import { signin } from "./signin";
import { UserService } from "../../services/user.service";
import { UserRole } from "../../entities/enums/user-roles.enum";
import { IUser } from "../../entities/models/user.interface";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";

jest.mock("../../services/user.service");
jest.mock("../../../lib/typeorm/typeorm", () => ({
  appDataSource: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
  }
}));
jest.mock("jsonwebtoken");
jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}));

describe("User Controller - signin", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockUser: IUser;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@escola.com",
      password: "hashed_password",
      role: UserRole.TEACHER,
      status: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    process.env.JWT_SECRET = "test_jwt_secret";
  });

  it("deve realizar login com sucesso e retornar um token", async () => {
    mockReq = {
      body: {
        email: "john@escola.com",
        password: "password123",
      },
    };

    jest.spyOn(UserService.prototype, "signin").mockResolvedValue(mockUser);
    (compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("mocked_jwt_token");

    await signin(mockReq as Request, mockRes as Response);

    expect(UserService.prototype.signin).toHaveBeenCalledWith("john@escola.com");
    expect(compare).toHaveBeenCalledWith("password123", "hashed_password");
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      },
      "test_jwt_secret",
      { expiresIn: "1d" }
    );
    expect(mockRes.json).toHaveBeenCalledWith({ token: "mocked_jwt_token" });
  });

  it("deve retornar 404 se o usuário não for encontrado", async () => {
    mockReq = {
      body: {
        email: "nonexistent@escola.com",
        password: "password123",
      },
    };

    jest.spyOn(UserService.prototype, "signin").mockResolvedValue(null);

    await signin(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("deve retornar 401 se as credenciais forem inválidas", async () => {
    mockReq = {
      body: {
        email: "john@escola.com",
        password: "wrong_password",
      },
    };

    jest.spyOn(UserService.prototype, "signin").mockResolvedValue(mockUser);
    (compare as jest.Mock).mockResolvedValue(false);

    await signin(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });
});
