# Change Request 007 - Definir contrato API para sistema destino da extensao

## Status
done

## Tipo
shared

## Stacks envolvidos
- backend
- front-end

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
nao se aplica

### Tipo de referencia visual
nao se aplica

### Fonte primaria visual
- nao se aplica

### Regra de aderencia visual
- change request de contrato e integracao; sem impacto direto de UI.

## Contexto de negocio

### Por que
Se a extensao for reutilizada contra outro sistema destino, esse sistema precisa expor uma API clara para autenticacao e importacao da OP capturada.

### O que
Definir um contrato OpenAPI inicial para o sistema destino da extensao, reaproveitando o fluxo funcional ja validado no MVP atual.

### Comportamento esperado
- sistema destino expõe autenticacao para a extensao
- sistema destino aceita importacao autenticada da OP
- respostas distinguem sucesso, duplicidade, validacao e autenticacao

### Fora de escopo
- implementar backend real do outro sistema
- adaptar CORS, deploy ou infraestrutura
- criar SDK cliente

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: autenticacao bearer e endpoint dedicado de importacao.
- Casos de erro: token invalido, payload incompleto, duplicidade por id externo, erro tecnico.
- Decisoes humanas confirmadas: a extensao continuara operando por API autenticada.
- Casos de borda: reenvio da mesma OP, campos opcionais ausentes, origem da captura mantida para rastreabilidade.

## Especificacao tecnica

### Deve
- definir contrato separado para o sistema destino da extensao
- cobrir autenticacao e importacao da OP
- documentar payload minimo, metadados de origem e respostas esperadas

### Nao deve
- nao sobrescrever o contrato principal atual do MVP
- nao assumir detalhes internos de banco ou framework do outro sistema

## Entradas
- `contracts/openapi.yaml`
- `requirements/005-integracao-erp-flex-e-extensao.md`
- `browser-extension/src/background.js`
- `browser-extension/src/content-script.js`

## Dependencias
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`
- `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md`

## Criterios de conclusao
- existe contrato OpenAPI inicial para o sistema destino da extensao
- contrato cobre autenticacao, importacao e respostas principais
- backlog e task ficam atualizados com premissas e lacunas

## Validacao esperada
- revisao estrutural do YAML gerado

## Entregaveis esperados
- novo arquivo de contrato em `contracts/`
- task atualizada
- `tasks/000-index.md` atualizado

## Riscos ou ambiguidades
- o outro sistema pode exigir auth diferente de login por e-mail e senha
- campos reais obrigatorios podem variar por dominio do sistema destino

## Resultado da execucao
- foi criado um contrato OpenAPI separado para sistemas externos que receberao os dados da extensao em `contracts/browser-extension-target-system.openapi.yaml`
- o contrato cobre autenticacao por `POST /auth/login` e importacao por `POST /production-orders/imports/erp-flex`
- as respostas principais foram definidas para sucesso (`201`), erro de validacao (`400`), autenticacao (`401`) e duplicidade (`409`)
- o payload de importacao reaproveita o mesmo nucleo funcional da extensao atual: `externalOrderId`, `orderNumber`, `item`, datas opcionais, `sourcePageUrl` e `rawPayload`
- decisao tecnica: o contrato foi mantido separado de `contracts/openapi.yaml` para nao misturar o backend atual do MVP com o contrato-alvo de outro sistema

## Arquivos alterados
- `contracts/browser-extension-target-system.openapi.yaml`
- `contracts/README.md`
- `tasks/change-requests/007-definir-contrato-api-para-sistema-destino-da-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- revisao estrutural manual do YAML gerado: ok
- verificacao de aderencia ao fluxo atual da extensao (`/auth/login` + importacao autenticada): ok

## Aderencia ao design system
- nao se aplica

## Pendencias pos-task
- confirmar se o outro sistema usara realmente login por e-mail e senha ou outro mecanismo de autenticacao
- confirmar se o endpoint de importacao deve manter exatamente o path atual ou se o outro sistema exigira namespace diferente
- alinhar regras de negocio especificas do outro sistema, como status inicial, chave oficial anti-duplicidade e campos obrigatorios extras

## Status final
done
