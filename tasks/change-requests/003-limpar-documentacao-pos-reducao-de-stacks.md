# Task 003 - Limpar documentacao apos reducao de stacks

## Status
done

## Tipo
shared

## Stacks envolvidos
- raiz
- front-end

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- nao se aplica

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
nao se aplica

### Tipo de referencia visual
ausente

### Fonte primaria visual
- nao se aplica

### Regra de aderencia visual
- Limpeza documental sem impacto de UI.

## Contexto de negocio

### Por que
O repositorio teve as pastas `.git`, `next-js/` e `mobile/` removidas, mas a documentacao raiz e o backlog ainda apontavam para essas stacks e para artefatos que nao existem mais.

### O que
Atualizar a governanca do projeto para refletir o perfil atual `front-end + backend`, remover referencias invalidas a `next-js` e `mobile` na documentacao raiz e excluir artefatos documentais/backlog que ficaram orfaos.

### Comportamento esperado
- Documentacao raiz passa a refletir apenas as stacks ativas.
- `tasks/000-index.md` passa a registrar o perfil atual do projeto.
- Tasks e docs dependentes de `next-js` ou `mobile` deixam de existir no backlog/documentacao ativa.

### Fora de escopo
- Remover codigo backend legado relacionado a mobile.
- Redefinir o contrato OpenAPI atual.
- Implementar a extensao de navegador.

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica.
- Casos de erro: links quebrados em docs raiz e backlog apontando para arquivos removidos.
- Decisoes humanas confirmadas: manter `front-end` como stack web ativa e `mobile: nao`.
- Casos de borda: historico de tasks mobile precisava ser removido da documentacao ativa para nao continuar incoerente com a estrutura do repositorio.

## Especificacao tecnica

### Deve
- Atualizar `AGENTS.md`, `GUIDE.md`, `README.md` e `design-system/README.md`.
- Atualizar `GUIDE-FLUXOGRAMA.mmd`.
- Atualizar `scaffold-manifest.json`.
- Atualizar `tasks/000-index.md`.
- Remover docs e tasks que dependem de `next-js` ou `mobile` excluidos do repositorio.

### Nao deve
- Nao alterar o codigo de produto.
- Nao criar novas referencias a stacks removidas.

## Entradas
- `AGENTS.md`
- `GUIDE.md`
- `README.md`
- `design-system/README.md`
- `GUIDE-FLUXOGRAMA.mmd`
- `scaffold-manifest.json`
- `tasks/000-index.md`

## Dependencias
- Remocao fisica previa de `.git`, `next-js/` e `mobile/`.

## Criterios de conclusao
- Nenhum documento raiz ou task ativa referencia `next-js/` ou `mobile/`.
- O backlog raiz reflete o perfil `front-end` e `mobile: nao`.
- Artefatos documentais orfaos foram removidos.

## Instrucoes de implementacao
- Preservar a governanca baseada em backlog unico.
- Ajustar textos para o estado atual do projeto sem inventar novas stacks.

## Validacao esperada
- `rg -n "next-js|mobile" AGENTS.md GUIDE.md README.md design-system tasks docs scaffold-manifest.json GUIDE-FLUXOGRAMA.mmd front-end\\AGENTS.md`

## Entregaveis esperados
- Documentacao raiz coerente com a estrutura atual.
- Backlog ativo limpo.
- Manifesto e fluxograma atualizados.

## Riscos ou ambiguidades
- O backend e o contrato ainda possuem referencias tecnicas a mobile; isso permanece fora do escopo desta task para evitar divergencia entre codigo e contrato.

## Resultado da execucao
Atualizada a documentacao raiz para o perfil atual `front-end + backend`, removidas referencias documentais a `next-js` e `mobile`, e excluidos artefatos de backlog/docs que ficaram invalidos apos a reducao das stacks.

## Arquivos alterados
- `AGENTS.md`
- `GUIDE.md`
- `README.md`
- `design-system/README.md`
- `front-end/AGENTS.md`
- `GUIDE-FLUXOGRAMA.mmd`
- `scaffold-manifest.json`
- `tasks/000-index.md`
- `tasks/change-requests/003-limpar-documentacao-pos-reducao-de-stacks.md`

## Validacoes executadas
- `rg -n "next-js|mobile" AGENTS.md GUIDE.md README.md design-system tasks docs scaffold-manifest.json GUIDE-FLUXOGRAMA.mmd front-end\\AGENTS.md`

## Aderencia ao design system
Sem impacto visual.

## Pendencias pos-task
- Avaliar em task futura se o backend e `contracts/openapi.yaml` devem manter ou remover o endpoint legado de check de versao mobile.
- Criar task propria para a extensao de navegador e para a integracao de Ordem de Producao via ERP Flex.

## Status final
done
