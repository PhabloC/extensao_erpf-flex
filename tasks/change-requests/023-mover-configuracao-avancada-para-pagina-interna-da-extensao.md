# Change Request 023 - Mover configuracao avancada para pagina interna da extensao

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
- `nao se aplica`

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
- a popup principal deve priorizar a revisão da OP; configurações técnicas devem sair dela e ir para uma página interna dedicada da extensão.

## Contexto de negocio

### Por que
O usuário quer que a engrenagem abra um dropdown simples com a opção `Configuracao avancada` e que essa opção leve para outra página interna da extensão com a configuração da API.

### O que
Substituir o painel atual da engrenagem por um menu/dropdown leve e mover as configurações técnicas para uma página separada dentro da extensão.

### Comportamento esperado
- clicar na engrenagem abre um dropdown
- o dropdown contém `Configuracao avancada`
- ao clicar, a extensão navega para uma página interna com configuração da API e sessão

### Fora de escopo
- mudança do fluxo de autenticação do backend
- redesign completo da popup principal

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: dropdown não fechar, navegação interna quebrada, perda das configurações já salvas.
- Decisoes de negocio confirmadas: configuração avançada deve sair da popup principal.
- Casos de borda: voltar da página avançada, sessão vazia, abertura em popup compacta.

## Especificacao tecnica

### Deve
- trocar a engrenagem por dropdown/menu leve
- criar página interna dedicada para configuração da API, credenciais e sessão
- reaproveitar a persistência existente da extensão

### Nao deve
- nao deixar os campos técnicos ainda visíveis na popup principal
- nao quebrar revisão e importação da OP

## Entradas
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`
- `browser-extension/manifest.json`

## Dependencias
- `tasks/change-requests/021-mover-configuracoes-tecnicas-para-secao-avancada-na-engrenagem.md`
- `tasks/change-requests/022-corrigir-respeito-ao-hidden-nos-paineis-da-popup.md`

## Criterios de conclusao
- engrenagem abre dropdown
- `Configuracao avancada` leva a página interna da extensão
- configuração da API continua editável e funcional

## Validacao esperada
- `cd browser-extension && npm run check`
- revisão manual da popup e da nova página

## Entregaveis esperados
- ajuste de HTML/CSS/JS da popup
- nova página interna da extensão
- task e indice atualizados

## Riscos ou ambiguidades
- a navegação entre popup e página interna pode exigir refinamento visual posterior

## Resultado da execucao
- `front-end/browser-extension`: a engrenagem deixou de abrir o painel técnico atual e passou a abrir um dropdown/menu leve com ações operacionais e a opção `Configuracao avancada`.
- `front-end/browser-extension`: foi criada a página interna `advanced-settings.html` para configuração da API, credenciais, sessão, limpeza de sessão e renovação de token.
- `front-end/browser-extension`: a popup principal passou a importar usando as configurações já salvas e orientar abertura da página avançada quando API ou e-mail estiverem ausentes.
- `front-end/browser-extension`: o `check` local foi ampliado para validar também a nova página e o novo script da configuração avançada.

## Arquivos alterados
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/advanced-settings.html`
- `browser-extension/src/popup.js`
- `browser-extension/src/advanced-settings.js`
- `browser-extension/scripts/check.mjs`
- `browser-extension/README.md`
- `tasks/change-requests/023-mover-configuracao-avancada-para-pagina-interna-da-extensao.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; a popup principal ficou mais focada na revisão da OP e a configuração técnica foi deslocada para uma página interna dedicada

## Pendencias pos-task
- validar manualmente no navegador o fluxo completo: engrenagem -> dropdown -> `Configuracao avancada` -> volta para `popup.html`.

## Status final
blocked
