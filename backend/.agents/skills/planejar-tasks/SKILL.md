---
name: planejar-tasks
description: skill local descontinuada para governanca global. use a skill homonima da raiz em vez desta.
---

Esta skill local esta descontinuada para o novo modelo orquestrado.

Nao use esta skill para planejamento global ou change request.

Use na raiz:
- ../.agents/skills/planejar-tasks
- ../.agents/skills/gerar-tasks-adicionais

Se esta skill for acionada, o comportamento correto e:
1. nao gerar backlog local
2. nao criar tasks fora de ../tasks/
3. instruir uso da skill da raiz correspondente
