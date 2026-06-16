# Change Request 042 - Adicionar atalho visual para exibir ou ocultar senha na configuracao avancada

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
ajuste fino sobre tela implementada com print complementar do usuario

### Fonte primaria visual
- `design-system/front/browser-extension/popup-importacao-erp-flex.md`
- print enviado pelo usuario em `2026-06-15` para a tela `Configuracao avancada`

### Regra de aderencia visual
- manter a composicao atual da tela `Configuracao avancada`, adicionando apenas um controle discreto no campo `Senha do sistema` para alternar entre valor oculto e visivel.

## Contexto de negocio

### Por que
Na tela de configuracao avancada, o usuario precisa conferir a senha digitada sem perder a capacidade de mantela protegida por padrao.

### O que
Adicionar um icone de olho no input `Senha do sistema` para alternar entre exibicao e ocultacao da senha.

### Comportamento esperado
- o campo continua ocultando a senha por padrao
- um botao com icone de olho aparece dentro ou junto ao campo de senha
- ao acionar o controle, a senha pode ser exibida e ocultada novamente
- o controle deve ser utilizavel por mouse e teclado, com nome acessivel claro

### Fora de escopo
- mudar o fluxo de autenticacao
- persistir a senha em storage
- redesenhar outros campos da tela avancada

## Review da spec

- [x] Permissoes definidas ou `nao se aplica`
- [x] Casos de erro mapeados
- [x] Decisoes de negocio confirmadas como humanas
- [x] Criterios de aceite objetivos e verificaveis
- [x] Casos de borda considerados

### Evidencias da review
- Permissoes: nao se aplica; o ajuste e apenas de interface local.
- Casos de erro: alternancia sem valor digitado, perda de foco apos clique no olho e nome acessivel ausente em botao apenas com icone.
- Decisoes humanas confirmadas: o usuario pediu explicitamente o atalho visual para ver e ocultar a senha.
- Casos de borda: campo vazio, multiplos toques no controle e navegacao por teclado.

## Especificacao tecnica

### Deve
- incluir um botao semantico para alternar o `type` do input entre `password` e `text`
- manter foco e usabilidade previsivel no campo e no botao
- expor `aria-label` e estado acessivel coerente no controle do olho
- preservar o layout escuro atual da tela avancada

### Nao deve
- nao transformar o controle em elemento nao focavel
- nao depender apenas de cor para indicar a acao do botao

## Entradas
- `extensao-dois-pingos/advanced-settings.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/advanced-settings.js`

## Dependencias
- `tasks/change-requests/030-mover-seta-de-voltar-para-o-canto-esquerdo-da-configuracao-avancada.md`

## Criterios de conclusao
- o input `Senha do sistema` exibe um controle de olho para mostrar ou ocultar a senha
- o campo continua seguro por padrao
- o controle e acessivel por teclado e tem nome acessivel claro
- `cd extensao-dois-pingos && npm run check` permanece ok

## Validacao esperada
- `cd extensao-dois-pingos && npm run check`
- verificacao manual da tela avancada no navegador

## Entregaveis esperados
- ajuste de markup da tela avancada
- ajuste visual do campo de senha
- ajuste de comportamento do script da tela avancada
- task e indice atualizados

## Riscos ou ambiguidades
- o espaco util do campo e compacto; o controle do olho precisa entrar sem reabrir overflow nem reduzir legibilidade do texto

## Resultado da execucao
- `extensao-dois-pingos`: a tela `Configuracao avancada` recebeu um botao de olho acoplado ao campo `Senha do sistema`, permitindo alternar entre exibicao e ocultacao sem mudar o fluxo da pagina.
- `extensao-dois-pingos`: o controle passa a manter a senha oculta por padrao, atualiza o nome acessivel conforme o estado e volta automaticamente ao modo oculto apos autenticar ou limpar a sessao.
- Decisao tecnica: o icone foi implementado como `button` semantico com `svg` inline para preservar foco por teclado, nome acessivel e encaixe visual no campo existente sem introduzir dependencias.

## Arquivos alterados
- `extensao-dois-pingos/advanced-settings.html`
- `extensao-dois-pingos/popup.css`
- `extensao-dois-pingos/src/advanced-settings.js`
- `tasks/change-requests/042-adicionar-atalho-visual-para-exibir-ou-ocultar-senha-na-configuracao-avancada.md`
- `tasks/000-index.md`

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok

## Aderencia ao design system
- fonte primaria visual usada por stack: `design-system/front/browser-extension/popup-importacao-erp-flex.md` com print complementar da tela avancada enviado em `2026-06-15`
- tipo de referencia visual usada por stack: ajuste fino sobre tela implementada
- evidencias de fidelidade visual: o layout escuro, a hierarquia do cabecalho e os campos existentes foram preservados; apenas o campo de senha ganhou o controle discreto de olho alinhado ao padrao atual
- desvios aprovados ou riscos residuais: nenhum desvio visual relevante; a validacao final em navegador real segue recomendada

## Acessibilidade aplicada
- o controle do olho foi implementado como `button`, ficando acessivel por teclado
- o botao recebe `aria-label`, `aria-pressed` e `aria-controls` coerentes com o estado do campo
- a senha segue oculta por padrao e o ajuste nao depende apenas de cor para comunicar a acao

## Pendencias pos-task
- verificar manualmente no navegador o encaixe fino do icone em diferentes comprimentos de senha

## Status final
done
