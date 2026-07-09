import { Request, Response } from "express";
import { findAll } from "./find-all";
import { PostService } from "../../services/post.service";
import { Subject } from "../../entities/enums/subject.enum";
import { IPost } from "../../entities/models/post.interface";

jest.mock("../../services/post.service");
jest.mock("../../../lib/typeorm/typeorm", () => ({
  appDataSource: {
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue({}),
  }
}));

describe("Post Controller - findAll", () => {
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

  it("deve retornar posts com paginação padrão se não especificada", async () => {
    mockReq = {
      query: {},
    };

    const mockPosts: IPost[] = [
      {
        id: 1,
        title: "Título de Teste",
        content: "Conteúdo pedagógico",
        subject: Subject.MATHEMATICS,
        authorId: 1,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    const mockServiceResult = { post: mockPosts, total: 1 };

    jest.spyOn(PostService.prototype, "findAll").mockResolvedValue(mockServiceResult);

    await findAll(mockReq as Request, mockRes as Response, mockNext);

    expect(PostService.prototype.findAll).toHaveBeenCalledWith(1, 10);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockServiceResult);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve retornar posts com paginação personalizada", async () => {
    mockReq = {
      query: { page: "2", limit: "5" },
    };

    const mockServiceResult = { post: [], total: 0 };

    jest.spyOn(PostService.prototype, "findAll").mockResolvedValue(mockServiceResult);

    await findAll(mockReq as Request, mockRes as Response, mockNext);

    expect(PostService.prototype.findAll).toHaveBeenCalledWith(2, 5);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockServiceResult);
  });
});
