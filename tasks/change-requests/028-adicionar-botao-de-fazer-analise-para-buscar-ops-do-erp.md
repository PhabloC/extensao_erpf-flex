# Change Request 028 - Adicionar botao de fazer analise para buscar OPs do ERP

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
- `nao se aplica`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
artefato documental com ajuste funcional sobre tela implementada

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- a popup deve explicitar a etapa de analise da pagina com um CTA proprio antes da criacao da OP no kanban, sem perder a hierarquia visual ja aprovada.

## Contexto de negocio

### Por que
A popup da extensao revisa a aba automaticamente e expõe um botão de revisao, mas o fluxo nao deixa claro para o usuario que existe uma etapa de analise para puxar as Ordens de Producao criadas no ERP antes da importacao.

### O que
Adicionar um botao explicito de fazer analise na extensao para ler a pagina atual do ERP Flex e carregar as OPs encontradas na popup.

### Comportamento esperado
- popup exibe um CTA explicito de analise
- usuario consegue acionar a analise manualmente para puxar as OPs da pagina atual do ERP
- quando houver varias OPs, a lista continua sendo atualizada com as ordens retornadas
- o fluxo de criacao da OP no kanban permanece separado da etapa de analise

### Fora de escopo
- alterar contrato do backend
- criar importacao automatica em background sem acao do usuario
- mudar a estrategia de parsing da pagina alem do necessario para reaproveitar a analise existente

## Entradas
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`

## Dependencias
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`
- `tasks/change-requests/027-remover-referencias-orfas-ao-botao-de-pagina-capturada.md`

## Criterios de conclusao
- existe botao explicito para fazer analise da pagina atual
- a analise atualiza feedback, dados capturados e lista de OPs encontradas
- a criacao da OP continua disponivel apenas como etapa posterior e separada

## Instrucoes de implementacao
- reutilizar a logica atual de coleta da popup em vez de duplicar fluxo
- ajustar copy e estados de loading para distinguir analise de importacao
- manter navegacao por teclado e feedback acessivel via `aria-live`

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- teste manual da popup carregando uma pagina com uma ou varias OPs

## Entregaveis esperados
- popup com CTA de analise
- script da popup com fluxo explicito de analise
- task e indice atualizados

## Riscos ou ambiguidades
- o usuario pode interpretar a analise como importacao concluida se o feedback textual nao separar claramente as duas etapas

## Resultado da execucao
- `front-end/extensao-dois-pingos`: a popup passou a exibir o CTA `Fazer analise` como acao secundaria explicita para puxar as OPs da pagina atual do ERP antes da importacao.
- o fluxo de leitura existente foi reaproveitado, com copy, loading e mensagens de orientacao separados da etapa `Criar OP no Kanban`.
- a documentacao operacional da extensao foi atualizada para refletir o novo nome da acao e seu papel no fluxo.

## Arquivos alterados
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/README.md`
- `tasks/change-requests/028-adicionar-botao-de-fazer-analise-para-buscar-ops-do-erp.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- teste manual da popup carregando pagina real do ERP: nao executado neste ambiente

## Acessibilidade aplicada
- CTA secundario manteve elemento `button` nativo e fluxo de foco por teclado.
- feedback operacional continuou em regiao `aria-live` e agora explica melhor a etapa de analise.

## Status final
done
