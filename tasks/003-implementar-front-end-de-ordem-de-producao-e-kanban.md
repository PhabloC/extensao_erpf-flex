# Task 003 - Implementar front-end de Ordem de Producao e kanban

## Status
done

## Tipo
front

## Stacks envolvidos
- front-end

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/paths`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
artefato de design system

### Fonte primaria visual
- `design-system/front/README.md`

### Regra de aderencia visual
- Como ainda nao existe prototipo visual nem prints, a UI deve seguir os componentes e padroes ja presentes em `front-end/`, mantendo consistencia com o artefato documental atual e sem inventar uma nova linguagem visual fora da base existente do projeto.

## Contexto de negocio

### Por que
Mesmo com backend pronto, o usuario precisa de uma interface web para criar ordens manualmente, visualizar o quadro e acompanhar o fluxo produtivo.

### O que
Implementar no `front-end` as telas e fluxos do MVP de Ordem de Producao: listagem, formulario de criacao manual, detalhe basico e quadro kanban consumindo a API.

### Comportamento esperado
- usuario autenticado consegue listar ordens
- usuario consegue criar ordem manual
- usuario consegue visualizar ordens por coluna no kanban
- usuario consegue alterar status pelo fluxo definido

### Fora de escopo
- extensao de navegador
- importacao ERP disparada pela extensao
- BI/indicadores avancados

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: acesso protegido por rotas autenticadas do sistema.
- Casos de erro: API indisponivel, lista vazia, erro de validacao no formulario, falha ao mudar status.
- Decisoes humanas confirmadas: stack web React/Vite confirmada.
- Casos de borda: ordem sem observacao, lista vazia, tentativa de submissao duplicada, refresh apos mudanca de status.

## Especificacao tecnica

### Deve
- seguir fluxo `Page -> Hooks -> Services -> API`
- reutilizar `services/http/apiClient.ts` e patterns existentes
- implementar estados de loading, erro e vazio
- manter tipagem alinhada ao contrato

### Nao deve
- nao acoplar a UI a payloads sem adaptadores
- nao ignorar acessibilidade minima

## Entradas
- `requirements/001-visao-geral-do-produto.md`
- `requirements/002-fluxos-e-casos-de-uso.md`
- `requirements/003-regras-de-negocio.md`
- `design-system/front/README.md`
- `contracts/openapi.yaml`
- `front-end/AGENTS.md`
- `front-end/docs/ai/ARCHITECTURE.md`
- `front-end/docs/ai/ACCESSIBILITY.md`
- `front-end/docs/ai/FRONTEND_PATTERNS.md`

## Dependencias
- `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md`
- `tasks/002-implementar-backend-de-ordem-de-producao.md`

## Criterios de conclusao
- existe fluxo funcional de listagem, criacao manual e visualizacao em kanban
- tela trata estados de loading, erro e vazio
- alteracao de status funciona conforme API

## Instrucoes de implementacao
- manter UI pragmatica e coerente com a base existente
- evidenciar origem da ordem pelo menos em detalhe ou card quando disponivel

## Validacao esperada
- `cd front-end && npm run lint`
- `cd front-end && npm run test`
- `cd front-end && npm run build`

## Entregaveis esperados
- paginas, hooks, services e testes do dominio de Ordem de Producao
- task e indice atualizados

## Riscos ou ambiguidades
- ausencia de design visual detalhado pode exigir validacao humana posterior sobre nomenclatura e hierarquia das colunas

## Resultado da execucao
Implementado o MVP web de Ordem de Producao no `front-end` consumindo a API real:
- substituida a tela de scaffold por uma tela funcional de Ordens de Producao
- adicionada sessao autenticada com bootstrap de usuario via API e armazenamento de token no store
- criada listagem de ordens com estados de autenticacao, loading, erro e vazio
- criado formulario modal para criacao manual de ordem
- criado painel de detalhe com origem, dados operacionais e historico recente
- criado kanban por colunas com acao pragmatica de mover para o proximo status
- alinhado o cliente HTTP para enviar `Authorization: Bearer`
- estendidos tipos e `StatusBadge` para os estados do dominio de producao

## Arquivos alterados
- `front-end/src/layout/Header/index.tsx`
- `front-end/src/layout/MainLayout/index.tsx`
- `front-end/src/layout/Sidebar/index.tsx`
- `front-end/src/hooks/useAuth.ts`
- `front-end/src/hooks/useProductionOrders.ts`
- `front-end/src/pages/Main/Dashboard/index.tsx`
- `front-end/src/pages/Main/Dashboard/index.test.tsx`
- `front-end/src/pages/Main/Dashboard/styles.module.css`
- `front-end/src/patterns/strategy/statusStrategy.ts`
- `front-end/src/services/http/apiClient.ts`
- `front-end/src/services/auth/bootstrapSession.ts`
- `front-end/src/services/adapters/adaptProductionOrder.ts`
- `front-end/src/services/productionOrders/listProductionOrders.ts`
- `front-end/src/services/productionOrders/createProductionOrder.ts`
- `front-end/src/services/productionOrders/updateProductionOrderStatus.ts`
- `front-end/src/stores/authStore.ts`
- `front-end/src/types/auth.ts`
- `front-end/src/types/productionOrder.ts`
- `front-end/src/types/status.ts`
- `tasks/000-index.md`
- `tasks/003-implementar-front-end-de-ordem-de-producao-e-kanban.md`

## Validacoes executadas
- `cd front-end && npm install`
- `cd front-end && npm run lint`
- `cd front-end && npm run test`
- `cd front-end && npm run build`

## Aderencia ao design system
Seguiu a referencia documental atual `design-system/front/README.md` e a linguagem visual ja existente no `front-end`:
- reutilizados `MainLayout`, `Header`, `Sidebar`, `Card`, `Button`, `Input`, `Modal`, `Table` e `StatusBadge`
- mantida a mesma paleta, tipografia, densidade visual e estrutura de cards do scaffold existente
- sem criacao de uma linguagem visual paralela fora da base ja presente na stack
- acessibilidade aplicada com titulos semanticos, labels visiveis, mensagens de erro textuais e estados de loading/erro comunicados por texto

## Pendencias pos-task
- Conectar a tela ao endpoint de importacao ERP Flex quando a `tasks/004-implementar-importacao-erp-flex-no-backend.md` e a extensao estiverem prontas.
- Se o negocio exigir transicoes nao lineares no kanban, a UI precisara evoluir de `move to next` para uma estrategia mais completa.
- O fluxo de sessao atual provisiona o usuario se necessario; isso pode ser refinado depois com uma experiencia dedicada de login/onboarding.

## Status final
done
