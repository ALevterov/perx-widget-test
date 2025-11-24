/**
 * Скрипт инициализации виджета Perx Catalog Widget
 * 
 * Использование:
 * 1. Подключите React и ReactDOM из CDN или как зависимости
 * 2. Подключите собранный виджет widget.js
 * 3. Вызовите PerxCatalogWidget.init() с конфигурацией
 * 
 * Пример:
 * 
 * <div id="my-widget"></div>
 * 
 * <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
 * <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
 * <script src="./dist/widget.js"></script>
 * <script>
 *   PerxCatalogWidget.init({
 *     containerId: 'my-widget',
 *     dealerIds: [1, 2, 3] // опционально
 *   });
 * </script>
 */

if (typeof window !== 'undefined' && window.PerxCatalogWidget) {
  console.log('Perx Catalog Widget готов к использованию');
  console.log('Используйте: PerxCatalogWidget.init({ containerId: "your-container-id", dealerIds: [1,2,3] })');
} else {
  console.warn('Perx Catalog Widget не найден. Убедитесь, что widget.js загружен.');
}

