# Change Request 029 - Corrigir null reference na popup ao controlar botoes ausentes

## Status
done

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
ajuste tecnico sobre tela implementada

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- a popup deve continuar abrindo sem erro de runtime mesmo quando certos controles opcionais nao existirem mais no HTML.

## Contexto de negocio

### Por que
Depois dos ajustes recentes na popup, o script ainda tenta desabilitar um botao que nao existe mais na tela, gerando `Cannot set properties of null`.

### O que
Tornar o controle de estado ocupado da popup resiliente a elementos opcionais ausentes no DOM.

### Comportamento esperado
- popup abre sem erro no console
- acoes principais continuam habilitando e desabilitando corretamente os controles existentes

### Fora de escopo
- redesenhar a popup
- reintroduzir controles removidos

## Entradas
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/src/popup.js`

## Dependencias
- `tasks/change-requests/028-adicionar-botao-de-fazer-analise-para-buscar-ops-do-erp.md`

## Criterios de conclusao
- `setBusy` nao lança erro quando um controle opcional estiver ausente
- popup principal inicializa sem `TypeError` relacionado a `.disabled`

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- verificacao manual da popup sem erro de runtime ao abrir

## Resultado da execucao
- `front-end/extensao-dois-pingos`: o controle de estado ocupado da popup passou a usar guardas para elementos opcionais ausentes no DOM, eliminando a excecao ao tentar acessar `.disabled` em `null`.
- o texto operacional da acao secundaria foi alinhado ao novo CTA `Fazer analise`, inclusive na orientacao de recarga da pagina ERP.

## Arquivos alterados
- `extensao-dois-pingos/src/popup.js`
- `tasks/change-requests/029-corrigir-null-reference-na-popup-ao-controlar-botoes-ausentes.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- verificacao manual da popup em navegador: nao executada neste ambiente

## Status final
done
