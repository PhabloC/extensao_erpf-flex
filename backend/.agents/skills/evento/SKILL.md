---
name: evento
description: Cria ou refatora eventos no projeto `backend/` seguindo os padroes do repositorio. Use quando a tarefa envolver observer, emissao de eventos de dominio, listeners desacoplados, side effects ou reacoes apos acoes de negocio.
metadata:
  short-description: Cria eventos no padrao do backend
---

# Evento

Use esta skill para aplicar observer no backend com eventos de dominio. O objetivo e desacoplar side effects do fluxo principal.

## Quando usar

- emitir `user.created` ou evento similar
- criar listener
- mover efeito colateral para handler
- desacoplar notificacao, analytics ou auditoria

## Leitura inicial

- `AGENTS.md`
- `docs/ai/BACKEND_PATTERNS.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Mantenha o fluxo principal limpo

- service executa a regra principal
- depois emite evento de dominio
- listener reage sem poluir o service

### 2. Faça handlers pequenos

- um efeito por listener quando possivel
- comportamento idempotente
- falha controlada sem quebrar o fluxo principal por acidente

### 3. Feche com validacao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Exemplos

- "Emitir user.created" -> service emite evento, listener envia analytics ou auditoria
- "Mover envio de email para evento" -> reduzir acoplamento do fluxo principal
