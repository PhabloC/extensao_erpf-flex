# Change Request 022 - Corrigir respeito ao hidden nos paineis da popup

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
- a popup deve respeitar os estados recolhidos dos painéis sem expor conteúdo avançado por padrão.

## Contexto de negocio

### Por que
Mesmo com a seção `Configuracao avancada` implementada, os campos continuam aparecendo porque o CSS está anulando o atributo `hidden`.

### O que
Corrigir o CSS para que painéis e blocos marcados como `hidden` realmente fiquem ocultos.

### Comportamento esperado
- `settings-panel` e `advanced-settings-panel` ficam ocultos quando `hidden`
- conteúdo só aparece ao expandir explicitamente

### Fora de escopo
- alteração de fluxo funcional
- redesign da popup

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: painéis visíveis indevidamente, dropdown sempre aberto, feedback inconsistente.
- Decisoes humanas confirmadas: configuração avançada deve realmente ficar escondida.
- Casos de borda: qualquer bloco futuro usando `hidden`.

## Especificacao tecnica

### Deve
- garantir em CSS que `[hidden]` permaneça oculto
- preservar a renderização correta quando o JS remover ou adicionar `hidden`

### Nao deve
- nao depender de comportamento implícito do user agent stylesheet

## Entradas
- `browser-extension/popup.css`

## Dependencias
- `tasks/change-requests/021-mover-configuracoes-tecnicas-para-secao-avancada-na-engrenagem.md`

## Criterios de conclusao
- paineis ocultos passam a respeitar `hidden`

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup

## Entregaveis esperados
- ajuste de CSS
- task e indice atualizados

## Riscos ou ambiguidades
- nenhum risco técnico relevante além de precisar revisar outros elementos ocultáveis

## Resultado da execucao
- `front-end/browser-extension`: foi adicionada uma regra global de `[hidden]` para garantir que painéis e blocos ocultos realmente não apareçam, mesmo quando classes do componente definem `display: grid`.
- `front-end/browser-extension`: isso corrige a exposição indevida da área `Configuracao avancada` e de outros blocos recolhíveis da popup.

## Arquivos alterados
- `browser-extension/popup.css`
- `tasks/change-requests/022-corrigir-respeito-ao-hidden-nos-paineis-da-popup.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; correção puramente comportamental

## Pendencias pos-task
- validar manualmente no navegador se a engrenagem agora mostra apenas ações rápidas e a `Configuracao avancada` permanece fechada até clique explícito.

## Status final
blocked
