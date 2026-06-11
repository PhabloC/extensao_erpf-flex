# Change Request 035 - Adicionar confirmacao, anti-duplicidade e feedback claro na criacao da OP

## Status
done

## Tipo
shared

## Stacks envolvidos
- front-end

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- `contracts/openapi.yaml#/paths/~1production-orders~1imports~1erp-flex/post` (sem alteracao de contrato; a extensao deve consumir de forma mais clara os cenarios `201`, `400`, `401` e `409` ja previstos)

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
front-end

### Tipo de referencia visual
artefato documental com print derivado e extensao funcional dos estados nao cobertos

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`

### Regra de aderencia visual
- manter a popup compacta e a hierarquia atual do CTA principal, adicionando uma confirmacao curta com os dados da OP selecionada e estados de loading, sucesso e erro sem criar layout paralelo ao fluxo principal.

## Contexto de negocio

### Por que
O fluxo atual permite acionar `Criar OP no Kanban` de forma imediata, sem uma ultima confirmacao dos dados selecionados e sem blindagem suficiente contra reenvio por clique duplo. Isso aumenta o risco operacional de criar ordem errada, repetir submissao e deixar o usuario sem diagnostico claro quando a API falha ou retorna duplicidade.

### O que
Adicionar uma etapa de confirmacao antes da criacao da OP, exibindo os dados da ordem atualmente selecionada, bloquear reenvio durante a operacao, sinalizar loading diretamente no botao de criacao, mostrar `check` ao concluir com sucesso e retornar mensagens de erro claras com o motivo da falha.

### Comportamento esperado
- ao clicar em `Criar OP no Kanban`, a extensao pede confirmacao antes de enviar a requisicao
- a confirmacao traz os dados da OP atualmente selecionada na popup para conferencia final
- ao confirmar, a extensao impede clique duplo e qualquer segundo envio concorrente da mesma acao
- durante a criacao, o CTA principal exibe animacao de loading e fica indisponivel para novo clique
- quando a criacao concluir com sucesso, o CTA principal exibe um `check` e o feedback textual confirma a criacao
- quando a criacao falhar, a popup informa claramente que houve erro e qual foi o erro retornado ou inferido
- quando a API indicar duplicidade, a popup deixa claro que a OP ja existe e nao trata isso como sucesso silencioso

### Fora de escopo
- criar novo endpoint de confirmacao no backend
- alterar o contrato OpenAPI
- redesenhar a popup fora do necessario para acomodar os novos estados

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: sem mudanca; a extensao continua exigindo sessao/autenticacao ja previstas para operacoes de escrita.
- Casos de erro: falha de rede, `401`, `400`, `409`, erro tecnico sem mensagem estruturada, clique duplo e usuario confirmar a OP errada.
- Decisoes de negocio confirmadas: a criacao da OP deve exigir confirmacao final e a duplicidade deve ser explicitada ao usuario.
- Casos de borda: requisicao lenta, fechamento da popup durante loading, OP alterada entre analise e confirmacao e click repetido no CTA principal.

## Especificacao tecnica

### Deve
- abrir confirmacao explicita antes do envio da importacao
- exibir na confirmacao os dados essenciais da OP selecionada, no minimo numero/codigo, descricao, quantidade e prazo quando disponivel
- atrelar a confirmacao ao registro atualmente selecionado na popup, sem reaproveitar dados de uma OP anterior
- bloquear clique duplo por estado local de submissao em andamento
- impedir novo envio enquanto houver requisicao pendente, mesmo se o usuario clicar repetidamente ou reabrir a confirmacao durante o loading
- exibir loading no proprio CTA principal de criacao
- exibir `check` no CTA principal apos sucesso confirmado pela API
- traduzir o erro retornado para mensagem clara e acionavel, preservando detalhes relevantes quando existirem
- diferenciar visual e textualmente os cenarios de sucesso, duplicidade e falha tecnica
- manter feedback acessivel via regiao `aria-live`

### Nao deve
- nao disparar a requisicao de importacao antes da confirmacao do usuario
- nao permitir envios concorrentes da mesma OP por repeticao de clique local
- nao esconder o motivo do erro atras de mensagem generica quando a API devolver detalhe utilizavel
- nao tratar `409` de duplicidade como sucesso

## Entradas
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- `contracts/openapi.yaml`

## Dependencias
- `tasks/change-requests/028-adicionar-botao-de-fazer-analise-para-buscar-ops-do-erp.md`
- `tasks/change-requests/033-evitar-auto-selecao-incorreta-de-op-na-extensao.md`
- `tasks/change-requests/034-separar-unidade-da-quantidade-na-popup-e-tratar-000-como-casas-decimais.md`

## Criterios de conclusao
- clicar em `Criar OP no Kanban` passa a exigir confirmacao final
- a confirmacao mostra os dados da OP selecionada para conferencia
- o CTA principal entra em loading ao confirmar e nao aceita clique duplo durante a operacao
- sucesso exibe `check` e mensagem positiva clara
- falha exibe mensagem clara com o erro retornado ou identificado
- duplicidade exibe mensagem dedicada informando que a OP ja existe
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- teste manual da popup cobrindo sucesso, erro tecnico e resposta de duplicidade
- teste manual repetindo clique rapido no CTA principal para provar que apenas uma requisicao e enviada

## Entregaveis esperados
- fluxo de confirmacao da criacao na popup
- bloqueio local de reenvio por clique duplo
- feedback visual e textual para loading, sucesso, duplicidade e erro
- task e indice atualizados

## Riscos ou ambiguidades
- se a API falhar sem corpo estruturado, a extensao precisara aplicar fallback de mensagem que ainda seja claro para o usuario
- se o usuario mudar a selecao da OP logo antes da confirmacao, o estado exibido e o payload enviado precisam permanecer sincronizados

## Resultado da execucao
- `front-end/extensao-dois-pingos`: a popup passou a abrir uma confirmacao inline com os dados principais da OP selecionada antes do envio para o sistema destino.
- `front-end/extensao-dois-pingos`: a criacao agora bloqueia reenvio concorrente, aplica loading visual no CTA principal e no CTA de confirmacao e exibe `check` apenas quando a API confirma criacao com sucesso.
- `front-end/extensao-dois-pingos`: erros de configuracao, sessao, rede, validacao e duplicidade passaram a ser exibidos com copy mais clara e, quando disponivel, com detalhes retornados pela API.
- Decisoes tecnicas: a confirmacao foi implementada como painel inline acessivel dentro da popup, evitando modal separado e preservando a hierarquia compacta definida pela referencia visual.
- Trade-offs: o fluxo continua exigindo configuracao previa de API e e-mail na engrenagem; a task melhorou a mensagem e o feedback, mas nao removeu essa dependencia operacional.
- Relacao com contrato: nenhuma mudanca em `contracts/openapi.yaml`; a extensao apenas passou a consumir com mais fidelidade os cenarios `201`, `400`, `401` e `409` do endpoint de importacao.
- Relacao com a referencia visual: a popup manteve o layout principal e adicionou apenas um bloco compacto de confirmacao para cobrir o estado novo que nao existia no print/documento base.

## Arquivos alterados
- `extensao-dois-pingos/popup.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/popup.js`
- `extensao-dois-pingos/src/background.js`
- `tasks/change-requests/035-adicionar-confirmacao-anti-duplicidade-e-feedback-claro-na-criacao-da-op.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
- teste manual da popup com API real, duplicidade e erro de rede: nao executado neste ambiente

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tipo de referencia visual usada por stack: artefato documental com print derivado
- evidencias de fidelidade visual: CTA principal, hierarquia geral, card principal e fluxo de conferencia foram preservados; a confirmacao entrou como painel compacto no mesmo idioma visual da popup
- desvios aprovados ou riscos residuais: foi necessario introduzir um estado novo de confirmacao nao coberto pelo print; o desvio foi limitado a um bloco inline para manter a compacidade e a legibilidade

## Acessibilidade aplicada
- a confirmacao usa botoes nativos, continua navegavel por teclado e pode ser fechada com `Escape`
- o foco vai para a acao principal da confirmacao ao abrir e retorna ao elemento anterior ao fechar
- o feedback operacional continua em regiao `aria-live`
- loading e sucesso agora sao perceptiveis por texto e nao apenas por cor

## Pendencias pos-task
- validar manualmente com a API real os cenarios de `201`, `400`, `401`, `409` e falha de rede para calibrar a copy final das mensagens
- confirmar com o sistema destino se os detalhes de validacao retornam sempre em `message` e/ou `details`, para eventual refinamento adicional

## Status final
done
