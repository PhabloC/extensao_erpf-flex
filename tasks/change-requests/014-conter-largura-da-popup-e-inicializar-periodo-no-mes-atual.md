# Change Request 014 - Conter largura da popup e inicializar periodo no mes atual

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
artefato documental com print derivado

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- popup deve continuar compacta, sem corte horizontal e com periodo operacional coerente ja preenchido.

## Contexto de negocio

### Por que
O conteúdo da popup ainda está saindo pela direita. Além disso, o período de emissão deve começar com um padrão útil para o usuário: mês atual, do primeiro ao último dia.

### O que
Corrigir definitivamente a largura útil da popup e inicializar os campos de data com o mês atual do usuário.

### Comportamento esperado
- nenhum bloco principal sai pela direita
- inputs de data já abrem com o mês atual
- `Emissao de` começa no primeiro dia do mês
- `Emissao ate` termina no último dia do mês

### Fora de escopo
- redesign da popup
- persistência de preferências de período entre sessões

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: viewport menor que a largura assumida, data vazia, ERP sem filtro explícito.
- Decisoes humanas confirmadas: período padrão deve ser o mês atual do usuário.
- Casos de borda: virada de mês, fevereiro, popup aberta sem filtros na URL.

## Especificacao tecnica

### Deve
- impedir overflow horizontal do documento e dos cards internos
- permitir shrink real da popup ao limite visível do navegador
- inicializar filtros de emissão com o mês atual quando não houver valor explícito

### Nao deve
- nao deixar inputs de data vazios por padrão
- nao manter largura que ultrapasse a viewport útil da extensão

## Entradas
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`

## Dependencias
- `tasks/change-requests/011-expor-e-permitir-ajuste-do-periodo-de-emissao-na-extensao.md`
- `tasks/change-requests/013-corrigir-overflow-horizontal-da-popup.md`

## Criterios de conclusao
- popup deixa de cortar à direita
- inputs já começam preenchidos com o mês atual

## Validacao esperada
- `cd browser-extension && npm run check`
- revisão manual da popup

## Entregaveis esperados
- ajuste de CSS
- ajuste do estado inicial de datas
- task e indice atualizados

## Riscos ou ambiguidades
- um ajuste excessivo de largura pode reduzir demais a área útil do conteúdo

## Resultado da execucao
- `front-end/browser-extension`: a popup passou a respeitar `100vw` como limite real, com reforco de `min-width: 0` e `max-width: 100%` nos principais containers que estavam sujeitos a overflow horizontal.
- `front-end/browser-extension`: os filtros de data passaram a iniciar automaticamente com o mês atual do usuário, do primeiro ao último dia do mês, quando nao houver valor explícito mais forte vindo da captura.
- `front-end/browser-extension`: a formatação do período padrão foi feita em data local, evitando deslocamentos por fuso horário.

## Arquivos alterados
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`
- `tasks/change-requests/014-conter-largura-da-popup-e-inicializar-periodo-no-mes-atual.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; ajuste estrutural de largura e preenchimento operacional inicial do período

## Pendencias pos-task
- validar manualmente no navegador se o conteúdo deixou de sair pela direita em todos os blocos da popup.
- confirmar no uso real se o mês atual como período padrão atende o comportamento esperado da operação.

## Status final
blocked
