---
name: layout
description: Cria ou refatora estruturas de layout no projeto `frontend/`. Use quando a tarefa envolver header, sidebar, page container, shell de pagina, secoes responsivas ou reorganizacao estrutural da interface.
metadata:
  short-description: Cria layouts e shells no padrao do frontend
---

# Layout

Use esta skill para montar a estrutura macro da interface sem puxar regra de dominio para a camada de layout.

## Quando usar

- header novo
- sidebar
- shell de pagina
- container reutilizavel
- reorganizacao estrutural de telas

## Leitura inicial

- `AGENTS.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Preserve a responsabilidade do layout

Layout deve cuidar de:

- estrutura
- espacamento
- navegacao estrutural
- composicao de regioes

Layout nao deve cuidar de:

- regra de negocio
- integracao HTTP
- detalhes especificos demais de dominio

### 2. Componha com intencao

- `Header`, `Sidebar`, `PageContainer`, `MainLayout`
- prefira estruturas claras e reutilizaveis
- mantenha responsividade previsivel

### 3. Feche com checks

Dentro de `frontend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run build`

## Exemplos

- "Criar shell admin" -> combinar header, sidebar e page container sem misturar regra da tela
- "Refatorar layout principal" -> mover markup estrutural para `layout/` e simplificar pages
