# Change Request 044 - Aceitar modo alternativo do ERP quando endpoint retornar OPs validas

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
- preservar integralmente a popup atual; o ajuste deve afetar apenas a regra de captura e reconhecimento da pagina suportada.

## Contexto de negocio

### Por que
Existe um modo alternativo de consulta no ERP em que a tela nao satisfaz a heuristica atual de URL ou DOM, mas o endpoint estruturado ainda devolve uma OP valida. Nessa situacao, a extensao deixa de mostrar a ordem mesmo quando o ERP retorna `total: 1`.

### O que
Ajustar o coletor para considerar o modo como suportado quando o endpoint JSON estruturado da pagina devolver OPs validas.

### Comportamento esperado
- se o endpoint estruturado retornar `data` com registros utilizaveis, a popup deve mostrar a OP mesmo quando a URL ou o DOM do modo alternativo nao baterem com a heuristica antiga
- a popup deve continuar respeitando o filtro de periodo configurado
- a validacao de pagina suportada deve continuar funcionando como fallback quando nao houver endpoint estruturado

### Fora de escopo
- redesenhar a popup
- alterar o fluxo de autenticacao
- mudar o contrato enviado ao backend

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; o ajuste fica restrito ao coletor da extensao.
- Casos de erro: endpoint estruturado com `data: []`, endpoint valido em pagina com DOM diferente e cenario em que apenas o filtro de periodo elimina o registro.
- Decisoes humanas confirmadas: o usuario informou que o ERP exibe uma unica OP valida, mas a extensao nao a mostra no modo alternativo.
- Casos de borda: pagina nao suportada sem endpoint, endpoint suportado com zero resultados no periodo e endpoint suportado com uma unica ordem.

## Especificacao tecnica

### Deve
- tratar como suportada a pagina cujo endpoint estruturado retornar `data` em array
- preservar a heuristica atual de URL, bootstrap e DOM como fallback
- manter o tratamento atual para `Nenhuma ordem foi encontrada para o período informado.` quando o filtro zerar os resultados
- manter a popup e a importacao sem alteracao de schema

### Nao deve
- nao depender exclusivamente da URL para considerar uma pagina suportada
- nao mascarar o caso real de zero resultados no endpoint

## Entradas
- `extensao-dois-pingos/src/content-script.js`

## Dependencias
- `tasks/change-requests/043-predefinir-urls-de-api-local-e-producao-na-configuracao-avancada.md`

## Criterios de conclusao
- uma pagina do modo alternativo do ERP passa a ser aceita quando o endpoint retornar OPs validas
- a extensao continua sinalizando zero resultados quando o filtro de periodo eliminar todos os registros
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- validacao manual no ERP com o modo alternativo que hoje falha

## Entregaveis esperados
- ajuste do coletor da extensao
- task e indice atualizados

## Riscos ou ambiguidades
- sem uma URL real do modo alternativo, a correcao precisa se apoiar no endpoint estruturado sem afrouxar demais a deteccao em paginas realmente nao relacionadas

## Resultado da execucao
- `extensao-dois-pingos`: o coletor passou a aceitar como pagina suportada qualquer modo do ERP cujo endpoint estruturado devolva `data` em array, mesmo quando a heuristica antiga de URL ou DOM nao reconhece a tela.
- `extensao-dois-pingos`: o tratamento de `Nenhuma ordem foi encontrada para o período informado.` foi preservado quando o filtro de emissao elimina os registros do endpoint.
- Decisao tecnica: a regra de suporte agora combina a heuristica antiga com a existencia de endpoint estruturado valido, evitando ampliar a deteccao em paginas sem dados reais.

## Arquivos alterados
- `extensao-dois-pingos/src/content-script.js`
- `tasks/change-requests/044-aceitar-modo-alternativo-do-erp-quando-endpoint-retornar-ops-validas.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual usada por stack: ajuste tecnico sem mudanca estrutural de layout
- evidencias de fidelidade visual: nenhuma mudanca visual foi feita; a popup existente apenas deixa de esconder OPs validas do modo alternativo
- desvios aprovados ou riscos residuais: a validacao real no ERP continua necessaria para confirmar o comportamento no modo especifico do usuario

## Acessibilidade aplicada
- nao houve alteracao de elementos interativos ou fluxos de foco; a correcao ficou restrita a logica de captura

## Pendencias pos-task
- validar manualmente no ERP o modo alternativo que antes retornava uma unica OP sem exibi-la na extensao

## Status final
done
