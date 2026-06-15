# Change Request 039 - Alinhar payload da extensao ao contrato de importacao

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
- `contracts/openapi.yaml#/components/schemas/ImportProductionOrderFromErpFlexRequest`

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
- change request tecnica focada no payload HTTP enviado pela extensao; nao deve alterar a hierarquia visual da popup.

## Contexto de negocio

### Por que
Na validacao com o projeto em producao, a extensao consegue autenticar o usuario, mas o envio da OP falha com `Request payload is invalid.`. Isso bloqueia a criacao no kanban mesmo com sessao valida.

### O que
Alinhar o payload enviado pela extensao ao schema real de importacao ERP, removendo campos extras fora do contrato e preservando as informacoes complementares apenas nos campos aceitos.

### Comportamento esperado
- a autenticacao continua funcionando como hoje
- a requisicao de importacao passa a respeitar estritamente o contrato declarado
- dados complementares continuam disponiveis em `notes` e `rawPayload` quando aplicavel
- a popup continua exibindo o erro retornado pela API quando houver falha real de validacao de negocio

### Fora de escopo
- alterar o contrato OpenAPI
- alterar o backend do sistema destino
- redesenhar a popup

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; a extensao continua usando sessao autenticada ja existente.
- Casos de erro: API com `whitelist` ativa, retorno generico de `400`, payload parcial e regressao no envio de `notes`/`rawPayload`.
- Decisoes humanas confirmadas: o usuario quer que a extensao funcione contra o projeto em producao sem mudar o contrato da API.
- Casos de borda: payload sem `notes`, `rawPayload` ausente e ambientes que aceitam ou rejeitam propriedades extras.

## Especificacao tecnica

### Deve
- enviar apenas os campos previstos em `ImportProductionOrderFromErpFlexRequest`
- preservar `notes` e `rawPayload` como trilha de diagnostico quando existirem
- manter o fluxo de autenticacao, confirmacao e feedback atual da popup

### Nao deve
- nao adicionar propriedades top-level fora do contrato
- nao perder os dados complementares ja exibidos localmente ao usuario

## Entradas
- `extensao-dois-pingos/src/background.js`
- `contracts/openapi.yaml`
- `backend/src/modules/production-orders/dto/import-production-order-from-erp-flex.dto.ts`

## Dependencias
- `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md`

## Criterios de conclusao
- o body enviado pela extensao fica aderente ao contrato documentado
- o fluxo de importacao deixa de enviar propriedades extras no topo do JSON
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual do payload montado contra o contrato

## Entregaveis esperados
- ajuste do adaptador de payload da extensao
- task e indice atualizados

## Riscos ou ambiguidades
- se o backend de producao divergir do contrato em algum outro ponto, ainda pode haver nova rejeicao apos remover os campos extras

## Resultado da execucao
- `extensao-dois-pingos`: o adaptador de importacao deixou de enviar `customerName`, `variations` e `complementaryFields` como propriedades top-level, mantendo apenas os campos previstos em `ImportProductionOrderFromErpFlexRequest`.
- `extensao-dois-pingos`: os dados complementares continuam preservados em `notes` e `rawPayload`, de modo que a popup e a trilha diagnostica nao perdem contexto operacional.
- Decisao tecnica: a correção foi concentrada em `buildImportPayloadForApi`, porque a autenticacao ja estava valida e o erro vinha da rejeicao do body em ambientes com `whitelist` e `forbidNonWhitelisted`.
- Relacao com contrato: o body enviado agora volta a aderir ao schema de `contracts/openapi.yaml#/components/schemas/ImportProductionOrderFromErpFlexRequest` e ao DTO `ImportProductionOrderFromErpFlexDto` do backend.

## Arquivos alterados
- `extensao-dois-pingos/src/background.js`
- `tasks/change-requests/039-alinhar-payload-da-extensao-ao-contrato-de-importacao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- revisao manual do payload montado contra `contracts/openapi.yaml` e `backend/src/modules/production-orders/dto/import-production-order-from-erp-flex.dto.ts`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: nao se aplica
- tipo de referencia visual usada por stack: nao se aplica
- evidencias de fidelidade visual: nao ha impacto visual previsto
- desvios aprovados ou riscos residuais: nenhum

## Acessibilidade aplicada
- nao se aplica

## Pendencias pos-task
- validar manualmente no navegador o envio para o projeto em producao apos reinstalar/recarregar a extensao

## Status final
done
