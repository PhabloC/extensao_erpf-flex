# Requisito 002 - Fluxos e Casos de Uso

## Fluxo macro do produto

1. Usuario acessa o sistema web.
2. Usuario autentica-se.
3. Usuario cria ordem manualmente ou importa do ERP Flex.
4. Ordem entra no kanban em uma etapa inicial.
5. Usuarios acompanham e movem a ordem entre etapas.
6. O sistema registra historico e status.

## Caso de uso 01 - Login no sistema

### Objetivo

Permitir acesso seguro ao sistema conforme o perfil do usuario.

### Atores

- administrador
- PCP
- operacao
- gestao

### Pre-condicoes

- usuario possui credenciais validas.

### Fluxo principal

1. Usuario informa credenciais.
2. Sistema valida os dados.
3. Sistema cria sessao autenticada.
4. Usuario e redirecionado para a area principal.

### Pos-condicoes

- sessao autenticada ativa
- permissoes carregadas

### Excecoes

- credenciais invalidas
- usuario inativo
- indisponibilidade da API

## Caso de uso 02 - Criar Ordem de Producao manualmente

### Objetivo

Permitir o cadastro direto de uma nova ordem quando a importacao automatica nao for usada.

### Fluxo principal

1. Usuario abre o formulario de nova ordem.
2. Usuario preenche os campos obrigatorios.
3. Sistema valida os dados.
4. Sistema grava a ordem.
5. Ordem aparece no kanban.

### Regras associadas

- campos obrigatorios devem ser validados.
- ordem manual deve registrar `origem = manual`.

## Caso de uso 03 - Visualizar quadro kanban

### Objetivo

Permitir acompanhamento operacional das ordens por etapa.

### Fluxo principal

1. Usuario acessa a pagina do kanban.
2. Sistema busca as ordens.
3. Sistema agrupa as ordens por status/etapa.
4. Usuario visualiza as colunas e cards.

### Regras associadas

- cada ordem pertence a uma etapa por vez.
- cards devem exibir dados minimos para identificacao rapida.

## Caso de uso 04 - Mover ordem no kanban

### Objetivo

Atualizar o andamento da ordem no processo produtivo.

### Fluxo principal

1. Usuario seleciona uma ordem.
2. Usuario move a ordem para outra etapa.
3. Sistema valida a transicao.
4. Sistema salva o novo status.
5. Sistema registra historico da mudanca.

### Excecoes

- transicao invalida
- usuario sem permissao
- ordem bloqueada

## Caso de uso 05 - Importar ordem do ERP Flex pela extensao

### Objetivo

Criar uma Ordem de Producao no sistema a partir dos dados ja existentes no ERP Flex.

### Atores

- PCP
- administrador

### Pre-condicoes

- usuario esta logado no ERP Flex.
- usuario possui acesso a pagina da ordem no ERP.
- extensao esta instalada e habilitada.
- usuario esta autenticado no sistema destino ou a extensao possui sessao valida para a API do sistema.

### Fluxo principal

1. Usuario abre a ordem no ERP Flex.
2. Usuario clica na extensao.
3. Extensao identifica a pagina e coleta os dados da ordem.
4. Extensao exibe confirmacao ou resumo dos dados coletados.
5. Extensao envia os dados para a API do sistema.
6. Sistema valida os dados recebidos.
7. Sistema verifica duplicidade.
8. Sistema cria a Ordem de Producao.
9. Sistema retorna sucesso com o identificador interno.
10. Extensao informa ao usuario que a ordem foi importada.

### Pos-condicoes

- ordem criada no sistema
- origem registrada como ERP Flex
- numero da ordem do ERP associado ao registro

### Excecoes

- pagina nao reconhecida pela extensao
- dados obrigatorios nao encontrados
- sessao invalida na API destino
- ordem ja importada anteriormente
- falha de rede
- mudanca no layout do ERP que impeca a coleta

## Caso de uso 06 - Evitar duplicidade na importacao

### Objetivo

Garantir que a mesma ordem do ERP nao gere multiplos registros indevidos.

### Fluxo principal

1. Sistema recebe pedido de importacao.
2. Sistema procura ordem existente pelo identificador externo.
3. Se ja existir, sistema retorna resposta de duplicidade controlada.
4. Extensao informa ao usuario que a ordem ja esta cadastrada.

## Caso de uso 07 - Consultar detalhes da ordem

### Objetivo

Permitir que o usuario veja todas as informacoes relevantes da ordem.

### Fluxo principal

1. Usuario abre uma ordem no kanban ou lista.
2. Sistema apresenta dados completos da ordem.
3. Sistema apresenta historico de mudancas e origem da ordem.

## Caso de uso 08 - Auditar origem da ordem

### Objetivo

Permitir rastrear se a ordem foi criada manualmente ou importada.

### Fluxo principal

1. Usuario acessa os detalhes da ordem.
2. Sistema exibe origem.
3. Quando a origem for ERP Flex, sistema exibe identificador externo e data/hora da importacao.

## Jornada principal do MVP

1. Login no sistema.
2. Abertura do kanban.
3. Importacao de ordem do ERP Flex.
4. Visualizacao da ordem no quadro.
5. Movimentacao da ordem conforme o processo.
