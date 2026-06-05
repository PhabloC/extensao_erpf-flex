# Change Request 016 - Exibir cliente na captura da extensao

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
- `nao se aplica`

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
- manter o resumo principal compacto e incluir o cliente como dado operacional relevante da OP.

## Contexto de negocio

### Por que
Na revisão da OP, o cliente é uma informação importante para identificar corretamente a ordem antes da importação.

### O que
Adicionar o cliente na captura e na exibição da popup da extensão.

### Comportamento esperado
- extensão captura o cliente quando disponível
- popup mostra o cliente no resumo principal
- dado permanece associado ao payload capturado

### Fora de escopo
- alteração de contrato backend
- redesign da popup

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: cliente ausente, cliente vazio, origem estruturada com `SA1_Desc` ou `SA1_Fantasia`.
- Decisoes humanas confirmadas: cliente deve aparecer na extensão.
- Casos de borda: cliente longo, múltiplas OPs, fallback DOM sem cliente.

## Especificacao tecnica

### Deve
- capturar cliente via `SA1_Desc` ou `SA1_Fantasia` quando disponível
- exibir cliente no bloco principal da popup
- manter o valor em `rawPayload.candidates`

### Nao deve
- nao quebrar a captura atual quando o cliente nao vier preenchido

## Entradas
- `browser-extension/src/content-script.js`
- `browser-extension/src/popup.js`
- `browser-extension/popup.html`

## Dependencias
- `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md`

## Criterios de conclusao
- popup passa a mostrar o cliente quando presente
- captura continua funcional

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup

## Entregaveis esperados
- ajuste da captura
- ajuste da popup
- task e indice atualizados

## Riscos ou ambiguidades
- em alguns cenarios o ERP pode retornar cliente vazio para ordens internas

## Resultado da execucao
- `front-end/browser-extension`: a captura passou a preservar `customerName` tambem nos caminhos de fallback local e DOM, nao apenas no retorno estruturado principal do endpoint.
- `front-end/browser-extension`: a popup ganhou o campo `Cliente` no resumo principal da OP.
- `front-end/browser-extension`: o preview mockado tambem passou a exibir cliente para facilitar revisao visual.

## Arquivos alterados
- `browser-extension/src/content-script.js`
- `browser-extension/src/popup.js`
- `browser-extension/popup.html`
- `tasks/change-requests/016-exibir-cliente-na-captura-da-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; cliente foi adicionado como mais um par rotulo/valor no bloco principal

## Pendencias pos-task
- validar manualmente no ERP real se o cliente aparece corretamente para os cenarios em que `SA1_Desc` ou `SA1_Fantasia` vierem preenchidos.

## Status final
blocked
