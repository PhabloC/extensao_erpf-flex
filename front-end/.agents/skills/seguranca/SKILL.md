---
name: seguranca
description: Revisa ou reforca aspectos de seguranca no projeto `frontend/`. Use quando a tarefa tocar auth, tokens, rotas protegidas, formularios, renderizacao de conteudo externo, variaveis de ambiente ou chamadas de API.
metadata:
  short-description: Revisa seguranca do frontend
---

# Seguranca

Use esta skill para uma passada focada em seguranca no `frontend/`. As regras do repo continuam vindo de `AGENTS.md` e `docs/ai/SECURITY.md`.

## Quando usar

Use esta skill quando houver:

- login, logout, sessao ou token
- rota protegida ou fluxo de autorizacao
- formulario que recebe entrada do usuario
- renderizacao de HTML, markdown ou conteudo nao confiavel
- ajuste de `import.meta.env` ou configuracao de API
- pedido direto de review de seguranca

## Leitura inicial

- `AGENTS.md`
- `docs/ai/SECURITY.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/QA.md`

## Workflow

### 1. Mapeie a superficie de risco

Veja se a mudanca encosta em:

- armazenamento de token
- rotas publicas e protegidas
- renderizacao de entrada nao confiavel
- exposicao de variaveis de ambiente
- tratamento de erro vindo da API

### 2. Revise os riscos mais comuns

Cheque:

- segredo exposto no client
- uso inseguro de HTML
- fluxo de auth improvisado fora do padrao do repo
- validacao fraca em formulario
- erro bruto da API vazando para a UI

### 3. Se houver mudanca de codigo, valide

Dentro de `frontend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run build`

## Como reportar

- priorize risco real e facil de explorar
- se nao achar problema, diga explicitamente
- se houver ponto sem cobertura, mencione como risco residual

## Exemplos

- "Revisar login" -> checar fluxo de token, estado de auth, redirect e exposicao de dados
- "Harden de pagina com markdown" -> revisar limite de sanitizacao e renderizacao segura
