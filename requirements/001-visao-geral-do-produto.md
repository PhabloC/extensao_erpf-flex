# Requisito 001 - Visao Geral do Produto

## Nome do produto

ERP Flex para Kanban

## Visao geral

O produto e um sistema web para gerenciar Ordens de Producao em um quadro kanban. O objetivo principal e permitir que as ordens sejam visualizadas, organizadas, acompanhadas e atualizadas com mais agilidade operacional do que no fluxo manual atual.

O sistema deve evoluir de um cadastro manual de ordens para um fluxo integrado com o ERP Flex, reduzindo retrabalho e erros de digitacao. Essa integracao sera iniciada por uma extensao de navegador que coleta os dados da ordem na pagina do ERP Flex e os envia ao sistema, criando a Ordem de Producao automaticamente no kanban.

## Objetivo de negocio

- Reduzir o tempo gasto para cadastrar Ordens de Producao manualmente.
- Eliminar divergencia de dados entre o ERP Flex e o kanban operacional.
- Dar visibilidade do andamento da producao por etapas.
- Permitir rastreabilidade da origem da ordem, incluindo ordens importadas do ERP.

## Problema atual

- As Ordens de Producao existem no ERP Flex.
- O usuario precisa recriar manualmente essas ordens no sistema do kanban.
- O processo manual gera lentidao, retrabalho e risco de inconsistencias.
- Nao existe uma ponte automatica entre ERP Flex e kanban.

## Resultado esperado

- O usuario acessa a pagina da ordem no ERP Flex.
- Clica em uma extensao de navegador.
- A extensao coleta os dados da ordem.
- O sistema recebe esses dados e cria a Ordem de Producao automaticamente.
- A ordem passa a aparecer no kanban pronta para acompanhamento.

## Escopo do produto

### Em escopo

- Sistema web com autenticacao de usuarios.
- Cadastro manual de Ordem de Producao.
- Listagem e visualizacao de Ordens de Producao.
- Quadro kanban para acompanhamento operacional.
- Criacao automatica de ordem via integracao com extensao de navegador.
- Rastreabilidade da origem da ordem: manual ou ERP Flex.
- Validacoes para evitar duplicidade e inconsistencias.
- Registro de eventos relevantes da ordem.

### Fora de escopo inicial

- Alterar dados diretamente no ERP Flex.
- Sincronizacao bidirecional completa entre ERP e sistema.
- Aplicativo mobile.
- Planejamento de capacidade industrial avancado.
- Emissao fiscal, compras ou controle financeiro.

## Perfis de usuario

### Administrador

Responsavel por configuracoes gerais, acessos, parametros do processo e acompanhamento global.

### PCP / Planejamento

Responsavel por criar, importar, priorizar e acompanhar ordens de producao.

### Operacao / Chao de fabrica

Responsavel por consultar o kanban e atualizar o andamento das ordens conforme a etapa operacional.

### Gestao

Responsavel por acompanhar indicadores, gargalos e status das ordens.

## Entidades principais

### Ordem de Producao

Registro central do sistema contendo os dados necessarios para identificar, planejar e acompanhar a producao.

### Item / Produto

Produto ou item principal associado a uma ordem.

### Etapa do kanban

Coluna ou status operacional da ordem dentro do fluxo produtivo.

### Usuario

Pessoa autenticada que opera o sistema.

### Origem da importacao

Metadado que identifica se a ordem foi criada manualmente ou importada do ERP Flex.

## Campos minimos esperados da Ordem de Producao

- identificador interno da ordem no sistema
- numero da ordem no ERP Flex, quando aplicavel
- codigo do produto
- descricao do produto
- quantidade planejada
- unidade de medida
- data de emissao
- prazo ou data prevista
- observacoes
- status atual no kanban
- origem da ordem
- usuario responsavel pela criacao
- data/hora de criacao

## Principios do produto

- simplicidade operacional
- rastreabilidade
- baixa friccao no cadastro
- consistencia de dados
- possibilidade de auditoria

## MVP sugerido

- login
- listagem de ordens
- criacao manual de ordem
- quadro kanban com movimentacao basica
- endpoint de criacao de ordem
- extensao de navegador com importacao por clique
- prevencao de duplicidade por numero da ordem ERP

## Indicadores de sucesso

- tempo medio para criar uma ordem
- percentual de ordens criadas por importacao
- reducao de erros de digitacao
- quantidade de ordens duplicadas evitadas
- tempo medio de atualizacao do quadro
