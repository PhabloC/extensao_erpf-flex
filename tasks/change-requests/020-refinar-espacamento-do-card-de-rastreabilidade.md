# Change Request 020 - Refinar espacamento do card de rastreabilidade

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
print de tela

### Fonte primaria visual
- contexto visual enviado pelo usuario na conversa
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- manter o card atual e ajustar apenas proporções de espaçamento, alinhamento e respiro visual.

## Contexto de negocio

### Por que
O card de rastreabilidade já possui seta central, mas o espaçamento entre origem, seta e destino ainda está desequilibrado.

### O que
Refinar a proporção de gaps, colunas e padding do card para deixar o bloco mais harmonioso.

### Comportamento esperado
- origem e destino ficam visualmente mais equilibrados
- seta central tem respiro proporcional
- card continua compacto

### Fora de escopo
- alteração de textos
- redesign total do card

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: seta muito colada, destino comprimido, perda de centralização.
- Decisoes humanas confirmadas: o espaçamento deve ficar proporcional.
- Casos de borda: destino em duas linhas, popup estreita.

## Especificacao tecnica

### Deve
- ajustar grid e gaps do card de rastreabilidade
- manter a seta central alinhada
- preservar legibilidade do destino em duas linhas

### Nao deve
- nao ampliar demais o card
- nao voltar ao divisor anterior

## Entradas
- `browser-extension/popup.css`

## Dependencias
- `tasks/change-requests/019-ajustar-divisor-de-rastreabilidade-para-seta-central.md`

## Criterios de conclusao
- card de rastreabilidade fica visualmente proporcional

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup

## Entregaveis esperados
- ajuste de CSS
- task e indice atualizados

## Riscos ou ambiguidades
- ajuste fino pode precisar de nova revisão visual humana

## Resultado da execucao
- `front-end/browser-extension`: o card de rastreabilidade recebeu ajuste de grid, gaps e padding para melhorar a proporção entre origem, seta e destino.
- `front-end/browser-extension`: a coluna central da seta ficou um pouco mais larga, reduzindo a sensação de aperto visual.

## Arquivos alterados
- `browser-extension/popup.css`
- `tasks/change-requests/020-refinar-espacamento-do-card-de-rastreabilidade.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; ajuste apenas proporcional no bloco de rastreabilidade

## Pendencias pos-task
- validar manualmente no navegador se o espaçamento ficou na proporção desejada.

## Status final
blocked
