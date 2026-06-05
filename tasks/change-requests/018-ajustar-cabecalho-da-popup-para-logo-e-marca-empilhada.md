# Change Request 018 - Ajustar cabecalho da popup para logo e marca empilhada

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
- `C:/Users/phabl/Pictures/Screenshots/Captura de tela 2026-06-05 141605.png`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- o cabeçalho deve usar logo à esquerda e dois textos empilhados à direita, preservando o restante da popup.

## Contexto de negocio

### Por que
O cabeçalho atual da popup ainda não está fiel ao arranjo visual desejado da marca.

### O que
Reorganizar o cabeçalho da popup para mostrar a logo à esquerda e os textos `Dois Pingos` e `Importar OP para o Kanban` um abaixo do outro.

### Comportamento esperado
- logo aparece à esquerda
- `Dois Pingos` aparece como linha superior
- `Importar OP para o Kanban` aparece como linha inferior

### Fora de escopo
- alteração do restante da popup
- redesign da marca

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: quebra de linha inadequada, logo desalinhada, título muito alto.
- Decisoes humanas confirmadas: a composição deve seguir o print enviado.
- Casos de borda: popup estreita, logo pequena, alinhamento com a engrenagem.

## Especificacao tecnica

### Deve
- reorganizar o cabeçalho com bloco vertical de textos
- manter a logo atual da extensão no lado esquerdo
- preservar alinhamento com o botão de configurações

### Nao deve
- nao voltar ao placeholder textual antigo
- nao transformar o cabeçalho em uma linha única

## Entradas
- `browser-extension/popup.html`
- `browser-extension/popup.css`

## Dependencias
- `tasks/change-requests/017-aplicar-logo-do-produto-como-icone-da-extensao.md`

## Criterios de conclusao
- cabeçalho renderiza logo + `Dois Pingos` + `Importar OP para o Kanban` em duas linhas

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual da popup

## Entregaveis esperados
- ajuste de HTML e CSS
- task e indice atualizados

## Riscos ou ambiguidades
- o texto pode exigir ajuste fino de fonte e espaçamento em nova revisão visual

## Resultado da execucao
- `front-end/browser-extension`: o cabeçalho da popup passou a usar a logo à esquerda e dois textos empilhados à direita.
- `front-end/browser-extension`: foi adicionada a linha superior `Dois Pingos` e a linha inferior `Importar OP para o Kanban`.
- `front-end/browser-extension`: o espaçamento e a escala da logo foram ajustados para preservar alinhamento com o botão de configurações.

## Arquivos alterados
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `tasks/change-requests/018-ajustar-cabecalho-da-popup-para-logo-e-marca-empilhada.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- ajustada para aderir ao print de referência enviado pelo usuário para o cabeçalho da marca

## Pendencias pos-task
- validar manualmente no navegador se a proporção visual do cabeçalho ficou fiel ao print e se exige ajuste fino adicional.

## Status final
blocked
