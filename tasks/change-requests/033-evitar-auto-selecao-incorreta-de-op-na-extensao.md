# Change Request 033 - Evitar auto-selecao incorreta de OP na extensao

## Status
done

## Tipo
shared

## Stacks envolvidos
- front-end

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/components/schemas/ErpFlexImportPayload` (sem alteracao de contrato; ajuste apenas na escolha do payload correto antes da importacao)

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
- manter a popup compacta e usar o dropdown de OPs ja existente quando a captura nao conseguir provar qual registro do endpoint corresponde a tela atual.

## Contexto de negocio

### Por que
Quando o endpoint do ERP retorna varias OPs para o periodo analisado, a extensao pode assumir automaticamente um registro errado e preencher a popup com dados de outra ordem. Esse erro operacional e mais grave do que deixar a escolha em aberto, porque induz revisao e importacao sobre uma OP incorreta.

### O que
Tornar a selecao automatica conservadora: a extensao so deve autoescolher uma OP quando houver match suficientemente confiavel entre os sinais da pagina atual e o registro estruturado. Caso contrario, deve exigir selecao explicita no dropdown antes da importacao.

### Comportamento esperado
- se houver uma unica OP no retorno, ela continua sendo selecionada automaticamente
- se houver varias OPs e o match da pagina com um registro for forte o bastante, a extensao pode autoescolher esse registro
- se houver varias OPs e a confianca for baixa ou ambigua, a extensao nao deve preencher uma OP arbitraria
- nesse caso, a popup deve listar as OPs encontradas, manter a importacao desabilitada e orientar o usuario a selecionar a ordem correta
- apos a selecao manual, a popup deve preencher os dados da OP escolhida e liberar a importacao

### Fora de escopo
- alterar contrato OpenAPI
- redesign completo da popup
- mudar o endpoint do ERP

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; a extensao continua lendo a pagina e o endpoint ja suportado.
- Casos de erro: varias OPs no mesmo periodo, sinais insuficientes na tela, empate de heuristica e selecao automatica errada.
- Decisoes humanas confirmadas: em cenario ambiguo, e melhor pedir selecao manual do que assumir uma OP errada.
- Casos de borda: uma unica OP no retorno, match forte por `SC2_Doc` ou `SC2_ID`, match parcial por codigo/variacao e nenhuma pista confiavel na tela.

## Especificacao tecnica

### Deve
- calcular score de match entre os hints da pagina e cada registro estruturado
- considerar auto-selecao apenas quando a confianca for suficientemente forte
- sinalizar via metadata quando a escolha explicita do usuario for obrigatoria
- manter o dropdown de OPs acessivel e utilizavel por teclado
- bloquear o botao de importacao enquanto nenhuma OP estiver selecionada em cenario ambiguo

### Nao deve
- nao escolher o primeiro registro da lista por conveniencia quando o match for fraco
- nao esconder do usuario que existem varias OPs candidatas
- nao quebrar o fluxo atual quando houver apenas uma OP ou um match claramente confiavel

## Entradas
- `extensao-dois-pingos/src/content-script.js`
- `extensao-dois-pingos/src/popup.js`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

## Dependencias
- `tasks/change-requests/032-corrigir-leitura-de-quantidade-com-milhar-na-extensao.md`

## Criterios de conclusao
- a extensao deixa de autoexibir uma OP arbitraria quando o endpoint retorna varias ordens sem match confiavel
- o dropdown continua permitindo selecao manual da OP correta
- o botao de importacao fica desabilitado ate existir OP selecionada em cenario ambiguo
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual da popup em pagina/lista com varias OPs do ERP

## Entregaveis esperados
- heuristica conservadora de selecao no `content-script`
- feedback operacional atualizado na popup
- task e indice atualizados

## Riscos ou ambiguidades
- a heuristica ainda depende dos sinais realmente expostos pela pagina atual do ERP; se a tela nao expuser pistas suficientes, a selecao manual continuara sendo necessaria por desenho

## Resultado da execucao
- `extensao-dois-pingos`: a escolha automatica do registro estruturado passou a exigir score confiavel, evitando preencher a popup com uma OP arbitraria quando o endpoint retorna varias opcoes.
- `extensao-dois-pingos`: quando a confianca e baixa ou ambigua, a popup nao assume nenhuma OP, lista as candidatas e exige selecao manual antes da importacao.
- `extensao-dois-pingos`: o botao de importacao passa a permanecer desabilitado ate existir uma OP efetivamente selecionada nesse cenario.
- Decisoes tecnicas: a heuristica considera match forte por identificadores principais e match parcial por combinacao de sinais; quando o melhor score nao e suficientemente forte, a selecao automatica e abortada.
- Relacao com contrato: nenhuma mudanca; o ajuste ocorre apenas na etapa local de escolha do payload a ser enviado.

## Arquivos alterados
- `extensao-dois-pingos/src/content-script.js`
- `extensao-dois-pingos/src/popup.js`
- `tasks/change-requests/033-evitar-auto-selecao-incorreta-de-op-na-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- mantida; o dropdown de ordens ja existente continua sendo o mecanismo visual para escolha manual sem introduzir nova estrutura de tela

## Acessibilidade aplicada
- mantida; a selecao continua em botoes focaveis dentro da lista da popup
- o feedback textual explica quando a escolha manual passa a ser obrigatoria

## Pendencias pos-task
- validar manualmente no ERP real um cenario com varias OPs no mesmo periodo para ajustar o limiar de confianca caso a pagina exponha sinais mais fortes do que os usados hoje

## Status final
done
