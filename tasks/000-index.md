# Backlog unico do projeto

## Resumo do projeto

Projeto reduzido para as stacks ativas `front-end` (React/Vite) e `backend`, preparando o terreno para a futura extensao de navegador que importara dados do ERP Flex para o kanban de Ordem de Producao.

## Perfil do projeto

- stack web escolhida: front-end
- mobile: nao

## Classificacao do design-system por stack

- front: artefato documental com print derivado para popup da extensao
- fonte primaria visual front: `design-system/front/README.md` e `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- mobile: nao se aplica
- fonte primaria visual mobile: nao se aplica

## Review consolidada da spec

- permissoes definidas: usuarios autenticados criam, importam e movem ordens; consulta segue sessao autenticada do sistema.
- casos de erro mapeados: auth ausente, payload invalido, lista vazia, ordem nao encontrada, duplicidade por ERP, falha de rede, pagina ERP nao suportada, DOM incompleto, transicao de status invalida.
- decisoes humanas pendentes de confirmacao: etapa inicial padrao do kanban; chave externa oficial do ERP Flex; padrao real de URL/pagina suportada no ERP.
- casos de borda relevantes: importacao repetida, campos opcionais ausentes, strings com formatacao irregular do ERP, refresh apos importacao, ordem sem observacao, click duplicado na extensao.

## Arquivos analisados

- `AGENTS.md`
- `GUIDE.md`
- `requirements/...`
- `design-system/front/...`
- `contracts/openapi.yaml`
- `front-end/docs/ai/...`
- `backend/docs/ai/...`

## Premissas adotadas

- backlog unico em `tasks/`
- contrato central em `contracts/openapi.yaml`
- `next-js` e `mobile` nao fazem mais parte da estrutura ativa do repositorio
- a extensao de navegador sera tratada como componente complementar do produto dentro do backlog raiz
- o cadastro manual continuara existindo mesmo com a importacao ERP

## Principais riscos e ambiguidades

- O backend e o contrato ainda contem um endpoint legado relacionado a mobile, que nao foi removido nesta limpeza documental.
- O contrato, o backend base, a interface web, o endpoint de importacao ERP e a extensao MVP foram definidos; a task 006 deixou a rastreabilidade tecnica pronta, mas a validacao ponta a ponta com o ERP real segue pendente.
- A popup da extensao recebeu nova referencia visual via print aprovado; a change request 005 cobre esse ajuste antes do fechamento operacional definitivo.
- Um ajuste posterior de ergonomia visual e acoes da engrenagem foi aberto na change request 006 para refinar a popup ja alinhada ao print.
- A captura real de dados no ERP Flex depende de discovery tecnico na pagina real do ERP.
- A comunicacao entre popup e `content-script` pode falhar em abas abertas antes do reload da extensao; a change request 009 cobre reinjecao automatica e feedback operacional melhor.
- A pagina real do ERP usada na captura e uma listagem de varias OPs; a change request 010 adapta a popup para selecao individual com foco no `Codigo`.
- O periodo de emissao do ERP influencia diretamente a quantidade de OPs retornadas; a change request 011 expõe esse intervalo na extensao e permite sobrescreve-lo.
- O seletor nativo de OPs abre um painel grande demais com muitos itens; a change request 012 troca isso por um dropdown compacto controlado pela popup.
- O ajuste recente da popup introduziu overflow horizontal; a change request 013 corrige a largura util do container principal.
- A popup ainda precisa de contenção visual mais rígida e de um período inicial útil; a change request 014 fecha esses dois pontos.
- O último ajuste de largura colapsou a popup; a change request 015 restaura uma largura estável sem reabrir o overflow principal.
- O cliente tambem precisa aparecer na revisão da OP; a change request 016 adiciona esse dado na captura e na popup.
- A extensao ainda usa um placeholder de marca; a change request 017 aplica `logo.png` como icone nativo e no cabeçalho da popup.
- O cabeçalho da popup ainda precisa seguir a composição visual da marca enviada em print; a change request 018 ajusta logo e textos empilhados.
- O fluxo de rastreabilidade ainda usa um traço neutro; a change request 019 troca isso por uma seta central apontando para a direita.
- O card de rastreabilidade ainda precisa de ajuste fino de proporção; a change request 020 refina o espaçamento entre origem, seta e destino, agora com logos reais nos dois nós.
- As configurações técnicas ainda estão expostas demais no painel da engrenagem; a change request 021 move isso para uma seção avançada.
- O CSS da popup ainda está anulando `hidden` em alguns painéis; a change request 022 corrige esse comportamento.
- A configuração avançada ainda precisa sair da popup principal; a change request 023 move isso para uma página interna da extensão acionada pela engrenagem.
- A popup ainda precisa do redesenho visual pedido pelo usuário; a change request 024 aplica layout lateral e paleta escura.
- A engrenagem ainda está ambígua para o usuário final; a change request 025 simplifica o clique para abrir diretamente a configuração da API.
- O cabeçalho da configuração avançada ainda precisa de melhor composição; a change request 026 alinha o botão de voltar na extremidade direita.
- A popup principal ainda carrega referências órfãs a um botão removido; a change request 027 limpa esse resíduo para eliminar erro em runtime.
- O fluxo da popup ainda nao explicita a etapa de analise para puxar as OPs do ERP; a change request 028 separa essa acao antes da criacao no kanban.
- A popup ainda pode quebrar quando o script tenta controlar botoes removidos do HTML; a change request 029 blinda esse controle de estado.
- A tela avancada ainda precisa reposicionar a seta de voltar para o inicio do cabeçalho; a change request 030 aplica esse ajuste visual.

## Estrategia de execucao

- Manter a governanca raiz.
- Comecar por contrato e modelo compartilhado.
- Implementar backend base e front-end base do dominio de Ordem de Producao.
- Adicionar o endpoint de importacao ERP no backend.
- Entregar a extensao de navegador como ponte operacional para a API.
- Fechar com rastreabilidade e validacao fim a fim.

## Tasks por tipo

### Shared

- [done] `tasks/change-requests/003-limpar-documentacao-pos-reducao-de-stacks.md` - Ajustar governanca e backlog para o perfil atual `front-end + backend`.
- [done] `tasks/change-requests/004-detalhar-requisitos-do-sistema.md` - Criar a base detalhada de requisitos do sistema e da integracao com ERP Flex.
- [blocked] `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md` - Alinhar a popup da extensao ao print aprovado de importacao ERP.
- [blocked] `tasks/change-requests/006-ajustar-largura-da-popup-e-ampliar-funcoes-da-engrenagem.md` - Aumentar a largura da popup e ampliar as funcoes acessiveis pela engrenagem.
- [done] `tasks/change-requests/007-definir-contrato-api-para-sistema-destino-da-extensao.md` - Definir contrato OpenAPI inicial para o sistema destino que recebera dados da extensao.
- [blocked] `tasks/change-requests/008-priorizar-captura-por-endpoint-json-do-erp-flex.md` - Priorizar captura estruturada do endpoint JSON do ERP Flex com fallback para DOM.
- [blocked] `tasks/change-requests/009-tornar-captura-da-extensao-resiliente-sem-receiver-na-aba.md` - Tornar a captura da extensao resiliente quando a aba ativa estiver sem receiver carregado.
- [blocked] `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md` - Suportar listagem de OPs na popup com selecao individual e destaque do codigo.
- [blocked] `tasks/change-requests/011-expor-e-permitir-ajuste-do-periodo-de-emissao-na-extensao.md` - Expor e permitir ajuste do periodo de emissao usado pela captura da extensao.
- [blocked] `tasks/change-requests/012-substituir-seletor-nativo-por-dropdown-compacto-de-ops.md` - Substituir o seletor nativo por um dropdown compacto de OPs.
- [blocked] `tasks/change-requests/013-corrigir-overflow-horizontal-da-popup.md` - Corrigir overflow horizontal da popup da extensao.
- [blocked] `tasks/change-requests/014-conter-largura-da-popup-e-inicializar-periodo-no-mes-atual.md` - Conter a largura da popup e inicializar o periodo no mes atual.
- [blocked] `tasks/change-requests/015-restaurar-largura-estavel-da-popup-sem-colapso.md` - Restaurar largura estavel da popup sem colapso.
- [blocked] `tasks/change-requests/016-exibir-cliente-na-captura-da-extensao.md` - Exibir cliente na captura da extensao.
- [blocked] `tasks/change-requests/017-aplicar-logo-do-produto-como-icone-da-extensao.md` - Aplicar a logo do produto como icone da extensao.
- [blocked] `tasks/change-requests/018-ajustar-cabecalho-da-popup-para-logo-e-marca-empilhada.md` - Ajustar o cabeçalho da popup para logo e marca empilhada.
- [blocked] `tasks/change-requests/019-ajustar-divisor-de-rastreabilidade-para-seta-central.md` - Ajustar o divisor de rastreabilidade para uma seta central.
- [blocked] `tasks/change-requests/020-refinar-espacamento-do-card-de-rastreabilidade.md` - Refinar o espaçamento do card de rastreabilidade.
- [blocked] `tasks/change-requests/021-mover-configuracoes-tecnicas-para-secao-avancada-na-engrenagem.md` - Mover configurações técnicas para uma seção avançada na engrenagem.
- [blocked] `tasks/change-requests/022-corrigir-respeito-ao-hidden-nos-paineis-da-popup.md` - Corrigir o respeito ao atributo `hidden` nos painéis da popup.
- [blocked] `tasks/change-requests/023-mover-configuracao-avancada-para-pagina-interna-da-extensao.md` - Mover configuração avançada para página interna da extensão.
- [blocked] `tasks/change-requests/024-redesenhar-popup-com-layout-lateral-e-paleta-escura.md` - Redesenhar a popup com layout lateral e paleta escura.
- [blocked] `tasks/change-requests/025-fazer-engrenagem-abrir-diretamente-a-configuracao-da-api.md` - Fazer a engrenagem abrir diretamente a configuracao da API.
- [blocked] `tasks/change-requests/026-alinhar-botao-de-voltar-a-direita-no-cabecalho-avancado.md` - Alinhar o botao de voltar a direita no cabecalho da configuracao avancada.
- [blocked] `tasks/change-requests/027-remover-referencias-orfas-ao-botao-de-pagina-capturada.md` - Remover referencias orfas ao botao de pagina capturada.
- [done] `tasks/change-requests/028-adicionar-botao-de-fazer-analise-para-buscar-ops-do-erp.md` - Adicionar botao explicito de analise para puxar as OPs da pagina atual do ERP.
- [done] `tasks/change-requests/029-corrigir-null-reference-na-popup-ao-controlar-botoes-ausentes.md` - Corrigir null reference na popup ao controlar botoes ausentes.
- [done] `tasks/change-requests/030-mover-seta-de-voltar-para-o-canto-esquerdo-da-configuracao-avancada.md` - Mover a seta de voltar para o canto esquerdo da configuracao avancada.
- [done] `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md` - Definir contrato OpenAPI e modelo funcional do MVP de Ordem de Producao.
- [done] `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md` - Criar a extensao MVP para importar ordens do ERP Flex.
- [blocked] `tasks/006-fechar-fluxo-de-rastreabilidade-e-validacao-fim-a-fim.md` - Consolidar rastreabilidade da origem ERP e validar o fluxo ponta a ponta.

### Front

- [done] `tasks/003-implementar-front-end-de-ordem-de-producao-e-kanban.md` - Implementar listagem, criacao manual, detalhe e quadro kanban no React/Vite.

### Back

- [done] `tasks/002-implementar-backend-de-ordem-de-producao.md` - Implementar modulo backend de Ordem de Producao, endpoints base e historico.
- [done] `tasks/004-implementar-importacao-erp-flex-no-backend.md` - Implementar endpoint de importacao ERP com validacao e deduplicacao.

### Mobile

- Nao se aplica

## Status inicial

- Estrutura ativa consolidada em `front-end` e `backend`.
- Task 001 - done
- Task 002 - done
- Task 003 - done
- Task 004 - done
- Task 005 - done
- Task 006 - blocked

## Dependencias cruzadas

- `tasks/change-requests/003-limpar-documentacao-pos-reducao-de-stacks.md`: removeu backlog e documentacao que dependiam de `next-js` e `mobile` ja excluidos da estrutura.
- `tasks/change-requests/004-detalhar-requisitos-do-sistema.md`: estabelece a base funcional e nao funcional para planejar backlog do MVP.
- `tasks/002-implementar-backend-de-ordem-de-producao.md`: depende de `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md`.
- `tasks/003-implementar-front-end-de-ordem-de-producao-e-kanban.md`: depende de `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md` e `tasks/002-implementar-backend-de-ordem-de-producao.md`.
- `tasks/004-implementar-importacao-erp-flex-no-backend.md`: depende de `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md` e `tasks/002-implementar-backend-de-ordem-de-producao.md`.
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`: depende de `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md` e `tasks/004-implementar-importacao-erp-flex-no-backend.md`.
- `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md`: depende de `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md` e deve anteceder o fechamento manual definitivo da `tasks/006-fechar-fluxo-de-rastreabilidade-e-validacao-fim-a-fim.md`.
- `tasks/change-requests/006-ajustar-largura-da-popup-e-ampliar-funcoes-da-engrenagem.md`: depende de `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md` e refina a ergonomia final da popup da extensao.
- `tasks/006-fechar-fluxo-de-rastreabilidade-e-validacao-fim-a-fim.md`: depende de `tasks/003-implementar-front-end-de-ordem-de-producao-e-kanban.md`, `tasks/004-implementar-importacao-erp-flex-no-backend.md` e `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`.
- `tasks/change-requests/009-tornar-captura-da-extensao-resiliente-sem-receiver-na-aba.md`: depende de `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md` e refina a confiabilidade operacional do fluxo de captura real apos o ajuste da change request 008.
- `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md`: depende de `tasks/change-requests/008-priorizar-captura-por-endpoint-json-do-erp-flex.md` e `tasks/change-requests/009-tornar-captura-da-extensao-resiliente-sem-receiver-na-aba.md`, adaptando a popup ao cenario real de lista do ERP.
- `tasks/change-requests/011-expor-e-permitir-ajuste-do-periodo-de-emissao-na-extensao.md`: depende de `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md` e refina a captura de lista com controle explicito de periodo.
- `tasks/change-requests/012-substituir-seletor-nativo-por-dropdown-compacto-de-ops.md`: depende de `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md` e `tasks/change-requests/011-expor-e-permitir-ajuste-do-periodo-de-emissao-na-extensao.md`, refinando a usabilidade do seletor de OPs em listas longas.
- `tasks/change-requests/013-corrigir-overflow-horizontal-da-popup.md`: depende de `tasks/change-requests/011-expor-e-permitir-ajuste-do-periodo-de-emissao-na-extensao.md` e `tasks/change-requests/012-substituir-seletor-nativo-por-dropdown-compacto-de-ops.md`, ajustando a largura util apos os refinamentos recentes.
- `tasks/change-requests/014-conter-largura-da-popup-e-inicializar-periodo-no-mes-atual.md`: depende de `tasks/change-requests/011-expor-e-permitir-ajuste-do-periodo-de-emissao-na-extensao.md` e `tasks/change-requests/013-corrigir-overflow-horizontal-da-popup.md`, refinando a popup para conter largura e preencher o periodo inicial.
- `tasks/change-requests/015-restaurar-largura-estavel-da-popup-sem-colapso.md`: depende de `tasks/change-requests/014-conter-largura-da-popup-e-inicializar-periodo-no-mes-atual.md` e corrige a regressao de largura introduzida no ajuste anterior.
- `tasks/change-requests/016-exibir-cliente-na-captura-da-extensao.md`: depende de `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md` e adiciona mais contexto operacional ao resumo da OP.
- `tasks/change-requests/017-aplicar-logo-do-produto-como-icone-da-extensao.md`: depende de `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md` e alinha a marca da extensao ao ativo visual do produto.
- `tasks/change-requests/018-ajustar-cabecalho-da-popup-para-logo-e-marca-empilhada.md`: depende de `tasks/change-requests/017-aplicar-logo-do-produto-como-icone-da-extensao.md` e refina a composição visual do cabeçalho da popup.
- `tasks/change-requests/019-ajustar-divisor-de-rastreabilidade-para-seta-central.md`: depende de `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md` e refina a legibilidade do fluxo de origem para destino.
- `tasks/change-requests/020-refinar-espacamento-do-card-de-rastreabilidade.md`: depende de `tasks/change-requests/019-ajustar-divisor-de-rastreabilidade-para-seta-central.md` e ajusta a proporção visual do card.
- `tasks/change-requests/021-mover-configuracoes-tecnicas-para-secao-avancada-na-engrenagem.md`: depende de `tasks/change-requests/006-ajustar-largura-da-popup-e-ampliar-funcoes-da-engrenagem.md` e reorganiza o painel da engrenagem para priorizar o uso operacional.
- `tasks/change-requests/022-corrigir-respeito-ao-hidden-nos-paineis-da-popup.md`: depende de `tasks/change-requests/021-mover-configuracoes-tecnicas-para-secao-avancada-na-engrenagem.md` e corrige a aplicação visual do estado recolhido.
- `tasks/change-requests/023-mover-configuracao-avancada-para-pagina-interna-da-extensao.md`: depende de `tasks/change-requests/021-mover-configuracoes-tecnicas-para-secao-avancada-na-engrenagem.md` e `tasks/change-requests/022-corrigir-respeito-ao-hidden-nos-paineis-da-popup.md`, movendo a configuração técnica para uma página própria.
- `tasks/change-requests/024-redesenhar-popup-com-layout-lateral-e-paleta-escura.md`: depende de `tasks/change-requests/023-mover-configuracao-avancada-para-pagina-interna-da-extensao.md` e aplica a nova direção visual da popup principal.
- `tasks/change-requests/025-fazer-engrenagem-abrir-diretamente-a-configuracao-da-api.md`: depende de `tasks/change-requests/024-redesenhar-popup-com-layout-lateral-e-paleta-escura.md` e simplifica a engrenagem para navegação direta à tela avançada.
- `tasks/change-requests/026-alinhar-botao-de-voltar-a-direita-no-cabecalho-avancado.md`: depende de `tasks/change-requests/025-fazer-engrenagem-abrir-diretamente-a-configuracao-da-api.md` e refina a composição do cabeçalho da tela avançada.
- `tasks/change-requests/027-remover-referencias-orfas-ao-botao-de-pagina-capturada.md`: depende de `tasks/change-requests/025-fazer-engrenagem-abrir-diretamente-a-configuracao-da-api.md` e remove resíduos técnicos deixados pela simplificação da engrenagem.
- `tasks/change-requests/028-adicionar-botao-de-fazer-analise-para-buscar-ops-do-erp.md`: depende de `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md` e `tasks/change-requests/027-remover-referencias-orfas-ao-botao-de-pagina-capturada.md`, separando explicitamente a etapa de analise da etapa de criacao da OP no kanban.
- `tasks/change-requests/029-corrigir-null-reference-na-popup-ao-controlar-botoes-ausentes.md`: depende de `tasks/change-requests/028-adicionar-botao-de-fazer-analise-para-buscar-ops-do-erp.md` e corrige a regressao de runtime deixada por referencias a controles opcionais removidos.
- `tasks/change-requests/030-mover-seta-de-voltar-para-o-canto-esquerdo-da-configuracao-avancada.md`: depende de `tasks/change-requests/026-alinhar-botao-de-voltar-a-direita-no-cabecalho-avancado.md` e inverte essa decisao visual para atender o novo posicionamento pedido pelo usuario.

## Duvidas para validacao humana

- Confirmar em task futura se o endpoint legado de check de versao mobile deve ser removido do backend e do contrato.
- Validar os campos reais disponiveis no ERP Flex para importacao.
- Confirmar qual etapa inicial do kanban deve ser usada para ordens importadas.
- Confirmar qual identificador do ERP sera usado como chave oficial anti-duplicidade.

## Observacoes finais

- O backlog atual esta pronto para execucao incremental do MVP ERP Flex -> kanban seguindo a ordem 001 -> 002 -> 003/004 -> 005 -> 006.
