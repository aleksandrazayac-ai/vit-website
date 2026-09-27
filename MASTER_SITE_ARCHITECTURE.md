# MASTER SITE ARCHITECTURE

Документ описывает **фактическое состояние** проекта по аудиту кода.  
Сайт: корпоративный сайт ООО «Век информационных технологий» (ВИТ), г. Южно-Сахалинск.

**Технологический стек:** статический HTML / CSS / JavaScript без сборки (npm, webpack отсутствуют).  
**Хостинг:** Netlify. **Формы:** Netlify Forms.

**Позиционирование:** ВИТ — прежде всего **1С:Франчайзи** и локальный эксперт по автоматизации бизнеса на базе 1С; ККТ, Norma CS, бухобслуживание и др. поддерживают основное направление, но не делают ВИТ «универсальной IT-компанией».

---

## 1. Общая структура проекта

```
vit-website/
│
├── index.html                  # Корневой редирект → pages/index.html
├── 404.html                    # Страница ошибки (без header/footer)
├── netlify-forms.html          # Скрытая регистрация формы для Netlify
├── netlify.toml                # Конфиг деплоя, редиректы, заголовки кэша
├── robots.txt                  # SEO (домен vit-ltd.ru, черновик)
├── sitemap.xml                 # 34 публичных URL
│
├── pages/                      # 41 HTML-файл (34 production + 6 DEV + 1 legacy redirect)
│   ├── index.html              # Главная
│   ├── about.html
│   ├── services.html
│   ├── contacts.html
│   ├── blog.html
│   ├── cases.html              # Скрыта из меню
│   │
│   ├── service-*.html          # Страницы услуг и исторические product-URL
│   ├── catalog-*.html          # Каталоги продуктов
│   ├── product-*.html          # Страницы продуктов
│   ├── *retail|wholesale|…*    # 6 отраслевых страниц
│   │
│   └── hero-*.html             # 6 DEV/CONCEPT страниц (не публичная IA)
│
├── components/
│   ├── header.html
│   ├── menu.html
│   ├── footer.html
│   └── contact-form.html
│
├── js/
│   ├── components.js           # Fetch и инъекция компонентов
│   └── main.js                 # Nav, menu, форма, анимации, blog expand
│
├── css/
│   ├── main.css                # @import + query-параметр pages.css
│   ├── variables.css
│   ├── base.css                # .container, типографика
│   ├── layout.css              # header, footer, main offset
│   ├── components.css          # кнопки, карточки, формы, nav
│   ├── pages.css               # hero главной, page-hero, industry, blog…
│   ├── page-programs.css       # только catalog-programs.html
│   └── hero-concepts.css       # только hero-a/b/c, hero-v1/v2/v3
│
├── assets/
│   ├── icons/
│   │   ├── logo.svg            # footer, favicon на страницах
│   │   ├── logo-horizontal.png # header (основной логотип)
│   │   └── concepts/           # черновики логотипов
│   └── images/
│       ├── hero-home.{avif,webp,png}
│       ├── hero-programs.{avif,webp,png}
│       ├── hero-automation.{avif,webp,png}
│       ├── hero-support.{avif,webp,png}
│       ├── hero-services.{avif,webp,png}
│       ├── hero-contacts.{avif,webp,png}
│       ├── hero-industries.{avif,webp,png}   # asset есть, в HTML не подключён
│       ├── hero-dashboard.svg                # legacy, не на главной
│       └── about-office.svg                  # заглушка
│
└── docs (корень)
    ├── MASTER_SITE_ARCHITECTURE.md
    ├── PROJECT_CONTEXT.md
    ├── TODO.md
    ├── CHANGELOG.md
    ├── IDEAS.md
    └── README.md
```

### Слои (аналог SPA)

| Слой | Реализация |
|------|------------|
| Entry | `index.html` (redirect), `pages/*.html` |
| Layout | `#site-header` + `main.main` + `#site-footer` |
| Components | `components/*.html` → `SiteComponents.load()` |
| Assets | `assets/`, `css/`, `js/` |
| Routing | Файловая система + `netlify.toml` |
| Forms | `contact-form.html` + `netlify-forms.html` |
| SEO | meta description, robots.txt, sitemap.xml |

### Загрузка компонентов

1. Слоты: `#site-header`, `#site-menu`, `#site-footer`, опционально `#site-contact-form`.
2. `components.js` fetch-ит header, menu, footer; подставляет `{{ROOT}}`, `{{PAGES}}`.
3. `.mobile-menu` добавляется в `<body>`.
4. Событие `components:loaded` → инициализация в `main.js`.

### CSS / JS зависимости

| Файл | Подключение |
|------|-------------|
| `main.css` | Почти все страницы (через `@import` → variables, base, components, layout, pages.css) |
| `page-programs.css` | Только `catalog-programs.html` (дополнительно к main.css) |
| `hero-concepts.css` | Только `hero-a/b/c.html`, `hero-v1/v2/v3.html` |
| `components.js` + `main.js` | Страницы с layout (кроме 404, root redirect) |

Текущий cache-bust CSS (пример): `pages.css?v=20260729-hero-grid` в `main.css`; на `pages/index.html` — `main.css?v=20260729-hero-grid`.

---

## 2. Карта страниц и sitemap

### Сводка

| Категория | Кол-во | Примечание |
|-----------|--------|------------|
| HTML в `pages/` | **41** | |
| Production (sitemap) | **34** | hero-concepts и `norma-service` **не** включены |
| DEV / CONCEPT | **6** | hero-a, hero-b, hero-c, hero-v1, hero-v2, hero-v3 |
| Legacy redirect | **1** | `norma-service.html` → 301 `product-norma.html` |
| Системные (корень) | 3 | index redirect, 404, netlify-forms |

### Публичная структура (меню)

```
Главная                          /pages/index.html
├── О компании                   /pages/about.html
├── Услуги                       /pages/services.html
│   ├── Обслуживание и сопровождение 1С    /pages/service-its.html
│   ├── Линия консультаций                 /pages/line-consulting.html
│   ├── Внедрение 1С                       /pages/service-customize.html
│   ├── Бухгалтерское обслуживание         /pages/service-1cbo.html
│   └── Подключение и обслуживание ККТ   /pages/service-kkt.html
├── Продукты                     /pages/catalog-programs.html
│   ├── Программы 1С             /pages/catalog-programs.html
│   │   ├── 1С:Бухгалтерия 8     /pages/product-1c-buhgalteria.html
│   │   ├── 1С:ЗУП 8             /pages/product-1c-zup.html
│   │   ├── 1С:УТ 8              /pages/product-1c-ut.html
│   │   └── 1С:Фреш              /pages/service-fresh.html
│   ├── Сервисы 1С               /pages/catalog-services.html
│   │   ├── 1С-Отчётность        /pages/service-otchetnost.html
│   │   ├── 1С-ЭДО               /pages/service-edo.html
│   │   ├── 1С-ЭПД               /pages/service-epd.html
│   │   └── 1С:КП / 1С:ИТС       /pages/service-its-package.html
│   ├── NormaCS                    /pages/product-norma.html  *(продукт + внедрение/сопровождение ВИТ)*
│   ├── ККТ и онлайн-кассы       /pages/product-kkt.html
│   └── Торговое оборудование    /pages/product-trade-equipment.html
├── Отрасли                      /pages/index.html#industries
│   └── 6 отраслевых страниц     retail, wholesale, cafe, production, construction, mining
├── Новости                      /pages/blog.html
└── Контакты                     /pages/contacts.html
```

### Публичные, но не в меню

| Страница | URL | Как попасть |
|----------|-----|-------------|
| **Сопровождение 1С (работы ВИТ)** | `service-support.html` | Хаб `service-its`; **в sitemap** |
| **Обновление 1С** | `service-update.html` | Хаб `service-its`; **в sitemap** |
| **Администрирование / техподдержка** | `service-its-admin.html` | Хаб `service-its`; **в sitemap** |
| **Тарифы сопровождения ВИТ** | `service-its-tariffs.html` | Хаб `service-its`, связанные услуги; **в sitemap** |
| **1С:КП / 1С:ИТС** | `service-its-package.html` | `catalog-services.html`; **в sitemap** |
| **1С-ЭДО** | `service-edo.html` | `catalog-services.html`; **в sitemap** |
| **1С-ЭПД** | `service-epd.html` | `catalog-services.html`; **в sitemap** |
| **1С:Фреш** | `service-fresh.html` | `catalog-programs.html`; **в sitemap** |
| **1С:Бухгалтерия 8** | `product-1c-buhgalteria.html` | `catalog-programs.html`; **в sitemap** |
| **1С:ЗУП 8** | `product-1c-zup.html` | `catalog-programs.html`; **в sitemap** |
| **1С:УТ 8** | `product-1c-ut.html` | `catalog-programs.html`; **в sitemap** |
| **1С-Отчётность** | `service-otchetnost.html` | `catalog-services.html`; **в sitemap** |
| **Кейсы** | `cases.html` | about, отрасли; **в sitemap** |

### Legacy / не в sitemap

| Страница | Статус |
|----------|--------|
| `norma-service.html` | Файл существует; **301** → `product-norma.html`; canonical на legacy-URL; **не в sitemap** |

### DEV / CONCEPT (не публичная IA)

| Страницы | Назначение |
|----------|------------|
| `hero-a.html`, `hero-b.html`, `hero-c.html` | Черновики Hero (mock + переключатель) |
| `hero-v1.html`, `hero-v2.html`, `hero-v3.html` | Черновики Hero (minimal / photo / stats) |

**Не в меню, не в sitemap.** `noindex, nofollow`. Доступ только по прямому URL.

### Отсутствующие URL (roadmap)

- Отдельные статьи новостей, отдельные кейсы по slug
- Отдельные landing-страницы конфигураций 1С (кроме 1С:Фреш)
- Хаб «Отрасли» отдельным URL
- Страница политики персональных данных

---

## 3. Раздел «Обслуживание и сопровождение 1С»

### Целевая архитектура (TO-BE)

**Хаб:** `service-its.html` — «Обслуживание и сопровождение 1С»

Отвечает на вопрос: **«Какая помощь с 1С мне нужна?»**  
**Не** является: отдельным продуктом, страницей только про 1С:ИТС или описанием одного договора.

Имя файла `service-its.html` — **историческое техническое**; целевая роль — **хаб сценариев обслуживания**.

#### Структура хаба (целевая)

| # | Сценарий | URL | Пользовательская формула |
|---|----------|-----|--------------------------|
| 1 | Линия консультаций | `line-consulting.html` | «Объясните, как правильно выполнить операцию в 1С» |
| 2 | Обновление 1С | `service-update.html` | «Мне нужно обновить 1С» |
| 3 | Сопровождение 1С | `service-support.html` | «Настройте / исправьте / доработайте систему» |
| 4 | Администрирование / техподдержка 1С | `service-its-admin.html` | «Настроить среду, в которой работает 1С» |

**1С:КП / 1С:ИТС** — **не** четвёртая услуга хаба. Продуктовая страница: `service-its-package.html` (каталог «Сервисы 1С»).

**Не считать эти сущности дублями.**

```
ХАБ «Обслуживание и сопровождение 1С» (service-its.html)
        │
        ├── Линия консультаций      → объяснить, как сделать
        ├── Обновление 1С           → обновить программу
        ├── Сопровождение 1С        → работы специалиста в базе
        └── Администрирование       → пользователи, доступы, рабочие места

ПРОДУКТЫ → Сервисы 1С
        ├── 1С:КП / 1С:ИТС          → официальный комплект поддержки (service-its-package.html)
        ├── 1С-ЭДО                  → service-edo.html
        └── 1С-ЭПД                  → service-epd.html

ОТДЕЛЬНО (не хаб):
        └── Тарифы сопровождения ВИТ → service-its-tariffs.html
```

### Фактическое состояние кода (AS-IS)

`service-its.html` — **хаб** с четырьмя карточками сценариев и decision-guide. Illustrated hero (`hero-support`).

Дочерние страницы услуг хаба: `line-consulting.html`, `service-update.html`, `service-support.html`, `service-its-admin.html` (в sitemap, не в dropdown меню).

Продукт 1С:КП/ИТС: `service-its-package.html` — вход с `catalog-services.html`, не с хаба.

### line-consulting.html — «Линия консультаций 1С»

**Самостоятельная страница.** Не смешивать с полноценными работами специалиста в базе.

- консультации по учёту и операциям в типовых программах 1С;
- для клиентов с действующим договором 1С:ИТС / в рамках линии;
- формула: **«Мне нужно объяснить, как правильно выполнить операцию в 1С»**.

---

### service-support.html — «Сопровождение 1С специалистами ВИТ»

**Отдельная страница.** Не объединять с хабом и не считать дублем ИТС.

- диагностика, исправление ошибок, настройка, доработка;
- отчёты, обмены, администрирование;
- переходы между редакциями;
- работа с изменёнными / нетиповыми конфигурациями;
- развитие системы;
- разовые и регулярные работы специалистов ВИТ.

Формула: **«Нужно, чтобы специалист сделал работу в моей системе»**.

Hero (факт): текстовый `page-hero`. В меню **нет**; в sitemap **есть**. Breadcrumb: … / Обслуживание и сопровождение 1С / Сопровождение 1С.

---

### service-update.html — «Обновление 1С»

**Отдельная страница услуги.** Не смешивать с полным сопровождением и не считать страницей 1С:КП/ИТС.

- обновление конфигурации и платформы;
- типовые и доработанные программы;
- порядок работ, связь с договором ИТС/КП;
- разграничение с сопровождением и консультациями.

Формула: **«Мне нужно обновить 1С»**.

Hero (факт): текстовый `page-hero`. В меню **нет**; в sitemap **есть**. Breadcrumb: … / Обслуживание и сопровождение 1С / Обновление 1С. CTA → `contacts.html?service=update-1c`.

---

### service-its-package.html — «1С:КП / 1С:ИТС»

**Продуктовая страница** официального комплекта поддержки 1С. **Не** хаб, **не** дочерняя услуга сопровождения.

- что такое 1С:КП / 1С:ИТС;
- состав комплекта (с оговоркой про вариант договора);
- роль партнёра ВИТ;
- разграничение с обновлением, сопровождением, линией консультаций;
- **отдельно** от коммерческих тарифов ВИТ (`service-its-tariffs.html`).

Формула: **«Мне нужен официальный комплект поддержки 1С»**.

Hero (факт): текстовый `page-hero`. Breadcrumb: Главная → Сервисы 1С → 1С:КП / 1С:ИТС. `data-nav="products"`. В sitemap **есть**. CTA → `contacts.html?service=its-package`.

---

### service-edo.html — «1С-ЭДО»

**Создана.** Продуктовая landing электронного документооборота в 1С. Breadcrumb: Главная → Сервисы 1С → 1С-ЭДО. `data-nav="products"`. В sitemap **есть**. CTA → `contacts.html?service=edo`. Связь с `service-epd.html`.

---

### service-epd.html — «1С-ЭПД»

**Создана.** Продуктовая landing электронных перевозочных документов. Breadcrumb: Главная → Сервисы 1С → 1С-ЭПД. `data-nav="products"`. В sitemap **есть**. CTA → `contacts.html?service=epd`. Визуал по ref-assets (`assets/images/products/epd/`).

---

### service-its-tariffs.html — «Тарифы сопровождения 1С»

**Создана.** Коммерческая линейка тарифов ВИТ — отдельная сущность от продукта 1С:КП/ИТС.

Breadcrumb: Главная → Услуги → Обслуживание и сопровождение 1С → Тарифы сопровождения 1С. `data-nav="services"`. В sitemap **есть**.

Группы: A (ежемесячные типовые), B (с 1С:КП ПРОФ), C (квартальные), D (нетиповые). Цены на сайте — только «от [сумма] ₽». Источник — прайс-листы заказчика. Устаревшая лестница Базовый–Проф+ **не является** полной тарифной системой.

---

### service-its-admin.html — «Администрирование и техническая поддержка 1С»

**Создана.** Четвёртый сценарий хаба. Breadcrumb: Главная → Услуги → Обслуживание и сопровождение 1С → Администрирование и техническая поддержка 1С. `data-nav="services"`. В sitemap **есть**.

Граница: техподдержка (среда, установка, перенос, сервисы) vs сопровождение (работа с системой). Разовая ставка — от 5 500 ₽/час. Источник фактов — прайс разовых услуг ВИТ от 01.01.2026.

---

### product-kkt.html — «ККТ и онлайн-кассы для бизнеса»

**Продуктовая страница** подбора ККТ / онлайн-касс / фискальной техники. **Не** сервисная страница и **не** каталог конкретных моделей.

- сценарии выбора (магазин, общепит, услуги, рабочее место с 1С);
- типы решений (онлайн-кассы, фискальные регистраторы, ККТ + периферия);
- критерии выбора; блок «ВИТ поможет подобрать»;
- split «ККТ vs торговое оборудование»; компактный service teaser → `service-kkt.html`.

**Не содержит:** цены товаров, конкретные модели без подтверждения, прайс регистрации, полный сервисный контент.

Breadcrumb: Главная → Продукты → ККТ и онлайн-кассы. `data-nav="products"`. CTA → `contacts.html?service=kkt-product`. Trust-marker: авторизованный сервисный центр АТОЛ в Южно-Сахалинске. В sitemap **есть** (URL без изменений).

**Form param:** `kkt-product` (optgroup «Продукты»).

---

### product-trade-equipment.html — «Торговое оборудование для рабочего места»

**Продуктовая страница** подбора POS, сканеров, весов, принтеров этикеток, денежных ящиков, ТСД и периферии. **Не** сервисная страница.

- сценарии рабочего места; категории оборудования; витрина реальных моделей из каталога ВИТ;
- комплектное решение; критерии выбора; VIT-band; split с `product-kkt.html`;
- service teaser → `service-kkt.html`.

Breadcrumb: Главная → Продукты → Торговое оборудование. `data-nav="products"`. CTA → `contacts.html?service=trade-equipment`. В sitemap **есть**.

**Form param:** `trade-equipment` (optgroup «Продукты»). Option `equipment` заменён.

---

### service-kkt.html — «Подключение и обслуживание ККТ и торгового оборудования»

**Единая сервисная страница** подключения и обслуживания ККТ и торгового оборудования. **Не** каталог товаров.

- регистрация и настройка ККТ, ОФД, интеграция с 1С;
- настройка POS, сканеров, принтеров, весов;
- замена ФН, технические работы;
- комплексный запуск рабочего места;
- навигационный блок «техника или услуга».

**Продуктовая граница (целевая модель):**

| Сущность | URL | Вопрос пользователя |
|----------|-----|---------------------|
| Продукт: ККТ / онлайн-кассы | `product-kkt.html` | «Какую кассу выбрать для моего бизнеса?» |
| Продукт: торговое оборудование | `product-trade-equipment.html` | «Нужно оснастить рабочее место» |
| Услуга: подключение и обслуживание | `service-kkt.html` | «Оборудование есть — помогите подключить и обслуживать» |

**Цена на странице (подтверждено):** настройка торгового оборудования — **от 5 500 ₽/час** (прайс разовых услуг ВИТ от 01.01.2026). Старые цены со старого сайта (3 500 / 4 000 / 3 450 / 7 500 ₽ и др.) **не используются**.

Breadcrumb: Главная → Услуги → Подключение и обслуживание ККТ и торгового оборудования. `data-nav="services"`. CTA → `contacts.html?service=kkt-support`. В sitemap **есть**.

---

### Граница сущностей (корректная модель)

**Не использовать:** «ИТС делает фирма 1С, а сопровождение делает ВИТ» — это грубо и некорректно.

**Правильнее:**

- **1С:КП / 1С:ИТС** — официальный продукт комплексной поддержки 1С, подключаемый через партнёра;
- в рамках конкретного договора **часть услуг партнёра ВИТ может входить** в комплект;
- **дополнительные работы** специалистов ВИТ могут выполняться **отдельно** (сопровождение, обновление, консультации — разные входы с хаба).

---

## 4. Product taxonomy и префикс `service-*`

**Правило:** имя файла `service-*` **не определяет** продуктовую категорию.

| Файл | Продуктовая категория (факт) | Меню / breadcrumb |
|------|------------------------------|-------------------|
| `service-fresh.html` | **Программы 1С** | Продукты |
| `service-otchetnost.html` | **Сервисы 1С** | Продукты |
| `service-its.html` | **Хаб услуг** «Обслуживание и сопровождение 1С» (не продукт ИТС) | Услуги |
| `service-support.html` | Услуга | Услуги (не в dropdown) |
| `service-update.html` | Услуга | Услуги (не в dropdown) |
| `service-its-package.html` | **Сервисы 1С** (продукт 1С:КП/ИТС) | Продукты |
| `service-customize.html` | Услуга | Услуги |
| … | | |

Имена — **исторические технические**; классификация — по меню, breadcrumb, `data-nav`, контенту. **Переименование URL сейчас не планируется.**

---

## 5. Hero: главная и иллюстрации

### Текущий Hero главной (`pages/index.html`)

**Не** dashboard/mockup. **Не** inline HTML mockup.

```html
<section class="hero">
  <div class="container">
    <div class="hero__grid">
      <div class="hero__content">… h1, desc, actions, hero-bento …</div>
      <div class="hero__visual">
        <picture> hero-home avif → webp → png </picture>
      </div>
    </div>
  </div>
</section>
```

| Элемент | Факт |
|---------|------|
| Сетка | `.container` (как header) + `.hero__grid`; 2 колонки с **992px** |
| Иллюстрация | `assets/images/hero-home.{avif,webp,png}`, LCP preload avif |
| Фон секции | `#fcfcfc` (слияние с фоном PNG) |
| Статистика | `.hero-bento` — 20+, 500+, 6, «Официальный партнёр 1С» |
| CTA | «Получить консультацию» → `#request-form`; «Подобрать решение» → `#industries` |

### Hero-assets по страницам

| Asset | Страница | Формат |
|-------|----------|--------|
| hero-home | index.html | picture, eager |
| hero-programs | catalog-programs.html | programs-hero, + page-programs.css |
| hero-automation | service-customize.html | page-hero--illustrated |
| hero-support | service-its.html | page-hero--illustrated |
| hero-services | services.html | page-hero--illustrated |
| hero-contacts | contacts.html | page-hero--illustrated |
| hero-industries | — | **не используется** в HTML |
| hero-dashboard.svg | — | legacy |

### Внутренние page-hero

Большинство внутренних страниц: `.page-hero` + `.container` + breadcrumbs (кроме index).  
Иллюстрированные: `service-its`, `service-customize`, `services`, `contacts`.

---

## 6. Структура главной страницы

| # | Секция | ID / класс |
|---|--------|------------|
| 1 | Header | injected |
| 2 | Hero | `.hero` → `.container` → `.hero__grid` |
| 3 | С чего начать? | `#service-guide` → `.start-guide` (4 сценария + aside) |
| 4 | Отрасли | `#industries` → `.industry-grid` |
| 5 | Услуги | `#services` |
| 6 | Продукты | `#products` |
| 7 | Почему ВИТ | `#why-vit` |
| 8 | Контакты (кратко) | `#contacts` |
| 9 | Форма | `#request-form` |
| 10 | Footer | injected |

Якоря: `#service-guide`, `#industries`, `#services`, `#products`, `#why-vit`, `#contacts`, `#request-form`.

---

## 7. Меню и Footer

### Desktop / mobile menu (`components/menu.html`)

7 пунктов верхнего уровня: Главная, О компании, Услуги (5 подпунктов), Продукты (**5** подпунктов), Отрасли (6 + якорь), Новости, Контакты.

**В dropdown «Услуги» нет:** `service-support`, `service-update`, `service-its-admin`, `service-its-tariffs`.

**В dropdown «Продукты» нет:** `service-fresh`, `service-otchetnost`, `service-edo`, `service-epd`, `service-its-package` (вход с каталогов).

### Header (`components/header.html`)

- Логотип: `logo-horizontal.png`
- Телефон, кнопка «Связаться» → contacts
- Burger → mobile-menu

### Footer (`components/footer.html`)

6 колонок: бренд, Компания, Отрасли, Услуги (5 ссылок), Продукты (**5** ссылок), Контакты.  
Копирайт 2003–2026, ИНН.

---

## 8. Компоненты и формы

| Компонент | Файл | Где |
|-----------|------|-----|
| Header / Menu / Footer | components/* | Все страницы с layout |
| Contact Form | contact-form.html | index, contacts, 6 industry |
| Breadcrumbs | inline `.breadcrumbs` | Внутренние (не index, не hero-*) |
| Page Hero | `.page-hero` | Внутренние |
| CTA block | `.cta` | Услуги, продукты, about, blog… |
| Service / Industry cards | `.service-card`, `.industry-card` | index, catalogs |
| Hero Bento | `.hero-bento` | **только index** (статистика, не dashboard) |
| Toast | JS | отправка формы |

### Форма (`contact-form.html`)

Netlify Forms: имя*, email*, телефон, select (отрасли + услуги + продукты), сообщение*.  
Honeypot `bot-field`. POST через `main.js`. Preselect: `?service=VALUE` → `option[value]` (см. таблицу).

#### Параметры `?service=` (актуально)

| Value | Label в форме | Страницы с CTA (примеры) |
|-------|---------------|--------------------------|
| `its` | Обслуживание и сопровождение 1С | `service-its.html` |
| `its-tariff` | Подобрать тариф сопровождения 1С | `service-its-tariffs.html` |
| `its-package` | 1С:КП / 1С:ИТС | `service-its-package.html` |
| `support-1c` | Сопровождение 1С | `service-support.html` |
| `1c-admin-support` | Администрирование и техническая поддержка 1С | `service-its-admin.html` |
| `update-1c` | Обновление 1С | `service-update.html` |
| `consulting` | Линия консультаций | `line-consulting.html` |
| `customize` | Внедрение 1С | *(option есть; CTA на странице **без** param — см. TODO)* |
| `1cbo` | Бухгалтерское обслуживание | *(option есть; CTA **без** param — см. TODO)* |
| `kkt-support` | Подключение и обслуживание ККТ… | `service-kkt.html` |
| `programs` | Программы 1С | `catalog-programs.html` |
| `program-buh` | 1С:Бухгалтерия 8 | `product-1c-buhgalteria.html` |
| `program-zup` | 1С:Зарплата и управление персоналом 8 | `product-1c-zup.html` |
| `program-ut` | 1С:Управление торговлей 8 | `product-1c-ut.html` |
| `1c-services` | Сервисы 1С | `catalog-services.html` |
| `norma` | Norma CS | `product-norma.html` |
| `otchetnost` | 1С-Отчётность | *(option есть; CTA **без** param — см. TODO)* |
| `edo` | 1С-ЭДО | `service-edo.html` |
| `epd` | 1С-ЭПД | `service-epd.html` |
| `fresh` | 1С:Фреш | *(option есть; CTA **без** param — см. TODO)* |
| `kkt-product` | ККТ и онлайн-кассы | `product-kkt.html` |
| `trade-equipment` | Торговое оборудование | `product-trade-equipment.html` |
| `retail` … `mining` | Отрасли | отраслевые страницы, форма на главной |
| `other` | Другое | — |

---

## 9. CTA (кратко)

**Глобальные:** tel +7 (4242) 30-04-20, «Связаться» → contacts (header, mobile menu, footer).

**Главная:** Hero CTA → `#request-form` / `#industries`; start-guide → каталоги и услуги; секции → детальные страницы; форма.

**Шаблон внутренних страниц:** `.cta` с «Получить консультацию» / «Позвонить» → contacts (часто + tel).

**service-support:** CTA → `contacts.html?service=support-1c`.

**service-update:** CTA → `contacts.html?service=update-1c`.

**line-consulting:** CTA → `contacts.html?service=consulting`.

## 10. Архитектура ключевых страниц (сокращённо)

### service-its.html (целевое состояние)

**Хаб** «Обслуживание и сопровождение 1С»: четыре **услуги** (линия, обновление, сопровождение, администрирование). 1С:КП/ИТС — продукт в каталоге «Сервисы 1С».

### service-its-package.html

Продуктовая страница 1С:КП/ИТС: состав комплекта, роль ВИТ, связи с update/support/line. Без блока устаревших тарифов ВИТ.

### service-update.html

Page hero + направления обновления, сценарии, процесс, типовая/доработанная, связь с ИТС/КП (без тарифов), compare с сопровождением, FAQ, CTA. Breadcrumb через хаб.

### service-support.html

Page hero + секции: что такое сопровождение, типичные задачи, форматы работ, связь с хабом и ИТС, FAQ, CTA. Ссылается на `service-its` (хаб), не заменяет его.

### catalog-programs.html

Отдельный **`programs-hero`** (не стандартный page-hero) + `page-programs.css` + hero-programs picture. Карточки **1С:Бухгалтерия**, **1С:ЗУП**, **1С:УТ** ведут на product landing pages; у УТ сохранена вторичная ссылка «Пример для опта» → `wholesale.html`.

### product-1c-buhgalteria.html / product-1c-zup.html / product-1c-ut.html

Единый шаблон **program-product-page** (8 секций): page-hero (текстовый), задачи, аудитория, редакции и цены лицензий 1С (`.program-license-grid`), блок ВИТ (работы отдельно от лицензии), related, FAQ, CTA. Scoped CSS в `pages.css`. **Не** подключают `page-programs.css`.

**Модель цен:** на странице — рекомендованные розничные цены фирмы «1С» (август 2026); установка/настройка/перенос — отдельно. **Требует подтверждения:** входит ли простая первичная установка в приобретение лицензии у ВИТ.

### Отраслевые ×6

Единый шаблон: page-hero, задачи, продукты (текст), услуги (ссылки), преимущества, кейсы, форма.

### DEV hero-a/b/c, hero-v1/v2/v3

Полный layout сайта + `hero-concepts.css`. Mock/концепты для согласования; **не production Hero главной**.

---

## 11. Sitemap и robots

**sitemap.xml:** **34** URL; главная `https://vit-ltd.ru/`; **без** hero-concepts и `norma-service.html` (301 → product-norma).

**robots.txt:** `Sitemap: https://vit-ltd.ru/sitemap.xml`.

**Canonical:** на **34** production HTML-страницах с layout (+ legacy `norma-service.html`); главная → `https://vit-ltd.ru/`. DEV hero — `noindex, nofollow`. **Open Graph не реализован.**

**Netlify:** `/` rewrite 200 → `pages/index.html`; `/pages/index.html` и `/index.html` → 301 → `/`; `norma-service` → 301 → `product-norma`.

---

## 12. JavaScript (`main.js`)

| Функция | Назначение |
|---------|------------|
| `setActiveNavLink()` | `data-nav` |
| `initHeader()` | тень при скролле |
| `initMobileMenu()` | burger |
| `initSmoothScroll()` | якоря |
| `initScrollReveal()` | `.reveal` |
| `initSolutionsTabs()` | **нет HTML `.solutions-tab`** |
| `initContactForm()` | Netlify POST |
| `initCounterAnimation()` | about.html |
| `initBlogExpand()` | blog.html |

---

## 13. Что реализовано / в работе

### Реализовано

- Layout, навигация, footer, mobile menu
- Главная с production Hero (hero-home) и bento-статистикой
- Хаб сопровождения 1С + 4 дочерние услуги + тарифы ВИТ + продукт 1С:КП/ИТС
- Страницы 1С-ЭДО, 1С-ЭПД, NormaCS, ККТ, торговое оборудование
- 6 услуг в меню + дочерние / продуктовые в sitemap
- 6 отраслей с формами
- Каталоги программ и сервисов 1С
- Illustrated heroes на ключевых страницах
- Netlify forms, базовый SEO (canonical, sitemap, robots)

### Частично / финальный хвост

- карточки программ без отдельных URL (landing конфигураций)
- Open Graph, страница privacy policy
- Mobile/production QA, CTA audit (gaps на fresh/otchetnost/1cbo/customize)
- Декомпозиция pages.css — **после** стабилизации

### Выполнено (SEO / deployment)

- Canonical на публичных страницах; главная `/`
- Sitemap: главная `/`
- 301 дубликатов главной; корневой index без meta/JS redirect
- DEV hero: noindex
- Cache-Control JS/assets: `max-age=3600, must-revalidate`

### Устаревшее (исправлено в документации)

- ~~Hero главной = dashboard/mockup inline~~ → **hero-home picture**
- ~~hero__container без .container~~ → **.container + .hero__grid**
- ~~«полностью сверстан сайт»~~ → стадия финальной доработки
- ~~service-its = страница договора 1С:ИТС~~ → **целевой хаб обслуживания**
- ~~service-its и service-support как дубли~~ → **разные роли в экосистеме хаба**

---

## 14. Архитектурные замечания

1. Fetch-компоненты требуют HTTP-сервера (не `file://`).
2. `service-support`, `service-update`, `line-consulting` в sitemap, но не в menu — вход с хаба `service-its`. `service-its-package` — вход с `catalog-services`.
3. `hero-industries` asset без страницы — резерв или удалить позже.
4. Кейсы в sitemap, скрыты из menu.
5. Open Graph, карта на contacts — в backlog.

---

*Документ синхронизирован с кодовой базой (август 2026). Рабочий код сайта при обновлении этого файла не изменялся.*
