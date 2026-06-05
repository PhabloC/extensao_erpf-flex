# Backlog unico do projeto

## Resumo do projeto

Projeto reduzido para as stacks ativas `front-end` (React/Vite) e `backend`, preparando o terreno para a futura extensao de navegador que importara dados do ERP Flex para o kanban de Ordem de Producao.

## Perfil do projeto

- stack web escolhida: front-end
- mobile: nao

## Classificacao do design-system por stack

- front: artefato documental
- fonte primaria visual front: `design-system/front/README.md`
- mobile: nao se aplica
- fonte primaria visual mobile: nao se aplica

## Review consolidada da spec

- permissoes definidas: usuarios autenticados criam, importam e movem ordens; consulta segue sessao autenticada do sistema.
- casos de erro mapeados: auth ausente, payload invalido, lista vazia, ordem nao encontrada, duplicidade por ERP, falha de rede, pagina ERP nao suportada, DOM incompleto, transicao de status invalida.
- decisoes humanas pendentes de confirmacao: etapa inicial padrao do kanban; chave externa oficial do ERP Flex; padrao real de URL/pagina suportada no ERP.
- casos de borda relevantes: importacao repetida, campos opcionais ausentes, strings com formatacao irregular do ERP, refresh apos importacao, ordem sem observacao, click duplicado na extensao.

## Arquivos analisados

- `AGENTS.md`
- `GUIDE.md`
- `requirements/...`
- `design-system/front/...`
- `contracts/openapi.yaml`
- `front-end/docs/ai/...`
- `backend/docs/ai/...`

## Premissas adotadas

- backlog unico em `tasks/`
- contrato central em `contracts/openapi.yaml`
- `next-js` e `mobile` nao fazem mais parte da estrutura ativa do repositorio
- a extensao de navegador sera tratada como componente complementar do produto dentro do backlog raiz
- o cadastro manual continuara existindo mesmo com a importacao ERP

## Principais riscos e ambiguidades

- O backend e o contrato ainda contem um endpoint legado relacionado a mobile, que nao foi removido nesta limpeza documental.
- O contrato, o backend base, a interface web, o endpoint de importacao ERP e a extensao MVP foram definidos; a task 006 deixou a rastreabilidade tecnica pronta, mas a validacao ponta a ponta com o ERP real segue pendente.
- A captura real de dados no ERP Flex depende de discovery tecnico na pagina real do ERP.

## Estrategia de execucao

- Manter a governanca raiz.
- Comecar por contrato e modelo compartilhado.
- Implementar backend base e front-end base do dominio de Ordem de Producao.
- Adicionar o endpoint de importacao ERP no backend.
- Entregar a extensao de navegador como ponte operacional para a API.
- Fechar com rastreabilidade e validacao fim a fim.

## Tasks por tipo

### Shared

- [done] `tasks/change-requests/003-limpar-documentacao-pos-reducao-de-stacks.md` - Ajustar governanca e backlog para o perfil atual `front-end + backend`.
- [done] `tasks/change-requests/004-detalhar-requisitos-do-sistema.md` - Criar a base detalhada de requisitos do sistema e da integracao com ERP Flex.
- [done] `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md` - Definir contrato OpenAPI e modelo funcional do MVP de Ordem de Producao.
- [done] `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md` - Criar a extensao MVP para importar ordens do ERP Flex.
- [blocked] `tasks/006-fechar-fluxo-de-rastreabilidade-e-validacao-fim-a-fim.md` - Consolidar rastreabilidade da origem ERP e validar o fluxo ponta a ponta.

### Front

- [done] `tasks/003-implementar-front-end-de-ordem-de-producao-e-kanban.md` - Implementar listagem, criacao manual, detalhe e quadro kanban no React/Vite.

### Back

- [done] `tasks/002-implementar-backend-de-ordem-de-producao.md` - Implementar modulo backend de Ordem de Producao, endpoints base e historico.
- [done] `tasks/004-implementar-importacao-erp-flex-no-backend.md` - Implementar endpoint de importacao ERP com validacao e deduplicacao.

### Mobile

- Nao se aplica

## Status inicial

- Estrutura ativa consolidada em `front-end` e `backend`.
- Task 001 - done
- Task 002 - done
- Task 003 - done
- Task 004 - done
- Task 005 - done
- Task 006 - blocked

## Dependencias cruzadas

- `tasks/change-requests/003-limpar-documentacao-pos-reducao-de-stacks.md`: removeu backlog e documentacao que dependiam de `next-js` e `mobile` ja excluidos da estrutura.
- `tasks/change-requests/004-detalhar-requisitos-do-sistema.md`: estabelece a base funcional e nao funcional para planejar backlog do MVP.
- `tasks/002-implementar-backend-de-ordem-de-producao.md`: depende de `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md`.
- `tasks/003-implementar-front-end-de-ordem-de-producao-e-kanban.md`: depende de `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md` e `tasks/002-implementar-backend-de-ordem-de-producao.md`.
- `tasks/004-implementar-importacao-erp-flex-no-backend.md`: depende de `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md` e `tasks/002-implementar-backend-de-ordem-de-producao.md`.
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`: depende de `tasks/001-definir-contrato-e-modelo-de-ordem-de-producao.md` e `tasks/004-implementar-importacao-erp-flex-no-backend.md`.
- `tasks/006-fechar-fluxo-de-rastreabilidade-e-validacao-fim-a-fim.md`: depende de `tasks/003-implementar-front-end-de-ordem-de-producao-e-kanban.md`, `tasks/004-implementar-importacao-erp-flex-no-backend.md` e `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`.

## Duvidas para validacao humana

- Confirmar em task futura se o endpoint legado de check de versao mobile deve ser removido do backend e do contrato.
- Validar os campos reais disponiveis no ERP Flex para importacao.
- Confirmar qual etapa inicial do kanban deve ser usada para ordens importadas.
- Confirmar qual identificador do ERP sera usado como chave oficial anti-duplicidade.

## Observacoes finais

- O backlog atual esta pronto para execucao incremental do MVP ERP Flex -> kanban seguindo a ordem 001 -> 002 -> 003/004 -> 005 -> 006.
