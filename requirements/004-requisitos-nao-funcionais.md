# Requisito 004 - Requisitos Nao Funcionais

## Arquitetura e plataforma

### RNF-001

O produto deve operar nas stacks ativas do projeto:
- `front-end` em React/Vite
- `backend`
- extensao de navegador como componente complementar

### RNF-002

O sistema deve ter arquitetura suficiente para separar interface web, API backend e extensao.

## Usabilidade

### RNF-003

A interface do kanban deve permitir identificacao rapida das ordens.

### RNF-004

O fluxo de importacao via extensao deve exigir o minimo possivel de passos manuais.

### RNF-005

Mensagens de erro devem ser claras e acionaveis.

## Performance

### RNF-006

O tempo de resposta para criar ou importar uma ordem deve ser percebido como rapido em condicoes normais.

### RNF-007

A listagem e o kanban devem suportar volume operacional compativel com o uso diario sem degradacao evidente.

## Confiabilidade

### RNF-008

O backend deve validar dados de entrada de forma deterministica.

### RNF-009

Operacoes de criacao de ordem devem evitar inconsistencias parciais.

### RNF-010

Falhas de importacao devem retornar erro controlado, sem criar registros corrompidos.

## Seguranca

### RNF-011

O sistema deve exigir autenticacao para operacoes de escrita.

### RNF-012

O backend nao deve confiar cegamente nos dados enviados pela extensao.

### RNF-013

Dados sensiveis, tokens e segredos devem ser tratados de forma segura.

### RNF-014

O sistema deve registrar eventos relevantes sem expor segredos em logs.

## Compatibilidade

### RNF-015

A extensao deve ser pensada prioritariamente para navegadores baseados em Chromium, salvo expansao futura.

### RNF-016

O sistema web deve funcionar em navegadores modernos compativeis com o ambiente operacional do cliente.

## Manutenibilidade

### RNF-017

As regras de negocio da importacao devem ficar centralizadas no backend sempre que possivel.

### RNF-018

Mudancas no layout do ERP Flex devem impactar preferencialmente a camada da extensao, e nao o restante do sistema.

### RNF-019

O contrato da API deve ser documentado em `contracts/openapi.yaml` antes da implementacao definitiva da integracao.

## Observabilidade

### RNF-020

O sistema deve permitir auditoria de importacoes realizadas, com identificacao minima do resultado.

### RNF-021

Erros de importacao relevantes devem ser passiveis de diagnostico tecnico.

## Escalabilidade funcional

### RNF-022

O modelo de integracao deve permitir futuramente suportar novas origens alem do ERP Flex sem reescrever o produto inteiro.

### RNF-023

O sistema deve permitir evolucao futura para sincronizacao mais robusta, se o negocio aprovar.
