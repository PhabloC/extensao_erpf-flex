# Change Request 012 - Substituir seletor nativo por dropdown compacto de OPs

## Status
blocked

## Tipo
shared

## Stacks envolvidos
- front-end

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
artefato documental com print derivado

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- manter a popup compacta; a lista de OPs deve abrir em painel contido com rolagem interna.

## Contexto de negocio

### Por que
O seletor nativo de OPs abre uma lista muito grande quando ha muitos itens, prejudicando a usabilidade da popup da extensao.

### O que
Substituir o `select` nativo por um dropdown compacto controlado pela propria popup, com altura limitada e scroll interno.

### Comportamento esperado
- usuario abre a lista de OPs dentro da popup
- a lista ocupa area controlada
- o item atual fica visivel
- a escolha continua atualizando a OP selecionada para importacao

### Fora de escopo
- redesign completo da popup
- virtualizacao sofisticada de lista
- importacao em lote

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao ha mudanca de permissao.
- Casos de erro: lista vazia, item atual ausente, muitos itens longos, fechamento do dropdown ao clicar fora.
- Decisoes humanas confirmadas: a aba aberta pelo seletor atual esta grande demais e precisa ficar contida.
- Casos de borda: labels longas, grande quantidade de OPs, reabertura apos nova revisao da aba.

## Especificacao tecnica

### Deve
- remover dependencia do painel nativo do `select`
- usar dropdown compacto com altura maxima e overflow interno
- manter a selecao atual e o resumo principal sincronizados

### Nao deve
- nao deixar a lista extrapolar a popup como painel nativo gigante
- nao quebrar o fluxo de escolha da OP

## Entradas
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`

## Dependencias
- `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md`
- `tasks/change-requests/011-expor-e-permitir-ajuste-do-periodo-de-emissao-na-extensao.md`

## Criterios de conclusao
- lista de OPs abre em painel compacto e rolavel
- selecao continua funcional
- popup permanece legivel mesmo com muitas OPs

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup com muitas OPs

## Entregaveis esperados
- ajuste de HTML, CSS e JS da popup
- task e indice atualizados

## Riscos ou ambiguidades
- labels muito longas podem exigir truncamento visual
- acessibilidade de teclado precisa ser mantida de forma minima

## Resultado da execucao
- `front-end/browser-extension`: o seletor nativo de OPs foi substituido por um dropdown compacto controlado pela propria popup.
- `front-end/browser-extension`: a lista de ordens agora abre em painel interno com altura maxima e scroll vertical, evitando o painel gigante do navegador.
- `front-end/browser-extension`: a selecao da OP continua sincronizando normalmente o resumo principal e a importacao unitária.

## Arquivos alterados
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`
- `browser-extension/README.md`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `tasks/change-requests/012-substituir-seletor-nativo-por-dropdown-compacto-de-ops.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida a popup compacta
- a lista de OPs passou a respeitar area controlada e rolagem interna, sem extrapolar a extensao

## Pendencias pos-task
- validar manualmente no navegador se o dropdown compacto ficou confortavel com grande volume de OPs reais.
- avaliar em task futura se vale adicionar busca rapida no dropdown quando a quantidade de itens crescer ainda mais.

## Status final
blocked
