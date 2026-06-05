# Component Reuse

## `layout/`

Usado para estrutura macro de pagina:

- header
- sidebar
- containers
- shells de pagina

Nao deve carregar regra de dominio forte.

## `ui/`

Usado para componentes base e reutilizacao horizontal:

- `Button`
- `Input`
- `Modal`
- `Card`
- `Table`

Deve permanecer o mais agnostico possivel.

## `components/`

Usado para composicoes de dominio:

- combinam `ui/`
- podem conhecer tipos e strategies do projeto
- devem continuar pequenos e focados

Exemplo atual:

- `StatusBadge`

- Todos os padrões e orientações descritos devem ser utilizados para resolver problemas reais e nao por antecipação. Evitar overengineering.