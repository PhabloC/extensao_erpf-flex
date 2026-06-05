---
name: modal
description: Cria ou refatora modais no projeto `frontend/` seguindo o padrao do repositorio. Use quando a tarefa envolver dialog, confirmacao, formulario em modal, abertura por estado, acoes primarias e secundarias ou controle de overlay.
metadata:
  short-description: Cria modais no padrao do frontend
---

# Modal

Use esta skill para montar modais sem acoplar regra de negocio no componente base. O ponto central e separar o `ui/Modal` da composicao de dominio.

## Quando usar

- modal de confirmacao
- modal com formulario
- dialog de detalhes
- abertura e fechamento controlados por estado
- refatoracao de overlay improvisado

## Leitura inicial

- `AGENTS.md`
- `docs/ai/COMPONENT_REUSE.md`
- `docs/ai/CLEAN_CODE.md`
- `docs/ai/SECURITY.md` se houver input sensivel

## Workflow

### 1. Decida a divisao entre base e dominio

- `src/ui/Modal`: estrutura base do dialog
- `src/components/*`: conteudo especifico de dominio dentro do modal
- hook ou page: controla `isOpen`, `onClose` e side effects

### 2. Mantenha o fluxo previsivel

- abertura e fechamento explicitos
- acoes primaria e secundaria claras
- loading e erro visiveis quando houver submit
- nao esconder logica de negocio dentro do `ui/Modal`

### 3. Cuide da experiencia minima

- fechar com acao clara
- evitar modal gigante com responsabilidade demais
- se virar fluxo longo, avaliar pagina ou drawer em vez de modal

### 4. Feche com checks

Dentro de `frontend/`, rode:

- `npm run lint`
- `npm run test`
- `npm run build`

## Exemplos

- "Criar modal de excluir usuario" -> `ui/Modal` + componente de confirmacao + callback de acao no hook ou page
- "Criar modal de editar perfil" -> formulario separado dentro do modal, submit indo para service
