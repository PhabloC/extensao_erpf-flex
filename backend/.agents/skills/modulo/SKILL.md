---
name: modulo
description: Implementa ou refatora modulos no projeto `backend/` seguindo os padroes do repositorio. Use quando a tarefa envolver controller, service, repository, DTO, entity, guard, strategy, eventos, integracoes ou banco.
metadata:
  short-description: Cria modulos NestJS no padrao do repo
---

# Modulo

Use esta skill para trabalho de produto dentro de `backend/`. Ela complementa os arquivos `AGENTS.md` e `docs/ai/*`, nao substitui as regras do repositorio.

## Quando usar

Use esta skill quando o pedido envolver:

- novo modulo em `src/modules`
- controller, service, repository, DTO ou entity
- auth, guard, strategy ou fluxo JWT
- integracao externa, adapter, strategy ou factory
- mudanca de persistencia ou migration
- refatoracao para alinhar DI, SOLID ou Clean Code

## Leitura inicial

Antes de editar codigo, leia o minimo necessario destes arquivos:

- `AGENTS.md`
- `docs/ai/AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/BACKEND_PATTERNS.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/SECURITY.md`
- `docs/ai/QA.md`

Depois disso, abra apenas os arquivos diretamente ligados ao modulo.

## Workflow

### 1. Coloque cada parte na camada certa

- `controller`: rota, DTO, guard e delegacao
- `service`: regra de negocio e orquestracao
- `repository`: persistencia e query
- `dto`: validacao de entrada
- `entities`: representacao persistida
- `common/`: concern transversal
- `patterns/`: strategy, factory, adapter, observer, decorator
- `database/`: migration, seed e data source

### 2. Implemente do jeito do repo

- mantenha controller fino
- use DTO em endpoint
- aplique DI corretamente
- evite regra de negocio no repository
- evite acesso direto ao banco no controller
- para comportamento variavel, prefira strategy ou factory
- para efeito colateral, prefira evento

### 3. Feche com validacao

Se houve mudanca de codigo em `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

Se a mudanca alterar persistencia, confirme se precisa migration.

## Heuristicas rapidas

- Endpoint novo: controller recebe DTO, service decide, repository persiste
- Auth nova: guard e strategy fora da logica da rota
- Integracao externa: esconder SDK por adapter
- Regra com varias variacoes: evitar `switch` grande, usar strategy

## Exemplos

- "Criar modulo de pedidos" -> montar modulo, controller, service, repository, DTOs e entity
- "Proteger rota com JWT" -> aplicar guard ou strategy sem colocar auth dentro do controller
- "Emitir evento ao criar usuario" -> service emite, handler observa
