import { Request, Response } from "express";
import { update } from "./update";
import { Subject } from "../../entities/enums/subject.enum";
import { IPost } from "../../entities/models/post.interface";

const mockPostService = {
  update: jest.fn(),
};

jest.mock("../../services/post.service", () => ({
  PostService: jest.fn().mockImplementation(() => mockPostService),
}));

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
      ...requestBody,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    } as IPost;

    mockPostService.update.mockResolvedValue(mockUpdatedPost);

    await update(mockReq as Request, mockRes as Response, mockNext);


    expect(mockPostService.update).toHaveBeenCalledWith(
      1, 
      expect.objectContaining({
        title: "Título de Teste Atualizado",
        content: "Conteúdo pedagógico atualizado",
        subject: Subject.MATHEMATICS
      })
    );
    
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      title: "Título de Teste Atualizado",
      content: "Conteúdo pedagógico atualizado"
    }));
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

    mockPostService.update.mockResolvedValue(null);

    await update(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Post not found" });
    expect(mockNext).not.toHaveBeenCalled();
  });
});