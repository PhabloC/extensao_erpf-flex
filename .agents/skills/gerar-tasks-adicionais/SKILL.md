---
name: gerar-tasks-adicionais
description: gerar uma ou mais tasks adicionais no backlog unico da raiz a partir de uma nova solicitacao, incluindo novas referencias visuais ou prints de telas, respeitando a stack web escolhida (front-end React/Vite ou next-js), mobile opcional, classificacao por tipo (front, back, mobile, shared), dependencias cruzadas e referencia ao contrato openapi quando aplicavel.
---

Gere change requests no backlog unico da raiz.

## Objetivo

Transformar nova demanda em tasks adicionais sem quebrar o planejamento existente.

## Contexto obrigatorio

- `AGENTS.md` e `GUIDE.md` da raiz
- `requirements/`
- `design-system/front/`
- `design-system/mobile/`
- `contracts/openapi.yaml`
- `tasks/000-index.md`
- tasks existentes em `tasks/`
- perfil do projeto registrado no indice (`front-end` ou `next-js`; mobile `sim` ou `nao`)

## Regras

- criar em `tasks/change-requests/`
- classificar cada task com `Tipo`
- declarar `Stacks envolvidos`
- para task `front`, usar a stack web registrada no indice: `front-end` ou `next-js`
- nao criar task `mobile` se o indice indicar `mobile: nao`, salvo pedido explicito para adicionar mobile ao escopo
- declarar `Contrato` quando aplicavel
- declarar `Modo de execucao`
- apontar a referencia visual correta por stack quando houver UI
- quando a nova demanda trouxer prints de telas, classificar a referencia visual como `prints de telas`, apontar os caminhos concretos em `design-system/front/` ou `design-system/mobile/` e registrar quais telas/estados cada print governa
- nao usar prints de uma stack para inferir a outra sem regra explicita no change request
- relacionar dependencias com tasks existentes

## Atualizacao do indice

Atualizar `tasks/000-index.md` quando a mudanca impactar ordem, dependencias ou escopo global.

## Proibicoes

- nao implementar codigo
- nao duplicar task ja coberta
- nao ignorar impacto cross-stack
