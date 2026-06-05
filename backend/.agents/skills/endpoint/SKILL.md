---
name: endpoint
description: Cria ou refatora endpoints no projeto `backend/` seguindo a arquitetura do repositorio. Use quando a tarefa envolver controller, rota, DTO de entrada, status HTTP, guard, resposta do endpoint ou ligacao com service.
metadata:
  short-description: Cria endpoints no padrao do backend
---

# Endpoint

Use esta skill quando a mudanca principal estiver na borda HTTP do backend. O foco e manter controller fino e delegar a regra para o service.

## Quando usar

- novo endpoint
- ajuste de rota existente
- aplicacao de guard no endpoint
- mudanca de DTO de request
- reorganizacao de controller grande

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/SECURITY.md`

## Workflow

### 1. Mantenha a responsabilidade certa

Controller deve cuidar de:

- rota
- decorator HTTP
- leitura de params, body e query
- uso de DTO e guard
- delegacao para service

Controller nao deve cuidar de:

- regra de negocio longa
- acesso a banco
- integracao externa

### 2. Modele o contrato com clareza

- use DTOs na entrada
- escolha resposta previsivel
- mantenha nomes claros
- aplique guard quando a rota for protegida

### 3. Feche com validacao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Exemplos

- "Criar GET /users/:id" -> controller recebe param, chama service e devolve resposta consistente
- "Proteger POST /users" -> aplicar guard ou deixar publico conforme regra do modulo
