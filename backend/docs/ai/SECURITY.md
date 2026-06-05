# Security

## Objetivo

Este arquivo define a linha minima de seguranca para o backend. O objetivo e proteger autenticacao, dados e integracoes sem espalhar regras soltas pelo projeto.

## Regras Obrigatorias

- Validar toda entrada com DTO + `class-validator`.
- Nao acessar banco, SDK externo ou segredo direto em controller.
- JWT deve usar segredo vindo de ambiente, nunca hardcoded para producao.
- Senhas devem ser hashadas com `bcrypt`.
- Nao retornar stack trace ou detalhes internos em respostas HTTP.
- Erros devem passar pelo filtro global e logs devem ficar no servidor.
- Secrets ficam em `.env` e exemplos seguros em `.env.example`.

## Auth E Autorizacao

- Proteger endpoints privados com guards.
- Tratar autenticacao e autorizacao como responsabilidades separadas.
- Nao confiar em dados enviados pelo cliente quando eles puderem ser derivados do token.
- Evitar tokens long-lived sem refresh strategy definida.

## HTTP E Superficie De Ataque

- Manter `helmet` habilitado.
- Revisar `CORS` conforme ambiente.
- Adicionar rate limiting em endpoints publicos quando o projeto evoluir.
- Nao expor endpoints de debug, SQL cru ou mensagens internas.

## Banco E Persistencia

- Usar migrations para mudancas de schema.
- Preferir usuarios de banco com privilegios minimos.
- Nao montar queries com interpolacao insegura.
- Nao salvar dados sensiveis sem necessidade real.

## Integracoes Externas

- Toda integracao deve passar por adapter/gateway.
- Aplicar timeout, retry e tratamento de erro em IO externo.
- Nao instanciar clients externos dentro de services de dominio.

## Checklist Rapido

- DTO validando tudo
- Guards protegendo endpoints privados
- Secrets fora do codigo
- Sem stack trace na resposta
- Migrations para schema
- Integracoes encapsuladas
- Todos os padrões e orientações descritos nos documentos acima devem ser utilizados para resolver problemas REAIS e não por antecipação. Evitar o overengineering.