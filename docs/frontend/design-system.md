# seek.mn Design System

Энэхүү баримт бичиг нь seek.mn чадамжийн үнэлгээний платформын нэгдсэн дизайн систем, дизайн токенуудыг тодорхойлно.

## Дизайн Токенууд (Design Tokens)

Бүх дизайн токенуудыг `packages/ui/src/styles/tokens.css` файлд CSS variables хэлбэрээр тодорхойлсон бөгөөд `--seek-` гэсэн prefix ашиглана.

### 1. Өнгөний палитр (Color Palette)

- **Primitive Tokens**:
  - `--seek-blue-[50-900]`: Үндсэн хөх өнгийн спектр.
  - `--seek-neutral-[50-950]`: Төвийг сахисан (саарал, хар, цагаан) спектр.
- **Semantic Tokens**:
  - `--seek-color-background`: Аппликэйшний суурь дэвсгэр өнгө.
  - `--seek-color-foreground`: Үндсэн бичвэрийн өнгө.
  - `--seek-color-primary`: Үндсэн үйлдлийн өнгө.
  - `--seek-color-border`: Хүрээ болон шугамын өнгө.

### 2. Зай хэмжээ (Spacing)

- `--seek-space-1`: 0.25rem (4px)
- `--seek-space-2`: 0.5rem (8px)
- `--seek-space-4`: 1rem (16px)
- `--seek-space-6`: 1.5rem (24px)
- `--seek-space-8`: 2rem (32px)

### 3. Бөөрөнхийлөлт (Border Radius)

- `--seek-radius-sm`: 0.25rem (4px)
- `--seek-radius-md`: 0.375rem (6px)
- `--seek-radius-lg`: 0.5rem (8px)
- `--seek-radius-full`: 9999px
