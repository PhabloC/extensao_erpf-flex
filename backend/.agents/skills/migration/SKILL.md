---
name: migration
description: Cria ou revisa migrations no projeto `backend/` seguindo os padroes do repositorio. Use quando a tarefa envolver alteracao de schema, nova tabela, nova coluna, ajuste de indice, alinhamento entre entity e banco ou execucao de migrations TypeORM.
metadata:
  short-description: Cria migrations no padrao do backend
---

# Migration

Use esta skill para mudancas de schema e alinhamento entre persistencia e banco. O objetivo e manter evolucao de banco previsivel e coerente com a entity.

## Quando usar

- tabela nova
- coluna nova
- ajuste de indice
- alteracao de schema
- revisao de migration existente

## Leitura inicial

- `AGENTS.md`
- `docs/ai/DEVELOPMENT_WORKFLOW.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/SECURITY.md`

## Workflow

### 1. Entenda a mudanca persistida

- veja a entity
- veja o repository afetado
- confirme se a mudanca exige migration

### 2. Mantenha a migration enxuta

- uma intencao logica por migration
- nome claro
- cuidado com rollback
- nao esconder quebra de contrato silenciosamente

### 3. Feche com validacao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`
- `npm run migration:run` quando fizer sentido no fluxo

## Exemplos

- "Adicionar coluna phone" -> migration pequena, entity alinhada e repository revisado
- "Criar tabela orders" -> schema claro e impacto conhecido no dominio
