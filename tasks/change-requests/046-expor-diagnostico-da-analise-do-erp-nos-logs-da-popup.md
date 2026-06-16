# Change Request 046 - Expor diagnostico da analise do ERP nos logs da popup

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
ajuste tecnico sem mudanca estrutural de layout

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- preservar a popup atual e acrescentar apenas diagnostico textual nos feedbacks e logs da etapa de analise.

## Contexto de negocio

### Por que
Mesmo com correcoes recentes no coletor, ainda existe um cenario em que a OP nao aparece na extensao. Falta visibilidade sobre o retorno bruto da analise para distinguir rapidamente entre falta de payload, filtro zerado, erro de campos obrigatorios ou falha de selecao.

### O que
Expor na popup e nos logs locais um diagnostico operacional resumido do retorno de `ERP_FLEX_COLLECT_ORDER`.

### Comportamento esperado
- a analise deve registrar detalhes sobre quantidade de opcoes, presenca de payload principal, codigo de erro, endpoint usado e principais flags de captura
- quando a analise falhar, esses detalhes devem aparecer no feedback e no log local
- quando a analise tiver sucesso, os logs tambem devem registrar o resumo diagnostico para apoiar troubleshooting

### Fora de escopo
- redesenhar a interface
- alterar a estrategia de captura
- mudar o payload de importacao enviado ao backend

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; ajuste local de interface e logs.
- Casos de erro: resposta sem `payload`, resposta com `payloadOptions`, falha com `missingFields`, pagina suportada sem resultados no periodo.
- Decisoes humanas confirmadas: o usuario pediu instrumentacao de diagnostico para descobrir por que a OP nao aparece.
- Casos de borda: analise bem-sucedida com uma OP, analise com varias OPs, analise com preview parcial e analise com erro.

## Especificacao tecnica

### Deve
- consolidar um resumo diagnostico a partir de `payload`, `payloadOptions`, `missingFields`, `code` e `extractionMeta`
- reaproveitar esse resumo tanto no feedback da popup quanto no log local
- manter a copy principal existente e acrescentar apenas detalhes tecnicos objetivos

### Nao deve
- nao registrar dados excessivos ou dumps completos do payload bruto
- nao alterar o fluxo funcional de analise e importacao

## Entradas
- `extensao-dois-pingos/src/popup.js`

## Dependencias
- `tasks/change-requests/045-auto-selecionar-op-unica-retornada-pelo-endpoint-do-erp.md`

## Criterios de conclusao
- a popup passa a mostrar detalhes diagnosticos relevantes da analise
- os logs locais passam a registrar o mesmo resumo
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- validacao manual no fluxo `Fazer analise`

## Entregaveis esperados
- ajuste do script da popup
- task e indice atualizados

## Riscos ou ambiguidades
- o resumo precisa ser informativo sem expor conteudo volumoso demais no painel de feedback

## Resultado da execucao
- `extensao-dois-pingos`: a popup agora consolida um resumo diagnostico da resposta de `ERP_FLEX_COLLECT_ORDER`, incluindo codigo de erro, presenca de payload principal, quantidade de opcoes, endpoint usado e flags relevantes da captura.
- `extensao-dois-pingos`: o mesmo resumo passa a ser reaproveitado nos logs locais da analise, facilitando descobrir se a falha esta em filtro, selecao, campos faltantes ou ausencia de payload.
- Decisao tecnica: o diagnostico foi centralizado em um helper unico da popup para evitar divergencia entre feedback visual e trilha operacional local.

## Arquivos alterados
- `extensao-dois-pingos/src/popup.js`
- `tasks/change-requests/046-expor-diagnostico-da-analise-do-erp-nos-logs-da-popup.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual usada por stack: ajuste tecnico sem mudanca estrutural de layout
- evidencias de fidelidade visual: a popup manteve a mesma estrutura e copy principal; apenas os detalhes operacionais ganharam mais contexto textual para troubleshooting
- desvios aprovados ou riscos residuais: os detalhes ficaram mais densos no painel de feedback durante a analise, mas sem alterar a hierarquia visual principal da popup

## Acessibilidade aplicada
- nao houve mudanca em controles interativos; o ajuste ficou restrito ao conteudo textual ja anunciado pela regiao de feedback

## Pendencias pos-task
- executar a analise novamente no ERP real e consultar os novos detalhes/logs para isolar a causa final caso a OP ainda nao apareca

## Status final
done
