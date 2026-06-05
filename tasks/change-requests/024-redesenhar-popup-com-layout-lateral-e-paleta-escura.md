# Change Request 024 - Redesenhar popup com layout lateral e paleta escura

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
- segunda imagem enviada pelo usuario na conversa em `2026-06-05`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- a popup deve adotar linguagem mais próxima da segunda imagem: menos cantos arredondados, paleta azul escura e controles laterais.

## Contexto de negocio

### Por que
O usuário pediu mudança visual estrutural da popup, incluindo remoção do excesso de bordas arredondadas, aproximação cromática com a segunda imagem e posicionamento lateral da engrenagem.

### O que
Redesenhar a popup principal da extensão para seguir essa nova direção visual sem alterar o fluxo funcional principal.

### Comportamento esperado
- popup com base visual azul escura
- cantos menos arredondados
- engrenagem em coluna/lateral
- conteúdo principal preservado

### Fora de escopo
- alteração do fluxo de captura
- mudança de contrato

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: contraste insuficiente, perda de legibilidade, layout lateral comprimindo demais a área útil.
- Decisoes humanas confirmadas: o pedido é visual e explícito.
- Casos de borda: popup estreita, listas longas, status de erro e sucesso.

## Especificacao tecnica

### Deve
- reduzir arredondamento global
- aplicar direção visual azul escura
- mover a engrenagem para uma coluna lateral
- manter usabilidade do conteúdo operacional

### Nao deve
- nao ignorar a nova referência visual
- nao quebrar revisão, importação e navegação interna

## Entradas
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`

## Dependencias
- `tasks/change-requests/023-mover-configuracao-avancada-para-pagina-interna-da-extensao.md`

## Criterios de conclusao
- popup adota o novo layout visual pedido
- engrenagem fica lateral
- fluxo funcional segue operacional

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup

## Entregaveis esperados
- ajuste de HTML/CSS
- task e indice atualizados

## Riscos ou ambiguidades
- pode exigir novo ajuste fino visual após revisão humana

## Resultado da execucao
- `front-end/browser-extension`: a popup principal foi redesenhada para uma base azul escura com estrutura em duas colunas, incluindo barra lateral dedicada para a engrenagem.
- `front-end/browser-extension`: o arredondamento geral foi reduzido e os cards internos passaram a usar cantos mais contidos, em linha com a direção visual solicitada.
- `front-end/browser-extension`: o menu da engrenagem foi mantido funcional dentro da lateral, preservando o acesso às ações operacionais e à navegação para a configuração avançada.

## Arquivos alterados
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `tasks/change-requests/024-redesenhar-popup-com-layout-lateral-e-paleta-escura.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- atualizada para refletir a nova direção visual lateral e de paleta escura

## Pendencias pos-task
- validar manualmente no navegador se a nova direção visual está suficientemente próxima da segunda imagem de referência.
- ajustar fino, se necessário, proporção da barra lateral, peso dos cards e contraste dos controles.

## Status final
blocked
