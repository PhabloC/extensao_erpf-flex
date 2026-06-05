# QA

## Objetivo

Este arquivo define a rotina minima de qualidade do backend. A ideia e garantir entrega previsivel sem depender de revisao manual pesada em toda mudanca.

## Ferramentas

- `Jest` para testes unitarios
- `Jest` para testes e2e
- `ESLint` para regras estaticas
- `TypeScript` para consistencia estrutural

## Comandos Obrigatorios Antes De Entregar

- `npm run lint`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## O Que Testar

- Services com regra de negocio
- Controllers em fluxos importantes via e2e quando fizer sentido
- Repositories e adapters quando houver transformacao ou comportamento relevante
- Guards e auth flow em pontos criticos

## Regras De Qualidade

- Todo bug corrigido deve ganhar teste quando o custo fizer sentido.
- Teste unitario deve isolar dependencia externa.
- Teste e2e deve cobrir pelo menos o caminho feliz dos endpoints principais.
- Nao deixar teste acoplado a detalhe interno irrelevante.
- Mudanca em contrato HTTP, auth ou persistencia deve revisar docs e testes.

## Checklist Rapido

- `Jest` unitario passando
- `Jest` e2e passando
- `build` passando
- Sem warning de lint
- Fluxo afetado coberto por teste ou justificativa

- Todos os padrões e orientações descritos nos documentos acima devem ser utilizados para resolver problemas REAIS e não por antecipação. Evitar o overengineering.