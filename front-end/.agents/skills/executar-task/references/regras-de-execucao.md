# Regras complementares de execução

Estas regras complementam o comportamento principal definido em `SKILL.md`.

## Princípio central
Esta skill existe para executar uma task específica com segurança, rastreabilidade e disciplina de escopo.

Ela não existe para “adiantar o projeto inteiro”, nem para reinterpretar o planejamento livremente.

## Ordem obrigatória de raciocínio
Siga sempre esta ordem:

1. entender o contexto
2. entender a task
3. verificar dependências
4. executar somente o escopo
5. validar
6. documentar
7. sincronizar o índice

## O que fazer quando encontrar código de exemplo do scaffold
Se você identificar arquivos, componentes, rotas, páginas, serviços ou mocks claramente originados do scaffold e incompatíveis com o produto real:

- remova, substitua ou adapte quando isso for necessário para concluir a task
- registre essa ação no resultado da execução
- preserve apenas o que fizer parte da base estrutural oficial do projeto

## O que não fazer
Não faça nenhuma destas coisas:

- executar múltiplas tasks de uma vez
- implementar melhorias fora do escopo sem registro explícito
- inventar regra de negócio ausente
- inventar comportamento visual ausente no design system
- afirmar que validou algo que não validou
- manter placeholder só porque ele já existia
- reescrever o projeto inteiro quando uma mudança localizada resolve

## Quando marcar como blocked
Marque a task como `blocked` quando a conclusão segura depender de algo ausente ou indefinido.

Exemplos:
- dependência não concluída
- requisito ambíguo
- contrato não definido
- design system insuficiente para uma decisão importante
- limitação de ambiente ou ferramenta

## Como escrever um bom resultado de execução
O resultado da execução deve ser:
- objetivo
- verificável
- útil para o próximo agente ou desenvolvedor
- coerente com os arquivos alterados e com as validações executadas

## Como decidir entre done e blocked
Use `done` somente quando:
- o escopo da task foi concluído
- os critérios principais foram atendidos
- as validações aplicáveis foram executadas ou justificadas
- a task foi atualizada
- `tasks/000-index.md` foi atualizado

Use `blocked` quando:
- a task não puder ser concluída com segurança
- faltar informação crítica
- a dependência impedir o avanço real

## Formato recomendado para resposta final
A resposta final deve ser curta, objetiva e rastreável.
Ela deve permitir que um humano entenda rapidamente:
- o que foi feito
- onde foi alterado
- o que foi validado
- o que falta, se faltar algo