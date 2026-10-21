import { Request, Response } from "express";
import { remove } from "./delete";
import { UserService } from "../../services/user.service";

jest.mock("../../services/user.service");
jest.mock("../../../lib/typeorm/typeorm", () => ({
  appDataSource: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
  }
}));

describe("User Controller - remove", () => {
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("inativa o cadastro e retorna 204", async () => {
    jest.spyOn(UserService.prototype, "deactivate").mockResolvedValue(true);

    await remove({
      params: { id: "1" },
    } as unknown as Request, mockRes as Response, mockNext);

    expect(UserService.prototype.deactivate).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("retorna 404 para cadastro inexistente ou já inativo", async () => {
    jest.spyOn(UserService.prototype, "deactivate").mockResolvedValue(false);

    await remove({
      params: { id: "1" },
    } as unknown as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Usuário não encontrado." });
  });
});
