# Development Workflow

## Criacao De Modulos

1. Criar o modulo em `src/modules/<dominio>`.
2. Definir DTOs e entidade.
3. Criar repository antes de escrever service.
4. Expor controller apenas depois da regra estar encapsulada no service.

## Criacao De DTOs

1. Validar todas as entradas com `class-validator`.
2. Usar `class-transformer` para normalizar dados simples.
3. Evitar receber objetos nao tipados diretamente no service.

## Criacao De Migrations

1. Definir mudanca de schema em `src/database/migrations`.
2. Ajustar config do banco se necessario.
3. Atualizar repository e service depois da mudanca estrutural.
4. Gerar migrations com `npm run migration:generate -- -n NomeDaMigration`.
5. Executar com `npm run migration:run`.

- Todos os padrões e orientações descritos nos documentos acima devem ser utilizados para resolver problemas REAIS e não por antecipação. Evitar o overengineering.