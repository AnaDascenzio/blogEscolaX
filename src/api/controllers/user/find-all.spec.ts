import { Request, Response } from "express";
import { findAll } from "./find-all";
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

describe("User Controller - findAll", () => {
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

  it("lista por papel com paginação e não expõe senha", async () => {
    const user: IUser = {
      id: 1,
      name: "Ana",
      email: "ana@example.com",
      password: "sensitive-hash",
      role: UserRole.TEACHER,
      status: true,
    };
    jest.spyOn(UserService.prototype, "findAll").mockResolvedValue({
      items: [user],
      page: 2,
      limit: 5,
      total: 6,
      totalPages: 2,
    });

    await findAll({
      query: { role: UserRole.TEACHER, page: "2", limit: "5" },
    } as unknown as Request, mockRes as Response, mockNext);

    expect(UserService.prototype.findAll).toHaveBeenCalledWith(2, 5, UserRole.TEACHER);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      items: [{
        id: 1,
        name: "Ana",
        email: "ana@example.com",
        role: UserRole.TEACHER,
        status: true,
      }],
      page: 2,
      limit: 5,
      total: 6,
      totalPages: 2,
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("usa todos os papéis por padrão", async () => {
    jest.spyOn(UserService.prototype, "findAll").mockResolvedValue({
      items: [],
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    });

    await findAll({
      query: {},
    } as unknown as Request, mockRes as Response, mockNext);

    expect(UserService.prototype.findAll).toHaveBeenCalledWith(1, 20, undefined);
  });

  it("rejeita parâmetros de paginação inválidos", async () => {
    await findAll({
      query: { page: "0", limit: "101" },
    } as unknown as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ name: "ZodError" }));
    expect(UserService.prototype.findAll).not.toHaveBeenCalled();
  });
});
