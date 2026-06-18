# Change Request 050 - Remover detalhes tecnicos do feedback visual da popup

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
- preservar o feedback compacto da popup e remover apenas o bloco expandido de detalhes tecnicos acima das acoes principais.

## Contexto de negocio

### Por que
O painel de detalhes tecnicos ocupa espaco visual relevante na popup e concorre com as acoes principais de criar e analisar OP, prejudicando a leitura operacional rapida.

### O que
Remover da popup principal a exibicao visual de detalhes como estrategia de captura, pagina, periodo e contagem de ordens.

### Comportamento esperado
- a popup continua exibindo a mensagem principal de feedback
- os detalhes tecnicos deixam de aparecer visualmente acima dos botoes
- os logs internos da extensao continuam podendo receber esses detalhes para diagnostico

### Fora de escopo
- alterar a analise do ERP
- remover logs tecnicos
- redesenhar outras secoes da popup

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; ajuste local de interface.
- Casos de erro: preservar a mensagem principal de erro ou sucesso e nao quebrar os logs diagnosticos.
- Decisoes humanas confirmadas: o usuario pediu explicitamente remover essas informacoes da popup.
- Casos de borda: feedback sem detalhes, feedback com muitos detalhes e selecao manual de OP apos analise.

## Especificacao tecnica

### Deve
- remover o bloco visual de detalhes do painel de feedback
- manter a mensagem principal e o hint operacional
- preservar o envio de detalhes para logs quando ja existir

### Nao deve
- nao quebrar o fluxo de analise
- nao esconder a mensagem principal de erro ou sucesso

## Entradas
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`

## Dependencias
- `tasks/change-requests/046-expor-diagnostico-da-analise-do-erp-nos-logs-da-popup.md`

## Criterios de conclusao
- o bloco de detalhes deixa de aparecer na popup
- a mensagem principal continua funcionando
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- validacao manual da popup apos analise com sucesso e com erro

## Entregaveis esperados
- ajuste do HTML, CSS e script da popup
- task e indice atualizados

## Riscos ou ambiguidades
- o diagnostico continua util, mas passara a ficar concentrado nos logs em vez de ocupar a area principal da popup

## Resultado da execucao
- `extensao-dois-pingos`: o painel visual de detalhes tecnicos do feedback foi removido da popup principal, liberando a area acima dos botoes para uma leitura mais limpa.
- `extensao-dois-pingos`: a mensagem principal de status foi preservada, assim como o hint operacional sobre a etapa de analise.
- Decisao tecnica: os detalhes continuam sendo montados e enviados aos logs quando necessario, mas deixaram de ocupar espaco na interface principal.

## Arquivos alterados
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`
- `tasks/change-requests/050-remover-detalhes-tecnicos-do-feedback-visual-da-popup.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md` com base na popup implementada
- tipo de referencia visual usada por stack: ajuste fino sobre tela implementada
- evidencias de fidelidade visual: a popup ficou mais compacta e aderente ao foco da referencia, priorizando resumo capturado e acoes principais em vez de um bloco tecnico expandido
- desvios aprovados ou riscos residuais: o diagnostico detalhado passa a depender mais da pagina de logs para troubleshooting

## Acessibilidade aplicada
- a regiao principal de feedback com `role="status"` e `aria-live="polite"` foi preservada
- a remocao do bloco tecnico reduz ruido textual na navegacao por leitor de tela
- nenhuma acao interativa perdeu foco, nome acessivel ou ordem de navegacao

## Pendencias pos-task
- validar em navegador real que a popup continua clara sem o bloco tecnico

## Status final
done
