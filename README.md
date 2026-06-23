# Сайт ООО «Век информационных технологий» (ВИТ)

Корпоративный сайт 1С:Франчайзи — статический HTML/CSS/JS без сборки.

## Структура

```
├── index.html          # редирект на pages/index.html
├── pages/              # страницы сайта
├── components/         # header, footer, menu, форма (подгружаются через fetch)
├── css/
├── js/
├── assets/
├── netlify.toml        # конфиг Netlify
├── netlify-forms.html  # регистрация формы для Netlify
├── robots.txt
└── sitemap.xml         # замените домен перед публикацией
```

## Локальный просмотр

Компоненты загружаются через `fetch`, поэтому нужен HTTP-сервер (не `file://`):

```bash
python -m http.server 8080
```

Откройте: http://localhost:8080/pages/index.html

---

## Деплой на Netlify (рекомендуется)

Netlify поддерживает формы заявок без backend.

### Шаг 1. Репозиторий на GitHub

```bash
git init
git add .
git commit -m "Initial commit: VIT website"
git branch -M main
git remote add origin https://github.com/ВАШ_АККАУНТ/vit-website.git
git push -u origin main
```

### Шаг 2. Подключение Netlify

1. Зайдите на [netlify.com](https://www.netlify.com/) → **Add new site** → **Import an existing project**
2. Выберите **GitHub** и репозиторий
3. Настройки сборки (подставятся из `netlify.toml`):
   - **Build command:** *(оставить пустым)*
   - **Publish directory:** `.`
4. Нажмите **Deploy site**

### Шаг 3. Форма заявок

После первого деплоя:

1. Netlify → **Forms** — должна появиться форма `contact`
2. **Site settings** → **Forms** → **Form notifications** → добавьте email для уведомлений
3. Проверьте отправку с главной или страницы «Контакты»

### Шаг 4. Свой домен (опционально)

1. **Domain management** → **Add domain** → `vit-ltd.ru`
2. У регистратора домена добавьте DNS-записи, которые покажет Netlify
3. Включите **HTTPS** (Let's Encrypt — автоматически)
4. Обновите URL в `robots.txt` и `sitemap.xml`

---

## Деплой на GitHub Pages

Подходит для хостинга без формы (или подключите Formspree отдельно).

### Вариант A: из корня репозитория

1. Загрузите проект на GitHub
2. **Settings** → **Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main` → папка **`/ (root)`**
5. Сохраните — сайт будет по адресу `https://ВАШ_АККАУНТ.github.io/ИМЯ_РЕПО/`

Главная: `https://ВАШ_АККАУНТ.github.io/ИМЯ_РЕПО/pages/index.html`  
Корневой `index.html` автоматически перенаправит на неё.

### Вариант B: свой домен

1. В **Pages** → **Custom domain** укажите домен
2. Добавьте файл `CNAME` в корень (Netlify создаёт его сам; для GitHub Pages):

```
vit-ltd.ru
```

3. Обновите `sitemap.xml` и `robots.txt`

### Форма на GitHub Pages

GitHub Pages не обрабатывает POST-запросы. Варианты:

- Перенести сайт на **Netlify** (форма уже настроена)
- Подключить [Formspree](https://formspree.io/) или [Getform](https://getform.io/)
- Заменить форму на ссылку `mailto:1c_vit@vit-ltd.ru`

---

## Перед публикацией

- [ ] Замените `https://vit-ltd.ru` в `sitemap.xml` и `robots.txt` на реальный домен
- [ ] Проверьте сайт локально через HTTP-сервер
- [ ] Протестируйте форму (на Netlify)
- [ ] Проверьте мобильную версию (375px)
- [ ] Зарегистируйте сайт в Яндекс.Вебмастер / Google Search Console

## Технологии

- HTML5, CSS3 (без препроцессоров)
- Vanilla JavaScript (без npm/webpack)
- Компоненты: `js/components.js` + `fetch`
