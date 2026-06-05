---
name: qa
description: Valida mudancas no projeto `backend/` com o fluxo de qualidade do repositorio. Use quando precisar revisar regressao, rodar lint, Jest, e2e e build, ou confirmar readiness antes de merge.
metadata:
  short-description: Executa QA do backend com Jest
---

# QA

Use esta skill para revisar qualidade no `backend/`. O objetivo e rodar os checks do repo e apontar risco tecnico real.

## Quando usar

Use esta skill quando:

- houve mudanca de codigo no backend
- o usuario pediu QA, validacao ou review de regressao
- voce precisa confirmar se a alteracao esta pronta para merge
- algum teste unitario, e2e ou build falhou

## Leitura inicial

- `AGENTS.md`
- `docs/ai/QA.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/SECURITY.md` se a mudanca tocar auth, endpoint publico, segredo ou integracao

## Workflow

### 1. Entenda o alcance da mudanca

Mapeie se a alteracao afetou:

- controller e contrato HTTP
- service e regra de negocio
- repository ou entity
- auth
- migration ou config

### 2. Rode os checks padrao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

Neste repo, o runner oficial do backend e o Jest, incluindo os testes e2e.

### 3. Revise o que pode ter ficado sem cobertura

Mesmo com tudo verde, procure por:

- service novo sem teste unitario
- endpoint alterado sem validacao do fluxo principal
- auth alterada sem e2e minimo
- mudanca de entity sem migration correspondente
- repository alterado sem confirmacao de contrato

## Como reportar

- se houver problema, reporte primeiro o risco ou falha
- se tudo passar, diga isso explicitamente
- se algum check nao puder rodar, explique o bloqueio

## Exemplos

- "Validar um endpoint novo" -> rodar lint, Jest, e2e e build; depois revisar se DTO, service e protecao tem cobertura suficiente
- "Checar um refactor de auth" -> confirmar se guard, strategy e fluxo protegido continuam cobertos
