# Change Request 058 - Restaurar confirmacao de atualizacao para OPs ativas na extensao

## Status
done

## Tipo
shared

## Stacks envolvidos
- front-end
- backend

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex`

## Modo de execucao
cross-stack

## Referencia de design system

### Stack de referencia visual
- front-end

### Tipo de referencia visual
- artefato documental com ajuste derivado para popup de extensao

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- manter a popup compacta e reutilizar a linguagem visual dos paineis de confirmacao existentes

## Contexto de negocio

### Por que
A change request 055 simplificou demais o fluxo ao atualizar OPs ativas automaticamente, removendo a confirmacao humana exigida pelo time operacional.

### O que
Restaurar confirmacao explicita antes de atualizar OPs ativas, com selecao individual quando o lote tiver mais de uma OP conflitante.

### Comportamento esperado
- OP nova continua sendo criada normalmente
- OP com `externalOrderId` ativo retorna conflito operacional ate o usuario confirmar
- uma unica OP ativa abre modal perguntando se deseja atualizar
- varias OPs ativas abrem modal listando conflitos com selecao parcial
- OPs ativas nao marcadas nao sao importadas nem atualizadas
- feedback final informa criadas, atualizadas e ignoradas

### Fora de escopo
- sincronizacao automatica sem confirmacao
- alteracao do kanban fora do endpoint de importacao ERP

## Dependencias
- `tasks/change-requests/055-eliminar-fluxo-de-duplicidade-na-importacao-da-extensao.md`

## Criterios de conclusao
- backend retorna `409` com `result: duplicate` quando existe OP ativa e o payload nao traz `existingProductionOrderId`
- backend atualiza apenas quando `existingProductionOrderId` confirma a OP ativa
- extensao exibe modal de confirmacao para conflitos ativos
- lote com conflitos parciais permite selecionar quais OPs atualizar
- contrato e testes refletem o fluxo

## Resultado da execucao
- `backend`: a importacao ERP voltou a retornar `409` com `result: duplicate` quando existe OP ativa sem confirmacao; a atualizacao ocorre apenas com `existingProductionOrderId`.
- `front-end`: a popup ganhou painel de conflito para uma ou varias OPs ativas, com selecao parcial em lote e feedback final incluindo ignoradas.
- Relacao com contrato: `contracts/openapi.yaml` e o contrato espelho da extensao documentam novamente o `409` operacional e o campo `existingProductionOrderId`.

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- `cd backend && npm run test`: ok
- `cd backend && npm run test:e2e`: ok
