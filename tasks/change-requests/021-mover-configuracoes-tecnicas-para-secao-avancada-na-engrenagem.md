# Change Request 021 - Mover configuracoes tecnicas para secao avancada na engrenagem

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
- a popup deve priorizar revisão da OP e deixar configurações técnicas menos expostas, mas ainda acessíveis pelo painel da engrenagem.

## Contexto de negocio

### Por que
Os campos de API, credenciais e sessão são necessários tecnicamente, mas poluem a leitura operacional da popup quando ficam expostos diretamente.

### O que
Criar uma subseção `Configuração avançada` dentro do painel da engrenagem e mover para lá os campos técnicos de API, credenciais e sessão.

### Comportamento esperado
- painel da engrenagem continua exibindo ações rápidas
- configurações técnicas ficam recolhidas em `Configuração avançada`
- usuário ainda consegue editar API, e-mail, senha e limpar sessão quando precisar

### Fora de escopo
- remoção definitiva desses campos
- mudança do fluxo de autenticação

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudança.
- Casos de erro: perda de acesso às configurações, painel avançado confuso, sessão ficar escondida demais.
- Decisoes de negocio confirmadas: configurações devem ir para uma área avançada.
- Casos de borda: usuário novo sem API configurada, sessão vazia, necessidade de renovar senha rapidamente.

## Especificacao tecnica

### Deve
- criar subseção `Configuração avançada` dentro do painel da engrenagem
- mover URL da API, e-mail, senha, resumo de sessão e ação de limpar sessão para dentro dela
- manter ações rápidas fora dessa subseção

### Nao deve
- nao remover a capacidade de configurar a extensão
- nao deixar os campos técnicos visíveis por padrão no mesmo nível das ações rápidas

## Entradas
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`

## Dependencias
- `tasks/change-requests/006-ajustar-largura-da-popup-e-ampliar-funcoes-da-engrenagem.md`

## Criterios de conclusao
- painel da engrenagem passa a ter subseção `Configuração avançada`
- campos técnicos ficam dentro dela

## Validacao esperada
- `cd browser-extension && npm run check`
- revisão manual da popup

## Entregaveis esperados
- ajuste de HTML, CSS e JS
- task e indice atualizados

## Riscos ou ambiguidades
- o nível ideal de recolhimento pode exigir refinamento visual posterior

## Resultado da execucao
- `front-end/browser-extension`: o painel da engrenagem passou a exibir as ações rápidas separadas de uma subseção recolhível `Configuracao avancada`.
- `front-end/browser-extension`: URL da API, e-mail, senha, resumo de sessão e ação de limpar sessão foram movidos para dentro dessa área avançada.
- `front-end/browser-extension`: o comportamento de expandir/recolher foi conectado no `popup.js`, preservando o restante do fluxo da extensão.

## Arquivos alterados
- `browser-extension/popup.html`
- `browser-extension/popup.css`
- `browser-extension/src/popup.js`
- `tasks/change-requests/021-mover-configuracoes-tecnicas-para-secao-avancada-na-engrenagem.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd browser-extension && npm run check`: ok

## Aderencia ao design system
- mantida; o painel da engrenagem ficou mais limpo e prioriza ações operacionais

## Pendencias pos-task
- validar manualmente no navegador se o nível de recolhimento da `Configuracao avancada` ficou confortável para o uso real.

## Status final
blocked
