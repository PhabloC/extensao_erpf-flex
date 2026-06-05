# Task 004 - Implementar importacao ERP Flex no backend

## Status
done

## Tipo
back

## Stacks envolvidos
- backend

## Perfil do projeto
- stack web escolhida: nao se aplica
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/paths`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
nao se aplica

### Tipo de referencia visual
nao se aplica

### Fonte primaria visual
- nao se aplica

### Regra de aderencia visual
- Sem impacto visual.

## Contexto de negocio

### Por que
O valor principal do produto e eliminar o retrabalho entre ERP Flex e kanban. Isso exige um endpoint seguro e deterministico para receber a importacao vinda da extensao.

### O que
Implementar no backend o endpoint de importacao ERP Flex com validacao, normalizacao de payload, prevencao de duplicidade e registro de auditoria.

### Comportamento esperado
- backend recebe payload da extensao
- backend valida autenticacao e dados obrigatorios
- backend impede criar ordem duplicada por identificador externo
- backend cria ordem com origem `erp-flex`

### Fora de escopo
- captura de dados no navegador
- interface da extensao
- sincronizacao bidirecional com ERP

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: endpoint de importacao exige sessao autenticada do sistema destino.
- Casos de erro: auth ausente, payload invalido, campos obrigatorios faltando, duplicidade, ordem nao encontrada em reprocesso.
- Decisoes humanas confirmadas: cadastro manual continua coexistindo com importacao.
- Casos de borda: campos opcionais ausentes, importacao repetida, strings sujas do DOM, origem inconsistente.

## Especificacao tecnica

### Deve
- reutilizar o modulo de Ordem de Producao criado na task base
- criar caso de uso especifico para importacao ERP
- registrar `origin`, `externalOrderId` e dados de auditoria
- responder de forma distinta para sucesso, duplicidade e erro de validacao

### Nao deve
- nao confiar no payload da extensao sem validacao backend
- nao criar segunda modelagem paralela de ordem

## Entradas
- `requirements/003-regras-de-negocio.md`
- `requirements/005-integracao-erp-flex-e-extensao.md`
- `contracts/openapi.yaml`
- `backend/AGENTS.md`
- `backend/docs/ai/ARCHITECTURE.md`

## Dependencias
- `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md`
- `tasks/002-implementar-backend-de-ordem-de-producao.md`

## Criterios de conclusao
- endpoint de importacao ERP existe conforme contrato
- duplicidade por identificador externo e bloqueada
- ordem importada registra origem e auditoria
- testes de sucesso, validacao e duplicidade passam

## Instrucoes de implementacao
- centralizar regra de deduplicacao no backend
- manter payload da extensao adaptavel para futuras fontes

## Validacao esperada
- `cd backend && npm run lint`
- `cd backend && npm run test`
- `cd backend && npm run build`

## Entregaveis esperados
- endpoint e service de importacao ERP
- testes de validacao e duplicidade
- task e indice atualizados

## Riscos ou ambiguidades
- a chave externa oficial do ERP pode precisar ser ajustada apos discovery em ambiente real

## Resultado da execucao
Implementado o endpoint de importacao ERP Flex no backend reutilizando o modulo `production-orders` existente:
- criado DTO de importacao `ImportProductionOrderFromErpFlexDto`
- adicionada rota autenticada `POST /api/production-orders/imports/erp-flex`
- centralizada a deduplicacao por `externalOrderId` no backend
- criada resposta estruturada de conflito com `result=duplicate`, `existingProductionOrderId` e `externalOrderId`
- ordens importadas agora registram `origin=erp-flex`, `externalOrderId`, `sourcePageUrl`, `importedAt` e `importedByUserId`
- historico inicial da ordem importada passa a registrar evento `imported`
- corrigida a serializacao do modulo para alinhar todas as respostas do dominio ao contrato OpenAPI (`item` e `source` aninhados)
- ajustado o filtro HTTP global para preservar payloads estruturados de excecoes HTTP

## Arquivos alterados
- `backend/src/common/filters/http-exception.filter.ts`
- `backend/src/modules/production-orders/dto/import-production-order-from-erp-flex.dto.ts`
- `backend/src/modules/production-orders/production-orders.controller.ts`
- `backend/src/modules/production-orders/production-orders.presenter.ts`
- `backend/src/modules/production-orders/production-orders.service.ts`
- `backend/src/modules/production-orders/production-orders.service.spec.ts`
- `backend/test/app.e2e-spec.ts`
- `tasks/000-index.md`
- `tasks/004-implementar-importacao-erp-flex-no-backend.md`

## Validacoes executadas
- `cd backend && npm run lint`
- `cd backend && npm run test`
- `cd backend && npm run build`
- `cd backend && npm run test:e2e`

## Aderencia ao design system
Nao se aplica. Task de backend sem impacto visual.

## Pendencias pos-task
- Executar a extensao de navegador em ambiente real do ERP para confirmar a chave externa oficial usada em `externalOrderId`.
- Se `DATABASE_ENABLED=true` for usado, ainda sera necessario criar a migration do dominio `production_orders`.
- Evoluir o contrato/filtro de erro apenas se o restante da API tambem precisar de payloads estruturados mais ricos.

## Status final
done
