# Change Request 055 - Eliminar fluxo de duplicidade na importacao da extensao

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
- manter a popup compacta e remover passos extras de conflito, priorizando um fluxo direto de envio em lote

## Contexto de negocio

### Por que
O fluxo atual ainda preserva uma etapa de conflito herdada do `409`, mas a regra de negocio mudou: a OP importada deve ser criada quando nao existir e atualizada quando ja existir ativa.

### O que
Eliminar o conceito de duplicidade no fluxo da extensao e do backend para importacao ERP, substituindo-o por resposta direta de criacao ou atualizacao.

### Comportamento esperado
- ao enviar uma OP nova, o backend cria a ordem
- ao enviar uma OP com `externalOrderId` de ordem ativa existente, o backend atualiza a ordem
- a extensao nao abre mais painel de conflito nem pede selecao de itens duplicados
- o feedback final do lote informa apenas quantas OPs foram criadas e quantas foram atualizadas

### Fora de escopo
- alteracoes no kanban fora do endpoint de importacao ERP
- sincronizacao automatica de alteracoes do sistema destino de volta ao ERP

## Dependencias
- `tasks/change-requests/054-suportar-multiplas-ops-e-atualizacao-seletiva-de-ops-ativas-na-extensao.md`

## Criterios de conclusao
- backend nao retorna mais fluxo operacional de duplicidade para `externalOrderId` ativo
- extensao nao exibe mais painel de conflito/duplicidade
- contrato e testes documentam apenas resultados `created` ou `updated` para importacao valida

## Resultado da execucao
- `front-end`: a popup manteve a selecao multipla, mas removeu a etapa intermediaria de conflito; o envio em lote agora segue direto e o feedback final resume apenas criacoes e atualizacoes.
- `backend`: a importacao ERP passou a atualizar automaticamente a OP ativa existente quando o mesmo `externalOrderId` chega novamente, sem exigir confirmacao adicional no payload.
- Decisoes tecnicas: o endpoint permaneceu o mesmo `POST /production-orders/imports/erp-flex`; a mudanca ficou concentrada na regra de dominio e na simplificacao do orquestrador da extensao.
- Trade-offs: a extensao deixou de oferecer controle manual para ignorar uma OP ativa especifica; em contrapartida, o fluxo ficou linear e aderente a nova regra de negocio.
- Relacao com contrato: os contratos OpenAPI removeram o `409` operacional desse fluxo e documentam a resposta valida apenas com `result: created|updated`.

## Arquivos alterados
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/src/background.js`
- `backend/src/modules/production-orders/dto/import-production-order-from-erp-flex.dto.ts`
- `backend/src/modules/production-orders/production-orders.service.ts`
- `backend/src/modules/production-orders/production-orders.service.spec.ts`
- `backend/test/app.e2e-spec.ts`
- `contracts/openapi.yaml`
- `contracts/browser-extension-target-system.openapi.yaml`
- `tasks/change-requests/055-eliminar-fluxo-de-duplicidade-na-importacao-da-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- `cd backend && npm run test`: ok
- `cd backend && npm run test:e2e`: ok

## Pendencias pos-task
- validar manualmente no navegador com o ERP real se a regra de atualizacao automatica tambem esta alinhada ao ambiente remoto de producao

## Status final
done
