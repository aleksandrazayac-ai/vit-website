# TODO — сайт ВИТ

Актуально после синхронизации документации с кодом (**август 2026**).  
Содержит **только незавершённые** задачи. Выполненное — в разделе **DONE**.

---

## P1 — обязательно до публикации

### Hero и визуал

- [ ] **Финальная приёмка Hero главной** с заказчиком (production: `hero-home`, `.hero-bento`; DEV-концепты не публиковать).
- [ ] **Mobile / responsive QA** на ключевых страницах: 390, 768, 1024, 1440; проверить overflow, меню, формы, product/service landings (в т.ч. `service-edo`, `service-epd`, `product-kkt`, `product-trade-equipment`).

### CTA и форма

- [ ] **CTA / navigation audit** — сверить все `contacts.html?service=…` с опциями формы (см. таблицу в `MASTER_SITE_ARCHITECTURE.md`).
- [ ] **Требует решения:** на страницах ниже CTA ведут на `contacts.html` **без** `?service=` (option в форме есть, preselect не сработает):
  - `service-fresh.html` → нужен `?service=fresh`
  - `service-otchetnost.html` → нужен `?service=otchetnost`
  - `service-1cbo.html` → нужен `?service=1cbo`
  - `service-customize.html` → нужен `?service=customize`
- [ ] **Production-проверка формы Netlify** (отправка, honeypot, `/thanks`, уведомления).

### SEO и legal

- [ ] **Финальный SEO QA:** meta description, canonical (34 URL в sitemap + legacy `norma-service`), robots, перелинковка хабов.
- [ ] **Страница политики персональных данных** / текст согласия (сейчас только фраза в форме; отдельной страницы нет).
- [ ] **Фактчек 1С-ЭПД** перед публикацией (даты обязательности, перечень документов — сверка с официальными источниками 1С / законодательством).

### Деплой

- [ ] **Netlify + домен `vit-ltd.ru`:** финальный деплой, проверка redirects (`/`, `/pages/index.html`, `norma-service` → `product-norma`).

---

## P2 — желательно до публикации

- [ ] **Open Graph** (`og:title`, `og:description`, `og:image`) — сейчас **ни на одной** странице не реализовано.
- [ ] **404.html** — проверить отображение и ссылки «на главную» на production.
- [ ] **Яндекс.Метрика / Search Console** — по решению заказчика.
- [ ] **Navigation gap audit:** страницы в sitemap, но **не в dropdown меню** — осознанное решение или добавить в меню/хаб? (`service-edo`, `service-epd`, `service-its-tariffs`, `service-support`, `service-update`, `service-its-admin`, `service-fresh`, `service-otchetnost`, `service-its-package`, `cases`).
- [ ] **Требует решения:** `norma-service.html` — файл существует, canonical есть, в sitemap **нет**, redirect 301 → `product-norma`. Подтвердить, можно ли удалить файл после grace period.

---

## P3 — после запуска / roadmap

- [ ] Отдельные landing-страницы прочих конфигураций 1С (УНФ, ERP, Розница, Документооборот и др.) — только при подтверждённом бизнес-приоритете; карточки остаются в `catalog-programs.html`.
- [ ] Отдельные URL статей новостей и кейсов (slug).
- [ ] Хаб «Отрасли» отдельным URL (сейчас якорь `#industries` на главной).
- [ ] Кейсы в меню (сейчас скрыты, но в sitemap).
- [ ] Реальные фото офиса / команды (не blocker).
- [ ] Декомпозиция `pages.css` → тематические файлы (после стабилизации контента).
- [ ] WhatsApp / Telegram, расширенный FAQ (см. `IDEAS.md`).

---

## DONE — крупные закрытые этапы

### Архитектура сопровождения 1С

- [x] **`service-its.html`** — хаб «Обслуживание и сопровождение 1С» (4 сценария + ссылка на тарифы).
- [x] **`line-consulting.html`** — линия консультаций.
- [x] **`service-update.html`** — обновление 1С.
- [x] **`service-support.html`** — сопровождение специалистами ВИТ.
- [x] **`service-its-admin.html`** — администрирование и техподдержка.
- [x] **`service-its-tariffs.html`** — тарифы сопровождения **ВИТ** (отдельно от продукта 1С:КП/ИТС).
- [x] **`service-its-package.html`** — продукт **1С:КП / 1С:ИТС** (официальный комплект фирмы «1С»).

### Продуктовые и сервисные страницы

- [x] **`service-edo.html`** — 1С-ЭДО (полноценная landing).
- [x] **`service-epd.html`** — 1С-ЭПД (полноценная landing, визуал по ref-01/ref-02).
- [x] **`product-1c-buhgalteria.html`** — продукт 1С:Бухгалтерия 8 (редакции, цены лицензий, form param `program-buh`).
- [x] **`product-1c-zup.html`** — продукт 1С:ЗУП 8 (form param `program-zup`).
- [x] **`product-1c-ut.html`** — продукт 1С:УТ 8 (form param `program-ut`).
- [x] **`product-norma.html`** — NormaCS (каноническая страница); `norma-service.html` → 301 redirect.
- [x] **`product-kkt.html`** — продукт ККТ / онлайн-кассы.
- [x] **`product-trade-equipment.html`** — продукт торговое оборудование.
- [x] **`service-kkt.html`** — услуга подключения и обслуживания ККТ и торгового оборудования.
- [x] Каталоги **`catalog-programs.html`**, **`catalog-services.html`** с актуальными ссылками (в т.ч. ЭДО, ЭПД).

### SEO / deployment

- [x] Canonical на публичных страницах; главная → `https://vit-ltd.ru/`.
- [x] **Sitemap: 34 URL** (hero-concepts и `norma-service` не включены).
- [x] 301 дубликатов главной; rewrite `/` → `pages/index.html`.
- [x] DEV hero (`hero-a/b/c`, `hero-v1/v2/v3`): `noindex, nofollow`.
- [x] Cache-Control JS/assets в `netlify.toml`.

### Документация

- [x] Синхронизация `MASTER_SITE_ARCHITECTURE.md`, `PROJECT_CONTEXT.md`, `TODO.md`, `CHANGELOG.md` с кодом (**август 2026**).

---

## Не делать без согласования

- переименование production URL;
- объединение `service-its` и `service-support`;
- удаление страниц;
- изменение дизайна / меню;
- правки production-кода в рамках задач «только документация».
