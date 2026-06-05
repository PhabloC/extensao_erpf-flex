---
name: componente
description: Cria ou refatora componentes no projeto `frontend/` seguindo a separacao entre `ui/`, `components/` e `layout/`. Use quando a tarefa envolver card, badge, secao, widget, bloco reutilizavel ou composicao visual.
metadata:
  short-description: Cria componentes reutilizaveis no frontend
---

# Componente

Use esta skill para construir pecas visuais reutilizaveis. O foco e decidir a camada certa e manter a API do componente pequena e clara.

## Quando usar

- novo componente visual
- refactor de componente grande
- extracao de trecho repetido
- criacao de card, badge, widget ou bloco reutilizavel

## Leitura inicial

- `AGENTS.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CODE_STYLE.md`
- `docs/ai/CLEAN_CODE.md`

## Workflow

### 1. Escolha a camada certa

- `ui/`: generico e agnostico
- `components/`: conhece contexto de dominio
- `layout/`: estrutura macro de pagina

### 2. Modele uma API pequena

- props bem tipadas
- sem prop bag generica demais
- sem responsabilidades misturadas
- sem chamada HTTP dentro do componente

### 3. Mantenha o componente facil de compor

- aceite composicao simples
- deixe estados visuais explicitos
- extraia utilitarios quando o render ficar denso

### 4. Feche com checks

Dentro de `frontend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run build`

## Exemplos

- "Criar status badge" -> se for generico, comeca em `ui/`; se conhecer regra de dominio, vai para `components/`
- "Extrair card repetido" -> tipar props, mover estilos para module.css e simplificar page chamadora
