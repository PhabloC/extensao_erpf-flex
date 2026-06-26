# Change Request 057 - Traduzir logs da extensao para portugues

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

## Modo de execucao
cross-stack

## Criterios de conclusao
- mensagens de log da extensao aparecem em portugues
- erros vindos da API e detalhes comuns de validacao deixam de aparecer em ingles na tela de logs

## Resultado da execucao
- `front-end`: a tela interna de logs passou a traduzir mensagens antigas em ingles no momento da renderizacao
- `backend/extensao`: o `background.js` agora traduz mensagens e detalhes antes de persistir novas entradas no storage local
- Decisoes tecnicas: a traducao foi centralizada em utilitarios leves com foco nas mensagens reais vistas na importacao e em erros comuns do `class-validator`

## Arquivos alterados
- `extensao-dois-pingos/src/background.js`
- `extensao-dois-pingos/src/logs.js`
- `tasks/change-requests/057-traduzir-logs-da-extensao-para-portugues.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Status final
done
