# MASTER SITE ARCHITECTURE

Документ описывает **фактическое состояние** проекта на момент аудита.  
Сайт: корпоративный сайт ООО «Век информационных технологий» (ВИТ), г. Южно-Сахалинск.

**Технологический стек:** статический HTML / CSS / JavaScript без сборки (npm, webpack отсутствуют).  
**Хостинг:** Netlify. **Формы:** Netlify Forms.

---

## 1. Общая структура проекта

```
vit-website/
│
├── index.html                  # Корневой редирект → pages/index.html
├── 404.html                    # Страница ошибки (без header/footer)
├── netlify-forms.html          # Скрытая регистрация формы для Netlify
├── netlify.toml                # Конфиг деплоя, редиректы, заголовки кэша
├── robots.txt                  # SEO (домен vit-ltd.ru)
├── sitemap.xml                 # Карта URL (24 публичные страницы)
│
├── pages/                      # Все страницы сайта (31 HTML-файл)
│   ├── index.html              # Главная
│   ├── about.html              # О компании
│   ├── services.html           # Каталог услуг
│   ├── contacts.html           # Контакты
│   ├── blog.html               # Новости (единая лента)
│   ├── cases.html              # Кейсы (скрыта из меню)
│   │
│   ├── service-*.html          # 6 страниц услуг + 2 продукта-услуги
│   ├── catalog-*.html          # 2 каталога продуктов
│   ├── product-*.html          # 2 страницы продуктов
│   ├── retail|wholesale|...    # 6 отраслевых страниц
│   │
│   └── hero-*.html             # 6 концепций Hero (не в меню)
│
├── components/                 # Переиспользуемые HTML-фрагменты (fetch)
│   ├── header.html             # Шапка + слот меню
│   ├── menu.html               # Desktop nav + mobile menu
│   ├── footer.html             # Подвал
│   └── contact-form.html       # Форма заявки (Netlify)
│
├── js/
│   ├── components.js           # Загрузка и инъекция компонентов
│   └── main.js                 # Навигация, меню, форма, анимации
│
├── css/
│   ├── main.css                # Точка входа (@import остальных)
│   ├── variables.css           # CSS-переменные (дизайн-токены)
│   ├── base.css                # Сброс, типографика
│   ├── layout.css              # Сетка, контейнер, header/footer layout
│   ├── components.css          # Кнопки, карточки, формы, nav
│   ├── pages.css               # Стили страниц (hero, industry, blog…)
│   └── hero-concepts.css       # Только для hero-a/b/c, hero-v1/v2/v3
│
├── assets/
│   ├── icons/
│   │   ├── logo.svg            # Текущий логотип + favicon
│   │   └── concepts/           # Черновики логотипов (v1, v2)
│   └── images/
│       ├── about-office.svg    # Заглушка фото офиса
│       └── hero-dashboard.svg  # Не используется на главной (mockup inline)
│
└── docs/ (корень)
    ├── PROJECT_CONTEXT.md
    ├── TODO.md
    ├── CHANGELOG.md
    ├── IDEAS.md
    └── README.md
```

### Архитектурная модель (аналог SPA-терминологии)

| Слой | Реализация в проекте |
|------|----------------------|
| **App / Entry** | `index.html` (редирект), `pages/*.html` |
| **Layout** | `#site-header` + `main.main` + `#site-footer` на каждой странице |
| **Shared Components** | `components/*.html` → загружаются через `SiteComponents.load()` |
| **Pages** | Статические HTML в `pages/` |
| **Assets** | `assets/`, `css/`, `js/` |
| **Routing** | Файловая система + `netlify.toml` redirects |
| **Forms** | `contact-form.html` + `netlify-forms.html` (build-time) |
| **SEO** | `<meta description>`, `robots.txt`, `sitemap.xml` (без Open Graph) |
| **Config** | `netlify.toml`, `data-root` / `data-pages` / `data-nav` на `<body>` |

### Механизм загрузки компонентов

1. Страница содержит пустые слоты: `#site-header`, `#site-menu` (внутри header), `#site-footer`, опционально `#site-contact-form`.
2. `js/components.js` при `DOMContentLoaded` параллельно fetch-ит `header.html`, `menu.html`, `footer.html`.
3. Токены `{{ROOT}}` и `{{PAGES}}` заменяются из `body.dataset`.
4. Desktop-навигация вставляется в `#site-menu`; `.mobile-menu` добавляется в `<body>` (вне header — из-за `backdrop-filter`).
5. Событие `components:loaded` → `js/main.js` инициализирует UI.

### Маршрутизация (Netlify)

| URL | Файл | Примечание |
|-----|------|------------|
| `/` | `pages/index.html` | rewrite status 200 |
| `/pages/*.html` | прямой доступ | основной паттерн |
| `/thanks` | `pages/contacts.html` | после отправки формы |
| `/404.html` | авто-редирект на главную через 3 сек | без layout сайта |

---

## 2. Карта всех страниц сайта (Sitemap)

### Публичные страницы (в меню)

```
Главная                          /pages/index.html
│
├── О компании                   /pages/about.html
│
├── Услуги                       /pages/services.html
│   ├── Обслуживание и сопровождение 1С    /pages/service-its.html
│   ├── Линия консультаций                 /pages/line-consulting.html
│   ├── Внедрение 1С                       /pages/service-customize.html
│   ├── Бухгалтерское обслуживание         /pages/service-1cbo.html
│   ├── Norma CS (услуга)                  /pages/norma-service.html
│   └── Сопровождение ККТ                  /pages/service-kkt.html
│
├── Продукты                     /pages/catalog-programs.html (корень раздела)
│   ├── Программы 1С             /pages/catalog-programs.html
│   │   └── 1С:Фреш              /pages/service-fresh.html  ⚠ детальная страница
│   ├── Сервисы 1С               /pages/catalog-services.html
│   │   └── 1С-Отчётность        /pages/service-otchetnost.html  ⚠ детальная страница
│   ├── Norma CS (продукт)       /pages/product-norma.html
│   └── ККТ и торговое оборудование  /pages/product-kkt.html
│
├── Отрасли                      /pages/index.html#industries (якорь на главной)
│   ├── Розничная торговля       /pages/retail.html
│   ├── Оптовая торговля         /pages/wholesale.html
│   ├── Общепит и рестораны      /pages/cafe.html
│   ├── Производство             /pages/production.html
│   ├── Строительство            /pages/construction.html
│   └── Добывающая промышленность /pages/mining.html
│
├── Новости                      /pages/blog.html
│   └── (отдельных URL статей нет — раскрытие на той же странице)
│
└── Контакты                     /pages/contacts.html
```

### Скрытые / не в меню, но доступны по URL

| Страница | URL | Как попасть |
|----------|-----|-------------|
| **Кейсы** | `/pages/cases.html` | Ссылка с `about.html`, отраслевых страниц; в sitemap |
| **Hero A/B/C** | `/pages/hero-a.html`, `hero-b.html`, `hero-c.html` | Только переключатель концепций; **нет в sitemap** |
| **Hero V1/V2/V3** | `/pages/hero-v1.html`, `hero-v2.html`, `hero-v3.html` | Только переключатель концепций; **нет в sitemap** |

### Системные / служебные

| Страница | URL | В меню | Примечание |
|----------|-----|--------|------------|
| Корневой редирект | `/index.html` | — | meta + JS redirect |
| 404 | `/404.html` | — | Минимальная страница, без компонентов |
| Netlify Forms stub | `/netlify-forms.html` | — | Скрытая форма для регистрации в Netlify |

### Отсутствующие страницы (упоминаются в контенте, но не существуют)

- Отдельные URL новостей (`/blog/article-slug`) — **не реализованы**
- Отдельные URL кейсов (`/cases/slug`) — **не реализованы** (только якоря `#case-*` на одной странице)
- Страницы отдельных программ 1С (Бухгалтерия, УТ, Розница…) — **не реализованы** (только карточки на каталоге)
- Страница 1С-ЭДО — **не реализована** (упоминается в каталоге сервисов)
- Страница «Спасибо» — редирект `/thanks` → `contacts.html`

### Страницы без входящих ссылок с других страниц сайта

| Страница | Статус |
|----------|--------|
| `hero-a/b/c.html` | Только внутренняя навигация концепций + ссылка «Сайт» → index |
| `hero-v1/v2/v3.html` | Только внутренняя навигация + «Текущий сайт» → index |
| `netlify-forms.html` | Нет ссылок (служебная) |
| `404.html` | Нет входящих (обрабатывается сервером) |

---

## 3. Архитектура каждой страницы (Page Architecture)

Общий layout для страниц с `#site-header`:

```
[Header — logo, nav, телефон, «Связаться», burger]
[Main content — секции страницы]
[Footer — 6 колонок ссылок + контакты]
[Mobile menu — overlay, дублирует nav + CTA]
```

---

### `/` → `pages/index.html` — Главная

| # | Секция | ID / класс | Содержание |
|---|--------|------------|------------|
| 1 | Hero | `.hero` | h1, описание, 2 CTA, hero-bento (4 карточки), hero-mockup (dashboard) |
| 2 | Подбор услуги | `#service-guide` | 6 интерактивных строк → услуги, CTA |
| 3 | Отрасли | `#industries` | 6 industry-card |
| 4 | Услуги | `#services` | 6 service-card, ссылка «Все услуги» |
| 5 | Продукты | `#products` | 5 карточек + inline-cta |
| 6 | Преимущества | `#why-vit` | 3 feature-card |
| 7 | Контакты (кратко) | `#contacts` | Адрес, телефоны, email, badges |
| 8 | Форма заявки | `#request-form` | Contact Form (инъекция) |
| — | Footer | injected | — |

Хлебные крошки: **нет**. Форма: **да**.

---

### `pages/about.html` — О компании

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero + breadcrumbs | h1: О компании |
| 2 | Кто мы / Направления | Кто мы, Направления деятельности |
| 3 | Статистика | Наш опыт в цифрах (анимированные счётчики) |
| 4 | Партнёрские статусы | Партнёрские статусы (3 карточки) |
| 5 | Преимущества | Почему клиенты выбирают ВИТ |
| 6 | Услуги | Основные услуги (6 ссылок) |
| 7 | Отрасли | Отраслевые решения (6 ссылок) |
| 8 | Реквизиты | Реквизиты компании |
| 9 | CTA | Готовы обсудить автоматизацию… |

Форма: **нет**.

---

### `pages/services.html` — Услуги (каталог)

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero + breadcrumbs | h1: Услуги |
| 2 | Каталог | Что мы делаем + 6 service-card |
| 3 | Разовые услуги | Разовые услуги + CTA «Заказать услугу» |
| 4 | Trust bar + CTA | Не знаете, с чего начать? |

Форма: **нет**.

---

### `pages/service-its.html` — Обслуживание и сопровождение 1С

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Вводный текст | — |
| 3 | Обновления | Обновления 1С и сопровождение |
| 4 | ИТС | 1С:ИТС |
| 5 | Поддержка | Поддержка пользователей |
| 6 | Сервисы | Подключение сервисов 1С |
| 7 | Аудитория | Для каких компаний подходит |
| 8 | Преимущества | Преимущества ИТС с ВИТ |
| 9 | CTA | Получить консультацию по сопровождению 1С |

---

### `pages/line-consulting.html` — Линия консультаций

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Описание | Что такое линия консультаций |
| 3 | CTA | Подключить линию консультаций |

---

### `pages/service-customize.html` — Внедрение 1С

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Когда нужно | Когда нужно внедрение |
| 3 | Преимущества | Преимущества внедрения с ВИТ |
| 4 | Отрасли | Для каких отраслей подходит услуга |
| 5 | CTA | Обсудим внедрение 1С |

---

### `pages/service-1cbo.html` — Бухгалтерское обслуживание

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Вводный | Что такое 1С:БухОбслуживание |
| 3 | Задачи | Какие задачи берём на себя |
| 4 | Сравнение | Почему выгоднее штатного бухгалтера |
| 5 | Процесс | Как работает облачная бухгалтерия |
| 6 | Аудитория | Для кого подходит |
| 7 | Преимущества | Преимущества ВИТ |
| 8 | CTA | Узнайте стоимость бухобслуживания |

---

### `pages/norma-service.html` — Norma CS (услуга)

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Описание | Услуги по NormaCS |
| 3 | CTA | Заказать услуги по NormaCS |

⚠ Контент **краткий** (заглушка по объёму).

---

### `pages/service-kkt.html` — Сопровождение ККТ

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Услуги и цены | Комплексная настройка…, Основные услуги и цены (таблица) |
| 3 | Преимущества | Преимущества работы с АСЦ АТОЛ |
| 4 | Отрасли | Для каких отраслей подходит услуга |
| 5 | CTA | Настроим кассу и 1С |

---

### `pages/catalog-programs.html` — Программы 1С

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1: Программы 1С:Предприятие |
| 2 | Каталог | 6 product-card (только 1С:Фреш имеет ссылку «Подробнее») |
| 3 | CTA | Подберём программу 1С |

---

### `pages/catalog-services.html` — Сервисы 1С

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Каталог | 3 service-card (Отчётность, ЭДО, ИТС) |
| 3 | CTA | Подключить сервисы 1С |

---

### `pages/service-fresh.html` — 1С:Фреш (продукт)

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 (breadcrumb: Программы 1С) |
| 2 | Описание | Когда выбирают 1С:Фреш, Что входит |
| 3 | Преимущества | Преимущества 1С:Фреш с ВИТ |
| 4 | Отрасли | Для каких отраслей подходит |
| 5 | CTA | Подберём тариф 1С:Фреш |

`data-nav="products"` (не services).

---

### `pages/service-otchetnost.html` — 1С-Отчётность (продукт/сервис)

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 (breadcrumb: Сервисы 1С) |
| 2 | Описание | Что такое 1С-Отчётность |
| 3 | Органы | Какие органы поддерживаются |
| 4 | Преимущества | Преимущества сдачи отчётности |
| 5 | Подключение | Как происходит подключение |
| 6 | ИТС | Условия по ИТС |
| 7 | FAQ | Частые вопросы |
| 8 | CTA | Подключим 1С-Отчётность |

---

### `pages/product-norma.html` — Norma CS (продукт)

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | О продукте | О продукте |
| 3 | CTA | Узнать о поставке NormaCS |

⚠ Контент **краткий**.

---

### `pages/product-kkt.html` — ККТ и торговое оборудование

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Оборудование | Оборудование для торговли |
| 3 | CTA | Подобрать кассу и оборудование |

---

### Отраслевые страницы (единый шаблон × 6)

`retail.html`, `wholesale.html`, `cafe.html`, `production.html`, `construction.html`, `mining.html`

| # | Секция | h2 (пример для retail) |
|---|--------|------------------------|
| 1 | Page Hero + breadcrumbs | h1: 1С для [отрасли] |
| 2 | Задачи | Задачи [отрасли] |
| 3 | Продукты (текст) | Рекомендуемые продукты 1С — **без ссылок на страницы** |
| 4 | Услуги (ссылки) | Услуги ВИТ для [отрасли] |
| 5 | Преимущества | Почему [отрасль] выбирает ВИТ |
| 6 | Кейсы | Похожие проекты → cases.html |
| 7 | Заявка | `#request-form` + телефон + Contact Form |

Форма: **да** на всех 6.

---

### `pages/blog.html` — Новости

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Лента | 6 статей (h2 = заголовок, toggle «Читать полностью») |
| 3 | CTA | Нужна помощь с отчётностью или 1С? |

Отдельных страниц статей **нет**.

---

### `pages/cases.html` — Кейсы (скрыта)

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Кейсы | 3 карточки: РН-СахалинНИПИмorneft, Фармация, Профнастил |
| 3 | Похожие решения | 6 similar-card |
| 4 | CTA | Хотите такой же результат? |

Якоря: `#case-rn-sakhalin`, `#case-farmacia`, `#case-profnastil`.

---

### `pages/contacts.html` — Контакты

| # | Секция | h2 |
|---|--------|-----|
| 1 | Page Hero | h1 |
| 2 | Контакты + форма | contact-info (6 полей) + Форма обратной связи |

Карта: **отсутствует**.

---

### Концепции Hero (черновики)

**hero-a/b/c.html** — варианты A, B, C:
- Переключатель концепций (фиксированная панель)
- Одна секция `.hero-mock`
- CTA: `#request-form`, `#industries` на главной
- Header/Footer: **да** (полный layout)

**hero-v1/v2/v3.html** — варианты V1, V2, V3:
- Переключатель V1/V2/V3
- Секция `.hero-concept` (minimal / photo / stats)
- Секция `.hero-cta-variants` — 3 кнопки с `href="#"` (заглушки)
- Подключает `hero-concepts.css`

---

### `404.html`

- Только h1 + ссылка на главную + auto-redirect 3 сек
- Без header, footer, формы

---

## 4. Повторно используемые компоненты

| Компонент | Файл / класс | Где используется | Где отсутствует, но логично |
|-----------|--------------|------------------|----------------------------|
| **Header** | `components/header.html` | Все страницы с `#site-header` (кроме 404, root) | 404 |
| **Desktop Nav** | `components/menu.html` `.nav` | Инъекция на все страницы с header | — |
| **Mobile Menu** | `components/menu.html` `.mobile-menu` | То же + burger в header | — |
| **Footer** | `components/footer.html` | Все страницы с header | 404 |
| **Contact Form** | `components/contact-form.html` | index, contacts, 6 industry pages | Услуги, продукты, about, blog, cases, services catalog |
| **Breadcrumbs** | `.breadcrumbs` inline | Все pages кроме index, hero-* | index (намеренно), hero-* |
| **Page Hero** | `.page-hero` | Внутренние страницы | index (использует `.hero`) |
| **CTA Block** | `.cta` | Услуги, продукты, about, blog, cases, catalogs | index (свои CTA), industry (свой шаблон) |
| **Service Card** | `.service-card` | index, services, catalogs | — |
| **Industry Card** | `.industry-card` | index | — |
| **Industry Section** | `.industry-section` | Industry pages, часть service pages | — |
| **Product Item** | `.product-item` | Industry pages, service-its | catalog-programs (использует service-card) |
| **Blog Item** | `.blog-item` | blog.html | — |
| **Trust Bar** | `.trust-bar` | services.html | Другие страницы |
| **Stats / Counter** | `.stat` + `data-count` | about.html | index (статичный bento вместо анимации) |
| **Price Table** | `.price-table` | service-kkt.html | — |
| **Related Project** | `.related-project` | Industry pages | — |
| **Similar Card** | `.similar-card` | cases.html | — |
| **Service Guide** | `.service-guide` | index only | — |
| **Inline CTA** | `.inline-cta` | index (#products) | — |
| **Hero Bento** | `.hero-bento` | index only | — |
| **Hero Mockup** | `.hero-mockup` | index only | — |
| **Toast** | `.toast` (JS-generated) | При отправке формы | — |

### Глобальные CTA (на каждой странице с header)

Из `header.html` + `menu.html`:
- Телефон: `tel:+74242300420` (desktop header, mobile icon, mobile menu)
- Кнопка «Связаться» → `contacts.html`

Из `footer.html`:
- Полная карта ссылок (компания, отрасли, услуги, продукты)
- Телефоны, email, адрес

---

## 5. Все CTA сайта

### Глобальные (Header / Mobile Menu / Footer)

| Расположение | Текст | Действие |
|--------------|-------|----------|
| Header | +7 (4242) 30-04-20 | `tel:+74242300420` |
| Header | Связаться | `contacts.html` |
| Mobile menu | +7 (4242) 30-04-20 | tel |
| Mobile menu | Связаться | `contacts.html` |
| Footer | Телефоны, email | tel / mailto |
| Footer | Все ссылки разделов | внутренние страницы |

### Главная (`index.html`)

| Секция | CTA | Цель |
|--------|-----|------|
| Hero | Получить консультацию | `#request-form` |
| Hero | Подобрать решение | `#industries` |
| Подбор услуги | 6 строк-ссылок | страницы услуг |
| Подбор услуги | Не уверены — бесплатная консультация | `#request-form` |
| Отрасли | Подробнее ×6 | industry pages |
| Услуги | Подробнее ×6, Все услуги → | service pages, services.html |
| Продукты | Ссылки на каталоги/продукты | catalog, product pages |
| Продукты | Получить консультацию | `#request-form` |
| Контакты | tel, mailto | прямые контакты |
| Форма | Отправить заявку | Netlify POST |

### О компании

| CTA | Цель |
|-----|------|
| Смотреть кейсы → | cases.html |
| Ссылки на услуги/отрасли | 12 внутренних ссылок |
| Получить консультацию | contacts.html |
| Позвонить | tel |

### Услуги (каталог)

| CTA | Цель |
|-----|------|
| Подробнее ×6 | service pages |
| Заказать услугу | contacts.html |
| Оставить заявку | contacts.html |
| Позвонить | tel |

### Страницы услуг (шаблон CTA)

Все 6 основных услуг + norma-service: финальный блок `.cta` с «Получить консультацию» / «Оставить заявку» / «Позвонить» → `contacts.html` + tel.

**service-1cbo:** дополнительно `mailto:bo@vit-ltd.ru`.

### Страницы продуктов

| Страница | CTA |
|----------|-----|
| catalog-programs | Получить консультацию, Позвонить |
| catalog-services | Оставить заявку, Позвонить |
| service-fresh | Получить консультацию, Позвонить |
| service-otchetnost | Получить консультацию, Позвонить |
| product-norma | Оставить заявку, Позвонить |
| product-kkt | Оставить заявку, Позвонить |

### Отраслевые страницы

| CTA | Цель |
|-----|------|
| Ссылки на услуги | service pages |
| Читать кейс → | cases.html#anchor |
| +7 (4242) 30-04-20 | tel |
| Написать нам | contacts.html |
| Отправить заявку | форма на странице |

### Новости

| CTA | Цель |
|-----|------|
| Читать полностью ×6 | раскрытие на месте (не навигация) |
| Получить консультацию | contacts.html |
| Позвонить | tel |

### Кейсы

| CTA | Цель |
|-----|------|
| Ссылки на отрасли/услуги | внутренние |
| Обсудить проект | contacts.html |
| Позвонить | tel |

### Контакты

| CTA | Цель |
|-----|------|
| tel ×3 | прямые звонки |
| mailto | email |
| Отправить заявку | форма |

### Hero-концепции

| CTA | Цель |
|-----|------|
| Получить консультацию | index.html#request-form |
| Подобрать решение | index.html#industries |
| Варианты кнопок (v1/v2/v3) | `href="#"` — **не рабочие** |

### Страницы без собственного CTA-блока (кроме глобальных)

- **Нет** — все контентные страницы имеют хотя бы один CTA (глобальный или локальный).

---

## 6. Карта внутренних переходов

### Основные пользовательские потоки

```
Поток 1: Заявка с главной
Главная → Hero «Получить консультацию» → #request-form → Отправить заявку

Поток 2: Через отрасль
Главная → #industries → retail.html → service-kkt.html → contacts.html
                              ↓
                         #request-form (форма на отраслевой)

Поток 3: Через подбор услуги
Главная → #service-guide → service-its.html → service-otchetnost.html → contacts.html

Поток 4: Услуги → Продукты
Меню → Услуги → service-its.html → (ссылка) → service-otchetnost.html
Меню → Продукты → catalog-services.html → service-otchetnost.html

Поток 5: Продукт → Услуга (Norma CS)
Меню → Продукты → product-norma.html ↔ norma-service.html (взаимные ссылки)
Меню → Услуги → norma-service.html → product-norma.html

Поток 6: Кейсы (скрытый раздел)
about.html → cases.html → retail.html / service-customize.html
retail.html → cases.html#case-farmacia

Поток 7: Новости
Меню → blog.html → contacts.html (CTA внизу)

Поток 8: Каталог программ
Меню → Программы 1С → catalog-programs.html → service-fresh.html → contacts.html
Главная → 1С:Фреш карточка → catalog-programs.html (⚠ не service-fresh.html)
```

### Входящие ссылки по страницам (кратко)

| Страница | Откуда попадают |
|----------|-----------------|
| index | Меню, footer, logo, breadcrumbs, 404, hero «Сайт» |
| about | Меню, footer |
| services | Меню, index, footer, breadcrumbs |
| service-* | Меню dropdown, index, services, footer, industry pages, cases |
| catalog-* | Меню, index, footer, breadcrumbs |
| service-fresh | catalog-programs, industry pages (mining, production, wholesale) |
| service-otchetnost | catalog-services, service-its, industry pages, cases |
| product-* | Меню, index, norma-service, service-kkt |
| industry-* | Меню, index, footer, service-customize, cases |
| blog | Меню, footer |
| contacts | Меню, header CTA, footer, все CTA-блоки |
| cases | about, industry pages (не меню) |
| hero-* | Только друг друга + index |

---

## 7. Анализ навигации

### Тупики (dead ends)

| Страница | Оценка |
|----------|--------|
| contacts.html | Мягкий тупик: есть форма и контакты, но нет ссылок на услуги/продукты в контенте (только header/footer) |
| catalog-programs (карточки без ссылок) | 5 из 6 программ — текст без «Подробнее» → только CTA внизу |
| catalog-services (1С-ЭДО) | Карточка без страницы и без ссылки |

### Страницы без обратных ссылок в контенте (только header/footer)

- Все страницы имеют header/footer → **навигация восстанавливается глобально**
- `hero-*` — минимальная навигация (переключатель + главная)

### Страницы, до которых сложно добраться

| Страница | Проблема |
|----------|----------|
| cases.html | Нет в меню; только about + industry pages |
| hero-a/b/c, hero-v1/v2/v3 | Нет ссылок с основного сайта |
| service-fresh.html | Нет в меню напрямую; только через каталог или отрасли |
| service-otchetnost.html | Нет в меню напрямую; через каталог сервисов |

### Лишние переходы

- Главная → 1С:Фреш → `catalog-programs.html` вместо `service-fresh.html` (дополнительный клик)
- `construction.html` → NormaCS → `about.html` вместо `product-norma.html` / `norma-service.html`

### Повторяющаяся информация

- Блоки услуг дублируются: index `#services` ≈ services.html ≈ footer
- Блоки отраслей: index `#industries` ≈ footer ≈ about «Отраслевые решения»
- CTA «Получить консультацию» + «Позвонить» — одинаковый шаблон на 15+ страницах
- Norma CS представлен дважды: услуга (`norma-service`) и продукт (`product-norma`) — **задумано**, но может путать

### Логика «Услуги» vs «Продукты»

| Элемент | Раздел в меню | Фактическая природа |
|---------|---------------|---------------------|
| Обслуживание 1С, Внедрение, ККТ… | Услуги | Услуги ✓ |
| Norma CS (norma-service) | Услуги | Услуга ✓ |
| Программы 1С, Сервисы 1С | Продукты | Каталоги ✓ |
| 1С:Фреш (service-fresh) | Продукты (breadcrumb) | Продукт, URL `service-*` ⚠ |
| 1С-Отчётность (service-otchetnost) | Продукты (breadcrumb) | Сервис, URL `service-*` ⚠ |
| Norma CS (product-norma) | Продукты | Продукт ✓ |
| ККТ оборудование (product-kkt) | Продукты | Продукт (оборудование) ✓ |

**Несогласованность:** страницы `service-fresh` и `service-otchetnost` живут в разделе «Продукты» по breadcrumb и `data-nav="products"`, но URL-префикс `service-`.

---

## 8. Компоненты главной страницы

Порядок блоков сверху вниз на `pages/index.html`:

| # | Блок | ID | Видимость |
|---|------|-----|-----------|
| 1 | **Header** (injected) | — | Всегда |
| 2 | **Hero** | — | h1 + mockup dashboard + bento stats |
| 3 | **Подбор услуги** | `#service-guide` | 6 ссылок-ситуаций |
| 4 | **Отрасли** | `#industries` | 6 карточек |
| 5 | **Услуги** | `#services` | 6 карточек |
| 6 | **Продукты** | `#products` | 5 карточек + inline CTA |
| 7 | **Почему выбирают ВИТ** | `#why-vit` | 3 карточки |
| 8 | **Контакты (кратко)** | `#contacts` | Адрес, телефоны |
| 9 | **Форма заявки** | `#request-form` | Netlify form |
| 10 | **Footer** (injected) | — | Всегда |
| 11 | **Mobile menu** (injected) | — | По burger |

### Скрытые / не вынесенные в меню блоки

- Секция **«Новости»** на главной — **отсутствует** (новости только на blog.html)
- Секция **«Кейсы»** — **отсутствует**
- Hero-концепции — отдельные страницы, не встроены в главную

### Якоря главной (внутренняя навигация)

| Якорь | Секция |
|-------|--------|
| `#service-guide` | Подбор услуги |
| `#industries` | Отрасли |
| `#services` | Услуги |
| `#products` | Продукты |
| `#why-vit` | Преимущества |
| `#contacts` | Контакты |
| `#request-form` | Форма |

---

## 9. Матрица связей

Легенда: **→** исходящие ссылки из контента страницы (без header/footer).  
**←** входящие из контента других страниц.

| Страница | ← Входящие (контент) | → Исходящие (контент) | CTA | Повторяющиеся компоненты |
|----------|----------------------|------------------------|-----|--------------------------|
| **index** | 404, hero «Сайт» | 6 services, 6 industries, catalogs, products, services.html | 8+ | hero, service-guide, industry-card, service-card, form |
| **about** | меню | cases, 6 services, 6 industries, services.html, contacts | 2 | page-hero, stats, cta |
| **services** | index, меню | 6 service pages, contacts | 3 | service-card, trust-bar, cta |
| **service-its** | везде | line-consulting, otchetnost, 4 industries, contacts | 2 | industry-section, cta |
| **line-consulting** | index, services | service-its, contacts | 2 | cta |
| **service-customize** | index, services | service-its, 6 industries, contacts | 2 | industry-section, cta |
| **service-1cbo** | index, services | otchetnost, retail, cafe, contacts, bo@ | 2 | industry-section, cta |
| **norma-service** | index, services | product-norma, construction, contacts | 2 | cta |
| **service-kkt** | index, services | product-kkt, service-its, 3 industries, contacts | 2 | price-table, cta |
| **catalog-programs** | index, меню | service-fresh, contacts | 2 | service-card, cta |
| **catalog-services** | index, меню | otchetnost, service-its, contacts | 2 | service-card, cta |
| **service-fresh** | catalog, industries | service-its, 4 industries, contacts | 2 | industry-section, cta |
| **service-otchetnost** | catalog, its, industries, cases | service-its, contacts | 2 | industry-section, FAQ, cta |
| **product-norma** | index, меню | norma-service, contacts | 2 | cta |
| **product-kkt** | index, меню | service-kkt, contacts | 2 | cta |
| **retail** | index, about, cases | 4 services, cases, contacts, form | 4 | industry-section, form |
| **wholesale** | index, about, cases | 4 services, cases, contacts, form | 4 | industry-section, form |
| **cafe** | index, about | 4 services, cases, contacts, form | 4 | industry-section, form |
| **production** | index, about | 4 services, cases, contacts, form | 4 | industry-section, form |
| **construction** | index, about, cases | 3 services, **about**⚠, cases, contacts, form | 4 | industry-section, form |
| **mining** | index, about, cases | 4 services, cases, contacts, form | 4 | industry-section, form |
| **blog** | меню | contacts | 2 | blog-item, cta |
| **cases** | about, industries | 6 industries, 5 services, contacts | 2 | similar-card, cta |
| **contacts** | все CTA | index (breadcrumb) | form | contact-form |
| **hero-a/b/c** | друг друга | index, #anchors | 2 | hero-mock |
| **hero-v1/v2/v3** | друг друга | index, #anchors, # | 2+# | hero-concept |

---

## 10. Архитектурные замечания

### Возможные проблемы

1. **Компоненты через fetch** — сайт не работает по `file://`; нужен HTTP-сервер (документировано в README).
2. **Hero на главной** содержит mockup dashboard и bento — противоречит `PROJECT_CONTEXT.md` (ожидается финальный вариант после согласования).
3. **Два файла Norma CS** (услуга + продукт) с минимальным контентом на product-norma и norma-service.
4. **Кейсы скрыты из меню**, но в sitemap — пользователь не найдёт без внутренних ссылок.
5. **Нет отдельных страниц программ 1С** — каталог частично заглушка.
6. **1С-ЭДО** в каталоге сервисов без страницы и без ссылки.
7. **Нет карты** на странице контактов.
8. **Нет Open Graph** и выделенного favicon (используется logo.svg).
9. **404** редиректит на главную — нет полноценной страницы ошибки в layout сайта.
10. **Форма на industry pages** дублируется с contacts — нет предзаполнения отрасли в select.

### Нарушения консистентности

- URL `service-*` для продуктов (fresh, otchetnost) vs `product-*` для других
- `data-nav="products"` на service-fresh/otchetnost vs `data-nav="services"` на остальных service-*
- Breadcrumb «Отрасли» ведёт на `index.html#industries`, а не на отдельную страницу-хаб
- `construction.html` ссылается на `about.html` для NormaCS
- `index.html` карточка 1С:Фреш → catalog-programs, не service-fresh
- Счётчики анимированы только на about; на главной — статичный bento

### Дублирование

- Каталоги услуг/продуктов повторяют карточки с главной
- Footer дублирует всё меню
- CTA-шаблон идентичен на большинстве внутренних страниц
- Контактные данные: index `#contacts`, contacts, footer

### Лишние страницы (в контексте продакшена)

- 6 hero-концепций — **черновики для согласования**, не для публичного трафика
- `hero-dashboard.svg` в assets — не подключён (mockup inline в HTML)

### Отсутствующие страницы

- Хаб «Отрасли» (отдельный URL)
- Детальные страницы программ 1С
- 1С-ЭДО
- Отдельные статьи новостей
- Отдельные кейсы
- Страница «Спасибо» (только redirect)

### Отсутствующие CTA

- На **catalog-programs** карточки 1С:Бухгалтерия, УТ, Розница, ЗУП, ERP — нет кнопок (только общий CTA внизу) — **потенциальная проблема конверсии**

### Отсутствующие хлебные крошки

- index.html
- hero-a/b/c, hero-v1/v2/v3

### Проблемы SEO-структуры

- sitemap не включает hero-страницы (корректно)
- sitemap включает cases (скрыты из меню)
- Домен `vit-ltd.ru` в sitemap — черновик, домен не подключён
- Нет Open Graph / Twitter Cards
- Нет `canonical` на страницах (кроме root redirect)
- Блог — одна страница без структурированных данных статей

### Проблемы UX-навигации

- Раздел «Отрасли» в меню → якорь на главной, не landing
- Кейсы труднодоступны
- Продукты 1С:Фреш / Отчётность спрятаны за каталогами
- Мобильное меню: длинный список без группировки-аккордеона (все подпункты развёрнуты)

---

## 11. Что уже реализовано

### Полностью готово

| Область | Детали |
|---------|--------|
| Каркас сайта | Layout, header, footer, mobile menu |
| Навигация | Desktop dropdown + mobile overlay |
| Главная | 8 контентных секций + форма |
| Каталог услуг | services.html + 6 детальных страниц услуг |
| Отрасли | 6 полноценных страниц с формой |
| О компании | Развёрнутая страница со статистикой |
| Новости | 6 статей с раскрытием |
| Кейсы | 3 кейса + похожие решения |
| Контакты | Реквизиты + форма |
| Формы | Netlify Forms + валидация JS |
| Адаптив | Burger menu, responsive grid |
| Деплой | netlify.toml, redirects, cache headers |
| SEO базовый | meta description, robots.txt, sitemap.xml |
| Внутренняя перелинковка | Услуги ↔ отрасли ↔ кейсы |

### Готово частично

| Область | Что есть | Чего нет |
|---------|----------|----------|
| Hero | Рабочий блок на главной | Финальный дизайн; 6 концепций ждут выбора |
| Продукты | Каталоги + 4 детальные страницы | Страницы отдельных программ; 1С-ЭДО |
| Norma CS | Услуга + продукт | Полноценный контент (краткие страницы) |
| Кейсы | Одна страница | В меню; отдельные URL кейсов |
| Новости | Лента на одной странице | Отдельные URL; блок на главной |
| Favicon | logo.svg на всех страницах | Выделенный favicon |
| SEO | description + sitemap | Open Graph, canonical, домен |
| Контакты | Текст + форма | Интерактивная карта |
| Изображения | SVG-заглушки | Реальные фото офиса/сотрудников |
| Логотип | logo.svg | Новый логотип (есть concepts в assets) |

### Заглушки

| Элемент | Тип заглушки |
|---------|--------------|
| `about-office.svg` | Placeholder изображения офиса |
| Hero mockup на главной | CSS/HTML dashboard вместо фото |
| hero-v1/v2/v3 CTA variants | `href="#"` |
| Карточки программ 1С (5 шт.) | Текст без ссылок |
| 1С-ЭДО в каталоге | Карточка без страницы |
| product-norma, norma-service | Минимальный объём текста |
| sitemap/robots домен | vit-ltd.ru (не подтверждён) |
| logo.svg как favicon | Временное решение |

### Не реализовано

| Элемент | Статус |
|---------|--------|
| Яндекс Метрика | — |
| Search Console | — |
| Собственный домен | — |
| Open Graph | — |
| Карта на контактах | — |
| WhatsApp / Telegram CTA | — (в IDEAS.md) |
| FAQ раздел | — |
| Вакансии, Акции, Вебинары | — (в IDEAS.md) |
| Личный кабинет | — |
| Страница благодарности после формы | redirect на contacts |
| `initSolutionsTabs()` контент | JS есть, HTML с `.solutions-tab` отсутствует |

---

## Приложение A: Неоднозначности

1. **service-fresh / service-otchetnost** — классифицировать как продукты или услуги? Сейчас: меню «Продукты», URL `service-*`.
2. **Norma CS** — два входа (услуга и продукт) намеренны или временны?
3. **CHANGELOG v0.4** утверждает «mockup убран» — на главной mockup **присутствует**; убран только в концепциях hero-a/b/c/v*.
4. **Кейсы в sitemap** при скрытии из меню — индексировать или нет?
5. **Страница services.html** — landing каталога или дубль главной `#services`?

---

## Приложение B: JavaScript-функции (`main.js`)

| Функция | Назначение | Где применяется |
|---------|------------|-----------------|
| `setActiveNavLink()` | Подсветка `data-nav` | Все страницы с header |
| `initHeader()` | Тень при скролле | Все с header |
| `initMobileMenu()` | Burger open/close | < 768px |
| `initSmoothScroll()` | Якоря `#` | index, hero concepts |
| `initScrollReveal()` | `.reveal` анимация | Большинство секций |
| `initSolutionsTabs()` | Табы | **Нет HTML-элементов** |
| `initContactForm()` | Валидация + Netlify POST | Страницы с формой |
| `initCounterAnimation()` | `data-count` | about.html |
| `initBlogExpand()` | Раскрытие статей | blog.html |

---

## Приложение C: Мобильная версия

| Элемент | Поведение |
|---------|-----------|
| Breakpoint burger | `max-width: 767px` (menu закрывается при `min-width: 768px`) |
| Header desktop nav | Скрыт на мобильных |
| Header phone | Иконка телефона вместо текста |
| Mobile menu | Full-screen overlay, все пункты + подпункты списком |
| Mobile menu CTA | Телефон + «Связаться» внизу |
| Таблицы | `.table-scroll` на service-kkt |
| Форма | Адаптивная через CSS grid в `.form-row` |

---

*Документ создан по результатам архитектурного аудита. Код проекта не изменялся.*
