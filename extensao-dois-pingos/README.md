# Browser Extension MVP

Extensao MV3 para importar uma Ordem de Producao aberta no ERP Flex para o backend deste projeto.

## Estrutura

- `manifest.json`: manifesto da extensao.
- `assets/icons/`: icones gerados da marca do produto para uso nativo da extensao.
- `popup.html` e `popup.css`: popup principal de conferencia da OP, status de mapeamento e configuracoes da extensao.
- `advanced-settings.html` e `src/advanced-settings.js`: pagina interna para configuracao da API, autenticacao e sessao.
- `logs.html` e `src/logs.js`: pagina interna para consulta e limpeza dos logs operacionais locais da extensao.
- `src/content-script.js`: reconhecimento da pagina e coleta dos campos da ordem.
- `src/background.js`: login no sistema destino, persistencia de token e chamada ao endpoint de importacao.
- `src/popup.js`: orquestracao da UI da extensao.

## Fluxo implementado

1. Usuario abre uma ordem no ERP Flex.
2. Usuario abre a extensao.
3. Extensao coleta os dados da pagina com prioridade para endpoint JSON e fallback por dados estruturados locais e DOM.
4. Quando a pagina retornar varias OPs, a popup lista as ordens encontradas e permite selecionar uma OP por vez com foco no `Codigo`.
5. A popup le o periodo de emissao atual do ERP e permite sobrescrever `de` e `ate` antes de revisar novamente a lista.
6. Extensao autentica no backend do sistema usando `/auth/login` quando necessario.
7. Extensao chama `POST /production-orders/imports/erp-flex`.
8. Extensao mostra conferencia dos dados, sucesso, duplicidade ou erro.

## Instalacao local

1. Abra `chrome://extensions` ou `edge://extensions`.
2. Ative `Modo do desenvolvedor`.
3. Clique em `Carregar sem compactacao`.
4. Selecione a pasta [extensao-dois-pingos](c:/Users/phabl/Desktop/projects/erp-flex-para-kanban/extensao-dois-pingos).

## Uso no MVP

1. Abra a pagina da ordem no ERP Flex.
2. Clique na extensao.
3. Informe a URL base do backend. Exemplo: `http://localhost:3000` ou `http://localhost:3000/api`.
4. Informe o e-mail do sistema.
5. Informe a senha apenas quando precisar renovar a sessao.
6. Se a pagina do ERP trouxer varias ordens, escolha a OP desejada no dropdown compacto da popup.
7. Se necessario, ajuste o periodo de emissao diretamente na popup e clique em `Fazer analise`.
8. Revise os dados capturados, com atencao ao `Codigo`, e clique em `Criar OP no Kanban`.

## Check local

```bash
cd extensao-dois-pingos
npm run check
```

## Preview visual sem ERP

1. Carregue a extensao em `chrome://extensions` ou `edge://extensions`.
2. Abra a popup.
3. Clique no icone de configuracoes.
4. Use `Carregar preview visual`.
5. A popup sera preenchida com um payload mockado equivalente ao print de referencia, sem depender de pagina ERP ou backend.

## Funcoes da engrenagem

- `Fazer analise`: rele a aba atual e atualiza a captura das OPs encontradas no ERP.
- `Abrir pagina capturada`: abre a URL da origem atualmente capturada.
- `Carregar preview visual`: injeta um estado mockado para revisar o layout.
- `Configuracao avancada`: abre uma pagina interna da extensao para configurar API, e-mail, senha, sessao e renovacao de token.

## Funcoes da lateral

- `Engrenagem`: abre a pagina interna de configuracao avancada.
- `Logs`: abre a pagina interna de logs locais da extensao, com atualizacao e limpeza do historico recente.

Se a extensao tiver sido recarregada com a pagina do ERP ja aberta, `Fazer analise` tenta reinjetar automaticamente o coletor na aba antes de falhar. Quando a aba nao puder receber scripts, a popup passa a orientar recarga da pagina suportada em vez de mostrar a mensagem crua do navegador.

## Validacao manual fim a fim

1. Inicie `backend` e `front-end` localmente.
2. Autentique no sistema web e confirme que a lista inicial de ordens carrega.
3. Instale a extensao em modo desenvolvedor e aponte para a API local.
4. Abra uma ordem real ou simulada do ERP Flex e execute a importacao.
5. Valide no popup se o retorno mostra `productionOrderId`, `externalOrderId`, `status` e `origin`.
6. Atualize o dashboard e confirme origem `ERP Flex`, id externo, URL de origem, horario de importacao e historico do evento.

## Rastreabilidade operacional entregue

- A extensao persiste um resumo da ultima importacao para conferencia rapida.
- A extensao tambem persiste logs operacionais locais para diagnostico rapido pela pagina interna de logs.
- O backend registra um snapshot bruto do payload coletado para auditoria tecnica.
- O front-end exibe origem, id externo, URL de origem, usuario importador e detalhes do evento de importacao.

## UI da popup

- segue a referencia registrada em `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- prioriza conferencia rapida dos dados da OP antes da criacao
- mantem configuracoes de API e sessao em painel secundario para nao competir com a CTA principal

## Limitacoes conhecidas

- O host do ERP Flex ainda nao foi restringido no manifesto porque o discovery real da URL nao foi feito.
- O extrator agora tenta o endpoint JSON da pagina antes de cair para bootstrap local e DOM, mas a pagina real do ERP ainda pode exigir ajuste fino do algoritmo de match.
- O token do sistema e salvo em `chrome.storage.local`; a senha nao e armazenada.
- Ainda nao existe teste automatizado com navegador real nesta etapa.
