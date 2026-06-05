---
name: tabela
description: Cria ou refatora tabelas no projeto `frontend/` seguindo o padrao do repositorio. Use quando a tarefa envolver listagem, colunas, acoes por linha, estados de loading e empty, filtros, paginacao ou composicao a partir de `src/ui/Table`.
metadata:
  short-description: Cria tabelas e listagens no frontend
---

# Tabela

Use esta skill para montar listagens sem transformar o componente de tabela em lugar de regra de negocio.

## Quando usar

- listagem nova
- tabela com acoes por linha
- empty state, loading state ou error state
- paginacao ou filtro
- refactor de tabela improvisada

## Leitura inicial

- `AGENTS.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Separe base de orquestracao

- `src/ui/Table`: estrutura generica
- page ou componente de dominio: define colunas, dados e acoes
- hook ou service: busca e organiza dados

### 2. Deixe os estados explicitos

- loading
- empty
- erro
- sucesso com dados

### 3. Nao empurre tudo para dentro da tabela

- filtro e paginacao podem viver no hook ou page
- formatacao de dado complexa pode virar utilitario ou componente auxiliar
- acoes de linha devem ser claras e pequenas

### 4. Feche com checks

Dentro de `frontend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run build`

## Exemplos

- "Criar tabela de usuarios" -> hook busca lista, page passa colunas e acoes, tabela so renderiza
- "Adicionar filtros" -> manter estado no hook ou page, nao no componente base
