# Modelagem de Banco de Dados - Blog Escola X

## Objetivo

Desenvolver um blog para a rede estadual de ensino onde:

* Professores podem criar, editar, excluir, listar e visualizar postagens.
* Alunos podem apenas visualizar postagens.
* O acesso ao sistema será realizado através de autenticação por e-mail e senha.
* O banco de dados utilizado será PostgreSQL.
* O mapeamento ORM será realizado com TypeORM.
* As chaves primárias utilizarão IDs sequenciais convencionais (BIGINT).

---

# Regras de Negócio

## Usuário

Todo usuário do sistema possui:

* Nome completo
* E-mail único
* Senha criptografada (hash)
* Tipo de usuário

Existem apenas dois tipos:

* ALUNO
* PROFESSOR

---

## Postagem

Uma postagem:

* Possui um único autor (professor)
* Possui título obrigatório
* Possui conteúdo obrigatório
* Pode possuir resumo
* Pode possuir imagem
* Pode possuir link externo relacionado ao conteúdo
* Deve pertencer a uma matéria
* Possui data de criação
* Possui data de atualização

---

# Entidades

## Usuario

| Campo         | Tipo         | Obrigatório |
| ------------- | ------------ | ----------- |
| id            | BIGINT       | Sim         |
| name          | VARCHAR(200) | Sim         |
| email         | VARCHAR(255) | Sim         |
| password      | VARCHAR(255) | Sim         |
| role          | ENUM         | Sim         |
| status        | BOOLEAN(default true)    | Sim         |

### Restrições

```sql
UNIQUE(email)
```

---

## Postagem

| Campo        | Tipo         | Obrigatório |
| ------------ | ------------ | ----------- |
| id           | BIGINT       | Sim         |
| title        | VARCHAR(255) | Sim         |
| content      | TEXT         | Sim         |
| resumo       | TEXT         | Não         |
| imagemUrl    | VARCHAR(500) | Não         |
| link         | VARCHAR(500) | Não         |
| subject      | ENUM         | Sim         |
| author_id    | BIGINT       | Sim         |
| created_at   | TIMESTAMP    | Sim         |
| updated_at   | TIMESTAMP    | Sim         |
 |
---

# Enum TipoUsuario

```typescript
export enum TipoUsuario {
  ALUNO = "ALUNO",
  PROFESSOR = "PROFESSOR"
}
```

---

# Enum Materia

```typescript
export enum Materia {
  PORTUGUES = "PORTUGUES",
  MATEMATICA = "MATEMATICA",
  HISTORIA = "HISTORIA",
  GEOGRAFIA = "GEOGRAFIA",
  BIOLOGIA = "BIOLOGIA",
  FISICA = "FISICA",
  QUIMICA = "QUIMICA",
  INGLES = "INGLES",
  FILOSOFIA = "FILOSOFIA",
  SOCIOLOGIA = "SOCIOLOGIA",
  EDUCACAO_FISICA = "EDUCACAO_FISICA",
  ARTES = "ARTES"
}
```

---

# Relacionamentos

## Usuario → Postagem

Um professor pode criar várias postagens.

Uma postagem pertence a apenas um professor.

Cardinalidade:

```text
Usuario (Professor) 1 ---- N Postagem
```

---

# Índices Recomendados

```sql
CREATE UNIQUE INDEX idx_usuario_email
ON usuario(email);

CREATE INDEX idx_postagem_professor
ON postagem(professor_id);

CREATE INDEX idx_postagem_materia
ON postagem(materia);

CREATE INDEX idx_postagem_data_criacao
ON postagem(created_at);
```

---

# Estratégia de Implementação

## Ordem recomendada

1. Criar enums
2. Criar entidade Usuario
3. Criar entidade Postagem
4. Criar migration inicial

---

# Outras especificações

1. O projeto será desenvolvido inteiramente em inglês




