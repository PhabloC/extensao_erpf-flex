# Change Request 045 - Auto-selecionar OP unica retornada pelo endpoint do ERP

## Status
done

## Tipo
front

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
ajuste tecnico sem mudanca estrutural de layout

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- preservar a popup atual; a mudanca deve afetar apenas a regra de selecao da OP retornada pelo endpoint.

## Contexto de negocio

### Por que
Em alguns modos do ERP, o endpoint estruturado retorna apenas uma OP valida, mas a tela nao fornece pistas suficientes para a heuristica de score confirmar o match. Nesse cenario, a extensao recebe a lista, porem nao preenche a OP principal na popup.

### O que
Auto-selecionar a unica OP retornada pelo endpoint quando nao houver ambiguidade.

### Comportamento esperado
- se o endpoint estruturado retornar exatamente uma OP valida, a popup deve exibi-la automaticamente
- a exigencia de selecao manual deve continuar apenas quando houver mais de uma OP sem match confiavel
- o restante do fluxo de importacao deve permanecer igual

### Fora de escopo
- alterar o schema enviado ao backend
- mexer no layout da popup
- mudar a logica de filtros de periodo

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; ajuste restrito ao coletor da extensao.
- Casos de erro: lista com uma unica OP, lista com varias OPs e score zerado sem ambiguidade.
- Decisoes humanas confirmadas: o usuario confirmou que no modo problematico existe apenas uma OP no ERP e ela deve aparecer na extensao.
- Casos de borda: score zero com uma OP, score zero com varias OPs e score alto com uma OP.

## Especificacao tecnica

### Deve
- selecionar automaticamente a unica OP quando `sourceRecords.length === 1`
- preservar a exigencia de selecao manual apenas para cenarios com varias OPs sem match confiavel
- manter os metadados de score e a heuristica atual para listas multiplas

### Nao deve
- nao exigir selecao manual quando so existe uma OP possivel
- nao alterar o comportamento de listas multiplas com ambiguidade real

## Entradas
- `extensao-dois-pingos/src/content-script.js`

## Dependencias
- `tasks/change-requests/044-aceitar-modo-alternativo-do-erp-quando-endpoint-retornar-ops-validas.md`

## Criterios de conclusao
- uma unica OP retornada pelo endpoint passa a preencher a popup automaticamente
- listas multiplas continuam exigindo selecao manual apenas quando necessario
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- validacao manual no modo do ERP que retorna apenas uma OP

## Entregaveis esperados
- ajuste do coletor da extensao
- task e indice atualizados

## Riscos ou ambiguidades
- sem replay automatizado do payload na popup, a confirmacao final ainda depende de validacao manual no ERP real

## Resultado da execucao
- `extensao-dois-pingos`: a heuristica de selecao estruturada agora escolhe automaticamente a unica OP retornada pelo endpoint, mesmo quando o score baseado em pistas da tela e zero.
- `extensao-dois-pingos`: a selecao manual continua reservada aos cenarios com varias OPs e ambiguidade real.
- Decisao tecnica: o ajuste foi concentrado em `pickBestStructuredRecord`, mantendo intacto o restante do fluxo de captura, filtro e importacao.

## Arquivos alterados
- `extensao-dois-pingos/src/content-script.js`
- `tasks/change-requests/045-auto-selecionar-op-unica-retornada-pelo-endpoint-do-erp.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual usada por stack: ajuste tecnico sem mudanca estrutural de layout
- evidencias de fidelidade visual: nenhuma mudanca visual foi feita; a popup existente apenas passa a receber a OP principal automaticamente quando ha uma unica ordem retornada
- desvios aprovados ou riscos residuais: a confirmacao final ainda depende de validar no ERP real o modo que antes deixava a popup vazia

## Acessibilidade aplicada
- nao houve alteracao de interface; a correcao ficou restrita a logica de selecao

## Pendencias pos-task
- validar manualmente no ERP a exibicao da unica OP no modo alternativo

## Status final
done
