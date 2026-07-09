import { Request, Response } from "express";
import { remove } from "./delete";
import { PostService } from "../../services/post.service";

jest.mock("../../services/post.service");
jest.mock("../../../lib/typeorm/typeorm", () => ({
  appDataSource: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
  }
}));

describe("Post Controller - remove", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  it("deve remover um post com sucesso", async () => {
    mockReq = {
      params: { id: "1" },
    };

    jest.spyOn(PostService.prototype, "remove").mockResolvedValue(undefined);

    await remove(mockReq as Request, mockRes as Response, mockNext);

    expect(PostService.prototype.remove).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(204);
    expect(mockRes.send).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro se o serviço de remoção falhar", async () => {
    mockReq = {
      params: { id: "99" },
    };

    const serviceError = new Error("Post not found");
    jest.spyOn(PostService.prototype, "remove").mockRejectedValue(serviceError);

    await remove(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(serviceError);
    expect(mockRes.status).not.toHaveBeenCalled();
  });
});
