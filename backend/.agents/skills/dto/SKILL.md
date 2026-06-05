---
name: dto
description: Cria ou refatora DTOs no projeto `backend/` seguindo os padroes do repositorio. Use quando a tarefa envolver validacao com class-validator, transformacao de entrada, contratos de request, parcial para update ou saneamento da borda HTTP.
metadata:
  short-description: Cria DTOs no padrao do backend
---

# DTO

Use esta skill para contratos de entrada claros e validados. O DTO protege a borda HTTP e evita que a regra de negocio receba payload solto.

## Quando usar

- DTO novo
- ajuste de validacao
- create e update DTO
- transformacao de input
- limpeza de contrato de request

## Leitura inicial

- `AGENTS.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/SECURITY.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Modele o contrato de entrada

- use decorators de validacao
- tipagem explicita
- campo opcional so quando fizer sentido
- mensagem e regra coerentes com o caso de uso

### 2. Mantenha a borda limpa

- DTO valida request
- service recebe dado ja estruturado
- entity nao substitui DTO

### 3. Feche com validacao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Exemplos

- "Criar CreateUserDto" -> campos obrigatorios, validacao minima e nomenclatura clara
- "Criar UpdateUserDto" -> parcial coerente sem perder contrato do dominio
