# Clean Code

## Objetivo

Este arquivo define como manter o backend limpo, modular e facil de alterar sem espalhar regra por controller, repository e integracoes. A ideia e que cada camada tenha intencao clara e baixo acoplamento.

## Regras Principais

- Controller roteia e valida entrada; nao decide regra de negocio.
- Service orquestra regra de negocio; nao vira deposito de tudo.
- Repository persiste e consulta; nao carrega regra de dominio.
- Integracoes externas entram por adapter ou gateway.
- Efeitos colaterais secundarios entram por eventos e handlers quando fizer sentido.
- Cada classe deve ser facil de entender pelo nome e pela assinatura publica.
- Se a regra cresce, ela deve ser separada em casos de uso, strategies ou handlers em vez de inflar um service.

## Como Cada Camada Deve Funcionar

### Controller

Responsavel por:

- receber request
- aplicar DTO e guard
- devolver resposta HTTP

Nao deve:

- acessar ORM
- instanciar provider externo
- concentrar regra de negocio

### Service

Responsavel por:

- orquestrar fluxo de negocio
- chamar repository
- chamar gateways ou adapters
- emitir eventos quando necessario

Nao deve:

- falar HTTP
- escrever query direto
- formatar resposta pensando em controller especifico

### Repository

Responsavel por:

- consultas e persistencia
- detalhes do ORM
- carregamento de relacoes e filtros

Nao deve:

- validar regra de negocio
- decidir autorizacao
- emitir evento de dominio

## Exemplos

### Evitar

```ts
@Post()
async create(@Body() dto: CreateUserDto) {
  const exists = await this.orm.user.findUnique({ where: { email: dto.email } });

  if (exists) {
    throw new BadRequestException('Email duplicado');
  }

  const password = await bcrypt.hash(dto.password, 10);
  const user = await this.orm.user.create({
    data: { ...dto, password },
  });

  await this.analytics.track('user.created', user);

  return user;
}
```

Problemas:

- regra de negocio no controller
- ORM no endpoint
- integracao externa no mesmo fluxo
- responsabilidade demais no mesmo metodo

### Preferir

```ts
@Post()
create(@Body() dto: CreateUserDto) {
  return this.usersService.create(dto);
}
```

```ts
async create(dto: CreateUserDto) {
  await this.ensureEmailAvailable(dto.email);
  const passwordHash = await hashPassword(dto.password);
  const user = await this.usersRepository.create({ ...dto, passwordHash });
  this.eventEmitter.emit('user.created', { userId: user.id });

  return this.toPublicUser(user);
}
```

## Nomes Bons Vs Nomes Ruins

Evitar:

- `Manager`
- `Processor`
- `Util`
- `doStuff`
- `handle`

Preferir:

- `UsersService`
- `UsersRepository`
- `AnalyticsAdapter`
- `PaymentProcessorFactory`
- `buildRequestUser`

## Quando Quebrar Um Service

Quebre quando:

- o metodo tiver muitos passos e muitos `if`
- ele depender de repository, cache, fila, provider externo e formatacao ao mesmo tempo
- houver mais de uma regra variavel no mesmo fluxo
- o mesmo service estiver sendo alterado por motivos diferentes com frequencia

Nesses casos, considere extrair:

- use case
- strategy
- adapter
- event handler
- decorator/interceptor

## Sinais De Codigo Ruim

- Metodos longos com muitos passos e muitos `if`.
- Classes com nomes vagos como `Manager`, `Processor` ou `Util` sem contexto.
- Regra duplicada entre services.
- Dependencias externas instanciadas direto no dominio.
- Mudanca simples exigindo tocar em muitos arquivos sem necessidade.
- Repository que conhece autorizacao ou regra de negocio.
- Controller que sabe detalhes do ORM.

## Checklist Rapido

- Cada classe com responsabilidade clara
- Controller fino
- Service focado
- Repository sem regra de negocio
- Integracao externa encapsulada
- Evento usado para efeitos colaterais secundarios
- Nomes que explicam intencao

- Todos os padrões e orientações descritos nos documentos acima devem ser utilizados para resolver problemas REAIS e não por antecipação. Evitar o overengineering.
