# Browser Extension MVP

Extensao MV3 para importar uma Ordem de Producao aberta no ERP Flex para o backend deste projeto.

## Estrutura

- `manifest.json`: manifesto da extensao.
- `popup.html` e `popup.css`: interface minima para configuracao e execucao da importacao.
- `src/content-script.js`: reconhecimento da pagina e coleta dos campos da ordem.
- `src/background.js`: login no sistema destino, persistencia de token e chamada ao endpoint de importacao.
- `src/popup.js`: orquestracao da UI da extensao.

## Fluxo implementado

1. Usuario abre uma ordem no ERP Flex.
2. Usuario abre a extensao.
3. Extensao coleta os dados da pagina com prioridade para JSON estruturado e fallback por DOM.
4. Extensao autentica no backend do sistema usando `/auth/login` quando necessario.
5. Extensao chama `POST /production-orders/imports/erp-flex`.
6. Extensao mostra sucesso, duplicidade ou erro.

## Instalacao local

1. Abra `chrome://extensions` ou `edge://extensions`.
2. Ative `Modo do desenvolvedor`.
3. Clique em `Carregar sem compactacao`.
4. Selecione a pasta [browser-extension](c:/Users/phabl/Desktop/projects/erp-flex-para-kanban/browser-extension).

## Uso no MVP

1. Abra a pagina da ordem no ERP Flex.
2. Clique na extensao.
3. Informe a URL base do backend. Exemplo: `http://localhost:3000` ou `http://localhost:3000/api`.
4. Informe o e-mail do sistema.
5. Informe a senha apenas quando precisar renovar a sessao.
6. Clique em `Importar ordem atual`.

## Check local

```bash
cd browser-extension
npm run check
```

## Validacao manual fim a fim

1. Inicie `backend` e `front-end` localmente.
2. Autentique no sistema web e confirme que a lista inicial de ordens carrega.
3. Instale a extensao em modo desenvolvedor e aponte para a API local.
4. Abra uma ordem real ou simulada do ERP Flex e execute a importacao.
5. Valide no popup se o retorno mostra `productionOrderId`, `externalOrderId`, `status` e `origin`.
6. Atualize o dashboard e confirme origem `ERP Flex`, id externo, URL de origem, horario de importacao e historico do evento.

## Rastreabilidade operacional entregue

- A extensao persiste um resumo da ultima importacao para conferencia rapida.
- O backend registra um snapshot bruto do payload coletado para auditoria tecnica.
- O front-end exibe origem, id externo, URL de origem, usuario importador e detalhes do evento de importacao.

## Limitacoes conhecidas

- O host do ERP Flex ainda nao foi restringido no manifesto porque o discovery real da URL nao foi feito.
- O extrator usa heuristicas genericas para JSON e DOM; a pagina real do ERP pode exigir ajuste fino de seletores e aliases.
- O token do sistema e salvo em `chrome.storage.local`; a senha nao e armazenada.
- Ainda nao existe teste automatizado com navegador real nesta etapa.
