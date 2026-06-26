# Integração API - Extensão ERP Flex

## Objetivo

Este documento resume, em formato operacional, o que a API do sistema destino precisa suportar para funcionar com a extensão de importação do ERP Flex.

Fonte de verdade usada nesta consolidação:

- `contracts/openapi.yaml`
- `backend/src/modules/production-orders/production-orders.service.ts`
- `extensao-dois-pingos/src/background.js`

## Resumo do fluxo

1. A extensão coleta uma ou mais OPs na página do ERP.
2. A extensão garante que existe sessão autenticada no sistema destino.
3. Para cada OP selecionada, a extensão chama `POST /api/production-orders/imports/erp-flex`.
4. A API deve:
   - criar a OP quando ainda não existir uma OP ativa com o mesmo `externalOrderId`
   - atualizar a OP ativa existente quando já existir uma OP ativa com o mesmo `externalOrderId`
5. A API deve responder sempre com `result: "created"` ou `result: "updated"` quando a operação for válida.

## Autenticação

### Login

Endpoint:

```http
POST /api/auth/login
```

Payload esperado:

```json
{
  "email": "planner@example.com",
  "password": "password123"
}
```

Resposta esperada:

```json
{
  "accessToken": "jwt-token"
}
```

Regras:

- A extensão envia `email` e `password` em JSON.
- A resposta precisa conter `accessToken`.
- Se o token expirar, a extensão tenta renovar a sessão.

## Importação ERP Flex

### Endpoint principal

```http
POST /api/production-orders/imports/erp-flex
Authorization: Bearer <token>
Content-Type: application/json
Accept: application/json
```

### Regra de negócio atual

- Não existe mais fluxo operacional de duplicidade.
- Para o mesmo `externalOrderId`:
  - se não existir OP ativa, a API cria
  - se já existir OP ativa, a API atualiza
- A extensão não envia mais confirmação extra para atualização.

## Payload esperado

### Campos obrigatórios

```json
{
  "externalOrderId": "ERP-IMPORT-001",
  "orderNumber": "OP-ERP-001",
  "item": {
    "productCode": "ERP-PRD-001",
    "productDescription": "Chapa Importada",
    "quantity": 12,
    "unit": "pc"
  }
}
```

### Campos opcionais aceitos

```json
{
  "externalOrderId": "ERP-IMPORT-001",
  "orderNumber": "OP-ERP-001",
  "customerName": "CLIENTE EXEMPLO LTDA",
  "issueDate": "2026-06-01",
  "dueDate": "2026-06-30",
  "variations": "Azul Guanabara C/Abas",
  "complementaryFields": "SILK FRENTE, COSTURA REFORCADA",
  "notes": "Importado via extensão ERP Flex",
  "sourcePageUrl": "https://erp-flex.example.com/orders/ERP-IMPORT-001",
  "item": {
    "productCode": "ERP-PRD-001",
    "productDescription": "Chapa Importada",
    "quantity": 12,
    "unit": "pc"
  },
  "rawPayload": {
    "extractionStrategy": "json-endpoint",
    "candidates": {
      "externalOrderId": "ERP-IMPORT-001",
      "orderNumber": "OP-ERP-001",
      "customerName": "CLIENTE EXEMPLO LTDA",
      "productCode": "ERP-PRD-001",
      "productDescription": "Chapa Importada",
      "variations": "Azul Guanabara C/Abas",
      "complementaryFields": "SILK FRENTE, COSTURA REFORCADA",
      "quantity": 12,
      "dueDate": "30/06/2026"
    }
  }
}
```

## Regras de validação importantes

### `externalOrderId`

- Obrigatório
- `string`
- mínimo `1`, máximo `120`
- É a chave usada para decidir entre criar ou atualizar

### `orderNumber`

- Obrigatório
- `string`
- mínimo `1`, máximo `120`
- Se já existir outra OP com esse `orderNumber` e id diferente da OP ativa localizada por `externalOrderId`, a API deve rejeitar

### `item.productCode`

- Obrigatório
- `string`
- mínimo `1`, máximo `60`

### `item.productDescription`

- Obrigatório
- `string`
- mínimo `1`, máximo `240`

### `item.quantity`

- Obrigatório
- `number`
- maior que `0`
- até `2` casas decimais

### `item.unit`

- Opcional
- `string`
- máximo `20`

### Datas

- `issueDate` e `dueDate` devem aceitar `YYYY-MM-DD`
- O backend local também aproveita `rawPayload.candidates.dueDate` quando vier como `DD/MM/YYYY`

## Regras de create/update esperadas

### Quando criar

Criar nova OP quando:

- não existir OP ativa com o mesmo `externalOrderId`
- e não existir outra OP com o mesmo `orderNumber`

Resposta esperada:

```json
{
  "result": "created",
  "productionOrder": {
    "id": "uuid",
    "orderNumber": "OP-ERP-001",
    "item": {
      "productCode": "ERP-PRD-001",
      "productDescription": "Chapa Importada",
      "quantity": 12,
      "unit": "pc"
    },
    "dueDate": "2026-06-30",
    "issueDate": "2026-06-01",
    "notes": "Importado via extensão ERP Flex",
    "status": "backlog",
    "source": {
      "origin": "erp-flex",
      "externalOrderId": "ERP-IMPORT-001",
      "sourcePageUrl": "https://erp-flex.example.com/orders/ERP-IMPORT-001",
      "importedAt": "2026-06-26T12:00:00.000Z",
      "importedByUserId": "uuid"
    },
    "createdAt": "2026-06-26T12:00:00.000Z",
    "createdByUserId": "uuid",
    "history": []
  }
}
```

### Quando atualizar

Atualizar a OP ativa existente quando:

- já existir OP ativa com o mesmo `externalOrderId`
- e `orderNumber` não colidir com outra OP diferente

Resposta esperada:

```json
{
  "result": "updated",
  "productionOrder": {
    "id": "uuid-da-op-existente",
    "orderNumber": "OP-ERP-001-ATUALIZADA",
    "item": {
      "productCode": "ERP-PRD-001-ATUALIZADO",
      "productDescription": "Chapa Atualizada",
      "quantity": 18,
      "unit": "kg"
    },
    "dueDate": "2026-06-30",
    "issueDate": "2026-06-01",
    "notes": "Atualizada via extensão",
    "status": "backlog",
    "source": {
      "origin": "erp-flex",
      "externalOrderId": "ERP-IMPORT-001",
      "sourcePageUrl": "https://erp-flex.example.com/orders/ERP-IMPORT-001",
      "importedAt": "2026-06-26T12:05:00.000Z",
      "importedByUserId": "uuid"
    },
    "createdAt": "2026-06-26T12:00:00.000Z",
    "createdByUserId": "uuid",
    "history": []
  }
}
```

## Estrutura mínima da resposta `productionOrder`

A extensão hoje usa principalmente:

- `result`
- `productionOrder.id`
- `productionOrder.orderNumber`
- `productionOrder.status`
- `productionOrder.source.externalOrderId`

Mas o contrato local expõe o objeto completo de detalhe da OP.

## Erros que a extensão já trata

### `400 Bad Request`

Usado para:

- payload inválido
- campos fora do schema
- regra de negócio inválida
- conflito de `orderNumber` com outra OP

Formato esperado:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request payload is invalid.",
  "details": [
    {
      "field": "item.productCode",
      "message": "must be shorter than or equal to 60 characters"
    }
  ]
}
```

Observações:

- A extensão traduz `message` e `details` para feedback amigável.
- Se a API reclamar de variação não cadastrada, a extensão tenta um reenvio compatível com o mesmo endpoint.

### `401 Unauthorized`

Usado para:

- token ausente
- token expirado
- sessão inválida

Formato esperado:

```json
{
  "code": "AUTHENTICATION_REQUIRED",
  "message": "Authentication required."
}
```

Observações:

- Ao receber `401`, a extensão pede renovação de sessão.

## O que não deve mais existir neste fluxo

- resposta operacional `409` para “OP duplicada”
- necessidade de `existingProductionOrderId` no payload
- confirmação manual de atualização por item dentro da extensão

## Requisitos de compatibilidade com a extensão atual

- O endpoint deve aceitar JSON.
- O endpoint deve responder com `application/json`.
- O login deve devolver `accessToken`.
- O import deve responder com `201` tanto para `created` quanto para `updated`.
- O import deve devolver `result` com valor exato:
  - `created`
  - `updated`

## Checklist para o time da API

- Implementar `POST /api/auth/login` retornando `accessToken`.
- Implementar `POST /api/production-orders/imports/erp-flex` com autenticação Bearer.
- Aceitar os campos obrigatórios e opcionais listados acima.
- Criar quando `externalOrderId` ativo não existir.
- Atualizar quando `externalOrderId` ativo já existir.
- Rejeitar `orderNumber` que colida com outra OP diferente.
- Responder com `result: "created"` ou `result: "updated"`.
- Responder `400` em erros de schema ou regra.
- Responder `401` em falha de autenticação.

## Exemplo curto para compartilhamento rápido

Se o time quiser só o resumo operacional:

```text
1. Login em POST /api/auth/login com email + password e retorno accessToken.
2. Import em POST /api/production-orders/imports/erp-flex com Bearer token.
3. Payload obrigatório: externalOrderId, orderNumber, item.productCode, item.productDescription, item.quantity.
4. Mesmo externalOrderId ativo = update.
5. ExternalOrderId novo = create.
6. Resposta de sucesso sempre com HTTP 201 e result = created ou updated.
7. Não usar mais fluxo de duplicidade/409 para esse caso operacional.
```
