# Guia de desenvolvimento orientado por especificacao (orquestrado na raiz)

Este scaffold usa fluxo unico de planejamento e execucao na raiz para `front-end` (React/Vite) e `backend`.

## Estrutura esperada

- `AGENTS.md`
- `GUIDE.md`
- `.agents/skills/`
- `requirements/`
- `design-system/front/` (artefatos documentais, aplicacao-prototipo visual ou prints de telas)
- `contracts/openapi.yaml`
- `tasks/`
- `front-end/` (React/Vite)
- `backend/`

## Fluxo oficial

### 1. Planejamento global

Use a skill da raiz `planejar-tasks`.

Ela deve:
- ler contexto global (`AGENTS.md`, `GUIDE.md`, `requirements/`, `design-system/front/`, `contracts/`)
- classificar `design-system/front/` como artefato documental, aplicacao-prototipo visual ou prints de telas
- executar review da spec com itens verificaveis antes de fechar o backlog
- delegar propostas para `front-end` e `backend` conforme o escopo
- consolidar backlog unico em `tasks/`
- classificar tasks em `front`, `back`, `shared`
- registrar dependencias cruzadas

### 2. Revisao humana

Revise `tasks/000-index.md` e as tasks geradas antes de implementar.

### 3. Execucao de task

Use a skill da raiz `executar-task` com a task da raiz.

Regras:
- `single-stack`: delega para uma stack
- `cross-stack`/`shared`: delega para stacks em paralelo
- task com UI de `front` deve usar `design-system/front/` e executar em `front-end/`
- task `shared` com UI em multiplas stacks deve registrar separadamente cada fonte visual usada
- quando a subpasta relevante contiver uma aplicacao-prototipo visual, executar a UI com fidelidade explicita a essa aplicacao de exemplo
- quando a subpasta relevante contiver prints de telas, executar a UI com fidelidade explicita aos prints indicados, registrando caminhos, telas, estados e qualquer lacuna nao visivel
- atualiza sempre a task da raiz e `tasks/000-index.md`

### 4. Mudancas de escopo

Use a skill da raiz `gerar-tasks-adicionais`.

As novas tasks devem ir para `tasks/change-requests/` e manter classificacao por tipo + dependencias.

## Regras obrigatorias

- nao existe implementacao sem task da raiz
- nao existe task sem contexto global
- `contracts/openapi.yaml` e prerequisito para integracoes cliente-servidor
- cada task finaliza em `done` ou `blocked`
- toda execucao deve atualizar:
  - arquivo da task
  - `tasks/000-index.md`

## Governanca local das stacks

Cada stack ativa (`front-end/`, `backend/`) tem `AGENTS.md`, `GUIDE.md` e/ou `docs/ai/` para implementacao local.

Elas nao substituem a orquestracao da raiz.
