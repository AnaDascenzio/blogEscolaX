import { Request, Response } from "express";
import { create } from "./create";
import { Subject } from "../../entities/enums/subject.enum";
import { IPost } from "../../entities/models/post.interface";

const mockPostService = {
  create: jest.fn(),
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
    const postData = {
      title: "Título de Teste",
      content: "Conteúdo pedagógico",
      subject: Subject.MATHEMATICS,
      summary: "Resumo do post",
      imageUrl: "http://imagem.com",
      link: "http://link.com"
    };

    mockReq = { 
        body: postData,
        user: { id: 1 } as any 
    };

    const mockSavedPost: IPost = {
      id: 10,
      ...postData,
      authorId: 1,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    } as IPost;

    mockPostService.create.mockResolvedValue(mockSavedPost);

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(mockPostService.create).toHaveBeenCalledWith({
        ...postData,
        authorId: 1
    });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalled();
  });

  it("deve chamar next com erro quando o serviço falhar", async () => {
    const validBody = {
      title: "Título",
      content: "Conteúdo",
      subject: Subject.MATHEMATICS
    };
    
    mockReq = { 
      body: validBody,
      user: { id: 1 } as any
    };
    
    const serviceError = new Error("Author not found");
    mockPostService.create.mockRejectedValue(serviceError);

    await create(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(serviceError);
  });
});