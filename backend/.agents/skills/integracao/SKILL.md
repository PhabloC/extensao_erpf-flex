---
name: integracao
description: Cria ou refatora integracoes no projeto `backend/` seguindo os padroes do repositorio. Use quando a tarefa envolver adapter, gateway, chamada externa, service terceiro, analytics, pagamento, timeout, retry ou protecao da camada de dominio contra SDKs externos.
metadata:
  short-description: Cria integracoes no padrao do backend
---

# Integracao

Use esta skill para integrar servicos externos sem acoplar o dominio ao SDK ou contrato de fora. O foco e isolar a integracao por adapter e contrato interno.

## Quando usar

- chamada para API externa
- adapter para SDK
- gateway interno
- analytics, pagamento, storage ou mensageria
- refactor de integracao acoplada

## Leitura inicial

- `AGENTS.md`
- `docs/ai/BACKEND_PATTERNS.md`
- `docs/ai/SECURITY.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Defina a fronteira interna

- crie contrato interno claro
- adapte resposta externa para o formato do dominio
- evite importar SDK direto na regra principal

### 2. Trate resiliencia basica

- timeout
- tratamento de erro
- nao vazar detalhe bruto da integracao
- considerar retry ou decorator quando fizer sentido

### 3. Feche com validacao

Dentro de `backend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Exemplos

- "Integrar analytics" -> adapter traduz contrato externo para interface interna
- "Adicionar gateway de pagamento" -> service depende de contrato, integracao fica atras de adapter ou factory
