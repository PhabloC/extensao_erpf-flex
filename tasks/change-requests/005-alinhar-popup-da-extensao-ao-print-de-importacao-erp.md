# Change Request 005 - Alinhar popup da extensao ao print de importacao ERP

## Status
blocked

## Tipo
shared

## Stacks envolvidos
- front-end

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post`
- `contracts/openapi.yaml#/paths/~1auth~1login/post`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
prints de telas

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Telas e estados governados pelo print
- popup principal da extensao com ordem carregada e mapeamento validado
- estado com CTA principal de criacao habilitado
- estado com CTA secundaria de revisao visivel

### Regra de aderencia visual
- a popup da extensao deve seguir fielmente a hierarquia, densidade, copy principal e composicao visual do print, sem reaproveitar por inferencia o layout do dashboard web.

## Contexto de negocio

### Por que
A extensao MVP existe, mas a interface atual ainda nao reflete a experiencia operacional aprovada para conferencia e criacao da OP no kanban.

### O que
Alinhar a UI da popup da extensao ao print aprovado, incluindo estrutura de dados capturados, status de mapeamento, trilha origem-destino e acoes principais.

### Comportamento esperado
- usuario abre a extensao e reconhece de imediato os dados capturados da OP
- popup destaca se o mapeamento foi encontrado
- popup comunica claramente origem ERP e destino kanban
- acao principal de criacao da OP fica visualmente dominante
- acao secundaria de revisao fica disponivel sem competir com a CTA principal

### Fora de escopo
- redesenhar o fluxo do dashboard web
- alterar contrato backend
- automacao nova de importacao em background

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: mudanca restrita a UI da extensao.
- Casos de erro: loading, erro de captura, duplicidade e sessao expirada nao aparecem no print e precisarao seguir a mesma linguagem visual.
- Decisoes humanas confirmadas: o print foi indicado como referencia desejada para a popup.
- Casos de borda: campos faltantes, mapeamento nao encontrado, texto longo de produto e variacao.

## Especificacao tecnica

### Deve
- reorganizar a popup da extensao conforme o print de referencia
- exibir os dados capturados em bloco de conferencia antes da criacao da OP
- explicitar status de mapeamento em destaque visual
- exibir bloco de rastreabilidade `Origem -> Destino`
- manter acessibilidade basica do popup e foco em legibilidade

### Nao deve
- nao alterar endpoints nem payloads do fluxo atual sem nova task
- nao aplicar visual do dashboard web dentro da popup por analogia
- nao esconder estados de erro relevantes quando o print nao os mostra

## Entradas
- `requirements/002-fluxos-e-casos-de-uso.md`
- `requirements/005-integracao-erp-flex-e-extensao.md`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `contracts/openapi.yaml`
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`
- `tasks/006-fechar-fluxo-de-rastreabilidade-e-validacao-fim-a-fim.md`

## Dependencias
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`

## Impacto cruzado
- reabre o escopo visual da extensao MVP sem alterar o fluxo tecnico base
- deve ser considerada antes de concluir definitivamente a validacao manual da `tasks/006-fechar-fluxo-de-rastreabilidade-e-validacao-fim-a-fim.md`

## Criterios de conclusao
- popup principal da extensao adere ao print registrado em `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- estados nao cobertos pelo print ficam documentados e coerentes com a mesma linguagem visual
- fluxo atual de importacao continua funcional apos o ajuste visual

## Validacao esperada
- `cd browser-extension && npm run check`
- validacao manual da popup instalada no navegador
- validacao manual do fluxo de importacao com backend rodando

## Entregaveis esperados
- UI da popup alinhada ao print
- task da change request atualizada com lacunas e desvios
- `tasks/000-index.md` atualizado se houver impacto de status

## Riscos ou ambiguidades
- o print cobre apenas um estado de sucesso parcial; os demais estados exigem derivacao controlada
- pode ser necessario encurtar ou quebrar textos dinamicos para manter a densidade do popup

## Resultado da execucao
- `front-end/browser-extension`: a popup foi reorganizada para priorizar conferencia da OP, status de mapeamento, trilha `Origem -> Destino` e CTA principal `Criar OP no Kanban`, com configuracoes de API e sessao movidas para painel secundario acionado pelo botao de configuracoes.
- `front-end/browser-extension`: a revisao dos dados agora acontece dentro da propria popup, com releitura da aba ativa, placeholders claros para campos ausentes e feedback operacional separado por sucesso, erro e duplicidade.
- `front-end/browser-extension`: o `content-script` passou a coletar campos auxiliares de preview (`baseProduct`, `variations`, `color`, `size`) para aproximar `Produto base` e `Variacoes` do print sem alterar o contrato do endpoint de importacao.
- `front-end/browser-extension`: foi adicionado o atalho `Carregar preview visual` no painel de configuracoes para preencher a popup com um payload mockado equivalente ao print, permitindo revisar o visual sem ERP nem backend.
- Decisao tecnica: o payload principal enviado ao backend foi mantido; o enriquecimento visual usa somente informacoes locais da captura e `rawPayload.candidates`, preservando compatibilidade com o fluxo ja implementado.
- Relacao com contrato: nenhuma rota, schema obrigatorio ou comportamento de importacao backend foi alterado; a change request atua apenas na apresentacao da popup e na captura auxiliar local.

## Arquivos alterados
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`
- `browser-extension/src/content-script.js`
- `browser-extension/README.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok
- validacao manual da popup instalada no navegador: nao executada neste workspace
- validacao manual do fluxo de importacao com backend rodando: nao executada neste workspace

## Aderencia ao design system
- stack `front-end`
- fonte primaria visual: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual: prints de telas
- evidencias de fidelidade: cabecalho compacto com marca e acao de configuracoes, lista vertical de dados capturados, bloco de status de mapeamento, card `Origem -> Destino`, CTA principal azul e CTA secundaria neutra, mantendo densidade de popup curta e orientada a conferencia.
- acessibilidade aplicada: hierarchy semantica com `h1` e `h2`, botoes acionaveis por teclado, feedback em `aria-live`, campos com `label` explicito no painel de configuracoes e informacao critica nao dependente apenas de cor.
- desvios: estados nao cobertos pelo print foram derivados na mesma linguagem visual para erro, leitura parcial e duplicidade, conforme permitido pela task.

## Pendencias pos-task
- executar validacao manual da popup instalada em navegador para revisar espacamento, quebra de texto e ordem de foco no contexto real da extensao.
- usar `Carregar preview visual` como passo rapido de revisao antes do teste com ERP real.
- validar manualmente com backend rodando se a releitura da aba e o CTA principal permanecem coerentes durante sucesso, erro e duplicidade.
- se a pagina real do ERP Flex nao fornecer `Produto base` ou `Variacoes` em campos dedicados, ajustar heuristicas futuras com base no DOM real.

## Status final
blocked
