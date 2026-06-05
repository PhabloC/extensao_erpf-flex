# QA

## Objetivo

Este arquivo define a rotina minima de qualidade para o frontend. O foco e manter mudancas pequenas, previsiveis e baratas de validar para humanos e agentes.

## Ferramentas

- `Vitest` para testes unitarios e de integracao leve
- `@testing-library/react` para comportamento de interface
- `ESLint` para regras estaticas
- `TypeScript` para validacao estrutural

## Comandos Obrigatorios Antes De Entregar

- `npm run lint`
- `npm run test`
- `npm run build`

## O Que Testar

- Components reutilizaveis em `ui/` quando tiverem comportamento relevante
- Hooks quando encapsularem estado, efeitos ou integracao
- Pages nos fluxos principais de renderizacao
- Services e adapters quando transformarem dados

## Regras De Qualidade

- Todo bug corrigido deve ganhar cobertura quando fizer sentido.
- Nao adicionar testes so para aumentar numero. Testar comportamento real.
- Evitar snapshots amplos e frageis.
- Preferir testes pequenos, focados e baratos de manter.
- Se um componente depende de router, store ou provider, montar o contexto minimo necessario.

## Checklist Rapido

- `Vitest` passando
- `build` passando
- Sem warning de lint
- Fluxo principal validado
- Mudanca documentada se alterar arquitetura ou padrao
