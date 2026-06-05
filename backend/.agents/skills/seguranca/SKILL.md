---
name: seguranca
description: Revisa ou reforca aspectos de seguranca no projeto `backend/`. Use quando a tarefa tocar JWT, guards, DTOs, validacao, segredos, endpoints publicos, banco, integracoes externas ou configuracao.
metadata:
  short-description: Revisa seguranca do backend
---

# Seguranca

Use esta skill para uma passada focada em seguranca no `backend/`. As regras do repo continuam vindo de `AGENTS.md` e `docs/ai/SECURITY.md`.

## Quando usar

Use esta skill quando houver:

- auth, JWT, guard ou strategy
- endpoint publico ou mudanca de permissao
- DTO, validacao ou transformacao de entrada
- segredo, variavel de ambiente ou config
- repository, entity ou exposicao de dados sensiveis
- integracao externa
- pedido direto de review de seguranca

## Leitura inicial

- `AGENTS.md`
- `docs/ai/SECURITY.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/QA.md`

## Workflow

### 1. Mapeie a superficie de risco

Veja se a mudanca encosta em:

- autenticacao e autorizacao
- validacao de request
- resposta de erro
- segredo e configuracao
- exposicao de dado sensivel
- integracao externa

### 2. Revise os riscos mais comuns

Cheque:

- controller fazendo regra ou auth demais
- endpoint sem DTO ou guard
- senha sem bcrypt ou hash exposto
- JWT mal configurado
- erro interno vazando na resposta
- CORS ou headers frouxos
- retorno de repository com dado demais
- integracao sem timeout, adapter ou tratamento seguro

### 3. Se houver mudanca de codigo, valide

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Como reportar

- priorize risco concreto
- se nao achar problema, diga explicitamente
- se houver ponto sem cobertura, mencione como risco residual

## Exemplos

- "Revisar auth" -> checar JWT, guard, strategy, hash e protecao de rota
- "Harden de endpoint publico" -> revisar DTO, erro, CORS, limite e exposicao de dados
