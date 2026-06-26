# Change Request 052 - Ajustar feedback da extensao para 409 de OP ativa

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
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post`
- `contracts/browser-extension-target-system.openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
ajuste funcional sobre popup e logs existentes

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tela implementada `Importar OP para o Kanban`

### Regra de aderencia visual
- preservar a hierarquia atual da popup e da tela de logs, alterando apenas a interpretacao textual do conflito `409` para refletir OP ativa ja existente.

## Contexto de negocio

### Por que
A API alterou a regra do endpoint `POST /api/production-orders/imports/erp-flex`: o `409 duplicate` agora so acontece quando ja existe uma OP ativa para o mesmo `externalOrderId`. Se a OP anterior estiver concluida, a nova importacao sera aceita.

### O que
Atualizar a extensao para interpretar o `409` como conflito com OP ativa em aberto, sem mudar payload nem contrato.

### Comportamento esperado
- a extensao continua enviando o mesmo payload atual
- o `409` passa a ser comunicado como existencia de OP ativa para o `externalOrderId`
- popup e resumo persistido deixam de sugerir bloqueio definitivo por reutilizacao historica do identificador
- se houver log operacional de duplicidade, a copy segue a nova regra de negocio

### Fora de escopo
- alterar o payload de importacao
- alterar backend ou contrato publicado
- redesenhar popup ou pagina de logs

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; o fluxo continua autenticado e local a extensao.
- Casos de erro: `409` com `result=duplicate`, resumo legado salvo no storage e mensagens antigas de duplicidade ainda visiveis na popup.
- Decisoes humanas confirmadas: a mensagem do time da API define explicitamente a nova interpretacao do `409`.
- Casos de borda: usuario reabrindo a popup apos importacao antiga, `externalOrderId` ausente no retorno e manutencao do feedback acessivel via `aria-live`.

## Especificacao tecnica

### Deve
- atualizar a mensagem tratada no `background` para refletir OP ativa ja existente
- ajustar o resumo persistido e o feedback reconstruido na popup para a nova semantica
- preservar o tratamento visual especial do conflito `409`
- manter logs e feedback em PT-BR claro e acionavel

### Nao deve
- nao alterar payload nem heuristica de reenvio compativel
- nao tratar `409` como sucesso de criacao

## Entradas
- `extensao-dois-pingos/src/background.js`
- `extensao-dois-pingos/src/popup.js`

## Dependencias
- `tasks/change-requests/041-traduzir-erros-da-importacao-e-tentar-compatibilidade-com-variacoes.md`

## Criterios de conclusao
- a popup deixa de dizer que a ordem ja foi importada anteriormente quando receber `409`
- o feedback passa a indicar que ja existe uma OP ativa para o pedido
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual da copy de conflito no fluxo da popup

## Entregaveis esperados
- ajuste da copy no background e na popup
- task e indice atualizados

## Riscos ou ambiguidades
- se a API mudar o shape do `409` no futuro sem manter `result=duplicate`, a extensao continuara dependente do contrato atual para classificar o conflito

## Resultado da execucao
- `extensao-dois-pingos`: o tratamento do `409` foi mantido tecnicamente como `duplicate`, mas a copy operacional passou a refletir a nova regra de negocio da API, indicando que ja existe uma OP ativa para o `externalOrderId`.
- `extensao-dois-pingos`: o resumo persistido no storage deixou de usar o prefixo `Duplicada:` e passou a gravar `OP ativa:`, evitando que a popup sugira bloqueio historico definitivo ao reabrir a extensao.
- `extensao-dois-pingos`: a popup continua entendendo o prefixo legado `Duplicada:` para compatibilidade com estados antigos ja salvos no navegador, mas exibe a nova mensagem ao usuario.
- Decisao tecnica: o payload e o fluxo de retry compativel nao foram alterados; o ajuste ficou restrito a interpretacao textual e ao resumo local do conflito `409`.

## Arquivos alterados
- `extensao-dois-pingos/src/background.js`
- `extensao-dois-pingos/src/popup.js`
- `tasks/change-requests/052-ajustar-feedback-da-extensao-para-409-de-op-ativa.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md` com base na popup implementada
- tipo de referencia visual usada por stack: ajuste funcional sobre popup e logs existentes
- evidencias de fidelidade visual: o componente visual especial de conflito foi preservado, com mudanca apenas na copy exibida e no titulo do alerta
- desvios aprovados ou riscos residuais: nenhum desvio visual estrutural; permanece a dependencia do shape atual do `409` retornado pela API

## Acessibilidade aplicada
- o conflito continua anunciado na mesma regiao com `role="alert"` e `aria-live="assertive"`
- a mensagem principal ficou mais especifica sem depender apenas do destaque visual do card
- nenhuma acao interativa teve foco, rotulo ou ordem de navegacao alterados

## Pendencias pos-task
- validar manualmente no navegador com um `409` real se a copy final aprovada pelo time de produto permanece adequada ao contexto operacional

## Status final
done
