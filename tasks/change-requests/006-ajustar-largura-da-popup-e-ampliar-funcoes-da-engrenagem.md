# Change Request 006 - Ajustar largura da popup e ampliar funcoes da engrenagem

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
- popup principal da extensao com painel de configuracoes aberto
- necessidade de maior largura util para leitura dos dados capturados
- engrenagem funcionando como entrada para acoes adicionais da extensao

### Regra de aderencia visual
- manter a popup compacta, mas com largura ligeiramente maior e com painel da engrenagem mais funcional, sem descaracterizar a hierarquia aprovada no print anterior.

## Contexto de negocio

### Por que
A popup ficou funcional, mas ainda apertada visualmente. Alem disso, a engrenagem ainda concentra configuracoes de forma limitada e pode servir melhor ao fluxo operacional.

### O que
Aumentar um pouco a largura da popup e adicionar funcoes operacionais claras dentro do painel da engrenagem.

### Comportamento esperado
- popup fica mais confortavel para leitura dos dados capturados
- painel da engrenagem oferece funcoes rapidas e uteis para revisao e suporte da captura
- fluxo principal de criacao da OP continua simples e prioritario

### Fora de escopo
- redesenho total da popup
- mudanca de contrato backend
- criacao de automacoes de importacao em background

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: mudanca restrita a UI e acoes locais da extensao.
- Casos de erro: funcoes da engrenagem podem depender de captura atual ou aba ativa; estados vazios precisam continuar claros.
- Decisoes humanas confirmadas: pedido explicito do usuario para aumentar largura e colocar funcoes na engrenagem.
- Casos de borda: popup sem payload atual, URL de origem ausente, painel aberto em viewport reduzida.

## Especificacao tecnica

### Deve
- aumentar moderadamente a largura util da popup
- melhorar leitura de titulos, rotulos e valores sem perder densidade compacta
- adicionar funcoes operacionais no painel da engrenagem
- manter acessibilidade basica nas novas acoes

### Nao deve
- nao transformar a popup em tela longa demais
- nao esconder a CTA principal de criacao
- nao adicionar funcoes que exijam backend novo ou contrato novo

## Entradas
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`
- `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md`

## Dependencias
- `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md`

## Criterios de conclusao
- popup tem largura maior e mais confortavel para leitura
- painel da engrenagem oferece funcoes uteis alem das configuracoes basicas
- fluxo atual da extensao continua funcionando

## Validacao esperada
- `cd browser-extension && npm run check`
- validacao manual da popup instalada no navegador

## Entregaveis esperados
- ajuste de largura da popup
- painel da engrenagem com novas funcoes operacionais
- task e indice atualizados

## Riscos ou ambiguidades
- largura excessiva pode descaracterizar a popup compacta
- excesso de funcoes na engrenagem pode competir com a CTA principal

## Resultado da execucao
- `front-end/browser-extension`: a popup ganhou largura util adicional para melhorar leitura dos dados capturados sem perder o formato compacto de extensao.
- `front-end/browser-extension`: a engrenagem passou a abrir um painel com acoes rapidas reais, incluindo releitura da aba ativa, abertura da pagina capturada, preview visual mockado, fechamento do painel e limpeza de sessao.
- Decisao tecnica: as novas funcoes reutilizam a logica ja existente da popup e evitam criar novos fluxos de contrato ou estado paralelo, mantendo o ajuste restrito a ergonomia e suporte operacional.
- Relacao com contrato: nenhuma alteracao em endpoint, payload ou autenticacao backend; a change request atua apenas sobre interface e acoes locais da extensao.

## Arquivos alterados
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`
- `browser-extension/README.md`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok
- validacao manual da popup instalada no navegador: nao executada neste workspace

## Aderencia ao design system
- stack `front-end`
- fonte primaria visual: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual: prints de telas
- evidencias de fidelidade: a popup manteve a hierarquia original aprovada, ampliando discretamente a largura e usando a engrenagem como ponto de acesso a acoes curtas e operacionais, sem competir com a CTA principal.
- acessibilidade aplicada: botoes focaveis por teclado, textos diretos, painel recolhivel claro e funcoes descritas semanticamente.
- desvios: o print nao detalhava as funcoes da engrenagem; elas foram derivadas como acoes utilitarias coerentes com o fluxo da extensao.

## Pendencias pos-task
- validar manualmente no navegador se a nova largura esta equilibrada em diferentes resolucoes de popup.
- revisar se a ordem visual das acoes da engrenagem esta adequada para o uso real.
- confirmar manualmente se `Abrir pagina capturada` se comporta como esperado no fluxo do usuario.

## Status final
blocked
