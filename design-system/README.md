# Design System

Esta pasta organiza as referencias visuais oficiais por stack.

## Estrutura oficial

- `design-system/front/`: fonte visual oficial do front-end
- `design-system/templates/`: material opcional de apoio, sem papel automatico de fonte primaria visual

Cada subpasta de stack pode assumir dois papeis:

- conter artefatos de design system propriamente ditos
- conter uma aplicacao completa de prototipo visual, mesmo sem funcionalidade real

## Regras de uso

- task `front` e execucao em `front-end/` devem olhar primeiro para `design-system/front/`
- task `shared` com UI em mais de uma stack deve registrar separadamente as fontes visuais de cada stack
- `design-system/templates/` so pode orientar implementacao quando a task apontar isso explicitamente

Quando houver uma aplicacao-prototipo visual na subpasta relevante, ela deve ser tratada como fonte primaria visual para a stack correspondente. Nesse caso, as telas implementadas precisam seguir fielmente a composicao, hierarquia, componentes, estados e fluxo visual da aplicacao de exemplo, salvo desvio explicitamente registrado e justificado na task.
