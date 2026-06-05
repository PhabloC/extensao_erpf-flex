---
name: entidade
description: Cria ou refatora entities no projeto `backend/` seguindo o padrao do repositorio. Use quando a tarefa envolver mapeamento TypeORM, colunas, timestamps, campos sensiveis, nomes persistidos ou alinhamento entre entity e migration.
metadata:
  short-description: Cria entities no padrao do backend
---

# Entidade

Use esta skill para modelar a estrutura persistida com clareza. A entity deve representar o dado armazenado sem puxar regra de negocio indevida.

## Quando usar

- entity nova
- adicao ou remocao de coluna
- ajuste de campo sensivel
- alinhamento de entity com migration
- refactor de modelagem persistida

## Leitura inicial

- `AGENTS.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/SECURITY.md`
- `docs/ai/DEVELOPMENT_WORKFLOW.md`

## Workflow

### 1. Modele a persistencia com intencao

- use nomes consistentes
- mantenha campos obrigatorios e opcionais claros
- trate timestamps e ids do jeito do repo
- esconda o que for sensivel

### 2. Nao misture responsabilidades

- entity nao deve concentrar regra de negocio de fluxo
- validacao de entrada continua em DTO
- mudanca de schema deve conversar com migration

### 3. Feche com validacao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Exemplos

- "Adicionar phone no user" -> ajustar entity, revisar repository e confirmar migration
- "Marcar password_hash como sensivel" -> evitar exposicao por selecao padrao
