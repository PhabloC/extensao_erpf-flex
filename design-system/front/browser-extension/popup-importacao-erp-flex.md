# Referencia visual - Popup da extensao ERP Flex

## Origem da referencia

- print enviado pelo usuario na conversa em `2026-06-05`
- artefato derivado registrado no repositorio para orientar backlog e implementacao

## Tela governada

- popup principal da extensao de navegador para importacao de OP do ERP Flex para o kanban

## Estado coberto pelo print

- ordem carregada com dados capturados da pagina
- mapeamento validado com sucesso
- CTA principal habilitado para criacao da OP
- CTA secundaria disponivel para revisao dos dados

## Estrutura visual obrigatoria observada

- cabecalho compacto com icone, titulo `Importar OP para Kanban` e acao de configuracoes
- card principal branco com cantos arredondados e sombra suave
- secao `Dados capturados desta pagina` com pares rotulo/valor em lista vertical
- bloco de status positivo com copy `Variacao encontrada`
- faixa de rastreabilidade com `Origem: ERP Flex` e `Destino: Quadro Kanban`
- botao primario azul `Criar OP no Kanban`
- botao secundario neutro `Revisar dados`

## Dados visiveis no print

- OP: `OP-12345`
- Produto ERP: `CAMISETA POLO AZUL P`
- Produto base: `CAMISETA POLO`
- Variacoes: `Cor: Azul | Tamanho: P`
- Quantidade: `100`
- Prazo: `10/06/2026`

## Diretrizes de fidelidade

- preservar hierarquia visual compacta e orientada a conferencia rapida
- manter CTA principal com maior peso visual que a acao secundaria
- manter linguagem de transicao explicita entre origem ERP e destino kanban
- evitar reinterpretacao para layout de dashboard web; o contexto e popup de extensao

## Lacunas nao cobertas pelo print

- estados de loading
- estados de erro
- estado de duplicidade
- estado com campos obrigatorios ausentes
- comportamento da acao `Revisar dados`
- fluxo da tela de configuracoes

## Decisao para lacunas

- os estados nao cobertos devem seguir a mesma linguagem do print, sem criar layout paralelo
- qualquer comportamento novo deve ser documentado na task correspondente antes da implementacao

## Ajuste derivado posterior

- print complementar enviado pelo usuario em `2026-06-05` mostrou a popup ja implementada e pediu:
  - aumento moderado da largura util
  - painel da engrenagem com funcoes operacionais adicionais

## Diretriz complementar

- a popup pode ganhar alguns pixels de largura para melhorar legibilidade sem perder carater compacto de extensao
- o botao de engrenagem deve abrir um painel de acoes uteis, e nao apenas campos de configuracao
- as novas funcoes devem ser curtas, claras e diretamente relacionadas a revisao da captura ou ao suporte operacional da extensao

## Ajuste derivado para pagina de listagem

- a pagina real do ERP pode exibir varias OPs simultaneamente em grid
- nesses casos, a popup deve manter o layout compacto, mas pode incluir um dropdown curto de ordens encontradas acima do resumo principal
- o campo `Codigo` deve aparecer no bloco principal de dados capturados, com peso equivalente aos demais campos de conferencia
- a importacao continua individual, baseada na ordem atualmente selecionada na popup
- quando houver muitas OPs, a lista deve abrir dentro da popup com altura limitada e scroll interno

## Ajuste derivado para periodo

- a popup pode exibir um bloco compacto de `Periodo de emissao` acima da lista de ordens
- esse bloco deve mostrar `Emissao de` e `Emissao ate` como campos editaveis
- o ajuste do periodo e operacional e nao deve competir visualmente com a CTA principal

## Ajuste derivado para layout lateral

- uma direção visual posterior passou a adotar paleta azul escura e estrutura com barra lateral
- a engrenagem pode ficar em coluna lateral dedicada, em vez de no cabeçalho superior
- o arredondamento geral deve ser reduzido em relação às versões anteriores
- os cards internos podem permanecer destacados, mas com cantos mais contidos e contraste alinhado à base escura
