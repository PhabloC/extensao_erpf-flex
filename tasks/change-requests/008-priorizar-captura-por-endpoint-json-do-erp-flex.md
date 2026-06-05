# Change Request 008 - Priorizar captura por endpoint JSON do ERP Flex

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
nao se aplica

### Tipo de referencia visual
nao se aplica

### Fonte primaria visual
- nao se aplica

### Regra de aderencia visual
- change request focada em estrategia de captura de dados; sem redesenho de UI.

## Contexto de negocio

### Por que
Foi identificado no network do ERP Flex um endpoint JSON com os dados estruturados da OP, o que e mais estavel que scraping do HTML.

### O que
Alterar a extensao para priorizar leitura dos dados vindos do endpoint JSON da pagina e usar o DOM apenas como fallback.

### Comportamento esperado
- extensao tenta obter os dados estruturados do endpoint do ERP
- extensao seleciona o item mais aderente ao contexto atual da pagina
- se nao conseguir, cai para a heuristica atual de DOM

### Fora de escopo
- interceptacao profunda de requests em DevTools
- reescrita completa da extensao
- alteracao de contrato backend

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: a extensao ja possui `host_permissions` amplas para MVP.
- Casos de erro: endpoint ausente, retorno inesperado, lista sem match claro, sessao expirada do ERP.
- Decisoes humanas confirmadas: preferencia explicita por fonte estruturada do endpoint.
- Casos de borda: pagina com varias OPs, retorno paginado, campos nulos no JSON, match parcial com DOM.

## Especificacao tecnica

### Deve
- tentar ler o endpoint JSON associado a pagina atual
- mapear os campos estruturados do retorno para o payload de importacao
- comparar retorno do endpoint com pistas da pagina para escolher o item correto
- manter fallback por DOM caso o endpoint falhe

### Nao deve
- nao depender exclusivamente do HTML quando o endpoint estiver disponivel
- nao quebrar o fluxo atual de importacao
- nao exigir alteracao de contrato backend

## Entradas
- `response.md`
- `browser-extension/src/content-script.js`
- `browser-extension/src/popup.js`
- `requirements/005-integracao-erp-flex-e-extensao.md`

## Dependencias
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`

## Criterios de conclusao
- extensao prioriza captura por endpoint JSON
- fallback por DOM continua funcional
- payload final permanece aderente ao backend atual

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao estrutural do fluxo de captura

## Entregaveis esperados
- ajuste do `content-script`
- task e indice atualizados

## Riscos ou ambiguidades
- o endpoint identificado pode ser de listagem e nao de detalhe
- ainda pode ser necessario ajustar o algoritmo de match com a pagina real do ERP

## Resultado da execucao
- `front-end/browser-extension`: o `content-script` passou a tentar leitura estruturada do endpoint JSON da pagina antes de usar o fallback atual por bootstrap local e DOM.
- `front-end/browser-extension`: foi adicionado um algoritmo de match para escolher o item mais aderente ao contexto atual da pagina usando pistas como `SC2_ID`, `SC2_Doc`, `SB1_Codigo`, `SB1_Desc` e `XXX_DescChaveItensVar`.
- `front-end/browser-extension`: o payload final continua compatível com o backend atual, mas agora prioriza campos estruturados do endpoint como `SC2_ID`, `SC2_Doc`, `SB1_Codigo`, `SB1_Desc`, `SC2_Quant`, `SB1_UM`, `SC2_Emissao` e `SC2_Previsao`.
- Decisao tecnica: a extensao nao passou a depender exclusivamente do endpoint; manteve fallback para dados locais estruturados e scraping do DOM, reduzindo risco operacional.

## Arquivos alterados
- `browser-extension/src/content-script.js`
- `browser-extension/README.md`
- `tasks/change-requests/008-priorizar-captura-por-endpoint-json-do-erp-flex.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok
- revisao estrutural do fluxo de captura por endpoint e fallback: ok

## Aderencia ao design system
- nao se aplica

## Pendencias pos-task
- validar manualmente na pagina real do ERP se a URL atual realmente permite reconstruir o endpoint `/data` em todos os cenarios relevantes.
- confirmar em ambiente real se o melhor item retornado pelo endpoint corresponde sempre a OP que o usuario pretende importar.
- se houver endpoint de detalhe mais confiavel que o de listagem identificado, migrar a prioridade para ele em task futura.

## Status final
blocked
