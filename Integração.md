# Integração ERP Flex - Guia para o Time da Extensão

## Objetivo

Este documento resume o que o time da extensão precisa usar para integrar com a API do sistema Dois Pingos na criação automática de Ordem de Produção no Kanban.

## URL base

A extensão deve considerar que a API roda sob `/api`.

Exemplos:

- `https://meusistema.com/api/auth/login`
- `https://meusistema.com/api/production-orders/imports/erp-flex`

## Autenticação

### Endpoint

`POST /api/auth/login`

### Formas aceitas

O backend aceita:

- `email` + `password`
- `cpf` + `password`

Para a extensão, o recomendado é usar `email`.

### Request recomendado

```json
{
  "email": "usuario@empresa.com",
  "password": "senha-do-usuario"
}
```

### Response de sucesso

Status HTTP:

- `200 OK`

Body:

```json
{
  "accessToken": "jwt-ou-token-equivalente",
  "refreshToken": "refresh-token",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": "uuid",
    "name": "Nome do usuário",
    "cpf": "12345678901",
    "email": "usuario@empresa.com",
    "profileImage": null,
    "role": "gerente",
    "status": "active",
    "lastLoginAt": null
  }
}
```

### Observações importantes

- a extensão deve usar `accessToken` no header `Authorization: Bearer <token>`
- o login retorna `200`, não `201`
- o usuário autenticado precisa ter perfil `master` ou `gerente` para importar OP

## Importação da OP

### Endpoint

`POST /api/production-orders/imports/erp-flex`

### Headers obrigatórios

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <accessToken>
```

## Payload recomendado

```json
{
  "externalOrderId": "6266580",
  "orderNumber": "0000000567",
  "customerName": "PRAXI SERVICOS LTDA",
  "item": {
    "productCode": "10AC7524P",
    "productDescription": "Ombrelone Redondo 2,40m; armação/vareta Alumínio, tecido Poliéster PVC SLIM-Personalizado",
    "quantity": 4,
    "unit": "UN"
  },
  "dueDate": "2026-06-19",
  "complementaryFields": "SILK MINIKAY, COSTURA DP",
  "variations": "Azul Guanabara C/Abas",
  "sourcePageUrl": "https://app.erpflex.com.br/erp/lancamentos/producao/ordensproducao",
  "rawPayload": {
    "extractionStrategy": "json-endpoint",
    "candidates": {
      "orderNumber": "0000000567",
      "externalOrderId": "6266580",
      "customerName": "PRAXI SERVICOS LTDA",
      "productCode": "10AC7524P",
      "productDescription": "Ombrelone Redondo 2,40m; armação/vareta Alumínio, tecido Poliéster PVC SLIM-Personalizado",
      "variations": "Azul Guanabara C/Abas",
      "complementaryFields": "SILK MINIKAY, COSTURA DP",
      "quantity": 4,
      "dueDate": "19/06/2026"
    }
  }
}
```

## Campos que o backend usa na criação da OP

- `externalOrderId` -> usado para deduplicação
- `orderNumber` -> Número da OP
- `customerName` -> Cliente
- `variations` -> Cor
- `complementaryFields` -> Observação
- `quantity` -> Quantidade
- `unit` -> Unidade
- `dueDate` -> Prazo
- `productCode` -> chave de lookup da variação comercial

## Regras de mapeamento importantes

### 1. Deduplicação

O backend deduplica por:

- `externalOrderId`

Se a mesma OP já tiver sido importada antes, o backend retorna `409 Conflict`.

### 2. productCode

O campo:

- `item.productCode`

não busca o produto diretamente.

Ele é resolvido assim:

1. o backend procura uma variação comercial em `variations.code`
2. a partir dessa variação, encontra o produto vinculado
3. com isso, a OP é criada no fluxo interno normal

Ou seja:

- o `productCode` enviado pela extensão precisa bater exatamente com o campo `code` de uma variação cadastrada no sistema

### 3. Cor / variations

O campo:

- `variations`

é usado para resolver a cor por comparação textual com o catálogo de cores.

Regra:

- o backend compara o valor enviado com o nome da cor cadastrada
- a comparação é por label/nome

Ou seja:

- a extensão deve enviar o label da cor de forma o mais fiel possível ao cadastro real

### 4. Observação

O backend usa, por prioridade:

1. `complementaryFields`
2. `notes`
3. `rawPayload.candidates.complementaryFields`

### 5. Prazo

O ideal é a extensão enviar:

- `dueDate` em formato ISO: `YYYY-MM-DD`

Exemplo:

- `2026-06-19`

O backend também aceita fallback vindo do payload cru:

- `dd/MM/yyyy`

Exemplo:

- `19/06/2026`

Mesmo assim, o recomendado para a extensão é sempre mandar ISO no campo principal `dueDate`.

## Campos mínimos recomendados para envio

Embora o backend aceite alguns fallbacks, o ideal é sempre enviar explicitamente:

- `externalOrderId`
- `orderNumber`
- `customerName`
- `item.productCode`
- `item.productDescription`
- `item.quantity`
- `item.unit`
- `dueDate`
- `complementaryFields`
- `variations`

## Respostas que a extensão deve tratar

### 1. Sucesso

Status HTTP:

- `201 Created`

Body:

```json
{
  "result": "created",
  "productionOrder": {
    "id": "uuid-da-op",
    "orderNumber": "0000000567",
    "status": "backlog",
    "source": {
      "origin": "erp-flex",
      "externalOrderId": "6266580"
    }
  }
}
```

### 2. Duplicidade

Status HTTP:

- `409 Conflict`

Body:

```json
{
  "result": "duplicate",
  "message": "Production order already imported from ERP Flex.",
  "existingProductionOrderId": "uuid-da-op-existente",
  "externalOrderId": "6266580"
}
```

Comportamento esperado na extensão:

- tratar como duplicidade explícita
- não tratar como sucesso silencioso

### 3. Erro de validação

Status HTTP:

- `400 Bad Request`

Body exemplo:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request payload is invalid.",
  "details": [
    {
      "field": "item.productCode",
      "message": "No registered variation was found for the provided product code."
    }
  ]
}
```

Comportamento esperado na extensão:

- exibir `message`
- se existir `details`, listar os detalhes para o usuário

### 4. Erro de autenticação

Status HTTP:

- `401 Unauthorized`

Cenários:

- token ausente
- token inválido
- token expirado
- credenciais inválidas no login

Comportamento esperado na extensão:

- limpar token local quando necessário
- pedir nova autenticação ao usuário

## Recomendações práticas para o time da extensão

- usar `email` no login
- sempre enviar `dueDate` em `YYYY-MM-DD`
- sempre enviar `customerName` explicitamente
- sempre enviar `variations` com o label exato da cor
- sempre enviar `productCode` exatamente como está cadastrado em `variations.code`
- continuar enviando `rawPayload` para rastreabilidade e debug
- tratar `409` como caso explícito de OP já importada

## Checklist rápido para integração

- autenticar em `POST /api/auth/login`
- guardar `accessToken`
- enviar bearer token na importação
- chamar `POST /api/production-orders/imports/erp-flex`
- enviar `productCode` compatível com `variations.code`
- enviar `variations` compatível com o label da cor cadastrada
- tratar `201`, `400`, `401` e `409`

## Observação final importante

O principal ponto de alinhamento entre extensão e backend é este:

- `productCode` precisa existir no cadastro interno como `variations.code`

Se isso não estiver alinhado entre ERP Flex e base do sistema Dois Pingos, a importação vai falhar por validação.
