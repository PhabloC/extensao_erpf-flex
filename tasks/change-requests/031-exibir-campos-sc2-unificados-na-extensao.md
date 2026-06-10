# Change Request 031 - Exibir campos SC2 unificados na extensao

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
- `contracts/openapi.yaml#/components/schemas/ErpFlexImportPayload/properties/notes` (campo ja existente; sem alteracao de contrato)

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
- incluir os campos complementares como mais um par rotulo/valor no bloco `Dados capturados desta pagina`, mantendo o resumo compacto e legivel em uma unica linha.

## Contexto de negocio

### Por que
O endpoint JSON do ERP Flex retorna ate 30 campos complementares por OP (`SC2_Campo1` a `SC2_Campo30`). Esses dados carregam instrucoes operacionais importantes — por exemplo, tipo de acabamento, observacoes de producao e orientacoes de estoque — que hoje nao aparecem na popup da extensao para conferencia antes da importacao.

### O que
Capturar os campos `SC2_Campo1` a `SC2_Campo30` vindos do endpoint, unificar os valores preenchidos em uma unica linha separada por virgula e exibir esse texto no resumo principal da popup.

### Comportamento esperado
- extensao le `SC2_Campo1` ate `SC2_Campo30` do registro retornado pelo endpoint JSON
- apenas valores nao vazios entram na linha unificada
- a ordem de concatenacao segue a numeracao original dos campos (`SC2_Campo1`, `SC2_Campo2`, ...)
- o separador entre valores preenchidos e virgula seguida de espaco (`, `)
- quebras de linha e espacos extras dentro de cada valor sao normalizados antes da unificacao
- popup exibe a linha unificada em um novo campo visivel no bloco principal (rotulo sugerido: `Observacoes`)
- o mesmo texto unificado permanece disponivel em `payload.notes` para importacao
- quando nenhum campo vier preenchido, a popup mostra fallback neutro (`Nao capturadas` ou equivalente ja usado na extensao)

### Exemplos de saida esperada
- `SC2_Campo1 = "SILK MINIKAY"`, `SC2_Campo2 = "COSTURA DP"` -> `SILK MINIKAY, COSTURA DP`
- `SC2_Campo1 = "Produzir somente 4 novos."`, `SC2_Campo2 = "Costura DP"`, `SC2_Campo3 = "Pedido total 8 pcs - 4 pcs serao usados do estoque"` -> `Produzir somente 4 novos., Costura DP, Pedido total 8 pcs - 4 pcs serao usados do estoque`
- todos vazios -> campo oculto ou fallback neutro, sem quebrar captura/importacao

### Fora de escopo
- alteracao de contrato OpenAPI
- exibir cada `SC2_CampoN` como linha separada na popup
- importacao em lote
- redesign completo da popup

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; extensao ja le o endpoint JSON da pagina atual.
- Casos de erro: todos os campos vazios, apenas alguns campos preenchidos, valores com quebra de linha, valores longos, fallback DOM sem `SC2_CampoN`.
- Decisoes humanas confirmadas: unificar em uma linha com separador virgula; exibir na popup antes da importacao.
- Casos de borda: texto muito longo na popup, campos com espacos sobrando, OP selecionada em lista com varios registros, mock/preview local.

## Especificacao tecnica

### Deve
- iterar `SC2_Campo1` ate `SC2_Campo30` no mapeamento estruturado do `content-script`
- ignorar campos vazios ou so com espaco
- normalizar cada valor antes de concatenar (trim, colapsar quebras de linha internas)
- unificar valores preenchidos com `, ` (virgula + espaco)
- persistir o texto unificado em `payload.notes`
- expor o texto tambem em `rawPayload.candidates` (ex.: `complementaryFields` ou reutilizar chave coerente com o padrao atual)
- adicionar linha `Observacoes` (ou rotulo equivalente ja adotado) em `popup.html`
- renderizar a linha unificada em `popup.js` junto aos demais campos capturados
- atualizar preview mockado para demonstrar o novo campo quando util para revisao visual
- trocar o separador atual ` | ` usado em `notes` para `, ` quando a origem for `SC2_CampoN`

### Nao deve
- nao misturar observacoes unificadas com o campo `Variacoes` quando `XXX_DescChaveItensVar` estiver presente
- nao quebrar captura/importacao quando os campos nao existirem no registro
- nao enviar placeholders ou virgulas sobrando quando nao houver valor

## Entradas
- `response.md` (amostra real do endpoint com `SC2_Campo1` a `SC2_Campo30`)
- `extensao-dois-pingos/src/content-script.js`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/popup.html`

## Dependencias
- `tasks/change-requests/008-priorizar-captura-por-endpoint-json-do-erp-flex.md`
- `tasks/change-requests/010-suportar-listagem-de-ops-na-popup-com-foco-no-codigo.md`
- `tasks/change-requests/016-exibir-cliente-na-captura-da-extensao.md`

## Criterios de conclusao
- popup exibe observacoes unificadas quando houver ao menos um `SC2_CampoN` preenchido
- valores de exemplo em `response.md` produzem linha unica separada por virgula
- selecionar outra OP na lista atualiza o campo conforme o registro selecionado
- importacao continua enviando `notes` com o texto unificado

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- revisao manual da popup com payload real ou mock contendo `SC2_Campo1` a `SC2_Campo30`

## Entregaveis esperados
- ajuste da captura estruturada no `content-script`
- novo campo visivel na popup
- task e indice atualizados

## Riscos ou ambiguidades
- textos muito longos podem exigir truncamento visual ou quebra controlada na popup sem alterar o payload enviado
- hoje `payload.notes` pode ser reutilizado como fallback de variacoes; a implementacao deve evitar que observacoes aparecam no lugar errado

## Resultado da execucao
- `extensao-dois-pingos`: o `content-script` passou a unificar `SC2_Campo1` a `SC2_Campo30` com separador `, `, normalizando espacos e quebras de linha antes da concatenacao.
- `extensao-dois-pingos`: o texto unificado e persistido em `payload.notes` e em `rawPayload.candidates.complementaryFields`.
- `extensao-dois-pingos`: a popup ganhou o campo `Observacoes` no bloco principal de dados capturados.
- `extensao-dois-pingos`: observacoes deixaram de ser usadas como fallback do campo `Variacoes`, evitando mistura de dados.

## Arquivos alterados
- `extensao-dois-pingos/src/content-script.js`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/popup.html`
- `tasks/change-requests/031-exibir-campos-sc2-unificados-na-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- revisao manual da popup com payload real do ERP: nao executada neste ambiente

## Aderencia ao design system
- mantida; observacoes foram adicionadas como mais um par rotulo/valor no bloco `Dados capturados desta pagina`, com quebra de linha controlada pelo CSS existente (`word-break: break-word`)

## Acessibilidade aplicada
- novo par `dt`/`dd` semantico na lista de definicao existente
- fallback textual neutro (`Nao capturadas`) quando nao houver valores

## Pendencias pos-task
- validar manualmente no ERP real se todos os 30 campos relevantes aparecem conforme esperado para diferentes tipos de OP

## Status final
done
