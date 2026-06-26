# Change Request 054 - Suportar multiplas OPs e atualizacao seletiva de OPs ativas na extensao

## Status
done

## Tipo
shared

## Stacks envolvidos
- front-end
- backend

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex`

## Modo de execucao
cross-stack

## Referencia de design system

### Stack de referencia visual
- front-end

### Tipo de referencia visual
- artefato documental com ajuste derivado para popup de extensao

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- manter a popup compacta e orientada a conferencia rapida, adicionando selecao multipla e confirmacoes sem descaracterizar o layout lateral atual

## Contexto de negocio

### Por que
O fluxo atual obriga importacao individual e bloqueia completamente quando a API encontra OP ativa, o que aumenta retrabalho operacional em listas de varias OPs do ERP.

### O que
Permitir selecionar varias OPs na popup, enviar em lote pela extensao e tratar conflitos de OP ativa com confirmacao de atualizacao individual ou seletiva.

### Comportamento esperado
- usuario pode selecionar varias OPs encontradas na analise do ERP
- cada OP selecionada aparece marcada em uma lista visual abaixo do seletor
- ao iniciar a criacao, a extensao envia o lote selecionado
- se uma unica OP selecionada ja estiver ativa no sistema, a extensao pergunta se o usuario quer atualizar essa OP
- se varias OPs selecionadas estiverem ativas, a extensao lista as conflitantes e permite marcar apenas quais devem ser atualizadas
- OP conflitada que nao for marcada para atualizacao nao deve ser enviada

### Fora de escopo
- automacao de atualizacao em background sem confirmacao humana
- sincronizacao bidirecional com o ERP Flex
- alteracao do fluxo kanban fora da importacao ERP

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: extensao continua usando apenas permissao de aba ativa, scripts da pagina e rede ja previstas.
- Casos de erro: lote vazio, click duplo, conflito parcial, conflito total, falha ao atualizar OP ativa, reanalise limpando selecao anterior.
- Decisoes humanas confirmadas: a atualizacao de OP ativa exige confirmacao explicita do usuario.
- Casos de borda: lista grande de OPs, mesma OP selecionada mais de uma vez, lote com itens criados e conflitantes, usuario desmarca parte das OPs conflitantes.

## Especificacao tecnica

### Deve
- permitir selecao multipla de payloads capturados na popup
- exibir as OPs selecionadas em lista compacta logo abaixo do seletor
- suportar envio em lote pela extensao com consolidacao de resultados
- permitir atualizar uma OP ativa existente quando o usuario confirmar
- permitir selecao parcial das OPs ativas em conflitos de lote
- registrar historico de atualizacao no backend e preservar rastreabilidade ERP

### Nao deve
- nao atualizar OP ativa automaticamente sem confirmacao
- nao reenviar OP conflitada que o usuario deixou desmarcada
- nao quebrar o fluxo atual de importacao unica

## Entradas
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `contracts/openapi.yaml`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/src/background.js`
- `backend/src/modules/production-orders/production-orders.service.ts`

## Dependencias
- `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md`
- `tasks/change-requests/049-permitir-busca-digitada-no-dropdown-de-ops-da-extensao.md`
- `tasks/change-requests/052-ajustar-feedback-da-extensao-para-409-de-op-ativa.md`
- `tasks/change-requests/053-alinhar-contrato-backend-e-extensao-a-regra-atual-da-importacao-erp-flex.md`

## Criterios de conclusao
- popup permite selecionar mais de uma OP e mostra claramente as selecionadas
- envio de lote cria OPs nao conflitantes e trata OP ativa com confirmacao de atualizacao
- usuario consegue marcar apenas parte das OPs conflitantes para atualizar
- backend suporta atualizacao explicita da OP ativa importada a partir do mesmo `externalOrderId`
- contrato e testes refletem o novo fluxo de criacao e atualizacao

## Instrucoes de implementacao
- preservar a linguagem visual compacta da popup atual
- manter acessibilidade minima em listas selecionaveis e paineis de confirmacao
- preferir extensao incremental do endpoint de importacao existente em vez de criar um fluxo paralelo sem necessidade

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- `cd backend && npm run test`
- `cd backend && npm run test:e2e`

## Entregaveis esperados
- popup da extensao com selecao multipla e confirmacao de atualizacao seletiva
- backend e contrato ajustados para atualizar OP ativa sob confirmacao
- task e indice atualizados

## Riscos ou ambiguidades
- o lote pode ter resultado parcial entre criacao, atualizacao e itens ignorados; o feedback precisa ser claro sem poluir a popup

## Resultado da execucao
- `front-end`: a popup da extensao passou a aceitar selecao multipla de OPs encontradas, exibindo a trilha das selecionadas e permitindo envio em lote com resumo consolidado.
- `backend`: o endpoint de importacao ERP agora aceita confirmacao explicita da OP ativa existente para atualizar os dados da mesma ordem em vez de retornar apenas conflito.
- Decisoes tecnicas: o envio em lote continua sendo orquestrado pela extensao com chamadas sequenciais ao endpoint existente; conflitos `409` viram uma etapa intermediaria de confirmacao e, quando aprovados, sao reenviados com `existingProductionOrderId`.
- Trade-offs: o lote pode concluir parcialmente entre criacoes, atualizacoes e itens ignorados, entao o feedback final foi consolidado por contagem em vez de abrir um card individual por item.
- Relacao com contrato: `contracts/openapi.yaml` e o contrato espelho da extensao passaram a documentar `existingProductionOrderId` e o resultado `updated` no mesmo endpoint de importacao.

## Arquivos alterados
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/src/background.js`
- `backend/src/modules/production-orders/dto/import-production-order-from-erp-flex.dto.ts`
- `backend/src/modules/production-orders/production-orders.repository.ts`
- `backend/src/modules/production-orders/production-orders.in-memory.repository.ts`
- `backend/src/modules/production-orders/production-orders.typeorm.repository.ts`
- `backend/src/modules/production-orders/production-orders.service.ts`
- `backend/src/modules/production-orders/production-orders.service.spec.ts`
- `backend/test/app.e2e-spec.ts`
- `contracts/openapi.yaml`
- `contracts/browser-extension-target-system.openapi.yaml`
- `tasks/change-requests/054-suportar-multiplas-ops-e-atualizacao-seletiva-de-ops-ativas-na-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- `cd backend && npm run test`: ok
- `cd backend && npm run test:e2e`: ok

## Aderencia ao design system
- Stack de referencia visual: `front-end`
- Tipo de referencia visual: artefato documental com ajuste derivado para popup de extensao
- Evidencias de aderencia: a popup manteve o layout lateral compacto, adicionando apenas a lista de selecionadas e o painel de conflito dentro da mesma linguagem visual escura ja adotada.
- Acessibilidade aplicada: botoes continuam acionaveis por teclado, lista de selecionadas e conflitos usam rotulos textuais claros, e o feedback operacional segue em regioes com `aria-live`.

## Pendencias pos-task
- validar manualmente no navegador o fluxo completo com varias OPs reais do ERP, incluindo conflito parcial e atualizacao seletiva
- revisar se a API de producao remota aceita `existingProductionOrderId` com a mesma semantica do backend local antes do rollout operacional

## Status final
done
