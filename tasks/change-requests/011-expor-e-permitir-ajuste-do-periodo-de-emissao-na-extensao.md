# Change Request 011 - Expor e permitir ajuste do periodo de emissao na extensao

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
- manter a popup compacta e incluir o periodo como controle operacional complementar, sem descaracterizar o fluxo principal.

## Contexto de negocio

### Por que
A pagina do ERP utiliza filtro de periodo de emissao na listagem de OPs. A extensao precisa refletir esse intervalo para evitar capturas excessivas e permitir que o usuario refine a busca sem depender totalmente da tela do ERP.

### O que
Mostrar na popup as datas atuais do filtro de emissao e permitir que o usuario altere `de` e `ate` antes de revisar novamente a lista de OPs.

### Comportamento esperado
- extensao le o periodo atual da URL/pagina do ERP
- popup mostra `Emissao de` e `Emissao ate`
- usuario pode alterar o periodo na extensao
- ao revisar a aba, a extensao reaplica esse periodo na captura do endpoint e filtra as OPs resultantes

### Fora de escopo
- sincronizar automaticamente a UI do ERP com o periodo alterado na extensao
- alterar filtros adicionais do ERP alem de emissao
- importacao em lote

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: a extensao ja captura a URL da aba e faz `fetch` autenticado para o endpoint do ERP.
- Casos de erro: periodo ausente na URL, datas invertidas, periodo alterado na extensao sem refletir na tela do ERP, retorno vazio.
- Decisoes humanas confirmadas: o usuario quer visibilidade do periodo e capacidade de sobrescrever o filtro na propria extensao.
- Casos de borda: apenas uma das datas preenchida, periodo vazio, data no formato ERP `dd/mm/aaaa`, pagina com filtro legado salvo.

## Especificacao tecnica

### Deve
- extrair `SC2_Emissao_De` e `SC2_Emissao_Ate` da URL atual quando disponiveis
- exibir esses valores na popup como campos editaveis
- enviar o periodo escolhido ao `content-script` ao revisar a aba
- reaplicar o periodo na URL do endpoint e filtrar os registros retornados por `SC2_Emissao`
- informar no feedback qual periodo esta sendo usado

### Nao deve
- nao depender apenas do total bruto retornado pela pagina
- nao obrigar o usuario a mudar o filtro diretamente na tela do ERP
- nao quebrar o fluxo atual quando nenhum periodo estiver informado

## Entradas
- `browser-extension/src/content-script.js`
- `browser-extension/src/popup.js`
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `response.md`

## Dependencias
- `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md`

## Criterios de conclusao
- popup mostra o periodo atual do ERP quando disponivel
- usuario consegue alterar o periodo na extensao
- a revisao da aba usa o periodo informado para reduzir/refinar a lista de OPs

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup em pagina real do ERP com filtro mensal

## Entregaveis esperados
- ajuste no `content-script` para aceitar override de periodo
- ajuste na popup para exibir e editar as datas
- task e indice atualizados

## Riscos ou ambiguidades
- o ERP pode usar outros filtros alem do periodo de emissao na mesma URL
- o endpoint pode interpretar datas vazias de forma diferente da interface visual do ERP

## Resultado da execucao
- `front-end/browser-extension`: a extensao passou a ler `SC2_Emissao_De` e `SC2_Emissao_Ate` da URL atual do ERP e exibi-los na popup como campos editaveis.
- `front-end/browser-extension`: a revisao da aba agora envia o periodo escolhido ao `content-script`, que reaplica essas datas na URL do endpoint e filtra os registros por `SC2_Emissao`.
- `front-end/browser-extension`: quando o periodo informado nao encontra OPs, a popup deixa de cair em fallback incorreto e passa a informar que nao houve resultados para o intervalo escolhido.
- `front-end/browser-extension`: o feedback operacional passou a exibir explicitamente o periodo usado na captura, tanto em sucesso quanto em erro.

## Arquivos alterados
- `browser-extension/src/content-script.js`
- `browser-extension/src/popup.js`
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/README.md`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `tasks/change-requests/011-expor-e-permitir-ajuste-do-periodo-de-emissao-na-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- popup manteve o fluxo compacto principal
- o periodo foi adicionado como bloco operacional discreto acima da lista de ordens
- a CTA principal e a revisao de dados permaneceram como foco principal da tela

## Pendencias pos-task
- validar manualmente no ERP real se o endpoint respeita integralmente o periodo sobrescrito pela extensao.
- confirmar se o usuario espera alterar apenas `Emissao` ou tambem outros filtros de listagem no futuro.
- avaliar em task futura se o periodo deve ser persistido localmente entre aberturas da popup.

## Status final
blocked
