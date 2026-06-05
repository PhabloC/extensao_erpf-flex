# Clean Code

## Objetivo

Este arquivo define como manter o frontend simples de entender, barato de evoluir e previsivel para devs e agentes. A regra principal e reduzir acoplamento, ambiguidade e codigo que exige contexto demais para ser alterado.

## Regras Principais

- Cada componente, hook ou service deve ter uma responsabilidade clara.
- Se um arquivo crescer demais, dividir por responsabilidade antes de adicionar mais regra.
- Evitar componentes gigantes que buscam dado, tratam estado, formatam resposta e renderizam tudo ao mesmo tempo.
- Preferir nomes que expliquem intencao, nao implementacao.
- Evitar `if`, `switch` e branching longos quando um pattern resolver melhor.
- Cada modulo deve ser facil de ler sem precisar abrir muitos arquivos auxiliares para entender o basico.
- O codigo deve ser escrito para manutencao, nao apenas para funcionar agora.

## Como Dividir Responsabilidades

### Page

Responsavel por:

- montar a tela
- chamar hooks
- compor layout e componentes

Nao deve:

- fazer request direto
- transformar resposta da API na mao
- carregar validacao complexa misturada com render

### Hook

Responsavel por:

- controlar loading
- tratar erro
- encapsular efeitos e estado derivado

Nao deve:

- renderizar JSX
- conhecer detalhes de layout
- centralizar mais de um fluxo de negocio sem relacao

### Service

Responsavel por:

- chamar API
- adaptar resposta
- centralizar contratos de integracao

Nao deve:

- conhecer modal, router ou detalhes de UI
- manipular estado visual

## Exemplos

### Evitar

```tsx
export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setLoading(true);

    axios
      .get('/users')
      .then((response) => {
        setUsers(
          response.data.map((item) => ({
            label: item.first_name + ' ' + item.last_name,
          })),
        );
        setLoading(false);
      })
      .catch(() => {
        setError('Erro');
        setLoading(false);
      });
  }, []);

  return <div>{/* muita responsabilidade junta */}</div>;
}
```

Problemas:

- request direto na page
- adaptacao de dados no componente
- estado de integracao misturado com render
- tipagem fraca

### Preferir

```tsx
export default function DashboardPage() {
  const { data, isLoading, error } = useDashboardUsers();

  return <DashboardView data={data} isLoading={isLoading} error={error} />;
}
```

```ts
export function useDashboardUsers() {
  return useUsersQuery();
}
```

```ts
export async function getUsers() {
  const response = await apiClient.get('/users');
  return response.data.map(adaptUser);
}
```

## Nomes Bons Vs Nomes Ruins

Evitar:

- `handleData`
- `processItems`
- `useMain`
- `helper`

Preferir:

- `useDashboardSummary`
- `adaptUser`
- `getStatusStrategy`
- `formatTaskDeadline`

## Quando Quebrar Um Arquivo

Quebre quando:

- o componente tiver muitos estados sem relacao
- o hook estiver cuidando de varios fluxos diferentes
- a page estiver com logica demais para request, modal, form e tabela ao mesmo tempo
- o mesmo trecho de transformacao aparecer em mais de um lugar

## Sinais De Codigo Ruim

- Props demais sem coesao.
- Hook que controla formulario, request, modal, tabela e navegacao ao mesmo tempo.
- Service que conhece detalhes de UI.
- Duplicacao de regra de formatacao em varios componentes.
- Nome generico como `handleData`, `process`, `manager`, `helper` sem contexto.
- Comentario explicando codigo confuso em vez de o codigo estar claro.
- Componente que so funciona porque depende de efeitos colaterais espalhados.

## Checklist Rapido

- Responsabilidade unica por modulo
- Nomes claros
- Sem duplicacao obvia
- Logica fora da UI quando crescer
- Patterns usados quando evitam branching grande
- Request e adaptacao fora da page
- Hook com foco claro

- Todos os padrões e orientações descritos devem ser utilizados para resolver problemas reais e nao por antecipação. Evitar overengineering.