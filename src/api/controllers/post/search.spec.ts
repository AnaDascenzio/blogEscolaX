import { Request, Response } from "express";
import { search } from "./search";
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

describe("Post Controller - search", () => {
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

  it("deve buscar posts por palavra-chave com sucesso", async () => {
    mockReq = {
      query: { keyword: "matemática" },
    };

    const mockPosts: IPost[] = [
      {
        id: 1,
        title: "Título de Teste",
        content: "Conteúdo pedagógico de matemática",
        subject: Subject.MATHEMATICS,
        authorId: 1,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    jest.spyOn(PostService.prototype, "search").mockResolvedValue(mockPosts);

    await search(mockReq as Request, mockRes as Response, mockNext);

    expect(PostService.prototype.search).toHaveBeenCalledWith("matemática");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockPosts);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve retornar 400 se keyword estiver faltando ou for vazia", async () => {
    mockReq = {
      query: { keyword: "" },
    };

    await search(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Keyword is required" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
