# Regras para atualização do arquivo da task

Ao executar uma task, atualize o arquivo da própria task usando a estrutura já existente no repositório.

Use as regras abaixo para preencher os principais campos.

## Status
No começo da execução:
- defina como `in_progress`

Ao final:
- reflita o resultado final de forma consistente com `Status final`

## Resultado da execução
Escreva notas objetivas sobre:
- o que foi implementado
- o que não foi implementado
- decisões técnicas tomadas
- trade-offs relevantes
- artefatos do scaffold removidos, substituídos ou adaptados, quando aplicável

## Arquivos alterados
Liste todos os arquivos:
- modificados
- criados
- removidos
- substituídos

Prefira um caminho por linha.

## Validações executadas
Liste apenas validações realmente executadas.
Para cada uma, informe o resultado.

Exemplos:
- `testes automatizados: executados com sucesso`
- `lint: executado sem erros`
- `build: executado com sucesso`
- `revisão visual contra design system: validada manualmente`
- `typecheck: não executado neste contexto`

## Pendências pós-task
Liste:
- itens de continuação
- limitações conhecidas
- melhorias adiadas
- ambiguidades descobertas
- dívida técnica conscientemente não tratada por estar fora de escopo

## Status final
Use apenas:
- `done`
- `blocked`

## Critérios de conclusão
Quando fizer sentido, atualize os critérios de conclusão indicando se cada item foi atendido ou não.
Não marque um critério como atendido se ele não tiver sido realmente verificado.