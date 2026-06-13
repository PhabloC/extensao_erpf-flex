# Change Request 037 - Alinhar botoes da barra lateral no topo da popup

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
ajuste fino visual sobre artefato documental existente

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- preservar a barra lateral compacta da popup, apenas reposicionando os botoes de navegacao para o topo da coluna, de forma coerente com a hierarquia visual ja adotada.

## Contexto de negocio

### Por que
Com os botoes laterais centralizados verticalmente, a navegacao secundaria fica deslocada em relacao ao cabecalho e perde previsibilidade visual.

### O que
Ajustar a barra lateral da popup para que os botoes fiquem alinhados no topo.

### Comportamento esperado
- engrenagem e botao de logs passam a iniciar no topo da barra lateral
- o espacamento entre botoes continua consistente
- o restante da popup permanece inalterado

### Fora de escopo
- adicionar novos botoes laterais
- redesenhar o card principal da popup

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica.
- Casos de erro: botoes permanecerem centralizados, perda de espacamento ou desalinhamento com o padding superior.
- Decisoes humanas confirmadas: o pedido do usuario explicita o alinhamento no topo.
- Casos de borda: popup com scroll vertical e altura reduzida.

## Especificacao tecnica

### Deve
- ajustar o CSS da barra lateral para alinhar seus controles ao topo
- preservar o espacamento vertical entre os botoes

### Nao deve
- nao alterar a navegacao de cada botao
- nao reintroduzir overflow horizontal ou regressao de largura

## Entradas
- `extensao-dois-pingos/popup.css`

## Dependencias
- `tasks/change-requests/024-redesenhar-popup-com-layout-lateral-e-paleta-escura.md`
- `tasks/change-requests/036-adicionar-botao-lateral-e-pagina-interna-de-logs-na-extensao.md`

## Criterios de conclusao
- botoes laterais renderizam no topo da coluna
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual da popup com scroll

## Entregaveis esperados
- ajuste de CSS na barra lateral
- task e indice atualizados

## Riscos ou ambiguidades
- nenhum risco funcional relevante; o ajuste e estritamente visual

## Resultado da execucao
- `extensao-dois-pingos`: a barra lateral da popup deixou de centralizar verticalmente seus botoes e passou a ancora-los no topo da coluna.

## Arquivos alterados
- `extensao-dois-pingos/popup.css`
- `tasks/change-requests/037-alinhar-botoes-da-barra-lateral-no-topo-da-popup.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- a paleta, a largura da barra lateral e o estilo dos botoes foram preservados; apenas o alinhamento vertical mudou para topo

## Acessibilidade aplicada
- sem impacto semantico; botoes permanecem nativos, focaveis e com nomes acessiveis

## Pendencias pos-task
- validar visualmente no navegador se o respiro superior da lateral ficou adequado

## Status final
done
