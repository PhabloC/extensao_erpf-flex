# Task 002 - Implementar backend de Ordem de Producao

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
O sistema precisa de um dominio real de Ordem de Producao para suportar cadastro manual, consulta, kanban e historico.

### O que
Implementar no backend o modulo de Ordem de Producao com persistencia, DTOs, validacoes, endpoints do MVP e historico minimo de eventos.

### Comportamento esperado
- API permite criar ordem manual
- API lista ordens e retorna detalhes
- API atualiza status da ordem
- API registra historico minimo das mudancas

### Fora de escopo
- importacao ERP Flex
- extensao de navegador
- dashboard analitico avancado

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: endpoints de escrita exigem auth; leitura pode seguir a mesma regra do sistema atual.
- Casos de erro: ordem nao encontrada, body invalido, status invalido, auth ausente.
- Decisoes humanas confirmadas: origem manual deve continuar suportada como contingencia.
- Casos de borda: campos opcionais ausentes, quantidade invalida, tentativa de atualizar ordem inexistente.

## Especificacao tecnica

### Deve
- seguir arquitetura `Controller -> Service -> Repository -> Database`
- criar modulo proprio para Ordem de Producao
- implementar entidade, DTOs, repositorio e testes
- registrar origem da ordem e historico minimo

### Nao deve
- nao duplicar padroes ja existentes no backend
- nao embutir regras da extensao no dominio base

## Entradas
- `requirements/001-visao-geral-do-produto.md`
- `requirements/002-fluxos-e-casos-de-uso.md`
- `requirements/003-regras-de-negocio.md`
- `contracts/openapi.yaml`
- `backend/AGENTS.md`
- `backend/docs/ai/ARCHITECTURE.md`
- `backend/docs/ai/CODE_STYLE.md`

## Dependencias
- `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md`

## Criterios de conclusao
- backend expone endpoints do MVP de ordem manual/listagem/detalhe/status conforme contrato
- origem e historico minimo estao persistidos
- testes relevantes do modulo passam

## Instrucoes de implementacao
- manter regra de status inicial centralizada no backend
- preparar estrutura para futura importacao ERP sem misturar com criacao manual nesta task

## Validacao esperada
- `cd backend && npm run lint`
- `cd backend && npm run test`
- `cd backend && npm run build`

## Entregaveis esperados
- modulo backend de Ordem de Producao
- endpoints e testes
- task e indice atualizados

## Riscos ou ambiguidades
- definicao final das colunas do kanban pode exigir pequeno ajuste no enum/status

## Resultado da execucao
Implementado o modulo backend de Ordem de Producao seguindo o fluxo `Controller -> Service -> Repository -> Database`:
- criado modulo `production-orders` com controller, service, DTOs, entidade, repositorio abstrato e implementacoes in-memory/TypeORM
- adicionados endpoints autenticados para criacao manual, listagem, detalhe e mudanca de status
- definida persistencia de origem da ordem, identificador externo opcional e historico minimo em `history`
- centralizada a regra de status inicial em `backlog` quando o payload nao envia `status`
- adicionadas validacoes de duplicidade por `orderNumber`, ordem inexistente e transicoes invalidas
- integrado o modulo ao `AppModule`
- criado teste e2e do ciclo autenticado de Ordem de Producao

## Arquivos alterados
- `backend/src/app.module.ts`
- `backend/src/modules/production-orders/entities/production-order.entity.ts`
- `backend/src/modules/production-orders/dto/create-production-order.dto.ts`
- `backend/src/modules/production-orders/dto/list-production-orders.dto.ts`
- `backend/src/modules/production-orders/dto/update-production-order-status.dto.ts`
- `backend/src/modules/production-orders/production-orders.repository.ts`
- `backend/src/modules/production-orders/production-orders.in-memory.repository.ts`
- `backend/src/modules/production-orders/production-orders.typeorm.repository.ts`
- `backend/src/modules/production-orders/production-orders.service.ts`
- `backend/src/modules/production-orders/production-orders.controller.ts`
- `backend/src/modules/production-orders/production-orders.module.ts`
- `backend/src/modules/production-orders/production-orders.service.spec.ts`
- `backend/test/app.e2e-spec.ts`
- `tasks/000-index.md`
- `tasks/002-implementar-backend-de-ordem-de-producao.md`

## Validacoes executadas
- `cd backend && npm install`
- `cd backend && npm run lint`
- `cd backend && npm run test`
- `cd backend && npm run build`
- `cd backend && npm run test:e2e`

## Aderencia ao design system
Nao se aplica. Task de backend sem impacto visual.

## Pendencias pos-task
- Implementar o endpoint de importacao ERP Flex em `tasks/004-implementar-importacao-erp-flex-no-backend.md`.
- Se `DATABASE_ENABLED=true` for usado, ainda sera necessario criar a migration do dominio `production_orders`.
- Confirmar futuramente a regra final das colunas do kanban caso o negocio queira restringir transicoes adicionais.

## Status final
done
