# Change Request 038 - Filtrar pagina de logs para criacao de OP

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
ajuste funcional sobre pagina interna existente

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- preservar a estrutura atual da pagina de logs, reduzindo apenas o escopo da listagem para eventos diretamente relacionados a criacao de OP.

## Contexto de negocio

### Por que
Os logs operacionais gerais geram ruído para o uso principal dessa tela. O usuario quer consultar apenas o historico relevante para criacao de OP no kanban.

### O que
Restringir a pagina interna de logs para exibir somente eventos ligados a criacao de OP.

### Comportamento esperado
- a pagina de logs continua carregando, atualizando e limpando normalmente
- a listagem passa a mostrar apenas logs de criacao de OP
- eventos de configuracao, autenticacao e analise deixam de aparecer nessa tela

### Fora de escopo
- remover a captura dos demais logs no armazenamento interno
- criar filtros visuais selecionaveis pelo usuario

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica.
- Casos de erro: filtro eliminar todos os registros visiveis, copy vazia ficar ambigua e regressao no carregamento da tela.
- Decisoes humanas confirmadas: o usuario pediu explicitamente para deixar na pagina apenas logs de criacao de OP.
- Casos de borda: historico contendo somente eventos nao relacionados, mistura de sucesso e erro de criacao e timestamps ausentes.

## Especificacao tecnica

### Deve
- filtrar a fonte de dados da pagina de logs para exibir apenas eventos de criacao de OP
- manter atualizacao manual, limpeza e feedback acessivel da pagina
- tratar como relevante tanto sucesso quanto falha de criacao quando o evento for da operacao de criar OP

### Nao deve
- nao quebrar o armazenamento dos logs existentes no background
- nao alterar a navegacao lateral da popup

## Entradas
- `extensao-dois-pingos/src/background.js`
- `extensao-dois-pingos/src/logs.js`
- `extensao-dois-pingos/logs.html`

## Dependencias
- `tasks/change-requests/036-adicionar-botao-lateral-e-pagina-interna-de-logs-na-extensao.md`
- `tasks/change-requests/037-alinhar-botoes-da-barra-lateral-no-topo-da-popup.md`

## Criterios de conclusao
- a pagina de logs mostra apenas eventos ligados a criacao de OP
- estado vazio continua compreensivel quando nao houver logs desse tipo
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual da pagina com historico misto

## Entregaveis esperados
- ajuste de filtro na pagina de logs
- task e indice atualizados

## Riscos ou ambiguidades
- eventos antigos podem nao estar totalmente padronizados; o filtro precisa se apoiar no identificador mais estavel disponivel no log atual

## Resultado da execucao
- `extensao-dois-pingos`: a pagina interna de logs passou a exibir apenas eventos cuja origem e `importacao`, que correspondem ao fluxo de criacao de OP no kanban.
- `extensao-dois-pingos`: a copy da tela e do estado vazio foi ajustada para deixar explicito que o historico mostrado e o de criacao de OP.
- Decisao tecnica: o filtro foi aplicado apenas na camada de apresentacao (`src/logs.js`), preservando o historico completo salvo no `chrome.storage.local` para nao quebrar diagnosticos futuros nem a instrumentacao ja existente.

## Arquivos alterados
- `extensao-dois-pingos/logs.html`
- `extensao-dois-pingos/src/logs.js`
- `tasks/change-requests/038-filtrar-pagina-de-logs-para-criacao-de-op.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual usada por stack: ajuste funcional sobre pagina interna existente
- evidencias de fidelidade visual: a estrutura, os componentes e a hierarquia da tela de logs foram preservados; mudou apenas o recorte semantico da listagem e da copy de apoio
- desvios aprovados ou riscos residuais: nenhum desvio visual relevante; os logs gerais continuam armazenados, mas ficam fora da listagem desta pagina

## Acessibilidade aplicada
- a tela manteve a mesma estrutura semantica e os controles nativos de atualizar, limpar e voltar
- as mensagens em `aria-live` continuam refletindo carregamento, sucesso, erro e estado vazio com copy especifica para criacao de OP

## Pendencias pos-task
- validar manualmente no navegador se o conjunto atual de eventos `importacao` cobre todos os casos de criacao de OP que o usuario espera acompanhar

## Status final
done
