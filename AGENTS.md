# AGENTS

Guia principal de orquestracao para o scaffold monorepo.

## Objetivo

Este repositorio adota desenvolvimento orientado por especificacao com backlog unico na raiz.

Autoridade de orquestracao:
- `AGENTS.md` (raiz)
- `GUIDE.md` (raiz)
- `.agents/skills/` (raiz)

## Estrutura de governanca

- raiz: orquestracao de planejamento, execucao e rastreabilidade entre stacks
- `front-end/`: regras locais de implementacao front-end React/Vite
- `backend/`: regras locais de implementacao backend
- `extensao-dois-pingos/`: extensao de navegador MV3 para importacao ERP Flex

## Fontes de verdade globais

- `requirements/`: requisitos de produto
- `design-system/front/`: base visual e comportamental oficial do front-end, podendo conter artefatos documentais, aplicacao-prototipo visual ou prints de telas
- `contracts/openapi.yaml`: contrato oficial de API
- `tasks/`: backlog unico do projeto
- `front-end/`: scaffold React/Vite para projetos web React
- `backend/`: scaffold backend do projeto

## Regra de backlog unico

Toda task deve ser criada na raiz em `tasks/` e deve conter:
- `Tipo`: `front`, `back` ou `shared`
- `Stacks envolvidos`
- `Contrato` (quando aplicavel)
- `Modo de execucao`: `single-stack` ou `cross-stack`

Nao existe task valida fora da raiz.

## Skills da raiz

- `planejar-tasks`: cria backlog unico consolidado por tipo e dependencias
- `executar-task`: executa uma task da raiz, com delegacao por stack
- `gerar-tasks-adicionais`: gera change requests no backlog unico da raiz

## Skills locais

Skills locais das stacks existem para implementacao especializada.
Elas nao devem planejar backlog global.

## Padronizacao de contexto AI por stack

- `front-end/docs/ai/` deve manter a malha documental base da stack web ativa:
  - `ACCESSIBILITY.md`
  - `AGENTS.md`
  - `ARCHITECTURE.md`
  - `CLEAN_CODE.md`
  - `CODE_STYLE.md`
  - `COMPONENT_REUSE.md`
  - `DEVELOPMENT_WORKFLOW.md`
  - `EXAMPLES.md`
  - `FRONTEND_PATTERNS.md`
  - `QA.md`
  - `REPO_MAP.md`
  - `SECURITY.md`
- Tasks `front` devem ler o `docs/ai/` da stack web escolhida antes de implementar.
- Mudancas em `extensao-dois-pingos/` devem ler `extensao-dois-pingos/docs/ai/` e revisar versionamento semver conforme `extensao-dois-pingos/docs/ai/VERSIONING.md`.

## Regras operacionais

- nenhuma implementacao sem task da raiz
- uma task da raiz por vez
- tasks `shared` podem executar subagentes em paralelo por stack
- toda execucao atualiza a task e `tasks/000-index.md`
- `contracts/openapi.yaml` e obrigatorio para integracoes cliente-servidor
- task com UI de `front` deve usar `design-system/front/` como referencia visual primaria
- task `shared` com UI em mais de uma stack deve explicitar a referencia visual de cada stack
- quando a referencia visual declarada for prints de telas, a task deve apontar os arquivos/imagens concretos e registrar telas, estados e lacunas que os prints nao cobrem
- nao usar a referencia visual de uma stack para inferir a outra sem registro explicito na task
- o perfil atual do projeto e `front-end` para web e `mobile: nao`

## Comandos uteis por stack

Front-end:
- `cd front-end`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`

Backend:
- `cd backend`
- `npm run start:dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`

Extensao de navegador:
- `cd extensao-dois-pingos`
- `npm run check`
