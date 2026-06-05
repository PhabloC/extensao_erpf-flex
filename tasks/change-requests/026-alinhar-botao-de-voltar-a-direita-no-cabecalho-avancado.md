# Change Request 026 - Alinhar botao de voltar a direita no cabecalho avancado

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
ajuste fino sobre tela implementada

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- print enviado pelo usuario em `2026-06-05`

### Regra de aderencia visual
- o botao de voltar da tela `Configuracao avancada` deve ficar alinhado na extremidade direita do cabeçalho.

## Contexto de negocio

### Por que
O cabeçalho atual da tela avançada deixa o botão de voltar próximo demais da marca, prejudicando a composição visual.

### O que
Reposicionar o botão de voltar para o lado direito do cabeçalho, preservando logo e textos à esquerda.

### Comportamento esperado
- logo e textos ficam agrupados à esquerda
- seta de voltar fica isolada à direita

### Fora de escopo
- mudança do fluxo de navegação

## Entradas
- `browser-extension/advanced-settings.html`
- `browser-extension/popup.css`

## Resultado da execucao
- `front-end/browser-extension`: o cabeçalho da tela avançada passou a distribuir marca à esquerda e botão de voltar à direita.

## Arquivos alterados
- `browser-extension/popup.css`
- `tasks/change-requests/026-alinhar-botao-de-voltar-a-direita-no-cabecalho-avancado.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Status final
blocked
