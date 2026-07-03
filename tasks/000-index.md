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
- Os campos complementares `SC2_Campo1` a `SC2_Campo30` do endpoint passaram a ser unificados e exibidos na popup; a change request 031 concluiu esse ajuste.
- A quantidade `SC2_Quant` ainda pode chegar com separador de milhar ambiguo; a change request 032 normaliza esse parsing, evita quebra visual da unidade na popup e força reinjecao do coletor atualizado quando a aba estiver com script antigo.
- Quando o endpoint do ERP retorna varias OPs, a extensao ainda pode assumir automaticamente o registro errado; a change request 033 torna a auto-selecao conservadora e exige escolha manual quando o match for ambiguo.
- A quantidade na popup ainda estava seguindo a heuristica errada de milhar e misturando unidade na mesma linha; a change request 034 adapta o parsing ao padrao real do ERP e separa `Unidade de Medida`.
- A criacao da OP na popup ainda carece de confirmacao final, blindagem contra clique duplo e tratamento visual claro de erro/sucesso; a change request 035 cobre esse fechamento operacional.
- A barra lateral da popup ainda so expunha a engrenagem; a change request 036 adiciona o atalho para a pagina interna de logs e a trilha operacional local da extensao.
- Os botoes da barra lateral ainda estavam centralizados verticalmente; a change request 037 alinha esses atalhos no topo da popup.
- A pagina interna de logs ainda mistura eventos operacionais gerais; a change request 038 restringe a listagem ao historico de criacao de OP.
- A extensao ainda envia campos top-level fora do contrato de importacao ERP; a change request 039 alinha o payload ao schema aceito pela API para evitar `Request payload is invalid.` em ambientes com validacao estrita.
- A pagina de logs ainda nao destaca falhas de forma suficientemente obvia; a change request 040 reforca a leitura imediata dos eventos de erro.
- A integracao em producao ainda pode devolver erros de variacao em ingles e com diagnostico fraco; a change request 041 traduz esses retornos e adiciona uma tentativa compativel com variacoes.
- A configuracao avancada ainda nao permite conferir visualmente a senha digitada; a change request 042 adiciona o controle de olho para exibir ou ocultar esse valor.
- A configuracao avancada ainda exige digitacao repetitiva da URL da API; a change request 043 adiciona presets prontos para local e producao.
- O modo alternativo de consulta do ERP ainda pode devolver OP valida no endpoint e mesmo assim ser rejeitado pela heuristica de pagina suportada; a change request 044 corrige essa deteccao.
- Quando o modo alternativo do ERP devolve apenas uma OP, a heuristica ainda pode deixar a popup sem selecao principal; a change request 045 fecha essa auto-selecao.
- O fluxo de analise ainda carece de visibilidade sobre o retorno bruto do coletor; a change request 046 expõe diagnostico operacional na popup e nos logs.
- A configuracao avancada ainda permite editar manualmente a URL da API; a change request 047 restringe a troca aos presets de ambiente.
- O campo readonly da URL ainda parece editavel no hover; a change request 048 ajusta cursor e contraste desse estado.
- O dropdown de ordens ainda exige rolagem manual em listas longas; a change request 049 adiciona busca digitada sem remover a selecao compacta atual.
- O feedback visual da popup ainda exibe detalhes tecnicos demais acima das acoes principais; a change request 050 remove esse bloco e preserva o diagnostico apenas nos logs.
- A acao de analise ainda ocupa um botao textual no rodape; a change request 051 move esse acionamento para um icone de refresh no cabecalho.
- O `409` da importacao ERP agora representa apenas conflito com OP ativa para o mesmo `externalOrderId`; a change request 052 atualiza a copy da extensao para refletir essa nova regra sem alterar payload.
- O contrato local, a extensao e o backend deste repositorio ainda precisavam convergir para a regra atual da API sobre `externalOrderId` reutilizavel apos encerramento e campos recomendados aceitos; a change request 053 consolidou esse alinhamento no que o modelo local suporta.
- A popup ainda importa apenas uma OP por vez e nao consegue atualizar seletivamente conflitos de OP ativa; a change request 054 adiciona selecao multipla e atualizacao confirmada por item.
- A regra operacional mudou novamente: a importacao nao deve mais parar em duplicidade, e cada OP enviada deve resultar diretamente em criacao ou atualizacao; a change request 055 simplifica esse fluxo.
- O time da API ainda precisa receber um resumo operacional consolidado fora do OpenAPI cru; a change request 056 gera esse documento em Markdown para compartilhamento direto.
- A tela de logs ainda pode exibir mensagens legadas em ingles vindas da API; a change request 057 padroniza esse historico em portugues.
- A extensao ainda nao tinha uma politica de privacidade alinhada ao comportamento real implementado; a change request 059 cria esse documento para apoiar publicacao e transparencia operacional.
- O manifesto da extensao ainda pedia acesso obrigatorio amplo a todos os hosts HTTP e HTTPS; a change request 060 restringe esse escopo para melhorar a publicabilidade na Chrome Web Store.

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
- [done] `tasks/change-requests/031-exibir-campos-sc2-unificados-na-extensao.md` - Exibir campos SC2_Campo1 a SC2_Campo30 unificados em uma linha na extensao.
- [done] `tasks/change-requests/032-corrigir-leitura-de-quantidade-com-milhar-na-extensao.md` - Corrigir leitura de quantidade com milhar na extensao.
- [done] `tasks/change-requests/033-evitar-auto-selecao-incorreta-de-op-na-extensao.md` - Evitar auto-selecao incorreta de OP quando a analise retornar varias ordens.
- [done] `tasks/change-requests/034-separar-unidade-da-quantidade-na-popup-e-tratar-000-como-casas-decimais.md` - Separar unidade da quantidade na popup e tratar `,000`/`.000` como casas decimais.
- [done] `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md` - Adicionar confirmacao final, bloqueio de clique duplo e feedback claro na criacao da OP pelo popup da extensao.
- [done] `tasks/change-requests/036-adicionar-botao-lateral-e-pagina-interna-de-logs-na-extensao.md` - Adicionar atalho lateral para logs e pagina interna de historico operacional da extensao.
- [done] `tasks/change-requests/037-alinhar-botoes-da-barra-lateral-no-topo-da-popup.md` - Alinhar os botoes da barra lateral no topo da popup.
- [done] `tasks/change-requests/038-filtrar-pagina-de-logs-para-criacao-de-op.md` - Restringir a pagina interna de logs para exibir apenas eventos ligados a criacao de OP.
- [done] `tasks/change-requests/039-alinhar-payload-da-extensao-ao-contrato-de-importacao.md` - Alinhar o payload da extensao ao schema aceito pela API de importacao ERP.
- [done] `tasks/change-requests/040-destacar-erros-na-pagina-de-logs-da-extensao.md` - Destacar de forma mais clara os eventos de erro na pagina de logs da extensao.
- [done] `tasks/change-requests/041-traduzir-erros-da-importacao-e-tentar-compatibilidade-com-variacoes.md` - Traduzir erros da importacao para PT-BR e tentar um reenvio compativel quando a API reclamar de variacao.
- [done] `tasks/change-requests/042-adicionar-atalho-visual-para-exibir-ou-ocultar-senha-na-configuracao-avancada.md` - Adicionar o controle de olho para exibir ou ocultar a senha na configuracao avancada.
- [done] `tasks/change-requests/043-predefinir-urls-de-api-local-e-producao-na-configuracao-avancada.md` - Predefinir URLs de API local e producao na configuracao avancada.
- [done] `tasks/change-requests/044-aceitar-modo-alternativo-do-erp-quando-endpoint-retornar-ops-validas.md` - Aceitar modo alternativo do ERP quando o endpoint retornar OPs validas.
- [done] `tasks/change-requests/045-auto-selecionar-op-unica-retornada-pelo-endpoint-do-erp.md` - Auto-selecionar OP unica retornada pelo endpoint do ERP.
- [done] `tasks/change-requests/046-expor-diagnostico-da-analise-do-erp-nos-logs-da-popup.md` - Expor diagnostico da analise do ERP nos logs da popup.
- [done] `tasks/change-requests/047-tornar-url-da-api-somente-leitura-com-selecao-por-presets.md` - Tornar URL da API somente leitura com selecao por presets.
- [done] `tasks/change-requests/048-diferenciar-visualmente-o-input-readonly-da-url-da-api.md` - Diferenciar visualmente o input readonly da URL da API.
- [done] `tasks/change-requests/049-permitir-busca-digitada-no-dropdown-de-ops-da-extensao.md` - Permitir busca digitada no dropdown de OPs da extensao.
- [done] `tasks/change-requests/050-remover-detalhes-tecnicos-do-feedback-visual-da-popup.md` - Remover detalhes tecnicos do feedback visual da popup.
- [done] `tasks/change-requests/051-mover-acao-de-analise-para-icone-de-refresh-no-cabecalho.md` - Mover acao de analise para icone de refresh no cabecalho.
- [done] `tasks/change-requests/052-ajustar-feedback-da-extensao-para-409-de-op-ativa.md` - Ajustar o feedback da extensao para tratar `409` como conflito com OP ativa.
- [done] `tasks/change-requests/053-alinhar-contrato-backend-e-extensao-a-regra-atual-da-importacao-erp-flex.md` - Alinhar contrato, backend e extensao a regra atual da importacao ERP Flex.
- [done] `tasks/change-requests/054-suportar-multiplas-ops-e-atualizacao-seletiva-de-ops-ativas-na-extensao.md` - Permitir selecao multipla de OPs e atualizacao seletiva de conflitos ativos na extensao.
- [done] `tasks/change-requests/055-eliminar-fluxo-de-duplicidade-na-importacao-da-extensao.md` - Simplificar a importacao para retornar apenas criacao ou atualizacao.
- [done] `tasks/change-requests/056-documentar-contrato-operacional-da-api-para-a-extensao-erp-flex.md` - Consolidar em Markdown o que a API precisa suportar para a extensao.
- [done] `tasks/change-requests/057-traduzir-logs-da-extensao-para-portugues.md` - Padronizar as mensagens de log da extensao em portugues.
- [done] `tasks/change-requests/058-restaurar-confirmacao-de-atualizacao-para-ops-ativas-na-extensao.md` - Restaurar confirmacao explicita antes de atualizar OPs ativas na importacao da extensao.
- [done] `tasks/change-requests/059-criar-politica-de-privacidade-para-a-extensao.md` - Documentar a politica de privacidade da extensao com base nos dados realmente tratados hoje.
- [done] `tasks/change-requests/060-restringir-permissoes-da-extensao-para-publicacao-na-chrome-web-store.md` - Reduzir as permissoes do manifesto para o minimo coerente com o fluxo atual.
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
- `tasks/change-requests/031-exibir-campos-sc2-unificados-na-extensao.md`: depende de `tasks/change-requests/008-priorizar-captura-por-endpoint-json-do-erp-flex.md`, `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md` e `tasks/change-requests/016-exibir-cliente-na-captura-da-extensao.md`, adicionando observacoes unificadas dos campos `SC2_Campo1` a `SC2_Campo30` na popup da extensao.
- `tasks/change-requests/032-corrigir-leitura-de-quantidade-com-milhar-na-extensao.md`: depende de `tasks/change-requests/031-exibir-campos-sc2-unificados-na-extensao.md` e corrige o parsing de `SC2_Quant` quando o ERP devolve milhar com separador ambiguo, preservando a leitura compacta da unidade na popup.
- `tasks/change-requests/033-evitar-auto-selecao-incorreta-de-op-na-extensao.md`: depende de `tasks/change-requests/032-corrigir-leitura-de-quantidade-com-milhar-na-extensao.md` e impede que a popup assuma uma OP arbitraria quando o endpoint retorna varias ordens sem match confiavel com a tela atual.
- `tasks/change-requests/034-separar-unidade-da-quantidade-na-popup-e-tratar-000-como-casas-decimais.md`: depende de `tasks/change-requests/033-evitar-auto-selecao-incorreta-de-op-na-extensao.md` e ajusta a exibicao para o padrao real do ERP, em que `,000` e `.000` representam casas decimais zeradas e a unidade deve aparecer em linha propria.
- `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md`: depende de `tasks/change-requests/028-adicionar-botao-de-fazer-analise-para-buscar-ops-do-erp.md`, `tasks/change-requests/033-evitar-auto-selecao-incorreta-de-op-na-extensao.md` e `tasks/change-requests/034-separar-unidade-da-quantidade-na-popup-e-tratar-000-como-casas-decimais.md`, fechando a etapa final de criacao com confirmacao, bloqueio de reenvio e feedback operacional claro.
- `tasks/change-requests/036-adicionar-botao-lateral-e-pagina-interna-de-logs-na-extensao.md`: depende de `tasks/change-requests/024-redesenhar-popup-com-layout-lateral-e-paleta-escura.md`, `tasks/change-requests/025-fazer-engrenagem-abrir-diretamente-a-configuracao-da-api.md` e `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md`, adicionando o novo atalho lateral e a pagina interna de logs sem quebrar a navegacao existente.
- `tasks/change-requests/037-alinhar-botoes-da-barra-lateral-no-topo-da-popup.md`: depende de `tasks/change-requests/024-redesenhar-popup-com-layout-lateral-e-paleta-escura.md` e `tasks/change-requests/036-adicionar-botao-lateral-e-pagina-interna-de-logs-na-extensao.md`, refinando o posicionamento vertical da navegacao secundaria da popup.
- `tasks/change-requests/038-filtrar-pagina-de-logs-para-criacao-de-op.md`: depende de `tasks/change-requests/036-adicionar-botao-lateral-e-pagina-interna-de-logs-na-extensao.md` e `tasks/change-requests/037-alinhar-botoes-da-barra-lateral-no-topo-da-popup.md`, refinando a utilidade operacional da tela de logs com foco na criacao de OP.
- `tasks/change-requests/039-alinhar-payload-da-extensao-ao-contrato-de-importacao.md`: depende de `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md` e corrige o adaptador HTTP da extensao para respeitar estritamente o schema de importacao ERP em ambientes com `forbidNonWhitelisted`.
- `tasks/change-requests/040-destacar-erros-na-pagina-de-logs-da-extensao.md`: depende de `tasks/change-requests/036-adicionar-botao-lateral-e-pagina-interna-de-logs-na-extensao.md` e `tasks/change-requests/038-filtrar-pagina-de-logs-para-criacao-de-op.md`, refinando a apresentacao do historico para explicitar falhas de importacao.
- `tasks/change-requests/041-traduzir-erros-da-importacao-e-tentar-compatibilidade-com-variacoes.md`: depende de `tasks/change-requests/039-alinhar-payload-da-extensao-ao-contrato-de-importacao.md` e `tasks/change-requests/040-destacar-erros-na-pagina-de-logs-da-extensao.md`, refinando a integracao em producao com traducao dos erros e retry compativel orientado a variacoes.
- `tasks/change-requests/042-adicionar-atalho-visual-para-exibir-ou-ocultar-senha-na-configuracao-avancada.md`: depende de `tasks/change-requests/030-mover-seta-de-voltar-para-o-canto-esquerdo-da-configuracao-avancada.md` e adiciona o controle visual de exibicao da senha sem alterar o fluxo de autenticacao.
- `tasks/change-requests/043-predefinir-urls-de-api-local-e-producao-na-configuracao-avancada.md`: depende de `tasks/change-requests/042-adicionar-atalho-visual-para-exibir-ou-ocultar-senha-na-configuracao-avancada.md` e reduz a friccao operacional da tela avancada com presets de ambiente.
- `tasks/change-requests/044-aceitar-modo-alternativo-do-erp-quando-endpoint-retornar-ops-validas.md`: depende de `tasks/change-requests/043-predefinir-urls-de-api-local-e-producao-na-configuracao-avancada.md` e corrige o reconhecimento de pagina suportada quando o endpoint estruturado do ERP ja devolve registros validos.
- `tasks/change-requests/045-auto-selecionar-op-unica-retornada-pelo-endpoint-do-erp.md`: depende de `tasks/change-requests/044-aceitar-modo-alternativo-do-erp-quando-endpoint-retornar-ops-validas.md` e corrige a ausencia de payload principal quando o endpoint retorna uma unica OP sem pistas suficientes para score.
- `tasks/change-requests/046-expor-diagnostico-da-analise-do-erp-nos-logs-da-popup.md`: depende de `tasks/change-requests/045-auto-selecionar-op-unica-retornada-pelo-endpoint-do-erp.md` e adiciona rastreabilidade operacional do retorno de `ERP_FLEX_COLLECT_ORDER`.
- `tasks/change-requests/047-tornar-url-da-api-somente-leitura-com-selecao-por-presets.md`: depende de `tasks/change-requests/043-predefinir-urls-de-api-local-e-producao-na-configuracao-avancada.md` e restringe a troca de ambiente aos presets visuais.
- `tasks/change-requests/048-diferenciar-visualmente-o-input-readonly-da-url-da-api.md`: depende de `tasks/change-requests/047-tornar-url-da-api-somente-leitura-com-selecao-por-presets.md` e reforca visualmente o estado nao editavel do campo.
- `tasks/change-requests/049-permitir-busca-digitada-no-dropdown-de-ops-da-extensao.md`: depende de `tasks/change-requests/046-expor-diagnostico-da-analise-do-erp-nos-logs-da-popup.md` e refina a selecao manual das OPs com busca textual dentro do dropdown compacto.
- `tasks/change-requests/050-remover-detalhes-tecnicos-do-feedback-visual-da-popup.md`: depende de `tasks/change-requests/046-expor-diagnostico-da-analise-do-erp-nos-logs-da-popup.md` e recolhe da popup o bloco visual de diagnostico, mantendo os detalhes nos logs.
- `tasks/change-requests/051-mover-acao-de-analise-para-icone-de-refresh-no-cabecalho.md`: depende de `tasks/change-requests/028-adicionar-botao-de-fazer-analise-para-buscar-ops-do-erp.md` e refina a ergonomia da analise, deslocando a acao para o cabecalho da popup.
- `tasks/change-requests/052-ajustar-feedback-da-extensao-para-409-de-op-ativa.md`: depende de `tasks/change-requests/041-traduzir-erros-da-importacao-e-tentar-compatibilidade-com-variacoes.md` e atualiza a copy da extensao para a nova semantica do `409`, agora restrita a OP ativa em aberto.
- `tasks/change-requests/053-alinhar-contrato-backend-e-extensao-a-regra-atual-da-importacao-erp-flex.md`: depende de `tasks/change-requests/039-alinhar-payload-da-extensao-ao-contrato-de-importacao.md` e `tasks/change-requests/052-ajustar-feedback-da-extensao-para-409-de-op-ativa.md`, ampliando o contrato, restaurando os campos recomendados no payload principal e ajustando a deduplicacao do backend local para bloquear apenas OP ativa.
- `tasks/change-requests/054-suportar-multiplas-ops-e-atualizacao-seletiva-de-ops-ativas-na-extensao.md`: depende de `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md`, `tasks/change-requests/049-permitir-busca-digitada-no-dropdown-de-ops-da-extensao.md`, `tasks/change-requests/052-ajustar-feedback-da-extensao-para-409-de-op-ativa.md` e `tasks/change-requests/053-alinhar-contrato-backend-e-extensao-a-regra-atual-da-importacao-erp-flex.md`, adicionando selecao multipla na popup e atualizacao seletiva de OPs ativas com suporte no backend.
- `tasks/change-requests/055-eliminar-fluxo-de-duplicidade-na-importacao-da-extensao.md`: depende de `tasks/change-requests/054-suportar-multiplas-ops-e-atualizacao-seletiva-de-ops-ativas-na-extensao.md` e remove a etapa de conflito operacional, fazendo a importacao retornar diretamente criacao ou atualizacao.
- `tasks/change-requests/056-documentar-contrato-operacional-da-api-para-a-extensao-erp-flex.md`: depende de `tasks/change-requests/053-alinhar-contrato-backend-e-extensao-a-regra-atual-da-importacao-erp-flex.md` e `tasks/change-requests/055-eliminar-fluxo-de-duplicidade-na-importacao-da-extensao.md`, consolidando em um documento unico o comportamento atual esperado da API.
- `tasks/change-requests/057-traduzir-logs-da-extensao-para-portugues.md`: depende de `tasks/change-requests/041-traduzir-erros-da-importacao-e-tentar-compatibilidade-com-variacoes.md` e amplia essa traducao para o historico persistido da extensao.
- `tasks/change-requests/059-criar-politica-de-privacidade-para-a-extensao.md`: depende de `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md` e `tasks/change-requests/056-documentar-contrato-operacional-da-api-para-a-extensao-erp-flex.md`, consolidando em documento unico os dados locais e compartilhados pela extensao.
- `tasks/change-requests/060-restringir-permissoes-da-extensao-para-publicacao-na-chrome-web-store.md`: depende de `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md` e `tasks/change-requests/059-criar-politica-de-privacidade-para-a-extensao.md`, reduzindo o manifesto para o menor conjunto de acessos compativel com a captura via popup e com as APIs suportadas.

## Duvidas para validacao humana

- Confirmar em task futura se o endpoint legado de check de versao mobile deve ser removido do backend e do contrato.
- Validar os campos reais disponiveis no ERP Flex para importacao.
- Confirmar qual etapa inicial do kanban deve ser usada para ordens importadas.
- Confirmar qual identificador do ERP sera usado como chave oficial anti-duplicidade.

## Observacoes finais

- O backlog atual esta pronto para execucao incremental do MVP ERP Flex -> kanban seguindo a ordem 001 -> 002 -> 003/004 -> 005 -> 006.
