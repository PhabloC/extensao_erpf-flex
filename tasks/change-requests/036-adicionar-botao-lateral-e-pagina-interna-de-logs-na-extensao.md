# Change Request 036 - Adicionar botao lateral e pagina interna de logs na extensao

## Status
done

## Tipo
shared

## Stacks envolvidos
- front-end

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `nao se aplica`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
artefato documental com extensao funcional de estado novo

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- manter a barra lateral compacta da popup e introduzir um segundo atalho logo abaixo da engrenagem, sem competir com a CTA principal nem descaracterizar a hierarquia atual da extensao.

## Contexto de negocio

### Por que
O usuario ja reconhece a engrenagem lateral como ponto de acesso a telas internas da extensao e quer um caminho direto, no mesmo bloco visual, para consultar logs operacionais sem misturar isso com a configuracao avancada.

### O que
Adicionar um botao lateral de logs abaixo da engrenagem e criar uma pagina interna dedicada para listar, atualizar e limpar os logs recentes da extensao.

### Comportamento esperado
- a lateral da popup passa a ter a engrenagem no topo e, logo abaixo, um botao para abrir `logs.html`
- a pagina de logs mostra eventos operacionais recentes da extensao com horario, origem e mensagem
- a pagina de logs permite atualizar a listagem e limpar os logs salvos

### Fora de escopo
- enviar logs para servidor externo
- criar painel lateral nativo do navegador
- instrumentacao analitica completa de todas as acoes possiveis

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; a extensao continua usando apenas storage/runtime ja existentes.
- Casos de erro: log vazio, falha ao carregar logs, excesso de registros antigos, navegacao quebrada e acao de limpar sem feedback.
- Decisoes humanas confirmadas: o usuario pediu explicitamente o botao de logs abaixo da engrenagem.
- Casos de borda: popup aberta sem logs anteriores, varios eventos seguidos, timestamps ausentes e retorno da pagina de logs para a popup principal.

## Especificacao tecnica

### Deve
- adicionar um segundo botao na barra lateral da popup para abrir a pagina interna de logs
- criar `logs.html` e `src/logs.js` reaproveitando a linguagem visual atual da extensao
- persistir logs locais em `chrome.storage.local` com limite de historico para evitar crescimento indefinido
- registrar ao menos eventos relevantes de configuracao, autenticacao, analise/importacao e falhas operacionais
- permitir atualizacao manual e limpeza dos logs na tela interna
- manter navegacao por teclado e feedback textual acessivel

### Nao deve
- nao remover nem substituir a navegacao atual da engrenagem
- nao esconder falha de carregamento da tela de logs atras de mensagem generica
- nao criar uma UI paralela destoando da paleta e composicao ja adotadas na extensao

## Entradas
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/src/background.js`
- `extensao-dois-pingos/advanced-settings.html`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

## Dependencias
- `tasks/change-requests/024-redesenhar-popup-com-layout-lateral-e-paleta-escura.md`
- `tasks/change-requests/025-fazer-engrenagem-abrir-diretamente-a-configuracao-da-api.md`
- `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md`

## Criterios de conclusao
- a popup exibe o novo botao lateral de logs abaixo da engrenagem
- clicar no botao abre uma pagina interna funcional de logs
- a pagina lista eventos recentes, permite atualizar e limpar
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual da navegacao popup -> logs -> voltar
- revisao manual de carga vazia, carga com eventos e limpeza da lista

## Entregaveis esperados
- novo atalho lateral de logs na popup
- pagina interna de logs
- persistencia local de historico operacional da extensao
- task e indice atualizados

## Riscos ou ambiguidades
- os logs continuam locais ao navegador e podem ser apagados pelo usuario ou pelo proprio perfil do browser
- a instrumentacao inicial cobre os eventos mais relevantes, mas nao pretende ser uma trilha forense completa

## Resultado da execucao
- `extensao-dois-pingos`: a barra lateral da popup passou a exibir um segundo atalho abaixo da engrenagem, levando diretamente para a nova pagina `logs.html`.
- `extensao-dois-pingos`: foi criada uma tela interna de logs com listagem cronologica reversa, atualizacao manual, limpeza do historico e retorno para a popup principal.
- `extensao-dois-pingos`: o `background` passou a persistir logs locais com limite de retenção e registrar eventos relevantes de configuracao, autenticacao, analise, importacao e falha operacional.
- Decisao tecnica: os logs foram centralizados em `chrome.storage.local` pelo `background`, evitando duplicar estado entre popup e paginas internas e preservando uma API unica de leitura/escrita para toda a extensao.

## Arquivos alterados
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/logs.html`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/src/background.js`
- `extensao-dois-pingos/src/logs.js`
- `extensao-dois-pingos/scripts/check.mjs`
- `extensao-dois-pingos/README.md`
- `tasks/change-requests/036-adicionar-botao-lateral-e-pagina-interna-de-logs-na-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- teste manual no navegador: nao executado neste ambiente

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual usada por stack: artefato documental com extensao funcional de estado novo
- evidencias de fidelidade visual: a popup preservou a barra lateral, a paleta escura e a hierarquia atual; o novo botao foi adicionado no mesmo trilho vertical sem mexer no card principal
- desvios aprovados ou riscos residuais: a tela de logs nao existe no print original; foi criada como extensao funcional usando os mesmos componentes visuais base da tela avancada

## Acessibilidade aplicada
- o novo botao lateral usa `button` nativo com `aria-label`
- a tela de logs usa botoes nativos para atualizar, limpar e voltar
- feedback de carregamento/erro permanece em regiao `aria-live`
- a lista vazia e o estado de erro continuam compreensiveis por texto, sem depender apenas de cor

## Pendencias pos-task
- validar manualmente no navegador se o volume e a verbosidade dos logs estao adequados ao uso real
- decidir depois se a pagina deve ganhar filtros por origem ou nivel

## Status final
done
