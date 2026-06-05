# Requisito 003 - Regras de Negocio

## Regras gerais de Ordem de Producao

### RN-001

Toda Ordem de Producao deve possuir identificacao unica no sistema.

### RN-002

Toda Ordem de Producao deve possuir um status atual no kanban.

### RN-003

Uma ordem deve pertencer a apenas uma etapa do kanban por vez.

### RN-004

Toda ordem deve registrar sua origem, com valores minimos:
- `manual`
- `erp-flex`

### RN-005

Ordens importadas do ERP Flex devem armazenar um identificador externo suficiente para rastrear a origem no ERP.

### RN-006

A criacao ou importacao de uma ordem deve registrar usuario, data e hora da operacao.

## Regras de validacao de dados

### RN-007

Os seguintes campos devem ser obrigatorios para criar uma ordem:
- numero da ordem ou identificador equivalente
- produto
- quantidade
- status inicial

### RN-008

Quantidade deve ser maior que zero.

### RN-009

Campos textuais criticos devem ser saneados para evitar gravacao de valores vazios, nulos inconsistentes ou lixo de interface.

### RN-010

Quando o ERP nao fornecer algum campo opcional, a importacao deve continuar somente se todos os campos obrigatorios estiverem presentes.

## Regras de duplicidade

### RN-011

Nao deve existir duplicidade de ordem importada com base no identificador externo do ERP, salvo se houver regra explicita de reimportacao controlada.

### RN-012

Ao detectar duplicidade, o sistema nao deve criar nova ordem silenciosamente.

### RN-013

O sistema deve retornar uma resposta clara indicando que a ordem ja existe.

## Regras do fluxo kanban

### RN-014

Toda nova ordem deve entrar em uma etapa inicial padrao definida pelo negocio.

### RN-015

Mudancas de etapa devem gerar historico de transicao.

### RN-016

O sistema pode restringir transicoes invalidas entre etapas quando houver regra de processo.

### RN-017

Uma ordem encerrada, cancelada ou concluida pode ter restricoes adicionais de movimentacao.

## Regras da integracao com ERP Flex

### RN-018

A extensao deve acionar a importacao apenas quando o usuario estiver em uma pagina suportada do ERP Flex.

### RN-019

A importacao deve preferir dados estruturados da pagina ou de chamadas de rede do ERP em vez de depender exclusivamente de texto solto na interface.

### RN-020

Se os dados necessarios nao puderem ser identificados com confianca, a extensao nao deve enviar importacao cega.

### RN-021

A extensao deve informar ao usuario o resultado da importacao: sucesso, duplicidade, erro de autenticacao ou erro de coleta.

### RN-022

A API do sistema deve validar novamente todos os dados recebidos da extensao; a extensao nao e fonte confiavel unica.

### RN-023

O sistema deve registrar que a ordem foi criada por importacao ERP Flex, incluindo data/hora e, quando possivel, referencia da pagina ou chave externa.

## Regras de seguranca e permissao

### RN-024

Apenas usuarios autenticados e autorizados podem criar ordens, manualmente ou por importacao.

### RN-025

O usuario da extensao deve estar autenticado no sistema destino para concluir a importacao.

### RN-026

Credenciais do ERP Flex nao devem ser copiadas ou armazenadas pelo sistema de kanban.

## Regras de auditoria

### RN-027

O sistema deve manter historico minimo dos eventos:
- criacao
- importacao
- mudanca de status
- atualizacao relevante

### RN-028

Eventos de erro de importacao podem ser registrados para apoio operacional e diagnostico.

## Regras operacionais

### RN-029

O cadastro manual deve continuar disponivel como contingencia.

### RN-030

A indisponibilidade do ERP Flex nao deve impedir a operacao basica do sistema de kanban para ordens ja cadastradas.

### RN-031

A indisponibilidade temporaria da extensao nao deve bloquear o processo de cadastro manual.
