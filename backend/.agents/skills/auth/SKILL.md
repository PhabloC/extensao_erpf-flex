---
name: auth
description: Cria ou refatora autenticacao no projeto `backend/` seguindo os padroes do repositorio. Use quando a tarefa envolver JWT, login, guard, strategy, hashing com bcrypt, endpoints protegidos ou fluxo de autorizacao.
metadata:
  short-description: Cria fluxos de auth no backend
---

# Auth

Use esta skill para fluxo de autenticacao e autorizacao no backend. O foco e manter JWT, guard e strategy organizados, sem espalhar auth pela aplicacao.

## Quando usar

- login
- validacao de token
- guard de rota
- strategy JWT
- hashing de senha
- refactor de fluxo protegido

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/SECURITY.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Separe responsabilidades

- controller recebe credencial e delega
- service autentica e gera resposta
- guard protege endpoint
- strategy valida token

### 2. Reforce seguranca basica

- use bcrypt para senha
- mantenha segredo em config ou env
- nao retorne dado sensivel
- proteja endpoint de acordo com a regra do modulo

### 3. Feche com validacao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Exemplos

- "Criar login" -> controller recebe DTO, service valida usuario e assina JWT
- "Proteger rota" -> aplicar guard e garantir strategy consistente
