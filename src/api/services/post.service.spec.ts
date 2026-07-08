import { PostService } from "./post.service";
import { IPostRepository } from "../repositories/interfaces/post.repository.interface";
import { IUserRepository } from "../repositories/interfaces/user.repository.interface";
import { CreatePostDTO } from "../../dtos/post/create-post.dto";
import { IPost } from "../entities/models/post.interface";

describe("PostService", () => {
  let postService: PostService;
  let mockPostRepository: jest.Mocked<IPostRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockPostRepository = {
      create: jest.fn(),
      findActiveById: jest.fn(),
      findAllActive: jest.fn(),
      searchByKeyword: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<IPostRepository>;

    mockUserRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    postService = new PostService(mockPostRepository, mockUserRepository);
  });

  describe("create", () => {
    it("deve criar um post com sucesso quando o autor existir", async () => {
      const dto: CreatePostDTO = {
        title: "Título de Teste",
        content: "Conteúdo pedagógico",
        subject: "Matemática" as any,
        authorId: 1,
        summary: "Resumo do post",
        imageUrl: "http://imagem.com",
        link: "http://link.com"
      };

      const mockAuthor = { id: 1, name: "Professor Teste", email: "prof@escola.com" };
      const mockSavedPost = { id: 10, ...dto, isDeleted: false, createdAt: new Date(), updatedAt: new Date() };

      mockUserRepository.findById.mockResolvedValue(mockAuthor as any);
      mockPostRepository.create.mockResolvedValue(mockSavedPost as any);

      const result = await postService.create(dto);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(dto.authorId);
      expect(mockPostRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockSavedPost);
    });

    it("deve lançar um erro se o autor não for encontrado", async () => {
      const dto: CreatePostDTO = { title: "A", content: "B", subject: "C" as any, authorId: 99 };
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(postService.create(dto)).rejects.toThrow("Author not found");
    });

    it("deve criar um post com sucesso mesmo sem os campos opcionais", async () => {
      const dto: CreatePostDTO = {
        title: "Título Sem Opcionais",
        content: "Conteúdo",
        subject: "História" as any,
        authorId: 1
      };

      const mockAuthor = { id: 1, name: "Professor Teste", email: "prof@escola.com" };
      const mockSavedPost = { id: 11, ...dto, isDeleted: false, createdAt: new Date(), updatedAt: new Date() };

      mockUserRepository.findById.mockResolvedValue(mockAuthor as any);
      mockPostRepository.create.mockResolvedValue(mockSavedPost as any);

      const result = await postService.create(dto);

      expect(result.summary).toBeUndefined();
      expect(result.imageUrl).toBeUndefined();
      expect(result.link).toBeUndefined();
    });
  });

  describe("findById", () => {
    it("deve retornar um post ativo pelo ID", async () => {
      const mockPost = { id: 1, title: "A", content: "B", subject: "C" as any, authorId: 1, isDeleted: false, createdAt: new Date(), updatedAt: new Date() };
      mockPostRepository.findActiveById.mockResolvedValue(mockPost as any);

      const result = await postService.findById(1);
      expect(result).toEqual(mockPost);
    });
  });

  describe("findAll", () => {
    it("deve retornar uma lista paginada de posts ativos", async () => {
      const mockResult = { post: [], total: 0 };
      mockPostRepository.findAllActive.mockResolvedValue(mockResult as any);

      const result = await postService.findAll(1, 10);
      expect(result).toEqual(mockResult);
    });
  });

  describe("search", () => {
    it("deve buscar posts por palavra-chave", async () => {
      const mockPosts: IPost[] = [];
      mockPostRepository.searchByKeyword.mockResolvedValue(mockPosts);

      const result = await postService.search("Node");
      expect(result).toEqual(mockPosts);
    });
  });

  describe("update", () => {
    it("deve atualizar um post com sucesso", async () => {
      const mockUpdatedPost = { id: 1, title: "Novo Título", content: "B", subject: "C" as any, authorId: 1, isDeleted: false, createdAt: new Date(), updatedAt: new Date() };
      mockPostRepository.update.mockResolvedValue(mockUpdatedPost as any);

      const result = await postService.update(1, { title: "Novo Título" });
      expect(result).toEqual(mockUpdatedPost);
    });
  });

  describe("remove", () => {
    it("deve efetuar soft delete se o post existir", async () => {
      const mockPost = { id: 1, title: "A", content: "B", subject: "C" as any, authorId: 1, isDeleted: false, createdAt: new Date(), updatedAt: new Date() };
      mockPostRepository.findActiveById.mockResolvedValue(mockPost as any);
      mockPostRepository.softDelete.mockResolvedValue(undefined);

      await postService.remove(1);

      expect(mockPostRepository.findActiveById).toHaveBeenCalledWith(1);
      expect(mockPostRepository.softDelete).toHaveBeenCalledWith(1);
    });

    it("deve lançar erro se o post não existir ao tentar remover", async () => {
      mockPostRepository.findActiveById.mockResolvedValue(null);

      await expect(postService.remove(1)).rejects.toThrow("Post not found");
    });
  });
});