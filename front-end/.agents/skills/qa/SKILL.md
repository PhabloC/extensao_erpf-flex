---
name: qa
description: Valida mudancas no projeto `frontend/` com o fluxo de qualidade do repositorio. Use quando precisar revisar regressao, rodar lint, Vitest e build, ou confirmar readiness antes de merge.
metadata:
  short-description: Executa QA do frontend com Vitest
---

# QA

Use esta skill para revisar qualidade no `frontend/`. O objetivo e rodar os checks do repo e apontar riscos reais, nao so listar comando executado.

## Quando usar

Use esta skill quando:

- houve mudanca de codigo no frontend
- o usuario pediu QA, validacao ou review de regressao
- voce precisa confirmar se a alteracao esta pronta para merge
- algum teste ou build falhou e precisa de diagnostico

## Leitura inicial

- `AGENTS.md`
- `docs/ai/QA.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/SECURITY.md` se a mudanca tocar auth, formulario ou integracao

## Workflow

### 1. Entenda o alcance da mudanca

Mapeie se a alteracao afetou:

- UI apenas
- rotas
- hooks ou stores
- formularios
- services ou adapters

### 2. Rode os checks padrao

Dentro de `frontend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run build`

Neste repo, o runner oficial de testes do frontend e o Vitest.

### 3. Revise o que pode ter ficado sem cobertura

Mesmo com tudo verde, procure por:

- hook ou service novo sem teste
- fluxo de rota alterado sem validacao basica
- formulario alterado sem checagem de validacao e erro
- teste fragil preso em detalhe de implementacao

## Como reportar

- se houver problema, reporte primeiro o risco ou falha
- se tudo passar, diga isso explicitamente
- se algum check nao puder rodar, explique o bloqueio

## Exemplos

- "Validar um novo dashboard" -> rodar lint, Vitest e build; depois revisar se hooks e componentes novos tem cobertura suficiente
- "Checar um refactor de formulario" -> confirmar validacao, fluxo de submit e tratamento de erro
