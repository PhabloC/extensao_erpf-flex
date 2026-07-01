# Guia para agentes — extensao de navegador

## Escopo

Este diretorio cobre a extensao MV3 em `extensao-dois-pingos/`.

## Leitura obrigatoria antes de alterar a extensao

- `docs/ai/VERSIONING.md`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `README.md`

## Regras operacionais

- manter a popup focada em acoes operacionais; detalhes tecnicos ficam nos logs
- usar `manifest.json` como fonte unica da versao exibida na UI
- sincronizar `manifest.json` e `package.json` em toda entrega
- validar com `cd extensao-dois-pingos && npm run check`

## Versionamento

Toda mudanca entregue na extensao deve avaliar incremento semver conforme `docs/ai/VERSIONING.md`.

Se a alteracao impactar usuario, UI, captura, importacao, permissoes ou diagnostico visivel, atualize a versao no mesmo conjunto de mudancas.
