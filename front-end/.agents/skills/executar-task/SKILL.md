---
name: executar-task
description: executar uma task da raiz no contexto local de Front-end, respeitando o backlog unico, o contrato central openapi e as regras tecnicas da stack.
---

Execute somente o escopo local de uma task da raiz.

## Contexto obrigatorio

1. ../AGENTS.md
2. ../GUIDE.md
3. ../tasks/000-index.md
4. task selecionada em ../tasks/*.md
5. ../requirements/
6. ../design-system/ (quando houver UI)
7. ../contracts/openapi.yaml (quando houver API)
8. AGENTS.md
9. docs/ai/ relevante

## Regras de escopo

- executar apenas parte Front-end da task
- nao replanejar backlog global
- nao criar task fora da raiz
- nao expandir escopo silenciosamente

## Regras de status

- iniciar marcando a task da raiz como in_progress quando aplicavel
- registrar resultado tecnico local para consolidacao
- status final permitido: done ou blocked

## Regras de bloqueio

Marcar blocked quando houver impedimento real:
- dependencia nao concluida
- ambiguidade impeditiva
- contrato ausente/incompleto para integracao
- limitacao de ambiente

## Regras de validacao

Rodar validacoes locais relevantes da stack e declarar exatamente o que foi executado.

## Resultado esperado

Atualizacao rastreavel da task da raiz com:
- resultado local
- arquivos alterados
- validacoes executadas
- pendencias
