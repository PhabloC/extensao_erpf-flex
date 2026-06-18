# Change Request 049 - Permitir busca digitada no dropdown de OPs da extensao

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
- `nao se aplica`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
ajuste fino sobre tela implementada

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tela implementada `Importar OP para o Kanban`

### Regra de aderencia visual
- preservar o dropdown compacto existente e acrescentar apenas a capacidade de buscar digitando dentro dele.

## Contexto de negocio

### Por que
Quando a analise retorna muitas OPs, o dropdown atual obriga o usuario a percorrer manualmente a lista inteira, o que aumenta o risco de selecao errada e deixa a operacao lenta.

### O que
Permitir que o seletor de ordens da popup combine dropdown e busca digitada no mesmo fluxo.

### Comportamento esperado
- o usuario continua podendo abrir a lista de OPs como dropdown
- ao abrir a lista, existe um campo para digitar e filtrar as ordens encontradas
- a selecao manual da OP continua funcionando normalmente

### Fora de escopo
- redesenhar a popup
- alterar a estrategia de analise do ERP
- mudar o payload de importacao

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; ajuste local de interface.
- Casos de erro: lista longa sem filtro, busca sem resultado e preservacao da OP selecionada.
- Decisoes humanas confirmadas: o usuario pediu explicitamente poder digitar para pesquisar sem perder a opcao de dropdown.
- Casos de borda: lista com uma unica OP, filtro vazio, filtro sem match e reabertura do painel apos nova analise.

## Especificacao tecnica

### Deve
- manter o dropdown compacto atual
- adicionar campo de busca textual no painel de ordens
- filtrar por OP, codigo e demais textos visiveis da opcao
- manter navegacao por teclado e foco visivel

### Nao deve
- nao remover a selecao por clique
- nao quebrar o estado atual de importacao ou confirmacao

## Entradas
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`

## Dependencias
- `tasks/change-requests/046-expor-diagnostico-da-analise-do-erp-nos-logs-da-popup.md`

## Criterios de conclusao
- o painel de ordens aceita digitacao para filtrar a lista
- o dropdown continua disponivel para selecao manual
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- validacao manual de abertura do dropdown, digitacao e selecao da OP

## Entregaveis esperados
- ajuste do HTML, CSS e script da popup
- task e indice atualizados

## Riscos ou ambiguidades
- o campo de busca precisa continuar compacto para nao reabrir problemas de largura da popup

## Resultado da execucao
- `extensao-dois-pingos`: o dropdown de ordens passou a abrir com um campo de busca textual no topo do painel, permitindo filtrar OP, codigo e variacoes enquanto o usuario digita.
- `extensao-dois-pingos`: a selecao manual por clique foi preservada, incluindo destaque da OP atual e estado vazio quando nenhum item combina com o filtro informado.
- Decisao tecnica: o filtro foi aplicado apenas sobre os rótulos já exibidos na lista, evitando alterar o fluxo de analise do ERP ou a estrutura do payload.

## Arquivos alterados
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`
- `tasks/change-requests/049-permitir-busca-digitada-no-dropdown-de-ops-da-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md` com base na popup implementada
- tipo de referencia visual usada por stack: ajuste fino sobre tela implementada
- evidencias de fidelidade visual: o seletor permaneceu compacto e em formato dropdown; a unica extensao visual foi o campo de busca interno no proprio painel
- desvios aprovados ou riscos residuais: permanece recomendada validacao manual com listas extensas para calibrar a ergonomia do filtro

## Acessibilidade aplicada
- o campo de busca recebeu `label` associado, ainda que visualmente oculto
- o foco passa para o campo ao abrir o painel, mantendo navegacao por teclado e indicador visual existente
- o estado sem resultados e a lista continuam em elementos semanticos simples e legiveis

## Pendencias pos-task
- validar em navegador real com lista longa de OPs

## Status final
done
