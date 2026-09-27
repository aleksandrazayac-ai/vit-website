# История изменений

## Версия 0.8 — product landings программ 1С (август 2026)

- **`product-1c-buhgalteria.html`** — 1С:Бухгалтерия 8 (Базовая / ПРОФ / КОРП, цены лицензий август 2026).
- **`product-1c-zup.html`** — 1С:Зарплата и управление персоналом 8.
- **`product-1c-ut.html`** — 1С:Управление торговлей 8 (Базовая / ПРОФ).
- Scoped CSS `.program-product-page` в `pages.css` (карточки редакций, шаги ВИТ).
- Форма: `program-buh`, `program-zup`, `program-ut` в optgroup «Продукты».
- `catalog-programs.html`: ссылки на три product pages; у УТ сохранён «Пример для опта» → `wholesale.html`.
- **Sitemap: 31 → 34 URL.** HTML в `pages/`: 38 → 41.

---

## Версия 0.7 — синхронизация документации (август 2026)

- Аудит кодовой базы: **38 HTML** в `pages/`, **31 публичный URL** в `sitemap.xml`.
- Документация приведена к фактическому состоянию (без изменений production-файлов).

---

## Версия 0.6 — продуктовые landings ЭДО / ЭПД / KKT / торговое оборудование

- **`service-edo.html`** — полноценная страница 1С-ЭДО (hero, benefits, process, inside-1C, FAQ, form param `edo`).
- **`service-epd.html`** — полноценная страница 1С-ЭПД (законодательный блок, roles, process, inside-1C, подготовка к переходу; form param `epd`).
- **`product-kkt.html`** — продуктовая страница ККТ / онлайн-касс (form param `kkt-product`).
- **`product-trade-equipment.html`** — продуктовая страница торгового оборудования (form param `trade-equipment`).
- **`service-kkt.html`** — единая сервисная страница подключения и обслуживания (form param `kkt-support`).
- Обновлены `catalog-services.html`, menu/footer, sitemap.

---

## Версия 0.5.2 — архитектура сопровождения 1С

- **`service-its.html`** переработан в **хаб** сценариев обслуживания (не страница договора ИТС).
- Новые / доработанные дочерние услуги:
  - `service-update.html` — обновление 1С;
  - `service-support.html` — сопровождение специалистами ВИТ;
  - `service-its-admin.html` — администрирование и техподдержка;
  - `line-consulting.html` — линия консультаций.
- **`service-its-tariffs.html`** — коммерческие тарифы **ВИТ** (группы A–D, цены «от … ₽»).
- **`service-its-package.html`** — продукт **1С:КП / 1С:ИТС** (отдельно от тарифов ВИТ).
- Разведены сущности: официальный продукт 1С vs услуги партнёра vs тарифы ВИТ.

---

## Версия 0.5.1 — NormaCS и SEO/deployment

- **`product-norma.html`** — каноническая страница NormaCS.
- **`norma-service.html`** — 301 redirect → `product-norma` (`netlify.toml`).
- Canonical на публичных страницах; sitemap с главной `/`.
- DEV hero-концепты: `noindex, nofollow`.
- Cache-Control для JS/assets в Netlify.

---

## Версия 0.5

Изменена структура сайта по просьбе заказчика.

- Услуги разделены по структуре Форус.
- Добавлен раздел «Продукты».
- Перенесены: 1С:Фреш, 1С-Отчётность, Norma CS, ККТ.
- Кейсы скрыты из меню.
- Блог переименован в «Новости».

---

## Версия 0.4

Переработан Hero.

- Подготовлены концепции Hero без mockup (`hero-a`, `hero-b`, `hero-c`, `hero-v1`, `hero-v2`, `hero-v3`).
- Production Hero главной: `hero-home` (picture avif/webp/png) + `.hero-bento`.

---

## Версия 0.3

Добавлены отраслевые страницы.

- Добавлены кейсы.
- Добавлен блог.

---

## Версия 0.2

Исправлена мобильная версия.

- Исправлено меню.
- Исправлены формы.
- Исправлены CTA.

---

## Версия 0.1

Создан первый вариант сайта.

- Сверстаны основные страницы.
- Подключены формы обратной связи.
- Настроено меню и базовая навигация.
