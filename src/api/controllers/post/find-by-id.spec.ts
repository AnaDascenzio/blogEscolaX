import { Request, Response } from "express";
import { findById } from "./find-by-id";
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

describe("Post Controller - findById", () => {
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

  it("deve retornar o post com sucesso se encontrado", async () => {
    mockReq = {
      params: { id: "1" },
    };

    const mockPost: IPost = {
      id: 1,
      title: "Título de Teste",
      content: "Conteúdo pedagógico",
      subject: Subject.MATHEMATICS,
      authorId: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    jest.spyOn(PostService.prototype, "findById").mockResolvedValue(mockPost);

    await findById(mockReq as Request, mockRes as Response, mockNext);

    expect(PostService.prototype.findById).toHaveBeenCalledWith(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 1,
      title: "Título de Teste",
      content: "Conteúdo pedagógico",
      subject: Subject.MATHEMATICS,
      authorId: 1,
      isDeleted: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve retornar 404 se o post não for encontrado", async () => {
    mockReq = {
      params: { id: "99" },
    };

    jest.spyOn(PostService.prototype, "findById").mockResolvedValue(null);

    await findById(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Post not found" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
