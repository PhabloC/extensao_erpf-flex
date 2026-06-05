# Modelo de task (raiz)

# Task XXX - <titulo>

## Status
planned

## Tipo
front | back | mobile | shared

## Stacks envolvidos
- front-end ou next-js
- backend
- mobile (quando aplicavel)

## Perfil do projeto
- stack web escolhida: front-end (React/Vite) | next-js (Next.js) | nao se aplica
- mobile: sim | nao

## Contrato
- `contracts/openapi.yaml#/paths/...`
- ou `nao se aplica`

## Modo de execucao
single-stack | cross-stack

## Referencia de design system

### Stack de referencia visual
front-end | mobile | multiplas stacks | nao se aplica

### Tipo de referencia visual
artefato de design system | aplicacao-prototipo visual | prints de telas | nao se aplica

### Fonte primaria visual
- `design-system/front/...`
- `design-system/mobile/...`

### Regra de aderencia visual
- descrever a regra objetiva de aderencia para a implementacao
- se for `aplicacao-prototipo visual`, registrar explicitamente que a UI deve seguir fielmente a aplicacao de exemplo
- se for `prints de telas`, registrar explicitamente que a UI deve seguir fielmente os prints indicados, incluindo quais telas/estados cada imagem governa
- se houver UI em mais de uma stack, descrever a regra de aderencia por stack

## Contexto de negocio

### Por que
[1-2 frases: Qual problema esta task resolve e por que isso importa agora]

### O que
[Entregavel concreto e verificavel. Descrever com especificidade suficiente para validar quando estiver pronto]

### Comportamento esperado
- cenario
- resultado esperado

### Fora de escopo
- funcionalidade adjacente que explicitamente nao sera entregue nesta task

## Review da spec

- [ ] Permissoes definidas ou `nao se aplica`
- [ ] Casos de erro mapeados
- [ ] Decisoes de negocio confirmadas como humanas
- [ ] Criterios de aceite objetivos e verificaveis
- [ ] Casos de borda considerados

### Evidencias da review
- Permissoes:
- Casos de erro:
- Decisoes humanas confirmadas:
- Casos de borda:

## Especificacao tecnica

### Deve
- padroes, bibliotecas, convencoes e restricoes obrigatorias

### Nao deve
- nao adicionar novas dependencias sem autorizacao explicita nesta task
- nao desviar dos padroes estabelecidos sem justificativa registrada

## Entradas
- `requirements/...`
- `design-system/front/...`
- `design-system/mobile/...`
- `contracts/openapi.yaml`
- `AGENTS.md`
- `GUIDE.md`
- `front-end/docs/ai/...`
- `next-js/docs/ai/...`
- `backend/docs/ai/...`
- `mobile/docs/ai/...`

## Dependencias
- Task XXX
ou
- Nenhuma

## Criterios de conclusao
- criterio verificavel
- evidenciar aderencia a `Referencia de design system` quando houver UI

## Instrucoes de implementacao
- diretriz

## Validacao esperada
- testes
- lint
- build
- typecheck
- validacao de contrato

## Entregaveis esperados
- arquivos
- codigo
- ajustes de contrato (quando aplicavel)

## Riscos ou ambiguidades
- item

## Resultado da execucao
_A ser preenchido na execucao_

## Arquivos alterados
_A ser preenchido na execucao_

## Validacoes executadas
_A ser preenchido na execucao_

## Aderencia ao design system
_A ser preenchido na execucao, com comparacao objetiva entre implementacao e referencia visual por stack_

## Pendencias pos-task
_A ser preenchido na execucao_

## Status final
planned
