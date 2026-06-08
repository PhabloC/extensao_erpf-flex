# Change Request 030 - Mover seta de voltar para o canto esquerdo da configuracao avancada

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
ajuste fino sobre tela implementada

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- print enviado pelo usuario em `2026-06-08`

### Regra de aderencia visual
- a tela `Configuracao avancada` deve manter a marca no cabeçalho, mas a seta de voltar precisa iniciar o bloco visual no canto esquerdo.

## Contexto de negocio

### Por que
O usuário pediu que a seta volte para o início do cabeçalho, no canto esquerdo, para reforçar a leitura de navegação de retorno.

### O que
Reposicionar a seta de voltar para o lado esquerdo do cabeçalho da configuração avançada.

### Comportamento esperado
- seta aparece no início do cabeçalho
- marca continua alinhada ao lado da seta
- navegação continua levando de volta para a popup principal

### Fora de escopo
- mudança do fluxo de navegação
- alteração dos campos da tela avançada

## Entradas
- `extensao-dois-pingos/advanced-settings.html`
- `extensao-dois-pingos/popup.css`

## Dependencias
- `tasks/change-requests/026-alinhar-botao-de-voltar-a-direita-no-cabecalho-avancado.md`

## Criterios de conclusao
- seta fica no canto esquerdo do cabeçalho da tela avançada
- layout do cabeçalho permanece estável e legível

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- verificacao manual da tela avancada no navegador

## Resultado da execucao
- `front-end/extensao-dois-pingos`: o botao de voltar da tela `Configuracao avancada` foi movido para o inicio do cabecalho, antes da marca.
- o agrupamento do cabecalho foi ajustado para começar pela seta no canto esquerdo, mantendo logo e textos logo em seguida.

## Arquivos alterados
- `extensao-dois-pingos/advanced-settings.html`
- `extensao-dois-pingos/popup.css`
- `tasks/change-requests/030-mover-seta-de-voltar-para-o-canto-esquerdo-da-configuracao-avancada.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- verificacao manual da tela avancada no navegador: nao executada neste ambiente

## Status final
done
