import { Request, Response } from "express";
import { update } from "./update";
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

describe("Post Controller - update", () => {
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

  it("deve atualizar um post com sucesso", async () => {
    const requestBody = {
      title: "Título de Teste Atualizado",
      content: "Conteúdo pedagógico atualizado",
      subject: Subject.MATHEMATICS,
      authorId: 1,
    };

    mockReq = {
      params: { id: "1" },
      body: requestBody,
    };

    const mockUpdatedPost: IPost = {
      id: 1,
      title: requestBody.title,
      content: requestBody.content,
      subject: requestBody.subject,
      authorId: requestBody.authorId,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    jest.spyOn(PostService.prototype, "update").mockResolvedValue(mockUpdatedPost);

    await update(mockReq as Request, mockRes as Response, mockNext);

    expect(PostService.prototype.update).toHaveBeenCalledWith(1, requestBody);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockUpdatedPost);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve retornar 404 se o post a ser atualizado não for encontrado", async () => {
    mockReq = {
      params: { id: "99" },
      body: {
        title: "Título de Teste",
        content: "Conteúdo",
        subject: Subject.MATHEMATICS,
        authorId: 1,
      },
    };

    jest.spyOn(PostService.prototype, "update").mockResolvedValue(null);

    await update(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Post not found" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
