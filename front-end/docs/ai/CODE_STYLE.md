# Code Style

## Convencoes Gerais

- TypeScript estrito.
- Sem `any`.
- Um modulo, uma responsabilidade.
- Imports via alias `@/` sempre que fizer sentido.

## Regras TypeScript

- Preferir `interface` para contratos de objeto reutilizaveis.
- Preferir `type` para unioes e composições pequenas.
- Adaptar dados externos antes de usa-los na UI.
- Evitar tipos amplos demais em components de base.

## Regras De Import

- Ordem sugerida:
  1. bibliotecas externas
  2. alias internos `@/`
  3. estilos locais

- Evitar caminhos relativos longos como `../../../`.
- Centralizar dependencias compartilhadas em `constants/`, `types/` e `utils/`.

- Todos os padrões e orientações descritos devem ser utilizados para resolver problemas reais e nao por antecipação. Evitar overengineering.