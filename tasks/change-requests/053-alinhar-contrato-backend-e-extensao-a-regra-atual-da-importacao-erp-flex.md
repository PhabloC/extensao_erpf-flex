# Change Request 053 - Alinhar contrato, backend e extensao a regra atual da importacao ERP Flex

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
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post`
- `contracts/browser-extension-target-system.openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post`

## Modo de execucao
cross-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
ajuste funcional sem alteracao estrutural de UI

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tela implementada `Importar OP para o Kanban`

### Regra de aderencia visual
- preservar a popup e os logs atuais, alterando apenas payload e copy operacional relacionados a importacao.

## Contexto de negocio

### Por que
O time da API confirmou a regra atual da importacao ERP Flex: a deduplicacao deve bloquear apenas quando ja existe uma OP ativa para o mesmo `externalOrderId`, e o payload aceito inclui campos recomendados adicionais como `customerName`, `variations` e `complementaryFields`.

### O que
Alinhar o contrato publicado, o backend deste repositorio e a extensao para essa regra atual.

### Comportamento esperado
- a extensao envia os campos obrigatorios e os recomendados no payload principal
- o contrato passa a documentar esses campos e a nova semantica do `409`
- o backend local deixa de bloquear reutilizacao de `externalOrderId` quando a OP anterior estiver encerrada
- no modelo local, considerar encerrada a OP em status terminal do sistema

### Fora de escopo
- implementar catalogo real de variacoes e logistica neste repositorio
- criar uma nova modelagem para o campo legado `stage`
- redesenhar popup, logs ou dashboard

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; a importacao segue exigindo sessao autenticada.
- Casos de erro: `409` por OP ativa, `400` por schema antigo rejeitando campos aceitos hoje e reimportacao apos encerramento.
- Decisoes humanas confirmadas: a mensagem do time da API define explicitamente a nova regra e os campos aceitos.
- Casos de borda: payload com `dueDate` ausente e valor apenas em `rawPayload`, historico legado com resumo `Duplicada:` e OP encerrada em status terminal local.

## Especificacao tecnica

### Deve
- aceitar em contrato e DTO os campos `customerName`, `variations` e `complementaryFields`
- fazer a extensao enviar esses campos no payload principal quando disponiveis
- tratar `409` como conflito apenas com OP ativa para o mesmo `externalOrderId`
- permitir nova importacao quando a OP anterior ja estiver encerrada no modelo local
- usar `notes` e `complementaryFields` como fonte de observacao no backend local
- usar `dueDate` do `rawPayload` como fallback quando o campo principal nao vier preenchido

### Nao deve
- nao trocar a chave de deduplicacao
- nao exigir alteracao manual de payload pelo usuario
- nao inventar regra de catalogo que o repositorio nao possui

## Entradas
- `extensao-dois-pingos/src/background.js`
- `backend/src/modules/production-orders/dto/import-production-order-from-erp-flex.dto.ts`
- `backend/src/modules/production-orders/production-orders.service.ts`
- `backend/src/modules/production-orders/production-orders.repository.ts`
- `backend/src/modules/production-orders/production-orders.typeorm.repository.ts`
- `backend/src/modules/production-orders/production-orders.in-memory.repository.ts`
- `backend/src/modules/production-orders/entities/production-order.entity.ts`
- `backend/src/modules/production-orders/production-orders.service.spec.ts`
- `backend/test/app.e2e-spec.ts`
- `contracts/openapi.yaml`
- `contracts/browser-extension-target-system.openapi.yaml`

## Dependencias
- `tasks/change-requests/039-alinhar-payload-da-extensao-ao-contrato-de-importacao.md`
- `tasks/change-requests/052-ajustar-feedback-da-extensao-para-409-de-op-ativa.md`

## Criterios de conclusao
- o payload principal da extensao passa a incluir os campos recomendados aceitos hoje
- o contrato passa a refletir esses campos e a nova semantica do `409`
- o backend local permite reimportar o mesmo `externalOrderId` apos encerramento da OP anterior
- `cd extensao-dois-pingos && npm run check` permanece ok
- `cd backend && npm run test` e `npm run test:e2e` permanecem ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- `cd backend && npm run test`
- `cd backend && npm run test:e2e`

## Entregaveis esperados
- ajuste de payload na extensao
- ajuste de contrato
- ajuste de regra de deduplicacao no backend local
- task e indice atualizados

## Riscos ou ambiguidades
- este repositorio nao possui o dominio de catalogo citado pelo time da API; portanto o comportamento de conciliacao por `item.productCode` e `variations` ficara apenas documentado/aceito no contrato local, sem validacao de negocio equivalente aqui

## Resultado da execucao
- `extensao-dois-pingos`: o payload principal voltou a enviar `customerName`, `variations` e `complementaryFields` quando disponiveis, mantendo `notes` e `rawPayload` como apoio.
- `backend`: a deduplicacao por `externalOrderId` passou a bloquear apenas quando existe OP ativa no modelo local; reimportacoes sao aceitas depois que a ordem anterior entra em status terminal.
- `backend`: o import agora usa `complementaryFields` como fallback de observacao e converte `rawPayload.candidates.dueDate` em `YYYY-MM-DD` quando `dueDate` principal nao vier preenchido.
- `contracts`: os dois contratos OpenAPI passaram a documentar os campos recomendados aceitos e a nova semantica do `409` como conflito com OP ativa.
- Decisao tecnica: como este repositorio nao tem o campo legado `stage`, a equivalencia de "encerrada" foi mapeada para os status terminais locais `done` e `canceled`.

## Arquivos alterados
- `extensao-dois-pingos/src/background.js`
- `backend/src/modules/production-orders/dto/import-production-order-from-erp-flex.dto.ts`
- `backend/src/modules/production-orders/entities/production-order.entity.ts`
- `backend/src/modules/production-orders/production-orders.repository.ts`
- `backend/src/modules/production-orders/production-orders.in-memory.repository.ts`
- `backend/src/modules/production-orders/production-orders.typeorm.repository.ts`
- `backend/src/modules/production-orders/production-orders.service.ts`
- `backend/src/modules/production-orders/production-orders.service.spec.ts`
- `backend/test/app.e2e-spec.ts`
- `contracts/openapi.yaml`
- `contracts/browser-extension-target-system.openapi.yaml`
- `tasks/change-requests/053-alinhar-contrato-backend-e-extensao-a-regra-atual-da-importacao-erp-flex.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- `cd backend && npm run test`: ok
- `cd backend && npm run test:e2e`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md` com base na popup implementada
- tipo de referencia visual usada por stack: ajuste funcional sem alteracao estrutural de UI
- evidencias de fidelidade visual: a interface visual foi preservada; mudaram apenas payload e copy operacional de importacao
- desvios aprovados ou riscos residuais: o repositorio continua sem a camada de catalogo citada pelo time da API para validar `productCode` x `variations`

## Acessibilidade aplicada
- o ajuste nao alterou estrutura de navegacao, foco ou nomes acessiveis da popup
- a mensagem de conflito `409` continua sendo anunciada nas regioes ja existentes com `aria-live`

## Pendencias pos-task
- validar em ambiente real com o backend atualizado se o envio padrao dos campos recomendados elimina a necessidade do retry compativel em producao
- decidir em task futura se o modelo local precisa representar explicitamente o campo legado `stage` para refletir sistemas externos com maior fidelidade

## Status final
done
