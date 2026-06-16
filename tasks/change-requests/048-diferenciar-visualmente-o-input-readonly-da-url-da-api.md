# Change Request 048 - Diferenciar visualmente o input readonly da URL da API

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
- preservar a composicao atual da tela avancada, deixando claro visualmente que o campo de URL e apenas leitura.

## Contexto de negocio

### Por que
Mesmo readonly, o campo da URL ainda parece editavel ao passar o mouse, o que gera ambiguidade de uso.

### O que
Ajustar cursor e aparencia do input readonly da URL da API para comunicar que ele nao aceita edicao manual.

### Comportamento esperado
- o campo nao mostra cursor de texto ao passar o mouse
- o campo ganha uma cor/estado visual diferente dos inputs editaveis
- a leitura do valor continua clara

### Fora de escopo
- alterar os presets
- mudar o fluxo de salvar ou autenticar
- redesenhar a tela avancada

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; ajuste estritamente visual.
- Casos de erro: contraste insuficiente e campo readonly ainda parecer ativo.
- Decisoes humanas confirmadas: o usuario pediu explicitamente remover o ponteiro de edicao e diferenciar a cor.
- Casos de borda: foco por teclado no campo, leitura do valor longo e consistencia com o tema escuro atual.

## Especificacao tecnica

### Deve
- aplicar estilo especifico para `input[readonly]`
- remover o cursor de texto no hover
- manter contraste e legibilidade do valor

### Nao deve
- nao degradar acessibilidade
- nao afetar inputs editaveis da tela

## Entradas
- `extensao-dois-pingos/popup.css`

## Dependencias
- `tasks/change-requests/047-tornar-url-da-api-somente-leitura-com-selecao-por-presets.md`

## Criterios de conclusao
- o input readonly da URL deixa de parecer editavel
- os demais campos continuam com o estilo atual
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- verificacao manual do hover e foco no campo readonly

## Entregaveis esperados
- ajuste visual no CSS
- task e indice atualizados

## Riscos ou ambiguidades
- o estado readonly precisa ficar claro sem parecer campo desabilitado ou ilegivel

## Resultado da execucao
- `extensao-dois-pingos`: o input readonly da `URL base da API` deixou de exibir cursor de edicao no hover.
- `extensao-dois-pingos`: o mesmo campo ganhou fundo, borda e cor de texto ligeiramente distintos para comunicar visualmente o estado nao editavel.
- Decisao tecnica: o ajuste ficou restrito ao seletor `input[readonly]`, preservando integralmente o estilo dos campos editaveis.

## Arquivos alterados
- `extensao-dois-pingos/popup.css`
- `tasks/change-requests/048-diferenciar-visualmente-o-input-readonly-da-url-da-api.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md` com base na tela avancada implementada
- tipo de referencia visual usada por stack: ajuste fino sobre tela implementada
- evidencias de fidelidade visual: a tela avancada foi preservada; apenas o campo readonly ganhou um estado visual proprio coerente com a paleta escura atual
- desvios aprovados ou riscos residuais: permanece recomendada a validacao manual do contraste em navegador real

## Acessibilidade aplicada
- a leitura do valor foi preservada com contraste adequado
- o campo continua focavel e identificavel, apenas sem sugerir edicao por cursor de texto

## Pendencias pos-task
- verificar manualmente o hover e o foco do campo readonly apos recarregar a extensao

## Status final
done
