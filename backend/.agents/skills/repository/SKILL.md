---
name: repository
description: Cria ou refatora repositories no projeto `backend/` seguindo os padroes do repositorio. Use quando a tarefa envolver acesso a dados, persistencia, query, encapsulamento de ORM, selecao de implementacao ou mudanca de contrato entre service e banco.
metadata:
  short-description: Cria repositories no padrao do backend
---

# Repository

Use esta skill para a camada de persistencia. O repository deve esconder detalhe de banco e entregar um contrato claro para o service.

## Quando usar

- novo repository
- ajuste de query
- troca de implementacao
- encapsulamento de ORM
- refactor de acesso a dados espalhado

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/SECURITY.md`

## Workflow

### 1. Defina um contrato enxuto

- exponha apenas o necessario para o service
- mantenha retorno previsivel
- evite vazar detalhe de ORM

### 2. Proteja a camada de dominio

- nao coloque regra de negocio aqui
- nao retorne dado sensivel sem necessidade
- esconda detalhes de persistencia por implementacao ou provider

### 3. Feche com validacao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Exemplos

- "Criar busca por email" -> repository expone metodo focado, service decide o que fazer com o resultado
- "Trocar implementacao in-memory por typeorm" -> manter contrato estavel para o resto do modulo
