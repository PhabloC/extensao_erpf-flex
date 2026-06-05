# Change Request 027 - Remover referencias orfas ao botao de pagina capturada

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
ajuste tecnico sobre tela implementada

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- a popup principal nao deve manter comportamento quebrado por referencias a controles removidos da UI.

## Contexto de negocio

### Por que
Depois da simplificacao da engrenagem, o botão `Abrir pagina capturada` saiu do HTML, mas o script da popup continuou tentando manipular esse elemento, gerando erro em runtime.

### O que
Remover ou proteger as referencias restantes ao botão inexistente para restaurar a execucao da popup.

### Comportamento esperado
- popup abre sem erro no console
- fluxo principal de revisao e importacao segue funcional

### Fora de escopo
- reintroduzir o botao removido

## Entradas
- `browser-extension/src/popup.js`

## Resultado da execucao
- `front-end/browser-extension`: o script da popup deixou de tentar alterar um botão inexistente, eliminando o erro `Cannot set properties of null`.

## Arquivos alterados
- `browser-extension/src/popup.js`
- `tasks/change-requests/027-remover-referencias-orfas-ao-botao-de-pagina-capturada.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Status final
blocked
