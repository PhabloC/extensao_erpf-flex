# Change Request 060 - Restringir permissoes da extensao para publicacao na Chrome Web Store

## Status
done

## Tipo
shared

## Stacks envolvidos
- extensao-dois-pingos

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- nao se aplica

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
- nao se aplica

### Tipo de referencia visual
- ausente

### Fonte primaria visual
- nao se aplica

### Regra de aderencia visual
- nao se aplica

## Contexto de negocio

### Por que
A extensao estava pedindo acesso obrigatorio a todos os hosts HTTP e HTTPS, o que aumenta o risco de rejeicao ou de review mais lenta na Chrome Web Store.

### O que
Reduzir o escopo das permissoes do manifesto para o minimo coerente com o fluxo atual da extensao.

### Comportamento esperado
- a extensao deixar de declarar acesso obrigatorio amplo a todos os sites
- a coleta na pagina atual do ERP depender de `activeTab` e injecao programatica sob acao do usuario
- o acesso de rede do service worker ficar restrito apenas as origens de API realmente suportadas pela configuracao atual
- README e politica de privacidade refletirem o novo modelo de permissao
- a versao da extensao subir de forma compativel com a regra local de semver para mudanca de permissoes

### Fora de escopo
- alterar o fluxo funcional de importacao
- introduzir novos ambientes de API
- criar onboarding novo para permissao granular por dominio

## Dependencias
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`
- `tasks/change-requests/059-criar-politica-de-privacidade-para-a-extensao.md`

## Criterios de conclusao
- `manifest.json` remover `tabs` e os hosts obrigatorios amplos `http://*/*` e `https://*/*`
- `manifest.json` usar `activeTab`
- `manifest.json` restringir `host_permissions` as origens de API suportadas
- documentacao da extensao refletir o novo modelo
- `manifest.json` e `package.json` permanecerem sincronizados

## Resultado da execucao
- removido o acesso obrigatorio a todos os hosts e o `content_scripts` global do manifesto
- a extensao passou a operar a captura da pagina atual via `activeTab` e `chrome.scripting.executeScript`
- o service worker ficou restrito as APIs `https://api-dois-pingos.fasters.app/*` e `http://localhost/*`
- README e politica de privacidade foram atualizados para refletir a reducao de escopo
- a versao da extensao foi incrementada em `MAJOR` por mudanca de permissoes

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
