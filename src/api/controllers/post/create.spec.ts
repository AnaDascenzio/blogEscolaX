import { Request, Response } from "express";
import { create } from "./create";
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

describe("Post Controller - create", () => {
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

  it("deve criar um post com sucesso", async () => {
    const requestBody = {
      title: "Título de Teste",
      content: "Conteúdo pedagógico",
      subject: Subject.MATHEMATICS,
      authorId: 1,
      summary: "Resumo do post",
      imageUrl: "http://imagem.com",
      link: "http://link.com"
    };

    mockReq = {
      body: requestBody,
    };

    const mockSavedPost: IPost = {
      id: 10,
      title: requestBody.title,
      content: requestBody.content,
      subject: requestBody.subject,
      authorId: requestBody.authorId,
      isDeleted: false,
      summary: requestBody.summary,
      imageUrl: requestBody.imageUrl,
      link: requestBody.link,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    jest.spyOn(PostService.prototype, "create").mockResolvedValue(mockSavedPost);

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(PostService.prototype.create).toHaveBeenCalledWith(requestBody);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 10,
      title: "Título de Teste",
      content: "Conteúdo pedagógico",
      subject: Subject.MATHEMATICS,
      authorId: 1,
      isDeleted: false,
      summary: "Resumo do post",
      imageUrl: "http://imagem.com",
      link: "http://link.com",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando a validação do post falhar", async () => {
    mockReq = {
      body: {
        // faltando title
        content: "Conteúdo pedagógico",
        subject: Subject.MATHEMATICS,
        authorId: 1
      },
    };

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("deve chamar next com erro quando o serviço falhar", async () => {
    const requestBody = {
      title: "Título de Teste",
      content: "Conteúdo pedagógico",
      subject: Subject.MATHEMATICS,
      authorId: 1
    };

    mockReq = {
      body: requestBody,
    };

    const serviceError = new Error("Author not found");
    jest.spyOn(PostService.prototype, "create").mockRejectedValue(serviceError);

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(serviceError);
  });
});
