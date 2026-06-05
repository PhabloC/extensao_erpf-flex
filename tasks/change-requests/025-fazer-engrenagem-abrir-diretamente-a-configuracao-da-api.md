# Change Request 025 - Fazer engrenagem abrir diretamente a configuracao da API

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
ajuste comportamental sobre print de tela

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- a engrenagem lateral deve funcionar como atalho direto para a tela de configuracao avancada da extensao.

## Contexto de negocio

### Por que
O usuário espera que clicar na engrenagem leve imediatamente para a parte da API, sem um menu intermediário.

### O que
Simplificar a engrenagem da popup principal para navegação direta à página interna de configuração avançada.

### Comportamento esperado
- clique na engrenagem abre `advanced-settings.html`
- a popup principal deixa de depender de dropdown de configuração

### Fora de escopo
- mudança dos campos de configuração da API
- alteração do fluxo de importação

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: botão sem ação, navegação quebrada, referências órfãs ao menu antigo.
- Decisoes humanas confirmadas: o pedido do usuário é explícito.
- Casos de borda: popup aberta sem configurações salvas, retorno da tela avançada para a principal.

## Especificacao tecnica

### Deve
- navegar diretamente para `advanced-settings.html` ao clicar na engrenagem
- remover dependência funcional do dropdown antigo

### Nao deve
- manter comportamento ambíguo na engrenagem
- quebrar as demais ações principais da popup

## Entradas
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`

## Dependencias
- `tasks/change-requests/024-redesenhar-popup-com-layout-lateral-e-paleta-escura.md`

## Criterios de conclusao
- engrenagem abre diretamente a tela da API
- popup principal continua operacional

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup

## Entregaveis esperados
- ajuste de HTML/CSS/JS da popup
- task e indice atualizados

## Riscos ou ambiguidades
- o usuário pode depois querer reintroduzir ações rápidas em outro ponto da UI

## Resultado da execucao
- `front-end/browser-extension`: a engrenagem da popup principal passou a navegar diretamente para a tela interna de configuração avançada da extensão.
- `front-end/browser-extension`: o menu dropdown intermediário foi removido da popup principal para eliminar ambiguidade operacional.

## Arquivos alterados
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`
- `tasks/change-requests/025-fazer-engrenagem-abrir-diretamente-a-configuracao-da-api.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Pendencias pos-task
- validar manualmente no navegador se o clique na engrenagem abre a tela de API de forma consistente.

## Status final
blocked
