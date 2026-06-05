# Change Request 015 - Restaurar largura estavel da popup sem colapso

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
- a popup deve manter largura compacta e estavel, sem corte horizontal e sem colapso extremo.

## Contexto de negocio

### Por que
O ultimo ajuste de largura eliminou um overflow, mas introduziu colapso severo da popup, tornando a extensao inutilizavel.

### O que
Restaurar uma largura fixa e estavel para a popup, corrigindo o problema estrutural sem voltar ao overflow horizontal.

### Comportamento esperado
- popup abre com largura consistente
- conteudo interno nao sai pela direita
- popup nao colapsa para uma coluna estreita

### Fora de escopo
- redesign da popup
- mudanca de fluxo funcional

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca.
- Casos de erro: largura colapsada, largura cortada, dropdown aberto, campos de data lado a lado.
- Decisoes humanas confirmadas: a popup atual ficou quebrada e precisa de restauracao de largura estavel.
- Casos de borda: popup com scroll vertical, cards com pill de contagem, labels longas.

## Especificacao tecnica

### Deve
- restaurar largura estavel para `html` e `body`
- manter contenção horizontal dos blocos internos
- preservar usabilidade dos campos de data e do dropdown de OPs

### Nao deve
- nao colapsar a popup
- nao reintroduzir overflow horizontal do layout principal

## Entradas
- `browser-extension/popup.css`

## Dependencias
- `tasks/change-requests/014-conter-largura-da-popup-e-inicializar-periodo-no-mes-atual.md`

## Criterios de conclusao
- popup volta a abrir com largura normal
- conteudo principal deixa de cortar ou colapsar

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup

## Entregaveis esperados
- ajuste de CSS
- task e indice atualizados

## Riscos ou ambiguidades
- um ajuste parcial pode voltar o overflow anterior

## Resultado da execucao
- `front-end/browser-extension`: a popup voltou a usar largura fixa estavel no documento (`html` e `body`), eliminando o colapso extremo introduzido pelo ajuste anterior.
- `front-end/browser-extension`: a largura util foi levemente ampliada para `388px`, preservando o carater compacto da extensao e dando mais folga para os campos de data e o dropdown de OPs.

## Arquivos alterados
- `browser-extension/popup.css`
- `tasks/change-requests/015-restaurar-largura-estavel-da-popup-sem-colapso.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; ajuste estrutural de largura sem alterar o fluxo visual principal

## Pendencias pos-task
- validar manualmente no navegador se a popup voltou ao tamanho correto e sem corte horizontal relevante.

## Status final
blocked
