# Regras de planejamento (raiz)

## Principio

Planejar o projeto inteiro em backlog unico, sem fragmentar por repositorio.

## Ordem de raciocinio

1. requisitos e design system
2. perguntar ao usuario se a stack web sera `front-end` (React/Vite) ou `next-js` (Next.js)
3. perguntar ao usuario se o projeto tera mobile
4. classificar `design-system/front/` e `design-system/mobile/` de forma independente como artefato documental, aplicacao-prototipo visual, prints de telas ou ausente, tratando mobile como `nao se aplica` quando nao existir
5. review verificavel da spec
6. contrato openapi
7. impacto shared
8. impacto front, back e mobile quando aplicavel
9. dependencias cruzadas
10. estrategia incremental

## Checklist minimo de cada task

- Tipo
- Stacks envolvidos
- Perfil do projeto quando impactar roteamento (`front-end` ou `next-js`; mobile `sim` ou `nao`)
- Contrato (quando aplicavel)
- Modo de execucao
- Dependencias
- Criterios verificaveis
- Fonte primaria visual em `design-system/front/` ou `design-system/mobile/` (quando houver UI)
- Tipo de referencia visual (`artefato documental`, `aplicacao-prototipo visual`, `prints de telas` ou `nao se aplica`)
- Permissoes impactadas ou `nao se aplica`
- Casos de erro e borda mapeados

## Review verificavel da spec

Antes de considerar o backlog planejado:

- confirmar permissoes e registrar evidencia na task
- mapear casos de erro e estados excepcionais relevantes
- separar decisao humana confirmada de premissa assumida
- escrever criterios de aceite observaveis e testaveis
- registrar casos de borda relevantes ou a ausencia deles

Planejamento incompleto deve virar risco, pendencia ou duvida explicita. Nao ocultar lacunas.

## Cobertura esperada

Quando aplicavel:
- fundacao tecnica
- contrato
- integracoes
- front-end React/Vite ou Next.js, conforme escolha do usuario
- backend
- mobile, somente quando confirmado
- seguranca
- testes
- observabilidade
- documentacao

## Qualidade

Um executor deve conseguir implementar sem reinterpretar o problema.
