# Task 005 - Estruturar extensao de navegador para importacao ERP Flex

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
- `contracts/openapi.yaml#/paths`

## Modo de execucao
cross-stack

## Referencia de design system

### Stack de referencia visual
nao se aplica

### Tipo de referencia visual
nao se aplica

### Fonte primaria visual
- nao se aplica

### Regra de aderencia visual
- Task tecnica da extensao; qualquer UI da extensao deve ser minimamente funcional e pragmatica, sem criar design paralelo ao sistema principal.

## Contexto de negocio

### Por que
Sem a extensao, a importacao automatica a partir do ERP Flex nao existe. Ela e a ponte operacional entre o ERP e o backend do sistema.

### O que
Criar o MVP da extensao de navegador capaz de reconhecer a pagina suportada do ERP Flex, extrair dados minimos da ordem, autenticar no sistema destino e chamar o endpoint de importacao.

### Comportamento esperado
- usuario aciona a extensao na pagina do ERP
- extensao valida se esta em pagina suportada
- extensao coleta os dados obrigatorios
- extensao chama a API de importacao
- extensao informa sucesso, duplicidade ou erro

### Fora de escopo
- sincronizacao automatica em background sem clique
- atualizacao de ordens de volta no ERP
- automacao multiplas paginas do ERP

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: extensao usa apenas as permissoes minimas de pagina e rede necessarias.
- Casos de erro: pagina nao suportada, DOM incompleto, sessao expirada, erro de rede, duplicidade.
- Decisoes humanas confirmadas: extensao sera instalada no navegador do usuario e acionada por clique.
- Casos de borda: coleta por DOM fragil, dados com espacos/formatacao irregular, ERP alterando layout, click repetido.

## Especificacao tecnica

### Deve
- criar estrutura isolada para extensao no repositorio
- incluir manifesto, popup/botao e script de coleta
- separar coleta, adaptacao e envio de dados
- tratar auth e mensagens de retorno ao usuario

### Nao deve
- nao armazenar senha do ERP
- nao depender de valores hardcoded que impeçam evolucao para ambiente real

## Entradas
- `requirements/002-fluxos-e-casos-de-uso.md`
- `requirements/003-regras-de-negocio.md`
- `requirements/005-integracao-erp-flex-e-extensao.md`
- `contracts/openapi.yaml`
- `front-end/docs/ai/ARCHITECTURE.md`
- `backend/docs/ai/ARCHITECTURE.md`

## Dependencias
- `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md`
- `tasks/004-implementar-importacao-erp-flex-no-backend.md`

## Criterios de conclusao
- existe extensao instalavel em ambiente de desenvolvimento
- a extensao reconhece ao menos uma pagina/padrao suportado do ERP
- a extensao envia importacao para a API e trata sucesso, erro e duplicidade

## Instrucoes de implementacao
- priorizar arquitetura simples e adaptavel
- preferir coleta de dados estruturados do ERP quando disponiveis; cair para DOM apenas quando necessario
- registrar claramente os pontos que dependem de discovery em ambiente ERP real

## Validacao esperada
- build/check da extensao
- teste manual de instalacao local
- teste manual de fluxo de importacao com API do backend

## Entregaveis esperados
- pasta da extensao no repositorio
- manifesto e scripts do MVP
- documentacao minima de instalacao/uso
- task e indice atualizados

## Riscos ou ambiguidades
- o ERP real pode exigir ajuste no seletor, parsing ou estrategia de captura

## Resultado da execucao
- `front-end`: criada a pasta isolada `browser-extension/` com popup acessivel, script de coleta da pagina ERP e documentacao minima de instalacao/uso.
- `backend`: a extensao foi conectada ao fluxo real ja existente de `/auth/login` e `POST /production-orders/imports/erp-flex`, sem alterar contrato nem endpoint do backend.
- Decisoes tecnicas: uso de `manifest_version: 3`, armazenamento apenas de `apiBaseUrl`, `userEmail`, `accessToken` e resumo da ultima importacao em `chrome.storage.local`; a senha e usada somente para renovar sessao e nao e persistida.
- Trade-offs: como a URL real do ERP Flex ainda nao foi confirmada, o manifesto ficou com `host_permissions` amplas para o MVP e o extrator usa heuristicas genericas de JSON estruturado e DOM, com necessidade de ajuste fino no discovery real.
- Relacao com contrato: a extensao envia payload aderente ao schema de `ImportProductionOrderFromErpFlexRequest` e trata respostas de `201`, `401` e `409` previstas em `contracts/openapi.yaml`.

## Arquivos alterados
- `browser-extension/manifest.json`
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/background.js`
- `browser-extension/src/content-script.js`
- `browser-extension/src/popup.js`
- `browser-extension/package.json`
- `browser-extension/scripts/check.mjs`
- `browser-extension/README.md`
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok
- Revisao manual do fluxo de mensagens da extensao contra o contrato e os endpoints reais do backend: ok
- Teste manual de instalacao local em navegador: nao executado neste ambiente
- Teste manual de fluxo de importacao com API do backend via navegador: nao executado neste ambiente

## Aderencia ao design system
- Stack de referencia visual: nao se aplica
- Tipo de referencia visual: nao se aplica
- Evidencias de aderencia: UI da extensao foi mantida minima, sem criar linguagem visual paralela ao sistema principal, com foco em pragmatismo operacional.
- Acessibilidade aplicada: labels explicitos, fluxo acionavel por teclado, mensagens em regiao `aria-live`, hierarquia semantica simples e feedback textual para erros/estado.

## Pendencias pos-task
- Restringir `host_permissions` e validar o padrao real de URL do ERP Flex apos discovery tecnico.
- Ajustar heuristicas do `content-script` com base na pagina real do ERP Flex para reduzir fragilidade de scraping por DOM.
- Executar instalacao manual da extensao e teste ponta a ponta com backend rodando e ordem real/representativa antes de concluir a Task 006.

## Status final
done
