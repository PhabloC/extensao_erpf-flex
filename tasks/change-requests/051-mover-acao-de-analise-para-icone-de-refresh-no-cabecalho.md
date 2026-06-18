# Change Request 051 - Mover acao de analise para icone de refresh no cabecalho

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
- preservar o cabecalho compacto da popup e reposicionar a acao de analise como atalho de icone alinhado a direita, sem manter o botao textual no rodape.

## Contexto de negocio

### Por que
O botao textual `Fazer analise` ocupa espaco nas acoes principais, embora sua funcao seja operacional e possa ficar melhor resolvida no cabecalho.

### O que
Trocar o botao textual de analise por um icone de refresh no cabecalho, alinhado a direita do bloco da marca.

### Comportamento esperado
- o cabecalho passa a exibir um botao de refresh alinhado a direita
- o clique nesse icone executa exatamente a mesma funcionalidade da analise atual
- o botao textual `Fazer analise` deixa de aparecer na area de acoes

### Fora de escopo
- alterar a logica de analise do ERP
- mexer no fluxo de criacao da OP
- redesenhar a barra lateral

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; ajuste local de interface.
- Casos de erro: loading da analise, botao de icone sem nome acessivel e manutencao do estado desabilitado durante operacoes.
- Decisoes humanas confirmadas: o usuario pediu explicitamente mover a acao para o cabecalho e reduzir a UI a um icone de refresh.
- Casos de borda: analise em andamento, popup sem dados capturados e foco por teclado no novo atalho.

## Especificacao tecnica

### Deve
- mover a acao de analise para o cabecalho da popup
- usar um botao de icone com nome acessivel claro
- manter a mesma rotina JS da analise atual
- preservar feedback visual de estado ocupado

### Nao deve
- nao manter o botao textual duplicado no rodape
- nao degradar navegacao por teclado

## Entradas
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`

## Dependencias
- `tasks/change-requests/028-adicionar-botao-de-fazer-analise-para-buscar-ops-do-erp.md`

## Criterios de conclusao
- a analise passa a ser acionada pelo icone de refresh no cabecalho
- o botao textual do rodape some
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- validacao manual do clique e do foco no icone de refresh

## Entregaveis esperados
- ajuste do HTML, CSS e script da popup
- task e indice atualizados

## Riscos ou ambiguidades
- o estado de loading precisa continuar compreensivel mesmo sem rotulo textual visivel no botao

## Resultado da execucao
- `extensao-dois-pingos`: a acao de analise saiu do rodape e foi reposicionada no cabecalho da popup, alinhada a direita do bloco da marca.
- `extensao-dois-pingos`: o antigo botao textual `Fazer análise` foi substituido por um atalho de icone com a mesma funcionalidade operacional.
- Decisao tecnica: o estado ocupado da analise passou a ser comunicado no proprio botao de icone por `aria-label`, `title` e animacao visual, sem reintroduzir texto no layout.

## Arquivos alterados
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`
- `tasks/change-requests/051-mover-acao-de-analise-para-icone-de-refresh-no-cabecalho.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md` com base na popup implementada
- tipo de referencia visual usada por stack: ajuste fino sobre tela implementada
- evidencias de fidelidade visual: o cabecalho permaneceu compacto e ganhou uma acao curta alinhada a direita, reduzindo competicao com o CTA principal do rodape
- desvios aprovados ou riscos residuais: a referencia original nao prescrevia esse icone especifico, entao permanece recomendada validacao visual em navegador real

## Acessibilidade aplicada
- o botao de icone recebeu `aria-label` e `title` descritivos para a acao de analise
- o estado ocupado atualiza o nome acessivel para refletir que a analise esta em andamento
- a navegacao por teclado foi preservada, sem remover foco visivel nem alterar a ordem logica dos controles

## Pendencias pos-task
- validar no navegador se o icone comunica bem a acao sem competir com a barra lateral

## Status final
done
