# Integração da Extensão com o Sistema Destino

## Objetivo

Este documento descreve tudo o que o sistema destino precisa implementar e validar para receber Ordens de Produção enviadas pela extensão do navegador.

O fluxo é:

1. o usuário analisa a OP no ERP Flex pela extensão
2. a extensão autentica no sistema destino
3. a extensão envia a OP capturada para a API do sistema destino
4. o sistema destino valida, deduplica e cria a OP
5. a extensão exibe sucesso, duplicidade ou erro claro ao usuário

## Visão geral da integração

A extensão já está preparada para:

- salvar a URL base da API
- salvar o e-mail do usuário
- autenticar em `/auth/login`
- guardar `accessToken`
- enviar a OP para `/production-orders/imports/erp-flex`
- tratar respostas de sucesso, duplicidade, autenticação expirada e erro de validação

Referência técnica atual da extensão:

- `extensao-dois-pingos/src/background.js`
- `contracts/openapi.yaml`

## Endpoints obrigatórios

O sistema destino precisa expor, no mínimo, estes endpoints.

### 1. Login

`POST /auth/login`

Uso:

- a extensão usa este endpoint para obter um `accessToken`
- isso acontece quando ainda não existe token salvo ou quando a sessão expirou

Request esperado:

```json
{
  "email": "usuario@empresa.com",
  "password": "senha-do-usuario"
}
```

Response esperada em sucesso:

```json
{
  "accessToken": "jwt-ou-token-equivalente"
}
```

Comportamento esperado:

- responder `200` quando autenticar com sucesso
- responder erro claro quando credenciais forem inválidas
- retornar JSON com campo `message` em caso de falha
- opcionalmente retornar `code` e `details`

### 2. Importação da OP

`POST /production-orders/imports/erp-flex`

Uso:

- a extensão envia a OP capturada do ERP Flex para criação no sistema destino

Headers esperados:

```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <accessToken>
```

## URL base configurada na extensão

Na configuração da extensão, o usuário informa a URL base do sistema.

Regra atual da extensão:

- se o usuário informar uma URL sem `/api`, a extensão acrescenta `/api`
- exemplos:
  - `http://localhost:3000` vira `http://localhost:3000/api`
  - `https://meusistema.com` vira `https://meusistema.com/api`
  - `https://meusistema.com/api` permanece `https://meusistema.com/api`

Então, para a extensão, a API final esperada normalmente fica assim:

- `https://meusistema.com/api/auth/login`
- `https://meusistema.com/api/production-orders/imports/erp-flex`

## Contrato do payload enviado pela extensão

O payload segue o contrato de `contracts/openapi.yaml`.

### Payload esperado

```json
{
  "externalOrderId": "6266580",
  "orderNumber": "0000000567",
  "item": {
    "productCode": "10AC7524P",
    "productDescription": "Ombrelone Redondo 2,40m; armação/vareta Alumínio, tecido Poliéster PVC SLIM-Personalizado",
    "quantity": 4,
    "unit": "UN"
  },
  "issueDate": "2026-06-11",
  "dueDate": "2026-06-19",
  "notes": "SILK MINIKAY, COSTURA DP",
  "sourcePageUrl": "https://app.erpflex.com.br/erp/lancamentos/producao/ordensproducao",
  "rawPayload": {
    "extractionStrategy": "json-endpoint",
    "candidates": {
      "orderNumber": "0000000567",
      "externalOrderId": "6266580",
      "customerName": "PRAXI SERVICOS LTDA",
      "productCode": "10AC7524P",
      "productDescription": "Ombrelone Redondo 2,40m; armação/vareta Alumínio, tecido Poliéster PVC SLIM-Personalizado",
      "baseProduct": "10AC7524P",
      "variations": "Azul Guanabara C/Abas",
      "complementaryFields": "SILK MINIKAY, COSTURA DP",
      "quantity": 4,
      "dueDate": "19/06/2026"
    }
  }
}
```

### Campos obrigatórios

- `externalOrderId`
- `orderNumber`
- `item`
- `item.productCode`
- `item.productDescription`
- `item.quantity`

### Campos opcionais

- `item.unit`
- `issueDate`
- `dueDate`
- `notes`
- `sourcePageUrl`
- `rawPayload`

## Regras de negócio esperadas no sistema destino

O sistema destino precisa, no mínimo:

- autenticar o usuário antes de permitir importação
- validar o payload recebido
- verificar duplicidade da OP importada
- criar a OP quando não existir duplicidade
- retornar resposta clara para a extensão
- registrar que a origem da OP é `erp-flex`

### Regra de duplicidade

O ideal é deduplicar usando `externalOrderId`.

Se a estratégia do sistema destino for diferente, isso precisa ser alinhado explicitamente, mas a extensão já envia `externalOrderId` para esse fim.

## Respostas esperadas pela extensão

### 1. Sucesso de criação

Status HTTP:

- `201 Created`

Body esperado:

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

Campos mínimos relevantes para a extensão:

- `result = "created"`
- `productionOrder.id`
- `productionOrder.orderNumber`
- `productionOrder.status`
- `productionOrder.source.externalOrderId`

### 2. Duplicidade

Status HTTP:

- `409 Conflict`

Body esperado:

```json
{
  "result": "duplicate",
  "message": "Production order already imported from ERP Flex.",
  "existingProductionOrderId": "uuid-da-op-existente",
  "externalOrderId": "6266580"
}
```

Comportamento esperado:

- a extensão trata isso como duplicidade explícita
- não trata como sucesso silencioso

### 3. Erro de validação

Status HTTP:

- `400 Bad Request`

Body recomendado:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Request payload is invalid.",
  "details": [
    {
      "field": "item.quantity",
      "message": "Quantity must be greater than zero."
    }
  ]
}
```

Observação:

- a extensão consegue exibir `message`
- se existir `details`, ela também consegue listar esses detalhes para o usuário

### 4. Erro de autenticação

Status HTTP:

- `401 Unauthorized`

Body recomendado:

```json
{
  "code": "AUTHENTICATION_REQUIRED",
  "message": "Authentication required."
}
```

Comportamento esperado:

- a extensão limpa o token local
- o usuário precisa informar a senha novamente para renovar a sessão

### 5. Erro técnico

Status HTTP:

- `500` ou outro status apropriado

Body recomendado:

```json
{
  "code": "IMPORT_FAILED",
  "message": "Unexpected error while importing production order."
}
```

## Requisitos de CORS

Como a extensão roda no navegador e faz `fetch` diretamente para a API, o sistema destino precisa liberar CORS corretamente.

O backend deve permitir:

- método `POST`
- header `Authorization`
- header `Content-Type`
- header `Accept`

O backend também precisa responder adequadamente ao `OPTIONS` quando aplicável.

Observação prática:

- se CORS não estiver configurado, a extensão vai falhar mesmo que a API esteja funcionando em outras ferramentas

## Requisitos de autenticação

A extensão hoje assume autenticação por bearer token.

Fluxo atual:

1. usuário informa `URL base da API`
2. usuário informa `e-mail`
3. usuário informa `senha` apenas para renovar sessão
4. extensão chama `/auth/login`
5. backend retorna `accessToken`
6. extensão envia `Authorization: Bearer <token>`

Requisitos para o sistema destino:

- ter endpoint de login compatível
- retornar `accessToken` no corpo
- aceitar bearer token nas rotas protegidas

## Comportamento esperado na UI da extensão

A extensão hoje já mostra estes cenários:

- confirmação antes de criar a OP
- loading durante o envio
- `check` em sucesso real
- mensagem clara em duplicidade
- mensagem clara em erro de validação
- mensagem clara em sessão expirada
- mensagem clara quando API e e-mail ainda não foram configurados

Isso significa que o backend deve priorizar respostas JSON claras, especialmente com:

- `message`
- `code`
- `details`

## Checklist para o time do sistema destino

- expor `POST /api/auth/login`
- expor `POST /api/production-orders/imports/erp-flex`
- aceitar `Authorization: Bearer <token>`
- validar o payload conforme contrato
- deduplicar por `externalOrderId`
- retornar `201` com `result: "created"` quando criar
- retornar `409` com `result: "duplicate"` quando a OP já existir
- retornar `400` com `message` e, se possível, `details` em erro de validação
- retornar `401` quando token for inválido ou expirado
- configurar CORS para chamadas da extensão
- validar ponta a ponta em navegador real, não apenas por Postman/Insomnia

## Cenários mínimos de teste ponta a ponta

O time do sistema destino deve testar, no mínimo:

### Cenário 1. Sucesso

- login funciona
- importação retorna `201`
- extensão mostra sucesso

### Cenário 2. Duplicidade

- mesma OP enviada novamente
- backend retorna `409`
- extensão mostra que a OP já existe

### Cenário 3. Validação

- payload com campo obrigatório ausente ou inválido
- backend retorna `400`
- extensão mostra erro claro

### Cenário 4. Sessão expirada

- token inválido ou expirado
- backend retorna `401`
- extensão pede nova autenticação

### Cenário 5. CORS / rede

- backend indisponível ou CORS incorreto
- extensão mostra falha de comunicação com a API

## Referências no repositório

Arquivos principais:

- `contracts/openapi.yaml`
- `extensao-dois-pingos/src/background.js`
- `extensao-dois-pingos/src/popup.js`
- `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md`

## Resumo executivo para repassar ao outro sistema

O sistema destino precisa fornecer uma API autenticada compatível com login por e-mail/senha e importação de OP por bearer token. A extensão já está pronta para enviar a OP do ERP Flex para `POST /api/production-orders/imports/erp-flex`, espera `201` em sucesso, `409` em duplicidade, `400` em validação e `401` em sessão expirada. Além do contrato, o backend precisa liberar CORS para o navegador e devolver mensagens JSON claras para que a extensão consiga orientar o usuário corretamente.
