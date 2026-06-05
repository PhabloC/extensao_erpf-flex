# Architecture

## Fluxo Principal

O fluxo padrao do backend e:

`Controller -> Service -> Repository -> Database`

Resumo:

- `controller`: roteamento, validacao de entrada e status HTTP.
- `service`: regra de negocio, orquestracao e eventos.
- `repository`: persistencia e acesso a dados.
- `database`: migracoes, seeds e configuracao de banco.

## Modules

- `modules/users`: exemplo de dominio com entidade, DTOs, repository, service e eventos.
- `modules/auth`: autenticacao JWT e guardas de acesso.

## Common

- `common/decorators`: decorators customizados.
- `common/filters`: tratamento global de erro.
- `common/interceptors`: comportamento transversal.
- `common/utils`: utilitarios reutilizaveis.

## Patterns

- `patterns/strategy`
- `patterns/factory`
- `patterns/adapters`

## Database

- `config/database.config.ts` define a configuracao do PostgreSQL.
- `database/migrations` recebe migracoes futuras.
- `database/seeds` recebe seeds futuras.

- Todos os padrões e orientações descritos nos documentos acima devem ser utilizados para resolver problemas REAIS e não por antecipação. Evitar o overengineering.