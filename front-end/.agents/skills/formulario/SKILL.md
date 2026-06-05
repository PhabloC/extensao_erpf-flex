---
name: formulario
description: Cria ou refatora formularios no projeto `frontend/` usando React Hook Form e Zod. Use quando a tarefa envolver schema, campos, validacao, submit, mensagens de erro, estado de envio ou integracao com services.
metadata:
  short-description: Cria formularios com React Hook Form e Zod
---

# Formulario

Use esta skill para construir formularios do jeito do repo: validacao clara, tipagem forte e submit isolado da camada visual.

## Quando usar

- formulario novo
- refatoracao de formulario grande
- validacao com Zod
- submit com service
- tratamento de erro e loading

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/SECURITY.md`

## Workflow

### 1. Separe as responsabilidades

- schema valida estrutura e regra de entrada
- campos ficam em componente ou page
- submit conversa com service
- adaptacao de payload fica em adapter se necessario

### 2. Modele o fluxo do usuario

- valores iniciais claros
- mensagens de erro objetivas
- botao desabilitado ou loading durante envio
- feedback de sucesso ou falha sem vazar erro bruto

### 3. Evite acoplamento ruim

- nao duplicar regra em varios lugares
- nao colocar validacao solta sem schema
- nao misturar transformacao de API com render

### 4. Feche com checks

Dentro de `frontend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run build`

## Exemplos

- "Criar formulario de cadastro" -> schema Zod, componente com campos, submit chamando service
- "Refatorar filtro com muitos campos" -> extrair schema e reduzir logica inline do JSX
