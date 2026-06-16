# Change Request 047 - Tornar URL da API somente leitura com selecao por presets

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
- tela implementada `Configuracao avancada`

### Regra de aderencia visual
- preservar a composicao atual da configuracao avancada, deixando a URL apenas para exibicao e alteracao via presets.

## Contexto de negocio

### Por que
O usuario quer evitar edicao manual da URL da API na tela avancada, mantendo esse campo apenas como exibicao do ambiente atualmente selecionado.

### O que
Tornar o input da URL base somente leitura e permitir alteracao apenas pelos chips `Produção` e `Local`.

### Comportamento esperado
- o campo da URL continua visivel
- o usuario nao consegue editar o valor digitando no input
- a troca de ambiente continua ocorrendo pelos presets
- salvar e autenticar continuam usando o valor exibido no campo

### Fora de escopo
- adicionar novos ambientes
- mudar o fluxo de autenticacao
- alterar os outros campos do formulario

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; ajuste local de UI.
- Casos de erro: campo ficar desabilitado ao ponto de nao refletir o valor salvo e perda do estado visual do preset ativo.
- Decisoes humanas confirmadas: o usuario pediu explicitamente que o input sirva apenas para mostrar a URL.
- Casos de borda: preset aplicado com valor salvo antigo, alternancia entre ambientes e recarga da tela com storage persistido.

## Especificacao tecnica

### Deve
- marcar o campo da URL como somente leitura
- manter o valor sincronizado com o preset selecionado
- deixar a copy da ajuda coerente com a nova restricao

### Nao deve
- nao permitir edicao manual no teclado
- nao quebrar salvar configuracao ou autenticar

## Entradas
- `extensao-dois-pingos/advanced-settings.html`
- `extensao-dois-pingos/src/advanced-settings.js`

## Dependencias
- `tasks/change-requests/043-predefinir-urls-de-api-local-e-producao-na-configuracao-avancada.md`

## Criterios de conclusao
- a URL fica somente leitura
- os presets continuam selecionando e salvando corretamente
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- verificacao manual da troca entre `Produção` e `Local`

## Entregaveis esperados
- ajuste de markup da configuracao avancada
- ajuste de comportamento do script da configuracao avancada
- task e indice atualizados

## Riscos ou ambiguidades
- configuracoes antigas fora dos presets permanecem legiveis, mas deixam de ser editaveis pela UI

## Resultado da execucao
- `extensao-dois-pingos`: o campo `URL base da API` passou a ser somente leitura, servindo apenas para exibir o ambiente atualmente selecionado.
- `extensao-dois-pingos`: a troca entre `Produção` e `Local` continua sendo feita exclusivamente pelos presets visuais, sem edicao manual no teclado.
- Decisao tecnica: o valor exibido no input continua sendo a fonte usada pelos fluxos de salvar configuracao e autenticar, preservando o comportamento existente com a menor mudanca possivel.

## Arquivos alterados
- `extensao-dois-pingos/advanced-settings.html`
- `extensao-dois-pingos/src/advanced-settings.js`
- `tasks/change-requests/047-tornar-url-da-api-somente-leitura-com-selecao-por-presets.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md` com base na tela avancada implementada
- tipo de referencia visual usada por stack: ajuste fino sobre tela implementada
- evidencias de fidelidade visual: a composicao da tela foi preservada; apenas a funcao do campo de URL foi restringida para leitura, mantendo os presets como controles principais
- desvios aprovados ou riscos residuais: configuracoes antigas fora dos presets permanecem apenas como leitura caso ja estejam salvas no storage

## Acessibilidade aplicada
- o campo continua focavel e legivel para tecnologias assistivas
- a selecao de ambiente segue em botoes semanticos acessiveis por teclado

## Pendencias pos-task
- verificar manualmente no navegador a alternancia entre `Produção` e `Local` apos reload da extensao

## Status final
done
