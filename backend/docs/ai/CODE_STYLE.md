# Code Style

## Regras TypeScript

- TypeScript estrito.
- Sem `any`.
- Tipos pequenos e focados.
- DTOs sempre tipados com `class-validator`.

## Nomenclatura

- `*.controller.ts` para camada HTTP.
- `*.service.ts` para regra de negocio.
- `*.repository.ts` para persistencia.
- `*.module.ts` para composicao do modulo.
- `*.entity.ts` para modelos internos de persistencia.

## Estrutura De Modulos

Cada modulo de dominio deve agrupar:

- controller
- service
- repository
- dto
- entities

Dependencias compartilhadas devem ir para `common/` ou `patterns/`, nao para outros modulos por atalho.

- Todos os padrões e orientações descritos nos documentos acima devem ser utilizados para resolver problemas REAIS e não por antecipação. Evitar o overengineering.