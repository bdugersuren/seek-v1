# Storybook Plan

Storybook хэрэгжүүлэх ирээдүйн төлөвлөгөө (Deferred Task).

## Зорилго

Дизайн системийн бүрэлдэхүүн хэсгүүдийг тусгаарлагдсан орчинд хөгжүүлж, баримтжуулах, visual regression тест хийх боломжийг бүрдүүлэх.

## Хэрэгжүүлэх газар (Storybook Location)

- Storybook тохиргоог monorepo дотор `packages/ui/.storybook` хавтас доор байршуулна.
- `packages/ui/src/**/*.stories.tsx` хэлбэрээр хөгжүүлнэ.

## Тохиргооны дараалал (Sprint 4 Roadmap)

1. `@storybook/react`, `@storybook/nextjs` сангуудыг суулгах.
2. `packages/ui` доторх CSS variables, tailwind холболтыг Storybook config-д нэмж өгөх.
3. storybook ажиллуулах скриптийг root `package.json`-д `storybook` нэрээр нэмэх.
