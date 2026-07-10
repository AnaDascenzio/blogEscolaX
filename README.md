# Blog da Escola X — Back-end

API REST desenvolvida para a plataforma de blog da rede estadual de ensino, permitindo que professores publiquem conteúdos e alunos os visualizem.

---

## 👥 Integrantes

| Nome |
|------|
| Ana Nicolly Bernardeli Fedirissi Dascenzio |
| Gabriel Angelo da Silva |
| Matheus Guilherme Barbosa do Nascimento |
| Igor Lima Charles |
| Wanderson Jafé Alexandre de Souza |

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** — plataforma de execução
- **TypeScript** — linguagem principal
- **Express** — framework HTTP
- **TypeORM** — ORM para mapeamento objeto-relacional
- **PostgreSQL** — banco de dados relacional
- **Docker / Docker Compose** — containerização
- **Zod** — validação de dados de entrada
- **Jest + ts-jest** — testes unitários
- **GitHub Actions** — CI/CD

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas, respeitando os princípios SOLID:

```
src/
  api/
    controllers/     ← recebe requisições HTTP e retorna respostas
    services/        ← lógica de negócio
    repositories/    ← acesso ao banco de dados
    entities/        ← entidades TypeORM e interfaces
    middlewares/     ← autenticação e autorização
    mappers/         ← conversão entre entidades e DTOs
  dtos/              ← objetos de transferência de dados
  lib/               ← configurações de infraestrutura
  env/               ← validação de variáveis de ambiente
```

---

## 🗃️ Banco de Dados

O banco de dados escolhido foi o **PostgreSQL**, por sua robustez, estabilidade e conformidade estrita com o padrão SQL. É gratuito, de código aberto e possui arquitetura comprovada que garante a integridade dos dados.

### Entidades

**User**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGINT | Chave primária |
| name | VARCHAR(200) | Nome completo |
| email | VARCHAR(255) | E-mail único |
| password | VARCHAR(255) | Senha criptografada |
| role | ENUM | TEACHER ou STUDENT |
| status | BOOLEAN | Ativo/inativo |

**Post**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | BIGINT | Chave primária |
| title | VARCHAR(255) | Título obrigatório |
| content | TEXT | Conteúdo obrigatório |
| summary | TEXT | Resumo opcional |
| imageUrl | VARCHAR(500) | URL de imagem opcional |
| link | VARCHAR(500) | Link externo opcional |
| subject | ENUM | Matéria |
| authorId | BIGINT | FK para User |
| isDeleted | BOOLEAN | Soft delete |

---

## 🚀 Como Executar

### Pré-requisitos
- Docker
- Docker Compose

### Passos

```bash
# Clone o repositório
git clone https://github.com/AnaDascenzio/blogEscolaX.git
cd blogEscolaX

# Configure as variáveis de ambiente
cp .env.example .env

# Suba os containers
docker-compose up
```

A API estará disponível em `http://localhost:3000`.

---

## 📌 Endpoints

### Posts

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| GET | /posts | Lista todos os posts (paginado) | Pública |
| GET | /posts/:id | Busca post por ID | Pública |
| GET | /posts/search?keyword= | Busca por palavra-chave | Pública |
| POST | /posts | Cria novo post | Teacher |
| PATCH | /posts/:id | Edita post | Teacher |
| DELETE | /posts/:id | Remove post (soft delete) | Teacher |

### Users

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| POST | /users | Cria novo usuário | Pública |
| POST | /users/signin | Realiza login e gera token JWT | Pública |
| GET | /users/:id | Busca usuário por ID | Pública |
| GET | /users/email/:email | Busca usuário por e-mail | Pública |
| GET | /users/name/:name | Busca usuário por nome | Pública |
| PUT | /users/:id | Atualiza usuário | Pública |

### Exemplo de requisição — Criar Post

```http
POST /posts
Content-Type: application/json

{
  "title": "Introdução à Álgebra",
  "content": "Conteúdo da aula...",
  "subject": "MATHEMATICS",
  "authorId": 1
}
```

### Exemplo de resposta — 201 Created

```json
{
  "id": "1",
  "title": "Introdução à Álgebra",
  "content": "Conteúdo da aula...",
  "subject": "MATHEMATICS",
  "isDeleted": false,
  "createdAt": "2026-07-06T00:00:00.000Z",
  "updatedAt": "2026-07-06T00:00:00.000Z"
}
```

---

## 🧪 Testes

O projeto utiliza **Jest** com **ts-jest** para testes unitários, com a exibição detalhada de cada caso configurada e cobertura de código expandida para cobrir toda a camada de serviços e roteamento (controladores).

### Cobertura atual
- **Serviços (`PostService`)** — 100% de cobertura (Statements, Branches, Functions, Lines)
- **Controladores de Usuários** — Cobertura completa de rotas (`create`, `signin`, `findById`, `findByEmail`, `findByName`, `update`)
- **Controladores de Posts** — Cobertura completa de rotas (`create`, `findById`, `findAll`, `search`, `update`, `delete`)

### Como rodar

```bash
# Instalar dependências
npm install

# Rodar todos os testes unitários (modo detalhado/verbose)
npm test

# Rodar com relatório de cobertura de código
npm run test:cov
```

---

## ⚙️ CI/CD

O projeto utiliza **GitHub Actions** para automação do pipeline de integração contínua. A cada push ou Pull Request, a esteira executa automaticamente:

1. **Lint** — verificação de qualidade do código com ESLint
2. **Type Check** — validação de tipagem com TypeScript
3. **Build** — compilação do projeto
4. **Testes** — execução dos testes unitários com relatório de cobertura

---

## ⚙️ Variáveis de Ambiente

```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USER=superuser
DATABASE_PASSWORD=superuser123
DATABASE_NAME=blog_db
JWT_SECRET=sua_chave_secreta
```

---

## 📄 Licença

Projeto acadêmico desenvolvido para o Tech Challenge — FIAP Pós-graduação Full Stack.
