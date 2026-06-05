# Change Request 013 - Corrigir overflow horizontal da popup

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
- preservar a popup compacta sem permitir que blocos internos estourem horizontalmente.

## Contexto de negocio

### Por que
Depois dos ultimos refinamentos, a popup passou a cortar conteúdo pela direita, reduzindo a legibilidade dos blocos de período e da lista de OPs.

### O que
Ajustar a largura útil e o box model da popup para impedir overflow horizontal do conteúdo interno.

### Comportamento esperado
- popup inteira cabe na área visível da extensão
- blocos internos respeitam a largura do card
- nenhum conteúdo principal fica cortado à direita

### Fora de escopo
- redesign da popup
- mudança de fluxo funcional

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao ha mudanca de permissao.
- Casos de erro: largura fixa somada a padding, elementos com `width: 100%`, corte visual em navegadores base Chromium.
- Decisoes humanas confirmadas: a popup nao pode continuar com conteúdo saindo pela direita.
- Casos de borda: dropdown fechado, dropdown aberto, inputs de data e labels longas.

## Especificacao tecnica

### Deve
- corrigir a largura util do container principal
- manter o conteúdo interno contido dentro do card
- validar que dropdown e campos de data respeitam a nova largura

### Nao deve
- nao manter largura fixa que estoure com padding externo
- nao introduzir scroll horizontal na popup

## Entradas
- `browser-extension/popup.css`
- `browser-extension/popup.html`

## Dependencias
- `tasks/change-requests/011-expor-e-permitir-ajuste-do-periodo-de-emissao-na-extensao.md`
- `tasks/change-requests/012-substituir-seletor-nativo-por-dropdown-compacto-de-ops.md`

## Criterios de conclusao
- popup deixa de cortar conteúdo à direita
- layout continua compacto e legível

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup no navegador

## Entregaveis esperados
- ajuste de CSS
- task e indice atualizados

## Riscos ou ambiguidades
- uma correção muito agressiva pode encolher demais a área útil da popup

## Resultado da execucao
- `front-end/browser-extension`: a largura fixa da popup passou a ser controlada no `body`, enquanto a `popup-shell` passou a usar `width: 100%`, evitando somar largura fixa com padding externo.
- `front-end/browser-extension`: os blocos internos voltaram a respeitar a área útil do card, reduzindo o corte visual à direita.

## Arquivos alterados
- `browser-extension/popup.css`
- `tasks/change-requests/013-corrigir-overflow-horizontal-da-popup.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; ajuste exclusivamente estrutural de largura util

## Pendencias pos-task
- validar manualmente no navegador se o período, o dropdown de OPs e o restante do conteúdo deixaram de cortar à direita.

## Status final
blocked
