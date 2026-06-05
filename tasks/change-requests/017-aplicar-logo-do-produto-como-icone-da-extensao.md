# Change Request 017 - Aplicar logo do produto como icone da extensao

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
artefato visual existente no repositorio

### Fonte primaria visual
- `front-end/src/assets/img/logo.png`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- a extensao deve reutilizar a marca existente do produto como icone nativo e manter consistencia no cabeçalho da popup.

## Contexto de negocio

### Por que
O usuario quer que a extensao use a imagem oficial `logo.png` como icone, em vez do placeholder atual.

### O que
Gerar os tamanhos necessarios para a extensao e configurar o manifesto e a popup para usar essa marca.

### Comportamento esperado
- icone da extensao no navegador passa a usar a logo do produto
- popup usa a mesma marca no cabeçalho

### Fora de escopo
- redesenho da logo
- alteracao de identidade visual do sistema principal

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca.
- Casos de erro: arquivo de origem ausente, tamanhos de icone insuficientes, perda de legibilidade em escalas pequenas.
- Decisoes humanas confirmadas: usar `front-end/src/assets/img/logo.png` como base dos icones.
- Casos de borda: toolbar em tamanhos pequenos e popup com cabeçalho compacto.

## Especificacao tecnica

### Deve
- gerar ao menos tamanhos 16, 32, 48 e 128 a partir da logo
- configurar `icons` e `action.default_icon` no manifesto
- usar a mesma imagem no cabeçalho da popup

### Nao deve
- nao manter o placeholder textual como icone principal da extensao

## Entradas
- `front-end/src/assets/img/logo.png`
- `browser-extension/manifest.json`
- `browser-extension/popup.html`
- `browser-extension/popup.css`

## Dependencias
- `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md`

## Criterios de conclusao
- extensao usa a logo configurada no manifesto
- popup usa a logo no cabeçalho

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da extensao recarregada no navegador

## Entregaveis esperados
- arquivos de icone gerados na extensao
- manifesto atualizado
- popup atualizada
- task e indice atualizados

## Riscos ou ambiguidades
- a logo original pode perder detalhe em tamanhos muito pequenos

## Resultado da execucao
- `front-end/browser-extension`: foram gerados icones `16`, `32`, `48` e `128` a partir de `front-end/src/assets/img/logo.png`.
- `front-end/browser-extension`: o manifesto passou a usar esses arquivos em `icons` e `action.default_icon`.
- `front-end/browser-extension`: o cabeçalho da popup passou a usar a mesma marca no lugar do placeholder textual.

## Arquivos alterados
- `browser-extension/assets/icons/logo-16.png`
- `browser-extension/assets/icons/logo-32.png`
- `browser-extension/assets/icons/logo-48.png`
- `browser-extension/assets/icons/logo-128.png`
- `browser-extension/manifest.json`
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/README.md`
- `tasks/change-requests/017-aplicar-logo-do-produto-como-icone-da-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; a extensao passou a reutilizar o ativo visual oficial do produto como marca principal

## Pendencias pos-task
- validar manualmente no navegador se os tamanhos menores do icone permanecem legiveis na toolbar da extensao.

## Status final
blocked
