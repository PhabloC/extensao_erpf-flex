# Regras de execucao (raiz)

## Principio

Uma task da raiz por vez, com possibilidade de paralelismo interno quando a task for cross-stack.

## Quando usar paralelismo

- task com `Modo de execucao: cross-stack`
- task `shared` com stacks independentes

## Quando bloquear

- dependencia nao concluida
- requisito ambiguo impeditivo
- contrato ausente para integracao
- task `front` sem indicar `front-end` ou `next-js` em `Stacks envolvidos`
- task `mobile` quando o perfil do projeto indicar que nao ha mobile
- limitacao de ambiente impeditiva
- referencia visual ambigua ou conflitante quando a fidelidade da UI for critica
- prints de telas insuficientes para cobrir estado/fluxo critico sem premissa registrada

## Regra de rastreabilidade

Toda execucao deve deixar claro:
- o que foi feito em cada stack
- qual stack web foi usada quando `Tipo` for `front` (`front-end` ou `next-js`)
- quais arquivos mudaram
- quais validacoes rodaram
- o que ficou pendente
- qual fonte em `design-system/front/` ou `design-system/mobile/` governou a UI de cada stack
- se a implementacao ficou fiel a uma aplicacao-prototipo visual, prints de telas ou quais desvios foram aceitos
