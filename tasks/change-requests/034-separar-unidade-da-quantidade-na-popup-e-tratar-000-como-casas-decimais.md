# Change Request 034 - Separar unidade da quantidade na popup e tratar 000 como casas decimais

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
- `contracts/openapi.yaml#/components/schemas/ErpFlexImportPayload/properties/item` (sem alteracao de contrato; ajuste local de exibicao e parsing do valor retornado pelo ERP)

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
- manter o bloco `Dados capturados desta pagina` como lista vertical compacta, apenas desmembrando a unidade para uma linha dedicada logo abaixo de `Quantidade`.

## Contexto de negocio

### Por que
No ERP real, valores como `2,000` e `2.000` representam a quantidade `2`, com tres casas decimais zeradas, e nao milhar. A popup atual mistura quantidade e unidade na mesma linha, o que dificulta a leitura desejada pelo usuario final.

### O que
Alterar o parser local para tratar `,000` e `.000` como casas decimais do ERP e separar a unidade em uma linha dedicada com o rotulo `Unidade de Medida`.

### Comportamento esperado
- `2,000` deve ser exibido como `2`
- `2.000` deve ser exibido como `2`
- a linha `Quantidade` deve exibir apenas o numero
- a linha seguinte deve exibir `Unidade de Medida: UN` quando houver unidade
- a importacao continua enviando `item.quantity` numerico e `item.unit` separado, sem alteracao de contrato

### Fora de escopo
- alterar contrato OpenAPI
- redesenhar a popup
- mudar a logica de selecao de OP

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; a extensao continua lendo a pagina e o endpoint ja suportado.
- Casos de erro: quantidade ausente, unidade ausente, valor com `,000`, valor com `.000` e valores decimais nao inteiros.
- Decisoes humanas confirmadas: quantidade e unidade devem aparecer em linhas separadas.
- Casos de borda: fallback sem unidade e preservacao do formato compacto da popup.

## Especificacao tecnica

### Deve
- tratar `,000` e `.000` como casas decimais zeradas do ERP
- manter `Quantidade` sem a sigla da unidade
- adicionar linha `Unidade de Medida` logo abaixo de `Quantidade`
- preservar fallback textual quando quantidade ou unidade nao vierem preenchidas

### Nao deve
- nao tratar `2,000` e `2.000` como `2000`
- nao voltar a concatenar quantidade e unidade na mesma linha
- nao alterar o payload do contrato

## Entradas
- `extensao-dois-pingos/src/content-script.js`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/popup.html`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

## Dependencias
- `tasks/change-requests/033-evitar-auto-selecao-incorreta-de-op-na-extensao.md`

## Criterios de conclusao
- `2,000` aparece como `2` na popup
- `2.000` aparece como `2` na popup
- a unidade aparece em linha separada com o rotulo `Unidade de Medida`
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual da popup com payload real do ERP contendo `SC2_Quant` e `SB1_UM`

## Entregaveis esperados
- parser de quantidade ajustado ao padrao real do ERP
- popup com unidade em linha dedicada
- task e indice atualizados

## Riscos ou ambiguidades
- se houver outros formatos numericos no ERP alem de tres casas decimais fixas, novas regras de parsing podem ser necessarias em task futura

## Resultado da execucao
- `extensao-dois-pingos`: o parser passou a tratar valores `x,000` e `x.000` como quantidade decimal do ERP, exibindo `2` em vez de `2000`.
- `extensao-dois-pingos`: a popup passou a exibir `Quantidade` e `Unidade de Medida` em linhas separadas.
- Decisoes tecnicas: a sigla da unidade deixou de ser concatenada pelo formatador da quantidade e passou a ser renderizada por um campo proprio da lista.
- Relacao com contrato: nenhuma mudanca; `item.quantity` e `item.unit` continuam separados no payload interno e no envio ao backend.

## Arquivos alterados
- `extensao-dois-pingos/src/content-script.js`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/popup.html`
- `tasks/change-requests/034-separar-unidade-da-quantidade-na-popup-e-tratar-000-como-casas-decimais.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- mantida; o resumo principal continua compacto e sem criar novo painel ou nova hierarquia fora da lista de dados capturados

## Acessibilidade aplicada
- mantida; o novo campo segue a mesma estrutura semantica `dt`/`dd`
- a leitura de tela fica mais clara ao separar valor numerico e unidade

## Pendencias pos-task
- validar manualmente no ERP real se todos os formatos de quantidade relevantes seguem o padrao de tres casas decimais observado ate aqui

## Status final
done
