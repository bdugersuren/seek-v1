# Component Guidelines

Бүрэлдэхүүн хэсэг (Component) хөгжүүлэх болон нэрлэх журам.

## Нэршил ба Хавтасны бүтэц (Folder Convention)

- Бүх нийтлэг ашиглагдах бүрэлдэхүүн хэсгүүд нь `packages/ui/src/components` хавтас доор байрлана.
- Компонентуудыг зориулалтаар нь дараах байдлаар ангилна:
  - `layout/`: AppShell, PageContainer, ContentContainer, Card
  - `forms/`: Button, Input, Checkbox, Radio, Switch, Select
  - `feedback/`: Spinner, Skeleton, Alert, ProgressBar
  - `navigation/`: PageTitle, Breadcrumb, Tabs

## Accessibility (ARIA Rules)

- Бүх интерактив бүрэлдэхүүн хэсгүүд WAI-ARIA стандартын дагуу тохирох `role` болон `aria-` шинж чанартай байна.
- Жишээ нь: `IconButton` нь `aria-label` ашиглахыг шаардана, `Tabs` нь `role="tablist"`, `aria-selected` зэргийг зөв ашиглана.
- `FieldWrapper` нь `Label` болон `Input`-ийн холболтыг `id` болон `aria-describedby` ашиглан accessible байдлаар үүсгэнэ.

## Ref Forwarding

- Form input, button зэрэг суурь DOM element-тэй шууд харилцдаг бүрэлдэхүүн хэсгүүд `React.forwardRef` ашиглан ref-ийг forward хийнэ.
