# Change Request 056 - Documentar contrato operacional da API para a extensao ERP Flex

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
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex`
- `contracts/openapi.yaml#/paths/~1auth~1login`

## Modo de execucao
cross-stack

## Criterios de conclusao
- existe um documento `.md` pronto para compartilhamento com o time da API
- o documento descreve autenticacao, endpoint, payload, respostas, regras de create/update e erros esperados
- o documento reflete o comportamento atual da extensao e do backend local

## Resultado da execucao
- foi criado um documento operacional unico em `docs/INTEGRACAO-API-EXTENSAO-ERP-FLEX.md`
- o conteudo consolida login, importacao ERP, schema esperado, regras de criacao/atualizacao, respostas, erros e checklist final para o time da API
- a documentacao foi alinhada ao fluxo atual em que a importacao retorna apenas `created` ou `updated`

## Arquivos alterados
- `docs/INTEGRACAO-API-EXTENSAO-ERP-FLEX.md`
- `tasks/change-requests/056-documentar-contrato-operacional-da-api-para-a-extensao-erp-flex.md`
- `tasks/000-index.md`

## Status final
done
