# Perx Catalog Widget

Виджет каталога товаров с функцией фильтрации и корзины.

## Технологии

- React 18
- TypeScript
- MobX
- Ant Design
- Webpack
- SCSS

## Установка

```bash
npm install
```

## Разработка

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Сборка

### Сборка всего проекта (для разработки)

```bash
npm run build
```

### Сборка только виджета

```bash
npm run build:widget
```

Собранный виджет будет находиться в `dist/widget-catalog.js` и `dist/widget-catalog.css`

## Использование

### Инициализация виджета

#### Пример использования

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Моя страница</title>
  <!-- Подключите CSS виджета -->
  <link rel="stylesheet" href="[ссылка_до_бандла]/widget-catalog.css" />
</head>
<body>
  <!-- Создайте контейнер для виджета -->
  <div id="widget-catalog"></div>

  <!-- React и ReactDOM из CDN (обязательно подключите перед виджетом) -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  
  <!-- JS виджета -->
  <script async src="[ссылка_до_бандла]/widget-catalog.js" onload="initWidgetCatalog()"></script>
  
  <script type="text/javascript">
    function initWidgetCatalog() {
      // Создаем экземпляр виджета
      const widget = new window.WidgetCatalog({
        el: "#widget-catalog",  // Селектор контейнера (может быть ID, класс или DOM элемент)
        dealers: [],            // Массив ID дилеров (пустой массив = все дилеры)
      });

      // Запускаем виджет
      widget.run();
    }
  </script>
</body>
</html>
```

#### Вариант 1: Загрузка товаров всех дилеров

```html
<script>
  const widget = new window.WidgetCatalog({
    el: "#widget-catalog",
    dealers: [], // Пустой массив = все дилеры
  });
  widget.run();
</script>
```

#### Вариант 2: Загрузка товаров конкретных дилеров

```html
<script>
  const widget = new window.WidgetCatalog({
    el: "#widget-catalog",
    dealers: ['0c4aab30', '86e64a33'], // ID дилеров из API
  });
  widget.run();
</script>
```

### API

```typescript
interface WidgetConfig {
  el: string | HTMLElement; // Селектор контейнера (#id, .class, selector) или DOM элемент
  dealers?: string[];       // Опциональный список ID дилеров (пустой массив = все дилеры)
}
```

### Методы виджета

```javascript
// Создание экземпляра и запуск
const widget = new window.WidgetCatalog(config);
widget.run();

// Уничтожение виджета (если нужно)
widget.destroy();
```

### Примеры селекторов

```javascript
// По ID (рекомендуется)
el: "#widget-catalog"

// По классу
el: ".my-widget-container"

// По любому селектору
el: "div[data-widget='catalog']"

// Прямая передача DOM элемента
const container = document.getElementById('widget-catalog');
el: container
```

## Функциональность

### Главная страница
- Карусель с 5 товарами с минимальной ценой от 10
- Если товаров меньше 5, отображаются любые 8 товаров
- Адаптивная карусель для разных размеров экранов

### Каталог
- Фильтрация по дилерам (множественный выбор через теги)
- Сортировка по цене (3 состояния: не активно, по возрастанию, по убыванию)
- Карточки товаров с фото, названием, ценой и дилером
- Управление количеством товаров в корзине прямо из карточки
- Сохранение параметров фильтрации в URL

### Корзина
- Список добавленных товаров с изображениями
- Управление количеством товаров (увеличение/уменьшение)
- Удаление товаров (по одному или все сразу)
- Итоговая стоимость и количество товаров
- Кнопка оформления заказа

### Шапка
- Навигация между страницами
- Счетчик товаров в корзине
- Адаптивный дизайн

## Особенности

- ✅ Сохранение состояния фильтров в URL
- ✅ Восстановление состояния после перезагрузки страницы
- ✅ Сохранение корзины в localStorage на 10 минут
- ✅ Адаптивный дизайн для всех размеров экранов
- ✅ Изолированные стили (не конфликтуют с внешними стилями)
- ✅ Мульти-добавление товаров в корзину
- ✅ Поддержка HashRouter для работы в iframe/виджете

## Структура проекта

```
perx-test/
├── src/
│   ├── components/       # React компоненты
│   │   ├── Header/       # Шапка с навигацией
│   │   └── ProductCard/  # Карточка товара
│   ├── pages/            # Страницы приложения
│   │   ├── Home/         # Главная страница
│   │   ├── Catalog/      # Каталог
│   │   └── Cart/         # Корзина
│   ├── stores/           # MobX stores
│   │   ├── ProductStore.ts
│   │   ├── CartStore.ts
│   │   └── FilterStore.ts
│   ├── utils/            # Утилиты
│   │   ├── api.ts        # API функции для работы с бэкендом
│   │   ├── localStorage.ts
│   │   └── urlParams.ts
│   ├── types/            # TypeScript типы
│   ├── App.tsx           # Главный компонент
│   ├── index.tsx         # Точка входа для разработки
│   └── widget.tsx        # Точка входа для виджета
├── public/               # Статические файлы
├── dist/                 # Собранные файлы
├── webpack.config.js     # Конфигурация Webpack
└── package.json
```

## Деплой

### GitHub Pages

1. Настройте GitHub Actions workflow (уже включен в `.github/workflows/deploy.yml`)
2. При пуше в `main` ветку автоматически соберется и задеплоится проект
3. Файл `public/_redirects` обеспечит правильную обработку маршрутов (для Netlify)
4. Для GitHub Pages может потребоваться дополнительная настройка через `404.html` (см. документацию GitHub Pages)

### Vercel

1. Подключите репозиторий к Vercel
2. Vercel автоматически определит настройки из `.vercel.json`

### Netlify

1. Подключите репозиторий к Netlify
2. Настройки автоматически определятся из `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Все маршруты будут перенаправляться на `index.html` для поддержки BrowserRouter

### Ручной деплой

```bash
npm run build
# Загрузите содержимое папки dist на ваш хостинг
```

## Разработка

### Добавление новых функций

1. Stores находятся в `src/stores/` - используйте MobX для управления состоянием
2. Компоненты в `src/components/` и `src/pages/`
3. Стили изолированы через CSS Modules (`.module.scss`)

### Тестирование виджета

1. Соберите виджет: `npm run build:widget`
2. Файлы будут созданы в `dist/`:
   - `widget-catalog.js` - JavaScript файл виджета
   - `widget-catalog.css` - CSS файл виджета
3. Откройте `public/widget-example.html` или `public/init-example.html` в браузере
4. Или используйте любой HTML файл с подключением виджета

**Важно:** Убедитесь, что React и ReactDOM подключены перед виджетом, либо используйте версии React, уже доступные на вашем сайте.

## Лицензия

MIT

