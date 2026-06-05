# Change Request 010 - Suportar listagem de OPs na popup com foco no codigo

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
- preservar a popup compacta da extensao, mas adaptar o fluxo para pagina de listagem com multiplas ordens.

## Contexto de negocio

### Por que
A pagina real do ERP Flex usada no fluxo mostra varias ordens de producao ao mesmo tempo. A extensao precisa refletir esse comportamento, carregar todas as OPs disponiveis e dar destaque ao `Codigo` de cada item para facilitar a escolha correta.

### O que
Alterar a captura e a popup da extensao para listar as OPs encontradas na pagina atual, permitir selecionar qual sera revisada/importada e exibir o `Codigo` como dado de primeira classe.

### Comportamento esperado
- extensao captura todas as ordens retornadas pelo endpoint da pagina
- popup informa quantas OPs foram encontradas
- usuario escolhe a OP desejada diretamente na popup
- `Codigo` aparece com destaque na revisao
- importacao continua acontecendo uma OP por vez, com base na selecao atual

### Fora de escopo
- importacao em lote
- alteracao de contrato backend
- redesign completo da popup

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: a extensao ja possui acesso a aba atual e ao endpoint JSON da propria pagina.
- Casos de erro: lista vazia, codigo ausente em parte das OPs, pagina com apenas uma ordem, pagina sem endpoint estruturado.
- Decisoes humanas confirmadas: a selecao deve priorizar visibilidade do `Codigo` e revisao individual.
- Casos de borda: retorno com varias OPs similares, `SC2_Doc` nao numerico, quantidade e previsao variando entre itens.

## Especificacao tecnica

### Deve
- mapear todas as OPs retornadas por `payload.data`
- expor uma lista de opcoes para a popup
- mostrar quantidade de OPs encontradas
- incluir `Codigo` como campo visivel no resumo principal
- manter compatibilidade com o fluxo de importacao unitario atual

### Nao deve
- nao importar varias OPs em um unico clique
- nao esconder o `Codigo` apenas em detalhes secundarios
- nao quebrar o fallback atual quando a pagina nao retornar lista estruturada

## Entradas
- `response.md`
- `browser-extension/src/content-script.js`
- `browser-extension/src/popup.js`
- `browser-extension/popup.html`
- `browser-extension/popup.css`

## Dependencias
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`
- `tasks/change-requests/008-priorizar-captura-por-endpoint-json-do-erp-flex.md`
- `tasks/change-requests/009-tornar-captura-da-extensao-resiliente-sem-receiver-na-aba.md`

## Criterios de conclusao
- popup permite revisar uma entre varias OPs encontradas
- `Codigo` fica visivel no fluxo principal
- importacao continua enviando uma OP valida por vez

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup em pagina real de listagem do ERP

## Entregaveis esperados
- ajuste no `content-script` para retornar lista de OPs
- ajuste na popup para selecao e destaque do codigo
- task e indice atualizados

## Riscos ou ambiguidades
- a pagina pode ter paginacao e retornar apenas parte das OPs visiveis
- ainda pode existir variacao entre o endpoint e o grid renderizado no ERP

## Resultado da execucao
- `front-end/browser-extension`: o `content-script` passou a retornar varias OPs quando o endpoint JSON da pagina vier com lista em `payload.data`, mantendo uma OP selecionada como payload ativo para importacao.
- `front-end/browser-extension`: a popup ganhou seletor de ordens encontradas e agora exibe a contagem de OPs disponiveis na pagina.
- `front-end/browser-extension`: o `Codigo` do item passou a ser exibido explicitamente no resumo principal da captura, sem depender de detalhes secundarios.
- `front-end/browser-extension`: o fluxo de importacao permaneceu unitario; a extensao importa somente a OP atualmente selecionada pelo usuario na popup.

## Arquivos alterados
- `browser-extension/src/content-script.js`
- `browser-extension/src/popup.js`
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/README.md`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida a popup compacta da extensao
- adicionado apenas um seletor curto para o caso real de listagem de OPs
- `Codigo` promovido a campo principal de conferencia, conforme necessidade operacional identificada na tela do ERP

## Pendencias pos-task
- validar manualmente no ERP real se a lista retornada pelo endpoint corresponde exatamente ao grid visivel da tela.
- confirmar se a ordenacao inicial do seletor deve seguir a ordem do endpoint, da tabela exibida ou alguma regra de negocio adicional.
- validar se existe necessidade futura de filtro por `Codigo` ou busca rapida dentro da popup quando o volume de OPs crescer.

## Status final
blocked
