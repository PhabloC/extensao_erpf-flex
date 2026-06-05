---
name: service
description: Cria ou refatora services no projeto `backend/` seguindo os padroes do repositorio. Use quando a tarefa envolver regra de negocio, orquestracao, uso de repository, emissao de eventos, selecao de strategy ou composicao com adapters.
metadata:
  short-description: Cria services no padrao do backend
---

# Service

Use esta skill para a camada de regra de negocio do backend. O objetivo e manter o service pequeno, coeso e desacoplado de HTTP e ORM direto quando possivel.

## Quando usar

- regra de negocio nova
- refactor de service grande
- orquestracao entre repository e integracao
- emissao de evento de dominio
- uso de strategy ou factory

## Leitura inicial

- `AGENTS.md`
- `docs/ai/ARCHITECTURE.md`
- `docs/ai/BACKEND_PATTERNS.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Defina a responsabilidade do service

Service deve:

- aplicar regra de negocio
- coordenar repository, adapter e evento
- decidir fluxo de sucesso e falha

Service nao deve:

- conhecer detalhes HTTP de controller
- montar query complexa demais de ORM no meio da regra
- virar acumulador de responsabilidades

### 2. Prefira extensao limpa

- use strategy para regra variavel
- use factory para escolha de implementacao
- use evento para side effect desacoplado

### 3. Feche com validacao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Exemplos

- "Criar regra de cadastro" -> validar fluxo, chamar repository, emitir evento e retornar entidade ou view model
- "Refatorar service com varios ifs" -> extrair strategy ou dividir em funcoes menores
