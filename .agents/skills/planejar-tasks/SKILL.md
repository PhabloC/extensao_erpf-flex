---
name: planejar-tasks
description: planejar backlog unico na raiz a partir de requirements, design-system, prints de telas, contracts openapi, guias globais e contexto das stacks web React/Vite ou Next.js, backend e mobile opcional. usar quando for necessario criar tasks classificadas por tipo, com dependencias cruzadas e rastreabilidade fim a fim.
---

Planeje o projeto inteiro com orquestracao na raiz.

## Estrutura alvo

- `AGENTS.md` (raiz)
- `GUIDE.md` (raiz)
- `requirements/` (raiz)
- `design-system/front/` (raiz)
- `design-system/mobile/` (raiz)
- `contracts/openapi.yaml` (raiz)
- `tasks/` (raiz)
- `front-end/` (React/Vite), `next-js/` (Next.js), `backend/`, `mobile/` (opcional)

## Objetivo desta skill

Criar backlog unico e rastreavel na raiz, com tasks classificadas em:
- `front`
- `back`
- `mobile`
- `shared`

Tasks `front` devem apontar a stack web concreta em `Stacks envolvidos`:
- `front-end` para React/Vite
- `next-js` para Next.js

Tasks `mobile` so devem existir quando o usuario confirmar que o projeto tera mobile.

## Fluxo obrigatorio

1. Ler contexto global (raiz)
2. Antes de gerar qualquer task, perguntar e aguardar resposta do usuario:
   - se o projeto web sera React/Vite (`front-end/`) ou Next.js (`next-js/`)
   - se o projeto tera mobile (`sim` ou `nao`)
3. Registrar as respostas como `Perfil do projeto` no indice e nas tasks relevantes
4. Classificar as referencias em `design-system/` por stack:
   - `design-system/front/`: artefato de design system, aplicacao-prototipo visual, prints de telas ou ausente
   - `design-system/mobile/`: artefato de design system, aplicacao-prototipo visual, prints de telas, ausente ou nao se aplica quando mobile nao existir
5. Executar review da spec antes de decompor o backlog
6. Ler contexto tecnico local das stacks aplicaveis
7. Derivar impacto por stack e impacto compartilhado
8. Propor tasks por stack aplicavel em paralelo (subagentes)
9. Consolidar backlog unico com dependencias cruzadas
10. Criar/atualizar `tasks/000-index.md`
11. Criar tasks em `tasks/*.md`
12. Apresentar resumo do planejamento

## Leitura obrigatoria

1. `AGENTS.md` da raiz
2. `GUIDE.md` da raiz
3. `requirements/`
4. `design-system/front/` e `design-system/mobile/`, identificando explicitamente se cada subpasta contem artefatos de design system, aplicacao-prototipo visual, prints de telas ou esta ausente
5. `contracts/openapi.yaml`
6. `front-end/AGENTS.md` e `front-end/docs/ai/` quando a resposta for React/Vite
7. `next-js/AGENTS.md` e `next-js/docs/ai/` quando a resposta for Next.js
8. `backend/AGENTS.md` e `backend/docs/ai/` (arquivos relevantes)
9. `mobile/AGENTS.md` e `mobile/docs/ai/` somente quando o usuario confirmar mobile

## Perguntas obrigatorias ao usuario

Antes de escrever ou atualizar qualquer arquivo em `tasks/`, perguntar em uma unica mensagem:

1. O projeto web sera React/Vite (`front-end/`) ou Next.js (`next-js/`)?
2. O projeto tera mobile? (`sim` ou `nao`)

Nao inferir essas respostas a partir da existencia das pastas. As pastas sao scaffolds disponiveis, nao decisao de escopo do produto.

## Review obrigatorio da spec

Antes de concluir o planejamento, transformar os itens abaixo em verificacoes explicitas no backlog e nas tasks. Nao tratar como checklist mental.

- Permissoes definidas: registrar papeis, perfis, escopos ou declarar `nao se aplica`
- Casos de erro mapeados: listar erros, estados vazios, estados de carregamento, negacao de permissao e falhas de integracao quando aplicavel
- Decisoes de negocio confirmadas como humanas: separar claramente requisito confirmado vs premissa assumida pela IA
- Criterios de aceite objetivos e verificaveis: escrever criterios observaveis, testaveis e sem linguagem subjetiva
- Casos de borda considerados: listar cenarios limite relevantes ou declarar explicitamente que nao ha novos casos de borda alem dos ja cobertos

Se algum item acima estiver incompleto, nao encerrar o planejamento como se estivesse fechado. Registrar lacuna, risco ou duvida para validacao humana.

## Regras de decomposicao

- toda task deve ser executavel e com escopo claro
- toda task deve declarar `Tipo`
- toda task deve declarar `Stacks envolvidos`
- task `front` deve declarar `front-end` ou `next-js`, nunca os dois, salvo requisito explicito de migracao/comparacao
- task `mobile` deve ser criada apenas se mobile foi confirmado
- tasks de integracao cliente-servidor devem declarar `Contrato`
- toda task deve declarar `Modo de execucao`
- dependencias cruzadas devem ser explicitas
- toda task deve deixar verificavel:
  - qual fonte visual em `design-system/front/` ou `design-system/mobile/` governa a implementacao
  - quais permissoes impactam o fluxo
  - quais casos de erro e borda precisam ser tratados
  - quais criterios objetivos definem conclusao

## Regras para `design-system/`

- `design-system/front/` governa a referencia visual de tasks `front` tanto para `front-end` quanto para `next-js`, e da porcao web de tasks `shared`
- `design-system/mobile/` governa a referencia visual de tasks `mobile` e da porcao mobile de tasks `shared`
- cada subpasta pode conter artefatos de design system, uma aplicacao-prototipo visual ou prints de telas
- task com UI de `front` deve apontar para caminhos concretos em `design-system/front/`
- task com UI de `mobile` deve apontar para caminhos concretos em `design-system/mobile/`
- task `shared` com UI em front e mobile deve registrar separadamente as fontes visuais de cada stack
- quando a subpasta relevante contiver uma aplicacao-prototipo visual, decompor tasks de UI para preservar fidelidade de layout, hierarquia, componentes, copy, estados e fluxo visual dessa aplicacao
- quando a subpasta relevante contiver prints de telas, decompor tasks de UI para preservar fidelidade ao que estiver visivel nos prints: layout, hierarquia, componentes, copy, estados capturados, densidade, espacamentos e comportamento inferivel apenas quando a task declarar essa inferencia
- prints de telas devem ser referenciados por caminhos concretos e, quando houver varios, associados as telas/fluxos/estados que cada imagem governa
- se os prints nao cobrirem um estado necessario, registrar lacuna ou premissa na task em vez de inventar a UI desse estado
- nao resumir a referencia visual como "seguir o design system"; apontar caminhos e telas/componentes concretos em `design-system/front/` ou `design-system/mobile/`
- nao usar a referencia visual de uma stack para cobrir ausencia da outra por iniciativa propria
- se houver conflito entre requirements e a referencia visual, explicitar o conflito na task em vez de inferir sozinho qual lado vence

## Regras de contrato

- `contracts/openapi.yaml` e fonte de verdade para API
- se contrato estiver ausente/incompleto, criar task `shared` para definir/ajustar contrato antes da implementacao cliente-servidor

## Modo de subagentes

Durante o planejamento:
- gerar propostas por stack aplicavel em paralelo (web escolhida, back e mobile quando confirmado)
- consolidar na raiz sem duplicar escopo
- manter coesao entre tasks `shared` e tasks por stack

## Arquivos de referencia

- `references/regras-de-planejamento.md`
- `references/modelo-index-tasks.md`
- `references/modelo-task.md`

## Proibicoes

- nao implementar codigo de produto
- nao criar backlog separado por stack
- nao inventar requisito ausente
- nao ignorar contrato quando houver API
