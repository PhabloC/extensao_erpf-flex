# Change Request 043 - Predefinir URLs de API local e producao na configuracao avancada

## Status
done

## Tipo
front

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
ajuste fino sobre tela implementada

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- tela implementada `Configuracao avancada`

### Regra de aderencia visual
- manter a composicao atual da tela `Configuracao avancada`, acrescentando apenas uma forma rapida de usar as URLs padrao de local e producao sem digitacao recorrente.

## Contexto de negocio

### Por que
O uso operacional alterna com frequencia entre ambiente local e ambiente de producao, e a necessidade de redigitar a URL base da API em cada troca torna a configuracao avancada desnecessariamente friccional.

### O que
Predefinir as URLs de API `http://localhost:3000` e `https://api-dois-pingos.fasters.app/api` na configuracao avancada da extensao.

### Comportamento esperado
- a tela avancada deve expor claramente as duas URLs padrao disponiveis
- o usuario deve conseguir aplicar uma das URLs padrao sem precisar digitá-la toda vez
- a persistencia da configuracao deve continuar funcionando normalmente
- a extensao deve continuar aceitando digitacao manual de outra URL, quando necessario

### Fora de escopo
- mudar o fluxo de autenticacao
- bloquear URLs customizadas
- alterar a popup principal

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; ajuste local de interface e persistencia da extensao.
- Casos de erro: aplicacao do preset de producao com `/api` duplicado, perda do valor salvo atual e conflito entre preset e digitacao manual.
- Decisoes humanas confirmadas: o usuario definiu explicitamente as duas URLs que devem ficar preconfiguradas.
- Casos de borda: storage vazio, URL salva antiga sem `/api`, alternancia repetida entre presets e uso de URL customizada digitada manualmente.

## Especificacao tecnica

### Deve
- expor os presets `Local` e `Producao` na tela `Configuracao avancada`
- aplicar normalizacao consistente para salvar `http://localhost:3000/api` e `https://api-dois-pingos.fasters.app/api`
- manter o campo editavel para URLs customizadas
- preservar acessibilidade por teclado e nomes compreensiveis nos controles adicionais

### Nao deve
- nao obrigar o usuario a redigitar a URL ao alternar entre os ambientes padrao
- nao quebrar configuracoes ja salvas na extensao

## Entradas
- `extensao-dois-pingos/advanced-settings.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/advanced-settings.js`
- `extensao-dois-pingos/src/background.js`

## Dependencias
- `tasks/change-requests/042-adicionar-atalho-visual-para-exibir-ou-ocultar-senha-na-configuracao-avancada.md`

## Criterios de conclusao
- a configuracao avancada passa a oferecer as URLs padrao de local e producao
- salvar ou autenticar usando os presets continua funcionando sem erro de normalizacao
- o campo continua aceitando URL customizada
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- verificacao manual da configuracao avancada no navegador

## Entregaveis esperados
- ajuste de markup da tela avancada
- ajuste visual dos controles de preset
- ajuste de comportamento do script da tela avancada
- garantia de persistencia coerente no background
- task e indice atualizados

## Riscos ou ambiguidades
- a interface compacta da tela avancada exige que os presets entrem sem poluir o formulario nem degradar a leitura do valor atual

## Resultado da execucao
- `extensao-dois-pingos`: a tela `Configuracao avancada` agora exibe chips de preset para `Producao` e `Local`, preenchendo a URL base da API com um clique.
- `extensao-dois-pingos`: o campo continua editavel para URLs customizadas e destaca visualmente quando o valor atual corresponde a um dos ambientes padrao.
- Decisao tecnica: os presets foram implementados apenas na camada da UI, reutilizando a normalizacao ja existente no fluxo de salvar e autenticar para evitar regressao de persistencia.

## Arquivos alterados
- `extensao-dois-pingos/advanced-settings.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/advanced-settings.js`
- `tasks/change-requests/043-predefinir-urls-de-api-local-e-producao-na-configuracao-avancada.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md` com base na tela avancada ja implementada
- tipo de referencia visual usada por stack: ajuste fino sobre tela implementada
- evidencias de fidelidade visual: a composicao escura, o bloco do formulario e a hierarquia visual existente foram preservados; os presets entram como controles compactos acima do campo de URL sem alterar a estrutura central da pagina
- desvios aprovados ou riscos residuais: nenhum desvio relevante; permanece recomendada a validacao manual em navegador real para conferir o encaixe fino dos chips

## Acessibilidade aplicada
- os presets foram implementados como `button`, ficando acessiveis por teclado
- o grupo recebe `aria-label` para explicitar o conjunto de URLs padrao
- o estado ativo de cada preset e exposto com `aria-pressed`, sem depender apenas de cor

## Pendencias pos-task
- validar manualmente no navegador o fluxo de alternancia entre `Producao`, `Local` e URL customizada

## Status final
done
