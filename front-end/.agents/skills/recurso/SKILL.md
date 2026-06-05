---
name: recurso
description: Implementa ou refatora recursos no projeto `frontend/` seguindo os padroes do repositorio. Use quando a tarefa envolver pages, rotas, componentes, hooks, stores, formularios, services ou adapters.
metadata:
  short-description: Cria recursos React seguindo o padrao do repo
---

# Recurso

Use esta skill para trabalho de produto dentro de `frontend/`. Ela complementa os arquivos `AGENTS.md` e `docs/ai/*`, nao substitui essas regras.

## Quando usar

Use esta skill quando o pedido envolver:

- nova page ou ajuste em `src/pages`
- mudanca de rota em `src/routes`
- componente reutilizavel em `src/ui` ou `src/components`
- ajuste de layout em `src/layout`
- hook, store, service ou adapter
- formulario com React Hook Form e Zod
- refatoracao para alinhar arquitetura ou Clean Code

## Leitura inicial

Antes de editar codigo, leia o minimo necessario destes arquivos:

- `AGENTS.md`
- `docs/ai/AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/SECURITY.md`
- `docs/ai/QA.md`

Depois disso, abra apenas os arquivos diretamente relacionados ao recurso.

## Workflow

### 1. Entenda onde a mudanca pertence

- `ui/`: bloco visual generico e reutilizavel
- `components/`: composicao de dominio usando `ui/`
- `layout/`: estrutura de pagina e casca da aplicacao
- `pages/`: tela de rota
- `hooks/`: estado de apresentacao e efeitos do recurso
- `services/`: acesso HTTP e integracoes
- `services/adapters/`: conversao de payload externo para tipo interno
- `stores/`: estado global realmente compartilhado

### 2. Implemente do jeito do repo

- use o alias `@`
- mantenha componente pequeno e bem tipado
- evite `any`
- evite chamada HTTP dentro de page ou componente visual
- reutilize `ui/` antes de criar um novo primitivo
- quando o comportamento variar por tipo, prefira strategy ou factory

### 3. Feche com validacao

Se houve mudanca de codigo em `frontend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run build`

## Heuristicas rapidas

- Page nova: page fina, regra em hook ou service
- Integracao nova: service primeiro, adapter se o payload vier torto
- Estado global novo: so usar store se varias areas distantes precisarem
- Componente novo: `ui/` se for generico, `components/` se tiver contexto de dominio

## Exemplos

- "Criar uma tela de perfil" -> criar page, ligar rota, extrair consumo de dados para hook ou service
- "Adicionar card reutilizavel" -> avaliar `ui/` antes de criar componente de dominio
- "Refatorar page grande" -> quebrar em componentes menores e mover efeitos para hook
