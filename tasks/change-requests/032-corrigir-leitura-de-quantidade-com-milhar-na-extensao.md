# Change Request 032 - Corrigir leitura de quantidade com milhar na extensao

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
- `contracts/openapi.yaml#/components/schemas/ErpFlexImportPayload/properties/item/properties/quantity` (campo ja existente; sem alteracao de contrato)

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
- manter o bloco `Dados capturados desta pagina` compacto, sem criar novo layout para quantidade; o ajuste deve preservar a leitura em uma unica linha quando houver espaco suficiente.

## Contexto de negocio

### Por que
O ERP Flex pode retornar `SC2_Quant` com separador de milhar no formato `2,000` ou `2.000`. O parser atual da extensao trata `2,000` como valor decimal e acaba reduzindo a quantidade para `2`, gerando conferencia errada antes da importacao. Em alguns casos a unidade `UN` ainda quebra de linha, piorando a leitura operacional.

### O que
Ajustar a extensao para interpretar corretamente quantidades com milhar vindas do endpoint estruturado e manter numero + unidade juntos na apresentacao da popup.

### Comportamento esperado
- `SC2_Quant = "2,000"` deve resultar em quantidade numerica `2000`
- `SC2_Quant = "2.000"` deve resultar em quantidade numerica `2000`
- valores decimais legitimos continuam aceitos (`2,5` -> `2.5`)
- a popup continua exibindo a quantidade formatada sem separar a unidade em linha isolada
- nenhuma alteracao de contrato ou de payload enviado para importacao e necessaria

### Exemplos de saida esperada
- `2,000` + `UN` -> `2000 UN`
- `2.000` + `UN` -> `2000 UN`
- `2,5` + `KG` -> `2,5 KG`

### Fora de escopo
- alterar rotulos da popup
- criar campo visual separado para unidade de medida
- mudar comportamento do backend

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; a extensao continua lendo o endpoint ja suportado.
- Casos de erro: quantidade com virgula de milhar, ponto de milhar, decimal real, string vazia e unidade ausente.
- Decisoes humanas confirmadas: a popup deve manter a leitura compacta do campo `Quantidade`.
- Casos de borda: coexistencia de `.` e `,`, formatacao decimal legitima e quebra visual da unidade.

## Especificacao tecnica

### Deve
- ajustar `parseBrazilianNumber` para distinguir milhar de decimal de forma heuristica
- preservar suporte a formatos `pt-BR` e `en-US` mais comuns vindos do ERP
- manter `payload.item.quantity` como numero
- manter quantidade e unidade juntas na renderizacao da popup

### Nao deve
- nao alterar o contrato OpenAPI
- nao degradar parsing de valores decimais validos
- nao criar novo campo textual de unidade na popup

## Entradas
- `response.md`
- `extensao-dois-pingos/src/content-script.js`
- `extensao-dois-pingos/src/popup.js`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

## Dependencias
- `tasks/change-requests/031-exibir-campos-sc2-unificados-na-extensao.md`

## Criterios de conclusao
- a captura estruturada interpreta `2,000` como `2000`
- a captura estruturada continua interpretando `2.000` como `2000`
- a popup exibe `Quantidade` com numero e unidade juntos
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual da popup com payload real ou mock contendo quantidade com milhar

## Entregaveis esperados
- parser de quantidade ajustado na extensao
- renderizacao da quantidade refinada na popup
- task e indice atualizados

## Riscos ou ambiguidades
- formatos numericos muito exoticos fora dos padroes `pt-BR` e `en-US` ainda podem exigir discovery adicional se o ERP variar esse campo no futuro

## Resultado da execucao
- `extensao-dois-pingos`: o parser de quantidade passou a reconhecer milhar com virgula ou ponto sem reduzir indevidamente `SC2_Quant` para valor decimal.
- `extensao-dois-pingos`: a popup passou a manter quantidade e unidade de medida no mesmo bloco visual usando espaco inquebravel entre valor e sigla.
- `extensao-dois-pingos`: a popup agora valida a versao do `content-script` da aba ativa e reinjeta automaticamente o coletor quando detectar script antigo, evitando manter a leitura desatualizada apos recarregar a extensao.
- Decisoes tecnicas: foi adotada heuristica por separador presente e pela ultima ocorrencia quando o valor contem `,` e `.` ao mesmo tempo; em casos com um unico separador, agrupamentos de tres digitos sao tratados como milhar.
- Decisoes tecnicas: foi adicionado um `healthcheck` simples entre popup e `content-script` para garantir que a captura rode com a versao esperada antes de analisar a pagina.
- Trade-offs: a heuristica privilegia os formatos observados no ERP atual e formatos numericos comuns; padroes nao convencionais continuam fora do escopo ate evidencia real.
- Relacao com contrato: nenhuma mudanca; apenas a normalizacao local do valor recebido antes da exibicao/importacao.

## Arquivos alterados
- `extensao-dois-pingos/src/content-script.js`
- `extensao-dois-pingos/src/popup.js`
- `tasks/change-requests/032-corrigir-leitura-de-quantidade-com-milhar-na-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- revisao manual do `response.md` contra a heuristica de parsing: ok

## Aderencia ao design system
- mantida; o campo `Quantidade` permaneceu no mesmo par rotulo/valor do bloco `Dados capturados desta pagina`
- nao houve desvio visual em relacao a `design-system/front/browser-extension/popup-importacao-erp-flex.md`

## Acessibilidade aplicada
- mantida; nao houve alteracao de semantica, foco ou ordem de leitura
- o valor continua textual e compreensivel sem depender de cor ou icone

## Pendencias pos-task
- validar manualmente no ERP real um caso com `SC2_Quant` em formato `2,000` para confirmar a origem exata do separador observado
- confirmar no navegador que uma aba do ERP ja aberta passa a refletir o fix sem exigir reload manual completo da pagina

## Status final
done
