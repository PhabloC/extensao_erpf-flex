# Change Request 041 - Traduzir erros da importacao e tentar compatibilidade com variacoes

## Status
done

## Tipo
front

## Stacks envolvidos
- front-end

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post`
- `contracts/browser-extension-target-system.openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
ajuste funcional sobre popup e pagina de logs existentes

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- preservar a hierarquia atual da popup e da tela de logs, atuando apenas na clareza textual dos erros e no tratamento de compatibilidade do envio.

## Contexto de negocio

### Por que
Na validacao com o projeto em producao, a extensao passou a receber um erro de negocio indicando falta de variacao cadastrada para `item.productCode`, mas a mensagem ainda aparece em ingles e com acentuacao incompleta na tela de logs. Isso dificulta diagnostico e acao operacional.

### O que
Traduzir e normalizar os erros de importacao para PT-BR com acentuacao correta e adicionar uma tentativa de compatibilidade quando a API indicar problema de variacao para o codigo do produto.

### Comportamento esperado
- mensagens e detalhes de erro passam a aparecer em PT-BR
- a tela de logs deixa de exibir copy sem acentos no feedback principal
- quando a API acusar falta de variacao cadastrada e a extensao possuir dados de variacoes, ela tenta um reenvio compativel com campos extras antes de concluir falha
- se ainda falhar, o usuario recebe mensagem clara e acionavel

### Fora de escopo
- alterar o backend do sistema destino
- alterar o contrato oficial publicado
- redesenhar popup ou pagina de logs

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; o fluxo segue usando runtime, storage e fetch ja existentes.
- Casos de erro: backend estrito rejeitando campos extras, backend divergente exigindo variacoes no topo, mensagem em ingles e falha de reenvio compativel.
- Decisoes humanas confirmadas: o usuario pediu correcao do erro observado e ajuste de acentuacao.
- Casos de borda: API responder `400` sem detalhes, variacoes ausentes no payload e retry compativel falhar com esquema nao suportado.

## Especificacao tecnica

### Deve
- traduzir mensagens conhecidas de erro e validacao para PT-BR
- traduzir detalhes por campo quando a API devolver texto conhecido em ingles
- tentar um reenvio compativel com `variations`, `customerName` e `complementaryFields` no topo apenas quando o backend indicar falha de variacao no codigo do produto
- manter o payload padrao aderente ao contrato como primeira tentativa
- corrigir a acentuacao da copy relevante na pagina de logs

### Nao deve
- nao trocar permanentemente o payload padrao por um payload fora do contrato
- nao esconder o detalhe tecnico quando a tentativa compativel tambem falhar

## Entradas
- `extensao-dois-pingos/src/background.js`
- `extensao-dois-pingos/src/logs.js`
- `extensao-dois-pingos/logs.html`

## Dependencias
- `tasks/change-requests/039-alinhar-payload-da-extensao-ao-contrato-de-importacao.md`
- `tasks/change-requests/040-destacar-erros-na-pagina-de-logs-da-extensao.md`

## Criterios de conclusao
- erros conhecidos de importacao deixam de aparecer em ingles na extensao
- feedback da tela de logs usa acentuacao correta
- extensao tenta reenvio compativel quando a API indicar falha de variacao por `item.productCode`
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual do fluxo de traducao e retry compativel

## Entregaveis esperados
- ajuste do tratamento de erro no background
- ajuste textual na tela de logs
- task e indice atualizados

## Riscos ou ambiguidades
- se o backend de producao exigir outra forma de identificar variacao alem dos campos hoje capturados, a tentativa compativel pode ainda nao resolver totalmente a integracao

## Resultado da execucao
- `extensao-dois-pingos`: os erros de importacao passaram a ser traduzidos para PT-BR antes de chegar ao popup e aos logs, incluindo o caso `Request payload is invalid.` e o detalhe de variacao nao cadastrada para `item.productCode`.
- `extensao-dois-pingos`: quando a API responde `400` com indicio de falha de variacao por codigo do produto, a extensao agora tenta uma segunda requisicao compativel, reenviando `variations`, `customerName` e `complementaryFields` no topo do payload para cobrir o comportamento divergente observado em producao.
- `extensao-dois-pingos`: se essa tentativa compativel encontrar um backend estrito que rejeita propriedades extras, a extensao preserva o erro original em vez de trocar o diagnostico por um falso problema de schema.
- `extensao-dois-pingos`: a pagina de logs recebeu copy com acentuacao correta e passou a exibir `Importação`, `Histórico`, `criação` e `revisão` da forma esperada.
- Decisao tecnica: o retry compativel foi limitado ao cenario especifico de variacao nao encontrada para evitar reabrir a regressao anterior de schema fora do contrato como comportamento padrao.

## Arquivos alterados
- `extensao-dois-pingos/src/background.js`
- `extensao-dois-pingos/src/logs.js`
- `extensao-dois-pingos/logs.html`
- `tasks/change-requests/041-traduzir-erros-da-importacao-e-tentar-compatibilidade-com-variacoes.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual usada por stack: ajuste funcional sobre telas existentes
- evidencias de fidelidade visual: a hierarquia e os componentes atuais sao preservados; muda apenas a copy e o comportamento tecnico do envio
- desvios aprovados ou riscos residuais: nenhum

## Acessibilidade aplicada
- erros continuam textuais e visiveis, sem depender apenas de cor
- a regiao `aria-live` segue recebendo mensagens legiveis em PT-BR

## Pendencias pos-task
- validar manualmente no navegador se o backend de producao aceita o retry compativel quando houver variacao disponivel no payload

## Status final
done
