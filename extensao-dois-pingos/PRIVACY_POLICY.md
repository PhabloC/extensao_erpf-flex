# Política de Privacidade - ERP Flex para Kanban Importer

Última atualização: 2026-07-03

## 1. Escopo

Esta Política de Privacidade descreve como a extensão ERP Flex para Kanban Importer acessa, usa, armazena e compartilha dados durante a importação de ordens de produção do ERP Flex para o sistema Kanban configurado pela empresa ou pelo usuário autorizado.

## 2. Finalidade única da extensão

A extensão tem como finalidade única permitir que usuários autorizados importem ordens de produção do ERP Flex para o sistema Kanban configurado.

A extensão não realiza rastreamento de navegação, publicidade, análise comportamental, venda de dados ou coleta de dados para finalidades não relacionadas à importação de ordens de produção.

## 3. Dados acessados pela extensão

Quando o usuário abre uma página suportada do ERP Flex e aciona a análise pela extensão, a extensão pode acessar dados visíveis ou estruturados relacionados à ordem de produção atual, incluindo:

- identificador externo da ordem;
- número da ordem;
- código e descrição do produto;
- quantidade e unidade;
- datas de emissão e previsão;
- cliente;
- variações e campos complementares da ordem;
- URL da página de origem no ERP.

Em cenários em que o ERP disponibiliza um endpoint JSON associado à página atual, a extensão pode ler esse retorno para montar a revisão da ordem com maior confiabilidade.

A extensão não coleta histórico de navegação, páginas visitadas fora do fluxo suportado, cliques, posição do mouse, rolagem, teclas digitadas ou comportamento do usuário.

## 4. Dados armazenados localmente

A extensão utiliza chrome.storage.local para armazenar somente os dados necessários ao funcionamento local, incluindo:

- URL base da API configurada pelo usuário;
- e-mail informado para autenticação;
- token de acesso da sessão;
- resumo da última importação realizada;
- identificadores da última importação;
- logs operacionais locais relacionados ao funcionamento da importação, como status, erros técnicos e data/hora da tentativa de importação.

Esses dados permanecem localmente no navegador do usuário até serem substituídos, limpos pela própria extensão ou removidos com a desinstalação/limpeza dos dados da extensão.

## 5. Dados que não são armazenados localmente

A senha informada pelo usuário para autenticação no sistema destino não é armazenada pela extensão. Ela é usada apenas no momento da autenticação ou renovação de sessão.

## 6. Como os dados são usados

Os dados acessados pela extensão são usados exclusivamente para:

- analisar a página atual suportada do ERP Flex;
- permitir a revisão manual da ordem antes do envio;
- autenticar o usuário no sistema destino configurado;
- enviar a ordem para criação ou atualização no Kanban;
- registrar feedback técnico local sobre a importação.

## 7. Compartilhamento de dados

A extensão não vende dados, não compartilha dados com redes de anúncios e não envia dados para terceiros para fins comerciais, publicitários, de análise comportamental ou de monetização.

Os dados da ordem e de autenticação são enviados somente para:

- a própria página ou origem do ERP Flex acessada pelo usuário, quando a extensão consulta dados estruturados disponíveis nessa origem;
- a API do sistema destino configurada pelo usuário ou pela empresa, quando o usuário solicita autenticação, criação ou atualização de ordem.

## 8. Permissões do navegador

A extensão utiliza permissões de navegador para:

- storage: salvar configurações, token, resumo de importação e registros técnicos locais;
- activeTab: analisar apenas a aba atual quando o usuário abre a extensão;
- scripting: executar o coletor de dados na aba atual quando necessário;
- host_permissions: permitir autenticação e importação apenas nas APIs suportadas pela configuração atual, `https://api-dois-pingos.fasters.app/*` e `http://localhost/*`.

As permissões são utilizadas exclusivamente para permitir a importação de ordens de produção entre os sistemas autorizados. A extensão não declara mais acesso obrigatório amplo a todos os sites.

## 9. Retenção e controle pelo usuário

O usuário pode:

- limpar a sessão local pela própria extensão;
- limpar os registros técnicos locais pela página interna de logs;
- alterar a URL da API e o e-mail salvos;
- remover todos os dados locais ao desinstalar a extensão ou limpar os dados da extensão no navegador.

## 10. Segurança

Os dados locais ficam armazenados no mecanismo local do navegador. O nível de proteção desses dados também depende da segurança do perfil do navegador e do dispositivo do usuário.

Dados de autenticação e dados de ordens de produção devem ser transmitidos apenas por conexões seguras HTTPS para os sistemas configurados e autorizados para o funcionamento da integração.

A extensão não divulga publicamente tokens, senhas ou outras informações de autenticação.

## 11. Alterações nesta política

Esta Política de Privacidade pode ser atualizada quando houver mudanças no comportamento da extensão, nas permissões utilizadas ou na forma de tratamento dos dados.

## 12. Contato

Em caso de dúvidas sobre esta Política de Privacidade ou sobre o tratamento de dados pela extensão, entre em contato:

Nome da empresa: Dois Pingos  
E-mail: seu-email@seudominio.com
