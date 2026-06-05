# Task 006 - Fechar fluxo de rastreabilidade e validacao fim a fim

## Status
blocked

## Tipo
shared

## Stacks envolvidos
- front-end
- backend

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/paths`

## Modo de execucao
cross-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
artefato de design system

### Fonte primaria visual
- `design-system/front/README.md`

### Regra de aderencia visual
- A UI complementar de rastreabilidade deve manter consistencia com os componentes e layout base existentes no `front-end`, sem criar linguagem visual paralela.

## Contexto de negocio

### Por que
Depois de backend, front e extensao prontos, ainda falta amarrar o fluxo operacional completo: visualizar a origem importada, auditar resultados e validar a experiencia ponta a ponta.

### O que
Concluir o fluxo fim a fim exibindo origem ERP no front-end, feedback operacional adequado e validacao integrada entre extensao, backend e sistema web.

### Comportamento esperado
- usuario consegue identificar no sistema se a ordem veio do ERP
- detalhe/card da ordem mostra origem e identificador externo quando houver
- fluxo completo de importacao e verificavel ponta a ponta

### Fora de escopo
- analytics avancado
- sync bidirecional
- automacoes adicionais no ERP

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: visualizacao segue auth do sistema.
- Casos de erro: ordem importada sem metadado suficiente, falha em refresh do front, divergencia entre resposta da extensao e estado real da API.
- Decisoes humanas confirmadas: rastreabilidade da origem e requisito central do produto.
- Casos de borda: ordem importada parcialmente, refresh apos importacao, erro intermitente na consulta.

## Especificacao tecnica

### Deve
- exibir origem/importacao no front-end
- revisar logs/respostas backend para suportar diagnostico operacional
- validar fluxo manual e importado ponta a ponta

### Nao deve
- nao duplicar estado da ordem em lugares inconsistentes
- nao esconder erros operacionais relevantes do usuario

## Entradas
- `requirements/001-visao-geral-do-produto.md`
- `requirements/002-fluxos-e-casos-de-uso.md`
- `requirements/003-regras-de-negocio.md`
- `requirements/004-requisitos-nao-funcionais.md`
- `requirements/005-integracao-erp-flex-e-extensao.md`
- `design-system/front/README.md`
- `contracts/openapi.yaml`
- `front-end/docs/ai/ACCESSIBILITY.md`
- `front-end/docs/ai/ARCHITECTURE.md`
- `backend/docs/ai/ARCHITECTURE.md`

## Dependencias
- `tasks/003-implementar-front-end-de-ordem-de-producao-e-kanban.md`
- `tasks/004-implementar-importacao-erp-flex-no-backend.md`
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`

## Criterios de conclusao
- origem ERP e identificador externo sao visiveis no sistema quando aplicavel
- fluxo ponta a ponta foi validado manualmente
- lacunas restantes do ERP real ficam registradas na task

## Instrucoes de implementacao
- usar esta task para consolidar experiencia real do MVP, nao para reabrir arquitetura base

## Validacao esperada
- `cd front-end && npm run lint`
- `cd front-end && npm run test`
- `cd front-end && npm run build`
- `cd backend && npm run lint`
- `cd backend && npm run test`
- `cd backend && npm run build`
- validacao manual da extensao instalada

## Entregaveis esperados
- ajustes finais de front/back
- evidencias de validacao fim a fim
- task e indice atualizados

## Riscos ou ambiguidades
- dependencias de ambiente real do ERP podem exigir ajustes posteriores fora do MVP

## Resultado da execucao
- `front-end`: detalhe da ordem passou a expor origem formatada, id externo ERP, URL de origem, horario de importacao, usuario importador e notas completas do historico de importacao para auditoria operacional sem criar estado paralelo.
- `backend`: importacao ERP agora registra notas tecnicas no evento `imported` e persiste `source_payload_snapshot` com o payload bruto coletado pela extensao para diagnostico posterior; foi adicionada migration dedicada para ambientes com PostgreSQL e `synchronize: false`.
- `browser-extension`: feedback de sucesso e resumo local da ultima importacao foram enriquecidos com `externalOrderId`, facilitando rastreabilidade imediata no popup.
- Decisao tecnica: a trilha de auditoria foi concentrada no historico ja existente e no snapshot bruto persistido no backend, evitando expandir o contrato de leitura do front sem necessidade funcional imediata.
- Relacao com contrato: nenhuma rota foi alterada; o fluxo continua aderente a `contracts/openapi.yaml#/paths`, aproveitando os campos ja previstos em `ProductionOrderSourceMetadata` e `rawPayload` do request de importacao.

## Arquivos alterados
- `backend/src/modules/production-orders/entities/production-order.entity.ts`
- `backend/src/modules/production-orders/production-orders.repository.ts`
- `backend/src/modules/production-orders/production-orders.in-memory.repository.ts`
- `backend/src/modules/production-orders/production-orders.typeorm.repository.ts`
- `backend/src/modules/production-orders/production-orders.service.ts`
- `backend/src/modules/production-orders/production-orders.service.spec.ts`
- `backend/src/database/migrations/1700000001000-AddProductionOrderSourcePayloadSnapshot.ts`
- `front-end/src/pages/Main/Dashboard/index.tsx`
- `front-end/src/pages/Main/Dashboard/styles.module.css`
- `front-end/src/pages/Main/Dashboard/index.test.tsx`
- `browser-extension/src/popup.js`
- `browser-extension/src/background.js`
- `browser-extension/README.md`

## Validacoes executadas
- `cd front-end && npm run lint`: ok
- `cd front-end && npm run test`: ok
- `cd front-end && npm run build`: ok
- `cd backend && npm run lint`: ok
- `cd backend && npm run test`: ok
- `cd backend && npm run build`: ok
- `cd browser-extension && npm run check`: ok
- validacao manual da extensao instalada: nao executada neste workspace por depender de navegador com a extensao carregada e acesso a uma pagina real ou simulada do ERP Flex

## Aderencia ao design system
- stack `front-end`
- fonte primaria visual: `design-system/front/README.md`
- tipo de referencia visual: artefato documental
- evidencias de fidelidade: os ajustes reutilizam o layout, cards, tabela, modal, tipografia e hierarquia visual ja existentes no `front-end`, adicionando apenas blocos textuais e metadados de rastreabilidade coerentes com a linguagem atual.
- acessibilidade aplicada: link semantico para URL de origem, manutencao de headings e listas semanticas, feedback de erro existente preservado, nenhuma interacao nova dependente apenas de cor.
- desvios: nenhum desvio visual relevante em relacao ao padrao atual do front-end.

## Pendencias pos-task
- executar validacao manual real com a extensao instalada em navegador e uma ordem acessivel do ERP Flex para confirmar seletores, autenticacao e refresh ponta a ponta fora do ambiente de teste.
- aplicar a migration `1700000001000-AddProductionOrderSourcePayloadSnapshot` no ambiente com PostgreSQL antes de usar a nova persistencia de snapshot.
- se a pagina real do ERP Flex divergir das heuristicas atuais da extensao, ajustar seletores e aliases em task posterior.

## Status final
blocked
