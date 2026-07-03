# Change Request 059 - Criar politica de privacidade para a extensao

## Status
done

## Tipo
shared

## Stacks envolvidos
- extensao-dois-pingos

## Perfil do projeto
- stack web escolhida: front-end
- mobile: nao

## Contrato
- nao se aplica

## Modo de execucao
single-stack

## Referencia de design system

### Stack de referencia visual
- nao se aplica

### Tipo de referencia visual
- ausente

### Fonte primaria visual
- nao se aplica

### Regra de aderencia visual
- nao se aplica

## Contexto de negocio

### Por que
A extensao precisa de uma politica de privacidade coerente com o comportamento real implementado para apoiar distribuicao, revisao de loja e transparencia com o usuario.

### O que
Documentar quais dados a extensao acessa, o que fica salvo localmente, o que e enviado para a API configurada pelo usuario e o que nao e armazenado.

### Comportamento esperado
- existir um documento de politica de privacidade proprio da extensao
- o texto refletir apenas comportamentos confirmados no codigo atual
- o README da extensao apontar claramente para esse documento
- a versao da extensao ser incrementada e sincronizada por haver mudanca dentro de `extensao-dois-pingos/`

### Fora de escopo
- publicar a politica em URL externa
- alterar permissoes do manifesto
- mudar o fluxo tecnico de captura ou importacao

## Dependencias
- `tasks/005-estruturar-extensao-de-navegador-para-importacao-erp-flex.md`
- `tasks/change-requests/056-documentar-contrato-operacional-da-api-para-a-extensao-erp-flex.md`

## Criterios de conclusao
- `extensao-dois-pingos/PRIVACY_POLICY.md` descrever coleta, uso, armazenamento local, compartilhamento e retencao dos dados
- o documento registrar que a senha nao e armazenada localmente
- o README da extensao referenciar a politica
- `manifest.json` e `package.json` permanecerem com a mesma versao

## Resultado da execucao
- criada a politica de privacidade em `extensao-dois-pingos/PRIVACY_POLICY.md`, baseada no comportamento real de `background.js`, `content-script.js` e `popup.js`
- documentado que a extensao salva localmente URL da API, e-mail, token de acesso, resumo da ultima importacao e logs operacionais, mas nao persiste a senha
- registrado que os dados de OP capturados no ERP sao enviados apenas para a API configurada pelo usuario quando ele aciona autenticacao ou importacao
- README atualizado com link direto para a politica e a versao da extensao incrementada em patch

## Validacoes executadas
- `cd extensao-dois-pingos && npm run check`: ok
