# Change Request 040 - Destacar erros na pagina de logs da extensao

## Status
done

## Tipo
front

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
- preservar a estrutura atual da pagina de logs, reforcando apenas a leitura imediata dos eventos de erro sem redesenhar a tela.

## Contexto de negocio

### Por que
Os logs atuais registram falhas operacionais, mas a tela nao deixa o erro suficientemente evidente. Isso dificulta diagnosticar rapidamente quando uma importacao falhou.

### O que
Destacar de forma clara os logs de erro na pagina interna da extensao.

### Comportamento esperado
- cada entrada continua exibindo horario, origem e mensagem
- entradas com `level=error` ficam visualmente destacadas
- o usuario consegue identificar rapidamente quantos erros existem no historico carregado

### Fora de escopo
- enviar logs para servidor externo
- criar filtros adicionais por nivel
- alterar o armazenamento dos logs

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica.
- Casos de erro: lista vazia, historico sem erros, mistura de sucesso/erro e regressao visual na pagina de logs.
- Decisoes humanas confirmadas: o usuario pediu explicitamente para deixar o log de erro bem claro.
- Casos de borda: varias falhas seguidas, mensagens de erro sem detalhes e logs antigos sem padronizacao perfeita de `level`.

## Especificacao tecnica

### Deve
- exibir o nivel do log de forma explicita na linha de meta
- aplicar destaque visual adicional para entradas de erro
- informar no feedback de carregamento quantos erros existem no conjunto exibido

### Nao deve
- nao quebrar o filtro atual de logs de criacao de OP
- nao esconder logs de sucesso ou warning

## Entradas
- `extensao-dois-pingos/src/logs.js`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/logs.html`

## Dependencias
- `tasks/change-requests/036-adicionar-botao-lateral-e-pagina-interna-de-logs-na-extensao.md`
- `tasks/change-requests/038-filtrar-pagina-de-logs-para-criacao-de-op.md`

## Criterios de conclusao
- logs de erro aparecem com destaque visual claro na pagina interna
- a tela informa quantos erros existem quando carregar entradas
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual da tela com historico misto de sucesso e erro

## Entregaveis esperados
- ajuste de apresentacao dos logs
- task e indice atualizados

## Riscos ou ambiguidades
- logs antigos sem `level` consistente podem continuar aparecendo como neutros

## Resultado da execucao
- `extensao-dois-pingos`: a pagina de logs passou a exibir o nivel do evento com badge explicita (`Erro`, `Sucesso`, `Alerta` ou `Info`) ao lado da origem e do horario.
- `extensao-dois-pingos`: entradas com `level=error` agora ficam em card destacado, com borda e fundo mais fortes, e a mensagem ganha prefixo textual `Erro:` para nao depender apenas de cor.
- `extensao-dois-pingos`: o feedback de carregamento passou a informar a quantidade de erros encontrados no historico exibido, facilitando triagem imediata.
- Decisao tecnica: o ajuste ficou restrito a `src/logs.js` e `popup.css`, preservando o filtro atual de eventos `importacao` e o armazenamento existente no `background`.

## Arquivos alterados
- `extensao-dois-pingos/src/logs.js`
- `extensao-dois-pingos/popup.css`
- `tasks/change-requests/040-destacar-erros-na-pagina-de-logs-da-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual usada por stack: ajuste funcional sobre pagina interna existente
- evidencias de fidelidade visual: a hierarquia, os componentes e a navegacao da tela permanecem os mesmos
- desvios aprovados ou riscos residuais: nenhum

## Acessibilidade aplicada
- manter feedback textual em `aria-live`
- nao depender apenas de cor para identificar erros

## Pendencias pos-task
- validar manualmente no navegador se o destaque atual de erro esta suficientemente evidente no uso real

## Status final
done
