# Requisito 005 - Integracao ERP Flex e Extensao de Navegador

## Objetivo

Definir os requisitos especificos da integracao entre o ERP Flex e o sistema de kanban por meio de uma extensao de navegador.

## Visao da integracao

O usuario continuara consultando ou abrindo as ordens no ERP Flex. A extensao de navegador atuara como ponte operacional para capturar os dados dessa ordem e enviar ao sistema de kanban.

## Componentes envolvidos

### ERP Flex

Sistema de origem onde a Ordem de Producao existe inicialmente.

### Extensao de navegador

Camada intermediaria responsavel por:
- reconhecer a pagina do ERP
- coletar os dados relevantes
- apresentar retorno ao usuario
- enviar os dados ao backend do sistema

### Backend do sistema

Camada responsavel por:
- autenticar o usuario
- validar os dados recebidos
- verificar duplicidade
- criar a Ordem de Producao
- retornar o resultado da importacao

### Front-end do sistema

Camada responsavel por exibir a ordem criada no kanban e nas telas de consulta.

## Escopo funcional da extensao

### RF-EXT-001

A extensao deve poder ser acionada manualmente pelo usuario em pagina suportada do ERP Flex.

### RF-EXT-002

A extensao deve identificar se a pagina atual contem contexto valido de Ordem de Producao.

### RF-EXT-003

A extensao deve coletar, no minimo, os campos obrigatorios da ordem.

### RF-EXT-004

A extensao deve enviar os dados para o backend do sistema por API autenticada.

### RF-EXT-005

A extensao deve exibir resultado da operacao ao usuario.

### RF-EXT-006

A extensao deve tratar claramente os cenarios:
- importacao concluida
- ordem ja existente
- autenticacao invalida
- pagina nao suportada
- dados insuficientes
- erro tecnico

## Estrategia de coleta de dados

### Prioridade 1

Usar dados estruturados que o ERP Flex carregue no navegador, como respostas de API ou objetos estruturados da pagina.

### Prioridade 2

Usar leitura do DOM/HTML da pagina quando os dados estruturados nao estiverem disponiveis.

### Regra

O produto deve evitar depender exclusivamente de scraping fragil quando existir fonte mais estavel.

## Campos desejados para importacao

### Obrigatorios

- numero da ordem no ERP
- codigo do produto ou identificador equivalente
- descricao do produto
- quantidade

### Desejaveis

- unidade de medida
- data de emissao
- prazo de entrega ou producao
- deposito, setor ou centro relacionado
- observacoes
- cliente ou referencia comercial, se fizer sentido no processo

### Tecnicos

- origem `erp-flex`
- identificador externo bruto
- data/hora da importacao
- usuario que realizou a importacao

## Fluxo detalhado da importacao

1. Usuario abre a ordem no ERP Flex.
2. Usuario aciona a extensao.
3. Extensao verifica se esta em contexto suportado.
4. Extensao extrai os campos disponiveis.
5. Extensao valida se os campos obrigatorios foram obtidos.
6. Extensao envia requisicao autenticada ao backend.
7. Backend valida autenticacao e permissao.
8. Backend normaliza os dados.
9. Backend verifica duplicidade.
10. Backend cria a ordem.
11. Backend retorna resultado.
12. Extensao informa o usuario.
13. Ordem passa a estar visivel no sistema.

## Requisitos de API para a integracao

### API-001

O backend deve expor endpoint especifico para importacao de Ordem de Producao.

### API-002

O endpoint deve aceitar payload com os campos da ordem e metadados de origem.

### API-003

O endpoint deve responder de forma distinta para:
- criacao com sucesso
- duplicidade
- erro de validacao
- erro de autenticacao

### API-004

O contrato dessa API deve ser descrito em `contracts/openapi.yaml` antes da implementacao definitiva.

## Requisitos de seguranca da extensao

### SEG-001

A extensao nao deve armazenar senha do ERP Flex.

### SEG-002

A extensao deve usar apenas os acessos necessarios para sua funcao.

### SEG-003

Tokens do sistema destino devem ser armazenados e transmitidos com cuidado.

### SEG-004

A extensao nao deve enviar dados para destinos nao autorizados.

## Riscos conhecidos

- mudanca no layout do ERP Flex
- ausencia de API exposta no navegador
- campos relevantes espalhados em mais de uma tela
- sessao expirada no sistema destino
- duplicidade por reimportacao

## Decisoes de produto ja assumidas

- a extensao sera o primeiro mecanismo de integracao
- o cadastro manual continuara existindo como contingencia
- a regra de criacao da ordem pertence ao backend, nao exclusivamente a extensao
- o sistema deve registrar a origem da ordem importada

## Duvidas que devem ser respondidas em discovery tecnico

- qual e a URL/padrao real da pagina de ordem no ERP Flex
- quais campos estao disponiveis diretamente na tela
- se o ERP Flex carrega os dados por API acessivel no navegador
- qual sera o identificador externo oficial para evitar duplicidade
- qual status inicial do kanban a ordem importada deve receber
