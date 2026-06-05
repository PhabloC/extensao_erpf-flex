# Development Workflow

## Criacao De Paginas

1. Criar a page em `pages/`.
2. Adicionar a rota em `routes/`.
3. Criar hooks de tela para isolar carregamento e estado.
4. Reutilizar layout e UI existentes antes de criar novos componentes.

## Uso De Services

1. Criar o service em `services/`.
2. Se houver payload externo, criar adapter em `services/adapters/`.
3. Tipar entrada e saida em `types/`.
4. Consumir o service no hook, nao na page.

## Uso De Stores

1. Usar store apenas para estado compartilhado entre modulos.
2. Manter a API do store pequena e previsivel.
3. Usar selectors para reduzir acoplamento entre componentes.

- Todos os padrões e orientações descritos devem ser utilizados para resolver problemas reais e nao por antecipação. Evitar overengineering.