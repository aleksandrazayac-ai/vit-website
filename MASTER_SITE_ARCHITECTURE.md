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
├── sitemap.xml                 # 25 публичных URL
│
├── pages/                      # 31 HTML-файл
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
| HTML в `pages/` | **31** | |
| Публичные (sitemap) | **25** | hero-concepts **не** включены |
| DEV / CONCEPT | **6** | hero-a, hero-b, hero-c, hero-v1, hero-v2, hero-v3 |
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
│   ├── Norma CS (услуга)                  /pages/norma-service.html
│   └── Сопровождение ККТ                  /pages/service-kkt.html
├── Продукты                     /pages/catalog-programs.html
│   ├── Программы 1С             /pages/catalog-programs.html
│   │   └── 1С:Фреш              /pages/service-fresh.html
│   ├── Сервисы 1С               /pages/catalog-services.html
│   │   └── 1С-Отчётность        /pages/service-otchetnost.html
│   ├── Norma CS (продукт)       /pages/product-norma.html
│   └── ККТ и оборудование       /pages/product-kkt.html
├── Отрасли                      /pages/index.html#industries
│   └── 6 отраслевых страниц     retail, wholesale, cafe, production, construction, mining
├── Новости                      /pages/blog.html
└── Контакты                     /pages/contacts.html
```

### Публичные, но не в меню

| Страница | URL | Как попасть |
|----------|-----|-------------|
| **Сопровождение 1С (работы ВИТ)** | `service-support.html` | С `service-its`, `catalog-services`; **в sitemap** |
| **Кейсы** | `cases.html` | about, отрасли; **в sitemap** |

### DEV / CONCEPT (не публичная IA)

| Страницы | Назначение |
|----------|------------|
| `hero-a.html`, `hero-b.html`, `hero-c.html` | Черновики Hero (mock + переключатель) |
| `hero-v1.html`, `hero-v2.html`, `hero-v3.html` | Черновики Hero (minimal / photo / stats) |

**Не в меню, не в sitemap.** Доступ только по прямому URL или переключателю между концепциями. Ссылка «Сайт» / «Текущий сайт» → `index.html`.

### Отсутствующие URL (целевой roadmap)

- **«Обновление 1С»** — отдельная страница услуги (файл **ещё не создан**)
- **«1С:КП / 1С:ИТС»** — отдельная продуктовая страница официального комплекта поддержки (файл **ещё не создан**; рабочее имя TBD, например `service-its-kp.html` или в taxonomy продуктов)
- Отдельные статьи новостей, отдельные кейсы по slug
- Страницы программ 1С (кроме 1С:Фреш)
- 1С-ЭДО (упоминается в каталоге сервисов)
- Хаб «Отрасли» отдельным URL

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
| 2 | Обновление 1С | *страница TBD* | «Мне нужно обновить 1С» |
| 3 | Сопровождение 1С | `service-support.html` | «Настройте / исправьте / доработайте систему» |
| 4 | 1С:КП / 1С:ИТС | *страница TBD* | «Мне нужен официальный комплект поддержки 1С» |

**Не считать эти сущности дублями.**

```
ХАБ «Обслуживание и сопровождение 1С» (service-its.html)
        │
        ├── Линия консультаций      → объяснить, как сделать
        ├── Обновление 1С           → обновить программу
        ├── Сопровождение 1С        → работы специалиста в базе
        └── 1С:КП / 1С:ИТС          → официальный комплект поддержки
```

### Фактическое состояние кода (AS-IS)

`service-its.html` **пока** содержит контент, близкий к смешению хаба и ИТС (карточки направлений, блоки про обновления и ИТС). **Целевая роль — хаб; переработка контента/вёрстки — задача в TODO.**

Hero (факт): `page-hero--illustrated`, asset **`hero-support`**.

---

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

### Целевая страница «Обновление 1С» (файл не создан)

**Отдельная страница услуги.** В roadmap, HTML **не создавать** на этом этапе.

Целевое содержание:

- обновление типовых конфигураций;
- установка релизов и платформы;
- настройка автообновления;
- проверка совместимости;
- резервное копирование перед обновлением;
- отдельное пояснение для изменённых / доработанных конфигураций.

Формула: **«Мне нужно обновить 1С»**.

---

### Целевая страница «1С:КП / 1С:ИТС» (файл не создан)

**Отдельная продуктовая страница** официального комплекта поддержки. **Не** хаб обслуживания.

Целевое содержание:

- что такое 1С:КП / 1С:ИТС и зачем нужен договор;
- кому подходит;
- обновления, информационная система ИТС, сервисы 1С, поддержка;
- какие услуги партнёра ВИТ могут входить в комплект;
- какие дополнительные работы ВИТ выполняются отдельно;
- варианты подключения через ВИТ.

Формула: **«Мне нужен официальный комплект поддержки 1С»**.

Имя файла определить при реализации (не переименовывать `service-its.html`).

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

7 пунктов верхнего уровня: Главная, О компании, Услуги (6 подпунктов), Продукты (4), Отрасли (6 + якорь), Новости, Контакты.

**В dropdown «Услуги» нет** `service-support.html`.

### Header (`components/header.html`)

- Логотип: `logo-horizontal.png`
- Телефон, кнопка «Связаться» → contacts
- Burger → mobile-menu

### Footer (`components/footer.html`)

6 колонок: бренд, Компания, Отрасли, Услуги (6 ссылок), Продукты (4), Контакты.  
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

Netlify Forms: имя*, email*, телефон, select (отрасли + услуги incl. `support-1c`), сообщение*.  
Honeypot `bot-field`. POST через `main.js`.

---

## 9. CTA (кратко)

**Глобальные:** tel +7 (4242) 30-04-20, «Связаться» → contacts (header, mobile menu, footer).

**Главная:** Hero CTA → `#request-form` / `#industries`; start-guide → каталоги и услуги; секции → детальные страницы; форма.

**Шаблон внутренних страниц:** `.cta` с «Получить консультацию» / «Позвонить» → contacts (часто + tel).

**service-support:** CTA → `contacts.html?service=support-1c`.

---

## 10. Архитектура ключевых страниц (сокращённо)

### service-its.html (целевое состояние)

**Хаб** «Обслуживание и сопровождение 1С»: навигация к четырём сценариям (линия, обновление, сопровождение, 1С:КП/ИТС). Illustrated hero. *Фактический контент страницы ещё требует переработки под хаб.*

### service-support.html

Page hero + секции: что такое сопровождение, типичные задачи, форматы работ, связь с хабом и ИТС, FAQ, CTA. Ссылается на `service-its` (хаб), не заменяет его.

### catalog-programs.html

Отдельный **`programs-hero`** (не стандартный page-hero) + `page-programs.css` + hero-programs picture.

### Отраслевые ×6

Единый шаблон: page-hero, задачи, продукты (текст), услуги (ссылки), преимущества, кейсы, форма.

### DEV hero-a/b/c, hero-v1/v2/v3

Полный layout сайта + `hero-concepts.css`. Mock/концепты для согласования; **не production Hero главной**.

---

## 11. Sitemap и robots

**sitemap.xml:** 25 URL; главная `https://vit-ltd.ru/`; **без** hero-concepts. После добавления страниц «Обновление 1С» и «1С:КП / ИТС» — расширить sitemap.

**robots.txt:** `Sitemap: https://vit-ltd.ru/sitemap.xml`.

**Canonical:** на всех 25 публичных страницах; главная → `https://vit-ltd.ru/`. DEV hero — `noindex, nofollow`.

**Netlify:** `/` rewrite 200 → `pages/index.html`; `/pages/index.html` и `/index.html` → 301 → `/`.

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
- 7 страниц услуг (в т.ч. service-support), 6 в меню
- 6 отраслей с формами
- Каталоги и часть product/detail pages
- Illustrated heroes на ключевых страницах
- Netlify forms, базовый SEO

### Частично / финальный хвост

- **Переработка `service-its.html` в хаб** (целевая IA зафиксирована, код — нет)
- **Новые страницы:** «Обновление 1С», «1С:КП / 1С:ИТС»
- Доработка `service-support`, `line-consulting` под целевые формулы
- Norma CS, карточки программ без URL
- Open Graph, домен production
- Mobile/production QA
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
2. `service-support` в sitemap, но не в menu — вход с хаба `service-its` и каталога.
3. `hero-industries` asset без страницы — резерв или удалить позже.
4. Кейсы в sitemap, скрыты из menu.
5. Open Graph, карта на contacts — в backlog.

---

*Документ синхронизирован с кодовой базой. Рабочий код сайта при обновлении этого файла не изменялся.*
