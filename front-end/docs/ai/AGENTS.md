# Guia Principal Para Agentes

## Stack

- React 19 + Vite + TypeScript
- React Router para navegacao
- Zustand para estado global observavel
- Axios para acesso HTTP
- React Hook Form + Zod para formularios
- Vitest + Testing Library para testes

## Arquitetura Geral

Fluxo principal:

`Page -> Hooks -> Services -> API/Adapters`

Diretrizes:

- Pages orquestram a tela e composicao de layout.
- Hooks concentram estado de apresentacao e integracao.
- Services encapsulam acesso a dados e regras de integracao.
- Adapters convertem payload externo para tipos internos.
- Stores ficam reservadas para estado global compartilhado.

## Regras De Desenvolvimento

- Manter componentes pequenos e com responsabilidade unica.
- Preferir tipagem explicita e evitar `any`.
- Reutilizar `ui/` antes de criar componentes novos.
- Usar `components/` para componentes de dominio compostos.
- Adicionar novos services antes de consumir APIs diretamente em pages.
- Manter novos fluxos coerentes com os patterns documentados.

## Uso de Skills
 
Este repositório possui skills locais em `.agents/skills/`.
 
Use essas skills automaticamente sempre que a tarefa do usuário combinar claramente com o workflow delas, mesmo que o usuário não cite o nome da skill diretamente no chat.
 
Regras:
- leia primeiro `AGENTS.md` e `docs/ai/*` para entender arquitetura, padrões e regras do projeto
- trate `docs/ai/*` como fonte principal de contexto estrutural
- trate `.agents/skills/*` como camada operacional para executar tarefas recorrentes do projeto
- quando uma tarefa combinar claramente com uma skill, use a skill correspondente sem esperar invocação explícita
- prefira skills base para tarefas comuns de implementação, refactor, componentes, páginas, formulários, tabelas, services e workflow de desenvolvimento
- mantenha skills sensíveis ou de revisão crítica como uso explícito quando fizer sentido, como `seguranca`, `auth`, `qa` ou permissões
- nunca use skill para contrariar os padrões documentados em `docs/ai/*`; a skill deve reforçar o padrão do repositório, não competir com ele
- se mais de uma skill se aplicar, use apenas o menor conjunto necessário
- se nenhuma skill se aplicar bem, siga apenas a documentação do repositório e o contexto local do código
 
Objetivo:
- reduzir ambiguidade
- reaproveitar workflows recorrentes
- economizar contexto e tokens
- manter consistência entre mudanças feitas por agentes e desenvolvedores

## Comandos Principais

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run format:write`

## Leitura Recomendada

- `docs/ai/ARCHITECTURE.md`
- `docs/ai/FRONTEND_PATTERNS.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/DEVELOPMENT_WORKFLOW.md`
- `docs/ai/SECURITY.md`
- `docs/ai/QA.md`
- `docs/ai/EXAMPLES.md`
- `docs/ai/REPO_MAP.md`

- Todos os padrões e orientações descritos nos documentos acima devem ser utilizados para resolver problemas REAIS e não por antecipação. Evitar o overengineering.
