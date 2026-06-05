# Guia Principal Para Agentes

## Stack

- NestJS 11
- TypeScript
- ConfigModule
- JWT + Passport
- EventEmitter do Nest
- TypeORM preparado para PostgreSQL
- Jest para testes

## Arquitetura

Fluxo principal:

`Controller -> Service -> Repository -> Database`

Separacao de responsabilidades:

- Controllers recebem requests e delegam.
- Services concentram regra de negocio.
- Repositories isolam acesso a dados.
- Common concentra cross-cutting concerns.
- Patterns guarda implementacoes pequenas de strategy, factory e adapter.

## Regras De Desenvolvimento

- Nao colocar regra de negocio em controllers.
- Usar DTOs em todos os endpoints.
- Reutilizar `common/` para filtros, decorators e interceptors.
- Criar novos modulos dentro de `src/modules`.
- Emitir eventos quando fluxos de dominio exigirem reacao desacoplada.

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

## Comandos

- `npm run start:dev`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run migration:run`
- `npm run migration:generate -- -n NomeDaMigration`

## Leitura Recomendada

- `docs/ai/ARCHITECTURE.md`
- `docs/ai/BACKEND_PATTERNS.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/DEVELOPMENT_WORKFLOW.md`
- `docs/ai/SECURITY.md`
- `docs/ai/QA.md`
- `docs/ai/EXAMPLES.md`
- `docs/ai/REPO_MAP.md`

- Todos os padrões e orientações descritos nos documentos acima devem ser utilizados para resolver problemas REAIS e não por antecipação. Evitar o overengineering.