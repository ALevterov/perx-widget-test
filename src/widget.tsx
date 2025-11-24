import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { HashRouter, Routes, Route } from 'react-router-dom';
import productStore from './stores/ProductStore';
import cartStore from './stores/CartStore';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Catalog from './pages/Catalog/Catalog';
import Cart from './pages/Cart/Cart';
import { WidgetConfig } from './types';
import 'antd/dist/reset.css';
import './index.scss';

class WidgetCatalog {
  private container: HTMLElement | null = null;
  private root: ReactDOM.Root | null = null;
  private config: WidgetConfig | null = null;

  constructor(config: WidgetConfig) {
    this.config = config;
  }

  run() {
    if (!this.config) {
      console.error('WidgetCatalog: config is required');
      return;
    }

    const { el, dealers } = this.config;

    // Find container
    if (typeof el === 'string') {
      // Если это селектор
      if (el.startsWith('#')) {
        // ID селектор
        this.container = document.getElementById(el.substring(1));
      } else if (el.startsWith('.')) {
        // Class селектор
        this.container = document.querySelector(el) as HTMLElement;
      } else {
        // Прямой селектор
        this.container = document.querySelector(el) as HTMLElement;
      }
    } else if (el instanceof HTMLElement) {
      // Если это DOM элемент
      this.container = el;
    }

    if (!this.container) {
      console.error(`WidgetCatalog: Container "${el}" not found`);
      return;
    }

    // Set dealer IDs (используется только для первоначальной загрузки)
    if (dealers && dealers.length > 0) {
      productStore.setDealerIds(dealers);
      // Загружаем товары выбранных дилеров при инициализации
      productStore.loadProducts().then(() => {
        cartStore.setProducts(productStore.products);
      });
    } else {
      // Если дилеры не указаны, загружаем все товары
      productStore.loadProducts().then(() => {
        cartStore.setProducts(productStore.products);
      });
    }

    // Create React root
    this.root = ReactDOM.createRoot(this.container);

    // Render widget
    this.root.render(
      <React.StrictMode>
        <ConfigProvider locale={ruRU}>
          <div style={{ width: '100%', minHeight: '100vh' }}>
            <HashRouter>
              <Header />
              <main style={{ padding: 0, margin: 0, width: '100%' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/cart" element={<Cart />} />
                </Routes>
              </main>
            </HashRouter>
          </div>
        </ConfigProvider>
      </React.StrictMode>
    );
  }

  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.container = null;
    this.config = null;
  }
}

// Export as global constructor
if (typeof window !== 'undefined') {
  (window as any).WidgetCatalog = WidgetCatalog;
}

export default WidgetCatalog;

