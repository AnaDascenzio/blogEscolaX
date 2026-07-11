import { PostService } from "./post.service";
import { IPost } from "../entities/models/post.interface";
import { IUser } from "../entities/models/user.interface";
import { Subject } from "../entities/enums/subject.enum";
import { UserRole } from "../entities/enums/user-roles.enum";
import type { IPostRepository } from "../repositories/interfaces/post.repository.interface";
import type { IUserRepository } from "../repositories/interfaces/user.repository.interface";

type PostCreateInput = {
  title: string;
  content: string;
  subject: Subject;
  authorId: number;
  summary?: string;
  imageUrl?: string;
  link?: string;
};

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
      findByEmail: jest.fn(),
      findByName: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    postService = new PostService(mockPostRepository, mockUserRepository);
  });

  describe("create", () => {
    it("deve criar um post com sucesso quando o autor existir", async () => {
      const dto: PostCreateInput = {
        title: "Título de Teste",
        content: "Conteúdo pedagógico",
        subject: Subject.MATHEMATICS,
        authorId: 1,
        summary: "Resumo do post",
        imageUrl: "http://imagem.com",
        link: "http://link.com"
      };

      const mockAuthor: IUser = {
        id: 1,
        name: "Professor Teste",
        email: "prof@escola.com",
        password: "123456",
        role: UserRole.TEACHER,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockSavedPost: IPost = {
        id: 10,
        title: dto.title,
        content: dto.content,
        subject: dto.subject,
        authorId: dto.authorId,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(dto.summary !== undefined ? { summary: dto.summary } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
        ...(dto.link !== undefined ? { link: dto.link } : {})
      };

      mockUserRepository.findById.mockResolvedValue(mockAuthor);
      mockPostRepository.create.mockResolvedValue(mockSavedPost);

      const result = await postService.create(dto);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(dto.authorId);
      expect(mockPostRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockSavedPost);
    });

    it("deve lançar um erro se o autor não for encontrado", async () => {
      const dto: PostCreateInput = { title: "A", content: "B", subject: Subject.HISTORY, authorId: 99 };
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(postService.create(dto)).rejects.toThrow("Author not found");
    });

    it("deve criar um post com sucesso mesmo sem os campos opcionais", async () => {
      const dto: PostCreateInput = {
        title: "Título Sem Opcionais",
        content: "Conteúdo",
        subject: Subject.HISTORY,
        authorId: 1
      };

      const mockAuthor: IUser = {
        id: 1,
        name: "Professor Teste",
        email: "prof@escola.com",
        password: "123456",
        role: UserRole.TEACHER,
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockSavedPost: IPost = {
        id: 11,
        title: dto.title,
        content: dto.content,
        subject: dto.subject,
        authorId: dto.authorId,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserRepository.findById.mockResolvedValue(mockAuthor);
      mockPostRepository.create.mockResolvedValue(mockSavedPost);

      const result = await postService.create(dto);

      expect(result.summary).toBeUndefined();
      expect(result.imageUrl).toBeUndefined();
      expect(result.link).toBeUndefined();
    });
  });

  describe("findById", () => {
    it("deve retornar um post ativo pelo ID sem a senha do autor", async () => {
      const mockPostComSenha: IPost = { 
        id: 1, 
        title: "A", 
        content: "B", 
        subject: Subject.MATHEMATICS, 
        authorId: 1, 
        isDeleted: false, 
        author: { 
          id: 1, name: "Prof", email: "p@e.com", password: "SENHA", role: UserRole.TEACHER, status: true 
        } 
      };
      
      mockPostRepository.findActiveById.mockResolvedValue(mockPostComSenha);

      const result = await postService.findById(1);
      const author = result?.author as IUser | undefined;
      
      expect(author).toBeDefined();
      if (!author) {
        throw new Error("Author should be defined");
      }
      expect(author).not.toHaveProperty('password');
      expect(author).toHaveProperty('name', 'Prof');
    });
  });

  describe("findAll", () => {
    it("deve retornar uma lista paginada de posts ativos sem a senha do autor", async () => {
      const mockPostComSenha: IPost = {
        id: 1,
        title: "Título",
        content: "Conteúdo",
        subject: Subject.MATHEMATICS,
        authorId: 1,
        isDeleted: false,
        author: {
          id: 1,
          name: "Professor",
          email: "prof@escola.com",
          password: "HASH_DA_SENHA_AQUI", 
          role: UserRole.TEACHER,
          status: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      };

      const mockResult = { post: [mockPostComSenha], total: 1 };
      mockPostRepository.findAllActive.mockResolvedValue(mockResult);

      const result = await postService.findAll(1, 10);
      const author = result.post[0]?.author as IUser | undefined;

      expect(author).toBeDefined();
      if (!author) {
        throw new Error("Author should be defined");
      }
      expect(author).toHaveProperty('name', 'Professor');
      expect(author).not.toHaveProperty('password');
    });
  });

  describe("search", () => {
    it("deve buscar posts por palavra-chave e garantir que a senha do autor não retorne", async () => {
      const mockPostComSenha: IPost = {
        id: 1,
        title: "Node.js",
        content: "Conteúdo",
        subject: Subject.MATHEMATICS,
        authorId: 1,
        isDeleted: false,
        author: {
          id: 1,
          name: "Professor",
          email: "prof@escola.com",
          password: "SENHA_SECRETA",
          role: UserRole.TEACHER,
          status: true,
        }
      };

      mockPostRepository.searchByKeyword.mockResolvedValue([mockPostComSenha]);

      const result = await postService.search("Node");
      const author = result[0]?.author as IUser | undefined;
      
      expect(author).toBeDefined();
      if (!author) {
        throw new Error("Author should be defined");
      }
      expect(author).not.toHaveProperty('password');
      expect(author).toHaveProperty('name', 'Professor');
    });
  });

  describe("update", () => {
    it("deve atualizar um post com sucesso", async () => {
      const postId = 1;
      const dto = { title: "Novo Título", content: "B", subject: Subject.MATHEMATICS, authorId: 1 };
      const existingPost: IPost = { id: postId, title: "Antigo", content: "A", subject: Subject.MATHEMATICS, authorId: 1, isDeleted: false, createdAt: new Date() };
      const mockUpdatedPost: IPost = { ...existingPost, ...dto, updatedAt: new Date() };

      mockPostRepository.findActiveById.mockResolvedValue(existingPost);
      mockPostRepository.update.mockResolvedValue(mockUpdatedPost);

    const result = await postService.update(postId, dto as unknown as Parameters<PostService["update"]>[1]);
      
      expect(mockPostRepository.findActiveById).toHaveBeenCalledWith(postId);
      expect(result).toEqual(mockUpdatedPost);
    });

    it("deve retornar null se o post não existir ao tentar atualizar", async () => {
      mockPostRepository.findActiveById.mockResolvedValue(null);

    const result = await postService.update(999, {} as unknown as Parameters<PostService["update"]>[1]);
      
      expect(result).toBeNull();
      expect(mockPostRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("remove", () => {
    it("deve efetuar soft delete se o post existir", async () => {
      const mockPost: IPost = { id: 1, title: "A", content: "B", subject: Subject.MATHEMATICS, authorId: 1, isDeleted: false, createdAt: new Date(), updatedAt: new Date() };
      mockPostRepository.findActiveById.mockResolvedValue(mockPost);
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
