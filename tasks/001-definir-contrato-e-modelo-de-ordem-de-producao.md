# Task 001 - Definir contrato e modelo de Ordem de Producao

## Status
done

## Tipo
shared

## Stacks envolvidos
- front-end
- backend

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml`

## Modo de execucao
cross-stack

## Referencia de design system

### Stack de referencia visual
nao se aplica

### Tipo de referencia visual
nao se aplica

### Fonte primaria visual
- nao se aplica

### Regra de aderencia visual
- Task de contrato e modelo, sem escopo visual.

## Contexto de negocio

### Por que
O sistema ainda nao possui contrato de API nem modelo funcional para Ordem de Producao. Sem isso, front-end, backend e extensao ficariam desacoplados do mesmo vocabulário e alto risco de retrabalho.

### O que
Definir no `contracts/openapi.yaml` os endpoints e schemas do MVP de Ordem de Producao, cobrindo cadastro manual, listagem, detalhe, atualizacao de status no kanban e importacao via ERP Flex.

### Comportamento esperado
- contrato descreve payloads e responses do MVP
- modelo funcional cobre origem da ordem, identificador ERP e historico minimo
- front-end e backend passam a usar o mesmo contrato como fonte de verdade

### Fora de escopo
- implementacao dos endpoints
- implementacao da interface web
- implementacao da extensao

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: criar/editar ordens exige usuario autenticado; consulta depende de sessao valida; perfis finos ainda podem evoluir.
- Casos de erro: payload invalido, ordem nao encontrada, duplicidade de identificador ERP, tentativa de transicao invalida, auth ausente.
- Decisoes humanas confirmadas: stack web `front-end` e mobile `nao`.
- Casos de borda: ordens sem campos opcionais, importacao repetida, payload parcial da extensao, status inicial padrao.

## Especificacao tecnica

### Deve
- atualizar `contracts/openapi.yaml`
- definir schemas para Ordem de Producao, evento de historico e origem da ordem
- definir endpoint especifico para importacao ERP
- definir responses explicitas para sucesso, validacao, duplicidade e nao encontrado

### Nao deve
- nao manter o contrato limitado ao endpoint legado de mobile
- nao deixar campos de origem/importacao ambiguos

## Entradas
- `requirements/001-visao-geral-do-produto.md`
- `requirements/002-fluxos-e-casos-de-uso.md`
- `requirements/003-regras-de-negocio.md`
- `requirements/005-integracao-erp-flex-e-extensao.md`
- `contracts/openapi.yaml`
- `AGENTS.md`
- `GUIDE.md`

## Dependencias
- Nenhuma

## Criterios de conclusao
- `contracts/openapi.yaml` cobre o MVP de Ordem de Producao
- existem schemas tipados para criacao manual, importacao ERP, listagem, detalhe e mudanca de status
- respostas de erro para duplicidade e validacao estao descritas

## Instrucoes de implementacao
- separar claramente criacao manual de importacao ERP
- explicitar `origin` e `externalOrderId` no contrato
- registrar o endpoint legado mobile como candidato a remocao futura, sem misturar com o novo dominio

## Validacao esperada
- validacao sintatica do OpenAPI
- revisao manual dos schemas e paths

## Entregaveis esperados
- `contracts/openapi.yaml` atualizado
- task e indice atualizados

## Riscos ou ambiguidades
- a etapa inicial do kanban ainda depende de confirmacao humana, mas o contrato deve suportar valor default do backend

## Resultado da execucao
Contrato OpenAPI expandido para cobrir o MVP de Ordem de Producao e a importacao ERP Flex:
- adicionados endpoints de listagem, criacao manual, detalhe e mudanca de status de Ordem de Producao
- adicionado endpoint de importacao `POST /production-orders/imports/erp-flex`
- definidos schemas para ordem, item, origem, historico, paginacao e erros
- mantido o endpoint legado `/app/versions/check`, agora marcado como legado no escopo atual do produto
- adicionada autenticacao bearer no contrato das operacoes do dominio ativo

## Arquivos alterados
- `contracts/openapi.yaml`
- `tasks/000-index.md`
- `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md`

## Validacoes executadas
- `npx --yes @redocly/cli lint contracts/openapi.yaml`
- revisao manual dos paths, responses e schemas de Ordem de Producao

## Aderencia ao design system
Nao se aplica. Task de contrato sem impacto visual.

## Pendencias pos-task
- Confirmar na implementacao backend qual coluna padrao do kanban sera usada quando `status` nao for enviado.
- Confirmar em discovery com o ERP Flex qual valor real sera usado como `externalOrderId`.
- Avaliar em task futura a remocao do endpoint legado mobile do contrato e do backend.
- Implementar o modulo backend do dominio conforme `tasks/002-implementar-backend-de-ordem-de-producao.md`.

## Status final
done
