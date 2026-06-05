# Change Request 009 - Tornar captura da extensao resiliente sem receiver na aba

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
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post`

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
- preservar a popup atual e ajustar apenas comportamento e feedback operacional.

## Contexto de negocio

### Por que
Durante o teste real da popup, a extensao passou a exibir `Could not establish connection. Receiving end does not exist.` ao tentar revisar a aba ativa. Isso interrompe a captura mesmo quando a pagina do ERP esta aberta.

### O que
Ajustar a extensao para detectar ausencia de `content-script` na aba ativa, reinjetar o receiver quando possivel e mostrar orientacao mais clara quando a aba nao puder receber mensagens.

### Comportamento esperado
- popup tenta se comunicar com a aba ativa
- se o receiver nao existir, a extensao tenta reinjetar o `content-script`
- se a reinjecao falhar, a popup mostra mensagem orientando recarregar a pagina suportada
- o preview mockado nao deve mascarar falhas da captura real

### Fora de escopo
- alteracao do contrato backend
- redesign da popup
- suporte a paginas de navegador sem `http` ou `https`

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: a extensao ja usa `tabs` e `host_permissions`; a reinjecao exige permissao `scripting`.
- Casos de erro: aba sem receiver, aba interna do navegador, extensao recarregada apos pagina ja aberta, falha de permissao na injecao.
- Decisoes humanas confirmadas: a captura real deve prevalecer sobre o preview local quando o usuario pedir revisao da aba.
- Casos de borda: popup aberta em aba nao suportada, pagina ERP em estado antigo, receiver removido apos hot reload da extensao.

## Especificacao tecnica

### Deve
- detectar `runtime.lastError` ou falha equivalente ao enviar mensagem para a aba
- tentar injetar `src/content-script.js` na aba ativa antes de falhar
- repetir a coleta apos reinjecao bem-sucedida
- limpar qualquer estado mockado quando a revisao real da aba for executada
- exibir erro orientado quando a aba nao puder receber o receiver

### Nao deve
- nao deixar a mensagem nativa crua do Chrome como feedback principal
- nao depender apenas de recarga manual da pagina quando a reinjecao for possivel
- nao alterar o payload de importacao

## Entradas
- `browser-extension/manifest.json`
- `browser-extension/src/popup.js`
- `browser-extension/src/content-script.js`
- `browser-extension/README.md`

## Dependencias
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`
- `tasks/change-requests/008-priorizar-captura-por-endpoint-json-do-erp-flex.md`

## Criterios de conclusao
- `Revisar aba ativa` nao expoe mais a mensagem crua `Receiving end does not exist`
- a extensao tenta reinjetar o receiver na aba suportada
- o usuario recebe orientacao clara quando estiver em aba nao suportada

## Validacao esperada
- `cd browser-extension && npm run check`
- revisao manual do fluxo de `Revisar aba ativa`

## Entregaveis esperados
- ajuste no manifesto para suportar reinjecao
- ajuste no `popup.js` para fallback e mensagem orientada
- task e indice atualizados

## Riscos ou ambiguidades
- algumas paginas podem bloquear reinjecao por politica do navegador
- a reinjecao pode nao resolver se a aba ativa nao for uma pagina `http` ou `https`

## Resultado da execucao
- `front-end/browser-extension`: a popup passou a detectar a ausencia de receiver ao falar com a aba ativa e tenta reinjetar `src/content-script.js` antes de desistir da captura.
- `front-end/browser-extension`: a extensao agora exige a permissao `scripting` no manifesto para suportar a reinjecao operacional do coletor.
- `front-end/browser-extension`: ao falhar em aba nao suportada ou sem receiver apos a reinjecao, a popup substitui a mensagem crua do navegador por uma orientacao objetiva para abrir ou recarregar a pagina do ERP Flex.
- `front-end/browser-extension`: a revisao real da aba agora limpa o estado anterior da popup quando a captura falha, evitando que o preview mockado continue mascarando o estado real.

## Arquivos alterados
- `browser-extension/manifest.json`
- `browser-extension/src/popup.js`
- `browser-extension/README.md`
- `tasks/change-requests/009-tornar-captura-da-extensao-resiliente-sem-receiver-na-aba.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; sem mudanca estrutural na popup, apenas melhora de comportamento e feedback operacional.

## Pendencias pos-task
- validar manualmente no navegador real se `Revisar aba ativa` consegue reinjetar o `content-script` em uma aba do ERP Flex aberta antes do reload da extensao.
- confirmar se a mensagem de orientacao cobre adequadamente abas nao suportadas e paginas internas do navegador.

## Status final
blocked
