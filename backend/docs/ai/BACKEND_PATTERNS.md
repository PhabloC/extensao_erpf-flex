# Backend Patterns

## Strategy

- Arquivo: `src/patterns/strategy/shippingStrategy.ts`
- Uso: encapsular regras variaveis por tipo de envio.

## Factory

- Arquivo: `src/patterns/factory/paymentProcessorFactory.ts`
- Uso: decidir qual processador criar a partir do metodo de pagamento.

## Adapter

- Arquivo: `src/patterns/adapters/analyticsAdapter.ts`
- Uso: adaptar uma API externa de analytics para a interface interna da aplicacao.

## Observer

- Uso real no dominio:
  - `user.created`
  - `user.deleted`
- Implementacao com `@nestjs/event-emitter`.
- Listeners ficam desacoplados de controllers e services.

## Decorator

- `common/interceptors/logging.interceptor.ts`
- `common/decorators/current-user.decorator.ts`

Esses pontos usam o modelo de decorators do Nest para adicionar comportamento sem acoplar regras ao endpoint.

- Todos os padrões e orientações descritos nos documentos acima devem ser utilizados para resolver problemas REAIS e não por antecipação. Evitar o overengineering.