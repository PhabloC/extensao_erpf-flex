# Change Request 019 - Ajustar divisor de rastreabilidade para seta central

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
- `nao se aplica`

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
print de tela

### Fonte primaria visual
- contexto visual enviado pelo usuario na conversa
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- preservar o card de rastreabilidade e ajustar apenas o elemento central para uma seta apontando para a direita.

## Contexto de negocio

### Por que
O usuário quer deixar mais explícita a direção do fluxo entre origem e destino.

### O que
Substituir o divisor central do card de rastreabilidade por uma seta horizontal apontando para a direita.

### Comportamento esperado
- bloco continua com `Origem` à esquerda e `Destino` à direita
- elemento central passa a comunicar direção de ida

### Fora de escopo
- redesign do card
- alteração de textos de origem e destino

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: seta desalinhada, excesso de contraste, card perder equilíbrio visual.
- Decisoes humanas confirmadas: o traço atual deve virar seta.
- Casos de borda: larguras pequenas da popup, duas linhas no destino.

## Especificacao tecnica

### Deve
- substituir o traço central por uma seta visual horizontal
- manter alinhamento vertical com os nós laterais

### Nao deve
- nao quebrar a largura do card
- nao poluir visualmente o bloco

## Entradas
- `browser-extension/popup.css`
- `browser-extension/popup.html`

## Dependencias
- `tasks/change-requests/005-alinhar-popup-da-extensao-ao-print-de-importacao-erp.md`

## Criterios de conclusao
- card de rastreabilidade mostra seta central apontando para a direita

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup

## Entregaveis esperados
- ajuste de HTML/CSS
- task e indice atualizados

## Riscos ou ambiguidades
- o formato exato da seta pode exigir refinamento visual posterior

## Resultado da execucao
- `front-end/browser-extension`: o divisor central do card de rastreabilidade passou de traço neutro para uma seta horizontal apontando para a direita.
- `front-end/browser-extension`: o ajuste foi feito de forma discreta, preservando o equilíbrio do card e a leitura de origem para destino.

## Arquivos alterados
- `browser-extension/popup.css`
- `tasks/change-requests/019-ajustar-divisor-de-rastreabilidade-para-seta-central.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; o card segue igual, com melhoria pontual na direção visual do fluxo

## Pendencias pos-task
- validar manualmente no navegador se a seta central ficou com a proporção visual desejada.

## Status final
blocked
