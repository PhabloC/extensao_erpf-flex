# Frontend Patterns

## Organizacao De Modulos

- `components/` deve compor primitives de `ui/` com regras de apresentacao de dominio.
- `pages/` deve orquestrar dados e estrutura, sem conhecimento de HTTP.
- `services/` deve expor funcoes de negocio e integracao.
- `hooks/` deve ligar pages aos services e stores.

## Design Patterns Aplicados

### Strategy

- Arquivo: `src/patterns/strategy/statusStrategy.ts`
- Uso: variar comportamento por status sem proliferar `if` e `switch`.
- Exemplo atual: apresentacao de badges de status.

### Factory

- Arquivo: `src/patterns/factory/createApiClient.ts`
- Uso: centralizar criacao de clientes HTTP.
- Beneficio: configuracao consistente de timeout, headers e base URL.

### Adapter

- Arquivo: `src/services/adapters/adaptUser.ts`
- Uso: transformar payload da API para o modelo interno consumido pela UI.

### Observer

- Arquivo: `src/stores/authStore.ts`
- Uso: permitir que layout e pages reajam a mudancas globais de autenticacao.

### Decorator

- Arquivo: `src/utils/decorators/withRetry.ts`
- Uso: adicionar comportamento transversal sem alterar a assinatura do service.

## Quando Aplicar Patterns

- Use Strategy quando a variacao for orientada por tipo, estado ou contexto.
- Use Factory para objetos configurados repetidamente.
- Use Adapter quando o contrato externo nao for o ideal para a UI.
- Use Decorator para retry, logging, cache ou telemetria.

- Todos os padrões e orientações descritos devem ser utilizados para resolver problemas reais e nao por antecipação. Evitar overengineering.