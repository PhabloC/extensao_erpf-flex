# Security

## Objetivo

Este arquivo define as regras minimas de seguranca para o frontend. Interface protegida melhora UX, mas seguranca real sempre depende do backend. O front deve evitar expor segredos, reduzir superficie de ataque e enviar dados de forma previsivel.

## Regras Obrigatorias

- Nunca salvar segredos reais em `localStorage`, `sessionStorage`, codigo fonte ou `VITE_*`.
- Variaveis `VITE_*` sao publicas por definicao. Use apenas para valores seguros de exposicao.
- Nao confiar em route guards como controle de seguranca real. Toda autorizacao critica deve ser validada no backend.
- Nao usar `dangerouslySetInnerHTML` sem sanitizacao forte e justificativa explicita.
- Validar formularios com `react-hook-form` + `zod` antes de enviar dados.
- Tratar tokens e sessoes como dados sensiveis. Evitar logs, prints e persistencia desnecessaria.
- Nao expor mensagens de erro internas, stack traces ou respostas completas de APIs em componentes.

## Auth E Sessao

- Preferir fluxo com cookies `httpOnly` quando o backend suportar.
- Se o projeto usar bearer token, manter o token no menor escopo possivel.
- Nunca colocar tokens em params de URL.
- Fazer logout limpando estado local, caches e dados sensiveis de tela.

## Consumo De API

- Centralizar requests em `services/http/`.
- Normalizar erros no client HTTP antes de chegar na UI.
- Nao concatenar URLs manualmente em componentes.
- Sempre tratar estados de erro, loading e expiracao de sessao.

## Boas Praticas De UI

- Escapar conteudo renderizado dinamicamente.
- Restringir upload por tipo e tamanho antes do envio.
- Evitar mostrar dados sensiveis completos em tabelas, modais e logs de debug.
- Revisar dependencias antes de adicionar bibliotecas novas.

## Checklist Rapido

- Nenhum segredo em `VITE_*`
- Nenhum `dangerouslySetInnerHTML` sem sanitizacao
- Formularios validados com Zod
- Erros sensiveis nao expostos ao usuario
- Tokens fora de URL e sem logs

- Todos os padrões e orientações descritos devem ser utilizados para resolver problemas reais e nao por antecipação. Evitar overengineering.