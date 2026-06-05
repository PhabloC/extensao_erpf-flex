# Architecture

## Fluxo Principal

O fluxo preferencial do projeto e:

`Page -> Hooks -> Services -> API`

Detalhamento:

- `pages/` monta a tela, define composicao visual e conecta layout.
- `hooks/` encapsula carregamento, tratamento de erro e estado local de interface.
- `services/` centraliza integracoes, adaptacao de dados e regras de acesso.
- `services/http/` concentra o cliente HTTP compartilhado.
- `services/adapters/` converte resposta externa para modelo interno.

## Stores

- `stores/authStore.ts` demonstra o uso de Zustand como observer.
- Multiplos componentes podem reagir ao mesmo estado sem acoplamento direto.
- Stores devem ser reservadas para estado cross-cutting, nao para estado local de formulario.

## Rotas

- `routes/index.tsx` define o router principal.
- `PublicRoutes` agrupa rotas abertas.
- `PrivateRoutes` protege rotas autenticadas com base no store.

## Estrutura De Pastas

- `layout/`: estrutura visual compartilhada.
- `ui/`: primitives reutilizaveis e agnosticas de dominio.
- `components/`: componentes compostos ligados ao dominio da aplicacao.
- `pages/`: telas e entradas de rota.
- `patterns/`: implementacoes pequenas de patterns recorrentes.
- `types/`: contratos tipados usados em toda a aplicacao.

- Todos os padrões e orientações descritos devem ser utilizados para resolver problemas reais e nao por antecipação. Evitar overengineering.