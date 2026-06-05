---
name: pagina
description: Cria ou refatora pages no projeto `frontend/` seguindo a arquitetura do repositorio. Use quando a tarefa envolver nova rota, tela, composicao de dados, estados de carregamento ou integracao de hooks com services.
metadata:
  short-description: Cria pages e rotas no padrao do frontend
---

# Pagina

Use esta skill quando a mudanca principal estiver em uma tela de rota. Ela ajuda a manter a page fina, com composicao clara e sem logica de integracao espalhada.

## Quando usar

- nova tela em `src/pages`
- ajuste de rota em `src/routes`
- reorganizacao de page muito grande
- tela com estados de loading, empty e error
- pagina que depende de hook, service ou store

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Defina o papel da page

A page deve:

- orquestrar layout
- acionar hooks
- escolher o que renderizar
- delegar UI para `ui/` e `components/`

A page nao deve:

- chamar API direto
- concentrar regra longa
- crescer com varios blocos de JSX densos

### 2. Quebre a tela se necessario

- use `layout/` para casca
- use `components/` para blocos de dominio
- use `ui/` para partes genericas
- use hook para estado e efeitos

### 3. Feche com checks

Dentro de `frontend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run build`

## Exemplos

- "Criar dashboard" -> page orquestra secoes, hook busca dados, componentes exibem cards e tabelas
- "Refatorar settings" -> extrair secoes e estados para hook e componentes menores
