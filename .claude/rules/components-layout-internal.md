# Componente LayoutInternal

`import { LayoutInternal } from '@/src/components/layout/Internal';`

## Interface

```ts
type LayoutInternalProps = {
  title: string;           // texto do <h1> da página
  description: string;     // subtítulo em cinza abaixo do título
  alias?: ReactNode;       // slot direito do cabeçalho (botões de ação, filtros, etc.)
  children: ReactNode;     // conteúdo principal da página
};
```

## Estrutura renderizada

```
<section flex-col gap-6>
  <div justify-between>
    <div>
      <h1>{title}</h1>
      <span>{description}</span>
    </div>
    {alias}          ← aparece apenas se fornecido
  </div>
  {children}
</section>
```

## Quando usar

Use `LayoutInternal` em **toda página de rota** dos perfis internos (Admin, Secretaria, Financeiro, Pedagógico). Substitui o padrão manual de `<div><h1>...</h1><p>...</p></div>` no topo da página.

## Padrões corretos

```tsx
{/* Página sem ações */}
<LayoutInternal
  title="Exportação SISTEC/MEC"
  description="Validação nacional de diplomas e registros acadêmicos."
>
  <section className="flex flex-col gap-6">
    {/* conteúdo */}
  </section>
</LayoutInternal>

{/* Página com botão de ação no cabeçalho */}
<LayoutInternal
  title="Solicitações"
  description="Gerencie os protocolos abertos pelos alunos."
  alias={
    <FormButton
      color="primary"
      label="Nova Solicitação"
      rightIcon="lucide:plus"
      onClick={openCreateModal}
    />
  }
>
  <section className="flex flex-col gap-6">
    {/* conteúdo */}
  </section>
</LayoutInternal>

{/* Página com múltiplos botões no cabeçalho */}
<LayoutInternal
  title="Cursos e Disciplinas"
  description="Gerencie a estrutura curricular e o corpo docente."
  alias={(
    <div className="flex items-center gap-4">
      <FormButton
        variant="default"
        label="Nova Disciplina"
        rightIcon="lucide:plus"
        onClick={openCreateDisciplineModal}
      />

      <FormButton
        color="primary"
        label="Novo Curso"
        rightIcon="lucide:plus"
        onClick={openCreateCourseModal}
      />
    </div>
  )}
>
  <section className="flex flex-col gap-8">
    {/* conteúdo */}
  </section>
</LayoutInternal>
```

## Notas

- O `children` direto do `LayoutInternal` herda o `gap-6` do flex container da seção raiz.
- Envolva o conteúdo em `<section className="flex flex-col gap-6">` (ou `gap-8`) para espaçar os blocos internos.
- `alias` aceita qualquer `ReactNode` — use um fragmento ou `<div>` quando houver múltiplos elementos.
