---
name: executar-task
description: executar uma task da raiz em backlog unico, roteando para front-end React/Vite, Next.js, backend e mobile opcional conforme tipo, stacks envolvidos e modo de execucao, com suporte a subagentes paralelos para tasks shared/cross-stack e atualizacao obrigatoria de tasks e indice.
---

Execute exatamente uma task da raiz por vez.

## Entrada obrigatoria

Task em `tasks/*.md` contendo:
- `Tipo`
- `Stacks envolvidos`
- `Perfil do projeto` quando houver decisao entre React/Vite, Next.js ou mobile opcional
- `Contrato`
- `Modo de execucao`

## Fluxo obrigatorio

1. Ler contexto global da raiz
2. Ler task e dependencias
3. Identificar o perfil da task:
   - `front-end` para React/Vite
   - `next-js` para Next.js
   - mobile `sim` ou `nao`
4. Classificar a referencia em `design-system/front/` e/ou `design-system/mobile/` quando houver UI:
   - artefato de design system
   - aplicacao-prototipo visual
   - prints de telas
   - ausente
5. Validar bloqueios (incluindo contrato)
6. Marcar task como `in_progress`
7. Rotear execucao:
   - `single-stack`: delegar para stack unica
   - `cross-stack`/`shared`: delegar para stacks em paralelo
8. Consolidar resultados tecnicos
9. Atualizar task da raiz
10. Atualizar `tasks/000-index.md`
11. Finalizar como `done` ou `blocked`

## Regras de roteamento

- Task `front`: executar em `front-end/` quando `Stacks envolvidos` indicar React/Vite ou `front-end`
- Task `front`: executar em `next-js/` quando `Stacks envolvidos` indicar Next.js ou `next-js`
- Task `back`: executar em `backend/`
- Task `mobile`: executar em `mobile/` somente quando mobile estiver confirmado no perfil/task
- Task `shared`: executar conforme `Stacks envolvidos`
- se `Tipo: front` nao indicar claramente `front-end` ou `next-js`, bloquear e pedir correcao da task em vez de escolher por inferencia
- se `Tipo: mobile` existir mas o perfil indicar `mobile: nao`, bloquear e registrar inconsistencia de planejamento

## Regras de subagentes

Para `cross-stack`/`shared`:
- dividir subtrabalho por stack sem sobreposicao de responsabilidade
- executar em paralelo quando possivel
- nao fechar a task antes de consolidar todas as respostas

## Regras de contrato

- para integracao cliente-servidor, `contracts/openapi.yaml` deve existir e cobrir o endpoint relevante
- se contrato estiver ausente/incompleto e impedir execucao segura, marcar `blocked`

## Regras de design system e fidelidade visual

- task `front` com impacto em UI deve inspecionar `design-system/front/` antes de implementar
- task `front` em `next-js` usa a mesma referencia visual `design-system/front/`, mas deve ler o contexto local de `next-js/`
- task `mobile` com impacto em UI deve inspecionar `design-system/mobile/` antes de implementar
- task `shared` com impacto em UI deve inspecionar cada subpasta relevante e registrar a fonte primaria visual de cada stack
- se a subpasta relevante contiver apenas artefatos de design system, seguir fielmente componentes, tokens, regras visuais, estados e comportamento documentados
- se a subpasta relevante contiver uma aplicacao-prototipo visual, tratar essa aplicacao como fonte primaria visual obrigatoria da implementacao para a stack correspondente
- se a subpasta relevante contiver prints de telas declarados na task, tratar esses prints como fonte primaria visual obrigatoria da implementacao para a stack correspondente
- quando houver aplicacao-prototipo visual, implementar a UI fielmente ao que existe nessa aplicacao de exemplo:
  - mesma hierarquia visual
  - mesma composicao de telas
  - mesmos componentes e estados perceptiveis
  - mesma estrutura de navegacao e fluxo visivel ao usuario
  - mesma copy quando a task nao mandar alterar texto
- quando houver prints de telas, implementar a UI fielmente ao que estiver visivel nos arquivos indicados:
  - mesma hierarquia visual e composicao de telas
  - mesmos componentes, copy, estados capturados e densidade visual
  - espacamentos, alinhamentos, cores e proporcoes coerentes com os prints
  - comportamento inferido somente quando a task autorizar ou quando for necessario para acessibilidade/funcionamento basico
- nao reinterpretar, modernizar ou simplificar a UI por iniciativa propria quando houver aplicacao-prototipo visual ou prints de telas na subpasta relevante de `design-system/`
- nao usar `design-system/front/` para inferir UI mobile, nem `design-system/mobile/` para inferir UI front, salvo regra explicita na task
- qualquer desvio visual ou comportamental em relacao a aplicacao-prototipo visual ou aos prints de telas so e permitido se:
  - a task exigir explicitamente
  - houver conflito com `requirements/`, acessibilidade minima, contrato ou limitacao tecnica real
- todo desvio permitido deve ser registrado na task com justificativa objetiva, impacto e escopo do ajuste
- quando prints de telas nao cobrirem estados necessarios, registrar a lacuna e a decisao tomada; bloquear se a lacuna impedir fidelidade critica
- se a subpasta visual relevante estiver ausente ou a fidelidade depender de esclarecimento adicional e o risco de implementar errado for alto, bloquear ou sinalizar para validacao humana em vez de inventar

## Regras de acessibilidade (front-end/UI)

- para task `front` ou qualquer task web com impacto em interface, ler `front-end/docs/ai/ACCESSIBILITY.md` ou `next-js/docs/ai/ACCESSIBILITY.md` conforme stack antes de implementar
- tratar o checklist de acessibilidade como criterio minimo de aceite tecnico
- registrar na atualizacao da task quais praticas de acessibilidade foram aplicadas
- se houver gap de acessibilidade nao resolvido, documentar risco e plano de correcao na task antes de concluir
- se a aplicacao-prototipo visual ou os prints de telas conflitarem com acessibilidade minima, preservar ao maximo a intencao visual e documentar claramente o desvio inevitavel

## Contexto minimo para toda execucao

- `AGENTS.md` e `GUIDE.md` da raiz
- `tasks/000-index.md`
- arquivo da task
- `requirements/`
- `design-system/front/` e/ou `design-system/mobile/` (quando houver UI), identificando qual subpasta governa cada stack afetada e se a referencia primaria e documental, aplicacao-prototipo visual, prints de telas ou ausente
- `front-end/docs/ai/ACCESSIBILITY.md` ou `next-js/docs/ai/ACCESSIBILITY.md` (quando houver UI web, conforme stack)
- `contracts/openapi.yaml` (quando houver API)
- docs locais relevantes da stack afetada

## Arquivos de referencia

- `references/regras-de-execucao.md`
- `references/regras-atualizacao-task.md`
- `references/modelo-relatorio-execucao.md`
