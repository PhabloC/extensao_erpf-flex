# Versionamento da extensao

## Fonte de verdade

A versao oficial da extensao e o campo `version` em:

- `extensao-dois-pingos/manifest.json`
- `extensao-dois-pingos/package.json`

Os dois arquivos devem permanecer sempre sincronizados.

A UI da extensao le a versao diretamente do `manifest.json` via `src/version.js`. Nao duplicar a versao em HTML, CSS ou scripts de tela.

## Formato

Use semver no padrao `MAJOR.MINOR.PATCH`, por exemplo `1.1.12`.

- `MAJOR`: mudancas incompativeis ou de alto impacto operacional
- `MINOR`: novas funcionalidades, novas telas, novos fluxos ou mudancas relevantes de UI/UX
- `PATCH`: correcoes de bug, ajustes visuais pequenos, textos, logs e refinamentos sem alterar o comportamento principal

## Quando incrementar

### MAJOR

Incremente `MAJOR`, zere `MINOR` e `PATCH`, quando houver, por exemplo:

- mudanca de permissoes do manifesto
- alteracao incompativel no fluxo de importacao
- mudanca de contrato que exige atualizacao manual do usuario
- remocao ou troca radical de telas principais da extensao

Exemplo: `1.4.2` -> `2.0.0`

### MINOR

Incremente `MINOR`, zere `PATCH`, quando houver, por exemplo:

- nova secao ou acao na popup
- novo tipo de captura ou filtro relevante
- novo painel interno da extensao
- melhoria visual estrutural perceptivel ao usuario

Exemplo: `1.1.12` -> `1.2.0`

### PATCH

Incremente apenas `PATCH` quando houver, por exemplo:

- correcao de bug
- ajuste de copy
- refinamento visual local
- melhoria de logs ou diagnostico sem mudar o fluxo principal

Exemplo: `1.1.12` -> `1.1.13`

## Obrigatorio em toda atualizacao da extensao

Sempre que alterar arquivos em `extensao-dois-pingos/`:

1. decidir se a mudanca exige `MAJOR`, `MINOR` ou `PATCH`
2. atualizar `manifest.json`
3. atualizar `package.json` com o mesmo valor
4. manter o rodape de versao nas telas sem hardcode manual
5. executar `cd extensao-dois-pingos && npm run check`

## Nao fazer

- nao manter versoes diferentes entre `manifest.json` e `package.json`
- nao escrever a versao manualmente no HTML das telas
- nao pular incremento quando a mudanca for entregue ao usuario
- nao usar prefixos como `v` no manifesto; o prefixo visual fica apenas na UI, se necessario

## Exemplos rapidos

| Mudanca | Nova versao |
| --- | --- |
| Corrigir texto de erro na popup | PATCH |
| Redesenhar banner de sucesso | PATCH |
| Adicionar filtro novo na popup | MINOR |
| Criar nova pagina interna da extensao | MINOR |
| Exigir nova permissao do navegador | MAJOR |
| Trocar endpoint ou fluxo de importacao de forma incompativel | MAJOR |
